import { useApp } from '@/lib/store';
import { BarChart, LineChart, DonutChart, ProgressRing } from '@/components/Charts';
import { RiskBadge, StatusBadge } from '@/components/Badges';
import {
  computeMetrics,
  hazardDistribution,
  monthlyTrend,
  highRiskAreas,
  timeAgo,
} from '@/lib/analytics';
import {
  AlertTriangle,
  Siren,
  ShieldCheck,
  TrendingUp,
  Activity,
  MapPin,
  FileText,
  Zap,
} from 'lucide-react';
import type { PageId } from '@/components/Layout';

export function DashboardPage({ onNavigate }: { onNavigate: (page: PageId) => void }) {
  const { incidents, alerts, role, capas } = useApp();
  const metrics = computeMetrics(incidents, capas, alerts);
  const hazards = hazardDistribution(incidents);
  const trend = monthlyTrend(incidents);
  const riskAreas = highRiskAreas(incidents);
  const recentIncidents = incidents.slice(0, 5);
  const recentAlerts = alerts.slice(0, 4);

  const stats = [
    {
      label: 'Total Incidents',
      value: metrics.total,
      icon: FileText,
      color: 'from-sky-500 to-blue-600',
      sub: `${metrics.resolved} resolved`,
    },
    {
      label: 'Near Misses',
      value: metrics.nearMisses,
      icon: AlertTriangle,
      color: 'from-amber-500 to-yellow-600',
      sub: 'Reported safely',
    },
    {
      label: 'High-Risk Incidents',
      value: metrics.highRisk,
      icon: Zap,
      color: 'from-orange-500 to-red-600',
      sub: 'Need attention',
    },
    {
      label: 'Critical Alerts',
      value: metrics.criticalAlerts,
      icon: Siren,
      color: 'from-red-500 to-rose-600',
      sub: 'Unacknowledged',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800/60 bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 p-6">
        <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Safety Operations Overview</h1>
            <p className="text-slate-400 mt-1 text-sm">
              Real-time monitoring of workshop safety across all departments
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-slate-500">Overall Safety Score</div>
              <div className={`text-3xl font-bold ${metrics.safetyScore >= 75 ? 'text-emerald-400' : metrics.safetyScore >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                {metrics.safetyScore}<span className="text-lg text-slate-500">/100</span>
              </div>
            </div>
            <ProgressRing
              value={metrics.safetyScore}
              size={90}
              label="Safety"
              color={metrics.safetyScore >= 75 ? '#10b981' : metrics.safetyScore >= 50 ? '#f59e0b' : '#ef4444'}
            />
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card card-hover p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-medium">{s.label}</div>
                  <div className="text-3xl font-bold text-white mt-2">{s.value}</div>
                  <div className="text-xs text-slate-500 mt-1">{s.sub}</div>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} shadow-lg`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Risk trend */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-sky-400" />
              <h3 className="font-semibold text-white">Risk Trend (6 Months)</h3>
            </div>
            <span className="text-xs text-slate-500">Incidents per month</span>
          </div>
          <LineChart data={trend} height={220} color="#3b82f6" />
        </div>

        {/* Hazard distribution */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-sky-400" />
            <h3 className="font-semibold text-white">Hazard Distribution</h3>
          </div>
          {hazards.length > 0 && <DonutChart data={hazards} size={160} />}
        </div>
      </div>

      {/* Recent incidents + High-risk areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent incidents */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-sky-400" />
              <h3 className="font-semibold text-white">Recent Incidents</h3>
            </div>
            <button
              onClick={() => onNavigate('incidents')}
              className="text-xs text-sky-400 hover:text-sky-300 font-medium"
            >
              View all →
            </button>
          </div>
          <div className="space-y-3">
            {recentIncidents.map((inc) => (
              <div
                key={inc.id}
                className="flex items-start gap-3 rounded-xl border border-slate-800/50 bg-slate-800/30 p-3 hover:bg-slate-800/60 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-500">{inc.id}</span>
                    {inc.aiAnalysis && <RiskBadge level={inc.aiAnalysis.riskLevel} />}
                  </div>
                  <div className="text-sm font-medium text-white mt-1 truncate">{inc.title}</div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <span>{inc.department}</span>
                    <span>·</span>
                    <span>{timeAgo(inc.createdAt)}</span>
                  </div>
                </div>
                <StatusBadge status={inc.status} />
              </div>
            ))}
          </div>
        </div>

        {/* High-risk areas */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-orange-400" />
            <h3 className="font-semibold text-white">High-Risk Areas</h3>
          </div>
          <div className="space-y-3">
            {riskAreas.map((area, i) => (
              <div key={i} className="rounded-xl border border-slate-800/50 bg-slate-800/30 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{area.location}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{area.count} incident(s)</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-24 h-2 rounded-full bg-slate-700/60 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${(area.riskScore / 10) * 100}%`,
                          backgroundColor: area.riskScore >= 8 ? '#ef4444' : area.riskScore >= 6 ? '#f97316' : '#f59e0b',
                        }}
                      />
                    </div>
                    <span className={`text-sm font-bold ${area.riskScore >= 8 ? 'text-red-400' : area.riskScore >= 6 ? 'text-orange-400' : 'text-amber-400'}`}>
                      {area.riskScore.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {riskAreas.length === 0 && (
              <div className="text-center py-8 text-slate-500 text-sm">No high-risk areas detected</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent alerts */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Siren className="h-5 w-5 text-red-400" />
            <h3 className="font-semibold text-white">Recent Alerts</h3>
          </div>
          <button
            onClick={() => onNavigate('alerts')}
            className="text-xs text-sky-400 hover:text-sky-300 font-medium"
          >
            View all →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recentAlerts.map((alert) => {
            const colors = {
              critical: 'border-red-500/40 bg-red-500/10',
              warning: 'border-amber-500/40 bg-amber-500/10',
              info: 'border-sky-500/40 bg-sky-500/10',
              maintenance: 'border-violet-500/40 bg-violet-500/10',
            };
            const iconColors = {
              critical: 'text-red-400',
              warning: 'text-amber-400',
              info: 'text-sky-400',
              maintenance: 'text-violet-400',
            };
            const icons = {
              critical: Siren,
              warning: AlertTriangle,
              info: ShieldCheck,
              maintenance: Activity,
            };
            const Icon = icons[alert.type];
            return (
              <div key={alert.id} className={`rounded-xl border p-3 ${colors[alert.type]}`}>
                <div className="flex items-start gap-3">
                  <Icon className={`h-5 w-5 ${iconColors[alert.type]} shrink-0 mt-0.5`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white">{alert.title}</div>
                    <div className="text-xs text-slate-400 mt-1 line-clamp-2">{alert.description}</div>
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                      <span>{alert.department}</span>
                      <span>·</span>
                      <span>{timeAgo(alert.dateTime)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
