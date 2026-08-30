import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DynamicRoadmap } from '../Roadmap/DynamicRoadmap';
import { TripPlannerView } from '../SmartTour/TripPlannerView';
import { Compass, Calendar, Sparkles, DollarSign, Bot, SlidersHorizontal, MapPin } from 'lucide-react';
import { optimizeTripBudget, setStoredTrip } from '../../adapters/smartTourAdapter';

export const UnifiedTripPlanner = () => {
  const {
    currentTrip,
    setCurrentTrip,
    currentDestination,
    currency,
    globalUserLocation,
    setShowPrefModal,
    openExplore,
    askSmartTourAi,
    setIsFloatingAiOpen,
    requireAuth
  } = useApp();

  const [plannerTab, setPlannerTab] = useState('roadmap'); // 'roadmap' | 'multiday'

  const cityName = currentDestination?.shortName || currentDestination?.name?.split(',')[0] || 'Varanasi';

  const handleAskAiToOptimize = (tripTitle) => {
    requireAuth(() => {
      if (currentTrip) {
        const optimized = optimizeTripBudget(currentTrip, currentTrip.budgetInr);
        setCurrentTrip(optimized);
        setStoredTrip(optimized);
      }
      const prompt = `Please optimize the itinerary "${tripTitle || cityName}" for lower travel time, best photo lighting at key spots, and authentic regional dining within budget.`;
      askSmartTourAi(prompt, { switchToChat: true });
    }, { message: 'Please sign in to optimize and save your custom multi-day travel itinerary.' });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Sub-Header Tabs for Trip Planner */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200/60">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Trip Planner: {cityName}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Combine interactive transit roadmaps with multi-day AI budget planning.
            </p>
          </div>
        </div>

        {/* Tab Switcher & Actions */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 border border-slate-200">
            <button
              onClick={() => setPlannerTab('roadmap')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                plannerTab === 'roadmap'
                  ? 'bg-blue-600 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Roadmap & Routes</span>
            </button>

            <button
              onClick={() => setPlannerTab('multiday')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                plannerTab === 'multiday'
                  ? 'bg-blue-600 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Multi-Day Itinerary</span>
            </button>
          </div>

          <button
            onClick={() => handleAskAiToOptimize(currentTrip?.title || cityName)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black shadow-md shadow-blue-500/20 transition active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Optimize</span>
          </button>
        </div>
      </div>

      {/* View Content */}
      <div className="w-full">
        {plannerTab === 'roadmap' ? (
          <DynamicRoadmap />
        ) : (
          <div className="smarttour-ai-scope bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm">
            <TripPlannerView
              trip={currentTrip}
              setTrip={setCurrentTrip}
              currency={currency}
              onAskAiToOptimize={handleAskAiToOptimize}
              onOpenPreferences={() => setShowPrefModal(true)}
              onOpenTrackMate={(dest) => openExplore(dest)}
              currentUserLocation={globalUserLocation}
            />
          </div>
        )}
      </div>

    </div>
  );
};
