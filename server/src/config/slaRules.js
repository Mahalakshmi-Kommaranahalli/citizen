export const SLA_RULES = {
  // Escalation stages
  ESCALATION_LEVELS: {
    LEVEL_0: {
      level: 0,
      title: "Ward Field Officer",
      role: "Assignee / Inspector",
      action: "Initial Investigation & Ground Action",
      alertColor: "blue"
    },
    LEVEL_1: {
      level: 1,
      title: "Assistant / Executive Engineer & Ward Supervisor",
      role: "Department Supervisor",
      trigger: "100% SLA Elapsed without resolution",
      action: "Supervisory Intervention & Resource Reallocation",
      alertColor: "amber"
    },
    LEVEL_2: {
      level: 2,
      title: "Superintending Engineer & Zonal Commissioner",
      role: "Zonal Head",
      trigger: "150% SLA Elapsed (Breach > 12h)",
      action: "Direct Oversight & Administrative Notice to Officer",
      alertColor: "orange"
    },
    LEVEL_3: {
      level: 3,
      title: "Municipal Commissioner & District Magistrate",
      role: "Chief Executive Authority",
      trigger: "200% SLA Elapsed or Unresolved Critical Emergency",
      action: "High-level Executive Inquest & Disciplinary Audit Flag",
      alertColor: "red"
    }
  },

  // SLA Warning thresholds
  THRESHOLDS: {
    WARNING_PERCENT: 75, // Triggers early warning at 75% elapsed
    BREACH_PERCENT: 100  // Triggers escalation level 1 at 100% elapsed
  },

  // Base SLA in Hours by Department and Priority
  // If not explicitly set in category, this fallback matrix applies:
  DEFAULT_HOURS_MATRIX: {
    CRITICAL: 12,
    HIGH: 24,
    MEDIUM: 48,
    LOW: 96
  }
};

