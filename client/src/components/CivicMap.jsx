import React, { useState } from 'react';
import { MapPin, Navigation, Eye, CheckCircle2, AlertOctagon, Flame } from 'lucide-react';

// Transform GPS coordinates (Delhi-like bounds ~28.5 to 28.72 lat, 77.08 to 77.32 lng) to SVG viewBox 0..800, 0..550
function gpsToSvg(lat, lng) {
  const minLat = 28.50, maxLat = 28.72;
  const minLng = 77.08, maxLng = 77.32;
  
  const x = ((lng - minLng) / (maxLng - minLng)) * 760 + 20;
  // Invert Y because latitude increases northward while SVG Y increases downward
  const y = ((maxLat - lat) / (maxLat - minLat)) * 510 + 20;
  
  return { x: Math.max(30, Math.min(770, x)), y: Math.max(30, Math.min(520, y)) };
}

function svgToGps(x, y) {
  const minLat = 28.50, maxLat = 28.72;
  const minLng = 77.08, maxLng = 77.32;
  
  const lng = ((x - 20) / 760) * (maxLng - minLng) + minLng;
  const lat = maxLat - (((y - 20) / 510) * (maxLat - minLat));
  
  return { lat: Number(lat.toFixed(4)), lng: Number(lng.toFixed(4)) };
}

// Visual polygons for each ward in the SVG coordinate space
const WARD_POLYGONS = {
  WARD_01: {
    name: "Ward 1 - North Ridge & Civil Lines",
    points: "150,30 580,30 540,190 280,210 160,170",
    center: { x: 340, y: 110 },
    color: "#3b82f6",
    zone: "North Zone"
  },
  WARD_02: {
    name: "Ward 2 - Riverside Heritage & Old City",
    points: "280,210 540,190 600,320 380,350 290,290",
    center: { x: 440, y: 260 },
    color: "#8b5cf6",
    zone: "Central Zone"
  },
  WARD_03: {
    name: "Ward 3 - Cyber Tech Corridor",
    points: "540,190 770,200 750,420 530,390 600,320",
    center: { x: 650, y: 290 },
    color: "#06b6d4",
    zone: "East Zone"
  },
  WARD_04: {
    name: "Ward 4 - Green Valley & South Enclave",
    points: "290,290 380,350 530,390 520,520 220,510 250,370",
    center: { x: 380, y: 430 },
    color: "#10b981",
    zone: "South Zone"
  },
  WARD_05: {
    name: "Ward 5 - West Industrial Estate",
    points: "30,120 160,170 280,210 250,370 220,510 40,460 30,220",
    center: { x: 140, y: 310 },
    color: "#f59e0b",
    zone: "West Zone"
  }
};

