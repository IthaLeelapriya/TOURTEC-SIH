import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  Sliders,
  Radio,
  Users,
  Activity,
  AlertOctagon,
  RefreshCw,
  Server,
  Zap,
  CheckCircle2,
  Lock,
  Unlock,
  Building2
} from 'lucide-react';

export const TourismBoardDashboard = () => {
  const { currentDestination, telemetry, refreshTelemetry, setIsSosOpen } = useApp();
  const [capacities, setCapacities] = useState(() => {
    const map = {};
    currentDestination.zones.forEach(z => {
      map[z.id] = z.capacity;
    });
    return map;
  });

  const [lockedZones, setLockedZones] = useState({});
  const [successNotice, setSuccessNotice] = useState(null);

  const handleCapacityChange = (zoneId, newCap) => {
    setCapacities(prev => ({ ...prev, [zoneId]: parseInt(newCap) || 1000 }));
  };

  const handleToggleZoneLock = (zoneId) => {
    setLockedZones(prev => ({ ...prev, [zoneId]: !prev[zoneId] }));
    setSuccessNotice(`Zone status updated: ${lockedZones[zoneId] ? 'Geofence Unlocked' : 'Emergency Gate Restriction Armed'}`);
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn w-full">
      
      {/* Header (Light Theme) */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-amber-100 text-amber-700 border border-amber-300">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 font-heritage">Ministry of Tourism & Police Mitra Command Center</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-mono font-bold">
                अतुल्य भारत COMMAND
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Administrative authority dashboard for {currentDestination.name}: adjust Darshan quotas, enforce riverfront safety locks, and monitor live IoT telemetry.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refreshTelemetry()}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 flex items-center gap-2 transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-600" /> Refresh Sensors
          </button>
          
          <button
            onClick={() => setIsSosOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2 transition border border-rose-400"
          >
            <Radio className="w-4 h-4" /> Emergency Console (1363)
          </button>
        </div>
      </div>

      {successNotice && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-bold flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" /> {successNotice}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Zone Capacity & Gate Overrides */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-4 shadow-sm">
            <h3 className="font-bold text-sm text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-600" />
                Dynamic Darshan Quotas & Geofence Gate Restrictions
              </span>
              <span className="text-xs text-amber-800 font-mono font-bold">5 Heritage Zones Active</span>
            </h3>

            <div className="space-y-3">
              {currentDestination.zones.map(zone => {
                const isLocked = lockedZones[zone.id];
                const customCap = capacities[zone.id] || zone.capacity;
                const ratio = Math.min(100, Math.round((zone.currentVisitors / customCap) * 100));

                return (
                  <div key={zone.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 text-sm">{zone.name}</span>
                        <div className="text-[11px] text-slate-500 font-medium">Current: {zone.currentVisitors} visitors ({ratio}% of max)</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleZoneLock(zone.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm ${
                            isLocked
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300'
                          }`}
                        >
                          {isLocked ? (
                            <>
                              <Lock className="w-3.5 h-3.5 text-red-600" /> Gate Locked
                            </>
                          ) : (
                            <>
                              <Unlock className="w-3.5 h-3.5 text-emerald-600" /> Gate Open
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Capacity Slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                        <span>Adjust Maximum Capacity Cap:</span>
                        <span className="font-mono font-bold text-amber-700">{customCap} visitors</span>
                      </div>
                      <input
                        type="range"
                        min="500"
                        max="10000"
                        step="100"
                        value={customCap}
                        onChange={(e) => handleCapacityChange(zone.id, e.target.value)}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Telemetry Health & Server Gateway */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-4 shadow-sm">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-600" />
              Bharat Smart Tourism Telemetry Gateway
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="text-slate-500 font-medium">IoT Sensor Health:</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> 100% Operational
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Mesh Network Latency:</span>
                <span className="text-amber-800 font-mono font-bold">{telemetry?.digitalTwin?.networkLatency || '12ms'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Active Sensor Pings / min:</span>
                <span className="text-slate-800 font-mono font-bold">{telemetry?.digitalTwin?.liveSensorPings || '214 pings'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Tourist Police Mitra Responders:</span>
                <span className="text-emerald-700 font-bold">18 Officers on Beat</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 shadow-sm">
            <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
              Emergency Broadcast Protocol
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              In the event of weather disasters or critical safety breaches, broadcasting from the Real-Time Smart Alerts tab pushes an override notification directly to all active mobile tourist apps.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
