// SmartTour AI - Types & Data Models

export type UserRole = 'USER' | 'ADMIN' | 'VERIFIER';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  preferredLanguage: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  id?: string;
  budgetPreference: 'BUDGET' | 'MODERATE' | 'LUXURY';
  travelStyle: string;
  dietaryPreferences: string[];
  interests: string[];
  wheelchairRequired: boolean;
  lowWalkingDistance: boolean;
  elderlyFriendly: boolean;
  childFriendly: boolean;
  accessibilityNotes?: string;
  preferredCurrency: string;
  homeCountry?: string;
}

export type BudgetTier = 'budget' | 'moderate' | 'luxury';

export type AccessibilityPref =
  | 'wheelchair_access'
  | 'low_walking_distance'
  | 'senior_friendly'
  | 'family_friendly';

export type FoodPref =
  | 'vegetarian'
  | 'vegan'
  | 'jain'
  | 'halal'
  | 'gluten_free'
  | 'no_preference'
  | 'other'
  | 'rajasthani'
  | 'seafood';

export interface AiTripRecommendations {
  transport?: {
    recommendedMode: string;
    estimatedCostMinInr: number;
    estimatedCostMaxInr: number;
    travelTime: string;
    rationale: string;
    alternatives?: Array<{
      mode: string;
      costRange: string;
      travelTime: string;
      suitability: string;
    }>;
  };
  accommodation?: {
    recommendedCategory: string;
    nightlyBudgetMinInr: number;
    nightlyBudgetMaxInr: number;
    hotelOptions: HotelRecommendation[];
    avoidCategories?: string[];
  };
  food?: {
    dailyFoodBudgetMinInr: number;
    dailyFoodBudgetMaxInr: number;
    dietaryComplianceNote: string;
    restaurantOptions: RestaurantRecommendation[];
  };
  localTransport?: {
    recommendedMode: string;
    estimatedCostMinInr: number;
    estimatedCostMaxInr: number;
  };
  activities?: {
    activityBudgetInr: number;
    recommendedPlaces: PlaceRecommendation[];
  };
  budgetOptimization?: {
    isOverBudget: boolean;
    allocatedTotalInr: number;
    remainingBudgetInr: number;
    breakdown: {
      transport: number;
      accommodation: number;
      food: number;
      localTransport: number;
      activities: number;
      emergencyBuffer: number;
    };
    suggestedAdjustments?: string[];
  };
  itinerary?: Trip;
}

export interface TravelProfile {
  // USER MANDATORY REQUIREMENTS
  destination?: string;
  totalBudget: number;
  currency: string;
  travelers: number;
  startDate?: string;
  endDate?: string;
  durationDays: number;
  foodPreferences: FoodPref[];

  // USER OPTIONAL PREFERENCES
  accessibilityPreferences: AccessibilityPref[];
  safetyPreferences?: string[];
  startingLocation?: string;

  // Legacy/Compatibility
  budgetTier?: BudgetTier;

  // AI-GENERATED RECOMMENDATIONS (Kept separate from user preferences)
  aiRecommendations?: AiTripRecommendations;
}

export const DEFAULT_TRAVEL_PROFILE: TravelProfile = {
  destination: 'Hyderabad',
  totalBudget: 10000,
  currency: 'INR',
  travelers: 2,
  durationDays: 3,
  foodPreferences: ['vegetarian'],
  accessibilityPreferences: [],
  safetyPreferences: [],
  startingLocation: 'Current Location',
  budgetTier: 'moderate',
};

export interface DestinationAttraction {
  id?: string;
  name: string;
  category: string;
  description: string;
  entryFeeInr: number;
  timing: string;
  accessible?: boolean;
  latitude?: number;
  longitude?: number;
  coordinates?: { latitude: number; longitude: number };
}

export interface Destination {
  id: string;
  name: string;
  state: string;
  city?: string;
  country: string;
  region?: 'North' | 'South' | 'East' | 'West' | 'Central' | 'North-East' | 'Union Territory';
  category?: string;
  description: string;
  location: { latitude: number; longitude: number };
  bestSeason?: string[];
  avgDailyBudgetInr?: number;
  imageUrl?: string;
  tags?: string[];
  rating?: number;
  reviewCount?: number;
  attractions?: DestinationAttraction[];
  highlights?: string[];
  idealDurationDays?: number;
}

