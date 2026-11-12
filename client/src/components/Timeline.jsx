import React from 'react';
import { CheckCircle2, Clock, Bot, UserCheck, AlertTriangle, MessageSquareQuote, ShieldAlert } from 'lucide-react';

export default function Timeline({ timeline = [] }) {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="py-8 text-center text-slate-400 text-sm">
        No timeline events recorded yet.
      </div>
    );
  }

  const getStepIcon = (item) => {
    const title = (item.title || '').toLowerCase();
    if (title.includes('escalat')) return <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400" />;
    if (title.includes('auto-routing') || title.includes('intelligent')) return <Bot className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />;
    if (title.includes('resolved') || title.includes('closed')) return <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    if (title.includes('feedback')) return <MessageSquareQuote className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
    if (title.includes('inspection') || title.includes('order')) return <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    return <Clock className="w-4 h-4 text-slate-500" />;
  };

  const getStepBadgeBg = (item) => {
    const title = (item.title || '').toLowerCase();
    if (title.includes('escalat')) return 'bg-red-100 border-red-200 dark:bg-red-950/60 dark:border-red-800';
    if (title.includes('auto-routing') || title.includes('intelligent')) return 'bg-cyan-100 border-cyan-200 dark:bg-cyan-950/60 dark:border-cyan-800';
    if (title.includes('resolved') || title.includes('closed')) return 'bg-emerald-100 border-emerald-200 dark:bg-emerald-950/60 dark:border-emerald-800';
    if (title.includes('feedback')) return 'bg-purple-100 border-purple-200 dark:bg-purple-950/60 dark:border-purple-800';
    return 'bg-blue-100 border-blue-200 dark:bg-blue-950/60 dark:border-blue-800';
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
      {timeline.map((item, idx) => (
        <div key={idx} className="relative group">
          {/* Node Icon */}
          <div className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full border flex items-center justify-center shadow-xs transition-transform group-hover:scale-110 ${getStepBadgeBg(item)}`}>
            {getStepIcon(item)}
          </div>

          {/* Content Card */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h5 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>{item.title}</span>
              </h5>
              <time className="text-[11px] text-slate-400 font-mono">
                {new Date(item.timestamp).toLocaleString([], {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </time>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
              {item.description}
            </p>

            <div className="mt-2.5 flex items-center gap-2 text-[11px] text-slate-400">
              <span className="font-semibold text-slate-500 dark:text-slate-400">Actor:</span>
              <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium">
                {item.actor || 'System'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

