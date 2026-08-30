import React, { useState, useRef, useMemo } from 'react';
import {
  MapPin,
  Search,
  Filter,
  Calendar,
  Sparkles,
  ArrowRight,
  Shield,
  Clock,
  Compass,
  Star,
  ExternalLink,
  MessageSquare,
  Heart,
  Layers,
  ChevronDown,
  ChevronRight,
  X,
  Navigation,
  Globe,
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle,
  Eye,
  Radio,
  LocateFixed
} from 'lucide-react';
import { Destination, DestinationAttraction } from '../../types/smartTourTypes';
import { DEMO_DESTINATIONS, formatCurrency } from '../../services/smartTourApi';
import OsmInteractiveMap from './OsmInteractiveMap';

interface DestinationMapViewProps {
  currency: string;
  onPlanTripForDestination: (destName: string) => void;
  onAskAiToPlan?: (destName: string, stateName?: string) => void;
  onOpenTrackMate?: (destName: string) => void;
  currentUserLocation?: { latitude: number; longitude: number; accuracy?: number } | null;
}

// 21 Primary State Filters
const PRIMARY_STATES = [
  { id: 'ALL', label: 'All India', icon: '🇮🇳' },
  { id: 'Andhra Pradesh', label: 'Andhra Pradesh', icon: '🛕' },
  { id: 'Telangana', label: 'Telangana', icon: '🏰' },
  { id: 'Karnataka', label: 'Karnataka', icon: '🏛️' },
  { id: 'Kerala', label: 'Kerala', icon: '🌴' },
  { id: 'Tamil Nadu', label: 'Tamil Nadu', icon: '🛕' },
  { id: 'Goa', label: 'Goa', icon: '🏖️' },
  { id: 'Maharashtra', label: 'Maharashtra', icon: '🌊' },
  { id: 'Rajasthan', label: 'Rajasthan', icon: '👑' },
  { id: 'Gujarat', label: 'Gujarat', icon: '🦁' },
  { id: 'Uttar Pradesh', label: 'Uttar Pradesh', icon: '🕌' },
  { id: 'Madhya Pradesh', label: 'Madhya Pradesh', icon: '🐅' },
  { id: 'Himachal Pradesh', label: 'Himachal Pradesh', icon: '🏔️' },
  { id: 'Uttarakhand', label: 'Uttarakhand', icon: '🧘' },
  { id: 'Punjab', label: 'Punjab', icon: '🌾' },
  { id: 'West Bengal', label: 'West Bengal', icon: '🎭' },
  { id: 'Odisha', label: 'Odisha', icon: '☀️' },
  { id: 'Assam', label: 'Assam', icon: '🦏' },
  { id: 'Sikkim', label: 'Sikkim', icon: '🌸' },
  { id: 'Jammu & Kashmir', label: 'Jammu & Kashmir', icon: '❄️' },
  { id: 'Ladakh', label: 'Ladakh', icon: '🏔️' }
];

// All 28 States & 8 Union Territories grouped by region
const ALL_REGIONS_DATA: Record<string, string[]> = {
  'North India': [
    'Delhi',
    'Himachal Pradesh',
    'Jammu & Kashmir',
    'Ladakh',
    'Punjab',
    'Haryana',
    'Uttar Pradesh',
    'Uttarakhand',
    'Chandigarh'
  ],
  'South India': [
    'Andhra Pradesh',
    'Telangana',
    'Karnataka',
    'Kerala',
    'Tamil Nadu',
    'Puducherry',
    'Lakshadweep',
    'Andaman & Nicobar'
  ],
  'West India': [
    'Goa',
    'Gujarat',
    'Maharashtra',
    'Rajasthan',
    'Dadra & Nagar Haveli and Daman & Diu'
  ],
  'East India': [
    'Bihar',
    'Jharkhand',
    'Odisha',
    'West Bengal'
  ],
  'Central India': [
    'Madhya Pradesh',
    'Chhattisgarh'
  ],
  'North-East India': [
    'Assam',
    'Arunachal Pradesh',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Sikkim',
    'Tripura'
  ]
};

