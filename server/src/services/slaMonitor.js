import { db } from '../db/index.js';
import { SLA_RULES } from '../config/slaRules.js';

export class SlaMonitor {
  /**
   * Calculate real-time SLA metrics for a single grievance
   */
  static evaluateGrievanceSla(grievance, simulatedNow = null) {
    const now = simulatedNow || db.getCurrentSimulatedTime();
    const createdAt = new Date(grievance.createdAt).getTime();
    const deadline = new Date(grievance.slaDeadline).getTime();
    const currentTime = now.getTime();

    const totalDurationMs = Math.max(1, deadline - createdAt);
    const isClosedOrResolved = ["RESOLVED", "CLOSED"].includes(grievance.status);

    let effectiveEndTime = currentTime;
    if (isClosedOrResolved && grievance.resolvedAt) {
      effectiveEndTime = new Date(grievance.resolvedAt).getTime();
    }

    const elapsedMs = Math.max(0, effectiveEndTime - createdAt);
    const remainingMs = deadline - effectiveEndTime;
    const elapsedPercentage = Math.round((elapsedMs / totalDurationMs) * 100);

    let slaStatus = "ON_TRACK"; // "ON_TRACK" | "WARNING" | "BREACHED" | "RESOLVED_ON_TIME" | "RESOLVED_BREACHED"

    if (isClosedOrResolved) {
      slaStatus = effectiveEndTime <= deadline ? "RESOLVED_ON_TIME" : "RESOLVED_BREACHED";
    } else {
      if (currentTime > deadline) {
        slaStatus = "BREACHED";
      } else if (elapsedPercentage >= SLA_RULES.THRESHOLDS.WARNING_PERCENT) {
        slaStatus = "WARNING";
      } else {
        slaStatus = "ON_TRACK";
      }
    }

    const remainingHours = Math.max(0, Math.floor(remainingMs / (3600 * 1000)));
    const remainingMinutes = Math.max(0, Math.floor((remainingMs % (3600 * 1000)) / (60 * 1000)));
    const breachHours = currentTime > deadline ? Math.floor((currentTime - deadline) / (3600 * 1000)) : 0;
    const breachMinutes = currentTime > deadline ? Math.floor(((currentTime - deadline) % (3600 * 1000)) / (60 * 1000)) : 0;

    return {
      slaStatus,
      elapsedPercentage,
      isBreached: !isClosedOrResolved && currentTime > deadline,
      isWarning: !isClosedOrResolved && elapsedPercentage >= SLA_RULES.THRESHOLDS.WARNING_PERCENT && currentTime <= deadline,
      remainingMs,
      remainingFormatted: remainingMs > 0 ? `${remainingHours}h ${remainingMinutes}m` : '0h 0m',
      breachFormatted: currentTime > deadline ? `${breachHours}h ${breachMinutes}m overdue` : null,
      totalDurationHours: (totalDurationMs / (3600 * 1000)).toFixed(1)
    };
  }

  /**
   * Run routine audit check across all grievances.
   * Auto-triggers escalations and notifications when thresholds are crossed.
   */
  static runAuditCheck() {
    const grievances = db.getAllGrievances();
    const simulatedNow = db.getCurrentSimulatedTime();
    let escalationsTriggered = 0;
    let warningsIssued = 0;

    for (const g of grievances) {
      if (["RESOLVED", "CLOSED"].includes(g.status)) continue;

      const slaMetrics = this.evaluateGrievanceSla(g, simulatedNow);
      const currentLevel = g.escalationLevel || 0;
      let newLevel = currentLevel;
      let newStatus = g.status;

      // Determine required escalation level based on elapsed % and breach severity
      if (slaMetrics.isBreached) {
        if (slaMetrics.elapsedPercentage >= 200 || (g.priority === "CRITICAL" && slaMetrics.elapsedPercentage >= 150)) {
          newLevel = 3;
          newStatus = "ESCALATED_L3";
        } else if (slaMetrics.elapsedPercentage >= 150 || g.priority === "CRITICAL") {
          newLevel = 2;
          newStatus = "ESCALATED_L2";
        } else {
          newLevel = 1;
          newStatus = "ESCALATED_L1";
        }
      }

      // Check if new escalation needed
      if (newLevel > currentLevel) {
        escalationsTriggered++;
        const levelConfig = SLA_RULES.ESCALATION_LEVELS[`LEVEL_${newLevel}`];
        
        db.updateGrievance(g.id, {
          escalationLevel: newLevel,
          status: newStatus
        });

        // Add to timeline
        db.addTimelineEvent(g.id, {
          title: `Automated SLA Escalation -> Level ${newLevel}`,
          description: `SLA breached (${slaMetrics.breachFormatted}). Case escalated to ${levelConfig.title} (${levelConfig.role}). Immediate corrective action demanded.`,
          actor: "SLA Monitoring Daemon",
          metadata: { level: newLevel, breachInfo: slaMetrics.breachFormatted }
        });

        // Add to audit log
        db.addAuditLog({
          grievanceId: g.id,
          trackingToken: g.trackingToken,
          action: `SLA_AUTO_ESCALATION_L${newLevel}`,
          actor: "SLA Monitoring Daemon",
          details: `Ticket ${g.trackingToken} reached Level ${newLevel} escalation. Assignee: ${levelConfig.title}.`
        });

        // Dispatch High-Priority In-App & Mock SMS Notification
        db.addNotification({
          recipientType: "SUPERVISOR",
          recipientId: g.departmentId,
          grievanceId: g.id,
          trackingToken: g.trackingToken,
          title: `CRITICAL ESCALATION [L${newLevel}]: ${g.title}`,
          message: `Ticket ${g.trackingToken} in ${g.wardName} exceeded SLA by ${slaMetrics.breachFormatted}. Escalated to ${levelConfig.title}.`,
          type: "BREACH_CRITICAL"
        });
      } else if (slaMetrics.isWarning && !g.warningNotified) {
        warningsIssued++;
        db.updateGrievance(g.id, { warningNotified: true });

        db.addNotification({
          recipientType: "OFFICER",
          recipientId: g.assignedOfficer?.id || g.departmentId,
          grievanceId: g.id,
          trackingToken: g.trackingToken,
          title: `SLA Warning (75% Elapsed): ${g.title}`,
          message: `Grievance ${g.trackingToken} has only ${slaMetrics.remainingFormatted} remaining before SLA breach. Please complete resolution immediately.`,
          type: "BREACH_WARNING"
        });
      }
    }

    return {
      auditedCount: grievances.length,
      escalationsTriggered,
      warningsIssued,
      timestamp: simulatedNow.toISOString()
    };
  }
}