export interface CuratedPlace {
  id: string;
  name: string;
  category: string;
  description: string;
  latitude: number;
  longitude: number;
  address?: string;
  entryFeeInr?: number;
  avgVisitHours?: number;
  wheelchairAccessible?: boolean;
  childFriendly?: boolean;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: User;
}

export interface PlaceRecommendation {
  name: string;
  category: string;
  state: string;
  description: string;
  latitude: number;
  longitude: number;
  entryFeeInr: number;
  avgVisitHours: number;
  rating?: number;
  reviewCount?: number;
  priceLevel?: number; // 1-4 ($ to $$$$)
  imageUrl?: string;
  photoUrls?: string[];
  wheelchairAccessible: boolean;
  childFriendly: boolean;
  bestSeason?: string[];
  address?: string;
  openingHours?: string[];
  isOpenNow?: boolean;
  googlePlaceId?: string;
  googleMapsUrl?: string;
  phone?: string;
  website?: string;
}

export interface RestaurantRecommendation {
  name: string;
  cuisine: string;
  description: string;
  rating: number;
  reviewCount?: number;
  priceLevel: number; // 1-4
  avgCostForTwoInr: number;
  address: string;
  latitude: number;
  longitude: number;
  specialties: string[];
  isVegetarian: boolean;
  isVegan?: boolean;
  imageUrl?: string;
  openingHours?: string[];
  isOpenNow?: boolean;
  googlePlaceId?: string;
  googleMapsUrl?: string;
}

export interface HotelRecommendation {
  name: string;
  type: 'Budget Hostel' | 'Budget Hotel' | 'Mid-Range' | 'Premium' | 'Luxury' | 'Boutique' | 'Homestay' | 'Resort';
  description: string;
  rating: number;
  reviewCount?: number;
  pricePerNightInr: number;
  address: string;
  latitude: number;
  longitude: number;
  amenities: string[];
  imageUrl?: string;
  googlePlaceId?: string;
  googleMapsUrl?: string;
  phone?: string;
  website?: string;
}

export interface TransportOption {
  mode: 'Train' | 'Flight' | 'Bus' | 'Cab' | 'Auto Rickshaw' | 'Metro' | 'Ferry' | 'Bike Rental';
  from: string;
  to: string;
  durationHours: number;
  estimatedCostInr: number;
  frequency: string;
  notes: string;
  recommended?: boolean;
  bookingUrl?: string;
}

export interface BudgetBreakdown {
  category: string;
  estimatedCostInr: number;
  notes: string;
}

export interface CulturalTip {
  category: 'Dress Code' | 'Etiquette' | 'Festival' | 'Food' | 'Language' | 'Customs' | 'Photography' | 'Tipping' | 'Bargaining';
  title: string;
  tip: string;
  importance: 'MUST_KNOW' | 'RECOMMENDED' | 'NICE_TO_KNOW';
}

export interface ShoppingRecommendation {
  market: string;
  location: string;
  specialty: string[];
  bargainTip: string;
  priceRange: string;
  bestTime: string;
}

export interface ItineraryItem {
  id: string;
  placeName: string;
  category: string;
  startTime: string;
  endTime: string;
  estimatedCostInr: number;
  notes: string;
  transportMode: string;
  travelTimeMinutes: number;
  latitude: number;
  longitude: number;
  wheelchairAccessible?: boolean;
}

export interface ItineraryDay {
  id: string;
  dayNumber: number;
  date?: string;
  theme?: string;
  items: ItineraryItem[];
  notes?: string;
}

export interface Trip {
  id: string;
  title: string;
  destinationName: string;
  startDate?: string;
  endDate?: string;
  numTravelers: number;
  budgetInr: number;
  travelerNotes?: string;
  status: 'DRAFT' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  days: ItineraryDay[];
  createdAt: string;

