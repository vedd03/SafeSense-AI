import { useApp } from '@/lib/store';
import { timeAgo } from '@/lib/analytics';
import {
  Siren,
  AlertTriangle,
  ShieldCheck,
  Wrench,
  Bell,
  CheckCircle2,
} from 'lucide-react';

const ALERT_CONFIG = {
  critical: {
    icon: Siren,
    border: 'border-red-500/30',
    bg: 'bg-red-500/5',
    iconBg: 'bg-red-500/15',
    iconColor: 'text-red-400',
    label: 'Critical',
    labelColor: 'text-red-400 bg-red-500/10 border-red-500/30',
  },
  warning: {
    icon: AlertTriangle,
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/5',
    iconBg: 'bg-amber-500/15',
    iconColor: 'text-amber-400',
    label: 'Warning',
    labelColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  },
  info: {
    icon: ShieldCheck,
    border: 'border-sky-500/30',
    bg: 'bg-sky-500/5',
    iconBg: 'bg-sky-500/15',
    iconColor: 'text-sky-400',
    label: 'Info',
    labelColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
  },
  maintenance: {
    icon: Wrench,
    border: 'border-violet-500/30',
    bg: 'bg-violet-500/5',
    iconBg: 'bg-violet-500/15',
    iconColor: 'text-violet-400',
    label: 'Maintenance',
    labelColor: 'text-violet-400 bg-violet-500/10 border-violet-500/30',
  },
};

export function AlertsPage() {
  const { alerts, acknowledgeAlert, pushToast } = useApp();

  const unack = alerts.filter((a) => !a.acknowledged);
  const acked = alerts.filter((a) => a.acknowledged);

  const handleAck = (id: string) => {
    acknowledgeAlert(id);
    pushToast('Alert acknowledged', 'success');
  };

  const handleAckAll = () => {
    unack.forEach((a) => acknowledgeAlert(a.id));
    pushToast(`${unack.length} alerts acknowledged`, 'success');
  };

  const renderAlert = (alert: typeof alerts[0]) => {
    const cfg = ALERT_CONFIG[alert.type];
    const Icon = cfg.icon;
    return (
      <div key={alert.id} className={`rounded-xl border ${cfg.border} ${cfg.bg} p-4 transition-all`}>
        <div className="flex items-start gap-4">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${cfg.iconBg} shrink-0`}>
            <Icon className={`h-5 w-5 ${cfg.iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-semibold ${cfg.labelColor}`}>
                {cfg.label}
              </span>
              <span className="text-xs text-slate-500">{alert.id}</span>
              {alert.acknowledged && (
                <span className="flex items-center gap-1 text-xs text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" /> Acknowledged
                </span>
              )}
            </div>
            <h3 className="text-sm font-semibold text-white mt-2">{alert.title}</h3>
            <p className="text-sm text-slate-400 mt-1">{alert.description}</p>
            <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
              <span>{alert.department}</span>
              <span>·</span>
              <span>{timeAgo(alert.dateTime)}</span>
            </div>
          </div>
          {!alert.acknowledged && (
            <button
              onClick={() => handleAck(alert.id)}
              className="btn-secondary !py-1.5 !px-3 text-xs shrink-0"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Acknowledge
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Alerts</h1>
          <p className="text-slate-400 mt-1 text-sm">Safety alerts and warnings across the facility</p>
        </div>
        {unack.length > 0 && (
          <button onClick={handleAckAll} className="btn-secondary">
            <CheckCircle2 className="h-4 w-4" />
            Acknowledge All ({unack.length})
          </button>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(['critical', 'warning', 'info', 'maintenance'] as const).map((type) => {
          const cfg = ALERT_CONFIG[type];
          const count = alerts.filter((a) => a.type === type).length;
          const unackCount = alerts.filter((a) => a.type === type && !a.acknowledged).length;
          const Icon = cfg.icon;
          return (
            <div key={type} className={`card p-4 border ${cfg.border}`}>
              <div className="flex items-center justify-between">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${cfg.iconBg}`}>
                  <Icon className={`h-5 w-5 ${cfg.iconColor}`} />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{count}</div>
                  {unackCount > 0 && <div className="text-xs text-slate-500">{unackCount} new</div>}
                </div>
              </div>
              <div className="text-xs text-slate-400 mt-2">{cfg.label}</div>
            </div>
          );
        })}
      </div>

      {/* Active alerts */}
      {unack.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Bell className="h-5 w-5 text-sky-400" />
            <h2 className="text-lg font-semibold text-white">Active Alerts</h2>
            <span className="flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
              {unack.length}
            </span>
          </div>
          <div className="space-y-3">
            {unack.map(renderAlert)}
          </div>
        </div>
      )}

      {/* Acknowledged alerts */}
      {acked.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <h2 className="text-lg font-semibold text-white">Acknowledged</h2>
          </div>
          <div className="space-y-3 opacity-70">
            {acked.map(renderAlert)}
          </div>
        </div>
      )}

      {alerts.length === 0 && (
        <div className="card p-12 text-center">
          <Bell className="h-10 w-10 text-slate-600 mx-auto" />
          <p className="text-slate-500 mt-4 text-sm">No alerts at this time</p>
        </div>
      )}
    </div>
  );
}
