import { type ReferenceModel, type RoundDefinition } from '../../shared/game';

type ReferencePanelProps = {
  round: RoundDefinition | null;
};

function renderShape(shape: ReferenceModel['shapes'][number], index: number): JSX.Element {
  if (shape.kind === 'circle') {
    return <circle key={index} cx={shape.cx} cy={shape.cy} r={shape.r} fill={shape.fill} />;
  }

  if (shape.kind === 'rect') {
    return <rect key={index} x={shape.x} y={shape.y} width={shape.width} height={shape.height} fill={shape.fill} rx={2.5} />;
  }

  return <polygon key={index} points={shape.points.map((point) => `${point.x},${point.y}`).join(' ')} fill={shape.fill} />;
}

export function ReferencePanel({ round }: ReferencePanelProps) {
  if (!round) {
    return (
      <section className="reference-card panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Reference</p>
            <h2>Waiting for the host</h2>
          </div>
          <span className="status-chip muted">Lobby</span>
        </div>
        <div className="reference-empty">
          <p>The target painting appears here when the match starts.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="reference-card panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Reference</p>
          <h2>{round.reference.title}</h2>
        </div>
        <span className={`status-chip ${round.reference.generationSource === 'openrouter' ? 'active' : 'muted'}`}>
          {round.reference.generationSource === 'openrouter' ? 'AI generated' : 'Fallback'}
        </span>
      </div>

      <p className="reference-prompt">{round.prompt}</p>
      <p className="reference-note">{round.reference.instructions}</p>

      <div className="reference-frame">
        {round.reference.imageDataUrl ? (
          <img className="reference-image" src={round.reference.imageDataUrl} alt={round.prompt} />
        ) : (
          <svg viewBox="0 0 100 100" className="reference-svg" role="img" aria-label={round.prompt}>
            <rect x="0" y="0" width="100" height="100" fill={round.reference.background} />
            {round.reference.shapes.map((shape, index) => renderShape(shape, index))}
          </svg>
        )}
      </div>

      <div className="reference-footer">
        <div>
          <span className="mini-label">Palette</span>
          <div className="palette-preview">
            {round.reference.palette.map((color) => (
              <span key={color} className="palette-dot" style={{ backgroundColor: color }} />
            ))}
          </div>
        </div>
        <div className="reference-tip">
          <span className="mini-label">Tip</span>
          <p>Focus on the biggest shapes first. The score rewards matching color, coverage, and structure.</p>
        </div>
      </div>
    </section>
  );
}
