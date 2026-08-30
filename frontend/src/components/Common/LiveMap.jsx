import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Layers, Key, Check, Settings2, Globe2, Eye, Shield, Map as MapIcon, Crosshair, Home, Sparkles, Navigation } from 'lucide-react';
import confetti from 'canvas-confetti';

// Custom Leaflet Icons with Light Indian Heritage Theme
const createCustomIcon = (color, label = '', isPulsing = false) => {
  const borderColor = color === 'saffron' ? '#D97706' : color === 'red' ? '#DC2626' : color === 'emerald' ? '#059669' : '#0284C7';
  const glowShadow = color === 'saffron' ? '0 2px 10px rgba(217, 119, 6, 0.4)' : color === 'red' ? '0 2px 10px rgba(220, 38, 38, 0.4)' : '0 2px 10px rgba(5, 150, 105, 0.35)';

  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div class="relative flex items-center justify-center">
        ${isPulsing ? `<div class="absolute w-12 h-12 rounded-full bg-amber-400/40 animate-ping"></div>` : ''}
        <div class="w-8 h-8 rounded-full bg-white border-2 flex items-center justify-center text-xs shadow-lg text-slate-900 font-bold" style="border-color: ${borderColor}; box-shadow: ${glowShadow};">
          ${label || '📍'}
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

// Helper to safely parse any coordinate format
const parseSafeCoords = (input, defaultCoords = [25.3176, 83.0062]) => {
  if (!input) return defaultCoords;
  if (Array.isArray(input)) {
    const lat = Number(input[0]);
    const lng = Number(input[1]);
    if (!isNaN(lat) && !isNaN(lng)) return [lat, lng];
  }
  if (typeof input === 'object') {
    const lat = Number(input.lat ?? input.centerLat ?? input.latitude);
    const lng = Number(input.lng ?? input.centerLng ?? input.longitude);
    if (!isNaN(lat) && !isNaN(lng)) return [lat, lng];
  }
  return defaultCoords;
};

// Map Recenter Helper Component with Smooth FlyTo & Auto-Bounds Fitting
const ChangeMapView = ({ center, zoom, roadmapPoints, userGpsCoords }) => {
  const map = useMap();
  useEffect(() => {
    // If user clicked Locate My Home / GPS, zoom super close onto user's location
    if (userGpsCoords && userGpsCoords.lat && userGpsCoords.lng) {
      map.flyTo([userGpsCoords.lat, userGpsCoords.lng], 18, { animate: true, duration: 1.5 });
      return;
    }

    const safe = parseSafeCoords(center);
    
    // If roadmap points are provided, fit bounds to show all attractions in the city
    if (roadmapPoints && roadmapPoints.length > 0) {
      const validPoints = roadmapPoints.filter(p => p.lat && p.lng);
      if (validPoints.length > 1) {
        try {
          const bounds = L.latLngBounds(validPoints.map(p => [Number(p.lat), Number(p.lng)]));
          map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15, animate: true, duration: 1.2 });
          return;
        } catch (e) {
          console.warn('Bounds fit fallback:', e);
        }
      }
    }
    
    // Otherwise fly directly to the safe center coordinates
    map.flyTo(safe, zoom || 14, { animate: true, duration: 1.2 });
  }, [center, zoom, roadmapPoints, userGpsCoords, map]);

  return null;
};

