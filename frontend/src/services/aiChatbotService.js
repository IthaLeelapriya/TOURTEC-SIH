// Comprehensive Multi-Source AI Travel Intelligence Engine with Wikipedia Knowledge API

// 1. Fetch live Wikipedia Summary for any landmark/topic
const fetchWikipediaSummary = async (queryTerm) => {
  try {
    const cleanTerm = encodeURIComponent(queryTerm.replace(/\s+/g, '_'));
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${cleanTerm}`);
    if (res.ok) {
      const data = await res.json();
      if (data.extract && data.type !== 'disambiguation' && data.extract.length > 50) {
        return {
          title: data.title,
          description: data.description || '',
          extract: data.extract,
          thumbnail: data.thumbnail?.source || null
        };
      }
    }
  } catch (err) {
    console.warn('Wikipedia API fetch failed:', err);
  }
  return null;
};

// 2. Curated Landmark Knowledge Matrix for Indian Sights
const LANDMARK_DB = {
  charminar: {
    name: 'Charminar',
    city: 'Hyderabad',
    overview: 'Built in 1591 by Muhammad Quli Qutb Shah to mark the eradication of plague. A masterpiece of Indo-Islamic architecture with four grand arches and 48.7m minarets.',
    howToGo: 'Take the Hyderabad Metro to MGBS / Charminar Station (Green Line), or hail an Auto/Rapido (₹30–₹50 from central Hyderabad).',
    timings: '09:00 AM to 05:30 PM daily. Evening illuminated view till 10:00 PM.',
    entryFee: '₹25 for Indians, ₹300 for Foreigners, Free for children under 15.',
    highlights: [
      'Climb the spiral staircase to the upper gallery for panoramic Old City views.',
      'Shop for famous lacquer bangles & pearls at Laad Bazaar (Choodi Bazaar) right beside the monument.',
      'Sip authentic Irani Chai with Osmania Biscuits at Nimrah Cafe directly facing Charminar.',
      'Taste legendary Mutton Biryani at Hotel Shadab or Shah Ghouse nearby.'
    ],
    proTip: 'Visit before 11:00 AM on weekdays to avoid intense afternoon traffic and queue times.'
  },
  golconda: {
    name: 'Golconda Fort',
    city: 'Hyderabad',
    overview: 'A 16th-century fortress city renowned for acoustic engineering (a clap at the entry Fateh Darwaza can be heard 1km away at the hilltop Bala Hissar) and world-famous diamond trade (Koh-i-Noor, Hope Diamond).',
    howToGo: 'Located in western Hyderabad. Direct RTC buses (65G, 66G) from Koti/Mehdipatnam, or Uber/Ola cab (approx. 11km from city center).',
    timings: '09:00 AM to 05:30 PM. Sound & Light Show: 06:30 PM (English) & 07:45 PM (Hindi).',
    entryFee: '₹25 for Indians, ₹300 for Foreigners. Sound & Light Show: ₹140.',
    highlights: ['Fateh Darwaza acoustic dome', 'Royal palace ruins & Rani Mahal', 'Bala Hissar panoramic hilltop view', 'Sound & Light evening laser show'],
    proTip: 'Wear sturdy walking shoes as there are over 360 stone steps to the summit. Carry drinking water.'
  },
  'hussain sagar': {
    name: 'Hussain Sagar Lake & Buddha Statue',
    city: 'Hyderabad',
    overview: 'Heart-shaped lake built in 1563 by Ibrahim Quli Qutb Shah. Features the world’s tallest monolithic stone statue of Gautama Buddha (18 meters) standing in the center on Gibraltar Rock.',
    howToGo: 'Located along Necklace Road / Tank Bund. Accessible via Necklace Road MMTS station or local autos.',
    timings: 'Boating open 08:00 AM to 10:00 PM daily. Musical Dancing Laser Fountain at 07:00 PM.',
    entryFee: 'Lake entry is free. Mechanized boat to Buddha statue: ₹55 per person. Speedboat: ₹350.',
    highlights: ['Speedboat ride to Buddha statue', 'Evening stroll along Tank Bund with city skyline views', 'Eat Street food court', 'Lumbini Park laser show'],
    proTip: 'Visit between 05:30 PM and 08:00 PM for sunset over the water and illuminated evening lights.'
  },
  'kashi vishwanath': {
    name: 'Kashi Vishwanath Temple',
    city: 'Varanasi',
    overview: 'One of the twelve sacred Jyotirlingas of Lord Shiva. The golden spire was donated by Maharaja Ranjit Singh. The newly inaugurated corridor directly links the temple to the holy River Ganga at Lalita Ghat.',
    howToGo: 'Enter via Gate #4 (Godowlia side) or Lalita Ghat Corridor. Free battery-operated e-rickshaws available for seniors.',
    timings: 'Mangala Aarti: 03:00 AM – 04:00 AM. General Darshan: 04:00 AM – 11:00 PM. Sandhya Aarti: 07:00 PM.',
    entryFee: 'General Darshan is FREE. VIP Sugam Darshan: ₹300 (book online on temple trust portal).',
    highlights: ['Spiritual Darshan of Jyotirlinga', 'Kashi Vishwanath Corridor promenade to Ganga', 'Ganga Jal offering ritual'],
    proTip: 'Strict dress code: Traditional Indian wear (Dhoti/Kurta for men, Saree/Churidar for women). Phones and leather items must be left in free lockers at Gate #4.'
  },
  'dashashwamedh ghat': {
    name: 'Dashashwamedh Ghat (Ganga Aarti)',
    city: 'Varanasi',
    overview: 'The primary and oldest sacred ghat of Varanasi. Legend says Lord Brahma created it to welcome Lord Shiva and sacrificed ten horses (Dasa-Ashwamedha) here.',
    howToGo: 'Walk 300m from Godowlia crossing (vehicle-free zone). Local rickshaws drop at Godowlia stand.',
    timings: 'Ganga Aarti starts daily at 06:30 PM in summer (06:00 PM in winter). Takes 45 minutes.',
    entryFee: 'FREE viewing from the ghat steps. Wooden boat seat: ₹150–₹300. UP Tourism Solar Boat: ₹250.',
    highlights: ['Seven priests performing synchronized brass lamp Aarti', 'Floating earthen Diya candles on Ganga', 'Subah-e-Banaras morning classical concerts at Assi Ghat'],
    proTip: 'Arrive at the ghat by 05:45 PM to get prime front-row seating on the stone steps or board an authorized boat before 06:00 PM.'
  },
  'taj mahal': {
    name: 'Taj Mahal',
    city: 'Agra',
    overview: 'UNESCO World Heritage monument and one of the New 7 Wonders of the World. Built in ivory-white marble by Emperor Shah Jahan in 1632 for his wife Mumtaz Mahal.',
    howToGo: 'Located in Taj Ganj, Agra. Eco-friendly battery carts (₹10) transport visitors from the parking area to East/West Gates.',
    timings: '06:00 AM to 06:30 PM (Sunrise to Sunset). STRICTLY CLOSED ON FRIDAYS.',
    entryFee: '₹50 for Indians (+₹200 for main mausoleum), ₹1,100 for Foreigners. Free for children below 15.',
    highlights: ['Central marble dome & reflecting pool gardens', 'Pietra Dura floral gemstone inlay work', 'Mehtab Bagh sunset view across Yamuna River'],
    proTip: 'Enter through the East Gate at sunrise (06:00 AM) for golden morning light with minimal crowds and stunning photography.'
  },
  'kanaka durga': {
    name: 'Kanaka Durga Temple',
    city: 'Vijayawada',
    overview: 'Ancient temple dedicated to Goddess Kanaka Durga situated on Indrakeeladri Hill overlooking the Krishna River. A premier Shakti Peetham of South India.',
    howToGo: 'Located in Vijayawada city. Ropeway and Ghat Road Ghat lift available for direct hilltop ascent. Free Devasthanam shuttle buses from foot of the hill.',
    timings: 'Dharma Darshanam (Free): 04:00 AM to 09:00 PM. Mukha Mandapam: 05:00 AM to 08:30 PM.',
    entryFee: 'General Darshan: FREE. Special Entry Darshan: ₹100 / ₹300 tickets available at counter.',
    highlights: ['Panoramic view of Krishna River & Prakasam Barrage from hilltop', 'Free Prasadam distribution (Laddus & Pulihora)', 'Bhavani Island ferry ride nearby'],
    proTip: 'Traditional Indian attire mandatory. Free shoe stand and hair tonsuring (Kalyanakatta) available on the hill.'
  }
};

// 3. Main Intelligent AI Processing Engine
export const generateIntelligentChatReply = async (query, city = 'Varanasi', locationContext = 'Heritage Sight', language = 'en') => {
  const q = (query || '').toLowerCase().trim();
  const rawCity = (city || 'Varanasi').toLowerCase();

  let cityName = 'Varanasi';
  if (rawCity.includes('hyderabad')) cityName = 'Hyderabad';
  else if (rawCity.includes('vijayawada')) cityName = 'Vijayawada';
  else if (rawCity.includes('tirupati')) cityName = 'Tirupati';
  else if (rawCity.includes('jaipur')) cityName = 'Jaipur';
  else if (rawCity.includes('agra')) cityName = 'Agra';
  else if (rawCity.includes('goa')) cityName = 'Goa';
  else if (rawCity.includes('delhi')) cityName = 'Delhi';
  else if (rawCity.includes('amritsar')) cityName = 'Amritsar';
  else cityName = city.split(',')[0].trim();

  // A. Check if user wants to visit a specific landmark ("I want to go to Charminar", "take me to Golconda", "how to go to Taj Mahal")
  for (const [key, item] of Object.entries(LANDMARK_DB)) {
    if (q.includes(key) || q.includes(item.name.toLowerCase())) {
      return {
        category: `Guide: ${item.name} (${item.city})`,
        reply: `🗺️ Complete Guide to Visit ${item.name} in ${item.city}:

📍 About: ${item.overview}

🚖 How to Reach:
➔ ${item.howToGo}

⏰ Timings & Entry:
➔ Timings: ${item.timings}
➔ Entry Ticket: ${item.entryFee}

🌟 Must-Do Highlights:
${item.highlights.map(h => `• ${h}`).join('\n')}

💡 Pro-Tip for Visitors:
${item.proTip}`
      };
    }
  }

  // B. "I want to go to [somewhere]" pattern (Extract destination from user prompt)
  const wantToGoMatch = q.match(/(?:i want to go to|how to go to|how to reach|take me to|visit|travel to|go to)\s+([a-zA-Z\s]+)/i);
  if (wantToGoMatch && wantToGoMatch[1]) {
    const targetPlace = wantToGoMatch[1].replace(/[?.!]/g, '').trim();

    // Check if matching in landmark DB
    for (const [key, item] of Object.entries(LANDMARK_DB)) {
      if (targetPlace.toLowerCase().includes(key) || key.includes(targetPlace.toLowerCase())) {
        return {
          category: `Guide: ${item.name}`,
          reply: `🗺️ Guide for Visiting ${item.name}:
• 📍 Location: ${item.city}
• 🚖 How to Go: ${item.howToGo}
• ⏰ Timings: ${item.timings}
• 🎟️ Entry: ${item.entryFee}
• 💡 Recommendation: ${item.proTip}`
        };
      }
    }

    // Try fetching live Wikipedia knowledge for the searched target place
    const wikiData = await fetchWikipediaSummary(targetPlace + ' ' + cityName);
    if (wikiData) {
      return {
        category: `Destination Guide: ${wikiData.title}`,
        reply: `🗺️ Traveling to ${wikiData.title} in ${cityName}:

📍 Overview: ${wikiData.extract}

🚖 How to Go:
➔ Local Auto-Rickshaw / E-Rickshaw (nominal fares ₹30–₹60).
➔ App Cabs (Uber / Rapido) provide direct doorstep drop.
➔ Use Tourtec's 'Trip Plan & Map' tab for 1-click GPS navigation and instant booking.

⏰ Visiting Hours:
➔ General tourist hours: 09:00 AM – 06:00 PM daily.

💡 Traveler Tip: Keep comfortable walking footwear and sun protection handy!`
      };
    }
  }

  // C. 1-Day & 2-Day Itinerary / Travel Plan
  if (q.includes('itinerary') || q.includes('plan') || q.includes('1 day') || q.includes('2 day') || q.includes('schedule') || q.includes('what to see') || q.includes('places to visit') || q.includes('sightseeing')) {
    if (cityName === 'Hyderabad') {
      return {
        category: 'Hyderabad 1-Day Perfect Itinerary',
        reply: `🗺️ Perfect 1-Day Sightseeing Itinerary in Hyderabad:

🌅 Morning (08:30 AM – 11:30 AM):
• Start at historic Charminar & Mecca Masjid before crowds build up.
• Enjoy Irani Chai & Osmania Biscuits at Nimrah Cafe.
• Explore lacquer bangles & pearls at Laad Bazaar.

☀️ Midday (12:30 PM – 03:00 PM):
• Visit Salar Jung Museum (world's largest one-man collection).
• Lunch: Savor authentic Hyderabadi Dum Biryani at Shadab / Bawarchi.

🌆 Afternoon to Evening (03:30 PM – 08:00 PM):
• Explore the acoustic marvels of Golconda Fort.
• Watch the Sound & Light show at 06:30 PM.
• Sunset boat ride to the Buddha Statue at Hussain Sagar Lake!`
      };
    } else if (cityName === 'Vijayawada') {
      return {
        category: 'Vijayawada 1-Day Perfect Itinerary',
        reply: `🗺️ Perfect 1-Day Sightseeing Itinerary in Vijayawada:

🌅 Morning (06:00 AM – 09:30 AM):
• Morning Darshan at Sri Kanaka Durga Temple atop Indrakeeladri Hill.
• Breakfast: Hot Babai Hotel Idlis drenched in ghee & podi.

☀️ Midday (10:30 AM – 02:00 PM):
• Explore the 7th-century rock-cut Undavalli Caves.
• Lunch: Authentic spicy Andhra Banana Leaf Meals on MG Road.

🌆 Afternoon & Sunset (03:30 PM – 07:30 PM):
• Ferry ride to Bhavani Island on the Krishna River.
• Sunset walk and evening breeze at Prakasam Barrage!`
      };
    } else {
      return {
        category: 'Varanasi 1-Day Spiritual Itinerary',
        reply: `🗺️ Perfect 1-Day Spiritual Itinerary in Varanasi:

🌅 Sunrise (05:30 AM – 08:30 AM):
• Dawn sunrise boat ride on the Ganga from Assi Ghat to Manikarnika.
• Subah-e-Banaras morning music & yoga at Assi Ghat.
• Breakfast: Fresh Banarasi Kachori-Jalebi at Godowlia.

☀️ Midday (10:00 AM – 02:00 PM):
• Darshan at the sacred Kashi Vishwanath Jyotirlinga Temple Corridor.
• Visit peaceful Sarnath Deer Park & Dhamek Stupa (where Buddha gave his first sermon).

🌆 Evening (05:30 PM – 08:00 PM):
• Arrive at Dashashwamedh Ghat by 05:45 PM for the world-famous Grand Ganga Aarti.
• End with chilled Kulhad Malai Lassi and Banarasi Meetha Paan!`
      };
    }
  }

  // D. Hotels / Where to Stay / Accommodations
  if (q.includes('stay') || q.includes('hotel') || q.includes('room') || q.includes('lodge') || q.includes('resort') || q.includes('dharamshala') || q.includes('hostel') || q.includes('accommodation')) {
    if (cityName === 'Hyderabad') {
      return {
        category: 'Hyderabad Hotel & Stay Recommendations',
        reply: `🏨 Best Places to Stay in Hyderabad:
1. 🌟 Royal Luxury: Taj Falaknuma Palace (Heritage Nizam Palace) or ITC Kohenur (Hitech City).
2. 🏙️ Central & Upscale: Banjara Hills & Jubilee Hills (surrounded by premium cafes, shopping & metro).
3. 🛺 Budget & Cultural: Abids & Nampally (near Charminar and railway station, starting ₹800–₹1,500/night).
4. 💼 Tech & Modern: Gachibowli & Madhapur (modern business hotels with direct metro access).`
      };
    } else if (cityName === 'Vijayawada') {
      return {
        category: 'Vijayawada Hotel & Stay Recommendations',
        reply: `🏨 Best Places to Stay in Vijayawada:
1. 🕉️ Temple Pilgrim Cottages: Sri Durga Malleswara Devasthanam Choultries on Indrakeeladri hill (free/nominal ₹200–₹500).
2. 🌊 Riverfront & Luxury: Novotel Vijayawada Varun & Gateway Hotel on MG Road.
3. 🏝️ Eco-Resort: APTDC Haritha Resort at Bhavani Island (river island cottages).
4. 🚉 Budget & Transit: Besant Road & Railway Station area (starting ₹600–₹1,200/night).`
      };
    } else {
      return {
        category: 'Varanasi Hotel & Stay Recommendations',
        reply: `🏨 Best Places to Stay in Varanasi:
1. 🌊 Heritage Riverfront Havelis: BrijRama Palace (Darbhanga Ghat), Palace on Ganges (Assi Ghat).
2. 🎒 Backpacker & Cultural Hostels: Zostel Varanasi, Moustache near Assi Ghat (starting ₹450–₹1,200/night).
3. 🕉️ Temple Pilgrim Dharamshalas: Kashi Vishwanath Devasthanam Dharamshala near Gate #4.
4. 🚉 Luxury & Modern: Cantonment Area (Taj Ganges, Radisson) for quiet transit.`
      };
    }
  }

  // E. Shopping & Bazaars
  if (q.includes('shopping') || q.includes('buy') || q.includes('market') || q.includes('bazaar') || q.includes('pearl') || q.includes('silk') || q.includes('saree') || q.includes('handicraft')) {
    if (cityName === 'Hyderabad') {
      return {
        category: 'Shopping & Bazaars in Hyderabad',
        reply: `🛍️ Top Markets in Hyderabad:
1. 💍 Laad Bazaar: Famous for lacquer bangles, pearl jewelry, and bridal Zardozi work next to Charminar.
2. 🦪 Pathergatti Pearl Markets: Certified Basra and cultured Hyderabadi pearls with authenticity certificates.
3. 🎨 Shilparamam (Hitech City): Traditional terracotta, Bidri metal craft, and handloom textiles.`
      };
    } else if (cityName === 'Vijayawada') {
      return {
        category: 'Shopping in Vijayawada',
        reply: `🛍️ Top Markets in Vijayawada:
1. 🪵 Kondapalli Toy Village: Famous GI-tagged handcrafted wooden toys.
2. 👗 Mangalagiri Saree Market: Pure cotton and Nizam border silk sarees directly from master weavers.
3. 🛍️ Besant Road: Vibrant street shopping for Andhra sweets, pickles, and spices.`
      };
    } else {
      return {
        category: 'Shopping in Varanasi',
        reply: `🛍️ Top Shopping in Varanasi:
1. 👗 Banarasi Silk Sarees & Brocades: Thatheri Bazaar & Chowk (look for official Handloom Mark).
2. 🦚 Gulabi Meenakari: Rare pink enamel jewelry on silver unique to Varanasi.
3. 🪔 Brass Idols & Puja Items: Raja Ghat & Vishwanath Gali for hand-beaten Aarti lamps.`
      };
    }
  }

  // F. Dress Codes & Rules
  if (q.includes('dress') || q.includes('wear') || q.includes('etiquette') || q.includes('shoe') || q.includes('clothes') || q.includes('rules') || q.includes('camera') || q.includes('mobile')) {
    if (cityName === 'Hyderabad') {
      return {
        category: 'Etiquette in Hyderabad',
        reply: `🥻 Cultural Etiquette in Hyderabad:
1. 🕌 Mecca Masjid: Dress modestly covering shoulders and legs; headscarf recommended for women.
2. 🕉️ Birla Mandir: Footwear, cameras, and mobile phones must be deposited in free lockers at entrance.
3. 🏰 Charminar & Golconda Fort: Comfortable shoes recommended for stairs; cameras allowed with ticket.`
      };
    } else {
      return {
        category: `Temple Etiquette in ${cityName}`,
        reply: `🥻 Sacred Temple Dress Code & Etiquette in ${cityName}:
1. 👞 Footwear must be removed at the free Joota Ghar before entering.
2. 🥻 Dress modestly: Traditional attire (Dhoti/Kurta for men, Saree/Churidar for women). Western shorts and sleeveless tops prohibited.
3. 🔄 Circumambulate (Pradakshina) inside shrines in a clockwise direction.
4. 📱 Mobile phones should be deposited in cloakrooms or kept on silent.`
      };
    }
  }

  // G. Famous Food & Delicacies
  if (q.includes('food') || q.includes('eat') || q.includes('restaurant') || q.includes('dish') || q.includes('biryani') || q.includes('lassi') || q.includes('kachori') || q.includes('paan') || q.includes('sweet')) {
    if (cityName === 'Hyderabad') {
      return {
        category: 'Hyderabadi Food Guide',
        reply: `🍛 Iconic Hyderabadi Delicacies:
1. 🍗 Hyderabadi Dum Biryani: Paradise (Secunderabad), Bawarchi (RTC X Roads), Shah Ghouse (Charminar).
2. ☕ Irani Chai with Osmania Biscuits: Nimrah Cafe facing Charminar.
3. 🍲 Mutton Haleem & Marag: Pista House & Grand Hotel.
4. 🍮 Double Ka Meetha & Qubani Ka Meetha for dessert!`
      };
    } else if (cityName === 'Vijayawada') {
      return {
        category: 'Andhra Food Guide',
        reply: `🌶️ Vijayawada Local Delicacies:
1. 🍛 Traditional Andhra Thali: Hot rice with cow ghee and spicy Gongura Pachadi on banana leaf.
2. 🥟 Babai Hotel Idlis: Steaming hot soft Idlis drenched in pure ghee and podi.
3. 🌶️ Mirchi Bajji & Punugulu by the Krishna River.
4. 🍬 Pulla Reddy Pootharekulu (Paper Sweets).`
      };
    } else {
      return {
        category: 'Varanasi Food Guide',
        reply: `🍲 Authentic Varanasi Street Food:
1. 🥟 Hot Banarasi Kachori-Jalebi at Godowlia crossing (morning).
2. 🥛 Thick Malai Lassi in earthen Kulhad cups at Blue Lassi.
3. 🍅 Tamatar Chaat & Palak Chaat at Kashi Chaat Bhandar.
4. 🍃 Famous Banarasi Meetha Paan at Keshav Tambool Bhandar.`
      };
    }
  }

  // H. General Fallback with Live Wikipedia Query Integration
  const wikiFallback = await fetchWikipediaSummary(query + ' ' + cityName);
  if (wikiFallback) {
    return {
      category: `AI Knowledge: ${wikiFallback.title}`,
      reply: `💡 ${wikiFallback.title} (${cityName}):

${wikiFallback.extract}

🚖 Practical Travel Tip:
To explore ${wikiFallback.title} smoothly, you can use the 'Trip Plan & Map' tab to generate turn-by-turn routes and book local transit with 1-click!`
    };
  }

  // Final Intelligent Contextual Response
  return {
    category: `${cityName} Travel Assistant`,
    reply: `Namaste! Regarding "${query}" in ${cityName}:

I am your real-time AI Travel Guide. Here is what I can assist you with:
• 🗺️ How to visit any landmark (e.g. "I want to go to Charminar", "How to reach Golconda")
• 📅 Full 1-Day and 2-Day sightseeing itineraries
• 🏨 Best places to stay (Hotels, Heritage Havelis & Dharamshalas)
• 🛍️ Top shopping bazaars, pearls, silk & handicrafts
• 🥻 Temple dress codes and shoe counter rules
• 🍛 Famous street foods and authentic restaurants
• ⏰ Aarti, Darshan, and monument opening timings

Feel free to ask any question about ${cityName}!`
  };
};
