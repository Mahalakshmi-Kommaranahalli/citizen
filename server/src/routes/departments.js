import express from 'express';
import { db } from '../db/index.js';

const router = express.Router();

router.get('/departments', (req, res) => {
  res.json({ success: true, data: db.getDepartments() });
});

router.get('/wards', (req, res) => {
  res.json({ success: true, data: db.getWards() });
});

router.get('/sla-rules', (req, res) => {
  res.json({ success: true, data: db.getSlaRules() });
});

router.put('/sla-rules', (req, res) => {
  try {
    const updated = db.updateSlaRules(req.body);
    res.json({ success: true, message: "SLA configuration updated successfully.", data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

