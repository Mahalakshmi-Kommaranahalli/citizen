import React, { useState } from 'react';
import { FastForward, RotateCcw, X, Clock, Zap, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export default function TimeTravelModal({ isOpen, onClose, currentOffsetHours, simulatedTime, onTimeShifted }) {
  if (!isOpen) return null;

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleShift = async (hours) => {
    try {
      setLoading(true);
      setSuccessMsg('');
      const res = await api.timeTravel(hours);
      setSuccessMsg(`Simulated time advanced by ${hours}h. SLA audit triggered.`);
      if (onTimeShifted) onTimeShifted(res.clock);
      setTimeout(() => {
        setSuccessMsg('');
      }, 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerAudit = async () => {
    try {
      setLoading(true);
      await api.runSlaAudit();
      setSuccessMsg('SLA audit cycle executed across all active tickets.');
      if (onTimeShifted) onTimeShifted({ clockOffsetHours: currentOffsetHours, simulatedTime });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <FastForward className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                SLA Time-Travel Simulator
              </h3>
              <p className="text-[11px] text-slate-500">
                Simulate time passage to test SLA countdowns & escalations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Current Simulated Time Display */}
          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
                Current System Virtual Time
              </span>
              <div className="text-sm font-bold text-slate-900 dark:text-white font-mono mt-0.5">
                {simulatedTime ? new Date(simulatedTime).toLocaleString() : new Date().toLocaleString()}
              </div>
            </div>
            <div className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
              currentOffsetHours > 0
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
            }`}>
              {currentOffsetHours > 0 ? `+${currentOffsetHours}h Shifted` : 'Real-Time'}
            </div>
          </div>

          {/* Shift Buttons Grid */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
              Fast-Forward Virtual Clock:
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                disabled={loading}
                onClick={() => handleShift((currentOffsetHours || 0) + 6)}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 transition-colors shadow-2xs"
              >
                <FastForward className="w-3.5 h-3.5 text-indigo-500" />
                <span>+6 Hours</span>
              </button>
              <button
                disabled={loading}
                onClick={() => handleShift((currentOffsetHours || 0) + 12)}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 transition-colors shadow-2xs"
              >
                <FastForward className="w-3.5 h-3.5 text-indigo-500" />
                <span>+12 Hours</span>
              </button>
              <button
                disabled={loading}
                onClick={() => handleShift((currentOffsetHours || 0) + 24)}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 transition-colors shadow-2xs"
              >
                <FastForward className="w-3.5 h-3.5 text-amber-500" />
                <span>+24 Hours (1 Day)</span>
              </button>
              <button
                disabled={loading}
                onClick={() => handleShift((currentOffsetHours || 0) + 48)}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 transition-colors shadow-2xs"
              >
                <FastForward className="w-3.5 h-3.5 text-red-500" />
                <span>+48 Hours (2 Days)</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              disabled={loading}
              onClick={() => handleShift(0)}
              className="flex-1 flex items-center justify-center gap-1.5 p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Real-Time (0h)</span>
            </button>
            <button
              disabled={loading}
              onClick={handleTriggerAudit}
              className="flex-1 flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white text-xs font-semibold transition-colors shadow-xs"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 dark:text-amber-600" />
              <span>Run SLA Audit</span>
            </button>
          </div>

          {successMsg && (
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

