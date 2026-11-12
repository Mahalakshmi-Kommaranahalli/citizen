import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Download,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Star,
  ShieldAlert,
  Flame,
  RotateCcw,
  Zap,
  Activity,
  Layers,
  Settings,
  Search,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import CivicMap from '../components/CivicMap';
import SlaBadge from '../components/SlaBadge';
import { api } from '../services/api';

export default function AdminDashboard({
  metrics = null,
  grievances = [],
  departments = [],
  wards = [],
  auditLogs = [],
  onRefresh,
  onOpenGrievance
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'leaderboard' | 'audit' | 'config'
  const [auditSearch, setAuditSearch] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const kpi = metrics?.kpi || {
    totalGrievances: grievances.length,
    resolvedCount: grievances.filter(g => ['RESOLVED', 'CLOSED'].includes(g.status)).length,
    activeCount: grievances.filter(g => !['RESOLVED', 'CLOSED'].includes(g.status)).length,
    activeBreachesCount: grievances.filter(g => g.slaMetrics?.isBreached && !['RESOLVED', 'CLOSED'].includes(g.status)).length,
    overallSlaCompliance: 89,
    avgResolutionHours: '16.5',
    averageCsat: '4.8'
  };

  const deptStats = metrics?.departmentStats || [];

  const handleExportCsv = () => {
    window.open('/api/analytics/export/csv', '_blank');
  };

  const handleResetData = async () => {
    if (!window.confirm('Reset database to clean initial demo civic dataset?')) return;
    try {
      setIsResetting(true);
      await api.resetDatabase();
      if (onRefresh) onRefresh();
    } catch (e) {
      alert('Error resetting: ' + e.message);
    } finally {
      setIsResetting(false);
    }
  };

  const handleManualAudit = async () => {
    try {
      await api.runSlaAudit();
      alert('SLA Audit completed across all active grievances.');
      if (onRefresh) onRefresh();
    } catch (e) {
      alert(e.message);
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    if (!auditSearch.trim()) return true;
    const q = auditSearch.toLowerCase();
    return (
      (log.trackingToken && log.trackingToken.toLowerCase().includes(q)) ||
      (log.action && log.action.toLowerCase().includes(q)) ||
      (log.actor && log.actor.toLowerCase().includes(q)) ||
      (log.details && log.details.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Executive Command Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              Municipal Commissioner & District Magistrate Command Center
            </h1>
            <p className="text-xs text-slate-500">
              City-Wide Grievance Redressal Monitoring, SLA Compliance & Automated Escalation Oversight
            </p>
          </div>
        </div>

        {/* Global Admin Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleManualAudit}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Audit SLAs</span>
          </button>
          <button
            onClick={handleResetData}
            disabled={isResetting}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium transition-colors"
            title="Restore original demo grievances"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Grievances */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Total Grievances</span>
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {kpi.totalGrievances}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Active: <strong className="text-slate-800 dark:text-slate-200">{kpi.activeCount}</strong> in progress
          </div>
        </div>

        {/* Card 2: SLA Adherence % */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>SLA Compliance</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
            {kpi.overallSlaCompliance}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Resolved within SLA window
          </div>
        </div>

        {/* Card 3: Active Breaches */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Active SLA Breaches</span>
            <AlertOctagon className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-black text-red-600 dark:text-red-400 mt-2 flex items-center gap-2">
            <span>{kpi.activeBreachesCount}</span>
            {kpi.activeBreachesCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-950 font-bold animate-pulse">
                High Risk
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Escalated to Zonal/Dept Heads
          </div>
        </div>

        {/* Card 4: Avg Turnaround */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Avg Resolution Time</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {kpi.avgResolutionHours} <span className="text-sm font-semibold text-slate-400">hrs</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            City average from lodging
          </div>
        </div>

        {/* Card 5: CSAT Score */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Citizen Satisfaction</span>
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2 flex items-center gap-1.5">
            <span>{kpi.averageCsat}</span>
            <span className="text-xs font-semibold text-slate-400">/ 5.0</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Based on post-resolution reviews
          </div>
        </div>
      </div>

      {/* Primary Tab Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-bold gap-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Geo-Spatial Map & Critical Alerts
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`py-3 border-b-2 transition-colors ${
            activeTab === 'leaderboard'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Department Performance Leaderboard ({deptStats.length})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`py-3 border-b-2 transition-colors ${
            activeTab === 'audit'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          System Audit Trail & Escalation Logs ({auditLogs.length})
        </button>
      </div>

      {/* TAB 1: GEO SPATIAL MAP & CRITICAL BREACH TICKER */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Map (7 Cols) */}
          <div className="lg:col-span-7">
            <CivicMap
              grievances={grievances}
              onSelectGrievance={onOpenGrievance}
            />
          </div>

          {/* Right: Urgent Escalate List & Priority Breakdown (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Urgent Escalated / Breached List */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-red-500" />
                  <span>Escalated & High-Priority Attention List</span>
                </h3>
                <span className="text-[11px] font-mono text-red-600 font-bold">
                  {grievances.filter(g => g.escalationLevel > 0 || g.slaMetrics?.isBreached).length} Cases
                </span>
              </div>

              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {grievances
                  .filter(g => (g.escalationLevel > 0 || g.slaMetrics?.isBreached) && !['RESOLVED', 'CLOSED'].includes(g.status))
                  .slice(0, 5)
                  .map((g) => (
                    <div
                      key={g.id}
                      onClick={() => onOpenGrievance(g)}
                      className="p-3 rounded-xl border border-red-200 dark:border-red-950 bg-red-50/40 dark:bg-red-950/20 hover:border-red-400 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          {g.trackingToken}
                        </span>
                        <SlaBadge grievance={g} />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1 line-clamp-1">
                        {g.title}
                      </h4>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                        <span>{g.wardName.split(' - ')[0]}</span>
                        <span className="text-red-600 font-semibold">{g.assignedOfficer?.name}</span>
                      </div>
                    </div>
                  ))}

                {grievances.filter(g => (g.escalationLevel > 0 || g.slaMetrics?.isBreached) && !['RESOLVED', 'CLOSED'].includes(g.status)).length === 0 && (
                  <div className="py-8 text-center text-xs text-slate-400">
                    🎉 Excellent! No active SLA breaches or escalated tickets.
                  </div>
                )}
              </div>
            </div>

            {/* Ward-wise Distribution Summary */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                Ward-Wise Incident Distribution
              </h3>
              <div className="space-y-2.5">
                {wards.map((w) => {
                  const wardTickets = grievances.filter(g => g.wardId === w.id);
                  const wardActive = wardTickets.filter(g => !['RESOLVED', 'CLOSED'].includes(g.status));
                  const pct = grievances.length > 0 ? Math.round((wardTickets.length / grievances.length) * 100) : 0;

                  return (
                    <div key={w.id} className="text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{w.name.split(' - ')[0]}</span>
                        <span className="text-slate-500 text-[11px]">{wardTickets.length} cases ({wardActive.length} active)</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DEPARTMENT PERFORMANCE LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Municipal Department SLA Performance Matrix
              </h3>
              <p className="text-xs text-slate-500">
                Ranked by SLA adherence compliance and speed of resolution
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5">Superintending Head</th>
                  <th className="p-3.5 text-center">Total Cases</th>
                  <th className="p-3.5 text-center">Active</th>
                  <th className="p-3.5 text-center">Breached</th>
                  <th className="p-3.5 text-center">Resolved On-Time</th>
                  <th className="p-3.5">SLA Compliance Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {deptStats.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                        <span>{d.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold">
                          {d.shortCode}
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400">
                      {departments.find(dept => dept.id === d.id)?.headOfficer?.name || 'Superintending Eng.'}
                    </td>
                    <td className="p-3.5 text-center font-bold">{d.total}</td>
                    <td className="p-3.5 text-center text-blue-600 font-semibold">{d.active}</td>
                    <td className="p-3.5 text-center text-red-600 font-bold">{d.breached}</td>
                    <td className="p-3.5 text-center text-emerald-600 font-bold">{d.resolvedOnTime}</td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden max-w-[120px]">
                          <div
                            className={`h-full rounded-full ${
                              d.slaCompliance >= 90 ? 'bg-emerald-500' :
                              d.slaCompliance >= 75 ? 'bg-amber-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${d.slaCompliance}%` }}
                          ></div>
                        </div>
                        <span className="font-bold font-mono text-[11px] text-slate-800 dark:text-slate-200">
                          {d.slaCompliance}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SYSTEM AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Immutable System Audit Trail
              </h3>
              <p className="text-xs text-slate-500">
                Log of all automated routing classifications, SLA escalations, officer actions and citizen reviews
              </p>
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search audit logs..."
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">Token</th>
                  <th className="p-3.5">Action Code</th>
                  <th className="p-3.5">Actor</th>
                  <th className="p-3.5">Details & Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                {filteredLogs.slice(0, 50).map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="p-3.5 text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3.5 font-bold text-emerald-600 dark:text-emerald-400">
                      {log.trackingToken}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.action.includes('ESCALAT') ? 'bg-red-100 text-red-700' :
                        log.action.includes('ROUTED') ? 'bg-cyan-100 text-cyan-700' :
                        'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3.5 font-sans font-medium text-slate-700 dark:text-slate-300">
                      {log.actor}
                    </td>
                    <td className="p-3.5 font-sans text-slate-600 dark:text-slate-400 max-w-md truncate">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

