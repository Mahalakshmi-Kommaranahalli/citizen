import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import grievancesRouter from './routes/grievances.js';
import departmentsRouter from './routes/departments.js';
import analyticsRouter from './routes/analytics.js';
import notificationsRouter from './routes/notifications.js';
import adminRouter from './routes/admin.js';
import { SlaMonitor } from './services/slaMonitor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files statically
const uploadsDir = path.join(__dirname, '..', 'uploads');
app.use('/uploads', express.static(uploadsDir));

// Serve compiled client in production or when dist exists
const clientDist = path.join(__dirname, '..', '..', 'client', 'dist');
import fs from 'fs';
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
}

// API Routes
app.use('/api/grievances', grievancesRouter);
app.use('/api', departmentsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/admin', adminRouter);

// Root health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'Citizen Grievance Redressal & SLA Engine',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// SPA fallback to index.html for client-side routing
if (fs.existsSync(clientDist)) {
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Periodic Background SLA Monitor Worker (Every 30 seconds)
const SLA_AUDIT_INTERVAL_MS = 30000;
const slaWorkerInterval = setInterval(() => {
  try {
    SlaMonitor.runAuditCheck();
  } catch (err) {
    console.error('[SLA Worker Error]:', err.message);
  }
}, SLA_AUDIT_INTERVAL_MS);

// Initial immediate SLA audit check
try {
  SlaMonitor.runAuditCheck();
} catch (e) {
  console.warn('Initial SLA check warning:', e.message);
}

// Start Server
const server = app.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(`🏛️  CITIZEN GRIEVANCE REDRESSAL & SLA TRACKING ENGINE ONLINE`);
  console.log(`📍 API Server listening on: http://localhost:${PORT}`);
  console.log(`⏱️  Automated SLA Worker active (Tick every 30s)`);
  console.log(`================================================================`);
});

process.on('SIGTERM', () => {
  clearInterval(slaWorkerInterval);
  server.close();
});

export default app;
