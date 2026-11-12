import React from 'react';
import { Clock, AlertTriangle, AlertOctagon, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function SlaBadge({ grievance, compact = false }) {
  if (!grievance) return null;

  const { status, escalationLevel, slaMetrics, priority } = grievance;
  const isResolvedOrClosed = ["RESOLVED", "CLOSED"].includes(status);

  // Escalation Badges take priority if escalated
  if (escalationLevel > 0 && !isResolvedOrClosed) {
    const levelColors = {
      1: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
      2: "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800",
      3: "bg-red-100 text-red-800 border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800 animate-pulse"
    };

    return (
      <div className="inline-flex items-center gap-1.5">
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${levelColors[escalationLevel] || levelColors[1]}`}>
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>SLA Escalation L{escalationLevel}</span>
        </span>
        {slaMetrics?.breachFormatted && !compact && (
          <span className="text-xs text-red-600 dark:text-red-400 font-medium">
            ({slaMetrics.breachFormatted})
          </span>
        )}
      </div>
    );
  }

  if (isResolvedOrClosed) {
    const wasOnTime = slaMetrics?.slaStatus === "RESOLVED_ON_TIME";
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
        wasOnTime
          ? "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
          : "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
      }`}>
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>{wasOnTime ? "Resolved Within SLA" : "Resolved (Past SLA)"}</span>
      </span>
    );
  }

  // Active Ticket SLA Status
  if (slaMetrics?.isBreached) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800 animate-pulse">
        <AlertOctagon className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
        <span>SLA Breached {slaMetrics.breachFormatted ? `(${slaMetrics.breachFormatted})` : ''}</span>
      </span>
    );
  }

  if (slaMetrics?.isWarning) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
        <span>SLA Warning: {slaMetrics.remainingFormatted} left ({slaMetrics.elapsedPercentage}%)</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
      <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
      <span>SLA On Track: {slaMetrics?.remainingFormatted || `${grievance.slaHours}h`} left</span>
    </span>
  );
}

