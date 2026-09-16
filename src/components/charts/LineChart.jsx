import { useRef, useState } from "react";

const WIDTH = 300;
const HEIGHT = 120;
const PAD_LEFT = 34;
const PAD_RIGHT = 14;
const PAD_TOP = 14;
const PAD_BOTTOM = 20;

function getSvgPoint(svgEl, clientX, clientY) {
  const pt = svgEl.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const ctm = svgEl.getScreenCTM();
  if (!ctm) return { x: 0, y: 0 };
  const transformed = pt.matrixTransform(ctm.inverse());
  return { x: transformed.x, y: transformed.y };
}

export default function LineChart({ data, unit = "" }) {
  const svgRef = useRef(null);
  const [hoverIndex, setHoverIndex] = useState(null);

  if (!data || data.length === 0) return null;

  const values = data.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  const plotWidth = WIDTH - PAD_LEFT - PAD_RIGHT;
  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;

  function xAt(i) {
    if (data.length === 1) return PAD_LEFT + plotWidth / 2;
    return PAD_LEFT + (plotWidth * i) / (data.length - 1);
  }

  function yAt(value) {
    return PAD_TOP + plotHeight - ((value - minVal) / range) * plotHeight;
  }

  const points = data.map((d, i) => ({ x: xAt(i), y: yAt(d.value), ...d }));
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const last = points[points.length - 1];

  function handlePointerMove(e) {
    if (!svgRef.current) return;
    const { x } = getSvgPoint(svgRef.current, e.clientX, e.clientY);
    let nearest = 0;
    let nearestDist = Infinity;
    points.forEach((p, i) => {
      const dist = Math.abs(p.x - x);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = i;
      }
    });
    setHoverIndex(nearest);
  }

  const hovered = hoverIndex !== null ? points[hoverIndex] : null;
  const tooltipFlipLeft = hovered && hovered.x > WIDTH - 80;

  return (
    <svg
      ref={svgRef}
      className="line-chart"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerMove}
      onPointerLeave={() => setHoverIndex(null)}
    >
      {/* 그리드라인: 최대/최소 값 기준 */}
      <line x1={PAD_LEFT} y1={yAt(maxVal)} x2={WIDTH - PAD_RIGHT} y2={yAt(maxVal)} className="chart-grid-line" />
      <line x1={PAD_LEFT} y1={yAt(minVal)} x2={WIDTH - PAD_RIGHT} y2={yAt(minVal)} className="chart-grid-line" />
      <text x={2} y={yAt(maxVal) + 3} className="chart-axis-label">
        {Math.round(maxVal)}
      </text>
      <text x={2} y={yAt(minVal) + 3} className="chart-axis-label">
        {Math.round(minVal)}
      </text>

      {/* 바닥 기준선 */}
      <line
        x1={PAD_LEFT}
        y1={HEIGHT - PAD_BOTTOM}
        x2={WIDTH - PAD_RIGHT}
        y2={HEIGHT - PAD_BOTTOM}
        className="chart-baseline"
      />

      <path d={pathD} className="chart-line" fill="none" />

      {/* 끝점 마커 + 값 라벨 */}
      <circle cx={last.x} cy={last.y} r="5" className="chart-end-marker" />
      <text
        x={last.x - 6}
        y={last.y - 10}
        textAnchor="end"
        className="chart-end-label"
      >
        {last.value}
        {unit}
      </text>

      {/* 호버 크로스헤어 + 툴팁 */}
      {hovered && (
        <g>
          <line x1={hovered.x} y1={PAD_TOP} x2={hovered.x} y2={HEIGHT - PAD_BOTTOM} className="chart-crosshair" />
          <circle cx={hovered.x} cy={hovered.y} r="5" className="chart-hover-dot" />
          <g transform={`translate(${tooltipFlipLeft ? hovered.x - 84 : hovered.x + 8}, ${PAD_TOP})`}>
            <rect width="76" height="30" rx="6" className="chart-tooltip-bg" />
            <text x="8" y="13" className="chart-tooltip-label">
              {hovered.label}
            </text>
            <text x="8" y="25" className="chart-tooltip-value">
              {hovered.value}
              {unit}
            </text>
          </g>
        </g>
      )}
    </svg>
  );
}
