import express from 'express';
import { db } from '../db/index.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const filters = {
      recipientType: req.query.recipientType,
      recipientId: req.query.recipientId,
      limit: parseInt(req.query.limit) || 50
    };
    const notifications = db.getNotifications(filters);
    res.json({ success: true, count: notifications.length, data: notifications });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.patch('/:id/read', (req, res) => {
  try {
    const notif = db.markNotificationRead(req.params.id);
    res.json({ success: true, data: notif });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/read-all', (req, res) => {
  try {
    db.markAllNotificationsRead();
    res.json({ success: true, message: "All notifications marked as read." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

