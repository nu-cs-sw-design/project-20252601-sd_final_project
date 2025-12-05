import type {Point} from "./types.tsx";

type LapDisplayProps = {
  pts: Point[];
  colors: string[];
};

const canvasWidth = 800;
const canvasHeight = 600;

export default function LapDisplay({ pts, colors }: LapDisplayProps) {
  if(pts.length === 0) return null; // or a loading placeholder
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
        {pts.slice(1).map((p, i) => {
          const p0 = pts[i];
          const p1 = p;
          return (
            <line
              key={i}
              x1={p0.x * scale}
              y1={p0.y * scale}
              x2={p1.x * scale}
              y2={p1.y * scale}
              stroke={colors[i] || "black"}
              strokeWidth={5}
            />
          );
        })}
      </svg>
    </div>
  );
}
