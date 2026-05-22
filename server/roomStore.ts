import crypto from 'node:crypto';

import { GAME_REVIEW_MS, GAME_ROUND_COUNT, MAX_PLAYER_NAME_LENGTH, MAX_ROOM_CODE_LENGTH, type ActiveRoundState, type JoinRoomAck, type RoomPhase, type RoomPlayer, type RoomSnapshot, type RoundDefinition, type RoundResult, type SubmissionSummary } from '../shared/game';
import { prepareSessionRounds } from './referenceGeneration';
import { makeBlankSubmission, scoreSubmission } from './scoring';

type InternalPlayer = RoomPlayer & {
  socketIds: Set<string>;
};

type InternalRoom = {
  code: string;
  hostId: string;
  phase: RoomPhase;
  players: Map<string, InternalPlayer>;
  plannedRounds: RoundDefinition[];
  currentRoundIndex: number;
  activeRound: ActiveRoundState | null;
  roundResults: RoundResult[];
  currentSubmissions: Map<string, SubmissionSummary>;
  roundTimeout: NodeJS.Timeout | null;
  reviewTimeout: NodeJS.Timeout | null;
  seed: number;
};

const rooms = new Map<string, InternalRoom>();

function randomId(): string {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 12);
}

function randomRoomCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let value = '';

  for (let index = 0; index < MAX_ROOM_CODE_LENGTH; index += 1) {
    value += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  return value;
}

function sanitizeName(name: string): string {
  const trimmed = name.trim().replace(/\s+/g, ' ');
  if (trimmed.length === 0) {
    return 'Player';
  }

  return trimmed.slice(0, MAX_PLAYER_NAME_LENGTH);
}

function currentRoundDefinition(room: InternalRoom): RoundDefinition | null {
  if (room.currentRoundIndex <= 0 || room.currentRoundIndex > room.plannedRounds.length) {
    return null;
  }

  return room.plannedRounds[room.currentRoundIndex - 1];
}

function buildPlayerSnapshot(room: InternalRoom, player: InternalPlayer): RoomPlayer {
  const activeRoundId = room.activeRound?.roundId ?? null;
  const submittedThisRound = activeRoundId !== null && player.lastSubmissionRoundId === activeRoundId;

  return {
    id: player.id,
    name: player.name,
    isHost: player.isHost,
    joinedAt: player.joinedAt,
    connected: player.connected,
    totalScore: player.totalScore,
    latestScore: player.latestScore,
    lastSubmissionRoundId: player.lastSubmissionRoundId,
    submittedThisRound,
  };
}

function snapshotRoom(room: InternalRoom): RoomSnapshot {
  return {
    code: room.code,
    phase: room.phase,
    hostId: room.hostId,
    players: Array.from(room.players.values()).map((player) => buildPlayerSnapshot(room, player)),
    currentRoundIndex: room.currentRoundIndex,
    totalRounds: GAME_ROUND_COUNT,
    currentRound: currentRoundDefinition(room),
    activeRound: room.activeRound,
    roundResults: room.roundResults,
    updatedAt: Date.now(),
  };
}

function broadcast(room: InternalRoom, io: { to: (roomCode: string) => { emit: (event: 'roomUpdated', snapshot: RoomSnapshot) => void } }): void {
  io.to(room.code).emit('roomUpdated', snapshotRoom(room));
}

function createRoomRecord(name: string): { room: InternalRoom; playerId: string } {
  const code = randomRoomCode();
  const playerId = randomId();
  const hostName = sanitizeName(name);
  const seed = Math.floor(Math.random() * 1_000_000);

  const room: InternalRoom = {
    code,
    hostId: playerId,
    phase: 'lobby',
    players: new Map<string, InternalPlayer>([
      [playerId, {
        id: playerId,
        name: hostName,
        isHost: true,
        joinedAt: Date.now(),
        connected: true,
        totalScore: 0,
        latestScore: 0,
        lastSubmissionRoundId: null,
        submittedThisRound: false,
        socketIds: new Set(),
      }],
    ]),
    plannedRounds: [],
    currentRoundIndex: 0,
    activeRound: null,
    roundResults: [],
    currentSubmissions: new Map(),
    roundTimeout: null,
    reviewTimeout: null,
    seed,
  };

  rooms.set(code, room);
  return { room, playerId };
}

function getRoom(code: string): InternalRoom | null {
  return rooms.get(code.toUpperCase()) ?? null;
}

function findPlayer(room: InternalRoom, playerId: string): InternalPlayer | null {
  return room.players.get(playerId) ?? null;
}

