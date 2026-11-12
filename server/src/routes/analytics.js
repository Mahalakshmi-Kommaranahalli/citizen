import express from 'express';
import { db } from '../db/index.js';
import { AnalyticsService } from '../services/analyticsService.js';

const router = express.Router();

router.get('/dashboard', (req, res) => {
  try {
    const metrics = AnalyticsService.getDashboardMetrics();
    res.json({ success: true, data: metrics });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/audit-logs', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const logs = db.getAuditLogs(limit);
    res.json({ success: true, count: logs.length, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/export/csv', (req, res) => {
  try {
    const grievances = db.getAllGrievances();
    
    // Build CSV content
    const headers = [
      "Tracking Token",
      "Title",
      "Department",
      "Category",
      "Ward",
      "Priority",
      "Status",
      "Assigned Officer",
      "SLA Hours",
      "Created At",
      "SLA Deadline",
      "Resolved At",
      "Citizen Name",
      "Citizen Contact",
      "Feedback Rating"
    ];

    const rows = grievances.map(g => [
      `"${g.trackingToken}"`,
      `"${g.title.replace(/"/g, '""')}"`,
      `"${g.departmentName}"`,
      `"${g.categoryName}"`,
      `"${g.wardName}"`,
      `"${g.priority}"`,
      `"${g.status}"`,
      `"${g.assignedOfficer?.name || ''}"`,
      `"${g.slaHours}"`,
      `"${g.createdAt}"`,
      `"${g.slaDeadline}"`,
      `"${g.resolvedAt || ''}"`,
      `"${g.citizen?.name || ''}"`,
      `"${g.citizen?.phone || ''}"`,
      `"${g.feedback?.rating || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="grievances-report-${new Date().toISOString().slice(0, 10)}.csv"`);
    res.send(csvContent);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

