# 🏛️ NagarSeva: Citizen Grievance Redressal & SLA Tracking System
### Full-Stack Municipal Complaint Management with Automated Routing, Geo-Spatial Mapping & SLA Escalation Matrix

A production-ready, full-stack citizen service portal and civic command dashboard designed for municipal corporations, district authorities, and smart cities. It streamlines public grievance lodging, automates department assignment using an NLP/rule-based routing engine, monitors legally-binding Service Level Agreements (SLAs), and enforces multi-tiered automated administrative escalations upon breach.

---

## 🚀 Key Highlights & Capabilities

### 1. 👥 Citizen Portal
- **Instant Grievance Lodging**: File grievances with real-time AI classification preview (department, urgency level, and estimated resolution SLA calculated as the citizen types).
- **Duplicate Detection & Community Upvoting**: Automatically identifies similar grievances reported nearby (within 500m or same ward) and lets citizens click **"Me Too / Upvote"** to prevent duplicate ticket spam.
- **Geo-Spatial Map Pin Picker**: Interactive SVG GIS municipal map allowing citizens to drop pins directly on their exact location to auto-detect their administrative Ward.
- **Real-Time Token Tracking**: Instant lookups via unique tracking tokens (e.g., `GRV-2026-8910`) without mandatory login.
- **Visual Journey Stepper**: Complete timeline tracking from Lodged → Auto-Routed → Assigned → In-Progress → Escalated → Resolved → Closed.
- **Citizen Feedback & Reopen Workflow**: Citizens rate redressal quality (1-5 stars + remarks). If dissatisfied, citizens can reopen the ticket with remarks, which escalates it to a supervisor.
- **Printable Official Acknowledgement Slip**: Generates an official Certificate of Grievance with tracking barcodes, department commitments, and SLA guarantees formatted for printing or PDF export.

### 2. ⚡ Intelligent Automated Routing Engine
- **Multi-Factor Semantic Token Scoring**: Evaluates complaint descriptions against 8 municipal departments and 50+ specialized civic categories.
- **Public Safety & Urgency Scoring (0-100)**: Automatically detects emergency triggers (e.g., "live wire", "open manhole", "sinkhole", "dengue outbreak", "hospital obstruction") to elevate priority to `CRITICAL`.
- **Ward & Jurisdiction Resolution**: Maps geo-coordinates or selected ward to the specific Ward Field Officer (e.g. Sanitary Inspector, Junior Engineer - Water Works, Electrical Lineman).
- **Transparent AI Diagnostics**: Every grievance stores a transparent audit trail explaining *why* it was routed to a specific department and officer.

### 3. ⏱️ Automated SLA Monitoring & Multi-Tier Escalation Daemon
- **Tiered SLAs by Priority & Category**:
  - **Critical Emergency**: 2 to 12 Hours
  - **High Priority**: 24 Hours
  - **Medium Priority**: 48 Hours
  - **Standard / Low**: 72 to 96 Hours
- **Continuous SLA Daemon**: Runs in the background (every 30 seconds) evaluating all active tickets against real-time countdowns.
- **Multi-Tier Automated Escalation Matrix**:
  - **Level 0 (Standard Assignee)**: Ward Field Officer.
  - **Level 1 (100% SLA Breached)**: Escalated to Assistant / Executive Engineer & Department Head.
  - **Level 2 (150% SLA Breached / >12h Overdue)**: Escalated to Zonal Commissioner (IAS).
  - **Level 3 (200% SLA Breached or Unresolved Critical)**: Escalated directly to Municipal Commissioner & District Magistrate.
- **Live Visual Countdown Badges**: Color-coded badges indicating `On Track` (Green), `Warning < 25% remaining` (Amber), `Breached` (Red pulse with exact overdue duration), or `Escalated Tier` (L1/L2/L3).
- **Time-Travel Simulator**: Built-in testing console to fast-forward system virtual time by +6h, +12h, +24h, or +48h to test SLA breach transitions and escalation triggers live!

### 4. 👷 Field Officer & Supervisor Workspace
- Filterable departmental work queue (Sanitation, Roads, Water, Electricity, Health, Drainage, Parks, Town Planning).
- Quick actions: **"Acknowledge & Start Work"**, **"Add Inspection Log"**, **"Submit Redressal Proof"** (with Before & After photo verification), and **"Request Departmental Reassignment"**.

