import express from 'express';
import { db } from '../db/index.js';
import { SlaMonitor } from '../services/slaMonitor.js';

const router = express.Router();

// POST /api/admin/time-travel (Shift system clock forward by X hours)
router.post('/time-travel', (req, res) => {
  try {
    const { offsetHours } = req.body;
    const result = db.setClockOffset(offsetHours);

    // Run SLA audit right after shifting time so escalations trigger immediately!
    const auditResult = SlaMonitor.runAuditCheck();

    res.json({
      success: true,
      message: `System simulated time shifted by ${offsetHours} hours.`,
      clock: result,
      auditResult
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/admin/system-clock
router.get('/system-clock', (req, res) => {
  res.json({ success: true, data: db.getClockOffset() });
});

// POST /api/admin/run-sla-audit (Manual trigger)
router.post('/run-sla-audit', (req, res) => {
  try {
    const result = SlaMonitor.runAuditCheck();
    res.json({
      success: true,
      message: "SLA monitoring audit completed.",
      data: result
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/admin/reset-database
router.post('/reset-database', (req, res) => {
  try {
    db.resetToSeeds();
    res.json({
      success: true,
      message: "Database successfully reset to demo civic dataset."
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

