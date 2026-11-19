interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  height?: number;
  horizontal?: boolean;
  maxValue?: number;
}

export function BarChart({ data, height = 200, horizontal = false, maxValue }: BarChartProps) {
  const max = maxValue ?? Math.max(...data.map((d) => d.value), 1);

  if (horizontal) {
    return (
      <div className="space-y-2.5">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-32 shrink-0 truncate text-xs text-slate-400">{d.label}</div>
            <div className="flex-1 rounded-full bg-slate-800/60">
              <div
                className="h-7 rounded-full flex items-center justify-end pr-2 text-xs font-semibold text-white transition-all duration-700"
                style={{
                  width: `${Math.max((d.value / max) * 100, 3)}%`,
                  backgroundColor: d.color ?? '#3b82f6',
                }}
              >
                {d.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-end justify-between gap-2" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex w-full items-end justify-center" style={{ height: height - 28 }}>
            <div
              className="w-full max-w-[48px] rounded-t-md transition-all duration-700 hover:opacity-80 relative group"
              style={{
                height: `${Math.max((d.value / max) * (height - 28), 4)}px`,
                backgroundColor: d.color ?? '#3b82f6',
              }}
            >
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-semibold text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                {d.value}
              </span>
            </div>
          </div>
          <div className="w-full truncate text-center text-[10px] text-slate-400">{d.label}</div>
        </div>
      ))}
    </div>
  );
}

interface LineChartProps {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
}

export function LineChart({ data, height = 200, color = '#3b82f6' }: LineChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const min = Math.min(...data.map((d) => d.value), 0);
  const range = max - min || 1;
  const w = 600;
  const h = height - 30;
  const stepX = data.length > 1 ? w / (data.length - 1) : w;

  const points = data.map((d, i) => ({
    x: i * stepX,
    y: h - ((d.value - min) / range) * (h - 20) - 10,
  }));

  const pathD = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(' ');

  const areaD = `${pathD} L ${points[points.length - 1]?.x ?? 0} ${h} L 0 ${h} Z`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${w} ${height}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1="0" y1={h * f} x2={w} y2={h * f} stroke="#1e293b" strokeWidth="1" />
        ))}
        <path d={areaD} fill="url(#lineGrad)" />
        <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill={color} className="drop-shadow" />
        ))}
      </svg>
      <div className="flex justify-between mt-1">
        {data.map((d, i) => (
          <div key={i} className="text-[10px] text-slate-400">{d.label}</div>
        ))}
      </div>
    </div>
  );
}

interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
}

export function DonutChart({ data, size = 180 }: DonutChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const radius = size / 2;
  const innerRadius = radius * 0.62;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  const segments = data.map((d) => {
    const fraction = d.value / total;
    const dash = fraction * circumference;
    const segment = {
      ...d,
      dash,
      gap: circumference - dash,
      offset: -offset,
    };
    offset += dash;
    return segment;
  });

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ minWidth: size }}>
        <g transform={`rotate(-90 ${radius} ${radius})`}>
          {segments.map((s, i) => (
            <circle
              key={i}
              cx={radius}
              cy={radius}
              r={radius - 6}
              fill="none"
              stroke={s.color}
              strokeWidth={radius - innerRadius}
              strokeDasharray={`${s.dash} ${s.gap}`}
              strokeDashoffset={s.offset}
            />
          ))}
        </g>
        <text
          x="50%"
          y="46%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#e2e8f0"
          fontSize="28"
          fontWeight="700"
        >
          {total}
        </text>
        <text
          x="50%"
          y="60%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#64748b"
          fontSize="11"
        >
          Total
        </text>
      </svg>
      <div className="space-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: d.color }} />
            <span className="text-slate-300">{d.label}</span>
            <span className="text-slate-500 ml-auto font-semibold">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  label?: string;
  color?: string;
}

export function ProgressRing({ value, max = 100, size = 120, label, color = '#3b82f6' }: ProgressRingProps) {
  const radius = size / 2;
  const strokeWidth = size * 0.1;
  const innerRadius = radius - strokeWidth;
  const circumference = 2 * Math.PI * innerRadius;
  const pct = Math.min(value / max, 1);
  const dash = pct * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={radius} cy={radius} r={innerRadius} fill="none" stroke="#1e293b" strokeWidth={strokeWidth} />
        <g transform={`rotate(-90 ${radius} ${radius})`}>
          <circle
            cx={radius}
            cy={radius}
            r={innerRadius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeLinecap="round"
          />
        </g>
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold text-white">{Math.round(value)}</span>
        {label && <span className="text-[10px] text-slate-400">{label}</span>}
      </div>
    </div>
  );
}
