import React, { useState } from 'react';
import {
  HardHat,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  Check,
  Send,
  MessageSquare,
  ShieldAlert,
  ArrowRightLeft,
  ChevronRight,
  Eye,
  Camera,
  MapPin
} from 'lucide-react';
import SlaBadge from '../components/SlaBadge';
import { api } from '../services/api';

export default function OfficerPortal({
  departments = [],
  wards = [],
  grievances = [],
  onRefresh,
  onOpenGrievance
}) {
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [selectedWardId, setSelectedWardId] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'IN_PROGRESS' | 'WARNING' | 'BREACHED' | 'RESOLVED'

  // Action Modals State
  const [actionModal, setActionModal] = useState(null); // { type: 'RESOLVE' | 'LOG' | 'REASSIGN', grievance }
  const [actionNotes, setActionNotes] = useState('');
  const [resolutionProof, setResolutionProof] = useState('https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80');
  const [targetDeptId, setTargetDeptId] = useState(departments[0]?.id || 'DEPT_ROADS');
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter Grievances
  const filtered = grievances.filter(g => {
    if (selectedDeptId && g.departmentId !== selectedDeptId) return false;
    if (selectedWardId && g.wardId !== selectedWardId) return false;

    if (statusFilter === 'PENDING') return ['SUBMITTED', 'ASSIGNED'].includes(g.status);
    if (statusFilter === 'IN_PROGRESS') return g.status === 'IN_PROGRESS';
    if (statusFilter === 'WARNING') return g.slaMetrics?.isWarning;
    if (statusFilter === 'BREACHED') return g.slaMetrics?.isBreached || (g.escalationLevel && g.escalationLevel > 0 && !['RESOLVED', 'CLOSED'].includes(g.status));
    if (statusFilter === 'RESOLVED') return ['RESOLVED', 'CLOSED'].includes(g.status);
    return true;
  });

  // KPI calculations for Officer
  const totalCount = grievances.length;
  const pendingCount = grievances.filter(g => ['SUBMITTED', 'ASSIGNED'].includes(g.status)).length;
  const inProgressCount = grievances.filter(g => g.status === 'IN_PROGRESS').length;
  const breachedCount = grievances.filter(g => g.slaMetrics?.isBreached && !['RESOLVED', 'CLOSED'].includes(g.status)).length;
  const resolvedCount = grievances.filter(g => ['RESOLVED', 'CLOSED'].includes(g.status)).length;

  const handleStartWork = async (grievance) => {
    try {
      await api.updateStatus(grievance.id, {
        status: 'IN_PROGRESS',
        notes: 'Officer acknowledged and mobilized field repair team to ground site.',
        actorName: grievance.assignedOfficer?.name || 'Field Officer'
      });
      if (onRefresh) onRefresh();
    } catch (e) {
      alert('Error updating status: ' + e.message);
    }
  };

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    if (!actionModal) return;

    try {
      setIsProcessing(true);
      const g = actionModal.grievance;

      if (actionModal.type === 'RESOLVE') {
        await api.updateStatus(g.id, {
          status: 'RESOLVED',
          notes: actionNotes || 'Civil work completed and verified on ground.',
          proofImage: resolutionProof,
          actorName: g.assignedOfficer?.name || 'Field Officer'
        });
      } else if (actionModal.type === 'LOG') {
        await api.addActionLog(g.id, {
          note: actionNotes || 'Field inspection conducted. Materials and manpower deployed.',
          actionTitle: 'Inspection & Progress Log',
          actorName: g.assignedOfficer?.name || 'Field Officer'
        });
      } else if (actionModal.type === 'REASSIGN') {
        await api.reassignGrievance(g.id, {
          newDepartmentId: targetDeptId,
          reason: actionNotes || 'Transferred to proper departmental jurisdiction.',
          supervisorName: 'Ward Supervisor'
        });
      }

      setActionModal(null);
      setActionNotes('');
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Action error: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Officer Command Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <HardHat className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white">
                Department Field Staff & Supervisor Workdesk
              </h1>
              <p className="text-xs text-slate-500">
                Action work tickets, upload ground resolution proof, and address SLA escalation alerts.
              </p>
            </div>
          </div>

          {/* Quick Stats Chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
              Active Queue: <span className="text-slate-900 dark:text-white">{pendingCount + inProgressCount}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-xs font-bold text-red-700 dark:text-red-300">
              Breached / Escalated: {breachedCount}
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              Resolved: {resolvedCount}
            </div>
          </div>
        </div>

        {/* Filters Row */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Filter by Department
            </label>
            <select
              value={selectedDeptId}
              onChange={(e) => setSelectedDeptId(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="">All Civic Departments ({departments.length})</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.shortCode})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Filter by Ward
            </label>
            <select
              value={selectedWardId}
              onChange={(e) => setSelectedWardId(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="">All Municipal Wards ({wards.length})</option>
              {wards.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Filter by SLA Status
            </label>
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-2 rounded-xl font-bold transition-colors whitespace-nowrap ${
                  statusFilter === 'ALL' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('PENDING')}
                className={`px-3 py-2 rounded-xl font-bold transition-colors whitespace-nowrap ${
                  statusFilter === 'PENDING' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setStatusFilter('BREACHED')}
                className={`px-3 py-2 rounded-xl font-bold transition-colors whitespace-nowrap ${
                  statusFilter === 'BREACHED' ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Breached
              </button>
              <button
                onClick={() => setStatusFilter('RESOLVED')}
                className={`px-3 py-2 rounded-xl font-bold transition-colors whitespace-nowrap ${
                  statusFilter === 'RESOLVED' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Resolved
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grievances Work Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span>Active Work Tickets ({filtered.length} found)</span>
          <span>Sorted by Urgency & SLA Deadline</span>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
            No grievances match the selected department and status filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((g) => {
              const isClosedOrResolved = ['RESOLVED', 'CLOSED'].includes(g.status);
              const isCritical = g.priority === 'CRITICAL';

              return (
                <div
                  key={g.id}
                  className={`bg-white dark:bg-slate-900 p-5 rounded-2xl border transition-all ${
                    g.slaMetrics?.isBreached && !isClosedOrResolved
                      ? 'border-red-300 dark:border-red-900/80 shadow-md shadow-red-500/5'
                      : isCritical && !isClosedOrResolved
                      ? 'border-orange-300 dark:border-orange-900/80'
                      : 'border-slate-200 dark:border-slate-800 shadow-xs'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {g.trackingToken}
                        </span>
                        <SlaBadge grievance={g} />
                        <span className="text-xs text-slate-500 font-medium">
                          {g.departmentName}
                        </span>
                      </div>

                      <h3
                        onClick={() => onOpenGrievance(g)}
                        className="text-sm font-bold text-slate-900 dark:text-white mt-2 hover:text-emerald-600 transition-colors cursor-pointer"
                      >
                        {g.title}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {g.description}
                      </p>

                      <div className="mt-3 flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                        <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                          <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                          {g.wardName} - {g.address}
                        </span>
                        <span>Assignee: <strong className="text-slate-800 dark:text-slate-200">{g.assignedOfficer?.name}</strong></span>
                        <span>Citizen: {g.citizen?.name} ({g.citizen?.phone || 'Confidential'})</span>
                      </div>
                    </div>

                    {/* Action Controls for Officer */}
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 flex-shrink-0">
                      {!isClosedOrResolved && g.status !== 'IN_PROGRESS' && (
                        <button
                          onClick={() => handleStartWork(g)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Acknowledge & Start</span>
                        </button>
                      )}

                      {!isClosedOrResolved && (
                        <button
                          onClick={() => setActionModal({ type: 'LOG', grievance: g })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Add Progress Log</span>
                        </button>
                      )}

                      {!isClosedOrResolved && (
                        <button
                          onClick={() => setActionModal({ type: 'RESOLVE', grievance: g })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Submit Resolution</span>
                        </button>
                      )}

                      {!isClosedOrResolved && (
                        <button
                          onClick={() => setActionModal({ type: 'REASSIGN', grievance: g })}
                          title="Reroute to another department"
                          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => onOpenGrievance(g)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-emerald-600 font-bold"
                      >
                        <span>Dossier</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Action Dialog / Modal */}
      {actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl animate-fade-in">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {actionModal.type === 'RESOLVE' && 'Submit Redressal Proof & Close Work Order'}
              {actionModal.type === 'LOG' && 'Add Inspection / Progress Action Note'}
              {actionModal.type === 'REASSIGN' && 'Department Rerouting & Officer Reassignment'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Ticket: <strong className="font-mono">{actionModal.grievance.trackingToken}</strong> - {actionModal.grievance.title}
            </p>

            <form onSubmit={handleActionSubmit} className="mt-4 space-y-4">
              {actionModal.type === 'REASSIGN' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Select Target Department *
                  </label>
                  <select
                    value={targetDeptId}
                    onChange={(e) => setTargetDeptId(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.shortCode})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {actionModal.type === 'RESOLVE' ? 'Resolution Work Summary & Material Report *' : 'Action Details & Remarks *'}
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detail the exact corrective actions taken, materials consumed, and inspection results..."
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                ></textarea>
              </div>

              {actionModal.type === 'RESOLVE' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    After-Resolution Verification Photo Proof URL
                  </label>
                  <input
                    type="url"
                    value={resolutionProof}
                    onChange={(e) => setResolutionProof(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Upload photo proving road restored, garbage cleared, or leak repaired.
                  </span>
                </div>
              )}

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setActionModal(null)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  {isProcessing ? 'Recording...' : 'Confirm Action'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

