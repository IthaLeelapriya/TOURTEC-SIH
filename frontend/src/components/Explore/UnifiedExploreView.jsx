import React from 'react';
import { useApp } from '../../context/AppContext';
import { TrackMateView } from '../SmartTour/TrackMateView';

export const UnifiedExploreView = () => {
  const {
    currentUser,
    currency,
    trackMateDestination,
    currentDestination,
    setActiveTab,
    globalUserLocation
  } = useApp();

  const activeDest = trackMateDestination || currentDestination?.shortName || 'Varanasi';

  return (
    <div className="smarttour-ai-scope bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm">
      <TrackMateView
        currentUser={currentUser}
        currency={currency}
        initialDestination={activeDest}
        onOpenTripPlanner={() => setActiveTab('roadmap')}
        currentUserLocation={globalUserLocation}
      />
    </div>
  );
};
