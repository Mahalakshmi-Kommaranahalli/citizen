import { db } from '../db/index.js';
import { PRIORITY_CONFIG } from '../config/departments.js';

// Emergency and high-hazard keywords that boost urgency score
const CRITICAL_HAZARD_KEYWORDS = [
  "danger", "dangerous", "emergency", "accident", "casualty", "death", "hazard", 
  "live wire", "open manhole", "sparking", "fire", "sinkhole", "road caving", 
  "pipeline burst", "burst pipe", "sewage flood", "dengue", "epidemic", "stomach infection", 
  "hospital", "school", "children", "ambulance", "collapsed", "hanging wire", "shock"
];

const HIGH_PRIORITY_KEYWORDS = [
  "urgent", "overflowing", "blocked", "garbage dump", "pitch black", "darkness", 
  "safety", "night", "woman", "stagnant", "mosquito", "contaminated", "dirty water", 
  "foul smell", "rotting", "deep pothole"
];

export class RoutingEngine {
  /**
   * Analyze grievance text, determine department, category, priority, and assign officer
   */
  static analyzeAndRoute({ title, description, category, wardId, coordinates, requestedPriority }) {
    const departments = db.getDepartments();
    const wards = db.getWards();

    const fullText = `${title || ''} ${description || ''}`.toLowerCase();

    // 1. Calculate Department Scores
    const deptScores = departments.map(dept => {
      let score = 0;
      const matchedKeywords = [];

      // Check department global keywords
      if (dept.keywords) {
        dept.keywords.forEach(kw => {
          const regex = new RegExp(`\\b${kw.toLowerCase()}\\b`, 'gi');
          const matches = fullText.match(regex);
          if (matches) {
            score += matches.length * 10;
            matchedKeywords.push(kw);
          }
        });
      }

      // Check specific category matches
      if (dept.categories) {
        dept.categories.forEach(cat => {
          if (category && (cat.id === category || cat.name.toLowerCase() === category.toLowerCase())) {
            score += 50; // explicit category match boost
            matchedKeywords.push(`category:${cat.name}`);
          }
          const catRegex = new RegExp(`\\b${cat.name.toLowerCase()}\\b`, 'gi');
          if (fullText.match(catRegex)) {
            score += 25;
            matchedKeywords.push(cat.name);
          }
        });
      }

      return {
        department: dept,
        score,
        matchedKeywords: [...new Set(matchedKeywords)]
      };
    });

    // Sort by highest score
    deptScores.sort((a, b) => b.score - a.score);

    // Pick top department or fallback to Sanitation/General if no strong match
    let selectedDept = deptScores[0]?.score > 0 ? deptScores[0].department : departments[0];
    let matchedKeywords = deptScores[0]?.matchedKeywords || [];

    // If citizen explicitly selected a known category, ensure matching department
    if (category) {
      const explicitDept = departments.find(d => d.categories.some(c => c.id === category));
      if (explicitDept) {
        selectedDept = explicitDept;
      }
    }

    // Determine category details
    let selectedCategory = selectedDept.categories.find(c => c.id === category) || selectedDept.categories[0];

    // 2. Assess Urgency & Calculate Safety Score (0-100)
    let urgencyScore = 30; // base standard score
    const detectedSafetyHazards = [];

    CRITICAL_HAZARD_KEYWORDS.forEach(hazard => {
      if (fullText.includes(hazard.toLowerCase())) {
        urgencyScore += 25;
        detectedSafetyHazards.push(hazard);
      }
    });

    HIGH_PRIORITY_KEYWORDS.forEach(kw => {
      if (fullText.includes(kw.toLowerCase())) {
        urgencyScore += 12;
        detectedSafetyHazards.push(kw);
      }
    });

    urgencyScore = Math.min(100, urgencyScore);

    // Determine priority
    let priority = "MEDIUM";
    if (urgencyScore >= 75 || detectedSafetyHazards.some(h => ["live wire", "open manhole", "death", "fire", "sinkhole"].includes(h))) {
      priority = "CRITICAL";
    } else if (urgencyScore >= 50 || requestedPriority === "HIGH") {
      priority = "HIGH";
    } else if (requestedPriority === "LOW" && urgencyScore < 40) {
      priority = "LOW";
    } else if (requestedPriority) {
      priority = requestedPriority;
    } else if (selectedCategory.defaultPriority) {
      priority = selectedCategory.defaultPriority;
    }

    // 3. Resolve Ward
    let selectedWard = wards.find(w => w.id === wardId);
    if (!selectedWard && coordinates && coordinates.lat && coordinates.lng) {
      // Find closest ward center by euclidean distance
      selectedWard = wards.reduce((closest, ward) => {
        const d = Math.hypot(ward.center.lat - coordinates.lat, ward.center.lng - coordinates.lng);
        return d < closest.dist ? { ward, dist: d } : closest;
      }, { ward: wards[0], dist: Infinity }).ward;
    }
    if (!selectedWard) {
      selectedWard = wards[0];
    }

    // 4. Assign Field Officer
    const officer = selectedWard.officers[selectedDept.id] || {
      id: `OFF_${selectedDept.shortCode}_GEN`,
      name: `${selectedDept.name} Ward Liaison`,
      title: `Junior Engineer (${selectedDept.shortCode})`,
      phone: "+91 98000 00000",
      email: `${selectedDept.shortCode.toLowerCase()}.officer@nagarseva.gov.in`
    };

    // 5. Calculate SLA Hours & Deadline
    let baseSlaHours = selectedCategory.baseSlaHours || 24;
    const prioConfig = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.MEDIUM;
    
    // Scale SLA by priority
    let effectiveSlaHours = Math.round(baseSlaHours * (prioConfig.slaMultiplier || 1.0));
    // Hard ceiling for critical
    if (priority === "CRITICAL" && effectiveSlaHours > 12) {
      effectiveSlaHours = 12;
    }
    // Hard minimum 2 hours
    effectiveSlaHours = Math.max(2, effectiveSlaHours);

    const currentTime = db.getCurrentSimulatedTime();
    const slaDeadline = new Date(currentTime.getTime() + effectiveSlaHours * 3600 * 1000).toISOString();

    // 6. Build Comprehensive Routing Explanation
    const explanationParts = [
      `Automated Classification: Routed to '${selectedDept.name}' (Dept Code: ${selectedDept.shortCode}).`,
      matchedKeywords.length > 0 ? `Trigger keywords detected: [${matchedKeywords.slice(0, 4).join(', ')}].` : null,
      `Calculated Urgency Score: ${urgencyScore}/100. Priority assigned: ${priority}.`,
      detectedSafetyHazards.length > 0 ? `Safety alert triggers: [${detectedSafetyHazards.slice(0, 3).join(', ')}].` : null,
      `Jurisdiction: Assigned to ${selectedWard.name} Field Officer ${officer.name} (${officer.title}).`,
      `SLA Guarantee: ${effectiveSlaHours} Hours resolution window (Target: ${new Date(slaDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}).`
    ].filter(Boolean);

    return {
      departmentId: selectedDept.id,
      departmentName: selectedDept.name,
      category: selectedCategory.id,
      categoryName: selectedCategory.name,
      wardId: selectedWard.id,
      wardName: selectedWard.name,
      priority,
      urgencyScore,
      assignedOfficer: officer,
      slaHours: effectiveSlaHours,
      slaDeadline,
      routingReason: explanationParts.join(' ')
    };
  }
}

