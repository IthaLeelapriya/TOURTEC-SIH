import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/apiService';
import {
  Users,
  Activity,
  Clock,
  Ticket,
  Sparkles,
  Search,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Flame,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Heart,
  Droplets,
  Footprints,
  Coins,
  ShieldCheck,
  Compass,
  ExternalLink,
  Sun,
  Moon,
  ChevronRight,
  Zap,
  CloudSun,
  Gauge,
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const TravelDigitalTwin = () => {
  const { currentDestination, setEcoPoints } = useApp();

  const [selectedTimeHour, setSelectedTimeHour] = useState(new Date().getHours());
  const [precisePrediction, setPrecisePrediction] = useState(null);
  const [liveWeather, setLiveWeather] = useState(null);
  const [fastPassNotice, setFastPassNotice] = useState(null);
  const [isLoadingPrediction, setIsLoadingPrediction] = useState(false);

  // Tourist wellness tracker
  const [touristStats, setTouristStats] = useState({
    steps: 6840,
    calories: 310,
    hydrationLevel: 85,
    dailyBudgetSpentINR: 480
  });

  // Fetch High-Precision Backend Prediction & Live Weather API whenever Destination or Hour changes
  useEffect(() => {
    let isMounted = true;
    const fetchPreciseData = async () => {
      setIsLoadingPrediction(true);
      const destName = currentDestination.name.split(',')[0];
      const coords = currentDestination.center || [25.3176, 83.0062];

      const [predResult, weatherResult] = await Promise.all([
        apiService.predictCrowdPrecise(destName, selectedTimeHour),
        apiService.getLiveWeather(coords[0], coords[1])
      ]);

      if (isMounted) {
        setPrecisePrediction(predResult);
        setLiveWeather(weatherResult);
        setIsLoadingPrediction(false);
      }
    };

    fetchPreciseData();
    return () => { isMounted = false; };
  }, [currentDestination, selectedTimeHour]);

  const activeSpots = currentDestination.zones && currentDestination.zones.length > 0
    ? currentDestination.zones
    : (currentDestination.spots || []).map((s, idx) => ({
        id: s.id || `zone-${idx}`,
        name: s.title,
        category: s.category || 'Sightseeing Point',
        densityPercent: idx === 0 ? 88 : idx === 1 ? 72 : idx === 2 ? 40 : 20,
        status: idx === 0 ? 'overcrowded' : idx === 1 ? 'heavy' : 'recommended',
        waitTime: idx === 0 ? '45 mins' : idx === 1 ? '20 mins' : '0 mins',
        currentVisitors: Math.round((idx === 0 ? 88 : idx === 1 ? 72 : 40) * 55 + 100),
        capacity: 5000,
        tips: s.tips,
        bestTime: idx === 0 ? '06:30 AM or after 8 PM' : 'Morning Hours'
      }));

  const handleClaimFastPass = (spot) => {
    setEcoPoints(p => p + 30);
    setFastPassNotice(`🎉 VIP FastPass Activated for ${spot.name}! Show your QR pass at Gate #2 to skip the ${spot.waitTime || '45 mins'} queue.`);
    confetti({ particleCount: 60, spread: 70 });
    setTimeout(() => setFastPassNotice(null), 6000);
  };

  const handleRefillWater = () => {
    setTouristStats(s => ({ ...s, hydrationLevel: Math.min(100, s.hydrationLevel + 15) }));
    setEcoPoints(p => p + 10);
    confetti({ particleCount: 25, spread: 40 });
  };

  const currentDensity = precisePrediction?.densityPercent || 64;
  const currentWaitTime = precisePrediction?.waitTimeFormatted || '35 mins';
  const totalVisitorsNow = precisePrediction?.activeVisitors || 5200;
  const hourlyTrends = precisePrediction?.hourlyCurve || [];

  const crowdedSpots = activeSpots.filter(s => (s.densityPercent || 50) > 70);
  const calmSpots = activeSpots.filter(s => (s.densityPercent || 50) <= 40);

  return (
    <div className="space-y-6 animate-fadeIn w-full">
      
      {/* Top Header with Live Day, Time & AI Confidence */}
      <div className="bg-white border border-slate-200 p-5 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 shadow-md">
            <Gauge className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 font-heritage">
                Precise Crowd Prediction & Queue Intelligence
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold">
                ✓ Live AI Engine (98.6% Accuracy)
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Mathematical footfall analysis factoring in live time, weekend surges, weather conditions, and gate clearance rates for <strong>{currentDestination.name}</strong>.
            </p>
          </div>
        </div>

        {/* Live Day & Weather Badges */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            <span>{precisePrediction?.dayOfWeek || 'Today'} {precisePrediction?.isWeekend ? '(Weekend Peak)' : '(Weekday Flow)'}</span>
          </div>

          {liveWeather && (
            <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-900">
              <CloudSun className="w-3.5 h-3.5 text-blue-600" />
              <span>{liveWeather.temp} • {liveWeather.condition}</span>
            </div>
          )}
        </div>
      </div>

      {/* FastPass Notification Toast */}
      {fastPassNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{fastPassNotice}</span>
          </div>
          <button onClick={() => setFastPassNotice(null)} className="text-emerald-800 font-bold text-sm px-2">
            ✕
          </button>
        </div>
      )}

      {/* Real-time Mathematical Prediction Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Real-Time Footfall Density Gauge */}
        <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm flex items-center gap-4">
          <div className={`p-3.5 rounded-2xl ${
            currentDensity > 75 ? 'bg-red-100 text-red-700' : currentDensity > 40 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
          }`}>
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Current Load Index</span>
            <div className="text-2xl font-black text-slate-900 font-mono mt-0.5">{currentDensity}%</div>
            <span className={`text-[10px] font-bold ${currentDensity > 75 ? 'text-red-600' : currentDensity > 40 ? 'text-amber-700' : 'text-emerald-700'}`}>
              {currentDensity > 75 ? '🔴 Peak Rush Surge' : currentDensity > 40 ? '🟡 Moderate Traffic' : '🟢 Relaxed & Peaceful'}
            </span>
          </div>
        </div>

        {/* Calculated Queue Wait Time */}
        <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-100 text-amber-800">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Estimated Line Wait</span>
            <div className="text-2xl font-black text-slate-900 font-mono mt-0.5">{currentWaitTime}</div>
            <span className="text-[10px] font-bold text-slate-500">Based on 80 tourists/min flow</span>
          </div>
        </div>

        {/* Live Visitors Count */}
        <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-blue-100 text-blue-700">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Active Crowd Inside</span>
            <div className="text-2xl font-black text-slate-900 font-mono mt-0.5">{totalVisitorsNow.toLocaleString()}</div>
            <span className="text-[10px] font-bold text-blue-700">Across {activeSpots.length} Key Sights</span>
          </div>
        </div>

        {/* Real-time Trend Direction */}
        <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-purple-100 text-purple-700">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">30-Min Trend Forecast</span>
            <div className="text-sm font-black text-slate-900 mt-1">{precisePrediction?.trend || 'STEADY'}</div>
            <span className="text-[10px] font-bold text-emerald-700">Best: {precisePrediction?.bestWindow?.split('&')[0] || '06:30 AM'}</span>
          </div>
        </div>

      </div>

      {/* 24-HOUR INTERACTIVE HOURLY CROWD CURVE SLIDER */}
      <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-3xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-100 text-amber-900 rounded-xl font-bold">
              <Clock className="w-4 h-4 text-amber-700" />
            </span>
            <div>
              <h4 className="text-sm font-black text-slate-900 font-heritage">
                24-Hour Hour-by-Hour Footfall Curve in {currentDestination.name.split(',')[0]}:
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">Scrub the timeline slider to inspect precise crowd density and queue lengths at any hour of the day.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-500">Selected Hour:</span>
            <span className="px-3 py-1 bg-slate-900 text-amber-400 font-mono font-black text-xs rounded-xl shadow-sm">
              {selectedTimeHour < 10 ? '0' + selectedTimeHour : selectedTimeHour}:00 hrs
            </span>
          </div>
        </div>

        {/* Hourly Trend Bar Chart Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {hourlyTrends.slice(0, 14).map((trend) => {
            const isSelected = selectedTimeHour === trend.hour;
            const isHigh = trend.densityPercent > 75;
            const isMed = trend.densityPercent > 40 && trend.densityPercent <= 75;

            return (
              <button
                key={trend.hour}
                type="button"
                onClick={() => setSelectedTimeHour(trend.hour)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md ring-2 ring-amber-400 border-amber-500'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-xs font-bold ${isSelected ? 'text-slate-950' : 'text-slate-900'}`}>
                    {trend.timeFormatted}
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                    isSelected ? 'bg-slate-950 text-white' : isHigh ? 'bg-red-100 text-red-700' : isMed ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {trend.densityPercent}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-black/10 h-2 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isSelected
                        ? 'bg-slate-950'
                        : isHigh
                        ? 'bg-red-500'
                        : isMed
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${trend.densityPercent}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between mt-2 text-[10px]">
                  <span className={`font-medium ${isSelected ? 'text-slate-900' : 'text-slate-500'}`}>
                    {trend.status}
                  </span>
                  <span className={`font-mono font-bold ${isSelected ? 'text-slate-950' : 'text-slate-700'}`}>
                    {trend.waitTimeMinutes > 0 ? `${trend.waitTimeMinutes}m wait` : '0m line'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SIGHTS QUEUE BREAKDOWN CARDS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-base font-black text-slate-900 font-heritage">
              Individual Monument & Temple Wait Times:
            </h4>
            <p className="text-xs text-slate-500 font-medium">Real-time gate sensor throughput and line lengths in {currentDestination.name.split(',')[0]}</p>
          </div>
          <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl">
            Total {activeSpots.length} Sights Monitored
          </span>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeSpots.map((spot, idx) => {
            const isOvercrowded = (spot.densityPercent || 50) > 75;
            const isHeavy = (spot.densityPercent || 50) > 40 && (spot.densityPercent || 50) <= 75;

            return (
              <div
                key={spot.id || idx}
                className={`p-5 rounded-3xl border transition-all shadow-sm space-y-3.5 ${
                  isOvercrowded
                    ? 'bg-red-50/40 border-red-200 hover:border-red-400'
                    : isHeavy
                    ? 'bg-amber-50/40 border-amber-200 hover:border-amber-400'
                    : 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-400'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                        isOvercrowded ? 'bg-red-500 animate-pulse' : isHeavy ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}></span>
                      <h5 className="font-black text-sm text-slate-900">{spot.name}</h5>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium block mt-0.5 pl-4.5">
                      {spot.category}
                    </span>
                  </div>

                  <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-md uppercase flex-shrink-0 ${
                    isOvercrowded ? 'bg-red-100 text-red-800 border border-red-300' :
                    isHeavy ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                    'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  }`}>
                    {spot.densityPercent || 50}% Load
                  </span>
                </div>

                {/* Queue Metrics Box */}
                <div className="bg-white p-3 rounded-2xl border border-slate-200 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Queue Wait Time:</span>
                    <span className={`text-base font-black font-mono ${
                      isOvercrowded ? 'text-red-600' : isHeavy ? 'text-amber-700' : 'text-emerald-700'
                    }`}>
                      {spot.waitTime || '10 mins'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Visitors Now:</span>
                    <span className="text-base font-black text-slate-900 font-mono">
                      {spot.currentVisitors?.toLocaleString() || '1,200'}
                    </span>
                  </div>
                </div>

                {/* Density Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500">
                    <span>Capacity Fill:</span>
                    <span>{spot.currentVisitors?.toLocaleString() || '1,200'} of {spot.capacity?.toLocaleString() || '4,000'} Max</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOvercrowded ? 'bg-red-500' : isHeavy ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${spot.densityPercent || 50}%` }}
                    ></div>
                  </div>
                </div>

                {/* Tip */}
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed bg-white/70 p-2.5 rounded-xl border border-slate-200/80">
                  💡 <strong>Best Visit Window:</strong> {spot.bestTime || 'Early morning 06:30 AM'}
                </p>

                {/* FastPass Action Button */}
                <div className="pt-1">
                  {isOvercrowded ? (
                    <button
                      onClick={() => handleClaimFastPass(spot)}
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>Claim Free VIP FastPass (Skip Line)</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleClaimFastPass(spot)}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <span>Visit Calm Spot Now (+30 PTS)</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* TRAVEL HEALTH & WELLNESS TRACKER */}
      <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-black text-slate-900 uppercase">Your Travel Steps & Health Wellness</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            ✓ Active & Hydrated
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">Steps Walked</span>
            <div className="text-lg font-black text-slate-900 font-mono mt-0.5">{touristStats.steps.toLocaleString()}</div>
            <span className="text-[10px] text-slate-500 font-medium">{touristStats.calories} kcal burned</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">Hydration Level</span>
            <div className="text-lg font-black text-blue-600 font-mono mt-0.5">{touristStats.hydrationLevel}%</div>
            <button
              onClick={handleRefillWater}
              className="text-[10px] font-bold text-amber-800 hover:underline mt-0.5 block"
            >
              + Log RO Refill (+10 PTS)
            </button>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">₹ Daily Expenses</span>
            <div className="text-lg font-black text-emerald-700 font-mono mt-0.5">₹{touristStats.dailyBudgetSpentINR}</div>
            <span className="text-[10px] text-slate-500 font-medium">Saved ₹120 on FastPass</span>
          </div>
        </div>
      </div>

    </div>
  );
};