// Dynamic state description map
const STATE_DESCRIPTIONS: Record<string, { title: string; desc: string }> = {
  'ALL': {
    title: 'Explore Incredible India',
    desc: 'Curated royal forts, coastal beaches, UNESCO World Heritage monuments, Himalayan valleys, and sacred pilgrimage circuits across all Indian States and Union Territories.'
  },
  'Andhra Pradesh': {
    title: 'Explore Andhra Pradesh',
    desc: 'Discover Andhra Pradesh\'s coastal beauty, sacred Indrakeeladri Kanaka Durga shrine, world-famous Tirumala Balaji, ancient 7th-century Undavalli caves, and misty Araku Valley.'
  },
  'Telangana': {
    title: 'Explore Telangana',
    desc: 'Discover Telangana\'s 400-year-old Nizami heritage, majestic Golconda Fort acoustics, UNESCO Ramappa Temple with floating bricks, Charminar bazaars, and biryani culinary culture.'
  },
  'Karnataka': {
    title: 'Explore Karnataka',
    desc: 'Discover Karnataka\'s golden heritage — illuminated Mysore Palace, surreal UNESCO ruins of Hampi, lush Coorg coffee hills, and peaceful Gokarna beaches.'
  },
  'Kerala': {
    title: 'Explore Kerala (God\'s Own Country)',
    desc: 'Discover Kerala\'s tranquil Vembanad backwaters, overnight luxury houseboats, emerald Munnar tea estates, dramatic Varkala cliffs, and Periyar elephant sanctuaries.'
  },
  'Tamil Nadu': {
    title: 'Explore Tamil Nadu',
    desc: 'Discover Tamil Nadu\'s grand Dravidian temple architecture, towering Meenakshi Amman gopurams, coastal Mahabalipuram Shore Temple, Nilgiri toy train, and sacred Rameswaram.'
  },
  'Goa': {
    title: 'Explore Goa (Sun, Sand & Heritage)',
    desc: 'Discover Goa\'s pristine Arabian Sea beaches, Portuguese colonial churches in Old Goa, Dudhsagar 310m waterfalls, sunset cruises, and vibrant coastal culture.'
  },
  'Maharashtra': {
    title: 'Explore Maharashtra',
    desc: 'Discover Maharashtra\'s Maximum City Mumbai, UNESCO Ajanta & Ellora cave wonders with the monolithic Kailasa Temple, Sahyadri hill forts, and strawberry valleys.'
  },
  'Rajasthan': {
    title: 'Explore Royal Rajasthan (Land of Kings)',
    desc: 'Discover Rajasthan\'s grand desert citadels, pink palaces of Jaipur, shimmering lakes of Udaipur, blue alleys of Jodhpur, and golden sand dunes of Jaisalmer.'
  },
  'Gujarat': {
    title: 'Explore Gujarat',
    desc: 'Discover Gujarat\'s 182-meter Statue of Unity, Asiatic Lions in Gir, shimmering white salt desert of Kutch, historic Sabarmati Ashram, and sacred Dwarka & Somnath.'
  },
  'Uttar Pradesh': {
    title: 'Explore Uttar Pradesh',
    desc: 'Discover Uttar Pradesh\'s world wonder Taj Mahal in Agra, sacred Ganga Aarti in ancient Kashi (Varanasi), grand Ram Mandir in Ayodhya, and Awadhi culture in Lucknow.'
  },
  'Madhya Pradesh': {
    title: 'Explore Madhya Pradesh (Heart of Incredible India)',
    desc: 'Discover Madhya Pradesh\'s UNESCO erotic sculptures of Khajuraho, sacred Mahakaleshwar Jyotirlinga in Ujjain, Sanchi Buddhist stupa, and royal lakes of Bhopal.'
  },
  'Himachal Pradesh': {
    title: 'Explore Himachal Pradesh (Land of the Gods)',
    desc: 'Discover Himachal Pradesh\'s snow-clad Himalayan peaks, Solang Valley adventure in Manali, colonial Ridge of Shimla, Dalai Lama\'s McLeod Ganj, and mystic Spiti Valley.'
  },
  'Uttarakhand': {
    title: 'Explore Uttarakhand (Devbhoomi)',
    desc: 'Discover Uttarakhand\'s holy Ganga river rafting in Rishikesh, Har Ki Pauri evening aarti in Haridwar, emerald lakes of Nainital, and high Himalayan Char Dham pilgrimages.'
  },
  'Punjab': {
    title: 'Explore Punjab (Land of Five Rivers)',
    desc: 'Discover Punjab\'s shimmering Golden Temple in Amritsar, patriotic Wagah Border beating retreat ceremony, royal Patiala palaces, and legendary hearty Punjabi food.'
  },
  'West Bengal': {
    title: 'Explore West Bengal (City of Joy & Himalayas)',
    desc: 'Discover West Bengal\'s colonial Victoria Memorial in Kolkata, sunrise over Kanchenjunga in Darjeeling with the toy train, and Royal Bengal Tigers in Sundarbans mangroves.'
  },
  'Odisha': {
    title: 'Explore Odisha (Soul of Incredible India)',
    desc: 'Discover Odisha\'s sacred Jagannath Temple in Puri, 13th-century UNESCO Sun Temple at Konark, Kalinga temples of Bhubaneswar, and dolphin lagoons of Chilika Lake.'
  },
  'Assam': {
    title: 'Explore Assam (Gateway to the North-East)',
    desc: 'Discover Assam\'s UNESCO Kaziranga National Park home to the great one-horned rhino, sacred Kamakhya Temple on Nilachal Hill, and mighty Brahmaputra river island of Majuli.'
  },
  'Sikkim': {
    title: 'Explore Sikkim (Organic Himalayan Kingdom)',
    desc: 'Discover Sikkim\'s crystal glacial Tsomgo Lake at 12,400 ft, Nathula Pass Silk Route, Rumtek Monastery chants, and Kanchenjunga glass skywalk views in Pelling.'
  },
  'Jammu & Kashmir': {
    title: 'Explore Jammu & Kashmir (Paradise on Earth)',
    desc: 'Discover Kashmir\'s Dal Lake shikara rides, world-highest Gulmarg Gondola at 13,780 ft, pristine Betaab Valley in Pahalgam, and tranquil Mughal terraced gardens.'
  },
  'Ladakh': {
    title: 'Explore Ladakh (Land of High Passes)',
    desc: 'Discover Ladakh\'s turquoise Pangong Lake, double-humped camel desert safaris in Nubra Valley, Khardung La at 17,982 ft, and dramatic cliffside Buddhist gompas.'
  },
  'Delhi': {
    title: 'Explore Delhi (National Capital Territory)',
    desc: 'Discover Delhi\'s 17th-century Mughal Red Fort, 73m Qutub Minar, India Gate ceremonial avenue, Lotus Temple, and centuries-old Chandni Chowk street food lanes.'
  },
  'Meghalaya': {
    title: 'Explore Meghalaya (Abode of Clouds)',
    desc: 'Discover Meghalaya\'s double-decker living root bridges bio-engineered in rainforests, crystal glass waters of Dawki Umngot river, and Nohkalikai 1,115 ft waterfalls.'
  },
  'Bihar': {
    title: 'Explore Bihar (Cradle of Ancient Civilizations)',
    desc: 'Discover Bihar\'s UNESCO Mahabodhi Temple where Buddha attained enlightenment under the Bodhi Tree, and the world\'s oldest residential university ruins at Nalanda.'
  },
  'Andaman & Nicobar': {
    title: 'Explore Andaman & Nicobar Islands',
    desc: 'Discover Andaman\'s Asia-best Radhanagar Beach on Havelock Island, coral reef scuba diving, bioluminescent night waters, and historic Cellular Jail.'
  },
  'Puducherry': {
    title: 'Explore Puducherry (French Riviera of the East)',
    desc: 'Discover Puducherry\'s mustard French colonial White Town, golden sphere Matrimandir of Auroville, Promenade Beach, and seaside cafes.'
  },
  'Chandigarh': {
    title: 'Explore Chandigarh (The City Beautiful)',
    desc: 'Discover Chandigarh\'s Le Corbusier modernist architecture, surreal 40-acre Nek Chand Rock Garden made from recycled waste, and Sukhna Lake.'
  },
  'Arunachal Pradesh': {
    title: 'Explore Arunachal Pradesh (Dawn-Lit Mountains)',
    desc: 'Discover Arunachal\'s 400-year-old Tawang Monastery at 10,000 ft, Sela Pass at 13,700 ft, and lush Ziro Valley of the Apatani tribe.'
  }
};

