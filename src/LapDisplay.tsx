import type {Point} from "./types.tsx";

type LapDisplayProps = {
  pts: Point[];
  color: string;
};

const canvasWidth = 800;
const canvasHeight = 600;

export default function LapDisplay({ pts, color }: LapDisplayProps) {
  if (pts.length === 0) return null; // or a loading placeholder
  const xs = pts.map(p => p.x);
  const ys = pts.map(p => p.y);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const scaleX = canvasWidth / (maxX - minX);
  const scaleY = canvasHeight / (maxY - minY);

  const scale = Math.min(scaleX, scaleY);
  return (
    <div style={{ position: "relative" }}>
      <svg width={canvasWidth} height={canvasHeight} viewBox={`${Math.floor(minX*scale) - 10} ${Math.floor(minY*scale)- 10} ${canvasWidth + 20} ${canvasHeight + 20}`}>
          <path
            d={pts.map((p, i) => (i === 0 ? `M ${p.x*scale},${p.y*scale}` : `L ${p.x*scale},${p.y*scale}`)).join(" ")}
            stroke="blue"
            fill="none"
            strokeWidth={3}
        />
      </svg>
    </div>
  );
}
