import type {Point} from "./types.tsx";

type LapDisplayProps = {
  pts: Point[];
  color: string;
};

const canvasWidth = 800;
const canvasHeight = 600;

export default function LapDisplay({ pts, color }: LapDisplayProps) {
  const xs = pts.map(p => p.x);
  const ys = pts.map(p => p.y);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const scaleX = canvasWidth / (maxX - minX);
  const scaleY = canvasHeight / (maxY - minY);

  const scale = Math.min(scaleX, scaleY);
  const path = pts
    .map((p, i) => (i === 0 ? `M ${p.x*scale},${p.y*scale}` : `L ${p.x*scale},${p.y*scale}`))
    .join(" ");

  return (
    <div style={{ position: "relative" }}>
      <svg width={canvasWidth} height={canvasHeight} viewBox={`${minX*scale} ${minY*scale} ${canvasWidth} ${canvasHeight}`}>
        <path d={path} stroke={color} fill="none" strokeWidth={3} />
      </svg>
    </div>
  );
}
