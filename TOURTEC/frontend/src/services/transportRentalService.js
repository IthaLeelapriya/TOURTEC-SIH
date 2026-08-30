// Transport Rentals, Bus Booking, Tour Agencies & Budget Service for TOURTEC India

export const TRANSPORT_DATABASE = {
  hyderabad: {
    cabs: [
      {
        id: 'hyd-c1',
        name: 'Sedan Prime (Swift Dzire / Toyota Etios)',
        type: 'sedan',
        capacity: '4 Passengers + 2 Large Bags',
        localRate8hr80km: 1600,
        outstationPerKm: 12,
        driverAllowancePerDay: 400,
        features: ['100% Chilled AC', 'Verified Clean Sanitized', 'Free GPS Navigation', 'Zero Cancellation Fee'],
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800&auto=format&fit=crop',
        rating: 4.8,
        reviewsCount: 3800,
        badge: '⚡ Most Popular for City Tours'
      },
      {
        id: 'hyd-c2',
        name: 'Innova Crysta Luxury MUV',
        type: 'suv',
        capacity: '6-7 Passengers + 4 Bags',
        localRate8hr80km: 2600,
        outstationPerKm: 17,
        driverAllowancePerDay: 500,
        features: ['Captain Seats & Recliner', 'Dual AC Climate Control', 'Roof Luggage Carrier', 'Express Toll Fastag'],
        image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop',
        rating: 4.9,
        reviewsCount: 4200,
        badge: '👑 Family & Group Top Choice'
      },
      {
        id: 'hyd-c3',
        name: 'Force Urbania / Tempo Traveller (12–17 Seater)',
        type: 'tempo',
        capacity: '12–17 Passengers + 10 Bags',
        localRate8hr80km: 3900,
        outstationPerKm: 23,
        driverAllowancePerDay: 600,
        features: ['Pushback Luxury Seats', 'Individual AC Vents & USB Ports', 'LED TV & Sound System', 'Large Boot Space'],
        image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=800&auto=format&fit=crop',
        rating: 4.8,
        reviewsCount: 1950,
        badge: '🚐 Grand Group Tour'
      }
    ],
    buses: [
      {
        id: 'hyd-b1',
        operator: 'TSTDC Telangana Tourism Heritage Bus',
        busType: 'AC Volvo Sightseeing Coach',
        route: 'City Circuit: Golconda Fort ➔ Qutb Shahi Tombs ➔ Charminar ➔ Salar Jung ➔ Hussain Sagar',
        departureTime: '08:30 AM Daily from Tourist Plaza, Basheerbagh',
        pricePerSeat: 450,
        includesGuide: true,
        rating: 4.7,
        reviewsCount: 3100,
        bookingUrl: 'https://tourism.telangana.gov.in/'
      },
      {
        id: 'hyd-b2',
        operator: 'TSRTC Garuda Plus & Orange Travels',
        busType: 'Multi-Axle AC Sleeper',
        route: 'Hyderabad ➔ Srisailam Temple / Vijayawada / Warangal',
        departureTime: 'Multiple Daily Timings (Hourly)',
        pricePerSeat: 650,
        includesGuide: false,
        rating: 4.6,
        reviewsCount: 8400,
        bookingUrl: 'https://www.redbus.in/'
      }
    ],
    agencies: [
      {
        id: 'hyd-a1',
        name: 'Telangana State Tourism Development Corp (TSTDC)',
        licenseNo: 'GOV-TS-TR-2026-08',
        rating: 4.8,
        reviewsCount: 6200,
        specialty: 'Official Government Sightseeing & Heritage Packages',
        contactPhone: '+91 40 2345 0355',
        officeAddress: 'Tourism House, Himayatnagar, Hyderabad',
        verifiedBadge: '🏛️ Govt. Certified Operator',
        popularPackage: '1-Day Complete Hyderabad Nizami Heritage Tour (₹650/person with Guide)'
      },
      {
        id: 'hyd-a2',
        name: 'Southern Travels & Deccan Heritage Tours',
        licenseNo: 'IATA-IND-49201',
        rating: 4.9,
        reviewsCount: 4800,
        specialty: 'Private Customized Family Trips & Outstation Pilgrimage',
        contactPhone: '+91 40 6677 8899',
        officeAddress: 'Abids Road & Begumpet, Hyderabad',
        verifiedBadge: '🌟 IATA & Ministry of Tourism',
        popularPackage: '2-Day Hyderabad + Ramoji Film City VIP Package (₹2,400/person)'
      }
    ]
  },
  vijayawada: {
    cabs: [
      {
        id: 'vja-c1',
        name: 'Sedan Prime (Dzire / Etios)',
        type: 'sedan',
        capacity: '4 Passengers + 2 Bags',
        localRate8hr80km: 1400,
        outstationPerKm: 11,
        driverAllowancePerDay: 400,
        features: ['AC Climate Control', 'Temple Darshan Route Specialist', 'Clean Interior'],
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800&auto=format&fit=crop',
        rating: 4.7,
        reviewsCount: 2200,
        badge: '⚡ Best for Temple Circuit'
      },
      {
        id: 'vja-c2',
        name: 'Innova Crysta AC SUV',
        type: 'suv',
        capacity: '7 Passengers + 4 Bags',
        localRate8hr80km: 2400,
        outstationPerKm: 16,
        driverAllowancePerDay: 500,
        features: ['Spacious Recliners', 'Indrakeeladri Hill Ghat Road Permit', 'Fastag Enabled'],
        image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop',
        rating: 4.9,
        reviewsCount: 3100,
        badge: '👑 Temple Pilgrimage Top Choice'
      }
    ],
    buses: [
      {
        id: 'vja-b1',
        operator: 'APTDC Andhra Pradesh Tourism Bus',
        busType: 'AC Sightseeing Coach',
        route: 'Kanaka Durga Temple ➔ Undavalli Caves ➔ Bhavani Island ➔ Amaravati Heritage',
        departureTime: '08:00 AM Daily from Berm Park Jetty',
        pricePerSeat: 400,
        includesGuide: true,
        rating: 4.8,
        reviewsCount: 2400,
        bookingUrl: 'https://tourism.ap.gov.in/'
      }
    ],
    agencies: [
      {
        id: 'vja-a1',
        name: 'APTDC Tourism Information & Booking Center',
        licenseNo: 'GOV-AP-TR-5021',
        rating: 4.8,
        reviewsCount: 3900,
        specialty: 'Krishna Riverfront Tours & Amaravati Buddhist Circuit',
        contactPhone: '+91 866 257 1393',
        officeAddress: 'MG Road, Benz Circle, Vijayawada',
        verifiedBadge: '🏛️ Govt. Certified Operator',
        popularPackage: 'Amaravati & Mangalagiri Spiritual Day Tour (₹550/person)'
      }
    ]
  },
  varanasi: {
    cabs: [
      {
        id: 'vns-c1',
        name: 'Sedan Prime (Swift Dzire AC)',
        type: 'sedan',
        capacity: '4 Passengers + 2 Bags',
        localRate8hr80km: 1500,
        outstationPerKm: 12,
        driverAllowancePerDay: 400,
        features: ['Full AC', 'Ghats & Sarnath Route Permit', 'Airport Transfer Discount'],
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800&auto=format&fit=crop',
        rating: 4.8,
        reviewsCount: 3400,
        badge: '⚡ Sarnath & Ghats Transit'
      },
      {
        id: 'vns-c2',
        name: 'Innova Crysta AC SUV',
        type: 'suv',
        capacity: '7 Passengers + 4 Bags',
        localRate8hr80km: 2500,
        outstationPerKm: 17,
        driverAllowancePerDay: 500,
        features: ['Luxury Captain Seats', 'Prayagraj / Ayodhya Outstation Ready'],
        image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop',
        rating: 4.9,
        reviewsCount: 4600,
        badge: '👑 Ayodhya & Kashi Circuit'
      }
    ],
    buses: [
      {
        id: 'vns-b1',
        operator: 'UPSTDC Uttar Pradesh Tourism',
        busType: 'AC Heritage Coach',
        route: 'Kashi Vishwanath Corridor ➔ Sarnath Deer Park & Stupa ➔ BHU Vishwanath ➔ Ramnagar Fort',
        departureTime: '09:00 AM Daily from Cantonment Station',
        pricePerSeat: 450,
        includesGuide: true,
        rating: 4.7,
        reviewsCount: 4100,
        bookingUrl: 'https://uptourism.gov.in/'
      }
    ],
    agencies: [
      {
        id: 'vns-a1',
        name: 'UP Tourism Official Booking Counter (UPSTDC)',
        licenseNo: 'GOV-UP-VNS-104',
        rating: 4.8,
        reviewsCount: 5800,
        specialty: 'Kashi Spiritual Tours & Ayodhya / Prayagraj Triveni Sangam',
        contactPhone: '+91 542 250 5033',
        officeAddress: 'Parade Kothi, Near Railway Station, Varanasi',
        verifiedBadge: '🏛️ Govt. Certified Operator',
        popularPackage: 'Complete Kashi + Sarnath Buddhist Heritage Guided Tour (₹650/person)'
      }
    ]
  }
};

