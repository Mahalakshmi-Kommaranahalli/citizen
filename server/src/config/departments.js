export const DEPARTMENTS = [
  {
    id: "DEPT_SAN",
    name: "Sanitation & Solid Waste Management",
    shortCode: "SAN",
    icon: "Trash2",
    color: "emerald",
    headOfficer: {
      name: "Dr. Sunita Deshmukh",
      title: "Chief Sanitation Executive Officer",
      email: "sanitation.head@nagarseva.gov.in",
      phone: "+91 98201 11201"
    },
    categories: [
      { id: "garbage_dump", name: "Garbage Pile / Illegal Dumping", baseSlaHours: 24, defaultPriority: "HIGH" },
      { id: "door_collection", name: "Missed Door-to-Door Waste Collection", baseSlaHours: 18, defaultPriority: "MEDIUM" },
      { id: "dead_animal", name: "Animal Carcass Removal (Urgent)", baseSlaHours: 6, defaultPriority: "CRITICAL" },
      { id: "public_bin", name: "Overflowing Public Dustbins", baseSlaHours: 12, defaultPriority: "HIGH" },
      { id: "street_sweeping", name: "Unattended Street Sweeping", baseSlaHours: 36, defaultPriority: "LOW" }
    ],
    keywords: [
      "garbage", "trash", "waste", "dump", "dustbin", "litter", "rubbish", 
      "debris", "sweeping", "dead animal", "carcass", "stink", "foul smell", 
      "compost", "filth", "dumping yard"
    ]
  },
  {
    id: "DEPT_ROADS",
    name: "Roads, Footpaths & Civil Infrastructure",
    shortCode: "ROADS",
    icon: "Hammer",
    color: "amber",
    headOfficer: {
      name: "Er. Rameshwar Rao",
      title: "Superintending Engineer (Civil & Roads)",
      email: "roads.head@nagarseva.gov.in",
      phone: "+91 98201 11202"
    },
    categories: [
      { id: "pothole", name: "Dangerous Pothole / Road Depression", baseSlaHours: 48, defaultPriority: "HIGH" },
      { id: "road_caving", name: "Road Caving / Sinkhole (Hazardous)", baseSlaHours: 12, defaultPriority: "CRITICAL" },
      { id: "footpath_damaged", name: "Broken Footpath / Missing Paver Block", baseSlaHours: 72, defaultPriority: "MEDIUM" },
      { id: "road_divider", name: "Damaged Road Divider / Guard Rail", baseSlaHours: 48, defaultPriority: "MEDIUM" },
      { id: "speed_breaker", name: "Unpainted or Broken Speed Breaker", baseSlaHours: 72, defaultPriority: "LOW" }
    ],
    keywords: [
      "pothole", "road", "pavement", "footpath", "asphalt", "tar", "sinkhole", 
      "caving", "crater", "divider", "guard rail", "speed breaker", "paver blocks", 
      "manhole cover", "trench", "excavation", "broken road"
    ]
  },
  {
    id: "DEPT_WATER",
    name: "Water Supply & Sewerage Board",
    shortCode: "WATER",
    icon: "Droplets",
    color: "blue",
    headOfficer: {
      name: "Er. Anita Nambiar",
      title: "Chief Engineer (Water & Sewerage)",
      email: "water.head@nagarseva.gov.in",
      phone: "+91 98201 11203"
    },
    categories: [
      { id: "pipe_burst", name: "Main Water Pipeline Burst / Heavy Leak", baseSlaHours: 8, defaultPriority: "CRITICAL" },
      { id: "contaminated_water", name: "Contaminated / Turbid Tap Water Supply", baseSlaHours: 16, defaultPriority: "CRITICAL" },
      { id: "no_water", name: "Complete Disruption of Water Supply", baseSlaHours: 24, defaultPriority: "HIGH" },
      { id: "low_pressure", name: "Persistent Low Water Pressure", baseSlaHours: 72, defaultPriority: "MEDIUM" },
      { id: "sewage_overflow", name: "Sewer Chamber Overflowing / Choked Line", baseSlaHours: 18, defaultPriority: "CRITICAL" },
      { id: "missing_manhole", name: "Missing or Open Sewer Manhole Lid", baseSlaHours: 4, defaultPriority: "CRITICAL" }
    ],
    keywords: [
      "water", "pipe", "pipeline", "leak", "burst", "contamination", "dirty water", 
      "drinking water", "tap", "sewage", "sewer", "drain", "manhole", "gutter", 
      "smelly water", "no water", "dry tap", "overflow", "drainage"
    ]
  },
  {
    id: "DEPT_ELEC",
    name: "Electricity, Streetlights & Energy",
    shortCode: "ELEC",
    icon: "Zap",
    color: "yellow",
    headOfficer: {
      name: "Er. K. V. Narayanan",
      title: "Executive Engineer (Public Electricals)",
      email: "electrical.head@nagarseva.gov.in",
      phone: "+91 98201 11204"
    },
    categories: [
      { id: "live_wire", name: "Live Exposed Electrical Cable / Sparking", baseSlaHours: 3, defaultPriority: "CRITICAL" },
      { id: "pole_tilt", name: "Tilted / Collapsed Electric Pole", baseSlaHours: 8, defaultPriority: "CRITICAL" },
      { id: "streetlight_out", name: "Single Streetlight Not Glowing", baseSlaHours: 48, defaultPriority: "MEDIUM" },
      { id: "dark_stretch", name: "Entire Street / Colony In Darkness", baseSlaHours: 12, defaultPriority: "HIGH" },
      { id: "transformer_issue", name: "Transformer Sparking / Oil Leak", baseSlaHours: 6, defaultPriority: "CRITICAL" }
    ],
    keywords: [
      "streetlight", "light", "dark", "lamp", "pole", "wire", "cable", 
      "sparking", "current", "shock", "electricity", "transformer", "power cut", 
      "short circuit", "hanging wire", "blackout", "live wire"
    ]
  },
  {
    id: "DEPT_HEALTH",
    name: "Public Health & Vector Disease Control",
    shortCode: "HEALTH",
    icon: "ShieldAlert",
    color: "rose",
    headOfficer: {
      name: "Dr. Farhan Qureshi",
      title: "Chief Municipal Health Officer",
      email: "health.head@nagarseva.gov.in",
      phone: "+91 98201 11205"
    },
    categories: [
      { id: "mosquito_breeding", name: "Dengue/Malaria Mosquito Fogging Request", baseSlaHours: 24, defaultPriority: "HIGH" },
      { id: "stagnant_pool", name: "Large Stagnant Water Pool Breeding Pests", baseSlaHours: 36, defaultPriority: "HIGH" },
      { id: "stray_animals", name: "Aggressive Stray Dogs / Animal Menace", baseSlaHours: 48, defaultPriority: "MEDIUM" },
      { id: "food_hygiene", name: "Unhygienic Food Stall / Adulteration Alert", baseSlaHours: 48, defaultPriority: "MEDIUM" }
    ],
    keywords: [
      "mosquito", "dengue", "malaria", "fogging", "spray", "stagnant water", 
      "larvae", "epidemic", "stray dog", "dog bite", "rabies", "hygiene", 
      "food stall", "contamination", "pest control"
    ]
  },
  {
    id: "DEPT_DRAIN",
    name: "Stormwater Drainage & Flood Management",
    shortCode: "DRAIN",
    icon: "Waves",
    color: "cyan",
    headOfficer: {
      name: "Er. Brijesh Solanki",
      title: "Superintending Engineer (Stormwater)",
      email: "drainage.head@nagarseva.gov.in",
      phone: "+91 98201 11206"
    },
    categories: [
      { id: "monsoon_flood", name: "Severe Waterlogging / Residential Inundation", baseSlaHours: 6, defaultPriority: "CRITICAL" },
      { id: "culvert_block", name: "Choked Major Storm Drain / Nullah", baseSlaHours: 24, defaultPriority: "HIGH" },
      { id: "desilting", name: "Pre-Monsoon Desilting Incomplete", baseSlaHours: 72, defaultPriority: "MEDIUM" }
    ],
    keywords: [
      "waterlogging", "flood", "flooding", "nullah", "stormwater", "drain", 
      "inundation", "culvert", "desilting", "monsoon", "clogged drain", "choked drain"
    ]
  },
  {
    id: "DEPT_PARKS",
    name: "Parks, Urban Forestry & Tree Management",
    shortCode: "PARKS",
    icon: "Trees",
    color: "teal",
    headOfficer: {
      name: "Smt. Kalyani Sundaram",
      title: "Director of Urban Forestry & Parks",
      email: "parks.head@nagarseva.gov.in",
      phone: "+91 98201 11207"
    },
    categories: [
      { id: "tree_fall", name: "Fallen Tree Blocking Road / Traffic", baseSlaHours: 4, defaultPriority: "CRITICAL" },
      { id: "dangerous_branch", name: "Hazardous Overhanging Branch Over Wire/Roof", baseSlaHours: 24, defaultPriority: "HIGH" },
      { id: "park_amenity", name: "Damaged Public Park Equipment / Lights", baseSlaHours: 96, defaultPriority: "LOW" }
    ],
    keywords: [
      "tree", "branch", "pruning", "fallen tree", "park", "garden", "lawn", 
      "foliage", "overhanging", "horticulture", "playground equipment"
    ]
  },
  {
    id: "DEPT_REV",
    name: "Town Planning, Encroachments & Civic Order",
    shortCode: "REV",
    icon: "Building2",
    color: "indigo",
    headOfficer: {
      name: "Shri Vikramaditya Verma",
      title: "Assistant Municipal Commissioner (Enforcement)",
      email: "planning.head@nagarseva.gov.in",
      phone: "+91 98201 11208"
    },
    categories: [
      { id: "encroachment", name: "Illegal Footpath Encroachment / Hawkers", baseSlaHours: 72, defaultPriority: "MEDIUM" },
      { id: "illegal_construction", name: "Unauthorized Construction Activity", baseSlaHours: 48, defaultPriority: "HIGH" },
      { id: "noise_nuisance", name: "Commercial Loudspeaker / Late Night Noise", baseSlaHours: 12, defaultPriority: "HIGH" }
    ],
    keywords: [
      "encroachment", "hawker", "illegal construction", "unauthorized", 
      "hoarding", "loudspeaker", "noise", "footpath blocked", "commercial nuisance"
    ]
  }
];

export const PRIORITY_CONFIG = {
  CRITICAL: {
    label: "Critical (Emergency)",
    color: "red",
    bgClass: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900",
    slaMultiplier: 0.5,
    maxResolutionHours: 12,
    escalationThresholdHours: 8
  },
  HIGH: {
    label: "High Priority",
    color: "orange",
    bgClass: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-900",
    slaMultiplier: 1.0,
    maxResolutionHours: 24,
    escalationThresholdHours: 18
  },
  MEDIUM: {
    label: "Medium Priority",
    color: "amber",
    bgClass: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900",
    slaMultiplier: 1.5,
    maxResolutionHours: 48,
    escalationThresholdHours: 36
  },
  LOW: {
    label: "Standard / Low",
    color: "blue",
    bgClass: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900",
    slaMultiplier: 2.0,
    maxResolutionHours: 96,
    escalationThresholdHours: 72
  }
};

