import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LocateFixed } from 'lucide-react';

// Fix default marker icons for Vite Leaflet bundles
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export type MapViewType = 'satellite' | 'streets' | 'dark' | 'topo';

export interface MapMarker {
  id?: string;
  latitude: number;
  longitude: number;
  label: string;
  cityName?: string;
  stateName?: string;
  iconType?: string;
  markerType?: 'my_location' | 'family_member' | 'destination' | 'meeting_point' | 'attraction';
  placeId?: string;
  distance?: number;
  category?: string;
  rating?: number;
  description?: string;
}

interface OsmInteractiveMapProps {
  markers: MapMarker[];
  center?: { lat: number; lon: number };
  zoom?: number;
  height?: number;
  showRadius?: number;
  currentUserLocation?: { latitude: number; longitude: number; accuracy?: number } | null;
  defaultViewType?: MapViewType;
  onSelectMarker?: (marker: MapMarker) => void;
  onPlanTrip?: (destinationName: string, stateName?: string) => void;
}

export const OsmInteractiveMap: React.FC<OsmInteractiveMapProps> = ({
  markers,
  center,
  zoom = 13,
  height = 340,
  showRadius,
  currentUserLocation,
  defaultViewType = 'satellite',
  onSelectMarker,
  onPlanTrip
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const [activeViewType, setActiveViewType] = useState<MapViewType>(defaultViewType);
  const [deviceLocation, setDeviceLocation] = useState<{ latitude: number; longitude: number; accuracy?: number } | null>(
    currentUserLocation || null
  );

  // Sync device location
  useEffect(() => {
    if (currentUserLocation) {
      setDeviceLocation(currentUserLocation);
    }
  }, [currentUserLocation]);

  const handleFocusMyLocation = () => {
    if (deviceLocation && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([deviceLocation.latitude, deviceLocation.longitude], 16, { duration: 1 });
      return;
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: Math.round(pos.coords.accuracy)
          };
          setDeviceLocation(loc);
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([loc.latitude, loc.longitude], 16, { duration: 1 });
          }
        },
        (err) => {
          console.warn('Geolocation error in OsmInteractiveMap:', err);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  };

  const setMapTileLayer = (map: L.Map, viewType: MapViewType) => {
    if (!tileLayerGroupRef.current) {
      tileLayerGroupRef.current = L.layerGroup();
    }
    tileLayerGroupRef.current.clearLayers();
    if (!map.hasLayer(tileLayerGroupRef.current)) {
      tileLayerGroupRef.current.addTo(map);
    }

    if (viewType === 'satellite') {
      const satLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Tiles &copy; Esri, Maxar, Earthstar Geographics',
          maxZoom: 19
        }
      );
      const labelsLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19 }
      );
      tileLayerGroupRef.current.addLayer(satLayer);
      tileLayerGroupRef.current.addLayer(labelsLayer);
    } else if (viewType === 'streets') {
      const osmLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      });
      tileLayerGroupRef.current.addLayer(osmLayer);
    } else if (viewType === 'dark') {
      const darkLayer = L.tileLayer('https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 19,
        subdomains: 'abcd'
      });
      tileLayerGroupRef.current.addLayer(darkLayer);
    } else if (viewType === 'topo') {
      const topoLayer = L.tileLayer('https://tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors, SRTM',
        maxZoom: 17
      });
      tileLayerGroupRef.current.addLayer(topoLayer);
    }
  };

  // 1. Initialize Map Once
  useEffect(() => {
    if (!mapRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
      tileLayerGroupRef.current = null;
      markersLayerGroupRef.current = null;
    }

    const initialLat = center?.lat || markers[0]?.latitude || deviceLocation?.latitude || 20.5937;
    const initialLon = center?.lon || markers[0]?.longitude || deviceLocation?.longitude || 78.9629;

    const map = L.map(mapRef.current, {
      center: [initialLat, initialLon],
      zoom,
      scrollWheelZoom: true,
      zoomControl: true
    });

    tileLayerGroupRef.current = L.layerGroup().addTo(map);
    markersLayerGroupRef.current = L.layerGroup().addTo(map);

    setMapTileLayer(map, activeViewType);
    mapInstanceRef.current = map;

    const invalidate = () => map.invalidateSize();
    invalidate();
    const t1 = setTimeout(invalidate, 100);
    const t2 = setTimeout(invalidate, 400);

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    if (mapRef.current) {
      resizeObserver.observe(mapRef.current);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      resizeObserver.disconnect();
      if (tileLayerGroupRef.current) {
        tileLayerGroupRef.current.clearLayers();
        tileLayerGroupRef.current = null;
      }
      if (markersLayerGroupRef.current) {
        markersLayerGroupRef.current.clearLayers();
        markersLayerGroupRef.current = null;
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. View switch
  useEffect(() => {
    if (mapInstanceRef.current) {
      setMapTileLayer(mapInstanceRef.current, activeViewType);
    }
  }, [activeViewType]);

  // 3. Center and Zoom updates
  useEffect(() => {
    if (mapInstanceRef.current && center?.lat && center?.lon) {
      mapInstanceRef.current.setView([center.lat, center.lon], zoom, { animate: true });
    }
  }, [center?.lat, center?.lon, zoom]);

  // 4. Update Markers Layer Group
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerGroupRef.current) return;

    const markersGroup = markersLayerGroupRef.current;
    markersGroup.clearLayers();

    // Draw Radius Circle
    if (showRadius && center) {
      const radiusCircle = L.circle([center.lat, center.lon], {
        radius: showRadius,
        color: '#ff9933',
        fillColor: '#ff993380',
        fillOpacity: 0.1,
        weight: 1.5,
        dashArray: '5, 8'
      });
      markersGroup.addLayer(radiusCircle);
    }

    // Draw Live GPS Location (🔵 Blue: You are here)
    if (deviceLocation) {
      const { latitude, longitude, accuracy } = deviceLocation;

      // Draw real GPS accuracy circle if available
      if (accuracy && accuracy > 0) {
        const accCircle = L.circle([latitude, longitude], {
          radius: Math.min(accuracy, 250),
          color: '#3b82f6',
          fillColor: '#3b82f6',
          fillOpacity: 0.15,
          weight: 1.5,
          dashArray: '4, 4'
        }).bindTooltip(`🔵 Your GPS Accuracy: ±${accuracy}m`, { sticky: true });
        markersGroup.addLayer(accCircle);
      }

      const youIcon = L.divIcon({
        className: 'osm-you-live-marker',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            <div style="
              width: 36px;
              height: 36px;
              background: linear-gradient(135deg, #1d4ed8, #3b82f6);
              color: #ffffff;
              font-weight: 800;
              font-size: 16px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 3px solid #ffffff;
              box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.4), 0 4px 14px rgba(0,0,0,0.5);
              animation: pulse-ring 2s infinite;
            ">
              🔵
            </div>
            <div style="
              background: #1e3a8a;
              color: #ffffff;
              font-size: 11px;
              font-weight: 800;
              padding: 2px 7px;
              border-radius: 8px;
              margin-top: 3px;
              white-space: nowrap;
              border: 1px solid #60a5fa;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            ">
              You are here
            </div>
          </div>
        `,
        iconSize: [36, 52],
        iconAnchor: [18, 26],
        popupAnchor: [0, -28]
      });

      const youMarker = L.marker([latitude, longitude], { icon: youIcon })
        .bindPopup(`
          <div style="font-family: system-ui; min-width: 180px; color: #0f172a; padding: 4px;">
            <div style="font-size: 0.95rem; font-weight: 800; color: #1d4ed8; display: flex; align-items: center; gap: 4px;">
              🔵 My Current Location
            </div>
            <div style="font-size: 0.8rem; font-weight: 600; color: #059669; margin-top: 4px;">
              ✓ Live GPS Connected
            </div>
            <div style="font-size: 0.74rem; color: #64748b; margin-top: 3px;">
              Coordinates: ${latitude.toFixed(5)}° N, ${longitude.toFixed(5)}° E
            </div>
            ${accuracy ? `<div style="font-size: 0.72rem; color: #64748b;">Accuracy: ±${accuracy}m</div>` : ''}
          </div>
        `);
      markersGroup.addLayer(youMarker);
    }

    // Helper to get emoji for place type
    const getPlaceEmoji = (type?: string, category?: string): string => {
      const cat = (category || '').toLowerCase();
      if (cat.includes('temple') || cat.includes('spiritual') || cat.includes('buddhist') || cat.includes('gurdwara')) return '🛕';
      if (cat.includes('beach') || cat.includes('coastal') || cat.includes('island')) return '🏖️';
      if (cat.includes('nature') || cat.includes('wildlife') || cat.includes('park') || cat.includes('waterfall')) return '🌿';
      if (cat.includes('palace') || cat.includes('fort') || cat.includes('heritage') || cat.includes('unesco')) return '🏛️';
      if (cat.includes('hill') || cat.includes('mountain') || cat.includes('snow') || cat.includes('adventure')) return '⛰️';
      if (cat.includes('tea')) return '🍵';
      if (cat.includes('food') || cat.includes('restaurant')) return '🍽️';

      const emojiMap: Record<string, string> = {
        restaurant: '🍽️', hospital: '🏥', pharmacy: '💊', hotel: '🏨',
        school: '🏫', atm: '🏧', bank: '🏦', cafe: '☕', park: '🌳',
        museum: '🏛️', temple: '🛕', mosque: '🕌', church: '⛪',
        police: '🚔', cinema: '🎬', library: '📚', bus_station: '🚌',
        train_station: '🚂', airport: '✈️', attraction: '🎯', hostel: '🏠',
        parking: '🅿️', fuel: '⛽', post_office: '📮', bar: '🍺',
        location: '📍', clinic: '🏥'
      };
      return emojiMap[type || ''] || '📍';
    };

    // Helper for marker colors:
    // 🔵 Blue: My Location
    // 🟢 Green: Family Member
    // 🟠 Orange: Selected Destination
    // 🔴 Red: Meeting Point / SOS
    // 🟣 Purple: Tourist Attraction
    const getMarkerTheme = (marker: MapMarker) => {
      if (marker.markerType === 'my_location') {
        return {
          badgeBg: '#1D4ED8',
          badgeBorder: '#93C5FD',
          badgeText: '#ffffff',
          iconBorder: '#3B82F6',
          iconBg: '#EFF6FF',
          shadow: 'rgba(59, 130, 246, 0.5)'
        };
      }
      if (marker.markerType === 'family_member') {
        return {
          badgeBg: '#15803D',
          badgeBorder: '#BBF7D0',
          badgeText: '#ffffff',
          iconBorder: '#16A34A',
          iconBg: '#F0FDF4',
          shadow: 'rgba(22, 163, 74, 0.5)'
        };
      }
      if (marker.markerType === 'meeting_point') {
        return {
          badgeBg: '#B91C1C',
          badgeBorder: '#FECACA',
          badgeText: '#ffffff',
          iconBorder: '#DC2626',
          iconBg: '#FEF2F2',
          shadow: 'rgba(220, 38, 38, 0.5)'
        };
      }
      if (marker.markerType === 'attraction' || marker.iconType === 'attraction') {
        return {
          badgeBg: '#6D28D9',
          badgeBorder: '#DDD6FE',
          badgeText: '#ffffff',
          iconBorder: '#7C3AED',
          iconBg: '#F5F3FF',
          shadow: 'rgba(124, 58, 237, 0.5)'
        };
      }
      // Destination (Orange 🟠)
      return {
        badgeBg: '#C2410C',
        badgeBorder: '#FED7AA',
        badgeText: '#ffffff',
        iconBorder: '#EA580C',
        iconBg: '#FFF7ED',
        shadow: 'rgba(234, 88, 12, 0.5)'
      };
    };

    // Draw Place Markers
    markers.forEach((marker) => {
      const emoji = getPlaceEmoji(marker.iconType, marker.category);
      const theme = getMarkerTheme(marker);

      const customIcon = L.divIcon({
        className: 'osm-custom-card-marker',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            <div style="
              font-size: 1.25rem;
              background: ${theme.iconBg};
              border: 2.5px solid ${theme.iconBorder};
              border-radius: 12px;
              padding: 3px 6px;
              line-height: 1;
              box-shadow: 0 4px 14px ${theme.shadow};
              display: flex;
              align-items: center;
              justify-content: center;
              transition: transform 0.2s;
            ">
              ${emoji}
            </div>
            <div style="
              background: ${theme.badgeBg};
              color: ${theme.badgeText};
              font-size: 10px;
              font-weight: 700;
              padding: 2px 7px;
              border-radius: 8px;
              margin-top: 2px;
              white-space: nowrap;
              border: 1px solid ${theme.badgeBorder};
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              max-width: 140px;
              overflow: hidden;
              text-overflow: ellipsis;
            ">
              ${marker.label}
            </div>
          </div>
        `,
        iconSize: [36, 48],
        iconAnchor: [18, 24],
        popupAnchor: [0, -26]
      });

      // Navigation direction URL from device location to this marker
      const originParam = deviceLocation ? `${deviceLocation.latitude},${deviceLocation.longitude}` : '';
      const destParam = `${marker.latitude},${marker.longitude}`;
      const directionsUrl = originParam
        ? `https://www.google.com/maps/dir/?api=1&origin=${originParam}&destination=${destParam}`
        : `https://www.google.com/maps/dir/?api=1&destination=${destParam}`;

      const pMarker = L.marker([marker.latitude, marker.longitude], { icon: customIcon })
        .bindPopup(`
          <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 200px; color: #0f172a; padding: 4px;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
              <span style="font-size: 0.72rem; font-weight: 700; background: ${theme.iconBg}; color: ${theme.iconBorder}; padding: 2px 6px; border-radius: 6px; border: 1px solid ${theme.badgeBorder};">
                ${marker.category || (marker.markerType === 'attraction' ? 'Tourist Attraction' : 'Destination')}
              </span>
              ${marker.rating ? `<span style="font-size: 0.76rem; font-weight: 700; background: #FEF3C7; color: #92400E; padding: 2px 6px; border-radius: 6px; border: 1px solid #FDE68A;">⭐ ${marker.rating}</span>` : ''}
            </div>
            
            <h4 style="font-size: 0.98rem; font-weight: 800; color: #0f172a; margin: 6px 0 2px 0;">
              ${emoji} ${marker.label}
            </h4>
            
            ${marker.cityName || marker.stateName ? `<div style="font-size: 0.76rem; color: #64748b; margin-bottom: 6px;">📍 ${[marker.cityName, marker.stateName].filter(Boolean).join(', ')}</div>` : ''}
            
            ${marker.description ? `<p style="font-size: 0.78rem; color: #475569; margin: 4px 0 8px 0; line-height: 1.4; max-height: 60px; overflow: hidden;">${marker.description}</p>` : ''}
            
            <div style="font-size: 0.72rem; color: #0284c7; margin-bottom: 8px; font-weight: 600;">
              🗺️ Coordinates: ${marker.latitude.toFixed(4)}° N, ${marker.longitude.toFixed(4)}° E
            </div>

            <div style="display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap;">
              <a
                href="${directionsUrl}"
                target="_blank"
                rel="noopener noreferrer"
                style="
                  flex: 1;
                  background: #1d4ed8;
                  color: #ffffff;
                  text-decoration: none;
                  font-size: 0.74rem;
                  font-weight: 700;
                  padding: 5px 8px;
                  border-radius: 6px;
                  text-align: center;
                  display: inline-block;
                "
              >
                🧭 Directions
              </a>
            </div>
          </div>
        `);

      pMarker.on('click', () => {
        if (onSelectMarker) {
          onSelectMarker(marker);
        }
      });

      markersGroup.addLayer(pMarker);
    });

  }, [markers, center, showRadius, deviceLocation]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height,
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
        background: '#1e293b'
      }}
    >
      {/* FLOATING CONTROLS: LAYER SWITCHER & MY LOCATION */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 1000,
          display: 'flex',
          gap: 6,
          alignItems: 'center'
        }}
      >
        {/* Layer Switcher */}
        <div
          style={{
            display: 'flex',
            gap: 3,
            background: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(10px)',
            padding: '3px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: '0 4px 14px rgba(0,0,0,0.4)'
          }}
        >
          <button
            onClick={() => setActiveViewType('satellite')}
            style={{
              background: activeViewType === 'satellite' ? 'linear-gradient(135deg, #ff9933, #6366f1)' : 'transparent',
              color: activeViewType === 'satellite' ? '#ffffff' : 'var(--text-muted)',
              border: 'none',
              padding: '4px 8px',
              borderRadius: 5,
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            title="Satellite Imagery"
          >
            🛰️ Satellite
          </button>

          <button
            onClick={() => setActiveViewType('streets')}
            style={{
              background: activeViewType === 'streets' ? '#6366f1' : 'transparent',
              color: activeViewType === 'streets' ? '#ffffff' : 'var(--text-muted)',
              border: 'none',
              padding: '4px 8px',
              borderRadius: 5,
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            title="Street Map"
          >
            🗺️ Streets
          </button>

          <button
            onClick={() => setActiveViewType('dark')}
            style={{
              background: activeViewType === 'dark' ? '#334155' : 'transparent',
              color: activeViewType === 'dark' ? '#ffffff' : 'var(--text-muted)',
              border: 'none',
              padding: '4px 8px',
              borderRadius: 5,
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            title="Dark Mode Map"
          >
            🌙 Dark
          </button>

          <button
            onClick={() => setActiveViewType('topo')}
            style={{
              background: activeViewType === 'topo' ? '#10b981' : 'transparent',
              color: activeViewType === 'topo' ? '#ffffff' : 'var(--text-muted)',
              border: 'none',
              padding: '4px 8px',
              borderRadius: 5,
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            title="Topographic Terrain"
          >
            ⛰️ Topo
          </button>
        </div>

        {/* My Location Center Button */}
        <button
          onClick={handleFocusMyLocation}
          style={{
            background: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(10px)',
            color: '#38bdf8',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            borderRadius: 'var(--radius-sm)',
            padding: '5px 8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: '0.72rem',
            fontWeight: 700,
            boxShadow: '0 4px 14px rgba(0,0,0,0.3)'
          }}
          title="Center map on my device location"
        >
          <LocateFixed size={14} />
          <span>My Location</span>
        </button>
      </div>

      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default OsmInteractiveMap;
