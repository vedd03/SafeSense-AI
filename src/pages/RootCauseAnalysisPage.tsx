import { useState } from 'react';
import { useApp } from '@/lib/store';
import { RiskBadge } from '@/components/Badges';
import { GitBranch, Search, AlertTriangle, TrendingDown, Lightbulb } from 'lucide-react';
import type { Incident } from '@/lib/types';

export function RootCauseAnalysisPage() {
  const { incidents } = useApp();
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(
    incidents.length > 0 ? incidents[0].id : null,
  );

  const filtered = incidents.filter(
    (i) => i.aiAnalysis && (i.title.toLowerCase().includes(search.toLowerCase()) || i.id.toLowerCase().includes(search.toLowerCase())),
  );

  const selected: Incident | null = incidents.find((i) => i.id === selectedId) ?? null;

  // Aggregate root causes across all incidents
  const causeAggregation: Record<string, { count: number; totalConfidence: number }> = {};
  incidents.forEach((inc) => {
    inc.aiAnalysis?.rootCauses.forEach((rc) => {
      if (!causeAggregation[rc.cause]) causeAggregation[rc.cause] = { count: 0, totalConfidence: 0 };
      causeAgacencyHandler(causeAggregation, rc.cause, rc.confidence);
    });
  });

  const topCauses = Object.entries(causeAggregation)
    .map(([cause, data]) => ({ cause, avgConfidence: Math.round(data.totalConfidence / data.count), count: data.count }))
    .sort((a, b) => b.avgConfidence - a.avgConfidence)
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Root Cause Analysis</h1>
        <p className="text-slate-400 mt-1 text-sm">AI-identified root causes with confidence scoring</p>
      </div>

      {/* Top root causes across all incidents */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown className="h-5 w-5 text-amber-400" />
          <h3 className="font-semibold text-white">Most Common Root Causes (All Incidents)</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {topCauses.map((tc, i) => (
            <div key={i} className="rounded-xl border border-slate-800/50 bg-slate-800/30 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-slate-300">{i + 1}</span>
                  <span className="text-sm text-white">{tc.cause}</span>
                </div>
                <span className="text-sm font-bold text-amber-400">{tc.avgConfidence}%</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-slate-700/60 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-700" style={{ width: `${tc.avgConfidence}%` }} />
              </div>
              <div className="text-xs text-slate-500 mt-1">Found in {tc.count} incident(s)</div>
            </div>
          ))}
        </div>
      </div>

      {/* Per-incident analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-4 space-y-2 max-h-[calc(100vh-500px)] overflow-y-auto">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9"
              placeholder="Search incidents..."
            />
          </div>
          {filtered.map((inc) => (
            <button
              key={inc.id}
              onClick={() => setSelectedId(inc.id)}
              className={`w-full text-left rounded-xl border p-3 transition-all ${
                selectedId === inc.id ? 'border-sky-500/50 bg-sky-500/10' : 'border-slate-800/50 bg-slate-800/20 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-500">{inc.id}</span>
                {inc.aiAnalysis && <RiskBadge level={inc.aiAnalysis.riskLevel} />}
              </div>
              <div className="text-sm font-medium text-white mt-1 truncate">{inc.title}</div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2">
          {selected && selected.aiAnalysis ? (
            <div className="card p-5 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800/60">
                <GitBranch className="h-5 w-5 text-sky-400" />
                <div>
                  <h2 className="text-lg font-bold text-white">{selected.title}</h2>
                  <span className="text-xs font-mono text-slate-500">{selected.id} · {selected.department}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-semibold text-white">Identified Root Causes</span>
                </div>
                <div className="space-y-3">
                  {selected.aiAnalysis.rootCauses.map((rc, i) => (
                    <div key={i} className="rounded-xl border border-slate-800/50 bg-slate-800/20 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-700/60 text-sm font-bold text-slate-300">{i + 1}</span>
                          <span className="text-sm font-medium text-white">{rc.cause}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-32 h-2 rounded-full bg-slate-700/60 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-700"
                              style={{ width: `${rc.confidence}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-amber-400 w-12 text-right">{rc.confidence}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-4 w-4 text-orange-400" />
                    <span className="text-xs font-semibold text-orange-400">Corrective Action</span>
                  </div>
                  <p className="text-sm text-slate-300">{selected.aiAnalysis.correctiveAction}</p>
                </div>
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-400">Preventive Action</span>
                  </div>
                  <p className="text-sm text-slate-300">{selected.aiAnalysis.preventiveAction}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-12 flex flex-col items-center justify-center min-h-[300px]">
              <GitBranch className="h-12 w-12 text-slate-600" />
              <p className="text-slate-500 mt-4 text-sm">Select an incident to view root cause analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function causeAgacencyHandler(
  agg: Record<string, { count: number; totalConfidence: number }>,
  cause: string,
  confidence: number,
) {
  agg[cause].count += 1;
  agg[cause].totalConfidence += confidence;
}
