export const DESTINATIONS = [
  {
    id: 'varanasi',
    name: 'Varanasi Sacred Ghats & Heritage Corridor',
    country: 'India',
    flag: '🇮🇳',
    center: [25.3176, 83.0062],
    zoom: 14,
    tagline: 'Timeless Spiritual Ghats, Kashi Vishwanath & Ganga Aarti',
    heroImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=1200&auto=format&fit=crop',
    weather: { temp: '28°C', condition: 'Pleasant & Hazy Sun', humidity: '52%', aqi: '32 (Good)' },
    stats: { totalVisitorsToday: 68400, capacityUtilization: 78, ecoPointsEarned: 24800 },
    zones: [
      {
        id: 'vz1',
        name: 'Dashashwamedh Ghat (Ganga Aarti)',
        lat: 25.3072,
        lng: 83.0104,
        capacity: 6500,
        currentVisitors: 6150,
        densityPercent: 95,
        status: 'overcrowded',
        waitTime: '50 mins',
        category: 'Sacred Ghat & Aarti',
        ecoRewardTokens: 0,
        description: 'World-famous main ghat where the majestic multi-tiered brass lamp Maha Aarti is performed every evening.'
      },
      {
        id: 'vz2',
        name: 'Kashi Vishwanath Temple Corridor',
        lat: 25.3109,
        lng: 83.0107,
        capacity: 5000,
        currentVisitors: 4100,
        densityPercent: 82,
        status: 'heavy',
        waitTime: '35 mins',
        category: 'Jyotirlinga Temple',
        ecoRewardTokens: 10,
        description: 'One of the twelve sacred Jyotirlingas, featuring a magnificent riverfront stone corridor connecting directly to the Ganga.'
      },
      {
        id: 'vz3',
        name: 'Assi Ghat Cultural Plaza',
        lat: 25.2917,
        lng: 83.0039,
        capacity: 4000,
        currentVisitors: 2100,
        densityPercent: 52,
        status: 'optimal',
        waitTime: '10 mins',
        category: 'Cultural Ghat',
        ecoRewardTokens: 25,
        description: 'Southernmost ghat famous for Subah-e-Banaras morning classical music, yoga, and fresh clay-cup chai.'
      },
      {
        id: 'vz4',
        name: 'Sarnath Dhamek Stupa & Deer Park',
        lat: 25.3811,
        lng: 83.0214,
        capacity: 3000,
        currentVisitors: 620,
        densityPercent: 21,
        status: 'recommended',
        waitTime: '0 mins',
        category: 'UNESCO Buddhist Sanctuary',
        ecoRewardTokens: 50,
        description: 'Serene monument where Lord Buddha delivered his first sermon. Lush green gardens and ancient Ashoka Pillar.'
      },
      {
        id: 'vz5',
        name: 'Chet Singh Ghat Historic Fort Promenade',
        lat: 25.2989,
        lng: 83.0069,
        capacity: 2500,
        currentVisitors: 510,
        densityPercent: 20,
        status: 'recommended',
        waitTime: '0 mins',
        category: 'Fortified Ghat',
        ecoRewardTokens: 45,
        description: 'Historic 18th-century fortified stone palace built by Maharaja Chet Singh with peaceful panoramic river vistas.'
      }
    ],
    roadmap: [
      {
        id: 'vm1',
        title: 'Assi Ghat Subah-e-Banaras & Sunrise',
        fromLocation: 'Origin: Hotel / Varanasi Cantt Station',
        toLocation: 'Assi Ghat Cultural Plaza',
        time: '05:45 AM',
        status: 'completed',
        duration: '1h 30m',
        lat: 25.2917,
        lng: 83.0039,
        distanceKm: 0.0,
        travelTime: 'Starting Point',
        recommendedTransport: 'Walk / Early E-Rickshaw',
        recommendedFare: 'Free / ₹20',
        transportIcon: '🚶‍♂️',
        transitOptions: [
          { mode: 'walk', title: 'Heritage Walk', fare: 'Free', time: '10 mins', icon: '🚶‍♂️', badge: 'Morning Air', steps: 'Walk through shaded Assi River lane directly to the Ghat steps' },
          { mode: 'erickshaw', title: 'Green E-Rickshaw', fare: '₹20', time: '5 mins', icon: '🛺', badge: 'Quick Ride', steps: 'Board e-rickshaw to Assi Police Booth' }
        ],
        directionsGuide: 'Start at Assi Ghat. Enjoy the Vedic chants & live Shehnai music during Subah-e-Banaras with fresh Kulhad Chai.',
        tips: 'Witness golden dawn mist reflecting on the Ganga with live morning Shehnai recital.'
      },
      {
        id: 'vm2',
        title: 'Kashi Vishwanath Corridor Darshan',
        fromLocation: 'Assi Ghat Cultural Plaza',
        toLocation: 'Kashi Vishwanath Corridor (Gate #4)',
        time: '08:30 AM',
        status: 'in-progress',
        duration: '1h 15m',
        lat: 25.3109,
        lng: 83.0107,
        distanceKm: 2.3,
        travelTime: '12 mins ride',
        recommendedTransport: 'Green E-Rickshaw (UP-65)',
        recommendedFare: '₹30',
        transportIcon: '🛺',
        transitOptions: [
          { mode: 'erickshaw', title: 'Green E-Rickshaw', fare: '₹30', time: '12 mins', icon: '🛺', badge: 'Recommended', steps: 'Take Green E-Rickshaw from Assi Chowk to Godowlia Crossing, walk 150m into Gate 4' },
          { mode: 'boat', title: 'Ganga Solar Electric Ferry', fare: '₹50', time: '15 mins', icon: '🛥️', badge: 'Scenic & Zero Traffic', steps: 'Board solar boat at Assi Jetty ➔ Cruise past 14 ghats ➔ Disembark at Lalita Ghat Corridor Ramp' },
          { mode: 'walk', title: 'Riverfront Paved Trail', fare: 'Free', time: '28 mins', icon: '🚶‍♂️', badge: 'Heritage Walk', steps: 'Walk north along the river promenade passing Harishchandra Ghat' },
          { mode: 'taxi', title: 'Tourist Auto / Cab', fare: '₹100', time: '15 mins', icon: '🚕', badge: 'Direct Road', steps: 'Via Sonarpura Main Road to Godowlia Gate' }
        ],
        directionsGuide: 'From Assi Ghat ➔ Walk 50m north to Assi Chowk ➔ Board Green E-Rickshaw to Godowlia Gate (1.8 km) ➔ Walk 150m into Kashi Vishwanath Gate #4.',
        tips: 'Use pre-booked RFID FastPass at Gate #4 to bypass long queues. Free mobile locker available.'
      },
      {
        id: 'vm3',
        title: 'Banarasi Breakfast & Thandai at Godowlia',
        fromLocation: 'Kashi Vishwanath Gate #4',
        toLocation: 'Godowlia Chowk Food Bazaar',
        time: '11:45 AM',
        status: 'upcoming',
        duration: '1 hour',
        lat: 25.3115,
        lng: 83.0045,
        distanceKm: 0.8,
        travelTime: '6 mins walk',
        recommendedTransport: 'Short Heritage Walk',
        recommendedFare: 'Free',
        transportIcon: '🚶‍♂️',
        transitOptions: [
          { mode: 'walk', title: 'Alleyway Walk', fare: 'Free', time: '6 mins', icon: '🚶‍♂️', badge: 'Fastest', steps: 'Walk straight through Vishwanath Gali lined with brass souvenir & sweet shops' },
          { mode: 'cycle', title: 'Cycle Rickshaw', fare: '₹15', time: '4 mins', icon: '🚲', badge: 'Easy Ride', steps: 'Hop on a traditional cycle rickshaw through the pedestrian zone' }
        ],
        directionsGuide: 'Exit temple Gate 4 ➔ Stroll through Vishwanath Gali market ➔ Arrive at Godowlia Chowk for hot Kachori-Jalebi & clay pot Thandai.',
        tips: 'Sample authentic Banarasi Kachori, spicy Baati Chokha, and saffron pistachio Thandai (+30 Eco-Points).'
      },
      {
        id: 'vm4',
        title: 'Sarnath Dhamek Stupa Sanctuary',
        fromLocation: 'Godowlia Chowk Food Bazaar',
        toLocation: 'Sarnath UNESCO Deer Park',
        time: '02:00 PM',
        status: 'upcoming',
        duration: '2 hours',
        lat: 25.3811,
        lng: 83.0214,
        distanceKm: 9.8,
        travelTime: '22 mins drive',
        recommendedTransport: 'Green Electric Bus / AC Auto',
        recommendedFare: '₹25 / ₹150',
        transportIcon: '🚌',
        transitOptions: [
          { mode: 'bus', title: 'Green Electric Heritage Bus (#E-07)', fare: '₹25', time: '25 mins', icon: '🚌', badge: 'Eco-Friendly', steps: 'Board AC E-Bus #E-07 at Godowlia Stand directly to Sarnath Museum Gate' },
          { mode: 'taxi', title: 'Prepaid Auto / Uber Auto', fare: '₹150', time: '20 mins', icon: '🛺', badge: 'Fastest Direct', steps: 'Direct highway route via Ring Road to Sarnath Stupa' },
          { mode: 'cab', title: 'AC Tourist Cab', fare: '₹350', time: '18 mins', icon: '🚕', badge: 'Comfort', steps: 'AC Cab with return waiting' }
        ],
        directionsGuide: 'From Godowlia Chowk ➔ Board Green E-Bus #E-07 at Stand ➔ 22 mins highway cruise to Sarnath ➔ Walk into peaceful Deer Park gardens.',
        tips: 'Eco-diverted peaceful zone away from midday ghat congestion (+50 Eco-Points awarded).'
      },
      {
        id: 'vm5',
        title: 'Dashashwamedh Ghat Reserved Solar Boat Aarti',
        fromLocation: 'Sarnath UNESCO Deer Park',
        toLocation: 'Dashashwamedh Ghat Aarti Jetty',
        time: '06:15 PM',
        status: 'upcoming',
        duration: '1h 30m',
        lat: 25.3072,
        lng: 83.0104,
        distanceKm: 10.2,
        travelTime: '25 mins ride',
        recommendedTransport: 'Solar Electric Boat from River Jetty',
        recommendedFare: '₹60',
        transportIcon: '🛥️',
        transitOptions: [
          { mode: 'boat', title: 'Solar Electric VIP Boat', fare: '₹60', time: '15 mins', icon: '🛥️', badge: 'Best View of Aarti', steps: 'Board reserved Eco-Solar Boat at Rajghat Jetty and float directly in front of the Aarti stage' },
          { mode: 'erickshaw', title: 'Express E-Rickshaw', fare: '₹40', time: '25 mins', icon: '🛺', badge: 'Direct Road', steps: 'Take Sarnath-Godowlia express corridor, walk 200m down to river steps' }
        ],
        directionsGuide: 'Return from Sarnath ➔ Board reserved Eco-Solar Boat at Jetty ➔ Watch the 7-priest Maha Ganga Aarti comfortably from the river.',
        tips: 'Board the pre-assigned eco-solar boat to enjoy the Grand Aarti from the river without ghat overcrowding.'
      }
    ]
  },
  {
    id: 'jaipur',
    name: 'Jaipur Pink City & Royal Forts Corridor',
    country: 'India',
    flag: '🇮🇳',
    center: [26.9124, 75.7873],
    zoom: 14,
    tagline: 'Amber Fort, Hawa Mahal & UNESCO Stepwells',
    heroImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1200&auto=format&fit=crop',
    weather: { temp: '31°C', condition: 'Sunny & Warm', humidity: '38%', aqi: '42 (Moderate)' },
    stats: { totalVisitorsToday: 58900, capacityUtilization: 84, ecoPointsEarned: 21500 },
    zones: [
      {
        id: 'jz1',
        name: 'Hawa Mahal Palace of Winds',
        lat: 26.9239,
        lng: 75.8267,
        capacity: 4500,
        currentVisitors: 4250,
        densityPercent: 94,
        status: 'overcrowded',
        waitTime: '40 mins',
        category: 'Royal Palace',
        ecoRewardTokens: 0,
        description: 'Iconic five-story pink sandstone honeycomb palace with 953 intricately carved jharokhas.'
      },
      {
        id: 'jz2',
        name: 'Amber Fort & Maota Lake',
        lat: 26.9855,
        lng: 75.8513,
        capacity: 6000,
        currentVisitors: 5280,
        densityPercent: 88,
        status: 'overcrowded',
        waitTime: '55 mins',
        category: 'UNESCO Hilltop Fort',
        ecoRewardTokens: 5,
        description: 'Majestic 16th-century fort overlooking Maota Lake, famous for the shimmering Sheesh Mahal.'
      },
      {
        id: 'jz3',
        name: 'City Palace & Jantar Mantar Observatory',
        lat: 26.9258,
        lng: 75.8237,
        capacity: 3500,
        currentVisitors: 2050,
        densityPercent: 58,
        status: 'optimal',
        waitTime: '15 mins',
        category: 'Royal Complex & UNESCO',
        ecoRewardTokens: 20,
        description: 'Royal residence of the Maharaja of Jaipur alongside the world’s largest stone sundial.'
      },
      {
        id: 'jz4',
        name: 'Panna Meena Ka Kund Stepwell',
        lat: 26.9877,
        lng: 75.8569,
        capacity: 2000,
        currentVisitors: 380,
        densityPercent: 19,
        status: 'recommended',
        waitTime: '0 mins',
        category: 'Ancient Stepwell & Oasis',
        ecoRewardTokens: 45,
        description: 'Mesmerizing geometric 16th-century stepwell with symmetrical criss-cross stone staircases.'
      },
      {
        id: 'jz5',
        name: 'Nahargarh Fort Sunset Ridge',
        lat: 26.9374,
        lng: 75.8155,
        capacity: 3000,
        currentVisitors: 710,
        densityPercent: 24,
        status: 'recommended',
        waitTime: '0 mins',
        category: 'Ridge Fortress & Panoramic Vista',
        ecoRewardTokens: 40,
        description: 'Standing on the edge of the Aravalli Hills, providing breathtaking golden sunset views over the Pink City.'
      }
    ],
    roadmap: [
      {
        id: 'jm1',
        title: 'Sireh Deori Bazaar & Hawa Mahal View',
        fromLocation: 'Origin: Jaipur Junction / Hotel',
        toLocation: 'Hawa Mahal Palace Plaza',
        time: '08:30 AM',
        status: 'completed',
        duration: '45 min',
        lat: 26.9239,
        lng: 75.8267,
        distanceKm: 0.0,
        travelTime: 'Starting Point',
        recommendedTransport: 'Jaipur Metro / E-Rickshaw',
        recommendedFare: '₹20',
        transportIcon: '🚊',
        transitOptions: [
          { mode: 'metro', title: 'Jaipur Pink Metro', fare: '₹20', time: '10 mins', icon: '🚊', badge: 'AC & Fast', steps: 'Take Metro to Badi Chaupar Station (Exit Gate 2 opens right in front of Hawa Mahal)' },
          { mode: 'erickshaw', title: 'Pink City E-Rickshaw', fare: '₹30', time: '12 mins', icon: '🛺', badge: 'Heritage View', steps: 'Ride through the historic rose-pink arched gates of the Walled City' }
        ],
        directionsGuide: 'Arrive at Badi Chaupar ➔ Walk 50m to Hawa Mahal facade ➔ Capture morning light reflecting on 953 jharokha windows.',
        tips: 'Capture pristine sunlight illuminating the pink honeycomb facade from the rooftop cafes opposite.'
      },
      {
        id: 'jm2',
        title: 'Amber Fort & Sheesh Mahal Tour',
        fromLocation: 'Hawa Mahal Palace Plaza',
        toLocation: 'Amber Fort Hilltop Gate (Suraj Pol)',
        time: '10:30 AM',
        status: 'in-progress',
        duration: '2 hours',
        lat: 26.9855,
        lng: 75.8513,
        distanceKm: 11.2,
        travelTime: '20 mins drive',
        recommendedTransport: 'AC Low-Floor Tourist Bus (#29)',
        recommendedFare: '₹30 / ₹150',
        transportIcon: '🚌',
        transitOptions: [
          { mode: 'bus', title: 'AC Low-Floor Bus #29', fare: '₹30', time: '22 mins', icon: '🚌', badge: 'Recommended', steps: 'Board Bus #29 at Hawa Mahal Stand directly to Amber Fort Foothills' },
          { mode: 'taxi', title: 'Tourist Auto / Cab', fare: '₹180', time: '18 mins', icon: '🚕', badge: 'Direct Hilltop', steps: 'Scenic drive past Jal Mahal Lake up to Suraj Pol Gate' },
          { mode: 'jeep', title: 'Electric 4x4 Hill Shuttle', fare: '₹50', time: '6 mins', icon: '🚙', badge: 'Uphill Shuttle', steps: 'Eco-friendly electric shuttle from parking lot up the fort ramp' }
        ],
        directionsGuide: 'From Hawa Mahal ➔ Drive north along Amer Road past Jal Mahal (Water Palace) ➔ Ascend through Suraj Pol Gate into Amber Fort.',
        tips: 'Use FastPass to enter Sheesh Mahal where convex mirrors create a star-filled ceiling effect.'
      },
      {
        id: 'jm3',
        title: 'Panna Meena Stepwell Photography',
        fromLocation: 'Amber Fort Suraj Pol Gate',
        toLocation: 'Panna Meena Ka Kund Stepwell',
        time: '01:00 PM',
        status: 'upcoming',
        duration: '45 min',
        lat: 26.9877,
        lng: 75.8569,
        distanceKm: 1.1,
        travelTime: '5 mins walk / E-Cart',
        recommendedTransport: 'Short Downhill Walk',
        recommendedFare: 'Free',
        transportIcon: '🚶‍♂️',
        transitOptions: [
          { mode: 'walk', title: 'Stone Alley Walk', fare: 'Free', time: '8 mins', icon: '🚶‍♂️', badge: 'Scenic & Shaded', steps: 'Walk down behind Amber Fort through the historic village of Amer' },
          { mode: 'erickshaw', title: 'Amer Heritage E-Cart', fare: '₹20', time: '3 mins', icon: '🛺', badge: 'Quick', steps: 'Direct drop at the stepwell entrance' }
        ],
        directionsGuide: 'Exit Amber Fort rear gate ➔ Stroll 800m through ancient Amer village ➔ Marvel at the 16th-century criss-cross stone stairways.',
        tips: 'Smart eco-diverted stop bypassing congested main ticket lines (+45 Eco-Points).'
      },
      {
        id: 'jm4',
        title: 'Nahargarh Fort Royal Sunset Panorama',
        fromLocation: 'Panna Meena Ka Kund',
        toLocation: 'Nahargarh Fort Sunset Ridge',
        time: '04:30 PM',
        status: 'upcoming',
        duration: '2 hours',
        lat: 26.9374,
        lng: 75.8155,
        distanceKm: 14.5,
        travelTime: '25 mins drive',
        recommendedTransport: 'Aravalli Hill Cab / Auto',
        recommendedFare: '₹200',
        transportIcon: '🚕',
        transitOptions: [
          { mode: 'taxi', title: 'Aravalli Hill Taxi', fare: '₹200', time: '25 mins', icon: '🚕', badge: 'Scenic Ridge Drive', steps: 'Winding mountain road climb with panoramic viewpoints across the valley' },
          { mode: 'auto', title: 'Hill Auto-Rickshaw', fare: '₹120', time: '28 mins', icon: '🛺', badge: 'Budget Option', steps: 'Direct hill ride to Nahargarh Padao sunset terrace' }
        ],
        directionsGuide: 'Drive up the winding mountain pass of the Aravalli Hills ➔ Reach Nahargarh Fort ramparts for 360-degree sunset over Jaipur.',
        tips: 'Perched on the Aravalli ridge; enjoy panoramic skyline views as the Pink City lights up.'
      }
    ]
  },
  {
    id: 'agra',
    name: 'Agra Taj Mahal & Mughal Heritage Corridor',
    country: 'India',
    flag: '🇮🇳',
    center: [27.1751, 78.0421],
    zoom: 14,
    tagline: 'Taj Mahal Monument of Love, Agra Fort & Mehtab Bagh',
    heroImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1200&auto=format&fit=crop',
    weather: { temp: '30°C', condition: 'Sunny & Clear', humidity: '44%', aqi: '36 (Good)' },
    stats: { totalVisitorsToday: 74200, capacityUtilization: 86, ecoPointsEarned: 28400 },
    zones: [
      { id: 'az1', name: 'Taj Mahal Main Complex', lat: 27.1751, lng: 78.0421, capacity: 8000, currentVisitors: 7700, densityPercent: 96, status: 'overcrowded', waitTime: '65 mins', category: 'Wonder of the World', ecoRewardTokens: 0, description: 'World Wonder built of translucent white Makrana marble.' },
      { id: 'az2', name: 'Agra Fort Diwan-i-Khas', lat: 27.1795, lng: 78.0211, capacity: 5000, currentVisitors: 3800, densityPercent: 76, status: 'heavy', waitTime: '30 mins', category: 'Mughal Fortress', ecoRewardTokens: 10, description: 'Massive red sandstone imperial city housing the Jahangiri Mahal.' },
      { id: 'az3', name: 'Mehtab Bagh Moonlight Riverfront Garden', lat: 27.1800, lng: 78.0422, capacity: 3000, currentVisitors: 650, densityPercent: 22, status: 'recommended', waitTime: '0 mins', category: 'Charbagh Riverfront Garden', ecoRewardTokens: 50, description: 'Tranquil charbagh garden across the Yamuna River offering iconic Taj reflection views.' }
    ],
    roadmap: [
      {
        id: 'am1',
        title: 'Taj Mahal Sunrise Gate Entry',
        fromLocation: 'Origin: Agra Cantt Station / Hotel',
        toLocation: 'Taj Mahal East Gate VIP Plaza',
        time: '06:00 AM',
        status: 'completed',
        duration: '2 hours',
        lat: 27.1751,
        lng: 78.0421,
        distanceKm: 0.0,
        travelTime: 'Starting Point',
        recommendedTransport: 'Zero-Emission Golf Cart',
        recommendedFare: '₹20',
        transportIcon: '🛺',
        transitOptions: [
          { mode: 'golfcart', title: 'Pollution-Free Battery Golf Cart', fare: '₹20', time: '5 mins', icon: '🛺', badge: 'Mandatory in Eco-Zone', steps: 'Board government electric cart at Shilpgram Parking directly to East Gate' },
          { mode: 'walk', title: 'Green Walkway', fare: 'Free', time: '10 mins', icon: '🚶‍♂️', badge: 'Tree-Lined Trail', steps: 'Paved clean pathway with zero vehicle noise' }
        ],
        directionsGuide: 'Arrive at Shilpgram East Gate parking ➔ Take battery golf cart to security checkpoint ➔ Enter monument at sunrise.',
        tips: 'Arrive at East Gate before dawn to see the white marble blush soft pink in morning rays.'
      },
      {
        id: 'am2',
        title: 'Agra Fort Imperial Palaces Tour',
        fromLocation: 'Taj Mahal East Gate',
        toLocation: 'Agra Fort Amar Singh Gate',
        time: '09:30 AM',
        status: 'in-progress',
        duration: '1h 45m',
        lat: 27.1795,
        lng: 78.0211,
        distanceKm: 2.8,
        travelTime: '10 mins ride',
        recommendedTransport: 'Green Electric Auto',
        recommendedFare: '₹35',
        transportIcon: '🛺',
        transitOptions: [
          { mode: 'erickshaw', title: 'Green E-Auto', fare: '₹35', time: '10 mins', icon: '🛺', badge: 'Recommended', steps: 'Board E-Auto at Taj East gate stand, straight drive via Taj Road' },
          { mode: 'taxi', title: 'Prepaid AC Taxi', fare: '₹120', time: '8 mins', icon: '🚕', badge: 'AC Comfort', steps: 'Direct drop at Amar Singh Gate' }
        ],
        directionsGuide: 'From Taj East Gate ➔ 10 mins E-Auto ride along tree-lined Taj Road ➔ Enter the monumental red sandstone gateway of Agra Fort.',
        tips: 'Visit Musamman Burj where Shah Jahan spent his final days gazing at the Taj Mahal.'
      },
      {
        id: 'am3',
        title: 'Mehtab Bagh Riverfront Sunset Views',
        fromLocation: 'Agra Fort Amar Singh Gate',
        toLocation: 'Mehtab Bagh Riverbank Garden',
        time: '04:30 PM',
        status: 'upcoming',
        duration: '1h 30m',
        lat: 27.1800,
        lng: 78.0422,
        distanceKm: 4.5,
        travelTime: '15 mins drive',
        recommendedTransport: 'Yamuna Bridge Tourist Auto',
        recommendedFare: '₹50',
        transportIcon: '🛺',
        transitOptions: [
          { mode: 'auto', title: 'Tourist Auto-Rickshaw', fare: '₹50', time: '15 mins', icon: '🛺', badge: 'Fastest', steps: 'Cross Ambedkar Bridge to the tranquil northern bank of Yamuna River' },
          { mode: 'taxi', title: 'AC Cab', fare: '₹180', time: '12 mins', icon: '🚕', badge: 'Comfort', steps: 'Direct garden parking drop' }
        ],
        directionsGuide: 'Cross the Yamuna River via Ambedkar Bridge ➔ Arrive at the peaceful charbagh gardens of Mehtab Bagh for crowd-free reflection photos.',
        tips: 'Diverted tranquil location with zero lines; unobstructed sunset view across the Yamuna (+50 Eco-Points).'
      }
    ]
  },
  {
    id: 'goa',
    name: 'Goa Coastal & Heritage Latin Corridor',
    country: 'India',
    flag: '🇮🇳',
    center: [15.4989, 73.8278],
    zoom: 13,
    tagline: 'Latin Quarter, UNESCO Basilicas & Serene Coastal Islands',
    heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200&auto=format&fit=crop',
    weather: { temp: '29°C', condition: 'Tropical Breeze', humidity: '68%', aqi: '18 (Pristine)' },
    stats: { totalVisitorsToday: 48500, capacityUtilization: 64, ecoPointsEarned: 19200 },
    zones: [
      { id: 'gz1', name: 'Baga & Calangute Beach Strip', lat: 15.5553, lng: 73.7517, capacity: 7000, currentVisitors: 6650, densityPercent: 95, status: 'overcrowded', waitTime: '45 mins', category: 'Coastal Beach', ecoRewardTokens: 0, description: 'Bustling sandy shoreline known for water sports.' },
      { id: 'gz2', name: 'Basilica of Bom Jesus (Old Goa)', lat: 15.5008, lng: 73.9116, capacity: 4000, currentVisitors: 2850, densityPercent: 71, status: 'heavy', waitTime: '25 mins', category: 'UNESCO Basilica', ecoRewardTokens: 15, description: '16th-century Jesuit church holding sacred relics of St. Francis Xavier.' },
      { id: 'gz3', name: 'Fontainhas Heritage Latin Quarter', lat: 15.4989, lng: 73.8322, capacity: 3000, currentVisitors: 1350, densityPercent: 45, status: 'optimal', waitTime: '5 mins', category: 'Portuguese Heritage Quarter', ecoRewardTokens: 25, description: 'Pastel-hued colonial villas, wrought-iron balconies & heritage bakeries.' }
    ],
    roadmap: [
      {
        id: 'gm1',
        title: 'Fontainhas Latin Quarter Heritage Walk',
        fromLocation: 'Origin: Panaji City / Hotel',
        toLocation: 'Fontainhas Latin Heritage Quarter',
        time: '08:00 AM',
        status: 'completed',
        duration: '1h 30m',
        lat: 15.4989,
        lng: 73.8322,
        distanceKm: 0.0,
        travelTime: 'Starting Point',
        recommendedTransport: 'Heritage Walking Trail',
        recommendedFare: 'Free',
        transportIcon: '🚶‍♂️',
        transitOptions: [
          { mode: 'walk', title: 'Paved Street Walk', fare: 'Free', time: '10 mins', icon: '🚶‍♂️', badge: 'Best for Photos', steps: 'Stroll among pastel yellow, blue, and terracotta Portuguese villas' }
        ],
        directionsGuide: 'Begin at 31st January Road ➔ Stroll past heritage Portuguese chapels and sample fresh warm Poi bread at traditional bakeries.',
        tips: 'Explore pastel-colored Portuguese alleys before the morning sun gets warm.'
      },
      {
        id: 'gm2',
        title: 'Old Goa UNESCO Basilicas Tour',
        fromLocation: 'Fontainhas Latin Quarter',
        toLocation: 'Basilica of Bom Jesus (Old Goa)',
        time: '10:30 AM',
        status: 'in-progress',
        duration: '2 hours',
        lat: 15.5008,
        lng: 73.9116,
        distanceKm: 9.4,
        travelTime: '18 mins drive',
        recommendedTransport: 'Electric Heritage Shuttle Bus',
        recommendedFare: '₹30',
        transportIcon: '🚌',
        transitOptions: [
          { mode: 'bus', title: 'Kadamba Electric AC Bus', fare: '₹30', time: '18 mins', icon: '🚌', badge: 'Recommended', steps: 'Board AC Bus at Panaji Bus Terminal directly to Old Goa Church Plaza' },
          { mode: 'taxi', title: 'GoaMiles Prepaid Taxi', fare: '₹220', time: '15 mins', icon: '🚕', badge: 'Direct', steps: 'Scenic highway drive along the Mandovi River' }
        ],
        directionsGuide: 'Drive along the palm-lined Mandovi River expressway ➔ Arrive at Old Goa UNESCO world heritage basilica complex.',
        tips: 'Admire baroque gilded altars and sacred 400-year-old marble architecture.'
      }
    ]
  },
  {
    id: 'ladakh',
    name: 'Ladakh High-Altitude Himalayan Corridor',
    country: 'India',
    flag: '🇮🇳',
    center: [34.1526, 77.5771],
    zoom: 12,
    tagline: 'Pangong Lake, Monasteries & High-Altitude Eco-Trails',
    heroImage: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=1200&auto=format&fit=crop',
    weather: { temp: '16°C', condition: 'Crisp Mountain Air', humidity: '28%', aqi: '6 (Pristine)' },
    stats: { totalVisitorsToday: 18200, capacityUtilization: 52, ecoPointsEarned: 34100 },
    zones: [
      { id: 'lz1', name: 'Shanti Stupa Panoramic Ridge', lat: 34.1648, lng: 77.5786, capacity: 2000, currentVisitors: 1100, densityPercent: 55, status: 'optimal', waitTime: '10 mins', category: 'Peace Pagoda', ecoRewardTokens: 20, description: 'White-domed Buddhist stupa offering 360-degree views of Leh valley.' },
      { id: 'lz2', name: 'Thiksey Monastery Hilltop Sanctuary', lat: 34.0583, lng: 77.6667, capacity: 2200, currentVisitors: 880, densityPercent: 40, status: 'optimal', waitTime: '5 mins', category: 'Tibetan Monastery', ecoRewardTokens: 30, description: '12-story hilltop complex resembling the Potala Palace of Lhasa.' },
      { id: 'lz3', name: 'Pangong Tso Turquoise Shore', lat: 33.7595, lng: 78.6674, capacity: 2500, currentVisitors: 2100, densityPercent: 84, status: 'heavy', waitTime: '30 mins', category: 'High-Altitude Lake', ecoRewardTokens: 5, description: 'Endorheic salt lake that changes color from deep blue to turquoise.' }
    ],
    roadmap: [
      {
        id: 'lm1',
        title: 'Leh Main Bazaar to Shanti Stupa Morning Peace',
        fromLocation: 'Origin: Leh Main Market',
        toLocation: 'Shanti Stupa Hilltop Pagoda',
        time: '07:00 AM',
        status: 'completed',
        duration: '1h 30m',
        lat: 34.1648,
        lng: 77.5786,
        distanceKm: 0.0,
        travelTime: 'Starting Point',
        recommendedTransport: 'Shared Eco-Van / Steps Walk',
        recommendedFare: '₹30 / Free',
        transportIcon: '🚐',
        transitOptions: [
          { mode: 'van', title: 'Shared Green Eco-Van', fare: '₹30', time: '8 mins', icon: '🚐', badge: 'High Altitude Friendly', steps: 'Board eco-van at Leh gate directly to the stupa parking' },
          { mode: 'walk', title: '500 Stone Steps Climb', fare: 'Free', time: '25 mins', icon: '🚶‍♂️', badge: 'Scenic Exercise', steps: 'Climb the traditional whitewashed stone staircase overlooking Leh' }
        ],
        directionsGuide: 'Ascend the Changspa hillside to Shanti Stupa ➔ Enjoy the crisp Himalayan dawn and prayer flags fluttering in the breeze.',
        tips: 'Drink plenty of water and ascend slowly for proper high-altitude acclimatization.'
      },
      {
        id: 'lm2',
        title: 'Thiksey Monastery Morning Chanting & Butter Tea',
        fromLocation: 'Shanti Stupa Hilltop',
        toLocation: 'Thiksey Monastery Grand Sanctuary',
        time: '09:30 AM',
        status: 'in-progress',
        duration: '2 hours',
        lat: 34.0583,
        lng: 77.6667,
        distanceKm: 19.2,
        travelTime: '28 mins drive',
        recommendedTransport: 'Ladakh Tourist 4x4 / Shared Taxi',
        recommendedFare: '₹120',
        transportIcon: '🚙',
        transitOptions: [
          { mode: 'taxi', title: 'Shared Himalayan 4x4', fare: '₹120', time: '25 mins', icon: '🚙', badge: 'Recommended', steps: 'Scenic drive along the Indus River highway directly to the monastery gate' },
          { mode: 'bus', title: 'Ladakh State Bus', fare: '₹40', time: '40 mins', icon: '🚌', badge: 'Budget', steps: 'Board at Leh Bus Stand with scenic valley stops' }
        ],
        directionsGuide: 'Drive along the Indus River valley ➔ Ascend the 12-story hilltop fortress of Thiksey Monastery ➔ View the 15-meter tall Maitreya Buddha statue.',
        tips: 'Listen to the deep resonant monastic horn calls (Dungchen) echoing across the valley.'
      }
    ]
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad (City of Pearls & Nizams), Telangana',
    country: 'India',
    flag: '🇮🇳',
    center: [17.3850, 78.4867],
    zoom: 13,
    tagline: 'Charminar, Historic Fortresses, Giant Buddha & Authentic Biryani',
    heroImage: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=1200&auto=format&fit=crop',
    weather: { temp: '32°C', condition: 'Sunny & Warm', humidity: '42%', aqi: '45 (Moderate)' },
    stats: { totalVisitorsToday: 62400, capacityUtilization: 76, ecoPointsEarned: 26500 },
    zones: [
      { id: 'hz1', name: 'Charminar & Laad Bazaar Pearl Market', lat: 17.3616, lng: 78.4747, capacity: 7000, currentVisitors: 6400, densityPercent: 91, status: 'overcrowded', waitTime: '45 mins', category: 'Historic Monument', ecoRewardTokens: 0, description: 'Iconic 1591 landmark with four grand arches and bustling bazaars.' },
      { id: 'hz2', name: 'Golconda Fort Acoustic Ramparts', lat: 17.3833, lng: 78.4011, capacity: 5500, currentVisitors: 4100, densityPercent: 75, status: 'heavy', waitTime: '30 mins', category: 'Medieval Fortress', ecoRewardTokens: 10, description: 'Famous for acoustic architectural brilliance and evening light-and-sound shows.' },
      { id: 'hz3', name: 'Salar Jung Museum & Art Galleries', lat: 17.3713, lng: 78.4804, capacity: 4000, currentVisitors: 1500, densityPercent: 38, status: 'optimal', waitTime: '5 mins', category: 'National Art Museum', ecoRewardTokens: 30, description: 'One of the world’s largest one-man art collections including the musical clock.' },
      { id: 'hz4', name: 'Hussain Sagar Lake & Monolithic Buddha', lat: 17.4239, lng: 78.4738, capacity: 4500, currentVisitors: 1800, densityPercent: 40, status: 'optimal', waitTime: '10 mins', category: 'Island Sanctuary', ecoRewardTokens: 25, description: 'Scenic lakefront with an 18-meter monolithic white granite Buddha statue.' },
      { id: 'hz5', name: 'Birla Mandir White Marble Temple', lat: 17.4062, lng: 78.4691, capacity: 3000, currentVisitors: 720, densityPercent: 24, status: 'recommended', waitTime: '0 mins', category: 'Hilltop Marble Temple', ecoRewardTokens: 45, description: 'Tranquil white Rajasthani marble temple overlooking Hussain Sagar.' }
    ],
    roadmap: [
      {
        id: 'hm1',
        title: 'Charminar & Nimrah Irani Chai Morning',
        fromLocation: 'Origin: Hyderabad Deccan / Hotel',
        toLocation: 'Charminar Pedestrian Plaza',
        time: '08:30 AM',
        status: 'completed',
        duration: '1h 30m',
        lat: 17.3616,
        lng: 78.4747,
        distanceKm: 0.0,
        travelTime: 'Starting Point',
        recommendedTransport: 'Hyderabad Metro (Green Line)',
        recommendedFare: '₹25',
        transportIcon: '🚊',
        transitOptions: [
          { mode: 'metro', title: 'Hyderabad Metro', fare: '₹25', time: '12 mins', icon: '🚊', badge: 'Fast & AC', steps: 'Take metro to MGBS station, walk 800m through Old City arcade' },
          { mode: 'auto', title: 'Auto-Rickshaw / Rapido', fare: '₹40', time: '10 mins', icon: '🛺', badge: 'Direct', steps: 'Direct drop at Charminar pedestrian plaza' }
        ],
        directionsGuide: 'Arrive at Charminar plaza ➔ Climb the spiral stone staircase for Old City views ➔ Enjoy hot Irani chai & Osmania biscuits at Nimrah.',
        tips: 'Visit early to enjoy peaceful heritage architecture and fresh morning bakery aroma.'
      },
      {
        id: 'hm2',
        title: 'Salar Jung Museum Heritage Collections',
        fromLocation: 'Charminar Pedestrian Plaza',
        toLocation: 'Salar Jung Museum Main Gate',
        time: '11:00 AM',
        status: 'in-progress',
        duration: '2 hours',
        lat: 17.3713,
        lng: 78.4804,
        distanceKm: 1.8,
        travelTime: '8 mins ride',
        recommendedTransport: 'E-Auto / Short Ride',
        recommendedFare: '₹30',
        transportIcon: '🛺',
        transitOptions: [
          { mode: 'auto', title: 'Electric Auto', fare: '₹30', time: '8 mins', icon: '🛺', badge: 'Recommended', steps: 'Drive north along the Musi riverbank directly to the museum gate' }
        ],
        directionsGuide: 'Drive along Musi riverbank road ➔ Enter Salar Jung Museum ➔ Witness the 19th-century musical clock chime at noon.',
        tips: 'Do not miss the Veiled Rebecca Italian marble statue and the royal Nizam jade collection.'
      },
      {
        id: 'hm3',
        title: 'Hussain Sagar Lake Speedboat to Buddha Island',
        fromLocation: 'Salar Jung Museum',
        toLocation: 'Lumbini Park Jetty & Buddha Island',
        time: '03:00 PM',
        status: 'upcoming',
        duration: '1h 30m',
        lat: 17.4239,
        lng: 78.4738,
        distanceKm: 6.4,
        travelTime: '18 mins ride',
        recommendedTransport: 'Tourism Speedboat / Cab',
        recommendedFare: '₹60 / ₹120',
        transportIcon: '🛥️',
        transitOptions: [
          { mode: 'boat', title: 'Telangana Tourism Speedboat', fare: '₹60', time: '10 mins', icon: '🛥️', badge: 'Lake Cruise', steps: 'Board boat at Lumbini Park Jetty directly to Rock Island Buddha Statue' }
        ],
        directionsGuide: 'Arrive at Lumbini Park ➔ Board eco-speedboat to Rock Island in the heart of Hussain Sagar lake.',
        tips: 'Great cool breeze in the afternoon with panoramic city skyline views.'
      },
      {
        id: 'hm4',
        title: 'Birla Mandir Sunset Panorama',
        fromLocation: 'Lumbini Park Jetty',
        toLocation: 'Birla Mandir Hilltop Arch',
        time: '05:30 PM',
        status: 'upcoming',
        duration: '1 hour',
        lat: 17.4062,
        lng: 78.4691,
        distanceKm: 2.5,
        travelTime: '8 mins ride',
        recommendedTransport: 'Hill Auto-Rickshaw',
        recommendedFare: '₹35',
        transportIcon: '🛺',
        transitOptions: [
          { mode: 'auto', title: 'Hill Auto', fare: '₹35', time: '8 mins', icon: '🛺', badge: 'Quick', steps: 'Direct uphill drop at Birla Mandir entrance arch' }
        ],
        directionsGuide: 'Climb the gentle marble steps of Naubat Pahad ➔ Enjoy serene quiet and golden sunset reflections over the lake.',
        tips: 'Pure white marble temple with no electrical bells, maintaining serene meditative silence.'
      },
      {
        id: 'hm5',
        title: 'Golconda Fort Acoustic & Light Show',
        fromLocation: 'Birla Mandir',
        toLocation: 'Golconda Fort Sound & Light Arena',
        time: '07:00 PM',
        status: 'upcoming',
        duration: '1h 45m',
        lat: 17.3833,
        lng: 78.4011,
        distanceKm: 9.8,
        travelTime: '22 mins drive',
        recommendedTransport: 'AC Tourist Cab',
        recommendedFare: '₹180',
        transportIcon: '🚕',
        transitOptions: [
          { mode: 'cab', title: 'AC City Cab', fare: '₹180', time: '22 mins', icon: '🚕', badge: 'Recommended', steps: 'Via Mehdipatnam Flyover directly to Fort entrance' }
        ],
        directionsGuide: 'Drive via expressway to Golconda Fort ➔ Test the clapping acoustic signal at Fateh Darwaza ➔ Watch the dramatic evening historical show.',
        tips: 'Pre-book VIP tickets for front-row seats at the sound and light narration by Amitabh Bachchan.'
      }
    ]
  },
  {
    id: 'kerala',
    name: 'Kerala God\'s Own Country Coastal Corridor',
    country: 'India',
    flag: '🇮🇳',
    center: [9.9312, 76.2673],
    zoom: 13,
    tagline: 'Kochi Heritage, Alleppey Houseboats & Munnar Tea Estates',
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1200&auto=format&fit=crop',
    weather: { temp: '28°C', condition: 'Tropical Breeze', humidity: '72%', aqi: '15 (Pristine)' },
    stats: { totalVisitorsToday: 42100, capacityUtilization: 62, ecoPointsEarned: 29400 },
    zones: [
      { id: 'kz1', name: 'Fort Kochi Chinese Fishing Nets', lat: 9.9674, lng: 76.2431, capacity: 5000, currentVisitors: 3200, densityPercent: 64, status: 'optimal', waitTime: '10 mins', category: 'Coastal Heritage', ecoRewardTokens: 20, description: 'Historic 14th-century cantilevered fishing nets silhouetted against the Arabian Sea.' },
      { id: 'kz2', name: 'Mattancherry Dutch Palace & Jew Town', lat: 9.9582, lng: 76.2592, capacity: 3500, currentVisitors: 2100, densityPercent: 60, status: 'optimal', waitTime: '15 mins', category: 'Colonial Museum & Spice Street', ecoRewardTokens: 25, description: 'Centuries-old spice warehouses, antique shops, and 1568 Paradesi Synagogue.' },
      { id: 'kz3', name: 'Alleppey Backwaters Houseboat Pier', lat: 9.4981, lng: 76.3388, capacity: 6000, currentVisitors: 5100, densityPercent: 85, status: 'heavy', waitTime: '30 mins', category: 'Backwaters Canal', ecoRewardTokens: 10, description: 'Serene palm-fringed lagoons, traditional Kettuvallam houseboats, and village paddy fields.' }
    ],
    roadmap: [
      {
        id: 'km1',
        title: 'Fort Kochi Beach & Chinese Fishing Nets Sunrise',
        fromLocation: 'Origin: Ernakulam / Hotel',
        toLocation: 'Fort Kochi Sea Walkway',
        time: '07:30 AM',
        status: 'completed',
        duration: '1h 30m',
        lat: 9.9674,
        lng: 76.2431,
        distanceKm: 0.0,
        travelTime: 'Starting Point',
        recommendedTransport: 'Kochi Water Metro Ferry',
        recommendedFare: '₹20',
        transportIcon: '🛥️',
        transitOptions: [
          { mode: 'boat', title: 'Kochi Water Metro (Electric)', fare: '₹20', time: '15 mins', icon: '🛥️', badge: 'Scenic & Eco', steps: 'Board state-of-the-art electric water metro at High Court Jetty directly to Fort Kochi' }
        ],
        directionsGuide: 'Take the scenic Water Metro to Fort Kochi ➔ Stroll along Vasco da Gama Square to watch fishermen operate the giant wooden cantilever nets.',
        tips: 'Try fresh coconut water from local stalls and watch fishermen pull in morning catches.'
      },
      {
        id: 'km2',
        title: 'Jew Town & Paradesi Synagogue Heritage Walk',
        fromLocation: 'Fort Kochi Walkway',
        toLocation: 'Mattancherry Jew Town Street',
        time: '10:30 AM',
        status: 'in-progress',
        duration: '2 hours',
        lat: 9.9582,
        lng: 76.2592,
        distanceKm: 3.2,
        travelTime: '10 mins ride',
        recommendedTransport: 'Heritage Auto-Rickshaw',
        recommendedFare: '₹40',
        transportIcon: '🛺',
        transitOptions: [
          { mode: 'auto', title: 'Kochi Tuk-Tuk', fare: '₹40', time: '10 mins', icon: '🛺', badge: 'Heritage Ride', steps: 'Drive through spice-scented lanes of Mattancherry to Jew Town' }
        ],
        directionsGuide: 'Stroll through cobblestone lanes filled with ginger, cardamom, and antique brass wares ➔ Visit the historic 1568 Synagogue with hand-painted Chinese willow tiles.',
        tips: 'Visit ginger warehouses and traditional Ayurvedic oil dispensaries.'
      }
    ]
  },
  {
    id: 'delhi',
    name: 'Delhi Capital Heritage & Modern Cultural Corridor',
    country: 'India',
    flag: '🇮🇳',
    center: [28.6139, 77.2090],
    zoom: 13,
    tagline: 'India Gate, Red Fort, Qutub Minar & Historic Chandni Chowk',
    heroImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1200&auto=format&fit=crop',
    weather: { temp: '30°C', condition: 'Sunny & Clear', humidity: '40%', aqi: '58 (Moderate)' },
    stats: { totalVisitorsToday: 82000, capacityUtilization: 82, ecoPointsEarned: 31000 },
    zones: [
      { id: 'dz1', name: 'India Gate & Kartavya Path', lat: 28.6129, lng: 77.2295, capacity: 8000, currentVisitors: 6200, densityPercent: 78, status: 'heavy', waitTime: '20 mins', category: 'National Memorial', ecoRewardTokens: 10, description: 'Monumental 42-meter high war memorial arch with sprawling lawns.' },
      { id: 'dz2', name: 'Red Fort (Lal Qila) & Chandni Chowk', lat: 28.6562, lng: 77.2410, capacity: 7500, currentVisitors: 6800, densityPercent: 90, status: 'overcrowded', waitTime: '45 mins', category: 'UNESCO Fortress', ecoRewardTokens: 0, description: '17th-century Mughal imperial palace complex made of red sandstone.' },
      { id: 'dz3', name: 'Qutub Minar & Mehrauli Archaeological Park', lat: 28.5244, lng: 77.1855, capacity: 4500, currentVisitors: 2200, densityPercent: 49, status: 'optimal', waitTime: '10 mins', category: 'UNESCO Victory Tower', ecoRewardTokens: 25, description: 'World’s tallest brick minaret standing 72.5 meters tall with ancient iron pillar.' }
    ],
    roadmap: [
      {
        id: 'dm1',
        title: 'India Gate & Kartavya Path Morning Stroll',
        fromLocation: 'Origin: New Delhi Station / Hotel',
        toLocation: 'India Gate Memorial Plaza',
        time: '07:30 AM',
        status: 'completed',
        duration: '1h 30m',
        lat: 28.6129,
        lng: 77.2295,
        distanceKm: 0.0,
        travelTime: 'Starting Point',
        recommendedTransport: 'Delhi Metro (Violet/Yellow Line)',
        recommendedFare: '₹20',
        transportIcon: '🚊',
        transitOptions: [
          { mode: 'metro', title: 'Delhi Metro', fare: '₹20', time: '10 mins', icon: '🚊', badge: 'Fast & AC', steps: 'Take metro to Central Secretariat Station, walk 400m along tree-lined Kartavya Path' }
        ],
        directionsGuide: 'Walk along the grand central promenade of Kartavya Path ➔ View the eternal flame (Amar Jawan Jyoti) and lush gardens.',
        tips: 'Visit in the early morning for quiet photography before tourist rush.'
      },
      {
        id: 'dm2',
        title: 'Qutub Minar Complex & Iron Pillar',
        fromLocation: 'India Gate',
        toLocation: 'Qutub Minar Complex Gate',
        time: '11:00 AM',
        status: 'in-progress',
        duration: '2 hours',
        lat: 28.5244,
        lng: 77.1855,
        distanceKm: 12.5,
        travelTime: '22 mins ride',
        recommendedTransport: 'Delhi Metro Yellow Line',
        recommendedFare: '₹30',
        transportIcon: '🚊',
        transitOptions: [
          { mode: 'metro', title: 'Yellow Line Metro', fare: '₹30', time: '20 mins', icon: '🚊', badge: 'Recommended', steps: 'Direct Yellow Line metro from Central Secretariat to Qutab Minar Station' }
        ],
        directionsGuide: 'Take Yellow Line Metro directly to Qutab Minar station ➔ Explore the 12th-century victory tower and the rust-resistant 1,600-year-old Iron Pillar.',
        tips: 'Look closely at the intricate Arabic calligraphy carvings on the fluted red sandstone balconies.'
      }
    ]
  }
];
