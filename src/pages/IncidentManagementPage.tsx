import { useState } from 'react';
import { useApp } from '@/lib/store';
import { RiskBadge, StatusBadge, SeverityBadge } from '@/components/Badges';
import { Modal } from '@/components/Modal';
import { formatDate, timeAgo } from '@/lib/analytics';
import type { Incident, ReportStatus } from '@/lib/types';
import {
  Search,
  Filter,
  ClipboardList,
  Eye,
  Wrench,
  ShieldCheck,
  AlertTriangle,
  Brain,
  MapPin,
  User,
  Calendar,
  Mic,
  Image as ImageIcon,
} from 'lucide-react';

const STATUS_OPTIONS: ReportStatus[] = ['Submitted', 'Under Review', 'In Progress', 'Resolved', 'Closed'];

export function IncidentManagementPage() {
  const { incidents, updateIncidentStatus, pushToast } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [selected, setSelected] = useState<Incident | null>(null);

  const departments = Array.from(new Set(incidents.map((i) => i.department)));

  const filtered = incidents.filter((i) => {
    const matchSearch =
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase()) ||
      i.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || i.status === statusFilter;
    const matchDept = deptFilter === 'all' || i.department === deptFilter;
    return matchSearch && matchStatus && matchDept;
  });

  const handleStatusChange = (id: string, status: ReportStatus) => {
    updateIncidentStatus(id, status);
    pushToast(`Incident ${id} status updated to ${status}`, 'success');
    if (selected && selected.id === id) {
      setSelected({ ...selected, status });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Incident Management</h1>
        <p className="text-slate-400 mt-1 text-sm">Manage all reported incidents and update their status</p>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
            placeholder="Search by title, description, or ID..."
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field !w-auto">
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="input-field !w-auto">
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div className="text-sm text-slate-400">
          {filtered.length} incident(s)
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800/60 bg-slate-800/30">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Incident</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Department</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Risk</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:table-cell">Date</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inc) => (
                <tr key={inc.id} className="border-b border-slate-800/40 hover:bg-slate-800/20 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-slate-400">{inc.id}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-white">{inc.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                      <SeverityBadge level={inc.severity} />
                      {inc.anonymous && <span className="text-slate-600">· Anonymous</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300 hidden md:table-cell">{inc.department}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {inc.aiAnalysis ? <RiskBadge level={inc.aiAnalysis.riskLevel} /> : <span className="text-slate-600 text-xs">N/A</span>}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={inc.status}
                      onChange={(e) => handleStatusChange(inc.id, e.target.value as ReportStatus)}
                      className="rounded-md border border-slate-700 bg-slate-800/60 px-2 py-1 text-xs text-white outline-none focus:border-sky-500"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400 hidden sm:table-cell">{timeAgo(inc.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelected(inc)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-700/50 hover:text-sky-400 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-slate-500 text-sm">
            <ClipboardList className="h-10 w-10 mx-auto mb-2 text-slate-600" />
            No incidents found matching your filters
          </div>
        )}
      </div>

      {/* Detail modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={`Incident ${selected?.id ?? ''}`}
        size="xl"
      >
        {selected && (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-bold text-white">{selected.title}</h3>
              <p className="text-sm text-slate-400 mt-2">{selected.description}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="rounded-xl border border-slate-800/50 bg-slate-800/30 p-3">
                <div className="flex items-center gap-2 text-xs text-slate-400"><MapPin className="h-3.5 w-3.5" /> Department</div>
                <div className="text-sm text-white mt-1">{selected.department}</div>
              </div>
              <div className="rounded-xl border border-slate-800/50 bg-slate-800/30 p-3">
                <div className="flex items-center gap-2 text-xs text-slate-400"><MapPin className="h-3.5 w-3.5" /> Location</div>
                <div className="text-sm text-white mt-1">{selected.location}</div>
              </div>
              <div className="rounded-xl border border-slate-800/50 bg-slate-800/30 p-3">
                <div className="flex items-center gap-2 text-xs text-slate-400"><Calendar className="h-3.5 w-3.5" /> Date/Time</div>
                <div className="text-sm text-white mt-1">{formatDate(selected.dateTime)}</div>
              </div>
              <div className="rounded-xl border border-slate-800/50 bg-slate-800/30 p-3">
                <div className="flex items-center gap-2 text-xs text-slate-400"><User className="h-3.5 w-3.5" /> Reporter</div>
                <div className="text-sm text-white mt-1">{selected.anonymous ? 'Anonymous' : selected.reporterName}</div>
              </div>
              <div className="rounded-xl border border-slate-800/50 bg-slate-800/30 p-3">
                <div className="flex items-center gap-2 text-xs text-slate-400"><AlertTriangle className="h-3.5 w-3.5" /> Severity</div>
                <div className="text-sm text-white mt-1"><SeverityBadge level={selected.severity} /></div>
              </div>
              <div className="rounded-xl border border-slate-800/50 bg-slate-800/30 p-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">Attachments</div>
                <div className="flex items-center gap-2 mt-1">
                  {selected.hasImage && <span className="flex items-center gap-1 text-xs text-sky-400"><ImageIcon className="h-3 w-3" /> Image</span>}
                  {selected.hasVoice && <span className="flex items-center gap-1 text-xs text-sky-400"><Mic className="h-3 w-3" /> Voice</span>}
                  {!selected.hasImage && !selected.hasVoice && <span className="text-xs text-slate-500">None</span>}
                </div>
              </div>
            </div>

            {selected.aiAnalysis && (
              <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="h-5 w-5 text-sky-400" />
                  <span className="text-sm font-semibold text-white">AI Analysis</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <div>
                    <div className="text-xs text-slate-400">Risk Score</div>
                    <div className="text-xl font-bold text-white">{selected.aiAnalysis.riskScore}/10</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Probability</div>
                    <div className="text-xl font-bold text-white">{selected.aiAnalysis.probability}/10</div>
                  </div>
                  <div><RiskBadge level={selected.aiAnalysis.riskLevel} /></div>
                  <StatusBadge status={selected.status} />
                </div>

                <div className="space-y-2 mt-3">
                  {selected.aiAnalysis.rootCauses.map((rc, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">{rc.cause}</span>
                        <span className="text-slate-400 font-semibold">{rc.confidence}%</span>
                      </div>
                      <div className="mt-1 h-1.5 rounded-full bg-slate-700/60 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-500 transition-all duration-700" style={{ width: `${rc.confidence}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 rounded-lg border border-orange-500/20 bg-orange-500/5 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Wrench className="h-4 w-4 text-orange-400" />
                    <span className="text-xs font-semibold text-orange-400">Corrective Action</span>
                  </div>
                  <p className="text-sm text-slate-300">{selected.aiAnalysis.correctiveAction}</p>
                </div>
                <div className="mt-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-400">Preventive Action</span>
                  </div>
                  <p className="text-sm text-slate-300">{selected.aiAnalysis.preventiveAction}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <label className="text-sm text-slate-400">Update Status:</label>
              <select
                value={selected.status}
                onChange={(e) => handleStatusChange(selected.id, e.target.value as ReportStatus)}
                className="input-field !w-auto"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