  // Integrated Autonomous AI Travel Plan fields
  userRequirements?: {
    destination: string;
    startingLocation: string;
    totalBudget: number;
    currency: string;
    travelers: number;
    duration: number;
    foodPreferences: string[];
    accessibilityPreferences: string[];
    safetyPreferences: string[];
  };
  aiPlan?: {
    recommendedTransport?: TransportOption;
    alternativeTransport?: TransportOption;
    hotelBudgetMin?: number;
    hotelBudgetMax?: number;
    hotels?: HotelRecommendation[];
    dailyFoodBudgetMin?: number;
    dailyFoodBudgetMax?: number;
    restaurants?: RestaurantRecommendation[];
    localTransport?: {
      modes: string;
      estimatedCostInr: number;
      notes: string;
    };
    budgetBreakdown?: BudgetBreakdown[];
    budgetAllocation?: {
      staysInr: number;
      diningInr: number;
      activitiesInr: number;
      transportInr: number;
      bufferInr: number;
    };
    safetyAlerts?: string[];
    isOverBudget?: boolean;
    overBudgetAmount?: number;
    totalEstimatedSpentInr?: number;
    remainingBudgetInr?: number;
    mapMarkers?: Array<{
      latitude: number;
      longitude: number;
      title: string;
      category: 'hotel' | 'restaurant' | 'attraction' | 'hospital' | 'atm' | 'fuel' | 'transit';
      cost?: string;
      rating?: number;
      address?: string;
      wheelchair?: boolean;
      vegetarian?: boolean;
    }>;
  };
}

// ==========================================
// Open-Meteo Weather Types
// (matches backend WeatherData record)
// ==========================================

export interface WeatherLocationInfo {
  name: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
  localTime: string;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  condition: string;
  conditionEmoji: string;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  precipitation: number;
  cloudCover: number;
  visibility: number;
  uvIndex: number;
  weatherCode: number;
  isDay: boolean;
}

export interface DailyForecast {
  date: string;
  dayName: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
  conditionEmoji: string;
  weatherCode: number;
  precipitationSum: number;
  precipitationProbability: number;
  uvIndexMax: number;
}

export interface HourlyForecast {
  time: string;
  hour: string;
  temperature: number;
  condition: string;
  conditionEmoji: string;
  weatherCode: number;
  precipitation: number;
  precipitationProbability: number;
  windSpeed: number;
}

export interface OpenMeteoWeatherData {
  location: WeatherLocationInfo;
  current: CurrentWeather;
  daily: DailyForecast[];
  hourly: HourlyForecast[];
  observationTime: string;
  source: string;
  cached: boolean;
}

// Legacy WeatherInfo kept for fallback client-side engine
export interface WeatherInfo {
  destination: string;
  temperatureC: number;
  condition: string;
  humidity: number;
  windSpeedKmh: number;
  forecastSummary: string;
  isSafeForTravel: boolean;
}

export interface SuggestedAction {
  label: string;
  action: string;
  promptText: string;
}

export type AiResponseType =
  | 'GENERAL'
  | 'GENERAL_ANSWER'
  | 'GREETING'
  | 'ITINERARY'
  | 'PLACE_RECOMMENDATIONS'
  | 'PLACE_RESULTS'
  | 'RESTAURANT_RECOMMENDATIONS'
  | 'HOTEL_RECOMMENDATIONS'
  | 'TRANSPORT_INFO'
  | 'BUDGET_INFO'
  | 'WEATHER'
  | 'WEATHER_INFO'
  | 'SAFETY_ALERT'
  | 'SAFETY_INFO'
  | 'CULTURAL_INFO'
  | 'SHOPPING_INFO'
  | 'PHOTOGRAPHY_INFO'
  | 'COMPARISON'
  | 'EMERGENCY'
  | 'CURRENCY_CONVERSION'
  | 'NEARBY_PLACES'
  | 'GEOCODE_RESULT'
  | 'ERROR'
  | 'FAREWELL';

