import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import {
  resolveLocationCoords,
  calculateDistanceKm,
  computeAccurateTransitOptions,
  INDIAN_LOCATIONS
} from '../../services/routeCalculatorService';
import {
  Navigation,
  MapPin,
  ArrowLeftRight,
  Search,
  ExternalLink,
  Clock,
  Sparkles,
  Ticket,
  Car,
  Ship,
  Bus,
  Footprints,
  Coins,
  Compass,
  AlertCircle,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const RouteFinderTransportBooking = () => {
  const { currentDestination, setEcoPoints } = useApp();
  const zones = currentDestination.zones || [];

  // Source & Destination Input State
  const [sourceInput, setSourceInput] = useState('Hyderabad');
  const [destInput, setDestInput] = useState('Vijayawada');
  const [selectedTransitCategory, setSelectedTransitCategory] = useState('all');

  // Calculated Real Route State
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculatedDistance, setCalculatedDistance] = useState(275);
  const [sourceResolved, setSourceResolved] = useState({ name: 'Hyderabad, Telangana', lat: 17.3850, lng: 78.4867 });
  const [destResolved, setDestResolved] = useState({ name: 'Vijayawada, Andhra Pradesh', lat: 16.5062, lng: 80.6480 });
  const [transitList, setTransitList] = useState([]);

  // Calculate Real Distance and Rates
  const performCalculation = useCallback(async (src, dst) => {
    if (!src.trim() || !dst.trim()) return;

    setIsCalculating(true);

    const fromLoc = await resolveLocationCoords(src, {
      name: src,
      lat: currentDestination.center[0],
      lng: currentDestination.center[1]
    });

    const toLoc = await resolveLocationCoords(dst, {
      name: dst,
      lat: (zones[1]?.lat || currentDestination.center[0] + 0.02),
      lng: (zones[1]?.lng || currentDestination.center[1] + 0.02)
    });

    setSourceResolved(fromLoc);
    setDestResolved(toLoc);

    // Compute actual real-world road km
    const dist = calculateDistanceKm(fromLoc.lat, fromLoc.lng, toLoc.lat, toLoc.lng);
    setCalculatedDistance(dist);

    // Compute realistic fares and transit options
    const options = computeAccurateTransitOptions(src, dst, dist, fromLoc, toLoc);
    setTransitList(options);

    setIsCalculating(false);
  }, [currentDestination, zones]);

  useEffect(() => {
    performCalculation(sourceInput, destInput);
  }, []);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    performCalculation(sourceInput, destInput);
    confetti({ particleCount: 30, spread: 50 });
  };

  const handleSwap = () => {
    const tempSrc = sourceInput;
    const tempDst = destInput;
    setSourceInput(tempDst);
    setDestInput(tempSrc);
    performCalculation(tempDst, tempSrc);
  };

  const handleApplyPreset = (fromName, toName) => {
    setSourceInput(fromName);
    setDestInput(toName);
    performCalculation(fromName, toName);
    confetti({ particleCount: 35, spread: 60 });
  };

  const handleOpenPlatform = (btn, option) => {
    setEcoPoints(p => p + 15);
    window.open(btn.url, '_blank');
  };

  const filteredTransit = selectedTransitCategory === 'all'
    ? transitList
    : transitList.filter(t => t.category === selectedTransitCategory);

  const encodedFrom = encodeURIComponent(sourceInput + ', India');
  const encodedTo = encodeURIComponent(destInput + ', India');
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodedFrom}&destination=${encodedTo}`;

  // Pre-configured popular trip presets
  const popularPresets = [
    { label: '🚆 Hyderabad ➔ Vijayawada (275 km)', from: 'Hyderabad', to: 'Vijayawada' },
    { label: '🏛️ Delhi ➔ Agra Taj Mahal (230 km)', from: 'New Delhi', to: 'Agra' },
    { label: '🌊 Assi Ghat ➔ Sarnath Temple (10 km)', from: 'Assi Ghat', to: 'Sarnath' },
    { label: '🏰 Jaipur Airport ➔ Amber Fort (22 km)', from: 'Jaipur', to: 'Amber Fort' },
    { label: '🏖️ Panaji ➔ Baga Beach (16 km)', from: 'Panaji', to: 'Baga Beach' },
    { label: '⛰️ Leh Market ➔ Pangong Lake (160 km)', from: 'Leh', to: 'Pangong Lake' }
  ];

  return (
    <div className="bg-white border border-slate-200 p-5 sm:p-7 rounded-3xl space-y-6 shadow-sm animate-fadeIn w-full">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3.5 rounded-2xl bg-amber-500 text-slate-950 shadow-md">
            <Navigation className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 font-heritage">
                Route Finder & 1-Click Transport Booking
              </h3>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold">
                ✓ Live Distance & Accurate Fares
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Enter any source and destination in India. We calculate the exact road distance, fastest travel modes, and link you directly to ticket booking platforms.
            </p>
          </div>
        </div>

        {/* Reward Points Badge */}
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-xl text-xs font-bold text-amber-900 shadow-sm">
          <Coins className="w-4 h-4 text-amber-600 animate-bounce-subtle" />
          <span>Earn +₹15 Eco-Points per booking</span>
        </div>
      </div>

      {/* Input Form with Real Geocoding */}
      <form onSubmit={handleSearchSubmit} className="bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* Starting From (Source) */}
          <div className="md:col-span-5 space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Starting From (Source):</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={sourceInput}
                onChange={(e) => setSourceInput(e.target.value)}
                placeholder="e.g. Hyderabad / Varanasi / Delhi / Assi Ghat"
                className="w-full p-3 pl-9 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500 shadow-sm"
              />
              <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 top-3.5" />
            </div>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-2 flex justify-center pt-2 md:pt-4">
            <button
              type="button"
              onClick={handleSwap}
              className="p-3 bg-white hover:bg-amber-50 border border-slate-300 hover:border-amber-400 rounded-2xl transition shadow-sm text-slate-700 hover:text-amber-700 flex items-center gap-1.5 text-xs font-bold"
              title="Swap Source and Destination"
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span className="hidden sm:inline">Swap</span>
            </button>
          </div>

          {/* Going To (Destination) */}
          <div className="md:col-span-5 space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Going To (Destination):</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={destInput}
                onChange={(e) => setDestInput(e.target.value)}
                placeholder="e.g. Vijayawada / Kashi Vishwanath / Agra"
                className="w-full p-3 pl-9 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500 shadow-sm"
              />
              <Navigation className="w-4 h-4 text-amber-600 absolute left-3 top-3.5" />
            </div>
          </div>

        </div>

        {/* Find Route Button & Presets */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-200">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Try:</span>
            {popularPresets.map((preset, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleApplyPreset(preset.from, preset.to)}
                className="px-3 py-1.5 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl text-slate-700 font-bold whitespace-nowrap transition shadow-sm text-[11px]"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={isCalculating}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
          >
            {isCalculating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>{isCalculating ? 'Calculating Distance...' : 'Calculate Routes & Fares'}</span>
          </button>
        </div>
      </form>

      {/* Calculated Real Distance Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-bold">
            <Navigation className="w-4 h-4" />
            <span>CALCULATED ROUTE:</span>
          </div>
          <div className="text-base font-black text-white">
            {sourceResolved.name || sourceInput} ➔ {destResolved.name || destInput}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Road Distance</div>
            <div className="text-xl font-black text-amber-400 font-mono">{calculatedDistance} km</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400">Route Type</div>
            <div className="text-xs font-bold text-emerald-400">
              {calculatedDistance > 80 ? '⚡ Intercity Corridor' : '🏙️ City / Local Route'}
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar & Google Maps Live GPS Link */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Filter By:</span>
          {[
            { id: 'all', label: '🌟 All Available Modes' },
            { id: 'quickest', label: '⚡ Fastest Modes' },
            { id: 'cheapest', label: '💰 Budget / Cheap' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedTransitCategory(f.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedTransitCategory === f.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => window.open(googleMapsUrl, '_blank')}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-2"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Open Live GPS in Google Maps</span>
        </button>
      </div>

      {/* Dynamic Route Recommendations with Correct Fares */}
      <div className="space-y-4">
        {filteredTransit.map((opt) => (
          <div
            key={opt.id}
            className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-amber-400 transition-all shadow-sm space-y-3.5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              
              {/* Mode Icon & Title */}
              <div className="flex items-center gap-3">
                <span className="text-3xl p-3 bg-slate-50 border border-slate-200 rounded-2xl shadow-inner flex-shrink-0">
                  {opt.icon}
                </span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-base font-black text-slate-900">{opt.title}</h4>
                    <span className={`text-[9px] font-mono font-black px-2 py-0.5 rounded-md uppercase ${opt.rankColor}`}>
                      {opt.rankBadge}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-0.5 flex-wrap">
                    <span>⏱️ Duration: <strong>{opt.time}</strong></span>
                    <span>•</span>
                    <span>🛣️ Distance: <strong>{opt.distance}</strong></span>
                    <span>•</span>
                    <span className="text-emerald-700 font-bold">🌿 {opt.carbonTag}</span>
                  </div>
                </div>
              </div>

              {/* Exact Calculated Fare Range */}
              <div className="text-left sm:text-right bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-2xl">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Estimated Ticket / Fare:</span>
                <span className="text-lg font-black text-slate-900 font-mono">{opt.fareRange}</span>
              </div>

            </div>

            {/* Travel Guide Instructions */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 font-medium leading-relaxed">
              <strong>➔ How to go:</strong> {opt.stepGuide}
            </div>

            {/* 1-Click Booking Links */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <span className="text-xs font-bold text-slate-500">1-Click Booking:</span>
              {opt.bookingButtons.map((btn, bIdx) => (
                <button
                  key={bIdx}
                  onClick={() => handleOpenPlatform(btn, opt)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95 ${btn.color}`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{btn.label}</span>
                </button>
              ))}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