function addPlayer(room: InternalRoom, playerId: string, name: string, isHost = false): InternalPlayer {
  const player: InternalPlayer = {
    id: playerId,
    name: sanitizeName(name),
    isHost,
    joinedAt: Date.now(),
    connected: true,
    totalScore: 0,
    latestScore: 0,
    lastSubmissionRoundId: null,
    submittedThisRound: false,
    socketIds: new Set(),
  };

  room.players.set(playerId, player);
  if (isHost) {
    room.hostId = playerId;
  }

  return player;
}

function resetForNewMatch(room: InternalRoom): void {
  room.phase = 'lobby';
  room.currentRoundIndex = 0;
  room.activeRound = null;
  room.roundResults = [];
  room.currentSubmissions = new Map();
  room.plannedRounds = [];

  if (room.roundTimeout) {
    clearTimeout(room.roundTimeout);
    room.roundTimeout = null;
  }

  if (room.reviewTimeout) {
    clearTimeout(room.reviewTimeout);
    room.reviewTimeout = null;
  }

  for (const player of room.players.values()) {
    player.totalScore = 0;
    player.latestScore = 0;
    player.lastSubmissionRoundId = null;
    player.submittedThisRound = false;
  }
}

function beginRound(room: InternalRoom, io: { to: (roomCode: string) => { emit: (event: 'roomUpdated', snapshot: RoomSnapshot) => void } }): void {
  const round = room.plannedRounds[room.currentRoundIndex - 1];
  if (!round) {
    room.phase = 'results';
    room.activeRound = null;
    broadcast(room, io);
    return;
  }

  room.phase = 'playing';
  room.currentSubmissions = new Map();
  room.activeRound = {
    roundId: round.id,
    index: round.index,
    participantIds: Array.from(room.players.values()).map((player) => player.id),
    startedAt: Date.now(),
    endsAt: Date.now() + round.timeLimitMs,
    reviewEndsAt: null,
  };

  for (const player of room.players.values()) {
    player.latestScore = 0;
    player.lastSubmissionRoundId = null;
    player.submittedThisRound = false;
  }

  if (room.roundTimeout) {
    clearTimeout(room.roundTimeout);
  }

  room.roundTimeout = setTimeout(() => {
    completeRound(room, io, 'time-up');
  }, round.timeLimitMs);

  broadcast(room, io);
}

function completeRound(room: InternalRoom, io: { to: (roomCode: string) => { emit: (event: 'roomUpdated', snapshot: RoomSnapshot) => void } }, _reason: 'time-up' | 'all-submitted' | 'manual'): void {
  if (!room.activeRound) {
    return;
  }

  if (room.roundTimeout) {
    clearTimeout(room.roundTimeout);
    room.roundTimeout = null;
  }

  const round = room.plannedRounds[room.currentRoundIndex - 1];
  const submissions: SubmissionSummary[] = [];

  for (const participantId of room.activeRound.participantIds) {
    const player = room.players.get(participantId);
    if (!player) {
      continue;
    }

    const submitted = room.currentSubmissions.get(participantId);
    if (submitted) {
      submissions.push(submitted);
      continue;
    }

    const blankSubmission = makeBlankSubmission(player.id, player.name);
    player.latestScore = 0;
    player.lastSubmissionRoundId = round.id;
    player.submittedThisRound = true;
    submissions.push(blankSubmission);
  }

  submissions.sort((left, right) => right.score - left.score || left.elapsedMs - right.elapsedMs);

  const winnerId = submissions[0]?.playerId ?? null;
  const roundResult: RoundResult = {
    roundId: round.id,
    index: round.index,
    prompt: round.prompt,
    reference: round.reference,
    submissions,
    winnerId,
    completedAt: Date.now(),
  };

  room.roundResults.push(roundResult);
  room.phase = room.currentRoundIndex >= GAME_ROUND_COUNT ? 'results' : 'review';
  if (room.activeRound) {
    room.activeRound.reviewEndsAt = room.phase === 'review' ? Date.now() + GAME_REVIEW_MS : null;
  }

  if (room.phase === 'review') {
    room.reviewTimeout = setTimeout(() => {
      room.reviewTimeout = null;
      room.currentRoundIndex += 1;
      beginRound(room, io);
    }, GAME_REVIEW_MS);
  } else {
    room.activeRound = room.activeRound ? { ...room.activeRound, reviewEndsAt: null } : null;
  }

  broadcast(room, io);
}

function maybeFinishEarly(room: InternalRoom, io: { to: (roomCode: string) => { emit: (event: 'roomUpdated', snapshot: RoomSnapshot) => void } }): void {
  if (!room.activeRound) {
    return;
  }

  const allParticipantsSubmitted = room.activeRound.participantIds.every((playerId) => room.currentSubmissions.has(playerId));
  if (allParticipantsSubmitted) {
    completeRound(room, io, 'all-submitted');
  }
}

