// Comprehensive Indian Cities, Pilgrimage Centers & Tourist Landmarks Database
export const INDIAN_LOCATIONS = {
  // Andhra Pradesh & Telangana
  'hyderabad': { name: 'Hyderabad, Telangana', lat: 17.3850, lng: 78.4867, state: 'Telangana', hasAirport: true, hasRailway: true },
  'vijayawada': { name: 'Vijayawada, Andhra Pradesh', lat: 16.5062, lng: 80.6480, state: 'Andhra Pradesh', hasAirport: true, hasRailway: true },
  'visakhapatnam': { name: 'Visakhapatnam, Andhra Pradesh', lat: 17.6868, lng: 83.2185, state: 'Andhra Pradesh', hasAirport: true, hasRailway: true },
  'vizag': { name: 'Visakhapatnam, Andhra Pradesh', lat: 17.6868, lng: 83.2185, state: 'Andhra Pradesh', hasAirport: true, hasRailway: true },
  'tirupati': { name: 'Tirupati (Sri Venkateswara Temple), AP', lat: 13.6288, lng: 79.4192, state: 'Andhra Pradesh', hasAirport: true, hasRailway: true },
  'guntur': { name: 'Guntur, Andhra Pradesh', lat: 16.3067, lng: 80.4365, state: 'Andhra Pradesh', hasAirport: false, hasRailway: true },
  'warangal': { name: 'Warangal, Telangana', lat: 17.9689, lng: 79.5941, state: 'Telangana', hasAirport: false, hasRailway: true },

  // Uttar Pradesh & Delhi NCR
  'varanasi': { name: 'Varanasi (Kashi), Uttar Pradesh', lat: 25.3176, lng: 83.0062, state: 'Uttar Pradesh', hasAirport: true, hasRailway: true },
  'kashi': { name: 'Varanasi (Kashi), Uttar Pradesh', lat: 25.3176, lng: 83.0062, state: 'Uttar Pradesh', hasAirport: true, hasRailway: true },
  'kashi vishwanath': { name: 'Kashi Vishwanath Temple, Varanasi', lat: 25.3109, lng: 83.0107, state: 'Uttar Pradesh', isLocal: true },
  'assi ghat': { name: 'Assi Ghat, Varanasi', lat: 25.2917, lng: 83.0039, state: 'Uttar Pradesh', isLocal: true },
  'dashashwamedh ghat': { name: 'Dashashwamedh Ghat, Varanasi', lat: 25.3072, lng: 83.0104, state: 'Uttar Pradesh', isLocal: true },
  'sarnath': { name: 'Sarnath UNESCO Deer Park, Varanasi', lat: 25.3811, lng: 83.0214, state: 'Uttar Pradesh', isLocal: true },
  'delhi': { name: 'New Delhi / NCR', lat: 28.6139, lng: 77.2090, state: 'Delhi', hasAirport: true, hasRailway: true },
  'new delhi': { name: 'New Delhi / NCR', lat: 28.6139, lng: 77.2090, state: 'Delhi', hasAirport: true, hasRailway: true },
  'agra': { name: 'Agra (Taj Mahal), Uttar Pradesh', lat: 27.1767, lng: 78.0081, state: 'Uttar Pradesh', hasAirport: true, hasRailway: true },
  'taj mahal': { name: 'Taj Mahal East Gate, Agra', lat: 27.1751, lng: 78.0421, state: 'Uttar Pradesh', isLocal: true },
  'mehtab bagh': { name: 'Mehtab Bagh Garden, Agra', lat: 27.1800, lng: 78.0422, state: 'Uttar Pradesh', isLocal: true },
  'lucknow': { name: 'Lucknow, Uttar Pradesh', lat: 26.8467, lng: 80.9462, state: 'Uttar Pradesh', hasAirport: true, hasRailway: true },
  'ayodhya': { name: 'Ayodhya (Ram Mandir), Uttar Pradesh', lat: 26.7922, lng: 82.1998, state: 'Uttar Pradesh', hasAirport: true, hasRailway: true },
  'prayagraj': { name: 'Prayagraj (Triveni Sangam), UP', lat: 25.4358, lng: 81.8463, state: 'Uttar Pradesh', hasAirport: true, hasRailway: true },
  'allahabad': { name: 'Prayagraj (Triveni Sangam), UP', lat: 25.4358, lng: 81.8463, state: 'Uttar Pradesh', hasAirport: true, hasRailway: true },
  'mathura': { name: 'Mathura & Vrindavan, UP', lat: 27.4924, lng: 77.6737, state: 'Uttar Pradesh', hasAirport: false, hasRailway: true },

  // Rajasthan
  'jaipur': { name: 'Jaipur (Pink City), Rajasthan', lat: 26.9124, lng: 75.7873, state: 'Rajasthan', hasAirport: true, hasRailway: true },
  'hawa mahal': { name: 'Hawa Mahal Palace, Jaipur', lat: 26.9239, lng: 75.8267, state: 'Rajasthan', isLocal: true },
  'amber fort': { name: 'Amber Fort, Jaipur', lat: 26.9855, lng: 75.8513, state: 'Rajasthan', isLocal: true },
  'nahargarh fort': { name: 'Nahargarh Fort, Jaipur', lat: 26.9374, lng: 75.8155, state: 'Rajasthan', isLocal: true },
  'udaipur': { name: 'Udaipur (City of Lakes), Rajasthan', lat: 24.5854, lng: 73.7125, state: 'Rajasthan', hasAirport: true, hasRailway: true },
  'jodhpur': { name: 'Jodhpur (Blue City), Rajasthan', lat: 26.2389, lng: 73.0243, state: 'Rajasthan', hasAirport: true, hasRailway: true },
  'jaisalmer': { name: 'Jaisalmer (Golden Fort), Rajasthan', lat: 26.9157, lng: 70.9083, state: 'Rajasthan', hasAirport: true, hasRailway: true },

  // Maharashtra & Western India
  'mumbai': { name: 'Mumbai, Maharashtra', lat: 19.0760, lng: 72.8777, state: 'Maharashtra', hasAirport: true, hasRailway: true },
  'pune': { name: 'Pune, Maharashtra', lat: 18.5204, lng: 73.8567, state: 'Maharashtra', hasAirport: true, hasRailway: true },
  'goa': { name: 'Goa (Panaji / Coastal Corridor)', lat: 15.2993, lng: 74.1240, state: 'Goa', hasAirport: true, hasRailway: true },
  'panaji': { name: 'Panaji (Fontainhas), Goa', lat: 15.4989, lng: 73.8278, state: 'Goa', hasAirport: false, hasRailway: true },
  'baga beach': { name: 'Baga & Calangute Beach, Goa', lat: 15.5553, lng: 73.7517, state: 'Goa', isLocal: true },
  'ahmedabad': { name: 'Ahmedabad, Gujarat', lat: 23.0225, lng: 72.5714, state: 'Gujarat', hasAirport: true, hasRailway: true },

  // Karnataka & South India
  'bengaluru': { name: 'Bengaluru (Bangalore), Karnataka', lat: 12.9716, lng: 77.5946, state: 'Karnataka', hasAirport: true, hasRailway: true },
  'bangalore': { name: 'Bengaluru (Bangalore), Karnataka', lat: 12.9716, lng: 77.5946, state: 'Karnataka', hasAirport: true, hasRailway: true },
  'mysuru': { name: 'Mysuru (Mysore Palace), Karnataka', lat: 12.2958, lng: 76.6394, state: 'Karnataka', hasAirport: true, hasRailway: true },
  'mysore': { name: 'Mysuru (Mysore Palace), Karnataka', lat: 12.2958, lng: 76.6394, state: 'Karnataka', hasAirport: true, hasRailway: true },
  'chennai': { name: 'Chennai, Tamil Nadu', lat: 13.0827, lng: 80.2707, state: 'Tamil Nadu', hasAirport: true, hasRailway: true },
  'madurai': { name: 'Madurai (Meenakshi Temple), Tamil Nadu', lat: 9.9252, lng: 78.1198, state: 'Tamil Nadu', hasAirport: true, hasRailway: true },
  'kochi': { name: 'Kochi (Cochin), Kerala', lat: 9.9312, lng: 76.2673, state: 'Kerala', hasAirport: true, hasRailway: true },
  'cochin': { name: 'Kochi (Cochin), Kerala', lat: 9.9312, lng: 76.2673, state: 'Kerala', hasAirport: true, hasRailway: true },

  // North & East
  'kolkata': { name: 'Kolkata, West Bengal', lat: 22.5726, lng: 88.3639, state: 'West Bengal', hasAirport: true, hasRailway: true },
  'leh': { name: 'Leh Ladakh, UT Ladakh', lat: 34.1526, lng: 77.5771, state: 'Ladakh', hasAirport: true, hasRailway: false },
  'ladakh': { name: 'Leh Ladakh, UT Ladakh', lat: 34.1526, lng: 77.5771, state: 'Ladakh', hasAirport: true, hasRailway: false },
  'pangong lake': { name: 'Pangong Tso Lake, Ladakh', lat: 33.7595, lng: 78.6674, state: 'Ladakh', isLocal: true },
  'rishikesh': { name: 'Rishikesh (Yoga Capital), Uttarakhand', lat: 30.0869, lng: 78.2676, state: 'Uttarakhand', hasAirport: false, hasRailway: true },
  'haridwar': { name: 'Haridwar (Har Ki Pauri), Uttarakhand', lat: 29.9457, lng: 78.1642, state: 'Uttarakhand', hasAirport: false, hasRailway: true },
  'amritsar': { name: 'Amritsar (Golden Temple), Punjab', lat: 31.6340, lng: 74.8723, state: 'Punjab', hasAirport: true, hasRailway: true }
};

