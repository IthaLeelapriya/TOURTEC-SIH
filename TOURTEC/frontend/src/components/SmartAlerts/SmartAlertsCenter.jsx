import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/apiService';
import { LiveMap } from '../Common/LiveMap';
import {
  AlertTriangle,
  ShieldAlert,
  CloudLightning,
  MapPin,
  Radio,
  BellRing,
  Filter,
  Plus,
  Send,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  Compass,
  X,
  Volume2,
  VolumeX,
  Footprints,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SmartAlertsCenter = () => {
  const { currentDestination, alerts, setAlerts, setIsSosOpen, applyDivertedRoute, userLocation, setUserLocation } = useApp();
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newSeverity, setNewSeverity] = useState('warning');
  const [newType, setNewType] = useState('geofence');
  const [acknowledgedIds, setAcknowledgedIds] = useState({});
  const [soundEnabled, setSoundEnabled] = useState(true);

  const filteredAlerts = alerts.filter(a => {
    const matchSev = filterSeverity === 'all' || a.severity === filterSeverity;
    const matchCat = filterCategory === 'all' || (a.type || '').toLowerCase().includes(filterCategory.toLowerCase());
    return matchSev && matchCat && !acknowledgedIds[a.id];
  });

  const handleBroadcastAlert = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMessage.trim()) return;

    const created = await apiService.createAlert({
      destinationId: currentDestination.id,
      title: newTitle,
      message: newMessage,
      severity: newSeverity,
      type: newType,
      coordinates: { lat: currentDestination.center[0], lng: currentDestination.center[1] }
    });

    if (created) {
      setAlerts(prev => [created, ...prev]);
    } else {
      setAlerts(prev => [
        {
          id: `alt-ind-${Date.now()}`,
          destinationId: currentDestination.id,
          title: newTitle,
          message: newMessage,
          severity: newSeverity,
          type: newType,
          timestamp: 'Just now',
          active: true,
          coordinates: { lat: currentDestination.center[0], lng: currentDestination.center[1] }
        },
        ...prev
      ]);
    }

    setNewTitle('');
    setNewMessage('');
    setIsBroadcasting(false);
    confetti({ particleCount: 40, spread: 60 });
  };

  const handleAcknowledge = (alertId) => {
    setAcknowledgedIds(prev => ({ ...prev, [alertId]: true }));
  };

  const handleDivertAwayFromHazard = (alert) => {
    handleAcknowledge(alert.id);
    const safeZone = currentDestination.zones.find(z => z.status === 'recommended') || currentDestination.zones[3];
    applyDivertedRoute(alert.title, safeZone.name, 35);
    confetti({ particleCount: 50, spread: 60 });
  };

  const getAlertIcon = (type) => {
    if (type === 'geofence') return <MapPin className="w-5 h-5 text-red-600" />;
    if (type === 'weather') return <CloudLightning className="w-5 h-5 text-amber-600" />;
    if (type === 'wildlife') return <AlertTriangle className="w-5 h-5 text-orange-600" />;
    if (type === 'crowd_surge') return <ShieldAlert className="w-5 h-5 text-rose-600" />;
    return <ShieldAlert className="w-5 h-5 text-blue-600" />;
  };

  return (
    <div className="space-y-6 animate-fadeIn w-full">
      
      {/* Header (Light Theme) */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-rose-100 text-rose-700 border border-rose-300 animate-pulse">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 font-heritage">Real-Time Smart Alerts & Sacred Geofencing</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-300 text-[10px] font-mono font-bold">
                {filteredAlerts.length} सुरक्षा अलर्ट सक्रिय
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Live automated sacred boundary geofences, micro-weather advisories, and crowd surge alerts across {currentDestination.name}.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-300 transition"
            title={soundEnabled ? 'Mute Alert Audio' : 'Enable Alert Audio'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          <button
            onClick={() => setIsBroadcasting(true)}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-amber-600" /> Broadcast Advisory
          </button>
          
          <button
            onClick={() => setIsSosOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-2 active:scale-95 border border-rose-400"
          >
            <Radio className="w-4 h-4 animate-ping text-white" /> POLICE MITRA SOS
          </button>
        </div>
      </div>

      {/* Quick Explainer Bar: How Smart Alerts Work */}
      <div className="bg-rose-50/80 border border-rose-200 p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-700">
        <div className="flex items-center gap-2 font-bold text-rose-950">
          <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>How Smart Alerts Work:</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600 font-medium">
          <span>1️⃣ <strong>Geofence Radars</strong> monitor hazardous crowd surges & severe weather</span>
          <span>•</span>
          <span>2️⃣ <strong>Tap "Divert Roadmap Away"</strong> to bypass the risk (+₹35 Eco-Points)</span>
          <span>•</span>
          <span>3️⃣ <strong>Authorities broadcast live advisories</strong> straight to tourist smartphones</span>
        </div>
      </div>

      {/* Broadcast Modal / Form */}
      {isBroadcasting && (
        <div className="bg-white border-2 border-amber-400 p-5 rounded-2xl shadow-lg animate-fadeIn space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Radio className="w-4 h-4 text-amber-600" /> Broadcast Geofenced Heritage Advisory
            </h3>
            <button onClick={() => setIsBroadcasting(false)} className="text-slate-400 hover:text-slate-700 text-xs font-bold">
              ✕ Cancel
            </button>
          </div>

          <form onSubmit={handleBroadcastAlert} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Alert Title</label>
                <input
                  type="text"
                  placeholder="e.g. Ganga Aarti Surge / Summer Heat Advisory"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Severity Level</label>
                <select
                  value={newSeverity}
                  onChange={(e) => setNewSeverity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 cursor-pointer font-medium"
                >
                  <option value="danger">🔴 Danger / Critical Restrict</option>
                  <option value="warning">🟠 Warning / Surge Alert</option>
                  <option value="info">🔵 Information / Advisory</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Alert Category</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 cursor-pointer font-medium"
                >
                  <option value="geofence">🗺️ Temple / Ghat Geofence</option>
                  <option value="crowd_surge">👥 Darshan Crowd Surge</option>
                  <option value="weather">⛈️ Severe Weather / Heatwave</option>
                  <option value="wildlife">🐒 Wildlife / High Altitude Alert</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Advisory Message</label>
              <textarea
                rows="2"
                placeholder="Details of warning and instructions for pilgrims/visitors..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 font-medium"
                required
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsBroadcasting(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl shadow-md flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" /> Broadcast to All Tourists
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Tabs Bar (Light Theme) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 p-3.5 rounded-2xl text-xs shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[10px] uppercase font-bold text-slate-500 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-amber-600" /> Severity:
          </span>
          {['all', 'danger', 'warning', 'info'].map(sev => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1 rounded-lg uppercase text-[10px] font-bold transition ${
                filterSeverity === sev
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase font-bold text-slate-500 mr-2">Category:</span>
          {['all', 'geofence', 'crowd', 'weather', 'wildlife'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded-lg uppercase text-[10px] font-bold transition ${
                filterCategory === cat
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-slate-50 text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Alerts Feed & Geofence Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Alerts Feed Cards */}
        <div className="lg:col-span-7 space-y-3">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map(alert => {
              const isDanger = alert.severity === 'danger';
              const isWarning = alert.severity === 'warning';

              return (
                <div
                  key={alert.id}
                  className={`p-5 rounded-2xl border transition-all duration-300 shadow-sm space-y-3 relative overflow-hidden ${
                    isDanger
                      ? 'bg-red-50/60 border-red-300'
                      : isWarning
                      ? 'bg-amber-50/60 border-amber-300'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-xl flex-shrink-0 ${
                        isDanger ? 'bg-red-100 text-red-700' : isWarning ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {getAlertIcon(alert.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-slate-900">{alert.title}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase font-mono ${
                            isDanger ? 'bg-red-100 text-red-800 border border-red-300' :
                            isWarning ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                            'bg-blue-100 text-blue-800 border border-blue-300'
                          }`}>
                            {alert.severity}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 block mt-0.5 font-medium">
                          {alert.timestamp || 'Real-time sensor trigger'} • Radius: 450m perimeter
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAcknowledge(alert.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 text-xs"
                      title="Dismiss Alert"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200 font-medium">
                    {alert.message}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      onClick={() => handleDivertAwayFromHazard(alert)}
                      className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
                    >
                      <Footprints className="w-3.5 h-3.5" /> 🗺️ Divert Roadmap Away (+₹35 Pts)
                    </button>

                    <button
                      onClick={() => {
                        if (alert.coordinates) {
                          setUserLocation({ lat: alert.coordinates.lat, lng: alert.coordinates.lng, landmark: alert.title });
                        }
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl border border-slate-300 transition flex items-center gap-1.5"
                    >
                      <MapPin className="w-3.5 h-3.5 text-amber-600" /> Focus on Map
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl space-y-3 shadow-sm">
              <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-slate-900 text-sm">All Sacred Corridors Operating Safely</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                No active critical geofence violations or hazardous crowd spikes matching your filters.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Geofenced Hazard Radar Map */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Radio className="w-4 h-4 text-rose-600" />
                <span>Geofence Perimeters & Safe Pilgrimage Lanes</span>
              </h3>
              <span className="text-[10px] text-amber-800 font-mono font-bold">BHARAT GPS ARMED</span>
            </div>

            <LiveMap
              center={currentDestination.center}
              zoom={currentDestination.zoom}
              zones={currentDestination.zones}
              userLocation={userLocation}
              height="450px"
            />

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1 font-medium">
              <div className="font-bold text-amber-900 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-600" /> Tourist Police Mitra Safe Corridors
              </div>
              <p className="text-[11px] text-slate-600 leading-normal">
                Red dashed perimeters denote heavy ghat surge zones. Follow green directional signage toward open riverfront promenades and solar ferry terminals.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