export function createRoom(name: string): { room: RoomSnapshot; playerId: string } {
  const { room, playerId } = createRoomRecord(name);
  return { room: snapshotRoom(room), playerId };
}

export function joinRoom(code: string, name: string, playerId: string | undefined): JoinRoomAck | { error: string } {
  const room = getRoom(code);
  if (!room) {
    return { error: 'That room code does not exist.' };
  }

  if (playerId) {
    const existingPlayer = findPlayer(room, playerId);
    if (existingPlayer) {
      existingPlayer.connected = true;
      existingPlayer.name = sanitizeName(name || existingPlayer.name);
      return { room: snapshotRoom(room), playerId };
    }
  }

  const nextPlayerId = randomId();
  addPlayer(room, nextPlayerId, name, false);
  return { room: snapshotRoom(room), playerId: nextPlayerId };
}

export function resumeRoom(code: string, playerId: string): { room: RoomSnapshot; playerId: string } | { error: string } {
  const room = getRoom(code);
  if (!room) {
    return { error: 'That room code does not exist.' };
  }

  const player = findPlayer(room, playerId);
  if (!player) {
    return { error: 'Could not find your saved player in that room.' };
  }

  player.connected = true;
  return { room: snapshotRoom(room), playerId };
}

export function registerSocket(roomCode: string, playerId: string, socketId: string): void {
  const room = getRoom(roomCode);
  if (!room) {
    return;
  }

  const player = findPlayer(room, playerId);
  if (!player) {
    return;
  }

  player.socketIds.add(socketId);
  player.connected = true;
}

export function unregisterSocket(socketId: string): void {
  for (const room of rooms.values()) {
    for (const player of room.players.values()) {
      if (player.socketIds.delete(socketId) && player.socketIds.size === 0) {
        player.connected = false;
      }
    }
  }
}

export async function startGame(code: string, playerId: string, io: { to: (roomCode: string) => { emit: (event: 'roomUpdated', snapshot: RoomSnapshot) => void } }): Promise<{ ok: boolean; error?: string }> {
  const room = getRoom(code);
  if (!room) {
    return { ok: false, error: 'That room code does not exist.' };
  }

  if (room.hostId !== playerId) {
    return { ok: false, error: 'Only the host can start the game.' };
  }

  if (room.phase === 'preparing' || room.phase === 'playing' || room.phase === 'review') {
    return { ok: false, error: 'The current match is already running.' };
  }

  resetForNewMatch(room);
  room.phase = 'preparing';
  broadcast(room, io);

  room.plannedRounds = await prepareSessionRounds(room.seed);
  room.currentRoundIndex = 1;
  beginRound(room, io);
  return { ok: true };
}

export function submitCanvas(
  code: string,
  playerId: string,
  dataUrl: string,
  submittedAt: number,
  io: { to: (roomCode: string) => { emit: (event: 'roomUpdated', snapshot: RoomSnapshot) => void } },
): { room: RoomSnapshot; accepted: boolean; score?: number } | { accepted: false; error: string } {
  const room = getRoom(code);
  if (!room || !room.activeRound || room.phase !== 'playing') {
    return { accepted: false, error: 'No active round is running right now.' };
  }

  if (!room.activeRound.participantIds.includes(playerId)) {
    return { accepted: false, error: 'You joined after this round started, so your canvas will count next round.' };
  }

  if (room.currentSubmissions.has(playerId)) {
    return { accepted: false, error: 'You already submitted this round.' };
  }

  const player = findPlayer(room, playerId);
  const round = room.plannedRounds[room.currentRoundIndex - 1];
  if (!player || !round) {
    return { accepted: false, error: 'Could not find the current player or round.' };
  }

  const elapsedMs = Math.max(0, submittedAt - room.activeRound.startedAt);

  let result: ReturnType<typeof scoreSubmission>;
  try {
    result = scoreSubmission(round.reference, dataUrl, elapsedMs, round.timeLimitMs);
  } catch (error) {
    const message = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    console.error(`[scoring] Failed to score submission from ${player.name} (${playerId}): ${message}`);
    return { accepted: false, error: 'Could not score that canvas.' };
  }

  const summary: SubmissionSummary = {
    playerId,
    playerName: player.name,
    score: result.score,
    submittedAt,
    elapsedMs,
    breakdown: result.breakdown,
  };

  room.currentSubmissions.set(playerId, summary);
  player.totalScore += result.score;
  player.latestScore = result.score;
  player.lastSubmissionRoundId = round.id;
  player.submittedThisRound = true;

  maybeFinishEarly(room, io);
  broadcast(room, io);

  return {
    accepted: true,
    score: result.score,
    room: snapshotRoom(room),
  };
}

export function getRoomSnapshot(code: string): RoomSnapshot | null {
  const room = getRoom(code);
  return room ? snapshotRoom(room) : null;
}