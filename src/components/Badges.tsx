import type { RiskLevel, Severity, Priority } from '@/lib/types';

const riskColors: Record<RiskLevel, string> = {
  Low: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Medium: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  High: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  Critical: 'bg-red-500/15 text-red-400 border-red-500/30',
};

const severityColors: Record<Severity, string> = {
  Low: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Medium: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  High: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  Critical: 'bg-red-500/15 text-red-400 border-red-500/30',
};

const priorityColors: Record<Priority, string> = {
  Low: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  Medium: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  High: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  Urgent: 'bg-red-500/15 text-red-400 border-red-500/30',
};

export function RiskBadge({ level }: { level: RiskLevel }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${riskColors[level]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {level}
    </span>
  );
}

export function SeverityBadge({ level }: { level: Severity }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${severityColors[level]}`}>
      {level}
    </span>
  );
}

export function PriorityBadge({ level }: { level: Priority }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${priorityColors[level]}`}>
      {level}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Submitted: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    'Under Review': 'bg-violet-400/15 text-violet-300 border-violet-400/30',
    'In Progress': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    Resolved: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    Closed: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
    Open: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    'Pending Review': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    Completed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    Overdue: 'bg-red-500/15 text-red-400 border-red-500/30',
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${colors[status] ?? colors['Open']}`}>
      {status}
    </span>
  );
}
