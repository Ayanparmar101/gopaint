export const GAME_ROUND_COUNT = 3;
export const GAME_ROUND_MS = 90_000;
export const GAME_REVIEW_MS = 4_000;
export const GAME_CANVAS_SIZE = 512;
export const SCORE_SAMPLE_SIZE = 96;
export const MAX_ROOM_CODE_LENGTH = 4;
export const MAX_PLAYER_NAME_LENGTH = 18;

export type RoomPhase = 'lobby' | 'preparing' | 'playing' | 'review' | 'results';

export type Point = {
  x: number;
  y: number;
};

export type CircleShape = {
  kind: 'circle';
  cx: number;
  cy: number;
  r: number;
  fill: string;
};

export type RectShape = {
  kind: 'rect';
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
};

export type PolygonShape = {
  kind: 'polygon';
  points: Point[];
  fill: string;
};

export type ShapeSpec = CircleShape | RectShape | PolygonShape;

export type ReferenceModel = {
  title: string;
  prompt: string;
  instructions: string;
  background: string;
  accent: string;
  palette: string[];
  shapes: ShapeSpec[];
  imageDataUrl?: string;
  generationModel?: string;
  generationSource?: 'openrouter' | 'fallback';
};

export type RoundDefinition = {
  id: string;
  index: number;
  seed: number;
  prompt: string;
  timeLimitMs: number;
  reference: ReferenceModel;
};

export type ScoreBreakdown = {
  fill: number;
  color: number;
  structure: number;
  speed: number;
  outside: number;
};

export type SubmissionSummary = {
  playerId: string;
  playerName: string;
  score: number;
  submittedAt: number;
  elapsedMs: number;
  breakdown: ScoreBreakdown;
};

export type RoundResult = {
  roundId: string;
  index: number;
  prompt: string;
  reference: ReferenceModel;
  submissions: SubmissionSummary[];
  winnerId: string | null;
  completedAt: number;
};

export type RoomPlayer = {
  id: string;
  name: string;
  isHost: boolean;
  joinedAt: number;
  connected: boolean;
  totalScore: number;
  latestScore: number;
  lastSubmissionRoundId: string | null;
  submittedThisRound: boolean;
};

export type ActiveRoundState = {
  roundId: string;
  index: number;
  participantIds: string[];
  startedAt: number;
  endsAt: number;
  reviewEndsAt: number | null;
};

export type RoomSnapshot = {
  code: string;
  phase: RoomPhase;
  hostId: string;
  players: RoomPlayer[];
  currentRoundIndex: number;
  totalRounds: number;
  currentRound: RoundDefinition | null;
  activeRound: ActiveRoundState | null;
  roundResults: RoundResult[];
  updatedAt: number;
};

export type CreateRoomAck = {
  room: RoomSnapshot;
  playerId: string;
};

export type JoinRoomAck = {
  room: RoomSnapshot;
  playerId: string;
};

export type SyncRoomAck = {
  room: RoomSnapshot;
  playerId: string;
};

export type SubmitAck = {
  room: RoomSnapshot;
  accepted: boolean;
  score?: number;
};

export type ClientToServerEvents = {
  createRoom: (
    payload: { name: string },
    ack: (result: CreateRoomAck | { error: string }) => void,
  ) => void;
  joinRoom: (
    payload: { code: string; name: string; playerId?: string },
    ack: (result: JoinRoomAck | { error: string }) => void,
  ) => void;
  resumeRoom: (
    payload: { code: string; playerId: string },
    ack: (result: SyncRoomAck | { error: string }) => void,
  ) => void;
  startGame: (
    payload: { code: string; playerId: string },
    ack?: (result: { ok: boolean; error?: string }) => void,
  ) => void;
  submitCanvas: (
    payload: { code: string; playerId: string; dataUrl: string; submittedAt: number },
    ack?: (result: SubmitAck | { error: string }) => void,
  ) => void;
};

export type ServerToClientEvents = {
  roomUpdated: (room: RoomSnapshot) => void;
  roomError: (message: string) => void;
};