const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'heritage', label: '🏛️ Heritage & Palaces' },
  { id: 'beach', label: '🏖️ Beaches & Coastal' },
  { id: 'nature', label: '🌿 Nature & Wildlife' },
  { id: 'spiritual', label: '🛕 Spiritual & Temples' },
  { id: 'hill', label: '⛰️ Hill Stations' },
  { id: 'adventure', label: '🧗 Adventure' },
  { id: 'food', label: '🍲 Food & Culture' },
  { id: 'unesco', label: '🏆 UNESCO World Heritage' }
];

export const DestinationMapView: React.FC<DestinationMapViewProps> = ({
  currency,
  onPlanTripForDestination,
  onAskAiToPlan,
  onOpenTrackMate,
  currentUserLocation
}) => {
  const [destinations] = useState<Destination[]>(DEMO_DESTINATIONS);
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'budget_asc' | 'budget_desc' | 'name'>('rating');
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const [showAllStatesModal, setShowAllStatesModal] = useState(false);
  const [stateModalSearch, setStateModalSearch] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('smarttour_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Map state
  const [mapCenter, setMapCenter] = useState<{ lat: number; lon: number } | null>(null);
  const [mapZoom, setMapZoom] = useState<number>(5);
  const [showMap, setShowMap] = useState<boolean>(true);
  const mapSectionRef = useRef<HTMLDivElement>(null);

  // Toggle favorite
  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = favorites.includes(id)
      ? favorites.filter(f => f !== id)
      : [...favorites, id];
    setFavorites(updated);
    try {
      localStorage.setItem('smarttour_favorites', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  // Reusable filtering logic
  const filtered = useMemo(() => {
    return destinations.filter((d) => {
      // 1. State Filter
      const matchesState =
        selectedState === 'ALL' ||
        d.state.toLowerCase() === selectedState.toLowerCase() ||
        (selectedState === 'Andaman & Nicobar' && d.state.includes('Andaman')) ||
        (selectedState === 'Jammu & Kashmir' && d.state.includes('Kashmir'));

      // 2. Search Query (within state)
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.state.toLowerCase().includes(q) ||
        (d.city && d.city.toLowerCase().includes(q)) ||
        d.description.toLowerCase().includes(q) ||
        d.tags?.some((t) => t.toLowerCase().includes(q)) ||
        d.attractions?.some((a) => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q));

      // 3. Category Filter
      let matchesCategory = true;
      if (selectedCategory !== 'all') {
        const cat = selectedCategory.toLowerCase();
        const dCat = (d.category || '').toLowerCase();
        const tags = (d.tags || []).join(' ').toLowerCase();

        if (cat === 'heritage') {
          matchesCategory = dCat.includes('heritage') || dCat.includes('palace') || dCat.includes('fort') || tags.includes('palace') || tags.includes('fort');
        } else if (cat === 'beach') {
          matchesCategory = dCat.includes('beach') || dCat.includes('coastal') || dCat.includes('island') || tags.includes('beach');
        } else if (cat === 'nature') {
          matchesCategory = dCat.includes('nature') || dCat.includes('wildlife') || dCat.includes('park') || dCat.includes('tea') || tags.includes('nature');
        } else if (cat === 'spiritual') {
          matchesCategory = dCat.includes('spiritual') || dCat.includes('temple') || dCat.includes('pilgrimage') || dCat.includes('buddhist') || tags.includes('temple');
        } else if (cat === 'hill') {
          matchesCategory = dCat.includes('hill') || dCat.includes('mountain') || dCat.includes('alpine') || tags.includes('hill') || tags.includes('snow');
        } else if (cat === 'adventure') {
          matchesCategory = dCat.includes('adventure') || dCat.includes('desert') || dCat.includes('trekking') || tags.includes('adventure') || tags.includes('safari');
        } else if (cat === 'food') {
          matchesCategory = dCat.includes('food') || dCat.includes('culture') || tags.includes('food') || tags.includes('biryani');
        } else if (cat === 'unesco') {
          matchesCategory = dCat.includes('unesco') || tags.includes('unesco');
        }
      }

      return matchesState && matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 4.5) - (a.rating || 4.5);
      if (sortBy === 'budget_asc') return (a.avgDailyBudgetInr || 2000) - (b.avgDailyBudgetInr || 2000);
      if (sortBy === 'budget_desc') return (b.avgDailyBudgetInr || 2000) - (a.avgDailyBudgetInr || 2000);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [destinations, selectedState, search, selectedCategory, sortBy]);

  // Total attractions count
  const totalAttractionsCount = useMemo(() => {
    return filtered.reduce((acc, d) => acc + (d.attractions?.length || 0), 0);
  }, [filtered]);

  // Helper for Attraction Chip styles & category icons
  const getAttractionChipStyle = (category?: string) => {
    const cat = (category || '').toLowerCase();
    // Temple / Spiritual
    if (cat.includes('temple') || cat.includes('spiritual') || cat.includes('religious') || cat.includes('shakti') || cat.includes('jyotirlinga') || cat.includes('buddhist') || cat.includes('monastery') || cat.includes('gurdwara')) {
      return {
        background: '#FFF7ED',
        color: '#C2410C',
        border: '1px solid #FED7AA',
        fontWeight: 600,
        icon: '🛕'
      };
    }
    // Nature / Wildlife / Park / Hill / Waterfall
    if (cat.includes('nature') || cat.includes('wildlife') || cat.includes('park') || cat.includes('forest') || cat.includes('waterfall') || cat.includes('falls') || cat.includes('garden') || cat.includes('tea') || cat.includes('hill')) {
      return {
        background: '#F0FDF4',
        color: '#15803D',
        border: '1px solid #BBF7D0',
        fontWeight: 600,
        icon: '🌿'
      };
    }
    // Beach / Coastal / Lake / Island
    if (cat.includes('beach') || cat.includes('coastal') || cat.includes('island') || cat.includes('lake') || cat.includes('river') || cat.includes('backwater') || cat.includes('boating') || cat.includes('sea') || cat.includes('lagoon')) {
      return {
        background: '#ECFEFF',
        color: '#0E7490',
        border: '1px solid #A5F3FC',
        fontWeight: 600,
        icon: '🏖️'
      };
    }
    // Heritage / Royal / Fort / Palace / Museum / UNESCO
    if (cat.includes('heritage') || cat.includes('royal') || cat.includes('palace') || cat.includes('fort') || cat.includes('monument') || cat.includes('unesco') || cat.includes('museum') || cat.includes('archaeology') || cat.includes('cave')) {
      return {
        background: '#FEFCE8',
        color: '#A16207',
        border: '1px solid #FDE68A',
        fontWeight: 600,
        icon: '🏛️'
      };
    }
    // Adventure / Sports / Trek
    if (cat.includes('adventure') || cat.includes('sport') || cat.includes('trek') || cat.includes('snow') || cat.includes('ski') || cat.includes('rafting') || cat.includes('pass') || cat.includes('skywalk') || cat.includes('desert')) {
      return {
        background: '#F5F3FF',
        color: '#6D28D9',
        border: '1px solid #DDD6FE',
        fontWeight: 600,
        icon: '⛰️'
      };
    }
    // General / Default
    return {
      background: '#EFF6FF',
      color: '#1D4ED8',
      border: '1px solid #BFDBFE',
      fontWeight: 600,
      icon: '📍'
    };
  };

  // Handle focusing map on a specific destination
  const handleFocusOnMap = (lat: number, lon: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setMapCenter({ lat, lon });
    setMapZoom(13);
    setShowMap(true);
    mapSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Handle focusing map specifically on an exact attraction (closer zoom 17)
  const handleFocusOnAttraction = (lat?: number, lon?: number, name?: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lat != null && lon != null) {
      setMapCenter({ lat, lon });
      setMapZoom(17); // Close zoom 17 for specific attraction
      setShowMap(true);
      mapSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // State selection handler
  const handleSelectState = (stateId: string) => {
    setSelectedState(stateId);
    setSearch('');
    // Adjust map view to the first destination in that state if available
    const match = destinations.find(d => stateId === 'ALL' ? true : d.state.toLowerCase() === stateId.toLowerCase());
    if (match) {
      setMapCenter({ lat: match.location.latitude, lon: match.location.longitude });
      setMapZoom(stateId === 'ALL' ? 5 : 8);
    }
  };

  // Current header info
  const headerInfo = STATE_DESCRIPTIONS[selectedState] || {
    title: `Explore ${selectedState}`,
    desc: `Discover ${selectedState}'s rich heritage, culture, cities, and natural attractions.`
  };

  // Map markers from filtered list (both destination and verified individual attractions)
  const mapMarkers = useMemo(() => {
    const list: any[] = [];
    filtered.forEach(d => {
      // 1. Destination marker (🟠 Orange)
      list.push({
        id: d.id,
        latitude: d.location.latitude,
        longitude: d.location.longitude,
        label: d.name,
        cityName: d.city,
        stateName: d.state,
        markerType: 'destination',
        category: d.category,
        rating: d.rating,
        description: d.description
      });

      // 2. Individual verified attraction markers (🟣 Purple)
      d.attractions?.forEach((a, idx) => {
        const aLat = a.latitude || a.coordinates?.latitude;
        const aLon = a.longitude || a.coordinates?.longitude;
        if (aLat != null && aLon != null) {
          list.push({
            id: `${d.id}-attraction-${idx}`,
            latitude: aLat,
            longitude: aLon,
            label: a.name,
            cityName: d.city,
            stateName: d.state,
            markerType: 'attraction',
            category: a.category,
            rating: d.rating,
            description: a.description
          });
        }
      });
    });
    return list;
  }, [filtered]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1280, margin: '0 auto', paddingBottom: 40 }}>
      
      {/* ── 1. STATE FILTERS HEADER SECTION ── */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        
        {/* Dynamic Title & Counter */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span className="badge badge-primary" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem' }}>
                <Globe size={14} /> {selectedState === 'ALL' ? 'All India Explorer' : selectedState}
              </span>
              <span className="badge badge-safe" style={{ fontSize: '0.8rem' }}>
                ✓ Live Data-Driven
              </span>
            </div>
            <h2 className="gradient-text" style={{ fontSize: '2.3rem', fontWeight: 900, marginTop: 10, letterSpacing: '-0.03em' }}>
              {headerInfo.title}
            </h2>
            <p style={{ fontSize: '0.98rem', color: 'var(--text-secondary)', marginTop: 6, maxWidth: 860, lineHeight: 1.65, fontWeight: 500 }}>
              {headerInfo.desc}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="badge badge-saffron" style={{ fontSize: '0.9rem', padding: '8px 18px', fontWeight: 800, background: 'linear-gradient(135deg, #FFF7ED, #FEF3C7)', border: '1.5px solid #FDBA74', color: '#C2410C', boxShadow: '0 4px 14px rgba(249, 115, 22, 0.15)' }}>
              ✨ {filtered.length} Destinations • {totalAttractionsCount} Attractions
            </span>
          </div>
        </div>

        {/* Primary State Filter Buttons Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto', paddingBottom: 8, paddingTop: 4 }}>
          {PRIMARY_STATES.map((st) => {
            const isActive = selectedState === st.id;
            return (
              <button
                key={st.id}
                onClick={() => handleSelectState(st.id)}
                className={`chip ${isActive ? 'active' : ''}`}
                style={{
                  flexShrink: 0,
                  fontSize: '0.88rem',
                  padding: '8px 16px',
                  fontWeight: 750,
                  borderRadius: 'var(--radius-full)',
                  border: isActive ? '1.5px solid #2563EB' : '1.5px solid var(--border)',
                  background: isActive ? 'linear-gradient(135deg, #2563EB, #1D4ED8)' : 'var(--surface)',
                  color: isActive ? '#FFFFFF' : 'var(--text-primary)',
                  boxShadow: isActive ? '0 4px 14px rgba(37, 99, 235, 0.35)' : '0 2px 5px rgba(15, 23, 42, 0.04)',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{st.icon}</span>
                <span>{st.label}</span>
              </button>
            );
          })}

          {/* "+ And More" Button */}
          <button
            onClick={() => setShowAllStatesModal(true)}
            className="chip"
            style={{
              flexShrink: 0,
              fontSize: '0.88rem',
              padding: '8px 18px',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #EA580C, #2563EB)',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(234, 88, 12, 0.3)'
            }}
            title="Browse all 28 States & 8 Union Territories"
          >
            <span>+ And More (All 36 States & UTs)</span>
          </button>
        </div>

        {/* Search, Category, and Sorting Control Bar */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', paddingTop: 12, borderTop: '1.5px solid var(--border-subtle)' }}>
          
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1 1 280px' }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={selectedState === 'ALL' ? 'Search Charminar, Taj Mahal, Goa beaches, Munnar...' : `Search within ${selectedState}...`}
              className="input-field"
              style={{ paddingLeft: 40, paddingRight: 32, fontSize: '0.95rem', fontWeight: 600 }}
            />
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div style={{ flex: '0 0 auto' }}>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
              style={{ fontSize: '0.9rem', fontWeight: 700, padding: '9px 14px', minWidth: 175 }}
            >
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div style={{ flex: '0 0 auto' }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="input-field"
              style={{ fontSize: '0.9rem', fontWeight: 700, padding: '9px 14px', minWidth: 160 }}
            >
              <option value="rating">⭐ Top Rated</option>
              <option value="budget_asc">💰 Budget: Low to High</option>
              <option value="budget_desc">💎 Budget: High to Low</option>
              <option value="name">🔤 Name (A-Z)</option>
            </select>
          </div>

          {/* Toggle Map View Button */}
          <button
            onClick={() => setShowMap(!showMap)}
            className={`btn ${showMap ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '9px 16px', fontSize: '0.88rem', fontWeight: 750, marginLeft: 'auto' }}
          >
            <Compass size={16} />
            <span>{showMap ? 'Hide Map' : 'Show Map'}</span>
          </button>
        </div>

      </div>

      {/* ── 2. INTERACTIVE OPENSTREETMAP SECTION ── */}
      {showMap && (
        <div ref={mapSectionRef} className="glass-panel" style={{ padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <MapPin size={16} color="#6366f1" />
              <strong style={{ fontSize: '0.95rem' }}>
                Interactive Geographic Map ({mapMarkers.length} Locations Pinned)
              </strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {currentUserLocation && (
                <button
                  onClick={() => {
                    setMapCenter({ lat: currentUserLocation.latitude, lon: currentUserLocation.longitude });
                    setMapZoom(15);
                  }}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.76rem', padding: '4px 10px', color: '#3b82f6', borderColor: 'rgba(59,130,246,0.3)', background: 'rgba(59,130,246,0.06)' }}
                  title="Center map on your live GPS location"
                >
                  <LocateFixed size={12} />
                  <span>My Live GPS</span>
                </button>
              )}
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Click any pin or "Map" button on cards to zoom in
              </span>
            </div>
          </div>

          <OsmInteractiveMap
            markers={mapMarkers}
            center={mapCenter || (mapMarkers[0] ? { lat: mapMarkers[0].latitude, lon: mapMarkers[0].longitude } : { lat: 20.5937, lon: 78.9629 })}
            zoom={mapZoom}
            height={320}
            currentUserLocation={currentUserLocation}
          />
        </div>
      )}

      {/* ── 3. DESTINATION CARDS GRID ── */}
      {filtered.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <AlertCircle size={40} color="#f59e0b" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            No destinations found in {selectedState === 'ALL' ? 'India' : selectedState}
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', maxWidth: 500 }}>
            {search
              ? `No destinations matching "${search}" were found in ${selectedState}. Try clearing your search or switching to All India.`
              : `No destinations matching category "${selectedCategory}".`}
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            {search && (
              <button onClick={() => setSearch('')} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
                Clear Search
              </button>
            )}
            {selectedState !== 'ALL' && (
              <button onClick={() => handleSelectState('ALL')} className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
                Search Across All India
              </button>
            )}
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 22 }}>
          {filtered.map((dest) => {
            const isFav = favorites.includes(dest.id);

            return (
              <div
                key={dest.id}
                className="glass-panel-interactive"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  padding: 0,
                  borderRadius: 'var(--radius-md)',
                  position: 'relative',
                  background: '#ffffff',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
                }}
                onClick={() => setSelectedDest(dest)}
              >
                {/* Image Header with Gradient Overlay */}
                <div style={{ position: 'relative', height: 210, width: '100%', overflow: 'hidden' }}>
                  <img
                    src={dest.imageUrl}
                    alt={dest.name}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80';
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 0.92) 0%, rgba(15, 23, 42, 0.2) 60%, transparent 100%)' }} />
                  
                  {/* State & Category Badges */}
                  <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <span
                      style={{
                        background: '#DBEAFE',
                        color: '#1D4ED8',
                        border: '1px solid #93C5FD',
                        fontWeight: 600,
                        fontSize: '0.74rem',
                        padding: '3px 10px',
                        borderRadius: 'var(--radius-full)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.25)'
                      }}
                    >
                      <MapPin size={11} /> {dest.state}
                    </span>
                    {dest.category && (
                      <span
                        style={{
                          background: '#ECFDF5',
                          color: '#047857',
                          border: '1px solid #A7F3D0',
                          fontWeight: 600,
                          fontSize: '0.72rem',
                          padding: '3px 9px',
                          borderRadius: 'var(--radius-full)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.25)'
                        }}
                      >
                        {dest.category}
                      </span>
                    )}
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => toggleFavorite(dest.id, e)}
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      width: 34,
                      height: 34,
                      borderRadius: '50%',
                      background: 'rgba(15, 23, 42, 0.85)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: isFav ? '#fb7185' : '#ffffff'
                    }}
                    title={isFav ? 'Remove from favorites' : 'Save destination'}
                  >
                    <Heart size={16} fill={isFav ? '#fb7185' : 'transparent'} />
                  </button>

                  {/* Title & Rating on image */}
                  <div style={{ position: 'absolute', bottom: 12, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em', textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>
                        {dest.name}
                      </h3>
                      {dest.city && dest.city !== dest.name && (
                        <div style={{ fontSize: '0.76rem', color: '#E2E8F0', fontWeight: 500 }}>{dest.city}</div>
                      )}
                    </div>
                    
                    {dest.rating && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          background: '#FEF3C7',
                          color: '#92400E',
                          border: '1px solid #FDE68A',
                          padding: '3px 9px',
                          borderRadius: 'var(--radius-full)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.25)'
                        }}
                      >
                        <Star size={12} fill="#D97706" color="#D97706" />
                        <span style={{ fontSize: '0.82rem', fontWeight: 800 }}>{dest.rating}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Body */}
                <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                  
                  {/* Description */}
                  <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 }}>
                    {dest.description}
                  </p>

                  {/* KEY ATTRACTIONS Preview Chips */}
                  {dest.attractions && dest.attractions.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ fontSize: '0.75rem', color: '#334155', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                        KEY ATTRACTIONS:
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {dest.attractions.slice(0, 3).map((a, i) => {
                          const chipStyle = getAttractionChipStyle(a.category);
                          const aLat = a.latitude || a.coordinates?.latitude;
                          const aLon = a.longitude || a.coordinates?.longitude;
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={(e) => handleFocusOnAttraction(aLat, aLon, a.name, e)}
                              style={{
                                fontSize: '0.74rem',
                                padding: '3px 9px',
                                borderRadius: 'var(--radius-sm)',
                                background: chipStyle.background,
                                border: chipStyle.border,
                                color: chipStyle.color,
                                fontWeight: chipStyle.fontWeight,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                cursor: 'pointer',
                                transition: 'transform 0.15s, box-shadow 0.15s'
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
                              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                              title={`Click to center map on ${a.name}`}
                            >
                              <span>{chipStyle.icon}</span>
                              <span>{a.name}</span>
                            </button>
                          );
                        })}
                        {dest.attractions.length > 3 && (
                          <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600, alignSelf: 'center' }}>
                            +{dest.attractions.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {dest.tags && (
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 2 }}>
                      {dest.tags.slice(0, 3).map((t, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '0.7rem',
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-full)',
                            background: '#F1F5F9',
                            color: '#334155',
                            border: '1px solid #CBD5E1',
                            fontWeight: 600
                          }}
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer Meta & Actions */}
                  <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontSize: '0.68rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Daily Budget</div>
                      <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#059669' }}>
                        {dest.avgDailyBudgetInr ? formatCurrency(dest.avgDailyBudgetInr, currency) : '₹2,500'}
                        <span style={{ fontSize: '0.72rem', fontWeight: 500, color: '#64748B' }}>/day</span>
                      </div>
                    </div>

                    {/* Action Buttons Group */}
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      {/* Map Focus */}
                      <button
                        type="button"
                        onClick={(e) => handleFocusOnMap(dest.location.latitude, dest.location.longitude, e)}
                        className="btn btn-secondary"
                        style={{ padding: '6px 9px', fontSize: '0.75rem' }}
                        title="Center map on destination"
                      >
                        <MapPin size={12} />
                      </button>

                      {/* Ask AI */}
                      {onAskAiToPlan && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAskAiToPlan(dest.name, dest.state);
                          }}
                          className="btn btn-secondary"
                          style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                          title="Ask AI Assistant about this destination"
                        >
                          <MessageSquare size={12} />
                          <span>AI</span>
                        </button>
                      )}

                      {/* TrackMate Family Tracking */}
                      {onOpenTrackMate && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenTrackMate(dest.name);
                          }}
                          className="btn btn-secondary"
                          style={{ padding: '6px 9px', fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}
                          title="Track family live at this destination"
                        >
                          <Radio size={12} />
                          <span>Track</span>
                        </button>
                      )}

                      {/* Plan Trip */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onPlanTripForDestination(dest.name);
                        }}
                        className="btn btn-primary"
                        style={{ padding: '6px 12px', fontSize: '0.78rem', fontWeight: 700 }}
                      >
                        <Sparkles size={12} />
                        <span>Plan Trip</span>
                      </button>
                    </div>

                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ── 4. "ALL STATES & UNION TERRITORIES" BROWSER MODAL ── */}
      {showAllStatesModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            zIndex: 110
          }}
          onClick={() => setShowAllStatesModal(false)}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: 780,
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              padding: 24,
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Explore All States & UTs</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  Select any state or union territory across India
                </p>
              </div>
              <button
                onClick={() => setShowAllStatesModal(false)}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: 'none',
                  color: 'var(--text-main)',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>

            {/* Search within Modal */}
            <div style={{ position: 'relative', marginBottom: 16 }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search state name or region..."
                value={stateModalSearch}
                onChange={(e) => setStateModalSearch(e.target.value)}
                className="input"
                style={{ paddingLeft: 36 }}
              />
            </div>

            {/* Region-grouped Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <button
                onClick={() => {
                  handleSelectState('ALL');
                  setShowAllStatesModal(false);
                }}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'left',
                  background: selectedState === 'ALL' ? '#1D4ED8' : '#F8FAFC',
                  border: '1px solid #BFDBFE',
                  color: selectedState === 'ALL' ? '#ffffff' : '#1D4ED8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontWeight: 700
                }}
              >
                <span>🇮🇳 All India (All States)</span>
                <ChevronRight size={14} />
              </button>

              {Object.entries(ALL_REGIONS_DATA).map(([region, stateList]) => {
                const filteredStates = stateList.filter(s =>
                  !stateModalSearch || s.toLowerCase().includes(stateModalSearch.toLowerCase())
                );

                if (filteredStates.length === 0) return null;

                return (
                  <div key={region} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {region}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
                      {filteredStates.map((st) => {
                        const count = destinations.filter(d => d.state.toLowerCase() === st.toLowerCase()).length;
                        const isSelected = selectedState.toLowerCase() === st.toLowerCase();

                        return (
                          <button
                            key={st}
                            onClick={() => {
                              handleSelectState(st);
                              setShowAllStatesModal(false);
                            }}
                            style={{
                              padding: '10px 14px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              background: isSelected ? '#EFF6FF' : '#F8FAFC',
                              border: isSelected ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
                              borderRadius: 'var(--radius-sm)',
                              cursor: 'pointer',
                              textAlign: 'left',
                              color: isSelected ? '#1D4ED8' : '#334155',
                              fontWeight: isSelected ? 700 : 500
                            }}
                          >
                            <span style={{ fontSize: '0.86rem' }}>{st}</span>
                            {count > 0 ? (
                              <span style={{ fontSize: '0.7rem', padding: '1px 6px', borderRadius: 6, background: '#DCFCE7', color: '#15803D', fontWeight: 700 }}>
                                {count}
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.68rem', color: '#94A3B8' }}>
                                Explore
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}

      {/* ── 5. DESTINATION DETAIL MODAL ── */}
      {selectedDest && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            zIndex: 120
          }}
          onClick={() => setSelectedDest(null)}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: 720,
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: 0,
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 25px 80px rgba(0,0,0,0.7)',
              background: '#ffffff',
              border: '1px solid #E2E8F0'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Header */}
            <div style={{ position: 'relative', height: 280 }}>
              <img
                src={selectedDest.imageUrl}
                alt={selectedDest.name}
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80';
                }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, transparent 60%)' }} />
              
              <button
                onClick={() => setSelectedDest(null)}
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  background: 'rgba(0,0,0,0.7)',
                  border: 'none',
                  color: '#fff',
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>

              <div style={{ position: 'absolute', bottom: 20, left: 24, right: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ background: '#DBEAFE', color: '#1D4ED8', border: '1px solid #93C5FD', fontWeight: 600, fontSize: '0.76rem', padding: '3px 10px', borderRadius: 'var(--radius-full)' }}>
                    📍 {selectedDest.state}, India
                  </span>
                  {selectedDest.category && (
                    <span style={{ background: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0', fontWeight: 600, fontSize: '0.74rem', padding: '3px 10px', borderRadius: 'var(--radius-full)' }}>
                      {selectedDest.category}
                    </span>
                  )}
                  {selectedDest.rating && (
                    <span style={{ background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A', fontWeight: 700, fontSize: '0.76rem', padding: '3px 10px', borderRadius: 'var(--radius-full)' }}>
                      ⭐ {selectedDest.rating} Rating
                    </span>
                  )}
                </div>
                <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: 6, color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                  {selectedDest.name}
                </h2>
              </div>
            </div>

            {/* Modal Content Details */}
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, color: '#0F172A' }}>
              
              <p style={{ fontSize: '0.94rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                {selectedDest.description}
              </p>

              {/* Highlights List */}
              {selectedDest.highlights && selectedDest.highlights.length > 0 && (
                <div style={{ background: '#F8FAFC', padding: '14px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1D4ED8', textTransform: 'uppercase', marginBottom: 8 }}>
                    ✨ Key Highlights & Experiences:
                  </div>
                  <ul style={{ paddingLeft: 18, margin: 0, fontSize: '0.85rem', color: '#334155', lineHeight: 1.6 }}>
                    {selectedDest.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Verified Top Attractions List */}
              {selectedDest.attractions && selectedDest.attractions.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                    📍 Verified Attractions ({selectedDest.attractions.length})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {selectedDest.attractions.map((a, i) => {
                      const chipStyle = getAttractionChipStyle(a.category);
                      const aLat = a.latitude || a.coordinates?.latitude;
                      const aLon = a.longitude || a.coordinates?.longitude;

                      return (
                        <div
                          key={i}
                          style={{
                            padding: '12px 14px',
                            background: '#F8FAFC',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid #E2E8F0',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            gap: 12
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                              <strong style={{ fontSize: '0.94rem', color: '#0F172A' }}>{a.name}</strong>
                              <span
                                style={{
                                  fontSize: '0.72rem',
                                  padding: '2px 8px',
                                  borderRadius: 'var(--radius-full)',
                                  background: chipStyle.background,
                                  border: chipStyle.border,
                                  color: chipStyle.color,
                                  fontWeight: 600
                                }}
                              >
                                {chipStyle.icon} {a.category}
                              </span>
                              {a.accessible && (
                                <span style={{ fontSize: '0.68rem', padding: '2px 7px', borderRadius: 'var(--radius-full)', background: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0', fontWeight: 600 }}>
                                  ♿ Accessible
                                </span>
                              )}
                            </div>
                            <p style={{ fontSize: '0.84rem', color: '#475569', marginTop: 4, marginBottom: 4 }}>
                              {a.description}
                            </p>
                            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                              ⏱️ Timing: {a.timing} • 🗺️ Coordinates: {aLat?.toFixed(4)}° N, {aLon?.toFixed(4)}° E
                            </div>
                          </div>

                          <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#059669' }}>
                              {a.entryFeeInr === 0 ? 'Free Entry' : formatCurrency(a.entryFeeInr, currency)}
                            </span>
                            {aLat != null && aLon != null && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedDest(null);
                                  handleFocusOnAttraction(aLat, aLon, a.name);
                                }}
                                style={{
                                  fontSize: '0.72rem',
                                  padding: '3px 8px',
                                  borderRadius: 6,
                                  background: '#EFF6FF',
                                  border: '1px solid #BFDBFE',
                                  color: '#1D4ED8',
                                  fontWeight: 600,
                                  cursor: 'pointer'
                                }}
                                title="Center Map on this attraction"
                              >
                                📍 Focus on Map
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Meta Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, background: '#F8FAFC', padding: 16, borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Calendar size={13} color="#D97706" /> Best Months
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, marginTop: 2, color: '#0F172A' }}>
                    {selectedDest.bestSeason?.join(', ') || 'All Year'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock size={13} color="#2563EB" /> Ideal Duration
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, marginTop: 2, color: '#0F172A' }}>
                    {selectedDest.idealDurationDays ? `${selectedDest.idealDurationDays} Days` : '2–3 Days'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Compass size={13} color="#059669" /> Coordinates
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, marginTop: 2, color: '#0F172A' }}>
                    {selectedDest.location.latitude.toFixed(4)}° N, {selectedDest.location.longitude.toFixed(4)}° E
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => {
                    const lat = selectedDest.location.latitude;
                    const lon = selectedDest.location.longitude;
                    setSelectedDest(null);
                    handleFocusOnMap(lat, lon);
                  }}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.85rem' }}
                >
                  <MapPin size={14} />
                  <span>View on Map</span>
                </button>

                {onAskAiToPlan && (
                  <button
                    type="button"
                    onClick={() => {
                      const name = selectedDest.name;
                      const state = selectedDest.state;
                      setSelectedDest(null);
                      onAskAiToPlan(name, state);
                    }}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.85rem' }}
                  >
                    <MessageSquare size={14} />
                    <span>Ask AI Assistant</span>
                  </button>
                )}

                {onOpenTrackMate && (
                  <button
                    type="button"
                    onClick={() => {
                      const name = selectedDest.name;
                      setSelectedDest(null);
                      onOpenTrackMate(name);
                    }}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 600 }}
                  >
                    <Radio size={14} />
                    <span>Track Family (TrackMate)</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    const name = selectedDest.name;
                    setSelectedDest(null);
                    onPlanTripForDestination(name);
                  }}
                  className="btn btn-primary"
                  style={{ fontSize: '0.85rem', fontWeight: 700 }}
                >
                  <Sparkles size={15} />
                  <span>Generate Trip Plan</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