export const LiveMap = ({
  center = [25.3176, 83.0062],
  zoom = 15,
  zones = [],
  roadmapPoints = [],
  userLocation = null,
  showHeatCircles = true,
  height = '490px',
  onMarkerClick = null
}) => {
  const safeCenter = parseSafeCoords(center, [25.3176, 83.0062]);

  // Map Provider & Layer State (Default to Google Hybrid Satellite or Clean Streets)
  const [activeLayer, setActiveLayer] = useState('google_hybrid'); // 'google_hybrid' | 'esri_streets' | 'esri_satellite' | 'osm' | 'opentopo'
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  
  const [userGpsCoords, setUserGpsCoords] = useState(null);
  const [isLocatingUser, setIsLocatingUser] = useState(false);
  const [locationStatus, setLocationStatus] = useState(null);

  const [customMapboxKey, setCustomMapboxKey] = useState(import.meta.env.VITE_MAPBOX_TOKEN || '');
  const [customMapTilerKey, setCustomMapTilerKey] = useState(import.meta.env.VITE_MAPTILER_KEY || '');
  const [savedNotice, setSavedNotice] = useState(false);

  // Clean, High-Definition Tile Providers with High-Res Satellite View (up to Zoom 20)
  const tileProviders = {
    google_hybrid: {
      name: '🛰️ Google Hybrid Satellite (See Rooftops & Homes)',
      url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
      attribution: '&copy; Google Maps Satellite Imagery',
      maxZoom: 20,
      requiresKey: false
    },
    esri_satellite: {
      name: '🛰️ ESRI 3D Satellite (Aerial View)',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; <a href="https://www.esri.com/">Esri</a>, Maxar, Earthstar Geographics',
      maxZoom: 19,
      requiresKey: false
    },
    esri_streets: {
      name: '🗺️ ESRI Clean Street Map (HD Light)',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; <a href="https://www.esri.com/">Esri</a>, HERE, Garmin',
      maxZoom: 19,
      requiresKey: false
    },
    osm: {
      name: '🗺️ OpenStreetMap (Standard Grid)',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
      requiresKey: false
    },
    opentopo: {
      name: '🏔️ OpenTopoMap (Topographic Terrain)',
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)',
      maxZoom: 17,
      requiresKey: false
    }
  };

  const currentTileConfig = tileProviders[activeLayer] || tileProviders.google_hybrid;

  const polylineCoords = roadmapPoints
    .filter(p => p.lat && p.lng)
    .map(p => [Number(p.lat), Number(p.lng)]);

  // 1-Click "Locate My Home / Current GPS Position"
  const handleLocateMyHome = () => {
    setIsLocatingUser(true);
    setLocationStatus('Locating your GPS coordinates...');

    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      setIsLocatingUser(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserGpsCoords({ lat: latitude, lng: longitude, title: 'My Home / Current Location' });
        setActiveLayer('google_hybrid'); // Automatically switch to Satellite View so user sees their rooftop/home!
        setIsLocatingUser(false);
        setLocationStatus('📍 Zoomed in to your location in Satellite 3D View!');

        confetti({ particleCount: 50, spread: 70 });
        setTimeout(() => setLocationStatus(null), 4000);
      },
      (error) => {
        console.warn('Geolocation error:', error);
        // Fallback demo coordinates if permission denied
        setUserGpsCoords({ lat: safeCenter[0], lng: safeCenter[1], title: 'Current Region' });
        setActiveLayer('google_hybrid');
        setIsLocatingUser(false);
        setLocationStatus('Using current map center in Satellite 3D View.');
        setTimeout(() => setLocationStatus(null), 3000);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSaveKeys = (e) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      setShowKeyModal(false);
    }, 1200);
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-slate-950" style={{ height }}>
      
      {/* Top Floating Controls Bar */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex items-center justify-between pointer-events-none">
        
        {/* Left: Quick Satellite ➔ Street View Toggle & Locate Home */}
        <div className="flex items-center gap-2 pointer-events-auto bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-lg text-xs">
          
          <button
            onClick={() => setActiveLayer('google_hybrid')}
            className={`px-3 py-1.5 rounded-xl font-black transition flex items-center gap-1.5 ${
              activeLayer === 'google_hybrid' || activeLayer === 'esri_satellite'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-white hover:text-amber-400'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>🛰️ Satellite 3D View</span>
          </button>

          <button
            onClick={() => setActiveLayer('esri_streets')}
            className={`px-3 py-1.5 rounded-xl font-black transition flex items-center gap-1.5 ${
              activeLayer === 'esri_streets' || activeLayer === 'osm'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-white hover:text-amber-400'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>🗺️ Street Map</span>
          </button>

          <div className="w-[1px] h-4 bg-white/20 my-auto"></div>

          {/* Locate My Home GPS Button */}
          <button
            onClick={handleLocateMyHome}
            disabled={isLocatingUser}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl transition flex items-center gap-1.5 shadow-sm active:scale-95"
            title="Zoom into your home in Satellite View"
          >
            <Home className="w-3.5 h-3.5 text-amber-300" />
            <span>{isLocatingUser ? 'Finding...' : '🏠 Locate My Home'}</span>
          </button>
        </div>

        {/* Right: Layer Dropdown & API Keys */}
        <div className="flex items-center gap-2 pointer-events-auto">
          
          {/* Layer Selector Button */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLayerMenu(!showLayerMenu);
                setShowKeyModal(false);
              }}
              className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-white/20 text-xs font-bold text-white shadow-lg hover:bg-slate-800 transition"
              title="More Geospatial Layers"
            >
              <Layers className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Layers</span>
            </button>

            {/* Layer Menu Dropdown */}
            {showLayerMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl p-2 space-y-1 text-xs animate-fadeIn text-white">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Select High-Res Map View:
                </div>
                {Object.entries(tileProviders).map(([key, provider]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setActiveLayer(key);
                      setShowLayerMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between font-semibold transition ${
                      activeLayer === key
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <span className="truncate">{provider.name}</span>
                    {activeLayer === key && <Check className="w-3.5 h-3.5 text-slate-950" />}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* GPS Status Toast */}
      {locationStatus && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[1000] bg-slate-900/90 backdrop-blur-md border border-amber-400 px-4 py-2 rounded-2xl text-xs font-bold text-amber-300 shadow-xl animate-fadeIn flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{locationStatus}</span>
        </div>
      )}

      {/* Map Container (High-Res zoom up to 20 for house-level details) */}
      <MapContainer
        center={safeCenter}
        zoom={zoom}
        maxZoom={20}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <ChangeMapView
          center={safeCenter}
          zoom={zoom}
          roadmapPoints={roadmapPoints}
          userGpsCoords={userGpsCoords}
        />
        
        {/* Dynamic Tile Layer (Google Satellite Hybrid / ESRI Satellite / Streets) */}
        <TileLayer
          key={activeLayer}
          attribution={currentTileConfig.attribution}
          url={currentTileConfig.url}
          maxZoom={currentTileConfig.maxZoom || 20}
          maxNativeZoom={currentTileConfig.maxZoom || 20}
        />

        {/* Dynamic Zone Heat & Geofence Circles */}
        {showHeatCircles && zones && zones.map(zone => {
          if (!zone.lat || !zone.lng) return null;
          const isRed = zone.status === 'overcrowded';
          const isAmber = zone.status === 'heavy';
          const circleColor = isRed ? '#EF4444' : isAmber ? '#F59E0B' : '#10B981';

          return (
            <React.Fragment key={zone.id}>
              <Circle
                center={[Number(zone.lat), Number(zone.lng)]}
                radius={isRed ? 380 : 220}
                pathOptions={{
                  color: circleColor,
                  fillColor: circleColor,
                  fillOpacity: isRed ? 0.35 : 0.2,
                  weight: 2,
                  dashArray: isRed ? '4, 4' : null
                }}
              />
            </React.Fragment>
          );
        })}

        {/* Roadmap Numbered Sightseeing Markers */}
        {roadmapPoints && roadmapPoints.map((point, pIdx) => {
          if (!point.lat || !point.lng) return null;
          return (
            <Marker
              key={point.id || `pt-${pIdx}`}
              position={[Number(point.lat), Number(point.lng)]}
              icon={createCustomIcon('saffron', `${pIdx + 1}`)}
            >
              <Popup>
                <div className="p-1 min-w-[210px] text-slate-900">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                      SIGHT {pIdx + 1}
                    </span>
                    <span className="text-xs font-bold font-mono text-slate-500">{point.time || ''}</span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{point.title || point.name}</h4>
                  <p className="text-xs text-slate-600 font-medium my-1 leading-relaxed">
                    {point.tips || point.description || point.category}
                  </p>
                  <div className="text-[11px] font-bold text-amber-800 bg-amber-50 p-1.5 rounded-lg border border-amber-200 mt-1">
                    {point.recommendedTransport ? `🚖 ${point.recommendedTransport} (${point.recommendedFare || 'Free'})` : '📍 Heritage Attraction'}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Roadmap Heritage Polyline */}
        {polylineCoords.length > 1 && (
          <Polyline
            positions={polylineCoords}
            pathOptions={{
              color: '#F59E0B',
              weight: 4,
              opacity: 0.95,
              dashArray: '6, 6'
            }}
          />
        )}

        {/* User GPS / Home Marker */}
        {userGpsCoords && (
          <Marker
            position={[userGpsCoords.lat, userGpsCoords.lng]}
            icon={createCustomIcon('emerald', '🏠', true)}
          >
            <Popup>
              <div className="p-1 min-w-[180px] text-slate-900">
                <span className="text-xs font-black text-emerald-700 uppercase">🏠 Your Home / GPS Location</span>
                <p className="text-xs font-bold text-slate-800 mt-1">Latitude: {userGpsCoords.lat.toFixed(5)}</p>
                <p className="text-xs font-bold text-slate-800">Longitude: {userGpsCoords.lng.toFixed(5)}</p>
                <p className="text-[10px] text-slate-500 mt-1">High-Res Satellite View Active</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* User Standing Position Marker */}
        {userLocation && userLocation.lat && !userGpsCoords && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={createCustomIcon('saffron', '👤', true)}
          >
            <Popup>
              <div className="p-1 text-slate-900">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Your Live Spot</span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{userLocation.landmark || 'Current Checkpoint'}</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 text-[11px] flex items-center gap-4 text-slate-200 shadow-md font-semibold">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Tranquil Spot</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>Moderate Load</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
          <span>Crowded</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <span>🏠 Home / You</span>
        </div>
      </div>

    </div>
  );
};
