import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SEED_GRIEVANCES } from './seedData.js';
import { DEPARTMENTS, PRIORITY_CONFIG } from '../config/departments.js';
import { WARDS } from '../config/wards.js';
import { SLA_RULES } from '../config/slaRules.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isServerless = process.env.NETLIFY === 'true' || process.env.SERVERLESS === 'true';
const DATA_DIR = isServerless ? '/tmp/data' : path.join(__dirname, '..', '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('Could not create data dir:', e.message);
}

class Database {
  constructor() {
    this.data = {
      grievances: [],
      auditLogs: [],
      notifications: [],
      departments: DEPARTMENTS,
      wards: WARDS,
      slaRules: SLA_RULES,
      clockOffsetHours: 0, // for time-travel simulation
      lastUpdated: new Date().toISOString()
    };
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf8');
        const parsed = JSON.parse(fileContent);
        if (parsed.grievances && parsed.grievances.length > 0) {
          this.data = parsed;
          // Ensure defaults if missing
          if (!this.data.departments) this.data.departments = DEPARTMENTS;
          if (!this.data.wards) this.data.wards = WARDS;
          if (!this.data.slaRules) this.data.slaRules = SLA_RULES;
          if (this.data.clockOffsetHours === undefined) this.data.clockOffsetHours = 0;
          return;
        }
      }
    } catch (err) {
      console.warn('Could not read existing db.json, initializing fresh seed data:', err.message);
    }

    // Seed initial data
    this.resetToSeeds();
  }

  save() {
    try {
      this.data.lastUpdated = new Date().toISOString();
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Error saving db.json:', err);
    }
  }

  resetToSeeds() {
    this.data.grievances = JSON.parse(JSON.stringify(SEED_GRIEVANCES));
    this.data.auditLogs = [
      {
        id: "log-1",
        timestamp: new Date(Date.now() - 32 * 3600 * 1000).toISOString(),
        grievanceId: "grv-1001",
        trackingToken: "GRV-2026-8910",
        action: "GRIEVANCE_LODGED",
        actor: "Citizen (Rohit Malhotra)",
        details: "Grievance registered for Dangerous Pothole in Ward 1."
      },
      {
        id: "log-2",
        timestamp: new Date(Date.now() - 32 * 3600 * 1000 + 45000).toISOString(),
        grievanceId: "grv-1001",
        trackingToken: "GRV-2026-8910",
        action: "AUTO_ROUTED",
        actor: "System Routing Engine",
        details: "Assigned to DEPT_ROADS, Officer Pooja Hegde. SLA: 24h."
      },
      {
        id: "log-3",
        timestamp: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
        grievanceId: "grv-1002",
        trackingToken: "GRV-2026-9204",
        action: "SLA_BREACH_ESCALATION",
        actor: "SLA Monitoring Daemon",
        details: "Critical ticket unresolved past 4 hours. Escalated to Level 1 (Anita Nambiar)."
      },
      {
        id: "log-4",
        timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        grievanceId: "grv-1002",
        trackingToken: "GRV-2026-9204",
        action: "SLA_BREACH_ESCALATION",
        actor: "SLA Monitoring Daemon",
        details: "Breach unresolved past 10 hours. Escalated to Level 2 (Zonal Commissioner Smt. Archana Meena)."
      }
    ];

    this.data.notifications = [
      {
        id: "notif-1",
        recipientType: "OFFICER",
        recipientId: "OFF_WATER_02",
        grievanceId: "grv-1002",
        trackingToken: "GRV-2026-9204",
        title: "CRITICAL ALERT: SLA Level 2 Breach",
        message: "Open Sewer Manhole Outside Modern Public School breached 4h SLA. Escalated to Zonal Commissioner.",
        type: "BREACH_CRITICAL",
        isRead: false,
        timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
      },
      {
        id: "notif-2",
        recipientType: "CITIZEN",
        recipientId: "rohit.m@gmail.com",
        grievanceId: "grv-1001",
        trackingToken: "GRV-2026-8910",
        title: "Grievance Resolved: Deep Pothole",
        message: "Your grievance GRV-2026-8910 has been resolved by Asst. Engineer Pooja Hegde. Please rate your experience.",
        type: "RESOLUTION",
        isRead: true,
        timestamp: new Date(Date.now() - 10 * 3600 * 1000).toISOString()
      },
      {
        id: "notif-3",
        recipientType: "SUPERVISOR",
        recipientId: "DEPT_ELEC",
        grievanceId: "grv-1005",
        trackingToken: "GRV-2026-3199",
        title: "SLA Level 1 Escalation: Cyber Park Dark Stretch",
        message: "Streetlight outage past 12-hour resolution SLA. Automated notice dispatched.",
        type: "BREACH_WARNING",
        isRead: false,
        timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
      }
    ];

    this.data.departments = DEPARTMENTS;
    this.data.wards = WARDS;
    this.data.slaRules = SLA_RULES;
    this.data.clockOffsetHours = 0;
    this.save();
  }

  // Simulated Time Helper
  getCurrentSimulatedTime() {
    const now = new Date();
    if (this.data.clockOffsetHours) {
      now.setTime(now.getTime() + this.data.clockOffsetHours * 3600 * 1000);
    }
    return now;
  }

  setClockOffset(hours) {
    this.data.clockOffsetHours = Number(hours) || 0;
    this.save();
    return {
      clockOffsetHours: this.data.clockOffsetHours,
      simulatedTime: this.getCurrentSimulatedTime().toISOString()
    };
  }

  getClockOffset() {
    return {
      clockOffsetHours: this.data.clockOffsetHours || 0,
      simulatedTime: this.getCurrentSimulatedTime().toISOString()
    };
  }

  // Grievance Queries
  getAllGrievances(filters = {}) {
    let list = [...this.data.grievances];

    if (filters.departmentId) {
      list = list.filter(g => g.departmentId === filters.departmentId);
    }
    if (filters.wardId) {
      list = list.filter(g => g.wardId === filters.wardId);
    }
    if (filters.status) {
      list = list.filter(g => g.status === filters.status);
    }
    if (filters.priority) {
      list = list.filter(g => g.priority === filters.priority);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(g => 
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.trackingToken.toLowerCase().includes(q) ||
        g.address.toLowerCase().includes(q)
      );
    }
    if (filters.officerId) {
      list = list.filter(g => g.assignedOfficer && g.assignedOfficer.id === filters.officerId);
    }
    if (filters.citizenEmail) {
      list = list.filter(g => g.citizen && g.citizen.email && g.citizen.email.toLowerCase() === filters.citizenEmail.toLowerCase());
    }

    // Sort newest first by default
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getGrievanceById(id) {
    return this.data.grievances.find(g => g.id === id);
  }

  getGrievanceByToken(token) {
    if (!token) return null;
    const cleanToken = token.trim().toUpperCase();
    return this.data.grievances.find(g => g.trackingToken.toUpperCase() === cleanToken);
  }

  createGrievance(grievance) {
    this.data.grievances.unshift(grievance);
    this.save();
    return grievance;
  }

  updateGrievance(id, updates) {
    const idx = this.data.grievances.findIndex(g => g.id === id);
    if (idx === -1) return null;

    this.data.grievances[idx] = {
      ...this.data.grievances[idx],
      ...updates,
      updatedAt: this.getCurrentSimulatedTime().toISOString()
    };
    this.save();
    return this.data.grievances[idx];
  }

  addTimelineEvent(id, event) {
    const grievance = this.getGrievanceById(id);
    if (!grievance) return null;

    if (!grievance.timeline) grievance.timeline = [];
    grievance.timeline.push({
      step: grievance.timeline.length + 1,
      title: event.title,
      description: event.description,
      actor: event.actor || 'System',
      timestamp: event.timestamp || this.getCurrentSimulatedTime().toISOString(),
      metadata: event.metadata || null
    });
    this.save();
    return grievance;
  }

  upvoteGrievance(id, citizenId = 'anon') {
    const grievance = this.getGrievanceById(id);
    if (!grievance) return null;
    grievance.upvotes = (grievance.upvotes || 0) + 1;
    this.save();
    return grievance;
  }

  // Audit Logs
  addAuditLog(entry) {
    const log = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: this.getCurrentSimulatedTime().toISOString(),
      ...entry
    };
    this.data.auditLogs.unshift(log);
    if (this.data.auditLogs.length > 500) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 500);
    }
    this.save();
    return log;
  }

  getAuditLogs(limit = 100) {
    return this.data.auditLogs.slice(0, limit);
  }

  // Notifications
  addNotification(notif) {
    const item = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: this.getCurrentSimulatedTime().toISOString(),
      isRead: false,
      ...notif
    };
    this.data.notifications.unshift(item);
    if (this.data.notifications.length > 200) {
      this.data.notifications = this.data.notifications.slice(0, 200);
    }
    this.save();
    return item;
  }

  getNotifications(filters = {}) {
    let list = [...this.data.notifications];
    if (filters.recipientType) {
      list = list.filter(n => n.recipientType === filters.recipientType || n.recipientType === 'ALL');
    }
    if (filters.recipientId) {
      list = list.filter(n => n.recipientId === filters.recipientId || n.recipientType === 'ALL');
    }
    return list.slice(0, filters.limit || 50);
  }

  markNotificationRead(id) {
    const notif = this.data.notifications.find(n => n.id === id);
    if (notif) {
      notif.isRead = true;
      this.save();
    }
    return notif;
  }

  markAllNotificationsRead() {
    this.data.notifications.forEach(n => { n.isRead = true; });
    this.save();
    return true;
  }

  // System Configurations
  getDepartments() {
    return this.data.departments;
  }

  getWards() {
    return this.data.wards;
  }

  getSlaRules() {
    return this.data.slaRules;
  }

  updateSlaRules(newRules) {
    this.data.slaRules = { ...this.data.slaRules, ...newRules };
    this.save();
    return this.data.slaRules;
  }
}

export const db = new Database();

