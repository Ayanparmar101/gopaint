import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState, type PointerEvent } from 'react';

import { GAME_CANVAS_SIZE } from '../../shared/game';

export type CanvasBoardHandle = {
  exportImage: () => string;
  clear: () => void;
};

type CanvasBoardProps = {
  disabled: boolean;
  palette: string[];
  initialColor?: string;
  initialBrushSize?: number;
};

const BRUSH_SIZES = [10, 16, 24] as const;

function clampBrushColor(palette: string[], color: string | undefined): string {
  if (color && palette.includes(color)) {
    return color;
  }

  return palette[0] ?? '#38bdf8';
}

function getPointFromEvent(canvas: HTMLCanvasElement, clientX: number, clientY: number): { x: number; y: number } {
  const bounds = canvas.getBoundingClientRect();
  return {
    x: ((clientX - bounds.left) / bounds.width) * canvas.width,
    y: ((clientY - bounds.top) / bounds.height) * canvas.height,
  };
}

export const CanvasBoard = forwardRef<CanvasBoardHandle, CanvasBoardProps>(function CanvasBoard(
  { disabled, palette, initialColor, initialBrushSize },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const [brushColor, setBrushColor] = useState(() => clampBrushColor(palette, initialColor));
  const [brushSize, setBrushSize] = useState(() => initialBrushSize ?? BRUSH_SIZES[1]);

  const colors = useMemo(() => {
    const visiblePalette = [...palette];
    if (!visiblePalette.includes('#ffffff')) {
      visiblePalette.push('#ffffff');
    }
    if (!visiblePalette.includes('#1f2937')) {
      visiblePalette.push('#1f2937');
    }
    return visiblePalette;
  }, [palette]);

  function clearCanvas(): void {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.fillStyle = '#fffaf1';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.restore();
    lastPointRef.current = null;
  }

  useImperativeHandle(ref, () => ({
    exportImage: () => canvasRef.current?.toDataURL('image/png') ?? '',
    clear: clearCanvas,
  }));

  useEffect(() => {
    clearCanvas();
  }, []);

  function strokeSegment(point: { x: number; y: number }): void {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    context.strokeStyle = brushColor;
    context.fillStyle = brushColor;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = brushSize;

    if (!lastPointRef.current) {
      context.beginPath();
      context.arc(point.x, point.y, brushSize / 2, 0, Math.PI * 2);
      context.fill();
      lastPointRef.current = point;
      return;
    }

    context.beginPath();
    context.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    context.lineTo(point.x, point.y);
    context.stroke();
    lastPointRef.current = point;
  }

  function handlePointerDown(event: PointerEvent<HTMLCanvasElement>): void {
    if (disabled) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    canvas.setPointerCapture(event.pointerId);
    drawingRef.current = true;
    strokeSegment(getPointFromEvent(canvas, event.clientX, event.clientY));
  }

  function handlePointerMove(event: PointerEvent<HTMLCanvasElement>): void {
    if (disabled || !drawingRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    strokeSegment(getPointFromEvent(canvas, event.clientX, event.clientY));
  }

  function handlePointerUp(event: PointerEvent<HTMLCanvasElement>): void {
    if (!drawingRef.current) {
      return;
    }

    drawingRef.current = false;
    lastPointRef.current = null;

    const canvas = canvasRef.current;
    if (canvas?.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <section className="canvas-card panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Your canvas</p>
          <h2>Draw the match</h2>
        </div>
        <span className={`status-chip ${disabled ? 'muted' : 'active'}`}>{disabled ? 'Locked' : 'Ready'}</span>
      </div>

      <div className="canvas-toolbar">
        <div className="tool-group">
          <span className="tool-label">Color</span>
          <div className="swatch-row">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                className={`swatch ${brushColor === color ? 'selected' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setBrushColor(color)}
                aria-label={`Brush color ${color}`}
              />
            ))}
          </div>
        </div>

        <div className="tool-group">
          <span className="tool-label">Brush</span>
          <div className="size-row">
            {BRUSH_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                className={`size-chip ${brushSize === size ? 'selected' : ''}`}
                onClick={() => setBrushSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <button type="button" className="button ghost" onClick={clearCanvas}>
          Clear
        </button>
      </div>

      <div className={`canvas-stage ${disabled ? 'locked' : ''}`}>
        <canvas
          ref={canvasRef}
          width={GAME_CANVAS_SIZE}
          height={GAME_CANVAS_SIZE}
          className="paint-canvas"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={handlePointerUp}
          aria-label="Drawing canvas"
        />
        {disabled ? <div className="canvas-overlay">Waiting for the next round</div> : null}
      </div>
    </section>
  );
});
