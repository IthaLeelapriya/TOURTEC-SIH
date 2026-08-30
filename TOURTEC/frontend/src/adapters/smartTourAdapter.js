/**
 * SmartTour Integration Adapter
 * Bridges TOURTEC Travel Platform state and SmartTourAI intelligence layer
 * without modifying the underlying business logic of either system.
 */

import {
  sendMessageToAI,
  getTravelProfile,
  setTravelProfile,
  getStoredTrip,
  setStoredTrip,
  optimizeTripBudget,
  optimizeFullTripItinerary,
  DEMO_DESTINATIONS,
  DEMO_SAMPLE_TRIP,
  formatCurrency
} from '../services/smartTourApi';

/**
 * Builds a context-rich prompt from TOURTEC's active destination and travel parameters
 */
export function buildContextualPrompt({
  destinationName = 'India',
  budget = 10000,
  durationDays = 3,
  travelers = 2,
  userQuery = '',
  spots = []
}) {
  const spotSummary = spots.length > 0
    ? `Current planned spots: ${spots.map(s => s.title || s.name).join(', ')}.`
    : '';

  if (userQuery && userQuery.trim()) {
    return `[Context: Visiting ${destinationName} for ${durationDays} days with ${travelers} traveler(s), budget ₹${budget}. ${spotSummary}] ${userQuery}`;
  }

  return `Please create a customized multi-day itinerary for ${destinationName} for ${durationDays} days, ${travelers} traveler(s) with a budget of ₹${budget}. Include top verified attractions, authentic regional food, local transport, entry timings, and accessibility notes.`;
}

/**
 * Converts SmartTourAI Trip Days/Items into TOURTEC Dynamic Roadmap milestones
 */
export function convertAiTripToRoadmap(trip) {
  if (!trip || !trip.days || trip.days.length === 0) return [];

  const milestones = [];
  let spotIdx = 0;

  trip.days.forEach((day) => {
    (day.items || []).forEach((item, itemIdx) => {
      spotIdx++;
      milestones.push({
        id: item.id || `ai-spot-${spotIdx}`,
        title: item.placeName || 'Attraction',
        fromLocation: itemIdx === 0 ? `Day ${day.dayNumber} Starting Point` : day.items[itemIdx - 1]?.placeName || 'Previous Stop',
        toLocation: item.placeName,
        time: item.startTime || `${8 + itemIdx * 2}:30 AM`,
        status: spotIdx === 1 ? 'in-progress' : 'upcoming',
        duration: `${item.travelTimeMinutes || 20} mins visit`,
        lat: item.latitude || 25.3176,
        lng: item.longitude || 82.9739,
        distanceKm: ((item.travelTimeMinutes || 15) * 0.18 + 0.8).toFixed(1),
        travelTime: `${item.travelTimeMinutes || 15} mins`,
        recommendedTransport: item.transportMode || 'Auto / Taxi',
        recommendedFare: `₹${item.estimatedCostInr || 50}`,
        transportIcon: item.transportMode?.toLowerCase().includes('cab') ? '🚕' : '🛺',
        transitOptions: [
          {
            mode: item.transportMode || 'auto',
            title: `Local ${item.transportMode || 'Transit'}`,
            fare: `₹${item.estimatedCostInr || 40}`,
            time: `${item.travelTimeMinutes || 15} mins`,
            icon: '🛺',
            badge: 'Fastest',
            steps: `Direct transfer to ${item.placeName}`
          }
        ],
        directionsGuide: item.notes || `Visit ${item.placeName} during Day ${day.dayNumber}.`,
        tips: item.notes || `Day ${day.dayNumber} highlight in ${trip.destinationName}.`,
        category: item.category || 'Sightseeing',
        crowdLevel: 'Moderate (45%)',
        dayNumber: day.dayNumber
      });
    });
  });

  return milestones;
}

/**
 * Finds a matching destination from SmartTourAI's vast knowledge base
 */
export function findSmartTourDestination(cityName) {
  if (!cityName) return null;
  const lower = cityName.toLowerCase().trim();
  return (
    DEMO_DESTINATIONS.find(
      (d) =>
        d.name.toLowerCase().includes(lower) ||
        d.city?.toLowerCase().includes(lower) ||
        d.state.toLowerCase().includes(lower)
    ) || null
  );
}

export {
  sendMessageToAI,
  getTravelProfile,
  setTravelProfile,
  getStoredTrip,
  setStoredTrip,
  optimizeTripBudget,
  optimizeFullTripItinerary,
  DEMO_DESTINATIONS,
  DEMO_SAMPLE_TRIP,
  formatCurrency
};
