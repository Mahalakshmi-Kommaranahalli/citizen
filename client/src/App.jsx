import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import CitizenPortal from './pages/CitizenPortal';
import OfficerPortal from './pages/OfficerPortal';
import AdminDashboard from './pages/AdminDashboard';
import TrackGrievanceModal from './pages/TrackGrievanceModal';
import NotificationDrawer from './components/NotificationDrawer';
import TimeTravelModal from './components/TimeTravelModal';
import CivicBot from './components/CivicBot';
import { api } from './services/api';

export default function App() {
  const [currentRole, setCurrentRole] = useState('citizen'); // 'citizen' | 'officer' | 'admin'
  const [darkMode, setDarkMode] = useState(false);

  // Core Data
  const [grievances, setGrievances] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [wards, setWards] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Time-Travel State
  const [clockOffsetHours, setClockOffsetHours] = useState(0);
  const [simulatedTime, setSimulatedTime] = useState(new Date().toISOString());

  // UI Modals
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isTimeTravelOpen, setIsTimeTravelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Dark Mode toggle
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Load all foundational data
  const loadData = useCallback(async () => {
    try {
      const [deptRes, wardRes, grvRes, metRes, logsRes, notifRes, clockRes] = await Promise.all([
        api.getDepartments(),
        api.getWards(),
        api.getGrievances(),
        api.getDashboardMetrics(),
        api.getAuditLogs(100),
        api.getNotifications({ limit: 40 }),
        api.getSystemClock()
      ]);

      if (deptRes.success) setDepartments(deptRes.data);
      if (wardRes.success) setWards(wardRes.data);
      if (grvRes.success) setGrievances(grvRes.data);
      if (metRes.success) setMetrics(metRes.data);
      if (logsRes.success) setAuditLogs(logsRes.data);
      if (notifRes.success) setNotifications(notifRes.data);
      if (clockRes.success) {
        setClockOffsetHours(clockRes.data.clockOffsetHours);
        setSimulatedTime(clockRes.data.simulatedTime);
      }

      // Update selected grievance if open
      if (selectedGrievance && grvRes.success) {
        const found = grvRes.data.find(g => g.id === selectedGrievance.id);
        if (found) setSelectedGrievance(found);
      }
    } catch (err) {
      console.error('Error fetching system data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedGrievance]);

  useEffect(() => {
    loadData();
    // Background polling every 12 seconds to keep live SLA countdowns synchronized
    const interval = setInterval(loadData, 12000);
    return () => clearInterval(interval);
  }, [loadData]);

  const handleSearchToken = async (token) => {
    try {
      const res = await api.getGrievanceByToken(token);
      if (res.success && res.data) {
        setSelectedGrievance(res.data);
      } else {
        alert(`No grievance found with token '${token}'.`);
      }
    } catch (err) {
      alert(err.message || 'Token not found.');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        onSelectRole={setCurrentRole}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        unreadCount={unreadCount}
        onOpenTimeTravel={() => setIsTimeTravelOpen(true)}
        clockOffsetHours={clockOffsetHours}
        simulatedTime={simulatedTime}
        onSearchToken={handleSearchToken}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-xs font-semibold">Connecting to NagarSeva Civic Core...</p>
          </div>
        ) : (
          <>
            {currentRole === 'citizen' && (
              <CitizenPortal
                departments={departments}
                wards={wards}
                grievances={grievances}
                onRefresh={loadData}
                onOpenGrievance={setSelectedGrievance}
              />
            )}

            {currentRole === 'officer' && (
              <OfficerPortal
                departments={departments}
                wards={wards}
                grievances={grievances}
                onRefresh={loadData}
                onOpenGrievance={setSelectedGrievance}
              />
            )}

            {currentRole === 'admin' && (
              <AdminDashboard
                metrics={metrics}
                grievances={grievances}
                departments={departments}
                wards={wards}
                auditLogs={auditLogs}
                onRefresh={loadData}
                onOpenGrievance={setSelectedGrievance}
              />
            )}
          </>
        )}
      </main>

      {/* Global Modals */}
      {selectedGrievance && (
        <TrackGrievanceModal
          grievance={selectedGrievance}
          onClose={() => setSelectedGrievance(null)}
          onRefresh={loadData}
        />
      )}

      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
        onNotificationClick={(notif) => {
          if (notif.grievanceId) {
            const found = grievances.find(g => g.id === notif.grievanceId);
            if (found) setSelectedGrievance(found);
          }
        }}
      />

      <TimeTravelModal
        isOpen={isTimeTravelOpen}
        onClose={() => setIsTimeTravelOpen(false)}
        currentOffsetHours={clockOffsetHours}
        simulatedTime={simulatedTime}
        onTimeShifted={(clock) => {
          setClockOffsetHours(clock.clockOffsetHours);
          setSimulatedTime(clock.simulatedTime);
          loadData();
        }}
      />

      {/* Floating AI Civic Concierge Bot */}
      <CivicBot
        onOpenGrievance={setSelectedGrievance}
        onRefresh={loadData}
      />

      {/* Civic Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 NagarSeva Municipal Grievance Redressal & Automated SLA System</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Citizen Service Charter</span>
            <span>•</span>
            <span>SLA Guarantee Policy</span>
            <span>•</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400">System v1.0.0-PROD</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

