import { useApp } from '@/lib/store';
import { BarChart, LineChart } from '@/components/Charts';
import { RiskBadge } from '@/components/Badges';
import { riskDistribution, incidentsByDepartment, highRiskAreas, monthlyTrend } from '@/lib/analytics';
import { TrendingUp, AlertCircle, Target, Zap } from 'lucide-react';

export function RiskPredictionPage() {
  const { incidents } = useApp();
  const riskDist = riskDistribution(incidents);
  const byDept = incidentsByDepartment(incidents);
  const riskAreas = highRiskAreas(incidents);
  const trend = monthlyTrend(incidents);

  const deptRisk = byDept.map((d) => {
    const deptIncidents = incidents.filter((i) => i.department === d.label);
    const avg = deptIncidents.reduce((s, i) => s + (i.aiAnalysis?.riskScore ?? 0), 0) / deptIncidents.length;
    return {
      label: d.label.length > 15 ? d.label.slice(0, 13) + '…' : d.label,
      value: Math.round(avg * 10) / 10,
      color: avg >= 7 ? '#ef4444' : avg >= 5 ? '#f97316' : avg >= 3 ? '#f59e0b' : '#10b981',
    };
  });

  const predictedTrend = [...trend];
  if (predictedTrend.length >= 2) {
    const lastVal = predictedTrend[predictedTrend.length - 1].value;
    const prevVal = predictedTrend[predictedTrend.length - 2].value;
    const trendDelta = lastVal - prevVal;
    // Deterministic forecast: the same data produces the same prediction every time.
    const direction = trendDelta === 0 ? -1 : Math.sign(trendDelta);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const nextMonth = monthNames[(now.getMonth() + 1) % 12];
    const followingMonth = monthNames[(now.getMonth() + 2) % 12];
    const step = Math.max(1, Math.min(3, Math.abs(trendDelta) || 1));
    predictedTrend.push({ label: `${nextMonth}*`, value: Math.max(0, lastVal + direction * step) });
    predictedTrend.push({ label: `${followingMonth}*`, value: Math.max(0, lastVal + direction * step * 2) });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Risk Prediction</h1>
        <p className="text-slate-400 mt-1 text-sm">Predictive risk analysis and forecasting across departments</p>
      </div>

      {/* Risk distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-orange-400" />
            <h3 className="font-semibold text-white">Risk Level Distribution</h3>
          </div>
          <BarChart
            data={riskDist}
            height={200}
          />
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-sky-400" />
            <h3 className="font-semibold text-white">Predictive Risk Trend</h3>
          </div>
          <LineChart data={predictedTrend} height={220} color="#f97316" />
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-orange-400" /> * Forecasted months (deterministic prototype model)</span>
          </div>
        </div>
      </div>

      {/* Department risk */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-5 w-5 text-sky-400" />
          <h3 className="font-semibold text-white">Average Risk Score by Department</h3>
        </div>
        <BarChart data={deptRisk} height={240} horizontal />
      </div>

      {/* High-risk predictions */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <h3 className="font-semibold text-white">Predicted High-Risk Areas</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {riskAreas.map((area, i) => (
            <div
              key={i}
              className={`rounded-xl border p-4 ${
                area.riskScore >= 8
                  ? 'border-red-500/30 bg-red-500/5'
                  : area.riskScore >= 6
                  ? 'border-orange-500/30 bg-orange-500/5'
                  : 'border-amber-500/30 bg-amber-500/5'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-semibold text-white">{area.location}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{area.department}</div>
                </div>
                <div className={`text-2xl font-bold ${area.riskScore >= 8 ? 'text-red-400' : area.riskScore >= 6 ? 'text-orange-400' : 'text-amber-400'}`}>
                  {area.riskScore.toFixed(1)}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-slate-500">{area.count} incident(s)</span>
                {area.riskScore >= 7 && (
                  <span className="flex items-center gap-1 text-xs text-red-400 font-medium">
                    <AlertCircle className="h-3 w-3" /> Action needed
                  </span>
                )}
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-slate-700/60 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${(area.riskScore / 10) * 100}%`,
                    backgroundColor: area.riskScore >= 8 ? '#ef4444' : area.riskScore >= 6 ? '#f97316' : '#f59e0b',
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
