import { resolveLocationCoords, calculateDistanceKm } from './routeCalculatorService';

// Rich Curated Nearby Sightseeing Itineraries for Indian Cities & Destinations
export const CITY_ATTRACTIONS_CATALOG = {
  'hyderabad': {
    name: 'Hyderabad (City of Pearls & Nizams), Telangana',
    flag: '🇮🇳',
    center: [17.3850, 78.4867],
    zoom: 13,
    tagline: 'Charminar, Historic Fortresses, Giant Buddha & Authentic Biryani',
    spots: [
      {
        id: 'hyd-1',
        title: 'Charminar & Laad Bazaar Pearl Market',
        category: 'Historic Monument & Bazaars',
        time: '08:30 AM',
        lat: 17.3616,
        lng: 78.4747,
        distanceKm: 0.0,
        travelTime: 'Starting Point',
        recommendedTransport: 'Walk / Metro (MGBS Station)',
        recommendedFare: 'Free / ₹20',
        transportIcon: '🚊',
        crowdLevel: 'Moderate (62%)',
        tips: 'Explore the 1591 monument arches and sample authentic Irani Chai & Osmania biscuits at Nimrah Cafe.',
        transitOptions: [
          { mode: 'metro', title: 'Hyderabad Metro (Green Line)', fare: '₹25', time: '12 mins', icon: '🚊', badge: 'Fast & AC', steps: 'Take metro to MGBS station, walk 800m through Old City arcade' },
          { mode: 'auto', title: 'Auto-Rickshaw / Rapido', fare: '₹40', time: '10 mins', icon: '🛺', badge: 'Direct Drop', steps: 'Direct drop at Charminar pedestrian plaza' }
        ]
      },
      {
        id: 'hyd-2',
        title: 'Salar Jung Royal Art & Antique Museum',
        category: 'National Art Museum',
        time: '11:00 AM',
        lat: 17.3713,
        lng: 78.4804,
        distanceKm: 1.8,
        travelTime: '8 mins ride',
        recommendedTransport: 'Auto-Rickshaw / E-Auto',
        recommendedFare: '₹35',
        transportIcon: '🛺',
        crowdLevel: 'Low (28%)',
        tips: 'See the famous 19th-century musical clock and Veiled Rebecca marble masterpiece.',
        transitOptions: [
          { mode: 'auto', title: 'Shared Auto / Rapido', fare: '₹30', time: '8 mins', icon: '🛺', badge: 'Recommended', steps: 'Drive straight along Musi Riverbank Road to Salar Jung Museum Gate' },
          { mode: 'bus', title: 'TSRTC City Bus (#2Z)', fare: '₹15', time: '12 mins', icon: '🚌', badge: 'Budget', steps: 'Board at Charminar Bus Stand to Salar Jung stop' }
        ]
      },
      {
        id: 'hyd-3',
        title: 'Hussain Sagar Lake & Giant Buddha Ferry Ride',
        category: 'Lakefront & Island Sanctuary',
        time: '02:30 PM',
        lat: 17.4239,
        lng: 78.4738,
        distanceKm: 6.4,
        travelTime: '18 mins ride',
        recommendedTransport: 'TSRTC AC Electric Bus / Cab',
        recommendedFare: '₹30 / ₹120',
        transportIcon: '🛥️',
        crowdLevel: 'Moderate (45%)',
        tips: 'Board Telangana Tourism speedboat to the monolithic 18-meter Buddha statue in the center of the lake.',
        transitOptions: [
          { mode: 'boat', title: 'Telangana Tourism Speedboat / Ferry', fare: '₹60', time: '10 mins', icon: '🛥️', badge: 'Lake Cruise', steps: 'Board boat at Lumbini Park Jetty directly to Rock Island Buddha Statue' },
          { mode: 'cab', title: 'Uber / Ola City Cab', fare: '₹120', time: '18 mins', icon: '🚕', badge: 'AC Comfort', steps: 'Direct drop at Tank Bund Lake Promenade' }
        ]
      },
      {
        id: 'hyd-4',
        title: 'Birla Mandir White Marble Hilltop Temple',
        category: 'Hilltop Marble Temple',
        time: '05:00 PM',
        lat: 17.4062,
        lng: 78.4691,
        distanceKm: 2.5,
        travelTime: '8 mins ride',
        recommendedTransport: 'Auto-Rickshaw / Short Walk',
        recommendedFare: '₹30',
        transportIcon: '🛺',
        crowdLevel: 'Moderate (54%)',
        tips: 'Enjoy panoramic sunset views of the Hyderabad skyline and Hussain Sagar from the quiet hilltop.',
        transitOptions: [
          { mode: 'auto', title: 'Hill Auto-Rickshaw', fare: '₹35', time: '8 mins', icon: '🛺', badge: 'Quick Ride', steps: 'Direct uphill drop at Birla Mandir entrance arch' }
        ]
      },
      {
        id: 'hyd-5',
        title: 'Golconda Fort Magnificent Light & Sound Show',
        category: 'Medieval Acoustic Fortress',
        time: '06:45 PM',
        lat: 17.3833,
        lng: 78.4011,
        distanceKm: 9.8,
        travelTime: '22 mins drive',
        recommendedTransport: 'AC Tourist Cab / Metro Shuttle',
        recommendedFare: '₹180',
        transportIcon: '🚕',
        crowdLevel: 'High (80%)',
        tips: 'Experience acoustic clapping reverberation at Fateh Darwaza and the evening dramatic laser illumination.',
        transitOptions: [
          { mode: 'cab', title: 'Uber / Ola Cab', fare: '₹180', time: '22 mins', icon: '🚕', badge: 'Recommended', steps: 'Via Mehdipatnam Flyover directly to Fort entrance' },
          { mode: 'bus', title: 'TSRTC Bus (#65G)', fare: '₹25', time: '35 mins', icon: '🚌', badge: 'Eco Bus', steps: 'Direct service from Lakdikapool to Golconda Gate' }
        ]
      }
    ]
  },

  'vijayawada': {
    name: 'Vijayawada (City of Victory & Sacred River), Andhra Pradesh',
    flag: '🇮🇳',
    center: [16.5062, 80.6480],
    zoom: 13,
    tagline: 'Kanaka Durga Hilltop Shrine, Krishna River Barrage & Rock-Cut Caves',
    spots: [
      {
        id: 'vja-1',
        title: 'Sri Kanaka Durga Temple (Indrakeeladri Hilltop)',
        category: 'Sacred Hilltop Shrine',
        time: '07:00 AM',
        lat: 16.5161,
        lng: 80.6083,
        distanceKm: 0.0,
        travelTime: 'Starting Point',
        recommendedTransport: 'Temple Ghat Road Shuttle / Steps',
        recommendedFare: '₹20 / Free',
        transportIcon: '🛺',
        crowdLevel: 'High (78%)',
        tips: 'Perched on Indrakeeladri hill with magnificent views of the Krishna river. Free darshan queues available.',
        transitOptions: [
          { mode: 'shuttle', title: 'Temple Trust AC Eco-Shuttle', fare: '₹20', time: '6 mins', icon: '🚌', badge: 'Hill Shuttle', steps: 'Board at foothill bus stand directly to main temple gopuram' },
          { mode: 'auto', title: 'Ghat Road Auto / Rapido', fare: '₹40', time: '8 mins', icon: '🛺', badge: 'Direct Auto', steps: 'Direct drop at Kanaka Durga Temple Arch' }
        ]
      },
      {
        id: 'vja-2',
        title: 'Prakasam Barrage & Krishna Riverfront Walkway',
        category: 'Engineering Marvel & Riverfront',
        time: '09:30 AM',
        lat: 16.5085,
        lng: 80.6067,
        distanceKm: 1.2,
        travelTime: '5 mins ride',
        recommendedTransport: 'Short Auto Ride / Scenic Walk',
        recommendedFare: 'Free / ₹25',
        transportIcon: '🚶‍♂️',
        crowdLevel: 'Low (30%)',
        tips: '1.2 km long panoramic bridge connecting Krishna and Guntur districts with stunning water reflections.',
        transitOptions: [
          { mode: 'walk', title: 'Riverfront Paved Walk', fare: 'Free', time: '12 mins', icon: '🚶‍♂️', badge: 'Scenic Walk', steps: 'Descend Indrakeeladri hill straight onto Prakasam Barrage road' },
          { mode: 'auto', title: 'City Auto-Rickshaw', fare: '₹25', time: '4 mins', icon: '🛺', badge: 'Quick', steps: 'Drop at barrage park viewing point' }
        ]
      },
      {
        id: 'vja-3',
        title: 'Undavalli Monolithic Rock-Cut Cave Temples',
        category: '4th Century Sandstone Heritage',
        time: '11:30 AM',
        lat: 16.4965,
        lng: 80.5824,
        distanceKm: 4.8,
        travelTime: '12 mins ride',
        recommendedTransport: 'APSRTC City Electric Bus / Auto',
        recommendedFare: '₹20 / ₹60',
        transportIcon: '🚌',
        crowdLevel: 'Low (22%)',
        tips: 'Marvel at the 4-story rock-cut cave containing a massive 5-meter reclining statue of Lord Vishnu.',
        transitOptions: [
          { mode: 'auto', title: 'Auto-Rickshaw / Rapido', fare: '₹60', time: '12 mins', icon: '🛺', badge: 'Recommended', steps: 'Cross Krishna river to Undavalli Village cave entrance' },
          { mode: 'bus', title: 'APSRTC Bus (#33K)', fare: '₹20', time: '18 mins', icon: '🚌', badge: 'Budget', steps: 'Board at City Terminal to Undavalli stop' }
        ]
      },
      {
        id: 'vja-4',
        title: 'Bhavani Island River Resort & Water Sports',
        category: 'Eco-Tourism River Island',
        time: '03:00 PM',
        lat: 16.5188,
        lng: 80.5772,
        distanceKm: 3.5,
        travelTime: '10 mins ferry',
        recommendedTransport: 'APTDC River Ferry Boat',
        recommendedFare: '₹50',
        transportIcon: '🛥️',
        crowdLevel: 'Moderate (48%)',
        tips: '133-acre natural island in the middle of Krishna River. Enjoy speed boating, zorbing, and treehouse views.',
        transitOptions: [
          { mode: 'boat', title: 'APTDC Eco-Ferry Boat', fare: '₹50', time: '8 mins', icon: '🛥️', badge: 'River Ferry', steps: 'Board regular motorboat at Punnami Ghat Jetty across to the island resort' }
        ]
      },
      {
        id: 'vja-5',
        title: 'Victoria Jubilee (Bapu) Cultural Museum',
        category: 'Archaeological Sculpture Museum',
        time: '06:00 PM',
        lat: 16.5083,
        lng: 80.6317,
        distanceKm: 6.2,
        travelTime: '15 mins drive',
        recommendedTransport: 'City Cab / Auto',
        recommendedFare: '₹80',
        transportIcon: '🚕',
        crowdLevel: 'Low (20%)',
        tips: 'Houses centuries-old Buddhist sculptures, bronze idols, and historical artifacts of Amaravati kingdom.',
        transitOptions: [
          { mode: 'cab', title: 'Uber / Ola Cab', fare: '₹100', time: '14 mins', icon: '🚕', badge: 'AC Comfort', steps: 'Direct drop on MG Road near Museum' }
        ]
      }
    ]
  }
};