// Haversine formula to compute great-circle distance in kilometers
export const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightDist = R * c;

  // Road tortuosity multiplier (~1.26x actual road network in India)
  const roadDistance = straightDist * 1.26;
  return Math.round(roadDistance * 10) / 10;
};

// Find Location Coordinates (Local cache or Nominatim OpenStreetMap fallback)
export const resolveLocationCoords = async (query, fallbackCoords = null) => {
  if (!query || !query.trim()) return fallbackCoords;

  const normalized = query.toLowerCase().trim();

  // 1. Check exact dictionary match
  if (INDIAN_LOCATIONS[normalized]) {
    return {
      name: INDIAN_LOCATIONS[normalized].name,
      lat: INDIAN_LOCATIONS[normalized].lat,
      lng: INDIAN_LOCATIONS[normalized].lng,
      hasAirport: INDIAN_LOCATIONS[normalized].hasAirport,
      hasRailway: INDIAN_LOCATIONS[normalized].hasRailway
    };
  }

  // 2. Check partial key match
  for (const key of Object.keys(INDIAN_LOCATIONS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return {
        name: INDIAN_LOCATIONS[key].name,
        lat: INDIAN_LOCATIONS[key].lat,
        lng: INDIAN_LOCATIONS[key].lng,
        hasAirport: INDIAN_LOCATIONS[key].hasAirport,
        hasRailway: INDIAN_LOCATIONS[key].hasRailway
      };
    }
  }

  // 3. Live Geocoding via OpenStreetMap Nominatim
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', India')}&limit=1`;
    const res = await fetch(url, { headers: { 'User-Agent': 'Tourtec-India-Smart-Travel' } });
    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0) {
        return {
          name: data[0].display_name.split(',').slice(0, 2).join(','),
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          hasAirport: true,
          hasRailway: true
        };
      }
    }
  } catch (err) {
    console.warn('Geocoding fallback:', err);
  }

  return fallbackCoords || { name: query, lat: 25.3176, lng: 83.0062, hasAirport: true, hasRailway: true };
};

// Calculate accurate multi-modal transport choices, fares & booking links
export const computeAccurateTransitOptions = (sourceName, destName, distanceKm, fromCoords, toCoords) => {
  const dist = Math.max(0.5, distanceKm || 3.0);
  const options = [];

  const encodedFrom = encodeURIComponent(sourceName + ', India');
  const encodedTo = encodeURIComponent(destName + ', India');

  // ==========================================
  // CASE 1: INTERCITY LONG DISTANCE (> 80 km)
  // Example: Hyderabad ➔ Vijayawada (~275 km)
  // ==========================================
  if (dist > 80) {
    // 1. Vande Bharat / Superfast Express Train (IRCTC)
    const trainHours = Math.floor(dist / 85) + 1;
    const trainMins = Math.round((dist % 85) * 0.6);
    const trainTimeStr = `${trainHours}h ${trainMins > 0 ? trainMins + 'm' : ''}`;
    const trainFareSleeper = Math.round(dist * 0.75 + 120);
    const trainFareVandeBharat = Math.round(dist * 2.6 + 250);

    options.push({
      id: 'opt-train',
      title: 'Indian Railways (Vande Bharat / Express Train)',
      category: 'quickest',
      icon: '🚆',
      rankBadge: 'MOST POPULAR & COMFORTABLE',
      rankColor: 'bg-emerald-600 text-white',
      time: trainTimeStr,
      distance: `${dist} km`,
      fareRange: `₹${trainFareSleeper} (2S/SL) - ₹${trainFareVandeBharat} (CC/3AC)`,
      carbonTag: 'Eco-Rail (Lowest Carbon)',
      stepGuide: `Direct Superfast / Vande Bharat Express connectivity between ${sourceName.split(',')[0]} and ${destName.split(',')[0]}. Reserved seating & meal service.`,
      bookingButtons: [
        { label: 'Book on IRCTC Official', platform: 'irctc', url: 'https://www.irctc.co.in/', color: 'bg-orange-600 hover:bg-orange-500 text-white' },
        { label: 'Check Trains on ConfirmTkt', platform: 'confirmtkt', url: `https://www.confirmtkt.com/rbooking-d/trains/from/${encodeURIComponent(sourceName)}/to/${encodeURIComponent(destName)}`, color: 'bg-slate-900 hover:bg-slate-800 text-white' }
      ]
    });

    // 2. Intercity AC Sleeper / State Electric Bus (RedBus)
    const busHours = Math.floor(dist / 55) + 1;
    const busMins = Math.round((dist % 55) * 0.9);
    const busTimeStr = `${busHours}h ${busMins > 0 ? busMins + 'm' : ''}`;
    const busFareSeater = Math.round(dist * 1.35 + 80);
    const busFareSleeper = Math.round(dist * 2.2 + 150);

    options.push({
      id: 'opt-bus-intercity',
      title: 'Intercity AC Sleeper / State Volvo Bus (RedBus)',
      category: 'cheapest',
      icon: '🚌',
      rankBadge: 'FREQUENT TIMINGS & BUDGET',
      rankColor: 'bg-purple-600 text-white',
      time: busTimeStr,
      distance: `${dist} km`,
      fareRange: `₹${busFareSeater} - ₹${busFareSleeper}`,
      carbonTag: 'Electric / AC Volvo',
      stepGuide: `Board luxury AC multi-axle or government electric bus. Buses depart every 20-30 minutes with live GPS tracking.`,
      bookingButtons: [
        { label: 'Book on RedBus', platform: 'redbus', url: `https://www.redbus.in/bus-tickets/${encodeURIComponent(sourceName)}-to-${encodeURIComponent(destName)}`, color: 'bg-red-600 hover:bg-red-500 text-white' },
        { label: 'Book on AbhiBus', platform: 'abhibus', url: 'https://www.abhibus.com/', color: 'bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold' }
      ]
    });

    // 3. Outstation Intercity Cab (Uber Intercity / Savaari / MakeMyTrip)
    const cabHours = Math.floor(dist / 65);
    const cabMins = Math.round((dist % 65) * 0.85);
    const cabTimeStr = `${cabHours}h ${cabMins}m`;
    const cabFareMin = Math.round(dist * 11.5 + 400);
    const cabFareMax = Math.round(dist * 14.5 + 600);

    options.push({
      id: 'opt-cab-outstation',
      title: 'Outstation One-Way AC Cab (Uber Intercity / Savaari)',
      category: 'quickest',
      icon: '🚕',
      rankBadge: 'DOOR-TO-DOOR PRIVATE TAXI',
      rankColor: 'bg-blue-600 text-white',
      time: cabTimeStr,
      distance: `${dist} km`,
      fareRange: `₹${cabFareMin.toLocaleString()} - ₹${cabFareMax.toLocaleString()}`,
      carbonTag: 'Private AC Sedan / SUV',
      stepGuide: `Direct highway drive via National Highway with doorstep pickup from your address in ${sourceName.split(',')[0]} straight to ${destName.split(',')[0]}.`,
      bookingButtons: [
        { label: 'Book on Uber Intercity', platform: 'uber', url: `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[formatted_address]=${encodedTo}`, color: 'bg-black hover:bg-slate-800 text-white' },
        { label: 'Book on MakeMyTrip Cabs', platform: 'makemytrip', url: 'https://www.makemytrip.com/cabs/', color: 'bg-rose-600 hover:bg-rose-500 text-white' }
      ]
    });

    // 4. Domestic Flight (if distance > 250 km)
    if (dist > 250) {
      const flightFareMin = Math.round(2800 + dist * 2.8);
      const flightFareMax = Math.round(4200 + dist * 4.5);

      options.push({
        id: 'opt-flight',
        title: 'Direct / Connecting Domestic Flight (IndiGo / Air India)',
        category: 'quickest',
        icon: '✈️',
        rankBadge: 'FASTEST AIR TRAVEL',
        rankColor: 'bg-indigo-600 text-white',
        time: '1h 10m flight time',
        distance: `${Math.round(dist * 0.8)} km (Air)`,
        fareRange: `₹${flightFareMin.toLocaleString()} - ₹${flightFareMax.toLocaleString()}`,
        carbonTag: 'Airport to Airport',
        stepGuide: `Direct domestic flight connecting regional commercial airports with fast check-in.`,
        bookingButtons: [
          { label: 'Search Flights on MakeMyTrip', platform: 'mmtflight', url: 'https://www.makemytrip.com/flights/', color: 'bg-blue-700 hover:bg-blue-600 text-white' },
          { label: 'Check on Skyscanner', platform: 'skyscanner', url: 'https://www.skyscanner.co.in/', color: 'bg-teal-600 hover:bg-teal-500 text-white' }
        ]
      });
    }

    return options;
  }

  // ==========================================
  // CASE 2: MEDIUM CITY DISTANCE (10 km - 80 km)
  // Example: Airport ➔ City Center, Fort ➔ City
  // ==========================================
  if (dist >= 10 && dist <= 80) {
    const cabTimeMins = Math.round(dist * 2.2);
    const cabFareMin = Math.round(dist * 16 + 80);
    const cabFareMax = Math.round(dist * 22 + 120);

    options.push({
      id: 'opt-cab-city',
      title: 'AC City Cab (Uber / Ola Cabs)',
      category: 'quickest',
      icon: '🚕',
      rankBadge: 'RECOMMENDED • FASTEST DOOR-TO-DOOR',
      rankColor: 'bg-amber-500 text-slate-950',
      time: `${cabTimeMins} mins`,
      distance: `${dist} km`,
      fareRange: `₹${cabFareMin} - ₹${cabFareMax}`,
      carbonTag: 'Air-Conditioned Comfort',
      stepGuide: `Direct cab booking with GPS tracking from ${sourceName} straight to ${destName}.`,
      bookingButtons: [
        { label: 'Book on Uber', platform: 'uber', url: `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[formatted_address]=${encodedTo}`, color: 'bg-black hover:bg-slate-800 text-white' },
        { label: 'Book on Ola Cabs', platform: 'ola', url: 'https://www.olacabs.com/', color: 'bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold' }
      ]
    });

    const autoTimeMins = Math.round(dist * 2.6);
    const autoFareMin = Math.round(dist * 12 + 40);
    const autoFareMax = Math.round(dist * 15 + 60);

    options.push({
      id: 'opt-auto-city',
      title: 'Auto-Rickshaw (Rapido / Local Stand)',
      category: 'quickest',
      icon: '🛺',
      rankBadge: 'POPULAR & QUICK',
      rankColor: 'bg-yellow-500 text-slate-950',
      time: `${autoTimeMins} mins`,
      distance: `${dist} km`,
      fareRange: `₹${autoFareMin} - ₹${autoFareMax}`,
      carbonTag: 'CNG / Electric Auto',
      stepGuide: `Available at all main auto stands or book on Rapido app.`,
      bookingButtons: [
        { label: 'Book on Rapido Auto', platform: 'rapido', url: 'https://rapido.bike/', color: 'bg-yellow-500 hover:bg-yellow-400 text-slate-950' },
        { label: 'Open Google Maps GPS', platform: 'googlemaps', url: `https://www.google.com/maps/dir/?api=1&origin=${encodedFrom}&destination=${encodedTo}`, color: 'bg-slate-900 hover:bg-slate-800 text-white' }
      ]
    });

    const busFare = Math.round(dist * 2.0 + 15);
    options.push({
      id: 'opt-bus-city',
      title: 'City Electric AC Bus',
      category: 'cheapest',
      icon: '🚌',
      rankBadge: 'CHEAPEST BUDGET TRANSIT',
      rankColor: 'bg-purple-600 text-white',
      time: `${Math.round(dist * 3.2)} mins`,
      distance: `${dist} km`,
      fareRange: `₹${busFare} - ₹${busFare + 15}`,
      carbonTag: 'Zero Emission E-Bus',
      stepGuide: `Board electric city bus with digital QR pass ticketing.`,
      bookingButtons: [
        { label: 'Book on RedBus / Chalo', platform: 'redbus', url: 'https://www.redbus.in/', color: 'bg-red-600 hover:bg-red-500 text-white' }
      ]
    });

    return options;
  }

  // ==========================================
  // CASE 3: LOCAL SHORT DISTANCE (< 10 km)
  // Example: Assi Ghat ➔ Kashi Vishwanath, Taj Mahal ➔ Agra Fort
  // ==========================================
  const erickshawTime = Math.round(dist * 4 + 4);
  const erickshawFareMin = Math.round(dist * 12 + 15);
  const erickshawFareMax = Math.round(dist * 15 + 25);

  options.push({
    id: 'opt-erickshaw-local',
    title: 'Green E-Rickshaw / Shared Auto',
    category: 'quickest',
    icon: '🛺',
    rankBadge: 'BEST FOR NARROW LANES & CHEAP',
    rankColor: 'bg-amber-500 text-slate-950',
    time: `${erickshawTime} mins`,
    distance: `${dist} km`,
    fareRange: `₹${erickshawFareMin} - ₹${erickshawFareMax}`,
    carbonTag: '100% Zero Emission',
    stepGuide: `Direct ride through heritage bazaars and alleyways. Board at nearest crossing stand.`,
    bookingButtons: [
      { label: 'Book on Rapido', platform: 'rapido', url: 'https://rapido.bike/', color: 'bg-yellow-500 hover:bg-yellow-400 text-slate-950' },
      { label: 'Find Nearby Stand', platform: 'googlemaps', url: `https://www.google.com/maps/dir/?api=1&origin=${encodedFrom}&destination=${encodedTo}`, color: 'bg-slate-900 hover:bg-slate-800 text-white' }
    ]
  });

  // Solar River Boat (if applicable near river or lake)
  if (sourceName.toLowerCase().includes('ghat') || destName.toLowerCase().includes('ghat') || sourceName.toLowerCase().includes('lake') || destName.toLowerCase().includes('lake')) {
    options.push({
      id: 'opt-boat-local',
      title: 'Ganga Solar Electric Ferry / Boat',
      category: 'scenic',
      icon: '🛥️',
      rankBadge: 'SCENIC CRUISE • ZERO TRAFFIC',
      rankColor: 'bg-emerald-600 text-white',
      time: `${Math.round(dist * 5 + 5)} mins`,
      distance: `${dist} km`,
      fareRange: `₹40 - ₹80`,
      carbonTag: '100% Solar Clean',
      stepGuide: `Board eco-solar ferry at river jetty. Skip all road jams and enjoy sacred temple & palace ghat views.`,
      bookingButtons: [
        { label: 'Book UP Tourism Solar Boat', platform: 'solarboat', url: 'https://uptourism.gov.in/', color: 'bg-emerald-600 hover:bg-emerald-500 text-white' }
      ]
    });
  }

  // City Cab
  options.push({
    id: 'opt-cab-local',
    title: 'AC Tourist Taxi (Uber / Ola)',
    category: 'quickest',
    icon: '🚕',
    rankBadge: 'DOOR-TO-DOOR AC COMFORT',
    rankColor: 'bg-blue-600 text-white',
    time: `${Math.round(dist * 3.5 + 4)} mins`,
    distance: `${dist} km`,
    fareRange: `₹80 - ₹150`,
    carbonTag: 'AC Sedan / Hatchback',
    stepGuide: `Direct air-conditioned pickup from your doorstep straight to the monument gate.`,
    bookingButtons: [
      { label: 'Book on Uber', platform: 'uber', url: `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[formatted_address]=${encodedTo}`, color: 'bg-black hover:bg-slate-800 text-white' },
      { label: 'Book on Ola Cabs', platform: 'ola', url: 'https://www.olacabs.com/', color: 'bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold' }
    ]
  });

  // Walking
  if (dist <= 4.0) {
    const walkTimeMins = Math.round(dist * 12);
    options.push({
      id: 'opt-walk-local',
      title: 'Heritage Walking Trail',
      category: 'scenic',
      icon: '🚶‍♂️',
      rankBadge: 'HEALTHY & CULTURAL',
      rankColor: 'bg-teal-600 text-white',
      time: `${walkTimeMins} mins`,
      distance: `${dist} km`,
      fareRange: 'Free (₹0)',
      carbonTag: `${Math.round(dist * 65)} kcal burned`,
      stepGuide: `Stroll through historic stone pathways, tea stalls, and souvenir shops with zero vehicle exhaust.`,
      bookingButtons: [
        { label: 'Start Walking GPS Navigation', platform: 'googlemaps', url: `https://www.google.com/maps/dir/?api=1&origin=${encodedFrom}&destination=${encodedTo}&travelmode=walking`, color: 'bg-teal-700 hover:bg-teal-600 text-white' }
      ]
    });
  }

  return options;
};