export interface StructuredAiResponse {
  type: AiResponseType;
  message: string;
  language: string;
  data?: any;
  weather?: WeatherInfo;
  places?: PlaceRecommendation[];
  restaurants?: RestaurantRecommendation[];
  hotels?: HotelRecommendation[];
  transportOptions?: TransportOption[];
  budgetBreakdown?: BudgetBreakdown[];
  culturalTips?: CulturalTip[];
  shoppingGuide?: ShoppingRecommendation[];
  trip?: Trip;
  suggestedActions?: SuggestedAction[];
  safetyNotice?: string;
  sources?: any[];
  mapMarkers?: any[];
  provenance?: {
    source: string;
    verified: boolean;
    timestamp: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'USER' | 'ASSISTANT' | 'SYSTEM';
  content: string;
  structuredResponse?: StructuredAiResponse;
  language?: string;
  createdAt: string;
}

export interface ChatSession {
  id: string;
  title: string;
  language: string;
  updatedAt: string;
  messageCount?: number;
}

export interface SafetyZone {
  id: string;
  name: string;
  state: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  riskLevel: 'SAFE' | 'CAUTION' | 'RESTRICTED' | 'HIGH_RISK';
  description: string;
  active: boolean;
  helplinePhone?: string;
}

export interface SafetyIncident {
  id: string;
  title: string;
  incidentType: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  verificationStatus: 'UNVERIFIED' | 'COMMUNITY_VERIFIED' | 'OFFICIAL_VERIFIED';
  locationLat: number;
  locationLng: number;
  reportedAt: string;
  source: string;
}

export interface SafetyAlert {
  id: string;
  alertType: 'WEATHER' | 'CROWD' | 'TRAVEL_ADVISORY' | 'HEALTH' | 'CURFEW';
  title: string;
  message: string;
  severity: 'INFO' | 'WARNING' | 'EMERGENCY';
  state: string;
  active: boolean;
  expiresAt: string;
  createdAt: string;
}

export interface EmergencyContact {
  name: string;
  number: string;
  category: string;
  description: string;
  isNational: boolean;
}

// ==========================================
// OpenStreetMap Types (Nominatim + Overpass)
// ==========================================

export interface OsmPlaceResult {
  name: string;
  type: string;
  category: string;
  latitude: number;
  longitude: number;
  address?: string;
  distance: number; // meters from search center
  osmId: number;
  osmType: string; // "node", "way", "relation"
  tags?: Record<string, string>;
  osmUrl?: string;
}

export interface OsmGeocodeResult {
  displayName: string;
  name: string;
  latitude: number;
  longitude: number;
  type: string;
  category: string;
  country?: string;
  state?: string;
  city?: string;
  postcode?: string;
  osmUrl?: string;
}

export interface OsmNearbyData {
  places: OsmPlaceResult[];
  searchCenter: { lat: number; lon: number; label: string };
  radiusMeters: number;
  placeType: string;
  totalResults: number;
}

// ==========================================
// TRACKMATE - Family Travel Location Sharing
// ==========================================

export type TrackMateSharingDuration = '30m' | '1h' | '4h' | 'trip' | 'indefinite';
export type TrackMateMemberStatus = 'SHARING_ON' | 'UPDATING' | 'SHARING_OFF' | 'UNAVAILABLE';
export type TrackMateRelation = 'Self' | 'Father' | 'Mother' | 'Brother' | 'Sister' | 'Spouse' | 'Child' | 'Friend' | 'Relative' | 'Other';

export interface TrackMateLocation {
  latitude: number;
  longitude: number;
  accuracy?: number; // in meters
  speed?: number; // in m/s
  heading?: number; // degrees
  timestamp: string; // ISO string
  batteryLevel?: number; // 0 - 100%
  address?: string;
}

export interface TrackMateMember {
  id: string;
  name: string;
  relation: TrackMateRelation;
  phone?: string;
  avatarColor: string;
  sharingStatus: TrackMateMemberStatus;
  isCurrentUser: boolean;
  location?: TrackMateLocation;
  sharingDuration?: TrackMateSharingDuration;
  sharingExpiresAt?: string; // ISO string
  distanceFromUserMeters?: number; // computed live
  lastSeenText?: string;
}

export interface TrackMateMeetingPoint {
  id: string;
  title: string;
  description?: string;
  latitude: number;
  longitude: number;
  address?: string;
  setByMemberName: string;
  createdAt: string;
}

export interface TrackMateAlert {
  id: string;
  type: 'SEPARATION' | 'ARRIVAL' | 'EMERGENCY' | 'LOCATION_STOPPED' | 'MEETING_POINT';
  title: string;
  message: string;
  timestamp: string;
  memberId?: string;
  memberName?: string;
  location?: { latitude: number; longitude: number };
  resolved?: boolean;
}

export interface TrackMateDestinationLandmark {
  name: string;
  state?: string;
  city?: string;
  latitude: number;
  longitude: number;
  description?: string;
  category?: string;
}

export interface TrackMateGroup {
  id: string;
  name: string;
  inviteCode: string;
  createdByName: string;
  destinationCity?: string;
  tripName?: string;
  createdAt: string;
  members: TrackMateMember[];
  meetingPoint?: TrackMateMeetingPoint;
  separationAlertEnabled: boolean;
  separationThresholdMeters: number;
  alerts: TrackMateAlert[];
}