// Discover attractions for ANY place in India (Curated or Dynamic Fallback)
export const discoverNearbyAttractions = async (placeQuery) => {
  const query = (placeQuery || 'Varanasi').toLowerCase().trim();

  // 1. Check curated city catalog
  for (const [key, data] of Object.entries(CITY_ATTRACTIONS_CATALOG)) {
    if (query.includes(key) || key.includes(query)) {
      return data;
    }
  }

  // 2. Resolve coordinates of user's entered place
  const resolved = await resolveLocationCoords(placeQuery, {
    name: placeQuery,
    lat: 25.3176,
    lng: 83.0062
  });

  const baseLat = resolved.lat;
  const baseLng = resolved.lng;
  const placeTitle = resolved.name.split(',')[0];

  // 3. Dynamically generate 5 realistic nearby sightseeing spots for this place
  return {
    name: `${placeTitle}, India`,
    flag: '🇮🇳',
    center: [baseLat, baseLng],
    zoom: 14,
    tagline: `Top Sightseeing Attractions, Sacred Temples & Transit Routes in ${placeTitle}`,
    spots: [
      {
        id: 'gen-1',
        title: `${placeTitle} Historic City Center & Main Bazaar`,
        category: 'Heritage City Core',
        time: '08:30 AM',
        lat: baseLat + 0.003,
        lng: baseLng + 0.003,
        distanceKm: 0.0,
        travelTime: 'Starting Point',
        recommendedTransport: 'Walk / Local Transit',
        recommendedFare: 'Free / ₹20',
        transportIcon: '📍',
        crowdLevel: 'Moderate (55%)',
        tips: `Start your morning exploration in the historic heart of ${placeTitle} with local breakfast and tea stalls.`,
        transitOptions: [
          { mode: 'auto', title: 'Local Auto-Rickshaw / E-Rickshaw', fare: '₹25', time: '5 mins', icon: '🛺', badge: 'Quick', steps: `Board at central stand in ${placeTitle}` }
        ]
      },
      {
        id: 'gen-2',
        title: `${placeTitle} Historic Temple & Heritage Shrine`,
        category: 'Sacred Temple Sanctuary',
        time: '10:30 AM',
        lat: baseLat + 0.012,
        lng: baseLng + 0.008,
        distanceKm: 1.8,
        travelTime: '8 mins ride',
        recommendedTransport: 'Green Auto / E-Rickshaw',
        recommendedFare: '₹35',
        transportIcon: '🛺',
        crowdLevel: 'Moderate (60%)',
        tips: 'Famous ancient temple known for spiritual rituals and architectural gopuram.',
        transitOptions: [
          { mode: 'auto', title: 'Auto / Rapido', fare: '₹35', time: '8 mins', icon: '🛺', badge: 'Recommended', steps: 'Direct road route via Main Temple Highway' }
        ]
      },
      {
        id: 'gen-3',
        title: `${placeTitle} Botanical Gardens & Lake Promenade`,
        category: 'Lakefront & Nature Park',
        time: '01:30 PM',
        lat: baseLat - 0.015,
        lng: baseLng + 0.012,
        distanceKm: 3.4,
        travelTime: '12 mins ride',
        recommendedTransport: 'City Bus / AC Auto',
        recommendedFare: '₹20 / ₹50',
        transportIcon: '🚌',
        crowdLevel: 'Low (25%)',
        tips: 'Shaded eco-park and lake promenade perfect for afternoon relaxation and photography.',
        transitOptions: [
          { mode: 'bus', title: 'State City Bus', fare: '₹20', time: '15 mins', icon: '🚌', badge: 'Budget', steps: 'Board at City Circle to Garden stop' }
        ]
      },
      {
        id: 'gen-4',
        title: `${placeTitle} Royal Fort & Cultural Museum`,
        category: 'Historic Fortress & Museum',
        time: '04:30 PM',
        lat: baseLat + 0.024,
        lng: baseLng - 0.016,
        distanceKm: 5.1,
        travelTime: '16 mins drive',
        recommendedTransport: 'Tourist Cab (Uber / Ola)',
        recommendedFare: '₹120',
        transportIcon: '🚕',
        crowdLevel: 'Moderate (48%)',
        tips: 'Explore ancient ramparts, royal armory galleries, and panoramic city vistas.',
        transitOptions: [
          { mode: 'cab', title: 'Uber / Ola Cab', fare: '₹120', time: '16 mins', icon: '🚕', badge: 'AC Comfort', steps: 'Direct drop at Fort ticket gate' }
        ]
      },
      {
        id: 'gen-5',
        title: `${placeTitle} Evening Cultural Plaza & Street Delicacies`,
        category: 'Culinary & Sunset Plaza',
        time: '07:00 PM',
        lat: baseLat + 0.008,
        lng: baseLng - 0.005,
        distanceKm: 2.2,
        travelTime: '8 mins ride',
        recommendedTransport: 'Walking / E-Auto',
        recommendedFare: 'Free / ₹30',
        transportIcon: '🚶‍♂️',
        crowdLevel: 'High (75%)',
        tips: 'Sample authentic regional street specialties and sweets in the evening illuminated food street.',
        transitOptions: [
          { mode: 'walk', title: 'Evening Walkway', fare: 'Free', time: '18 mins', icon: '🚶‍♂️', badge: 'Best Vibe', steps: 'Stroll through the pedestrian food market' }
        ]
      }
    ]
  };
};
