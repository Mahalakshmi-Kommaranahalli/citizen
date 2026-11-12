import { db } from '../db/index.js';

export class NotificationService {
  /**
   * Dispatch simulated SMS / Email / In-App alert
   */
  static notify({ recipientType, recipientId, recipientPhone, recipientEmail, title, message, type, grievanceId, trackingToken }) {
    // 1. Store in-app notification
    const notification = db.addNotification({
      recipientType,
      recipientId,
      grievanceId,
      trackingToken,
      title,
      message,
      type: type || "INFO",
      dispatches: {
        sms: recipientPhone ? {
          phone: recipientPhone,
          status: "DELIVERED",
          deliveredAt: db.getCurrentSimulatedTime().toISOString()
        } : null,
        email: recipientEmail ? {
          email: recipientEmail,
          status: "DELIVERED",
          deliveredAt: db.getCurrentSimulatedTime().toISOString()
        } : null
      }
    });

    console.log(`[DISPATCH] [${type || 'INFO'}] To ${recipientType} (${recipientId || recipientPhone || recipientEmail}): "${title}"`);
    return notification;
  }

  static notifyGrievanceLodged(grievance) {
    // Notify Citizen
    if (grievance.citizen?.email || grievance.citizen?.phone) {
      this.notify({
        recipientType: "CITIZEN",
        recipientId: grievance.citizen.email || grievance.citizen.phone,
        recipientPhone: grievance.citizen.phone,
        recipientEmail: grievance.citizen.email,
        grievanceId: grievance.id,
        trackingToken: grievance.trackingToken,
        title: `Grievance Registered: ${grievance.trackingToken}`,
        message: `Your grievance regarding "${grievance.title}" has been registered. Track status online anytime with token ${grievance.trackingToken}. Target resolution SLA: ${grievance.slaHours} hours.`,
        type: "TICKET_REGISTERED"
      });
    }

    // Notify Field Officer
    if (grievance.assignedOfficer) {
      this.notify({
        recipientType: "OFFICER",
        recipientId: grievance.assignedOfficer.id,
        recipientPhone: grievance.assignedOfficer.phone,
        recipientEmail: grievance.assignedOfficer.email,
        grievanceId: grievance.id,
        trackingToken: grievance.trackingToken,
        title: `New Work Assignment: ${grievance.trackingToken} [${grievance.priority}]`,
        message: `A new ${grievance.priority} priority grievance has been routed to you in ${grievance.wardName}: "${grievance.title}". SLA deadline: ${new Date(grievance.slaDeadline).toLocaleString()}.`,
        type: "ASSIGNMENT"
      });
    }
  }

  static notifyGrievanceResolved(grievance) {
    if (grievance.citizen?.email || grievance.citizen?.phone) {
      this.notify({
        recipientType: "CITIZEN",
        recipientId: grievance.citizen.email || grievance.citizen.phone,
        recipientPhone: grievance.citizen.phone,
        recipientEmail: grievance.citizen.email,
        grievanceId: grievance.id,
        trackingToken: grievance.trackingToken,
        title: `Action Completed: ${grievance.trackingToken}`,
        message: `Field Officer ${grievance.assignedOfficer?.name || ''} has resolved your grievance "${grievance.title}". Summary: ${grievance.resolution?.summary || 'Completed'}. Please rate the redressal quality.`,
        type: "RESOLUTION"
      });
    }
  }
}

