import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { io, type Socket } from 'socket.io-client';

import type { ClientToServerEvents, RoomSnapshot, ServerToClientEvents } from '../shared/game';
import { describeScore } from '../shared/scoring';
import { CanvasBoard, type CanvasBoardHandle } from './components/CanvasBoard';
import { ReferencePanel } from './components/ReferencePanel';
import { Scoreboard } from './components/Scoreboard';

type LocalSession = {
  roomCode: string;
  playerId: string;
  name: string;
};

type NoticeTone = 'neutral' | 'success' | 'error';

type Notice = {
  tone: NoticeTone;
  text: string;
};

const SESSION_KEY = 'gopaint.session.v1';

function normalizeCode(input: string): string {
  return input.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
}

function loadSession(): LocalSession | null {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<LocalSession>;
    if (typeof parsed.roomCode === 'string' && typeof parsed.playerId === 'string' && typeof parsed.name === 'string') {
      return {
        roomCode: normalizeCode(parsed.roomCode),
        playerId: parsed.playerId,
        name: parsed.name,
      };
    }
  } catch {
    return null;
  }

  return null;
}

function saveSession(session: LocalSession): void {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function formatClock(ms: number | null | undefined): string {
  if (typeof ms !== 'number' || Number.isNaN(ms) || ms <= 0) {
    return '0:00';
  }

  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function formatPhase(phase: RoomSnapshot['phase']): string {
  if (phase === 'lobby') {
    return 'Lobby';
  }

  if (phase === 'preparing') {
    return 'Preparing';
  }

  if (phase === 'playing') {
    return 'Drawing';
  }

  if (phase === 'review') {
    return 'Review';
  }

  return 'Results';
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState<LocalSession | null>(() => loadSession());
  const [room, setRoom] = useState<RoomSnapshot | null>(null);
  const [connectionState, setConnectionState] = useState<'connecting' | 'online' | 'offline'>('connecting');
  const [notice, setNotice] = useState<Notice | null>(null);
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const canvasRef = useRef<CanvasBoardHandle | null>(null);
  const lastRoundIdRef = useRef<string | null>(null);
  const sessionRef = useRef<LocalSession | null>(session);
  const roomCodeParam = location.pathname.startsWith('/room/') ? normalizeCode(location.pathname.split('/')[2] ?? '') : '';

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  useEffect(() => {
    const serverUrl = import.meta.env.VITE_SERVER_URL || '';
    const socket = io(serverUrl || '/', { path: '/socket.io' });
    socketRef.current = socket;

    const handleConnect = () => {
      setConnectionState('online');
      const savedSession = sessionRef.current;
      if (savedSession) {
        socket.emit('resumeRoom', { code: savedSession.roomCode, playerId: savedSession.playerId }, (result: { room: RoomSnapshot; playerId: string } | { error: string }) => {
          if ('error' in result) {
            setNotice({ tone: 'error', text: result.error });
            setRoom(null);
            setSession(null);
            window.localStorage.removeItem(SESSION_KEY);
            return;
          }

          setRoom(result.room);
          if (window.location.pathname === '/') {
            navigate(`/room/${result.room.code}`, { replace: true });
          }
        });
      }
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', () => {
      setConnectionState('offline');
    });
    socket.on('roomUpdated', (snapshot) => {
      setRoom(snapshot);
      setNotice((current) => (current?.tone === 'success' ? null : current));

      if (window.location.pathname === '/' && snapshot.code) {
        navigate(`/room/${snapshot.code}`, { replace: true });
      }
    });
    socket.on('roomError', (message) => {
      setNotice({ tone: 'error', text: message });
    });

    return () => {
      socket.off('connect', handleConnect);
      socket.removeAllListeners();
      socket.close();
      socketRef.current = null;
    };
  }, [navigate]);

  useEffect(() => {
    if (room?.code && location.pathname === '/') {
      navigate(`/room/${room.code}`, { replace: true });
    }
  }, [location.pathname, navigate, room?.code]);

  useEffect(() => {
    const activeRound = room?.activeRound;
    const currentRoundId = activeRound?.roundId ?? null;
    if (room?.phase === 'playing' && activeRound && currentRoundId && currentRoundId !== lastRoundIdRef.current) {
      canvasRef.current?.clear();
      lastRoundIdRef.current = currentRoundId;
      setNotice({ tone: 'neutral', text: `Round ${activeRound.index} started. Paint fast.` });
    }
  }, [room?.activeRound?.roundId, room?.activeRound?.index, room?.phase]);

  const currentPlayer = useMemo(() => {
    if (!room || !session) {
      return null;
    }

    return room.players.find((player) => player.id === session.playerId) ?? null;
  }, [room, session]);

  const currentPlayerInRound = Boolean(room?.activeRound?.participantIds.includes(session?.playerId ?? ''));
  const currentRound = room?.currentRound ?? null;

  function persistSession(nextSession: LocalSession): void {
    setSession(nextSession);
    saveSession(nextSession);
  }

  function showNotice(tone: NoticeTone, text: string): void {
    setNotice({ tone, text });
  }

  function joinRoom(codeInput: string, nameInput: string): void {
    const socket = socketRef.current;
    if (!socket) {
      showNotice('error', 'The game server is still connecting.');
      return;
    }

    const code = normalizeCode(codeInput);
    const name = nameInput.trim();
    if (code.length !== 4) {
      showNotice('error', 'Room codes are four characters long.');
      return;
    }

    if (name.length === 0) {
      showNotice('error', 'Enter a player name first.');
      return;
    }

    socket.emit('joinRoom', { code, name, playerId: sessionRef.current?.playerId }, (result) => {
      if ('error' in result) {
        showNotice('error', result.error);
        return;
      }

      persistSession({ roomCode: result.room.code, playerId: result.playerId, name });
      setRoom(result.room);
      showNotice('success', `Joined room ${result.room.code}.`);
      navigate(`/room/${result.room.code}`);
    });
  }

  function enterRoom(codeInput: string, nameInput: string): void {
    const code = normalizeCode(codeInput);
    if (code.length === 0) {
      createRoom(nameInput);
      return;
    }

    joinRoom(code, nameInput);
  }

  function createRoom(nameInput: string): void {
    const socket = socketRef.current;
    if (!socket) {
      showNotice('error', 'The game server is still connecting.');
      return;
    }

    const name = nameInput.trim();
    if (name.length === 0) {
      showNotice('error', 'Enter a host name first.');
      return;
    }

    socket.emit('createRoom', { name }, (result) => {
      if ('error' in result) {
        showNotice('error', result.error);
        return;
      }

      persistSession({ roomCode: result.room.code, playerId: result.playerId, name });
      setRoom(result.room);
      showNotice('success', `Room ${result.room.code} is ready.`);
      navigate(`/room/${result.room.code}`);
    });
  }

  function startMatch(): void {
    const socket = socketRef.current;
    if (!socket || !room || !session) {
      return;
    }

    socket.emit('startGame', { code: room.code, playerId: session.playerId }, (result) => {
      if (!result.ok) {
        showNotice('error', result.error ?? 'Could not start the match.');
        return;
      }

      showNotice('success', 'Match started.');
    });
  }

  function submitPainting(): void {
    const socket = socketRef.current;
    if (!socket || !room || !session) {
      return;
    }

    const canvasDataUrl = canvasRef.current?.exportImage();
    if (!canvasDataUrl) {
      showNotice('error', 'Could not read the canvas.');
      return;
    }

    socket.emit(
      'submitCanvas',
      {
        code: room.code,
        playerId: session.playerId,
        dataUrl: canvasDataUrl,
        submittedAt: Date.now(),
      },
      (result) => {
        if ('error' in result) {
          showNotice('error', result.error);
          return;
        }

        if (!result.accepted) {
          showNotice('error', 'Your canvas was not accepted.');
          return;
        }

        const score = result.score ?? 0;
        showNotice('success', `Submitted. ${describeScore(score)} for ${score}/100.`);
      },
    );
  }

  function copyRoomCode(): void {
    if (!room) {
      return;
    }

    void navigator.clipboard.writeText(room.code)
      .then(() => {
        showNotice('success', 'Room code copied.');
      })
      .catch(() => {
        showNotice('error', 'Could not copy the room code.');
      });
  }

  const accessCode = roomCodeParam ? normalizeCode(roomCodeParam) : '';
  const waitingForSavedRoom = Boolean(roomCodeParam && session?.roomCode === roomCodeParam && !room);
  const roomMissing = Boolean(roomCodeParam) && !waitingForSavedRoom && (!room || room.code !== roomCodeParam);

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar panel">
        <div className="brand-lockup">
          <span className="brand-mark material-symbols-outlined" aria-hidden="true">palette</span>
          <div>
            <p className="eyebrow">GoPaint</p>
            <h1>Paint, match, and race the room.</h1>
          </div>
        </div>

        <div className="topbar-meta">
          <span className={`status-chip ${connectionState === 'online' ? 'active' : 'muted'}`}>
            {connectionState === 'online' ? 'Online' : connectionState === 'connecting' ? 'Connecting' : 'Offline'}
          </span>
          {room ? <span className="status-chip subtle">Room {room.code}</span> : null}
          {session ? <span className="status-chip subtle">Saved: {session.roomCode}</span> : null}
        </div>

        <div className="topbar-actions" aria-label="Quick actions">
          <button type="button" className="icon-button" aria-label="Players">
            <span className="material-symbols-outlined">group</span>
          </button>
          <button type="button" className="icon-button hidden-on-mobile" aria-label="Room code">
            <span className="material-symbols-outlined">qr_code_2</span>
          </button>
          <button type="button" className="icon-button" aria-label="Settings">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
      </header>

      {notice ? <NoticeBanner notice={notice} onDismiss={() => setNotice(null)} /> : null}

      <Routes>
        <Route path="/" element={<LandingPage session={session} onEnterRoom={enterRoom} onResumeRoom={() => session && navigate(`/room/${session.roomCode}`)} connectionState={connectionState} />} />
        <Route
          path="/room/:code"
          element={
            waitingForSavedRoom ? (
              <LoadingStage connectionState={connectionState} />
            ) : room?.phase === 'preparing' ? (
              <LoadingStage
                connectionState={connectionState}
                title="Generating paintings"
                message="We are creating simple kid-friendly reference pictures for this room."
              />
            ) : roomMissing ? (
              <JoinGate
                initialCode={accessCode}
                initialName={session?.name ?? ''}
                onJoinRoom={joinRoom}
                connectionState={connectionState}
                session={session}
              />
            ) : room ? (
              <RoomStage
                room={room}
                currentPlayer={currentPlayer}
                currentPlayerInRound={currentPlayerInRound}
                currentRound={currentRound}
                canvasRef={canvasRef}
                onSubmitPainting={submitPainting}
                onStartMatch={startMatch}
                onExitToLobby={() => navigate('/')}
                onCopyRoomCode={copyRoomCode}
                session={session}
              />
            ) : (
              <LoadingStage connectionState={connectionState} />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function NoticeBanner({ notice, onDismiss }: { notice: Notice; onDismiss: () => void }) {
  return (
    <div className={`notice-banner ${notice.tone}`}>
      <span>{notice.text}</span>
      <button type="button" className="button ghost" onClick={onDismiss}>
        Close
      </button>
    </div>
  );
}

function LandingPage({
  session,
  onEnterRoom,
  onResumeRoom,
  connectionState,
}: {
  session: LocalSession | null;
  onEnterRoom: (code: string, name: string) => void;
  onResumeRoom: () => void;
  connectionState: 'connecting' | 'online' | 'offline';
}) {
  const [hostName, setHostName] = useState(session?.name ?? 'Blue Otter');
  const [joinName, setJoinName] = useState(session?.name ?? 'Blue Otter');
  const [joinCode, setJoinCode] = useState(session?.roomCode ?? '');

  useEffect(() => {
    if (session) {
      setHostName(session.name);
      setJoinName(session.name);
      setJoinCode(session.roomCode);
    }
  }, [session]);

  return (
    <main className="landing-grid">
      <section className="panel join-card">
        <div className="panel-header join-header">
          <div>
            <p className="eyebrow">Join a room</p>
            <h2>Ready to Paint?</h2>
          </div>
          <span className={`status-chip ${connectionState === 'online' ? 'active' : 'muted'}`}>
            {connectionState === 'online' ? 'Connected' : 'Starting up'}
          </span>
        </div>

        <p className="hero-copy">
          Enter your artist name and a room code if you have one. Leave the code blank to create a fresh private room.
        </p>

        <form
          className="join-form-card"
          onSubmit={(event) => {
            event.preventDefault();
            onEnterRoom(joinCode, hostName || joinName);
          }}
        >
          <label className="field compact">
            <span>Your Artist Name</span>
            <div className="input-shell">
              <span className="input-icon material-symbols-outlined">brush</span>
              <input value={hostName} onChange={(event) => setHostName(event.target.value)} placeholder="Enter your name" maxLength={18} />
            </div>
          </label>

          <label className="field compact">
            <span>Room Code (Optional)</span>
            <div className="input-shell">
              <span className="input-icon material-symbols-outlined">qr_code_2</span>
              <input value={joinCode} onChange={(event) => setJoinCode(normalizeCode(event.target.value))} placeholder="e.g. ART1" maxLength={4} />
            </div>
          </label>

          <button type="submit" className="button primary bubbly-button full-width join-cta">
            JOIN GAME
            <span className="material-symbols-outlined">play_arrow</span>
          </button>
        </form>

        <div className="landing-actions">
          <button type="button" className="button secondary bubbly-button full-width" onClick={onResumeRoom} disabled={!session}>
            Resume room
          </button>
          {session ? <p className="muted-copy">Saved session: {session.roomCode}</p> : <p className="muted-copy">No saved room yet.</p>}
        </div>
      </section>

      <section className="panel lobby-card">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Friends in Lobby</p>
            <h2>Waiting for the host</h2>
          </div>
          <span className="status-chip subtle">Invite</span>
        </div>

        <div className="avatar-grid">
          {['Leo', 'Mia', 'Sam', 'Invite'].map((name, index) => (
            <div key={name} className="avatar-stack">
              <div className={`avatar-circle avatar-${index % 4}`}>
                <span>{name === 'Invite' ? '+' : name.slice(0, 2).toUpperCase()}</span>
              </div>
              <span className="avatar-name">{name}</span>
            </div>
          ))}
        </div>

        <div className="lobby-note">
          <span className="material-symbols-outlined icon-fill">info</span>
          <p>Waiting for host to start the game. Grab your brushes!</p>
        </div>

        <div className="session-cta">
          <button type="button" className="button ghost full-width" onClick={onResumeRoom} disabled={!session}>
            Jump back in
          </button>
        </div>
      </section>
    </main>
  );
}

function JoinGate({
  initialCode,
  initialName,
  onJoinRoom,
  connectionState,
  session,
}: {
  initialCode: string;
  initialName: string;
  onJoinRoom: (code: string, name: string) => void;
  connectionState: 'connecting' | 'online' | 'offline';
  session: LocalSession | null;
}) {
  const [code, setCode] = useState((initialCode || session?.roomCode) ?? '');
  const [name, setName] = useState((initialName || session?.name) ?? 'Blue Otter');

  useEffect(() => {
    setCode((initialCode || session?.roomCode) ?? '');
    setName((initialName || session?.name) ?? 'Blue Otter');
  }, [initialCode, initialName, session]);

  return (
    <main className="room-access">
      <section className="panel access-card">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Join room</p>
            <h2>Enter the code to keep going</h2>
          </div>
          <span className={`status-chip ${connectionState === 'online' ? 'active' : 'muted'}`}>
            {connectionState === 'online' ? 'Ready' : 'Connecting'}
          </span>
        </div>

        <form
          className="join-form"
          onSubmit={(event) => {
            event.preventDefault();
            onJoinRoom(code, name);
          }}
        >
          <label className="field">
            <span>Room code</span>
            <input value={code} onChange={(event) => setCode(normalizeCode(event.target.value))} placeholder="AB12" maxLength={4} />
          </label>

          <label className="field">
            <span>Your name</span>
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Blue Otter" maxLength={18} />
          </label>

          <button type="submit" className="button primary full-width">
            Join room
          </button>
        </form>
      </section>
    </main>
  );
}

function LoadingStage({
  connectionState,
  title = 'Loading room',
  message,
}: {
  connectionState: 'connecting' | 'online' | 'offline';
  title?: string;
  message?: string;
}) {
  return (
    <main className="loading-stage panel">
      <div className="loading-orb" />
      <h2>{title}</h2>
      <p>{message ?? (connectionState === 'online' ? 'Checking the room state.' : 'Waiting for the game server.')}</p>
    </main>
  );
}

function RoomStage({
  room,
  currentPlayer,
  currentPlayerInRound,
  currentRound,
  canvasRef,
  onSubmitPainting,
  onStartMatch,
  onExitToLobby,
  onCopyRoomCode,
  session,
}: {
  room: RoomSnapshot;
  currentPlayer: RoomSnapshot['players'][number] | null;
  currentPlayerInRound: boolean;
  currentRound: RoomSnapshot['currentRound'];
  canvasRef: RefObject<CanvasBoardHandle>;
  onSubmitPainting: () => void;
  onStartMatch: () => void;
  onExitToLobby: () => void;
  onCopyRoomCode: () => void;
  session: LocalSession | null;
}) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, []);

  const timeLeft = room.activeRound ? Math.max(0, room.activeRound.endsAt - now) : null;
  const reviewLeft = room.activeRound?.reviewEndsAt ? Math.max(0, room.activeRound.reviewEndsAt - now) : null;
  const phaseLabel = formatPhase(room.phase);
  const canDraw = room.phase === 'playing' && currentPlayerInRound;
  const latestRound = room.roundResults[room.roundResults.length - 1] ?? null;
  const isHost = currentPlayer?.isHost ?? false;

  return (
    <main className="room-stage">
      <section className="room-topbar panel">
        <div className="room-id-block">
          <p className="eyebrow">Room</p>
          <div className="room-code-row">
            <h2>{room.code}</h2>
            <button type="button" className="button ghost small" onClick={onCopyRoomCode}>
              Copy code
            </button>
          </div>
          <p className="muted-copy">{phaseLabel} • {room.players.length} players • Round {room.currentRoundIndex} of {room.totalRounds}</p>
        </div>

        <div className="room-timers">
          {room.phase === 'playing' ? <TimerCard label="Time left" value={formatClock(timeLeft)} /> : null}
          {room.phase === 'review' ? <TimerCard label="Next round" value={formatClock(reviewLeft)} /> : null}
          <TimerCard label="You" value={currentPlayer ? `${currentPlayer.totalScore} pts` : 'Joining'} />
        </div>
      </section>

      {room.phase === 'lobby' ? (
        <section className="room-lobby-grid">
          <section className="panel lobby-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Lobby</p>
                <h2>Get everyone ready</h2>
              </div>
              {isHost ? <span className="status-chip highlight">Host controls</span> : null}
            </div>

            <p className="muted-copy">The match starts when the host taps start. Everyone sees the same picture and scores are added together.</p>

            <div className="player-list compact">
              {room.players.map((player) => (
                <div key={player.id} className="player-pill">
                  <strong>{player.name}</strong>
                  <span>{player.connected ? 'Connected' : 'Away'}</span>
                </div>
              ))}
            </div>

            {isHost ? (
              <button type="button" className="button primary" onClick={onStartMatch}>
                Start match
              </button>
            ) : (
              <div className="lobby-status">
                <span className="status-chip muted">Waiting for host</span>
              </div>
            )}
          </section>

          <ReferencePanel round={null} />
          <Scoreboard room={room} currentPlayerId={session?.playerId ?? null} />
        </section>
      ) : (
        <section className="play-grid">
          <div className="left-column">
            <ReferencePanel round={currentRound} />

            {room.phase === 'playing' ? (
              <>
                {canDraw ? (
                  <CanvasBoard ref={canvasRef} disabled={!canDraw} palette={currentRound?.reference.palette ?? ['#38bdf8']} initialColor={currentRound?.reference.palette[0]} />
                ) : (
                  <section className="panel waiting-panel">
                    <div className="panel-header">
                      <div>
                        <p className="eyebrow">Waiting</p>
                        <h2>Your round starts next</h2>
                      </div>
                    </div>
                    <p className="muted-copy">You joined after this round began. Stay in the room and you will be added to the next one.</p>
                  </section>
                )}

                {canDraw ? (
                  <div className="submit-row">
                    <button type="button" className="button primary" onClick={onSubmitPainting}>
                      Submit painting
                    </button>
                    <span className="muted-copy">The score combines color match, shape coverage, and a small speed bonus.</span>
                  </div>
                ) : null}
              </>
            ) : null}

            {room.phase === 'review' && latestRound ? (
              <section className="panel review-panel">
                <div className="panel-header">
                  <div>
                    <p className="eyebrow">Round {latestRound.index}</p>
                    <h2>Scores locked in</h2>
                  </div>
                  <span className="status-chip highlight">Review</span>
                </div>

                <p className="muted-copy">{latestRound.winnerId ? `Winner: ${latestRound.submissions.find((submission) => submission.playerId === latestRound.winnerId)?.playerName ?? 'Unknown'}` : 'No winner yet.'}</p>

                <div className="review-grid">
                  {latestRound.submissions.slice(0, 3).map((submission, index) => (
                    <div key={submission.playerId} className="review-card">
                      <span className="review-rank">{index + 1}</span>
                      <strong>{submission.playerName}</strong>
                      <span>{submission.score}/100</span>
                      <small>{describeScore(submission.score)}</small>
                    </div>
                  ))}
                </div>

                <p className="muted-copy">The next round will begin in a moment.</p>
              </section>
            ) : null}

            {room.phase === 'results' ? (
              <section className="panel results-panel">
                <div className="panel-header">
                  <div>
                    <p className="eyebrow">Final results</p>
                    <h2>Match complete</h2>
                  </div>
                  {isHost ? <span className="status-chip highlight">Host can restart</span> : null}
                </div>

                <div className="results-podium">
                  {room.players
                    .slice()
                    .sort((left, right) => right.totalScore - left.totalScore || left.joinedAt - right.joinedAt)
                    .slice(0, 3)
                    .map((player, index) => (
                      <div key={player.id} className={`podium-card podium-${index + 1} ${player.id === session?.playerId ? 'local' : ''}`}>
                        <span className="podium-rank">{index + 1}</span>
                        <div className="podium-avatar">{player.name.slice(0, 2).toUpperCase()}</div>
                        <strong>{player.name}</strong>
                        <span>{player.totalScore}/300</span>
                      </div>
                    ))}
                </div>

                <div className="results-actions">
                  {isHost ? (
                    <button type="button" className="button primary bubbly-button" onClick={onStartMatch}>
                      Play Again
                    </button>
                  ) : null}
                  <button type="button" className="button secondary bubbly-button" onClick={onExitToLobby}>
                    Go to Lobby
                  </button>
                </div>
              </section>
            ) : null}
          </div>

          <Scoreboard room={room} currentPlayerId={session?.playerId ?? null} />
        </section>
      )}
    </main>
  );
}

function TimerCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="timer-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default App;