### 5. 📊 Executive Command Center (Municipal Commissioner / District Magistrate)
- **Executive KPI Cards**: Total Grievances, SLA Adherence %, Active SLA Breaches, Average Turnaround Time (hours), and Citizen Satisfaction Score (CSAT).
- **Interactive GIS Incident Map**: Ward-level heat distribution, hotspot density, and priority-coded incident pins.
- **Department Performance Leaderboard**: Ranked table measuring SLA compliance %, resolution speed, and breach rates.
- **Immutable Audit Trail**: Chronological event log tracking all system routing, escalations, status changes, and actor remarks.
- **One-Click CSV Export**: Comprehensive export of all grievances and SLA performance for administrative reporting.

---

## 🛠️ Technology Stack

- **Backend**: Node.js v24+, Express.js (ES Modules), Multer, UUID.
- **Database & Persistence**: Persistent file-backed JSON database engine with synchronous atomic writes, relational indexes, and automated seed dataset.
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti.
- **GIS & Mapping**: Custom vector SVG GIS Ward coordinate projection engine (no external API keys or tile server dependencies required).
- **Architecture**: Monorepo with unified serving (Express serves both REST API `/api` and compiled React SPA `/`).

---

## 📁 Project Structure

```
citizen/
├── package.json              # Root scripts (start, dev, build, test)
├── README.md                 # Project documentation
├── server/                   # Backend Express & SLA Engine
│   ├── package.json
│   ├── test-smoke.js         # Automated end-to-end test suite
│   ├── data/
│   │   └── db.json           # Persistent grievance database
│   └── src/
│       ├── config/
│       │   ├── departments.js # 8 Municipal departments & keyword corpora
│       │   ├── wards.js       # 5 Municipal wards, boundaries & officer roster
│       │   └── slaRules.js    # SLA thresholds & multi-tier escalation matrix
│       ├── db/
│       │   ├── index.js       # Atomic DB engine & query helpers
│       │   └── seedData.js    # Realistic civic grievance demo records
│       ├── services/
│       │   ├── routingEngine.js     # Semantic classifier & officer assigner
│       │   ├── slaMonitor.js        # Real-time SLA evaluator & escalation daemon
│       │   ├── notificationService.js # SMS & email dispatcher simulator
│       │   ├── duplicateDetector.js  # Jaccard similarity & geo-distance checker
│       │   └── analyticsService.js  # KPI & department leaderboard metrics
│       ├── routes/
│       │   ├── grievances.js   # Grievance CRUD, status, upvotes, feedback
│       │   ├── departments.js  # Ward & Department catalogs
│       │   ├── analytics.js    # KPIs, audit trail & CSV export
│       │   ├── notifications.js# Alert dispatch logs
│       │   └── admin.js        # Time-travel simulator & SLA audit triggers
│       └── server.js           # Server entry point & SLA background worker
└── client/                   # Frontend React & Tailwind SPA
    ├── package.json
    ├── vite.config.js        # Vite config with API proxy
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── index.css
        ├── main.jsx
        ├── App.jsx           # Root layout & role state provider
        ├── services/
        │   └── api.js        # Client API SDK
        ├── components/
        │   ├── Navbar.jsx            # Header, role switcher & search
        │   ├── SlaBadge.jsx          # Live SLA & Escalation badges
        │   ├── CivicMap.jsx          # Interactive vector GIS city map
        │   ├── Timeline.jsx          # Step-by-step resolution journey
        │   ├── ReceiptModal.jsx      # Official Printable Certificate
        │   ├── NotificationDrawer.jsx# Simulated SMS/Email alerts
        │   └── TimeTravelModal.jsx   # Virtual clock time-travel tool
        └── pages/
            ├── CitizenPortal.jsx     # Lodge, track, and upvote complaints
            ├── OfficerPortal.jsx     # Field queue, action logs, resolution proof
            └── AdminDashboard.jsx    # Commissioner KPIs, leaderboard & audit trail
```

---

## 🌐 One-Click Cloud Deployment Guide

This project is configured for instantaneous deployment across major cloud container and hosting platforms.

