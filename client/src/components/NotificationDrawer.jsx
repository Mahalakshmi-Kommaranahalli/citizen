import React from 'react';
import { X, Bell, MessageSquare, Mail, AlertOctagon, CheckCheck } from 'lucide-react';

export default function NotificationDrawer({
  isOpen,
  onClose,
  notifications = [],
  onMarkAllRead,
  onNotificationClick
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/40 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-fade-in">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/50">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Communication & Alert Center
                </h3>
                <p className="text-[11px] text-slate-500">
                  Simulated Real-Time SMS, Email & SLA Escalations
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={onMarkAllRead}
                title="Mark all as read"
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <CheckCheck className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List of Notifications */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No alerts or dispatched messages at this time.
              </div>
            ) : (
              notifications.map((item) => {
                const isCritical = item.type === 'BREACH_CRITICAL';
                const isWarning = item.type === 'BREACH_WARNING';

                return (
                  <div
                    key={item.id}
                    onClick={() => onNotificationClick && onNotificationClick(item)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      item.isRead
                        ? 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-80'
                        : isCritical
                        ? 'bg-red-50/80 dark:bg-red-950/40 border-red-200 dark:border-red-900 shadow-xs'
                        : isWarning
                        ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`mt-0.5 p-1.5 rounded-lg flex-shrink-0 ${
                        isCritical
                          ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300'
                          : isWarning
                          ? 'bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300'
                          : 'bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300'
                      }`}>
                        {isCritical ? (
                          <AlertOctagon className="w-3.5 h-3.5" />
                        ) : item.dispatches?.sms ? (
                          <MessageSquare className="w-3.5 h-3.5" />
                        ) : (
                          <Mail className="w-3.5 h-3.5" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {item.title}
                          </span>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap font-mono">
                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                          {item.message}
                        </p>

                        {/* Dispatch Channel Badges */}
                        <div className="mt-2 flex items-center gap-2 text-[10px]">
                          {item.trackingToken && (
                            <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono font-bold">
                              {item.trackingToken}
                            </span>
                          )}
                          <span className="text-slate-400">
                            Channel: {item.recipientType}
                          </span>
                          {item.dispatches?.sms && (
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                              SMS ✓
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