export default function CivicMap({
  grievances = [],
  selectedWardId = null,
  onSelectWard = null,
  onSelectGrievance = null,
  isPickerMode = false,
  pickedLocation = null,
  onPickLocation = null
}) {
  const [hoveredWard, setHoveredWard] = useState(null);
  const [activePin, setActivePin] = useState(null);
  const [filterType, setFilterType] = useState('ALL'); // ALL, CRITICAL, BREACHED, RESOLVED

  const filteredGrievances = grievances.filter(g => {
    if (filterType === 'CRITICAL') return g.priority === 'CRITICAL';
    if (filterType === 'BREACHED') return g.slaMetrics?.isBreached;
    if (filterType === 'RESOLVED') return ['RESOLVED', 'CLOSED'].includes(g.status);
    return true;
  });

  const handleSvgClick = (e) => {
    if (!isPickerMode || !onPickLocation) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 800;
    const y = ((e.clientY - rect.top) / rect.height) * 550;
    
    const gps = svgToGps(x, y);
    
    // Determine which ward this point belongs to (rough bounding box check)
    let matchedWardId = 'WARD_01';
    if (y < 190 && x > 150) matchedWardId = 'WARD_01';
    else if (x < 280 && y > 150) matchedWardId = 'WARD_05';
    else if (x > 540 && y > 180) matchedWardId = 'WARD_03';
    else if (y > 350) matchedWardId = 'WARD_04';
    else matchedWardId = 'WARD_02';

    onPickLocation({
      ...gps,
      wardId: matchedWardId
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      {/* Map Header / Filters */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Municipal Geo-Spatial Command Map
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isPickerMode 
                ? "Click anywhere on the map to pin grievance location" 
                : "Real-time grievance density, ward jurisdictions & incident hotspots"}
            </p>
          </div>
        </div>

        {!isPickerMode && (
          <div className="flex items-center gap-1.5 bg-slate-200/70 dark:bg-slate-800 p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-2.5 py-1 rounded-md transition-colors ${filterType === 'ALL' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold' : 'text-slate-600 dark:text-slate-400'}`}
            >
              All ({grievances.length})
            </button>
            <button
              onClick={() => setFilterType('CRITICAL')}
              className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${filterType === 'CRITICAL' ? 'bg-red-500 text-white shadow-xs font-semibold' : 'text-slate-600 dark:text-slate-400'}`}
            >
              <Flame className="w-3 h-3" />
              Critical
            </button>
            <button
              onClick={() => setFilterType('BREACHED')}
              className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${filterType === 'BREACHED' ? 'bg-amber-600 text-white shadow-xs font-semibold' : 'text-slate-600 dark:text-slate-400'}`}
            >
              <AlertOctagon className="w-3 h-3" />
              Breached
            </button>
            <button
              onClick={() => setFilterType('RESOLVED')}
              className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${filterType === 'RESOLVED' ? 'bg-emerald-600 text-white shadow-xs font-semibold' : 'text-slate-600 dark:text-slate-400'}`}
            >
              <CheckCircle2 className="w-3 h-3" />
              Resolved
            </button>
          </div>
        )}
      </div>

      {/* SVG Canvas Map */}
      <div className="relative w-full aspect-[16/10] bg-slate-900 overflow-hidden select-none">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-40"></div>

        <svg
          viewBox="0 0 800 550"
          className={`w-full h-full ${isPickerMode ? 'cursor-crosshair' : 'cursor-default'}`}
          onClick={handleSvgClick}
        >
          {/* Ward Polygon Areas */}
          {Object.entries(WARD_POLYGONS).map(([wId, ward]) => {
            const isSelected = selectedWardId === wId;
            const isHovered = hoveredWard === wId;
            const wardTickets = grievances.filter(g => g.wardId === wId);

            return (
              <g
                key={wId}
                onMouseEnter={() => setHoveredWard(wId)}
                onMouseLeave={() => setHoveredWard(null)}
                onClick={(e) => {
                  if (!isPickerMode && onSelectWard) {
                    e.stopPropagation();
                    onSelectWard(isSelected ? null : wId);
                  }
                }}
                className="transition-all duration-300"
              >
                <polygon
                  points={ward.points}
                  fill={ward.color}
                  fillOpacity={isSelected ? 0.35 : isHovered ? 0.25 : 0.12}
                  stroke={ward.color}
                  strokeWidth={isSelected ? 3 : isHovered ? 2 : 1.5}
                  strokeDasharray={isSelected ? "none" : "4,2"}
                  className="transition-all duration-200 hover:cursor-pointer"
                />

                {/* Ward Center Label */}
                <text
                  x={ward.center.x}
                  y={ward.center.y - 8}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="13"
                  fontWeight="700"
                  className="pointer-events-none drop-shadow-md"
                >
                  {ward.name.split(' - ')[0]}
                </text>
                <text
                  x={ward.center.x}
                  y={ward.center.y + 10}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="10"
                  fontWeight="500"
                  className="pointer-events-none"
                >
                  {ward.name.split(' - ')[1]} ({wardTickets.length} cases)
                </text>
              </g>
            );
          })}

          {/* Grievance Pins */}
          {!isPickerMode && filteredGrievances.map((g) => {
            const coords = g.coordinates || { lat: 28.6139, lng: 77.2090 };
            const pt = gpsToSvg(coords.lat, coords.lng);
            const isCritical = g.priority === 'CRITICAL';
            const isBreached = g.slaMetrics?.isBreached;
            const isResolved = ['RESOLVED', 'CLOSED'].includes(g.status);
            const isSelectedPin = activePin?.id === g.id;

            let pinColor = '#3b82f6'; // blue default
            if (isResolved) pinColor = '#10b981'; // green
            else if (isCritical) pinColor = '#ef4444'; // red
            else if (isBreached) pinColor = '#f97316'; // orange
            else if (g.priority === 'HIGH') pinColor = '#f59e0b'; // amber

            return (
              <g
                key={g.id}
                transform={`translate(${pt.x}, ${pt.y})`}
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePin(isSelectedPin ? null : g);
                }}
                className="cursor-pointer group"
              >
                {/* Pulsing ring for critical/breached */}
                {(isCritical || isBreached) && !isResolved && (
                  <circle
                    r="14"
                    fill={pinColor}
                    fillOpacity="0.4"
                    className="animate-ping"
                  />
                )}
                
                {/* Outer halo */}
                <circle
                  r={isSelectedPin ? "10" : "7"}
                  fill={pinColor}
                  fillOpacity="0.9"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="transition-transform duration-200 group-hover:scale-125"
                />

                {/* Inner dot */}
                <circle
                  r="3"
                  fill="#ffffff"
                />
              </g>
            );
          })}

          {/* Picker Mode Pin */}
          {isPickerMode && pickedLocation && (
            (() => {
              const pt = gpsToSvg(pickedLocation.lat, pickedLocation.lng);
              return (
                <g transform={`translate(${pt.x}, ${pt.y})`}>
                  <circle r="16" fill="#10b981" fillOpacity="0.3" className="animate-ping" />
                  <circle r="10" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
                  <circle r="4" fill="#ffffff" />
                </g>
              );
            })()
          )}
        </svg>

        {/* Selected Pin Popover */}
        {activePin && (
          <div
            className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 animate-fade-in z-20"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold">
                {activePin.trackingToken}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                activePin.priority === 'CRITICAL' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400' :
                activePin.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {activePin.priority}
              </span>
            </div>
            
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1.5 line-clamp-1">
              {activePin.title}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
              {activePin.description}
            </p>

            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[11px]">
              <span className="text-slate-600 dark:text-slate-400 font-medium">
                {activePin.wardName.split(' - ')[0]}
              </span>
              {onSelectGrievance && (
                <button
                  onClick={() => onSelectGrievance(activePin)}
                  className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                >
                  <Eye className="w-3 h-3" />
                  View Dossier
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Map Legend */}
      <div className="p-3 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-600 dark:text-slate-400 gap-2">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            Critical Emergency
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
            SLA Breached
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            High Priority
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            Standard
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            Resolved
          </span>
        </div>
        <div className="text-[11px] text-slate-400">
          EPSG:4326 Civic Grid Coordinates
        </div>
      </div>
    </div>
  );
}