### Option A: Deploy on Render.com (Recommended - Free Tier)
1. Sign in to **[Render.com](https://render.com)** and connect your GitHub account.
2. Click **New +** → **Web Service** → Select repository: **`Mahalakshmi-Kommaranahalli/citizen`**.
3. Render will auto-detect settings from `render.yaml`:
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/api/health`
4. Click **Deploy Web Service**. Render will provision your public HTTPS URL (e.g. `https://nagarseva-grievance-portal.onrender.com`).

---

### Option B: Deploy on Railway.app
1. Go to **[Railway.app](https://railway.app)** and click **New Project** → **Deploy from GitHub repo**.
2. Select **`Mahalakshmi-Kommaranahalli/citizen`**.
3. Railway detects the `Dockerfile` and `railway.json` automatically, builds the container, and deploys it live.

---

### Option C: Run with Docker (Local or VPS)
Build and run the full containerized app with a single command:
```bash
docker compose up --build -d
```
Visit: 👉 **`http://localhost:5000`**

---

## 🚦 Getting Started

### 1. Prerequisites
- **Node.js** v18+ (tested on Node.js v24.16.0)
- **npm** v9+

### 2. Run the Application
From the workspace root (`c:\Users\MAHALAKSHMI K\Desktop\citizen`):

```bash
# Start the unified server (serves both API & Frontend on port 5000)
npm start
```

Open your browser and navigate to:
👉 **`http://localhost:5000`**

### 3. Development Mode (with Live Hot-Module Reloading)
To run the server and frontend in separate processes with Vite HMR:

```bash
# Terminal 1: Backend API (port 5000)
npm run dev:server

# Terminal 2: Vite React Frontend (port 3000)
npm run dev:client
```
Then visit: 👉 **`http://localhost:3000`**

### 4. Run Automated Smoke Tests
To run the end-to-end integration and automated routing test suite:

```bash
npm test
```

---

## 🧪 Testing Guide & Walkthrough

1. **Role Switching**:
   - Use the top navigation bar to switch between **Citizen**, **Officer**, and **Admin** portals instantly.
2. **Lodge a New Grievance**:
   - In the Citizen Portal, type a complaint like *"Sparking dangling electrical wire next to school"* and watch the AI prediction preview detect `DEPT_ELEC`, set priority to `CRITICAL`, and calculate a 2-hour SLA.
   - Click the interactive city map to drop a pin and auto-select the Ward.
   - Submit the grievance to generate a tracking token (e.g. `GRV-2026-XXXX`).
3. **Track a Grievance**:
   - Search for `GRV-2026-8910` or `GRV-2026-9204` in the top search bar.
   - View the live SLA countdown meter, the AI routing justification, and click **"Print Receipt"** to view the official municipal acknowledgement certificate.
4. **Time-Travel Simulator**:
   - Click the **"Virtual Clock"** button in the top navbar.
   - Fast-forward time by `+12 Hours` or `+24 Hours`.
   - Observe how tickets nearing deadlines trigger **SLA Warnings**, while breached tickets trigger **Level 1** and **Level 2 Escalations** with alert dispatches to the Zonal Commissioner!
5. **Field Officer Action**:
   - Switch to the **Officer** role, filter by department or ward, click **"Acknowledge & Start"**, and submit resolution proof with Before & After photos.
6. **Executive Dashboard**:
   - Switch to **Admin** to inspect city-wide KPIs, department leaderboard rankings, and download the full CSV export.

---

## 📜 Municipal SLA Policy Matrix

| Priority Level | Example Grievances | Resolution SLA | Auto-Escalation Threshold |
| :--- | :--- | :--- | :--- |
| **Critical** | Open manholes, live wires, pipe burst, food epidemic | **4 - 12 Hours** | Level 1 at 4-8h, Level 2 at 12h (Zonal Commissioner) |
| **High** | Garbage heaps, large potholes, dark street stretches | **24 - 48 Hours** | Level 1 at 24h, Level 2 at 36h |
| **Medium** | Low water pressure, broken footpath, mosquito fogging | **48 - 72 Hours** | Level 1 at 72h |
| **Standard / Low** | Tree pruning, unpainted speed breakers, park amenities | **96 - 168 Hours** | Level 1 at 7 Days |

---

## 🏛️ License & Public Notice
Designed for Municipal Corporations and Smart City Administrations. Free and open-source for civic e-governance implementation.

