import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/apiService';
import { LiveMap } from '../Common/LiveMap';
import { RouteFinderTransportBooking } from './RouteFinderTransportBooking';
import {
  Compass,
  MapPin,
  Clock,
  Shuffle,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  CheckCircle,
  AlertCircle,
  QrCode,
  Flame,
  X,
  Share2,
  Sparkles,
  Award,
  Footprints,
  Droplets,
  Ship,
  Coffee,
  Check,
  ArrowRight,
  Navigation,
  ExternalLink,
  ChevronRight,
  Car,
  Bus,
  Coins,
  ShieldCheck,
  Eye,
  Search,
  Loader2,
  Ticket
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DynamicRoadmap = () => {
  const {
    currentDestination,
    currentRoadmap,
    updateMilestoneStatus,
    reorderMilestones,
    userLocation,
    setEcoPoints,
    requireAuth
  } = useApp();

  const [roadmapViewMode, setRoadmapViewMode] = useState('itinerary'); // 'itinerary' | 'route_finder'
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationMessage, setOptimizationMessage] = useState(null);
  const [showPassModal, setShowPassModal] = useState(false);
  const [selectedLegIndex, setSelectedLegIndex] = useState(0);
  const [selectedAmenityFilter, setSelectedAmenityFilter] = useState('all');

  const activeStops = currentRoadmap && currentRoadmap.length > 0 ? currentRoadmap : currentDestination.roadmap || [];
  const activeStop = activeStops[selectedLegIndex] || activeStops[0] || {};
  const prevStop = selectedLegIndex > 0 ? activeStops[selectedLegIndex - 1] : null;

  // 1-Click AI Route Reorder
  const handleDynamicRecalculate = async () => {
    requireAuth(async () => {
      setIsOptimizing(true);
      setOptimizationMessage(null);

      const res = await apiService.optimizeRoadmap(currentDestination.id, activeStops);

      setTimeout(() => {
        setIsOptimizing(false);
        if (res && res.optimizedSequence) {
          reorderMilestones(res.optimizedSequence);
        }
        setEcoPoints(p => p + 35);
        setOptimizationMessage(res?.message || '✨ Trip Plan Reorganized! We adjusted stop times to bypass long temple lines (+₹35 Eco-Points).');

        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      }, 1000);
    }, { message: 'Please sign in to dynamically recalculate and optimize your transit route.' });
  };

  const handleOpenGoogleMaps = (lat, lng, title) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(title)}`;
    window.open(url, '_blank');
  };

  const handleBookingLink = (opt) => {
    setEcoPoints(p => p + 15);
    const destEncoded = encodeURIComponent(activeStop.title + ', ' + currentDestination.name);
    if (opt.mode === 'cab') {
      window.open(`https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[formatted_address]=${destEncoded}`, '_blank');
    } else if (opt.mode === 'auto' || opt.mode === 'erickshaw') {
      window.open('https://rapido.bike/', '_blank');
    } else if (opt.mode === 'boat') {
      window.open('https://uptourism.gov.in/', '_blank');
    } else if (opt.mode === 'bus') {
      window.open('https://www.redbus.in/', '_blank');
    } else {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${activeStop.lat},${activeStop.lng}`, '_blank');
    }
  };

  const completedCount = activeStops.filter(m => m.status === 'completed').length;
  const progressPercent = activeStops.length > 0 ? Math.round((completedCount / activeStops.length) * 100) : 0;
  
  const totalDistanceKm = activeStops.reduce((acc, m) => acc + (m.distanceKm || 1.5), 0).toFixed(1);
  const totalCalories = Math.round(totalDistanceKm * 68);

  return (
    <div className="space-y-6 animate-fadeIn w-full">
      
      {/* Top View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2.5 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl w-full sm:w-auto">
          <button
            onClick={() => setRoadmapViewMode('itinerary')}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 ${
              roadmapViewMode === 'itinerary'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>🗺️ Sightseeing Route & HD Map</span>
          </button>

          <button
            onClick={() => setRoadmapViewMode('route_finder')}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 ${
              roadmapViewMode === 'route_finder'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>🚖 Custom Intercity Booking & Fares</span>
          </button>
        </div>

        {/* Action Controls: 1-Click Reorder & QR Pass */}
        <div className="flex items-center gap-2 px-1">
          <button
            type="button"
            onClick={handleDynamicRecalculate}
            disabled={isOptimizing}
            className="px-3.5 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <Shuffle className={`w-3.5 h-3.5 ${isOptimizing ? 'animate-spin' : ''}`} />
            <span>{isOptimizing ? 'Optimizing...' : '✨ Skip Temple Queues'}</span>
          </button>

          <button
            type="button"
            onClick={() => requireAuth(() => setShowPassModal(true), { message: 'Please sign in to generate and export your RFID & QR Travel Pass.' })}
            className="px-3.5 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Show QR Pass</span>
          </button>
        </div>
      </div>

      {roadmapViewMode === 'route_finder' ? (
        <RouteFinderTransportBooking />
      ) : (
        <>
          {/* Optimization Notice Banner */}
          {optimizationMessage && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold flex items-center justify-between shadow-sm animate-fadeIn">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>{optimizationMessage}</span>
              </div>
              <button onClick={() => setOptimizationMessage(null)} className="text-amber-800 font-bold text-sm px-2">
                ✕
              </button>
            </div>
          )}

          {/* SIGHTSEEING TIMELINE: Discovered Attractions & Sequence */}
          <div className="bg-gradient-to-r from-amber-50/90 via-white to-orange-50/70 border border-amber-200/90 p-4 sm:p-5 rounded-3xl shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-amber-600" />
                <span>Top Visiting Sights in {currentDestination.name.split(',')[0]}:</span>
              </span>
              <span className="text-xs font-mono font-bold text-slate-500">
                {activeStops.length} Nearby Sights • {totalDistanceKm} km
              </span>
            </div>

            {/* Horizontal Stops Connector */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none text-xs">
              {activeStops.map((stop, idx) => {
                const isSelected = selectedLegIndex === idx;
                const isDone = stop.status === 'completed';

                return (
                  <React.Fragment key={stop.id || idx}>
                    <button
                      onClick={() => setSelectedLegIndex(idx)}
                      className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl whitespace-nowrap transition-all flex-shrink-0 ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 font-black shadow-md ring-2 ring-amber-400'
                          : isDone
                          ? 'bg-slate-100 text-slate-500 border border-slate-200'
                          : 'bg-white text-slate-800 hover:bg-amber-50 border border-slate-200'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isSelected ? 'bg-slate-950 text-white' : isDone ? 'bg-emerald-600 text-white' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {idx + 1}
                      </span>
                      <div className="text-left">
                        <div className="font-bold text-xs truncate max-w-[150px]">{stop.title}</div>
                        <div className={`text-[10px] ${isSelected ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>{stop.time || 'Sight'}</div>
                      </div>
                    </button>

                    {idx < activeStops.length - 1 && (
                      <div className="flex items-center gap-1 text-slate-400 flex-shrink-0 px-0.5">
                        <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100/70 px-1.5 py-0.5 rounded">
                          {activeStops[idx + 1]?.transportIcon || '🛺'} {activeStops[idx + 1]?.distanceKm || '2.0'}km
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Main Grid: Clean HD LiveMap (Left) & Active Sight Transportation & Info (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 7 Cols: HD Map (ESRI Clean Streets / OSM with 0 Watermarks) */}
            <div className="lg:col-span-7 space-y-3">
              
              {/* Quick Amenity / Route Filters */}
              <div className="bg-white border border-slate-200 p-3 rounded-2xl flex items-center gap-2 overflow-x-auto scrollbar-none text-xs shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Map View:</span>
                {[
                  { id: 'all', label: '🌟 All Sights & Scenic Routes' },
                  { id: 'water', label: '🚰 Free RO Water Points' },
                  { id: 'boats', label: '🛥️ Boat & Ferry Jetties' },
                  { id: 'chai', label: '☕ Local Food & Chai Stalls' }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedAmenityFilter(f.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                      selectedAmenityFilter === f.id
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span>{f.label}</span>
                  </button>
                ))}
              </div>

              <div className="bg-white p-2 rounded-3xl border border-slate-200 shadow-sm">
                <LiveMap
                  key={currentDestination.name}
                  center={activeStop.lat && activeStop.lng ? [activeStop.lat, activeStop.lng] : currentDestination.center}
                  zoom={currentDestination.zoom || 14}
                  zones={currentDestination.zones || []}
                  roadmapPoints={activeStops}
                  userLocation={userLocation}
                  height="490px"
                />
              </div>

              {/* Trip Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white border border-slate-200 p-3.5 rounded-2xl text-center shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Trip Distance</span>
                  <div className="text-base font-black text-slate-900 font-mono mt-0.5">{totalDistanceKm} km</div>
                </div>
                <div className="bg-white border border-slate-200 p-3.5 rounded-2xl text-center shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Energy Burned</span>
                  <div className="text-base font-black text-amber-700 font-mono mt-0.5">{totalCalories} kcal</div>
                </div>
                <div className="bg-white border border-slate-200 p-3.5 rounded-2xl text-center shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Sights Visited</span>
                  <div className="text-base font-black text-emerald-700 font-mono mt-0.5">{completedCount} of {activeStops.length}</div>
                </div>
              </div>

            </div>

            {/* Right 5 Cols: FOCUSED SIGHT DETAILS & HOW TO GO */}
            <div className="lg:col-span-5 space-y-4">
              
              <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-3xl space-y-4 shadow-sm">
                
                {/* Sight Header */}
                <div className="space-y-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      SIGHT {selectedLegIndex + 1} OF {activeStops.length}
                    </span>
                    <span className="text-xs font-bold font-mono text-slate-500">
                      {activeStop.time}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-amber-700">
                        {activeStop.category || 'Featured Attraction'}
                      </span>
                      {activeStop.crowdLevel && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-900">
                          {activeStop.crowdLevel}
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-black text-slate-900">{activeStop.title}</h4>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {activeStop.tips}
                    </p>
                  </div>
                </div>

                {/* Transportation to This Sight */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                      <span>How to Go (Transport to this Sight):</span>
                    </h4>
                    <span className="text-[11px] font-mono font-bold text-amber-800">
                      {activeStop.travelTime || '15 mins'} • {activeStop.distanceKm || '2.0'} km
                    </span>
                  </div>

                  {/* Transit Options List */}
                  <div className="space-y-2">
                    {(activeStop.transitOptions || [
                      { mode: 'auto', title: 'Local Auto-Rickshaw / E-Rickshaw', fare: '₹30 - ₹45', time: '10 mins', icon: '🛺', badge: 'Recommended', steps: 'Board at nearest crossing stand' },
                      { mode: 'cab', title: 'Uber / Ola City Cab', fare: '₹100 - ₹140', time: '8 mins', icon: '🚕', badge: 'AC Comfort', steps: 'Doorstep pickup straight to monument gate' }
                    ]).map((opt, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-2xl border transition-all ${
                          i === 0
                            ? 'bg-amber-50/70 border-amber-300 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{opt.icon}</span>
                            <div>
                              <span className="font-extrabold text-xs text-slate-900 block">{opt.title}</span>
                              <span className="text-[11px] text-slate-500 font-medium">{opt.time} • {opt.fare}</span>
                            </div>
                          </div>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            i === 0 ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {opt.badge || 'Transit'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 font-medium mt-1.5 pl-7 leading-relaxed">
                          ➔ {opt.steps}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 1-Click Booking & Live GPS */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => handleOpenGoogleMaps(activeStop.lat, activeStop.lng, activeStop.title)}
                    className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-md"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                    <span>Start GPS Navigation</span>
                  </button>

                  <button
                    onClick={() => handleBookingLink(activeStop.transitOptions?.[0] || { mode: 'auto' })}
                    className="py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>Book Ride</span>
                  </button>
                </div>

              </div>

            </div>

          </div>

          {/* QR Smart Pass Modal */}
          {showPassModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
              <div className="bg-white border border-slate-200 max-w-sm w-full rounded-3xl p-6 shadow-2xl space-y-4 text-center">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="font-heritage text-sm font-black text-slate-900">Incredible India Smart Pass</span>
                  <button onClick={() => setShowPassModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
                </div>

                <div className="p-4 bg-white border-2 border-amber-400 rounded-2xl inline-block shadow-inner">
                  <div className="w-36 h-36 mx-auto bg-slate-900 p-2 rounded-xl flex items-center justify-center text-white font-mono text-center text-xs">
                    [ QR SMART PASS ]
                    <br />
                    ₹240 PTS
                    <br />
                    VIP ALL ACCESS
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <h4 className="font-black text-slate-900">{currentDestination.name}</h4>
                  <p className="text-slate-500 font-medium">Valid for Temple FastPass, Solar Boats, E-Buses & RO Water Stations</p>
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-bold mt-2">
                    ✓ Free Prasad & Kulhad Chai Included
                  </div>
                </div>

                <button
                  onClick={() => setShowPassModal(false)}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl transition shadow-sm"
                >
                  Done / Close
                </button>
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
};
