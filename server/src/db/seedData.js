export const SEED_GRIEVANCES = [
  {
    id: "grv-1001",
    trackingToken: "GRV-2026-8910",
    title: "Deep Hazardous Pothole near Main Market Crossing",
    description: "A very large pothole (over 1.5 feet deep) has formed right at the busy traffic intersection. Two two-wheelers skidded yesterday evening. Immediate resurfacing required before accidents happen.",
    category: "pothole",
    categoryName: "Dangerous Pothole / Road Depression",
    departmentId: "DEPT_ROADS",
    departmentName: "Roads, Footpaths & Civil Infrastructure",
    wardId: "WARD_01",
    wardName: "Ward 1 - North Ridge & Civil Lines",
    address: "Opposite Gurudwara Road, Near Main Market Crossing, Civil Lines",
    coordinates: { lat: 28.6932, lng: 77.2145 },
    citizen: {
      name: "Rohit Malhotra",
      phone: "+91 98765 43210",
      email: "rohit.m@gmail.com",
      isAnonymous: false
    },
    priority: "HIGH",
    urgencyScore: 82,
    routingReason: "Auto-routed to Roads Dept based on detected tokens: 'pothole', 'resurfacing', 'traffic'. Priority set to HIGH due to public safety risk near busy crossing.",
    status: "RESOLVED",
    assignedOfficer: {
      id: "OFF_ROADS_01",
      name: "Pooja Hegde",
      title: "Asst. Engineer (Roads) W-01",
      phone: "+91 98101 22002",
      email: "pooja.roads@nagarseva.gov.in"
    },
    escalationLevel: 0,
    slaHours: 24,
    createdAt: new Date(Date.now() - 32 * 3600 * 1000).toISOString(),
    slaDeadline: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    upvotes: 24,
    attachments: [
      {
        id: "att-1",
        type: "citizen_proof",
        url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80",
        caption: "Deep crater in road surface"
      }
    ],
    resolution: {
      resolvedBy: "Pooja Hegde (Asst. Engineer)",
      summary: "Cold mix asphalt resurfacing completed, compacted with vibratory roller. Traffic flow restored smoothly.",
      proofImage: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80",
      materialsUsed: "Bituminous cold mix (450 kg), tack coat, stone grit",
      resolvedAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString()
    },
    feedback: {
      rating: 5,
      comment: "Super fast action by Pooja Hegde and the civil road crew! Repaired within 22 hours.",
      submittedAt: new Date(Date.now() - 9 * 3600 * 1000).toISOString()
    },
    timeline: [
      {
        step: 1,
        title: "Grievance Lodged",
        description: "Complaint registered by citizen Rohit Malhotra via Web Portal.",
        timestamp: new Date(Date.now() - 32 * 3600 * 1000).toISOString(),
        actor: "Citizen"
      },
      {
        step: 2,
        title: "Intelligent Auto-Routing",
        description: "AI & Rule Engine classified to DEPT_ROADS, assigned Ward 1 Field Engineer Pooja Hegde. SLA deadline set to 24 Hours.",
        timestamp: new Date(Date.now() - 32 * 3600 * 1000 + 45000).toISOString(),
        actor: "Auto-Routing Engine"
      },
      {
        step: 3,
        title: "Inspection & Work Order Issued",
        description: "Officer Pooja Hegde visited site, measured 2.2m x 1.4m cavity, asphalt patch team dispatched.",
        timestamp: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
        actor: "Pooja Hegde"
      },
      {
        step: 4,
        title: "Redressal Completed & Proof Uploaded",
        description: "Cold mix asphalt compacted, inspection passed, resolution proof documented.",
        timestamp: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
        actor: "Pooja Hegde"
      },
      {
        step: 5,
        title: "Citizen Feedback Received",
        description: "Citizen gave a 5-star rating with positive remarks.",
        timestamp: new Date(Date.now() - 9 * 3600 * 1000).toISOString(),
        actor: "Rohit Malhotra"
      }
    ]
  },
  {
    id: "grv-1002",
    trackingToken: "GRV-2026-9204",
    title: "Open Sewer Manhole Without Cover - Extreme Danger",
    description: "Deep open sewer manhole on walking path right outside Modern Public School gate. Children and pedestrians are at risk of falling in, especially after dark as streetlights are dim here.",
    category: "missing_manhole",
    categoryName: "Missing or Open Sewer Manhole Lid",
    departmentId: "DEPT_WATER",
    departmentName: "Water Supply & Sewerage Board",
    wardId: "WARD_02",
    wardName: "Ward 2 - Riverside Heritage & Old City",
    address: "Gate No. 2, Modern Public High School, Daryaganj Heritage Lane",
    coordinates: { lat: 28.6521, lng: 77.2312 },
    citizen: {
      name: "Meenakshi Sundaram",
      phone: "+91 98450 12345",
      email: "meenakshi.s@gmail.com",
      isAnonymous: false
    },
    priority: "CRITICAL",
    urgencyScore: 98,
    routingReason: "Triggered emergency rule: 'open manhole' near 'school'. Urgency score 98/100 -> CRITICAL priority with 4-hour emergency SLA.",
    status: "ESCALATED_L2",
    assignedOfficer: {
      id: "OFF_WATER_02",
      name: "Gopal Krishna",
      title: "Junior Engineer (Water) W-02",
      phone: "+91 98101 22013",
      email: "gopal.water@nagarseva.gov.in"
    },
    escalationLevel: 2,
    slaHours: 4,
    createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    slaDeadline: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    upvotes: 48,
    attachments: [
      {
        id: "att-2",
        type: "citizen_proof",
        url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80",
        caption: "Exposed sewer opening on school footpath"
      }
    ],
    timeline: [
      {
        step: 1,
        title: "Emergency Grievance Lodged",
        description: "Citizen reported open manhole directly outside school entrance.",
        timestamp: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
        actor: "Citizen"
      },
      {
        step: 2,
        title: "Critical Auto-Routing & SMS Broadcast",
        description: "Emergency keyword detected. Assigned to Ward 2 Water & Sewerage JE Gopal Krishna. High-priority dispatch SMS transmitted.",
        timestamp: new Date(Date.now() - 14 * 3600 * 1000 + 30000).toISOString(),
        actor: "System Routing Engine"
      },
      {
        step: 3,
        title: "SLA Level 1 Escalation Triggered",
        description: "Resolution not logged within 4 hours. Automated escalation to Superintending Engineer Er. Anita Nambiar.",
        timestamp: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
        actor: "SLA Monitoring Daemon"
      },
      {
        step: 4,
        title: "SLA Level 2 Escalation (Zonal Commissioner)",
        description: "Breach exceeded 6 hours for Critical ticket. Alert escalated to Zonal Commissioner Smt. Archana Meena (IAS). Emergency barricading ordered.",
        timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        actor: "SLA Monitoring Daemon"
      }
    ]
  },
  {
    id: "grv-1003",
    trackingToken: "GRV-2026-6411",
    title: "Contaminated Muddy Drinking Water from Municipal Tap",
    description: "For the past 48 hours, yellow and black foul-smelling water is flowing from our household pipeline in Sector 4. Residents suspect mixing with an underground sewer line. Two children have developed stomach infections.",
    category: "contaminated_water",
    categoryName: "Contaminated / Turbid Tap Water Supply",
    departmentId: "DEPT_WATER",
    departmentName: "Water Supply & Sewerage Board",
    wardId: "WARD_01",
    wardName: "Ward 1 - North Ridge & Civil Lines",
    address: "Blocks C & D, Civil Lines Residential Enclave",
    coordinates: { lat: 28.6910, lng: 77.2180 },
    citizen: {
      name: "Kavita Swaminathan",
      phone: "+91 97112 33445",
      email: "kavita.swami@outlook.com",
      isAnonymous: false
    },
    priority: "CRITICAL",
    urgencyScore: 94,
    routingReason: "Tokens detected: 'contaminated', 'foul-smelling', 'sewer line', 'children stomach infections'. Auto-escalated to Water Dept with Critical priority.",
    status: "IN_PROGRESS",
    assignedOfficer: {
      id: "OFF_WATER_01",
      name: "Suresh Pillai",
      title: "Junior Engineer (Water) W-01",
      phone: "+91 98101 22003",
      email: "suresh.water@nagarseva.gov.in"
    },
    escalationLevel: 0,
    slaHours: 16,
    createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    slaDeadline: new Date(Date.now() + 10 * 3600 * 1000).toISOString(),
    upvotes: 31,
    attachments: [
      {
        id: "att-3",
        type: "citizen_proof",
        url: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&auto=format&fit=crop&q=80",
        caption: "Discolored tap water collected in bottle"
      }
    ],
    timeline: [
      {
        step: 1,
        title: "Grievance Lodged",
        description: "Complaint registered regarding sewage mixing in potable drinking line.",
        timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
        actor: "Citizen"
      },
      {
        step: 2,
        title: "Auto-Routed with Critical SLA",
        description: "16-hour SLA applied. Field team led by JE Suresh Pillai deployed with acoustic leak detector.",
        timestamp: new Date(Date.now() - 6 * 3600 * 1000 + 40000).toISOString(),
        actor: "Auto-Routing Engine"
      },
      {
        step: 3,
        title: "Field Inspection in Progress",
        description: "Excavation began at Valve 14 junction. Water tanker supply dispatched to affected colony as interim relief.",
        timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        actor: "Suresh Pillai"
      }
    ]
  },
  {
    id: "grv-1004",
    trackingToken: "GRV-2026-7832",
    title: "Massive Garbage Mound Overspilling on Main Highway Service Road",
    description: "Municipal waste compactor truck hasn't visited this corner for 4 days. Commercial restaurants have dumped plastic bags and leftover food. Stray cows and dogs scattering garbage on the road.",
    category: "garbage_dump",
    categoryName: "Garbage Pile / Illegal Dumping",
    departmentId: "DEPT_SAN",
    departmentName: "Sanitation & Solid Waste Management",
    wardId: "WARD_05",
    wardName: "Ward 5 - West Industrial Estate & Logistics Hub",
    address: "Corner of Phase-2 Logistics Avenue & Ring Service Road",
    coordinates: { lat: 28.6540, lng: 77.1180 },
    citizen: {
      name: "Amandeep Gill",
      phone: "+91 99100 87654",
      email: "gill.aman@gmail.com",
      isAnonymous: false
    },
    priority: "HIGH",
    urgencyScore: 78,
    routingReason: "Detected 'garbage', 'waste compactor', 'dumped', 'stink'. Assigned to Sanitation Dept Ward 5 Inspector Jaspal Bhatti.",
    status: "IN_PROGRESS",
    assignedOfficer: {
      id: "OFF_SAN_05",
      name: "Jaspal Bhatti",
      title: "Sanitary Inspector W-05",
      phone: "+91 98101 22041",
      email: "jaspal.san@nagarseva.gov.in"
    },
    escalationLevel: 0,
    slaHours: 24,
    createdAt: new Date(Date.now() - 21 * 3600 * 1000).toISOString(),
    slaDeadline: new Date(Date.now() + 3 * 3600 * 1000).toISOString(),
    upvotes: 18,
    attachments: [
      {
        id: "att-4",
        type: "citizen_proof",
        url: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&auto=format&fit=crop&q=80",
        caption: "Overspilling roadside garbage bin"
      }
    ],
    timeline: [
      {
        step: 1,
        title: "Grievance Lodged",
        description: "Citizen logged complaint with photo of garbage overspill.",
        timestamp: new Date(Date.now() - 21 * 3600 * 1000).toISOString(),
        actor: "Citizen"
      },
      {
        step: 2,
        title: "Auto-Routed to Sanitation",
        description: "Assigned to Sanitary Inspector Jaspal Bhatti. SLA: 24 Hours.",
        timestamp: new Date(Date.now() - 21 * 3600 * 1000 + 50000).toISOString(),
        actor: "Auto-Routing Engine"
      },
      {
        step: 3,
        title: "SLA Approaching Warning",
        description: "Ticket has reached 85% of SLA threshold without resolution closure. Early warning ping sent to inspector.",
        timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
        actor: "SLA Monitoring Daemon"
      },
      {
        step: 4,
        title: "Backhoe Loader Dispatched",
        description: "Inspector Bhatti reported JCB loader and 2 tipper trucks en route to clear site.",
        timestamp: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
        actor: "Jaspal Bhatti"
      }
    ]
  },
  {
    id: "grv-1005",
    trackingToken: "GRV-2026-3199",
    title: "12 Streetlights Non-Functional in Cyber Tech Park Promenade",
    description: "Complete stretch of 500 meters along Tech Park Gate 4 is pitch black every evening. Multiple female employees walk this path to the metro station. Urgent repair needed.",
    category: "dark_stretch",
    categoryName: "Entire Street / Colony In Darkness",
    departmentId: "DEPT_ELEC",
    departmentName: "Electricity, Streetlights & Energy",
    wardId: "WARD_03",
    wardName: "Ward 3 - Cyber Tech Corridor & Highrise",
    address: "Pathway between Cyber City Metro & Tower 5 Promenade",
    coordinates: { lat: 28.6312, lng: 77.2920 },
    citizen: {
      name: "Priyanka Sen",
      phone: "+91 98118 77665",
      email: "priyanka.sen@infotech.com",
      isAnonymous: false
    },
    priority: "HIGH",
    urgencyScore: 84,
    routingReason: "Detected keywords 'streetlights', 'pitch black', 'female safety'. Priority elevated to HIGH.",
    status: "ESCALATED_L1",
    assignedOfficer: {
      id: "OFF_ELEC_03",
      name: "Satish Chand",
      title: "Lineman In-charge W-03",
      phone: "+91 98101 22024",
      email: "satish.elec@nagarseva.gov.in"
    },
    escalationLevel: 1,
    slaHours: 12,
    createdAt: new Date(Date.now() - 15 * 3600 * 1000).toISOString(),
    slaDeadline: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    upvotes: 62,
    attachments: [
      {
        id: "att-5",
        type: "citizen_proof",
        url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
        caption: "Dark pathway without functional illumination"
      }
    ],
    timeline: [
      {
        step: 1,
        title: "Grievance Lodged",
        description: "Complaint filed highlighting woman safety concern on dark corridor.",
        timestamp: new Date(Date.now() - 15 * 3600 * 1000).toISOString(),
        actor: "Citizen"
      },
      {
        step: 2,
        title: "Auto-Routed to Electrical Dept",
        description: "Assigned to Ward 3 Lineman Satish Chand with 12-hour high priority deadline.",
        timestamp: new Date(Date.now() - 15 * 3600 * 1000 + 40000).toISOString(),
        actor: "Auto-Routing Engine"
      },
      {
        step: 3,
        title: "SLA Breached - Level 1 Escalation",
        description: "Deadline breached 3 hours ago. Escalated to Executive Engineer Er. K. V. Narayanan for immediate crew mobilization.",
        timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
        actor: "SLA Monitoring Daemon"
      }
    ]
  },
  {
    id: "grv-1006",
    trackingToken: "GRV-2026-4421",
    title: "Large Neem Tree Branch Snapped, Hanging on Power Cable",
    description: "Due to heavy thunderstorms yesterday, a huge tree branch broke and is suspended precariously on the 440V distribution lines. High risk of cable snapping and short circuit.",
    category: "dangerous_branch",
    categoryName: "Hazardous Overhanging Branch Over Wire/Roof",
    departmentId: "DEPT_PARKS",
    departmentName: "Parks, Urban Forestry & Tree Management",
    wardId: "WARD_04",
    wardName: "Ward 4 - Green Valley & South Enclave",
    address: "Opposite Sector 7 Community Park, Green Valley",
    coordinates: { lat: 28.5365, lng: 77.2415 },
    citizen: {
      name: "Col. Sanjeev Bakshi",
      phone: "+91 98200 44332",
      email: "col.bakshi@armyvet.in",
      isAnonymous: false
    },
    priority: "HIGH",
    urgencyScore: 88,
    routingReason: "Keywords: 'tree branch snapped', 'power cable', 'short circuit'. Multi-department flag: Parks (primary) with safety notice to Electrical.",
    status: "RESOLVED",
    assignedOfficer: {
      id: "OFF_PARKS_04",
      name: "Meena Swaminathan",
      title: "Horticulture Officer W-04",
      phone: "+91 98101 22037",
      email: "meena.parks@nagarseva.gov.in"
    },
    escalationLevel: 0,
    slaHours: 24,
    createdAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
    slaDeadline: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    upvotes: 14,
    attachments: [
      {
        id: "att-6",
        type: "citizen_proof",
        url: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600&auto=format&fit=crop&q=80",
        caption: "Overhanging branch touching cable"
      }
    ],
    resolution: {
      resolvedBy: "Meena Swaminathan (Horticulture Officer)",
      summary: "Coordinated with electrical team for temporary 30-min power shutdown. Hydraulic crane and chainsaw team safely pruned snapped branches and cleared debris.",
      proofImage: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80",
      materialsUsed: "Hydraulic sky-lift truck, chainsaw crew, green waste compactor",
      resolvedAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString()
    },
    feedback: {
      rating: 5,
      comment: "Very prompt and professional work by the urban forestry team. The branch was cleared safely.",
      submittedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString()
    },
    timeline: [
      {
        step: 1,
        title: "Grievance Lodged",
        description: "Citizen reported hanging tree branch on electric wires.",
        timestamp: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
        actor: "Citizen"
      },
      {
        step: 2,
        title: "Auto-Routed with Multi-Agency Tag",
        description: "Assigned to Ward 4 Horticulture Officer Meena Swaminathan. Cross-alert sent to Electrical Lineman.",
        timestamp: new Date(Date.now() - 28 * 3600 * 1000 + 40000).toISOString(),
        actor: "Auto-Routing Engine"
      },
      {
        step: 3,
        title: "Hydraulic Crane Deployed",
        description: "Field team with hydraulic lift pruned snapped bough safely.",
        timestamp: new Date(Date.now() - 16 * 3600 * 1000).toISOString(),
        actor: "Meena Swaminathan"
      },
      {
        step: 4,
        title: "Grievance Resolved",
        description: "Site cleared, before & after verification photo uploaded.",
        timestamp: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
        actor: "Meena Swaminathan"
      }
    ]
  },
  {
    id: "grv-1007",
    trackingToken: "GRV-2026-5590",
    title: "Severe Dengue Mosquito Breeding in Stagnant Water Plot",
    description: "An abandoned basement excavation plot next to Sector 5 primary health clinic has accumulated 3 feet of rainwater. It has turned into a massive mosquito breeding ground. Several dengue cases reported in the colony this week.",
    category: "mosquito_breeding",
    categoryName: "Dengue/Malaria Mosquito Fogging Request",
    departmentId: "DEPT_HEALTH",
    departmentName: "Public Health & Vector Disease Control",
    wardId: "WARD_04",
    wardName: "Ward 4 - Green Valley & South Enclave",
    address: "Plot 42B, Behind Sector 5 Health Clinic, Green Valley",
    coordinates: { lat: 28.5320, lng: 77.2450 },
    citizen: {
      name: "Dr. Arvind Kasbekar",
      phone: "+91 98199 66554",
      email: "dr.kasbekar@clinic.org",
      isAnonymous: false
    },
    priority: "HIGH",
    urgencyScore: 91,
    routingReason: "Detected 'dengue', 'mosquito breeding', 'stagnant water', 'fever'. High health threat score.",
    status: "IN_PROGRESS",
    assignedOfficer: {
      id: "OFF_HEALTH_04",
      name: "Dr. K. Srinivas",
      title: "Zonal Epidemiologist W-04",
      phone: "+91 98101 22035",
      email: "srinivas.health@nagarseva.gov.in"
    },
    escalationLevel: 0,
    slaHours: 24,
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    slaDeadline: new Date(Date.now() + 16 * 3600 * 1000).toISOString(),
    upvotes: 41,
    attachments: [
      {
        id: "att-7",
        type: "citizen_proof",
        url: "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=600&auto=format&fit=crop&q=80",
        caption: "Stagnant water pool with visible larvae breeding"
      }
    ],
    timeline: [
      {
        step: 1,
        title: "Grievance Lodged",
        description: "Doctor reported mosquito larvae pool near clinic.",
        timestamp: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
        actor: "Citizen"
      },
      {
        step: 2,
        title: "Auto-Routed to Public Health",
        description: "Assigned to Dr. K. Srinivas with 24-hr vector control target.",
        timestamp: new Date(Date.now() - 8 * 3600 * 1000 + 35000).toISOString(),
        actor: "Auto-Routing Engine"
      },
      {
        step: 3,
        title: "Larvicide Spraying Initiated",
        description: "Abate chemical larvicide sprayed across pool. Municipal notice issued to vacant plot owner.",
        timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
        actor: "Dr. K. Srinivas"
      }
    ]
  },
  {
    id: "grv-1008",
    trackingToken: "GRV-2026-1188",
    title: "Illegal Hawking and Temporary Shacks Blocking Fire Exit Lane",
    description: "Vegetable vendors and unlicensed food carts have completely covered the 20-foot emergency access lane leading to the residential apartments. Ambulances cannot enter in an emergency.",
    category: "encroachment",
    categoryName: "Illegal Footpath Encroachment / Hawkers",
    departmentId: "DEPT_REV",
    departmentName: "Town Planning, Encroachments & Civic Order",
    wardId: "WARD_02",
    wardName: "Ward 2 - Riverside Heritage & Old City",
    address: "Lane 4, Cloth Market Outer Ring, Heritage Ward",
    coordinates: { lat: 28.6535, lng: 77.2280 },
    citizen: {
      name: "Sunil Bajaj",
      phone: "+91 98110 55443",
      email: "sunil.bajaj@gmail.com",
      isAnonymous: false
    },
    priority: "MEDIUM",
    urgencyScore: 68,
    routingReason: "Detected 'illegal hawking', 'encroachment', 'emergency lane'. Routed to Town Planning & Enforcement.",
    status: "SUBMITTED",
    assignedOfficer: {
      id: "OFF_REV_02",
      name: "Alok Sengupta",
      title: "Enforcement Inspector W-02",
      phone: "+91 98101 22018",
      email: "alok.rev@nagarseva.gov.in"
    },
    escalationLevel: 0,
    slaHours: 72,
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    slaDeadline: new Date(Date.now() + 67 * 3600 * 1000).toISOString(),
    upvotes: 9,
    attachments: [
      {
        id: "att-8",
        type: "citizen_proof",
        url: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&auto=format&fit=crop&q=80",
        caption: "Encroached lane with illegal stalls"
      }
    ],
    timeline: [
      {
        step: 1,
        title: "Grievance Lodged",
        description: "Citizen reported commercial obstruction of emergency lane.",
        timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
        actor: "Citizen"
      },
      {
        step: 2,
        title: "Auto-Routed to Enforcement",
        description: "Assigned to Enforcement Inspector Alok Sengupta.",
        timestamp: new Date(Date.now() - 5 * 3600 * 1000 + 42000).toISOString(),
        actor: "Auto-Routing Engine"
      }
    ]
  }
];

