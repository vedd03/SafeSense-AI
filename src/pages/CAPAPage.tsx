import { useState } from 'react';
import { useApp } from '@/lib/store';
import { Modal } from '@/components/Modal';
import { StatusBadge } from '@/components/Badges';
import { formatDate, formatDateShort } from '@/lib/analytics';
import type { CAPA, CAPAStatus } from '@/lib/types';
import {
  CheckSquare,
  Plus,
  Calendar,
  User,
  Wrench,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Search,
} from 'lucide-react';

const CAPA_STATUSES: CAPAStatus[] = ['Open', 'In Progress', 'Pending Review', 'Completed', 'Overdue'];

export function CAPAPage() {
  const { capas, incidents, addCAPA, updateCAPAStatus, pushToast } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Form state
  const [incidentId, setIncidentId] = useState(incidents[0]?.id ?? '');
  const [type, setType] = useState<'Corrective' | 'Preventive'>('Corrective');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);

  const filtered = capas.filter((c) => {
    const matchSearch =
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.assignedTo.toLowerCase().includes(search.toLowerCase()) ||
      c.incidentTitle.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchType = typeFilter === 'all' || c.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const stats = {
    open: capas.filter((c) => c.status === 'Open').length,
    inProgress: capas.filter((c) => c.status === 'In Progress').length,
    pending: capas.filter((c) => c.status === 'Pending Review').length,
    completed: capas.filter((c) => c.status === 'Completed').length,
    overdue: capas.filter((c) => c.status === 'Overdue' || (c.status !== 'Completed' && new Date(c.dueDate) < new Date())).length,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !assignedTo.trim()) {
      pushToast('Please fill in all fields', 'warning');
      return;
    }
    const incident = incidents.find((i) => i.id === incidentId);
    addCAPA({
      incidentId,
      incidentTitle: incident?.title ?? 'Unknown',
      type,
      description: description.trim(),
      assignedTo: assignedTo.trim(),
      dueDate: new Date(dueDate).toISOString(),
      status: 'Open',
    });
    pushToast('CAPA created successfully', 'success');
    setShowModal(false);
    setDescription('');
    setAssignedTo('');
  };

  const handleStatusChange = (id: string, status: CAPAStatus) => {
    updateCAPAStatus(id, status);
    pushToast(`CAPA status updated to ${status}`, 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">CAPA Tracking</h1>
          <p className="text-slate-400 mt-1 text-sm">Corrective and Preventive Action management</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus className="h-4 w-4" />
          New CAPA
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Open', value: stats.open, color: 'text-sky-400', border: 'border-sky-500/20' },
          { label: 'In Progress', value: stats.inProgress, color: 'text-amber-400', border: 'border-amber-500/20' },
          { label: 'Pending Review', value: stats.pending, color: 'text-violet-400', border: 'border-violet-500/20' },
          { label: 'Completed', value: stats.completed, color: 'text-emerald-400', border: 'border-emerald-500/20' },
          { label: 'Overdue', value: stats.overdue, color: 'text-red-400', border: 'border-red-500/20' },
        ].map((s) => (
          <div key={s.label} className={`card p-4 border ${s.border}`}>
            <div className="text-xs text-slate-400 font-medium">{s.label}</div>
            <div className={`text-2xl font-bold ${s.color} mt-1`}>{s.value}</div>
          </div>
        ))}
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
            placeholder="Search CAPAs..."
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field !w-auto">
          <option value="all">All Statuses</option>
          {CAPA_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="input-field !w-auto">
          <option value="all">All Types</option>
          <option value="Corrective">Corrective</option>
          <option value="Preventive">Preventive</option>
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800/60 bg-slate-800/30">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Description</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase hidden md:table-cell">Assigned To</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase hidden lg:table-cell">Due Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const isOverdue = c.status !== 'Completed' && new Date(c.dueDate) < new Date();
                return (
                  <tr key={c.id} className="border-b border-slate-800/40 hover:bg-slate-800/20 transition-colors">
                    <td className="px-4 py-3 text-xs font-mono text-slate-400">{c.id}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-semibold ${
                        c.type === 'Corrective' ? 'bg-orange-500/15 text-orange-400' : 'bg-emerald-500/15 text-emerald-400'
                      }`}>
                        {c.type === 'Corrective' ? <Wrench className="h-3 w-3" /> : <ShieldCheck className="h-3 w-3" />}
                        {c.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-white max-w-xs truncate">{c.description}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{c.incidentTitle}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-300 hidden md:table-cell">{c.assignedTo}</td>
                    <td className="px-4 py-3 text-sm hidden lg:table-cell">
                      <span className={isOverdue ? 'text-red-400 font-medium' : 'text-slate-400'}>
                        {formatDateShort(c.dueDate)}
                      </span>
                      {isOverdue && <span className="text-xs text-red-400 ml-1">· Overdue</span>}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={c.status}
                        onChange={(e) => handleStatusChange(c.id, e.target.value as CAPAStatus)}
                        className="rounded-md border border-slate-700 bg-slate-800/60 px-2 py-1 text-xs text-white outline-none focus:border-sky-500"
                      >
                        {CAPA_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-slate-500 text-sm">
            <CheckSquare className="h-10 w-10 mx-auto mb-2 text-slate-600" />
            No CAPAs found
          </div>
        )}
      </div>

      {/* Create modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Create New CAPA" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Related Incident</label>
            <select value={incidentId} onChange={(e) => setIncidentId(e.target.value)} className="input-field">
              {incidents.map((i) => (
                <option key={i.id} value={i.id}>{i.id} — {i.title}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value as 'Corrective' | 'Preventive')} className="input-field">
                <option value="Corrective">Corrective</option>
                <option value="Preventive">Preventive</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Due Date</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field min-h-[80px]"
              placeholder="Describe the corrective or preventive action..."
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Assign To</label>
            <input
              type="text"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="input-field"
              placeholder="Person or team responsible"
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">
              <Plus className="h-4 w-4" />
              Create CAPA
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
