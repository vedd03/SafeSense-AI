import { useState } from 'react';
import { useApp } from '@/lib/store';
import { RiskBadge, SeverityBadge, PriorityBadge, StatusBadge } from '@/components/Badges';
import {
  Brain,
  Sparkles,
  Search,
  AlertTriangle,
  Wrench,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { formatDate } from '@/lib/analytics';
import type { Incident } from '@/lib/types';

export function AIAnalysisPage() {
  const { incidents } = useApp();
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(
    incidents.length > 0 ? incidents[0].id : null,
  );

  const filtered = incidents.filter(
    (i) =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase()),
  );

  const selected: Incident | null = incidents.find((i) => i.id === selectedId) ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">AI Analysis</h1>
        <p className="text-slate-400 mt-1 text-sm">View AI-powered hazard analysis for each incident</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incident list */}
        <div className="card p-4 space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
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
                selectedId === inc.id
                  ? 'border-sky-500/50 bg-sky-500/10'
                  : 'border-slate-800/50 bg-slate-800/20 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-500">{inc.id}</span>
                {inc.aiAnalysis && <RiskBadge level={inc.aiAnalysis.riskLevel} />}
              </div>
              <div className="text-sm font-medium text-white mt-1 truncate">{inc.title}</div>
              <div className="text-xs text-slate-500 mt-0.5">{inc.department}</div>
            </button>
          ))}
        </div>

        {/* Analysis detail */}
        <div className="lg:col-span-2">
          {selected && selected.aiAnalysis ? (
            <div className="space-y-4">
              {/* Incident header */}
              <div className="card p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-500">{selected.id}</span>
                      <StatusBadge status={selected.status} />
                    </div>
                    <h2 className="text-lg font-bold text-white mt-2">{selected.title}</h2>
                    <p className="text-sm text-slate-400 mt-2">{selected.description}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500">
                      <span>{selected.department}</span>
                      <span>·</span>
                      <span>{selected.location}</span>
                      <span>·</span>
                      <span>{formatDate(selected.dateTime)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Analysis */}
              <div className="card overflow-hidden">
                <div className="flex items-center gap-2 border-b border-slate-800/60 bg-gradient-to-r from-sky-500/10 to-blue-600/10 px-5 py-3">
                  <Brain className="h-5 w-5 text-sky-400" />
                  <span className="text-sm font-semibold text-white">AI Hazard Analysis</span>
                  <Sparkles className="h-4 w-4 text-sky-400 ml-auto" />
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Detected Hazard</div>
                    <div className="text-sm text-white mt-1">{selected.aiAnalysis.detectedHazard}</div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 rounded-lg bg-slate-800/50 px-3 py-1.5">
                      <span className="text-xs text-slate-400">Category:</span>
                      <span className="text-xs font-semibold text-white">{selected.aiAnalysis.hazardCategory}</span>
                    </div>
                    <SeverityBadge level={selected.aiAnalysis.severity} />
                    <RiskBadge level={selected.aiAnalysis.riskLevel} />
                    <PriorityBadge level={selected.aiAnalysis.priority} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-slate-800/50 bg-slate-800/30 p-3">
                      <div className="text-xs text-slate-400">Risk Score</div>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className={`text-3xl font-bold ${selected.aiAnalysis.riskScore >= 8 ? 'text-red-400' : selected.aiAnalysis.riskScore >= 6 ? 'text-orange-400' : selected.aiAnalysis.riskScore >= 4 ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {selected.aiAnalysis.riskScore}
                        </span>
                        <span className="text-sm text-slate-500">/ 10</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-slate-700/60 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${(selected.aiAnalysis.riskScore / 10) * 100}%`,
                            backgroundColor: selected.aiAnalysis.riskScore >= 8 ? '#ef4444' : selected.aiAnalysis.riskScore >= 6 ? '#f97316' : selected.aiAnalysis.riskScore >= 4 ? '#f59e0b' : '#10b981',
                          }}
                        />
                      </div>
                    </div>
                    <div className="rounded-xl border border-slate-800/50 bg-slate-800/30 p-3">
                      <div className="text-xs text-slate-400">Probability</div>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-3xl font-bold text-sky-400">{selected.aiAnalysis.probability}</span>
                        <span className="text-sm text-slate-500">/ 10</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-slate-700/60 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-sky-500 transition-all duration-700"
                          style={{ width: `${(selected.aiAnalysis.probability / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Root causes */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-amber-400" />
                      <span className="text-xs font-semibold text-white">Possible Root Causes</span>
                    </div>
                    <div className="space-y-2">
                      {selected.aiAnalysis.rootCauses.map((rc, i) => (
                        <div key={i}>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-300">{rc.cause}</span>
                            <span className="text-slate-400 font-semibold">{rc.confidence}%</span>
                          </div>
                          <div className="mt-1 h-1.5 rounded-full bg-slate-700/60 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-500 transition-all duration-700"
                              style={{ width: `${rc.confidence}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Wrench className="h-4 w-4 text-orange-400" />
                      <span className="text-xs font-semibold text-orange-400">Corrective Action</span>
                    </div>
                    <p className="text-sm text-slate-300">{selected.aiAnalysis.correctiveAction}</p>
                  </div>

                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      <span className="text-xs font-semibold text-emerald-400">Preventive Action</span>
                    </div>
                    <p className="text-sm text-slate-300">{selected.aiAnalysis.preventiveAction}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-12 flex flex-col items-center justify-center min-h-[400px]">
              <Brain className="h-12 w-12 text-slate-600" />
              <p className="text-slate-500 mt-4 text-sm">Select an incident to view its AI analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
