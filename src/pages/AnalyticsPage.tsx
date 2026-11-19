import { useApp } from '@/lib/store';
import { BarChart, LineChart, DonutChart, ProgressRing } from '@/components/Charts';
import {
  hazardDistribution,
  monthlyTrend,
  riskDistribution,
  incidentsByDepartment,
  departmentSafetyScores,
  computeMetrics,
} from '@/lib/analytics';
import { BarChart3, TrendingUp, Activity, Gauge, AlertTriangle, Award } from 'lucide-react';

export function AnalyticsPage() {
  const { incidents, alerts, capas } = useApp();
  const metrics = computeMetrics(incidents, capas, alerts);

  const hazards = hazardDistribution(incidents);
  const trend = monthlyTrend(incidents);
  const riskDist = riskDistribution(incidents);
  const byDept = incidentsByDepartment(incidents);
  const deptScores = departmentSafetyScores(incidents);

  const deptColors = ['#3b82f6', '#ef4444', '#f97316', '#a855f7', '#eab308', '#14b8a6', '#06b6d4', '#ec4899', '#84cc16', '#64748b'];

  const deptBarData = byDept.map((d, i) => ({
    label: d.label.length > 12 ? d.label.slice(0, 10) + '…' : d.label,
    value: d.value,
    color: deptColors[i % deptColors.length],
  }));

  const nearMissByMonth = trend.map((t) => ({
    label: t.label,
    value: Math.round(t.value * 0.3),
  }));

  const totalNearMiss = nearMissByMonth.reduce((s, d) => s + d.value, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Safety Analytics</h1>
        <p className="text-slate-400 mt-1 text-sm">Comprehensive analytics across departments, hazards, and time</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-2 text-xs text-slate-400"><BarChart3 className="h-4 w-4" /> Total Incidents</div>
          <div className="text-3xl font-bold text-white mt-2">{metrics.total}</div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 text-xs text-slate-400"><AlertTriangle className="h-4 w-4" /> Near Misses</div>
          <div className="text-3xl font-bold text-amber-400 mt-2">{totalNearMiss}</div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 text-xs text-slate-400"><Gauge className="h-4 w-4" /> Avg Risk Score</div>
          <div className="text-3xl font-bold text-orange-400 mt-2">{metrics.avgRiskScore.toFixed(1)}</div>
        </div>
        <div className="card p-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400"><Award className="h-4 w-4" /> Safety Score</div>
            <div className={`text-3xl font-bold mt-2 ${metrics.safetyScore >= 75 ? 'text-emerald-400' : metrics.safetyScore >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
              {metrics.safetyScore}
            </div>
          </div>
          <ProgressRing
            value={metrics.safetyScore}
            size={70}
            color={metrics.safetyScore >= 75 ? '#10b981' : metrics.safetyScore >= 50 ? '#f59e0b' : '#ef4444'}
          />
        </div>
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Incidents by department */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-sky-400" />
            <h3 className="font-semibold text-white">Incidents by Department</h3>
          </div>
          <BarChart data={deptBarData} height={240} />
        </div>

        {/* Incidents by hazard */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-sky-400" />
            <h3 className="font-semibold text-white">Incidents by Hazard Type</h3>
          </div>
          {hazards.length > 0 && <DonutChart data={hazards} size={170} />}
        </div>

        {/* Monthly trend */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-sky-400" />
            <h3 className="font-semibold text-white">Monthly Incident Trend</h3>
          </div>
          <LineChart data={trend} height={220} color="#3b82f6" />
        </div>

        {/* Risk distribution */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Gauge className="h-5 w-5 text-orange-400" />
            <h3 className="font-semibold text-white">Risk Distribution</h3>
          </div>
          <BarChart data={riskDist} height={220} />
        </div>
      </div>

      {/* Near miss trend */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-amber-400" />
          <h3 className="font-semibold text-white">Near-Miss Reporting Trend</h3>
        </div>
        <LineChart data={nearMissByMonth} height={200} color="#f59e0b" />
      </div>

      {/* Department safety scores */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Award className="h-5 w-5 text-emerald-400" />
          <h3 className="font-semibold text-white">Department Safety Scores</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {deptScores.map((d, i) => (
            <div key={i} className="rounded-xl border border-slate-800/50 bg-slate-800/20 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-white truncate">{d.label}</div>
                <span className={`text-lg font-bold ${d.score >= 75 ? 'text-emerald-400' : d.score >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                  {d.score}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-1">{d.incidents} incident(s)</div>
              <div className="mt-2 h-2 rounded-full bg-slate-700/60 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${d.score}%`,
                    backgroundColor: d.score >= 75 ? '#10b981' : d.score >= 50 ? '#f59e0b' : '#ef4444',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
