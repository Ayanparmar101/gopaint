import { describeScore } from '../../shared/scoring';
import { type RoomSnapshot } from '../../shared/game';

type ScoreboardProps = {
  room: RoomSnapshot;
  currentPlayerId: string | null;
};

function formatShortScore(score: number): string {
  return score.toString().padStart(2, '0');
}

export function Scoreboard({ room, currentPlayerId }: ScoreboardProps) {
  const ranking = [...room.players].sort((left, right) => right.totalScore - left.totalScore || left.joinedAt - right.joinedAt);
  const latestRound = room.roundResults[room.roundResults.length - 1] ?? null;

  return (
    <aside className="scoreboard panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Leaderboard</p>
          <h2>Room {room.code}</h2>
        </div>
        <span className={`status-chip ${room.phase === 'results' ? 'highlight' : 'active'}`}>{room.phase}</span>
      </div>

      <ol className="leaderboard-list">
        {ranking.map((player, index) => (
          <li key={player.id} className={`leaderboard-item ${player.id === currentPlayerId ? 'local' : ''}`}>
            <span className="rank-badge">{index + 1}</span>
            <div className="leaderboard-copy">
              <div className="leaderboard-name-row">
                <strong>{player.name}</strong>
                {player.isHost ? <span className="tiny-pill">Host</span> : null}
                {player.id === currentPlayerId ? <span className="tiny-pill accent">You</span> : null}
              </div>
              <span className="leaderboard-subtext">
                {player.connected ? 'Connected' : 'Reconnecting'}
                {player.submittedThisRound ? ' • Submitted' : room.phase === 'playing' ? ' • Drawing' : ''}
              </span>
            </div>
            <span className="leaderboard-score">{formatShortScore(player.totalScore)}</span>
          </li>
        ))}
      </ol>

      {latestRound ? (
        <section className="round-history">
          <div className="subpanel-header">
            <span className="mini-label">Latest round</span>
            <span className="subtle-copy">{describeScore(latestRound.submissions[0]?.score ?? 0)}</span>
          </div>
          <p className="round-history-prompt">{latestRound.prompt}</p>
          <div className="round-podium">
            {latestRound.submissions.slice(0, 3).map((submission, index) => (
              <div key={submission.playerId} className="podium-card">
                <span className="podium-rank">{index + 1}</span>
                <strong>{submission.playerName}</strong>
                <span>{submission.score}/100</span>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="round-history empty">
          <p>Scores will appear here after the first round ends.</p>
        </section>
      )}
    </aside>
  );
}