// Fallback dynamic generator for any searched Indian destination
export const getTransportForLocation = (locationName = 'Hyderabad') => {
  const clean = (locationName || 'Hyderabad').toLowerCase();

  let matchedCity = 'hyderabad';
  if (clean.includes('hyderabad')) matchedCity = 'hyderabad';
  else if (clean.includes('vijayawada')) matchedCity = 'vijayawada';
  else if (clean.includes('varanasi')) matchedCity = 'varanasi';
  else {
    const cityName = locationName.split(',')[0].trim();
    return {
      cabs: [
        {
          id: `dyn-c1-${cityName}`,
          name: `${cityName} Prime Sedan (Dzire / Etios)`,
          type: 'sedan',
          capacity: '4 Passengers + 2 Bags',
          localRate8hr80km: 1500,
          outstationPerKm: 12,
          driverAllowancePerDay: 400,
          features: ['Chilled AC', 'Verified Professional Driver', 'Airport / Sightseeing Permit'],
          image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800&auto=format&fit=crop',
          rating: 4.8,
          reviewsCount: 1200,
          badge: '⚡ Local & Outstation Taxi'
        },
        {
          id: `dyn-c2-${cityName}`,
          name: `${cityName} Innova Crysta Family SUV`,
          type: 'suv',
          capacity: '7 Passengers + 4 Bags',
          localRate8hr80km: 2500,
          outstationPerKm: 16,
          driverAllowancePerDay: 500,
          features: ['Luxury Captain Seats', 'All-India Tourist Permit', 'Dual AC'],
          image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop',
          rating: 4.9,
          reviewsCount: 1800,
          badge: '👑 Family Luxury SUV'
        }
      ],
      buses: [
        {
          id: `dyn-b1-${cityName}`,
          operator: `${cityName} State Tourism AC Bus`,
          busType: 'AC Sightseeing Deluxe Coach',
          route: `Full Day Guided Circuit of Top Sights in ${cityName}`,
          departureTime: '08:30 AM Daily from Central Tourist Stand',
          pricePerSeat: 450,
          includesGuide: true,
          rating: 4.7,
          reviewsCount: 950,
          bookingUrl: 'https://www.redbus.in/'
        }
      ],
      agencies: [
        {
          id: `dyn-a1-${cityName}`,
          name: `${cityName} Official Tourism & Travel Agency`,
          licenseNo: `GOV-${cityName.toUpperCase().slice(0, 3)}-2026`,
          rating: 4.8,
          reviewsCount: 1500,
          specialty: `Guided Day Tours & Customized Holiday Packages in ${cityName}`,
          contactPhone: '+91 1800 425 4567',
          officeAddress: `Tourism Plaza, Station Road, ${cityName}`,
          verifiedBadge: '🏛️ Verified Tourist Agency',
          popularPackage: `1-Day Highlights of ${cityName} (₹600/person with AC Coach & Guide)`
        }
      ]
    };
  }

  return TRANSPORT_DATABASE[matchedCity] || TRANSPORT_DATABASE.hyderabad;
};
