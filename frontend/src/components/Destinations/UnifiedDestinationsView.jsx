import React from 'react';
import { useApp } from '../../context/AppContext';
import { DestinationMapView } from '../SmartTour/DestinationMapView';

export const UnifiedDestinationsView = () => {
  const {
    currency,
    globalUserLocation,
    planTripForDestination,
    askSmartTourAi,
    openExplore
  } = useApp();

  const handlePlanTrip = (destName) => {
    planTripForDestination(destName);
  };

  const handleAskAiToPlan = (destName, stateName) => {
    const prompt = `Help me plan a trip to ${destName}${stateName ? `, ${stateName}` : ''} — including top verified attractions, entry fees, best travel season, recommended local foods, and travel tips.`;
    askSmartTourAi(prompt, { switchToChat: true });
  };

  return (
    <div className="smarttour-ai-scope bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm">
      <DestinationMapView
        currency={currency}
        onPlanTripForDestination={handlePlanTrip}
        onAskAiToPlan={handleAskAiToPlan}
        onOpenTrackMate={(dest) => openExplore(dest)}
        currentUserLocation={globalUserLocation}
      />
    </div>
  );
};
