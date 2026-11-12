import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/index.js';
import { RoutingEngine } from '../services/routingEngine.js';
import { SlaMonitor } from '../services/slaMonitor.js';
import { NotificationService } from '../services/notificationService.js';
import { DuplicateDetector } from '../services/duplicateDetector.js';

const router = express.Router();

// Generate unique tracking token like "GRV-2026-4821"
function generateTrackingToken() {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `GRV-${year}-${randomNum}`;
}

// GET /api/grievances (List with filters)
router.get('/', (req, res) => {
  try {
    const filters = {
      departmentId: req.query.departmentId,
      wardId: req.query.wardId,
      status: req.query.status,
      priority: req.query.priority,
      search: req.query.search,
      officerId: req.query.officerId,
      citizenEmail: req.query.citizenEmail
    };

    const simulatedNow = db.getCurrentSimulatedTime();
    let grievances = db.getAllGrievances(filters);

    // Attach dynamic SLA metrics to each grievance
    const enriched = grievances.map(g => ({
      ...g,
      slaMetrics: SlaMonitor.evaluateGrievanceSla(g, simulatedNow)
    }));

    res.json({
      success: true,
      count: enriched.length,
      data: enriched,
      simulatedTime: simulatedNow.toISOString()
    });
  } catch (err) {
    console.error('Error fetching grievances:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/grievances/track/:token (Public tracking)
router.get('/track/:token', (req, res) => {
  try {
    const { token } = req.params;
    const grievance = db.getGrievanceByToken(token);

    if (!grievance) {
      return res.status(404).json({
        success: false,
        error: `No grievance found matching tracking token '${token}'. Please verify your token.`
      });
    }

    const simulatedNow = db.getCurrentSimulatedTime();
    const slaMetrics = SlaMonitor.evaluateGrievanceSla(grievance, simulatedNow);

    res.json({
      success: true,
      data: {
        ...grievance,
        slaMetrics
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/grievances/check-duplicates (Pre-submission similarity check)
router.post('/check-duplicates', (req, res) => {
  try {
    const { title, description, category, wardId, coordinates } = req.body;
    const duplicates = DuplicateDetector.findDuplicates({
      title, description, category, wardId, coordinates
    });

    res.json({
      success: true,
      hasDuplicates: duplicates.length > 0,
      count: duplicates.length,
      duplicates
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/grievances/:id
router.get('/:id', (req, res) => {
  try {
    const grievance = db.getGrievanceById(req.params.id);
    if (!grievance) {
      return res.status(404).json({ success: false, error: 'Grievance not found' });
    }

    const simulatedNow = db.getCurrentSimulatedTime();
    const slaMetrics = SlaMonitor.evaluateGrievanceSla(grievance, simulatedNow);

    res.json({
      success: true,
      data: {
        ...grievance,
        slaMetrics
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/grievances (Lodge new grievance)
router.post('/', (req, res) => {
  try {
    const {
      title,
      description,
      category,
      wardId,
      address,
      coordinates,
      citizen,
      attachments = [],
      priority: requestedPriority
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, error: 'Title and description are required.' });
    }

    const trackingToken = generateTrackingToken();
    const currentTime = db.getCurrentSimulatedTime().toISOString();

    // 1. Run Automated Intelligent Routing Engine
    const routingResult = RoutingEngine.analyzeAndRoute({
      title,
      description,
      category,
      wardId,
      coordinates,
      requestedPriority
    });

    const newGrievance = {
      id: `grv-${uuidv4().slice(0, 8)}`,
      trackingToken,
      title: title.trim(),
      description: description.trim(),
      category: routingResult.category,
      categoryName: routingResult.categoryName,
      departmentId: routingResult.departmentId,
      departmentName: routingResult.departmentName,
      wardId: routingResult.wardId,
      wardName: routingResult.wardName,
      address: address || `${routingResult.wardName}, Municipal Zone`,
      coordinates: coordinates || { lat: 28.6139, lng: 77.2090 },
      citizen: citizen || {
        name: "Verified Citizen",
        phone: "+91 98000 11111",
        email: "citizen@example.com",
        isAnonymous: false
      },
      priority: routingResult.priority,
      urgencyScore: routingResult.urgencyScore,
      routingReason: routingResult.routingReason,
      status: "ASSIGNED",
      assignedOfficer: routingResult.assignedOfficer,
      escalationLevel: 0,
      slaHours: routingResult.slaHours,
      slaDeadline: routingResult.slaDeadline,
      createdAt: currentTime,
      upvotes: 1,
      attachments: attachments.length > 0 ? attachments : [
        {
          id: `att-${Date.now()}`,
          type: "citizen_proof",
          url: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&auto=format&fit=crop&q=80",
          caption: "Uploaded evidence of civic issue"
        }
      ],
      timeline: [
        {
          step: 1,
          title: "Grievance Lodged",
          description: `Complaint submitted via Web Portal by ${citizen?.name || 'Citizen'}.`,
          timestamp: currentTime,
          actor: citizen?.name || "Citizen"
        },
        {
          step: 2,
          title: "Intelligent Auto-Routing Executed",
          description: routingResult.routingReason,
          timestamp: new Date(new Date(currentTime).getTime() + 15000).toISOString(),
          actor: "Automated Routing Engine"
        }
      ]
    };

    // Save to DB
    db.createGrievance(newGrievance);

    // Log to Audit Trail
    db.addAuditLog({
      grievanceId: newGrievance.id,
      trackingToken: newGrievance.trackingToken,
      action: "GRIEVANCE_REGISTERED",
      actor: citizen?.name || "Citizen",
      details: `New ${newGrievance.priority} ticket routed to ${newGrievance.departmentName} (${newGrievance.assignedOfficer.name}). SLA: ${newGrievance.slaHours}h.`
    });

    // Send notifications
    NotificationService.notifyGrievanceLodged(newGrievance);

    const slaMetrics = SlaMonitor.evaluateGrievanceSla(newGrievance);

    res.status(201).json({
      success: true,
      message: "Grievance registered and auto-routed successfully.",
      data: {
        ...newGrievance,
        slaMetrics
      }
    });
  } catch (err) {
    console.error('Error lodging grievance:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/grievances/:id/status (Officer status update)
router.patch('/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status, actorName, notes, proofImage } = req.body;

    const existing = db.getGrievanceById(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Grievance not found' });
    }

    const updates = { status };
    const simulatedNow = db.getCurrentSimulatedTime().toISOString();

    if (status === "RESOLVED") {
      updates.resolvedAt = simulatedNow;
      updates.resolution = {
        resolvedBy: actorName || existing.assignedOfficer?.name || "Field Officer",
        summary: notes || "Work order completed and verified on ground.",
        proofImage: proofImage || "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80",
        resolvedAt: simulatedNow
      };
    }

    const updated = db.updateGrievance(id, updates);

    // Timeline event
    db.addTimelineEvent(id, {
      title: `Status Updated: ${status.replace('_', ' ')}`,
      description: notes || `Grievance transitioned to ${status} by ${actorName || 'Officer'}.`,
      actor: actorName || "Field Officer",
      timestamp: simulatedNow
    });

    // Audit log
    db.addAuditLog({
      grievanceId: id,
      trackingToken: existing.trackingToken,
      action: `STATUS_CHANGE_TO_${status}`,
      actor: actorName || "Field Officer",
      details: notes || `Status updated from ${existing.status} to ${status}.`
    });

    if (status === "RESOLVED") {
      NotificationService.notifyGrievanceResolved(updated);
    }

    const slaMetrics = SlaMonitor.evaluateGrievanceSla(updated);
    res.json({
      success: true,
      message: `Status updated to ${status}`,
      data: { ...updated, slaMetrics }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/grievances/:id/action-log (Add inspection notes)
router.post('/:id/action-log', (req, res) => {
  try {
    const { id } = req.params;
    const { note, actorName, actionTitle } = req.body;

    const existing = db.getGrievanceById(id);
    if (!existing) return res.status(404).json({ success: false, error: 'Grievance not found' });

    db.addTimelineEvent(id, {
      title: actionTitle || "Field Action / Inspection Note",
      description: note || "Site inspection conducted.",
      actor: actorName || "Field Officer"
    });

    db.addAuditLog({
      grievanceId: id,
      trackingToken: existing.trackingToken,
      action: "FIELD_ACTION_LOGGED",
      actor: actorName || "Field Officer",
      details: note
    });

    res.json({ success: true, message: "Action log appended to grievance timeline." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/grievances/:id/upvote
router.post('/:id/upvote', (req, res) => {
  try {
    const { id } = req.params;
    const updated = db.upvoteGrievance(id);
    if (!updated) return res.status(404).json({ success: false, error: 'Grievance not found' });

    res.json({
      success: true,
      message: "Upvote registered. City authorities notified of high community impact.",
      upvotes: updated.upvotes
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/grievances/:id/feedback
router.post('/:id/feedback', (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, citizenName } = req.body;

    const existing = db.getGrievanceById(id);
    if (!existing) return res.status(404).json({ success: false, error: 'Grievance not found' });

    const feedback = {
      rating: Number(rating) || 5,
      comment: comment || "Satisfied with resolution.",
      submittedAt: db.getCurrentSimulatedTime().toISOString()
    };

    const updated = db.updateGrievance(id, {
      feedback,
      status: "CLOSED"
    });

    db.addTimelineEvent(id, {
      title: "Citizen Feedback & Case Closed",
      description: `Citizen rated ${feedback.rating}/5 Stars: "${feedback.comment}"`,
      actor: citizenName || existing.citizen?.name || "Citizen"
    });

    db.addAuditLog({
      grievanceId: id,
      trackingToken: existing.trackingToken,
      action: "CITIZEN_FEEDBACK_SUBMITTED",
      actor: citizenName || "Citizen",
      details: `Rating: ${feedback.rating}/5. Case marked CLOSED.`
    });

    res.json({
      success: true,
      message: "Thank you for your feedback! The case is now closed.",
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/grievances/:id/reopen
router.post('/:id/reopen', (req, res) => {
  try {
    const { id } = req.params;
    const { reason, citizenName } = req.body;

    const existing = db.getGrievanceById(id);
    if (!existing) return res.status(404).json({ success: false, error: 'Grievance not found' });

    const updated = db.updateGrievance(id, {
      status: "IN_PROGRESS",
      reopenedReason: reason || "Issue persists on ground",
      escalationLevel: Math.max(1, (existing.escalationLevel || 0) + 1)
    });

    db.addTimelineEvent(id, {
      title: "Grievance Reopened by Citizen",
      description: `Citizen indicated issue is unresolved: "${reason}". Escalated to supervisor for ground verification.`,
      actor: citizenName || "Citizen"
    });

    db.addAuditLog({
      grievanceId: id,
      trackingToken: existing.trackingToken,
      action: "GRIEVANCE_REOPENED",
      actor: citizenName || "Citizen",
      details: reason
    });

    NotificationService.notify({
      recipientType: "SUPERVISOR",
      recipientId: existing.departmentId,
      grievanceId: id,
      trackingToken: existing.trackingToken,
      title: `REOPENED: ${existing.trackingToken}`,
      message: `Citizen reopened grievance with note: "${reason}". Supervisor inspection required.`,
      type: "ALERT"
    });

    res.json({
      success: true,
      message: "Grievance has been reopened and escalated to the supervisory engineer.",
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/grievances/:id/reassign (Supervisor manual reroute)
router.post('/:id/reassign', (req, res) => {
  try {
    const { id } = req.params;
    const { newDepartmentId, newOfficerId, reason, supervisorName } = req.body;

    const existing = db.getGrievanceById(id);
    if (!existing) return res.status(404).json({ success: false, error: 'Grievance not found' });

    const departments = db.getDepartments();
    const wards = db.getWards();

    const targetDept = departments.find(d => d.id === newDepartmentId);
    if (!targetDept) return res.status(400).json({ success: false, error: 'Invalid target department' });

    const ward = wards.find(w => w.id === existing.wardId) || wards[0];
    const newOfficer = ward.officers[newDepartmentId] || targetDept.headOfficer;

    const updated = db.updateGrievance(id, {
      departmentId: targetDept.id,
      departmentName: targetDept.name,
      assignedOfficer: newOfficer
    });

    db.addTimelineEvent(id, {
      title: "Department Reassignment",
      description: `Reassigned from ${existing.departmentName} to ${targetDept.name} (${newOfficer.name}). Reason: ${reason || 'Jurisdiction realignment'}.`,
      actor: supervisorName || "Supervisor"
    });

    db.addAuditLog({
      grievanceId: id,
      trackingToken: existing.trackingToken,
      action: "MANUAL_REASSIGNMENT",
      actor: supervisorName || "Supervisor",
      details: `Transferred to ${targetDept.name}. Reason: ${reason}`
    });

    res.json({
      success: true,
      message: `Grievance rerouted to ${targetDept.name} and assigned to ${newOfficer.name}.`,
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

