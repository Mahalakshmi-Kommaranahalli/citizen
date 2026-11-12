import React, { useState } from 'react';
import {
  Shield,
  Search,
  Bell,
  Sun,
  Moon,
  FastForward,
  User,
  HardHat,
  BarChart3,
  Layers
} from 'lucide-react';

export default function Navbar({
  currentRole,
  onSelectRole,
  onOpenNotifications,
  unreadCount = 0,
  onOpenTimeTravel,
  clockOffsetHours = 0,
  simulatedTime,
  onSearchToken,
  darkMode,
  onToggleDarkMode
}) {
  const [tokenInput, setTokenInput] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (tokenInput.trim() && onSearchToken) {
      onSearchToken(tokenInput.trim());
      setTokenInput('');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                  Nagar<span className="text-emerald-600 dark:text-emerald-400">Seva</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Gov 2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-none hidden sm:block">
                Citizen Grievance Redressal & SLA Tracking
              </p>
            </div>
          </div>

          {/* Quick Tracking Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center flex-1 max-w-xs relative">
            <input
              type="text"
              placeholder="Track token (e.g. GRV-2026-8910)..."
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="w-full text-xs font-mono pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5" />
          </form>

          {/* Role Navigation Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium border border-slate-200/80 dark:border-slate-700/80">
            <button
              onClick={() => onSelectRole('citizen')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentRole === 'citizen'
                  ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Citizen</span>
            </button>
            <button
              onClick={() => onSelectRole('officer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentRole === 'officer'
                  ? 'bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-300 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <HardHat className="w-3.5 h-3.5" />
              <span>Officer</span>
            </button>
            <button
              onClick={() => onSelectRole('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentRole === 'admin'
                  ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2">
            {/* Time Travel Simulator Button */}
            <button
              onClick={onOpenTimeTravel}
              title="Fast-forward virtual time to test SLA countdowns & escalations"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                clockOffsetHours > 0
                  ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              <FastForward className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden sm:inline font-mono">
                {clockOffsetHours > 0 ? `+${clockOffsetHours}h` : 'Virtual Clock'}
              </span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              title="Notifications & SMS Dispatches"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              )}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              title="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

