import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  TrackMateMember,
  TrackMateMeetingPoint,
  TrackMateDestinationLandmark
} from '../../types/smartTourTypes';

export type TrackMateMapViewType = 'satellite' | 'streets' | 'dark' | 'topo';

interface PoiItem {
  id: string;
  name: string;
  type: 'hotel' | 'restaurant' | 'attraction' | 'hospital' | 'pharmacy' | 'atm' | 'fuel';
  latitude: number;
  longitude: number;
  categoryLabel: string;
}

interface TrackMateMapProps {
  currentUserLocation?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    timestamp?: string;
  } | null;
  selectedDestination?: TrackMateDestinationLandmark | null;
  members: TrackMateMember[];
  meetingPoint?: TrackMateMeetingPoint | null;
  center?: { lat: number; lon: number } | null;
  zoom?: number;
  height?: number;
  separationRadiusMeters?: number;
  activePoiFilters?: string[];
  isSharingLocation?: boolean;
  defaultViewType?: TrackMateMapViewType;
  onMemberClick?: (member: TrackMateMember) => void;
  onFocusCurrentLocation?: () => void;
  onFocusDestination?: () => void;
}

// Distance helper
function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const TrackMateMap: React.FC<TrackMateMapProps> = ({
  currentUserLocation,
  selectedDestination,
  members,
  meetingPoint,
  center,
  zoom = 14,
  height = 480,
  separationRadiusMeters = 1500,
  activePoiFilters = ['attraction', 'hotel', 'restaurant', 'hospital'],
  isSharingLocation = false,
  defaultViewType = 'satellite',
  onMemberClick,
  onFocusCurrentLocation,
  onFocusDestination
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const [activeViewType, setActiveViewType] = useState<TrackMateMapViewType>(defaultViewType);

  const centerLat = center?.lat ||
    (currentUserLocation ? currentUserLocation.latitude : (selectedDestination?.latitude || 17.3616));
  const centerLon = center?.lon ||
    (currentUserLocation ? currentUserLocation.longitude : (selectedDestination?.longitude || 78.4747));

  // Function to apply tile layers with reliable fallbacks
  const setMapTileLayer = (map: L.Map, viewType: TrackMateMapViewType) => {
    if (!tileLayerGroupRef.current) {
      tileLayerGroupRef.current = L.layerGroup();
    }
    
    tileLayerGroupRef.current.clearLayers();
    if (!map.hasLayer(tileLayerGroupRef.current)) {
      tileLayerGroupRef.current.addTo(map);
    }

    if (viewType === 'satellite') {
      // High-performance satellite imagery with borders & labels
      const satLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Tiles &copy; Esri, Maxar, Earthstar Geographics',
          maxZoom: 19,
          subdomains: ['server', 'services']
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

  // 1. Initialize Map Instance Once
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
      tileLayerGroupRef.current = null;
      markersLayerGroupRef.current = null;
    }

    const defaultCenter: L.LatLngExpression = [centerLat, centerLon];
    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom,
      scrollWheelZoom: true,
      zoomControl: true
    });

    // Create Tile Layer Group & Markers Layer Group
    tileLayerGroupRef.current = L.layerGroup().addTo(map);
    markersLayerGroupRef.current = L.layerGroup().addTo(map);

    setMapTileLayer(map, activeViewType);
    mapInstanceRef.current = map;

    // Invalidate size on load and resize
    const invalidate = () => map.invalidateSize();
    invalidate();
    const t1 = setTimeout(invalidate, 100);
    const t2 = setTimeout(invalidate, 400);

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
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

  // 2. Tile layer switch effect
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

  // 4. Update Markers Layer Group whenever locations/markers change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerGroupRef.current) return;

    const map = mapInstanceRef.current;
    const markersGroup = markersLayerGroupRef.current;
    markersGroup.clearLayers();

    const boundsGroup = L.featureGroup();

    // ── A. ACTUAL CURRENT DEVICE GPS LOCATION (🔵 You) ──
    if (currentUserLocation) {
      const { latitude, longitude, accuracy } = currentUserLocation;

      // Accuracy circle
      if (accuracy && accuracy > 0) {
        const accCircle = L.circle([latitude, longitude], {
          radius: Math.min(accuracy, 250),
          color: '#3b82f6',
          fillColor: '#3b82f6',
          fillOpacity: 0.16,
          weight: 1.5,
          dashArray: '4, 4'
        }).bindTooltip(`GPS Accuracy: ~${Math.round(accuracy)}m`, { sticky: true });
        markersGroup.addLayer(accCircle);
      }

      // Separation Radius Geofence Circle
      if (isSharingLocation && separationRadiusMeters > 0) {
        const sepCircle = L.circle([latitude, longitude], {
          radius: separationRadiusMeters,
          color: '#6366f1',
          fillColor: '#6366f1',
          fillOpacity: 0.06,
          weight: 1.5,
          dashArray: '6, 8'
        }).bindTooltip(`Separation Boundary (${separationRadiusMeters}m)`, { sticky: true });
        markersGroup.addLayer(sepCircle);
      }

      // Custom Pulsing Blue "You" Marker
      const youIcon = L.divIcon({
        className: 'trackmate-you-marker',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
            <div style="
              width: 44px;
              height: 44px;
              background: linear-gradient(135deg, #2563eb, #3b82f6);
              color: #ffffff;
              font-weight: 800;
              font-size: 16px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 3.5px solid #ffffff;
              box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.35), 0 4px 16px rgba(0,0,0,0.5);
              animation: pulse-ring 2s infinite;
            ">
              👤
            </div>
            <div style="
              background: #1e3a8a;
              color: #ffffff;
              font-size: 11px;
              font-weight: 800;
              padding: 3px 8px;
              border-radius: 12px;
              margin-top: 4px;
              white-space: nowrap;
              border: 1.5px solid #60a5fa;
              box-shadow: 0 2px 8px rgba(0,0,0,0.4);
            ">
              ${isSharingLocation ? '🔵 You (Live Sharing ON)' : '🔵 You (Current Location)'}
            </div>
          </div>
        `,
        iconSize: [48, 64],
        iconAnchor: [24, 32],
        popupAnchor: [0, -34]
      });

      const youMarker = L.marker([latitude, longitude], { icon: youIcon })
        .bindPopup(`
          <div style="font-family: system-ui; min-width: 190px; color: #0f172a;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
              <strong style="font-size: 1rem; color: #1d4ed8;">🔵 Your Device</strong>
              <span style="font-size: 0.7rem; font-weight: 800; background: #dbeafe; color: #1e40af; padding: 2px 6px; border-radius: 4px;">
                LIVE GPS
              </span>
            </div>
            <div style="font-size: 0.82rem; font-weight: 600; color: #059669; margin-top: 4px;">
              ${isSharingLocation ? '✓ LIVE GPS SHARING WITH GROUP' : '✓ LIVE GPS DETECTED (Local View)'}
            </div>
            <div style="font-size: 0.78rem; color: #475569; margin-top: 2px;">
              📍 Coordinates: ${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E
            </div>
            ${accuracy ? `<div style="font-size: 0.75rem; color: #64748b; margin-top: 2px;">🎯 GPS Accuracy: ±${Math.round(accuracy)}m</div>` : ''}
            <div style="font-size: 0.72rem; color: #94a3b8; margin-top: 4px;">
              Updated: ${currentUserLocation.timestamp ? 'Just now' : 'Active watch'}
            </div>
          </div>
        `);
      markersGroup.addLayer(youMarker);
      boundsGroup.addLayer(youMarker);
    }

    // ── B. SELECTED DESTINATION LANDMARK (📍 Destination) ──
    if (selectedDestination && selectedDestination.latitude && selectedDestination.longitude) {
      const destLat = selectedDestination.latitude;
      const destLon = selectedDestination.longitude;

      const destIcon = L.divIcon({
        className: 'trackmate-dest-marker',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
            <div style="
              width: 42px;
              height: 42px;
              background: linear-gradient(135deg, #ff9933, #e11d48);
              color: #ffffff;
              font-weight: 800;
              font-size: 18px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 3px solid #ffffff;
              box-shadow: 0 4px 16px rgba(225, 29, 72, 0.5);
              cursor: pointer;
            ">
              📍
            </div>
            <div style="
              background: rgba(15, 23, 42, 0.95);
              color: #ff9933;
              font-size: 11px;
              font-weight: 800;
              padding: 3px 8px;
              border-radius: 12px;
              margin-top: 3px;
              white-space: nowrap;
              border: 1.5px solid #ff9933;
              box-shadow: 0 2px 8px rgba(0,0,0,0.4);
            ">
              📍 ${selectedDestination.name}
            </div>
          </div>
        `,
        iconSize: [44, 62],
        iconAnchor: [22, 31],
        popupAnchor: [0, -32]
      });

      const destMarker = L.marker([destLat, destLon], { icon: destIcon })
        .bindPopup(`
          <div style="font-family: system-ui; min-width: 190px; color: #0f172a;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 0.7rem; font-weight: 800; background: #fff1f2; color: #e11d48; padding: 2px 6px; border-radius: 4px;">
                TRIP DESTINATION
              </span>
              ${selectedDestination.category ? `<span style="font-size: 0.7rem; color: #64748b;">${selectedDestination.category}</span>` : ''}
            </div>
            <h4 style="font-size: 1rem; font-weight: 800; margin: 4px 0 2px 0; color: #0f172a;">
              ${selectedDestination.name}
            </h4>
            ${selectedDestination.city ? `<div style="font-size: 0.78rem; color: #475569;">${selectedDestination.city}${selectedDestination.state ? `, ${selectedDestination.state}` : ''}</div>` : ''}
            ${selectedDestination.description ? `<p style="font-size: 0.78rem; color: #64748b; margin: 4px 0 0 0;">${selectedDestination.description}</p>` : ''}
          </div>
        `);
      markersGroup.addLayer(destMarker);
      boundsGroup.addLayer(destMarker);

      // Distance Line between Current User GPS and Selected Destination
      if (currentUserLocation && isSharingLocation) {
        const distMeters = calculateDistanceMeters(
          currentUserLocation.latitude,
          currentUserLocation.longitude,
          destLat,
          destLon
        );
        const distText = distMeters < 1000 ? `${Math.round(distMeters)} m` : `${(distMeters / 1000).toFixed(1)} km`;

        const distLine = L.polyline(
          [[currentUserLocation.latitude, currentUserLocation.longitude], [destLat, destLon]],
          {
            color: '#ff9933',
            weight: 2.5,
            opacity: 0.8,
            dashArray: '6, 8'
          }
        ).bindTooltip(`Distance: ${distText}`, { sticky: true });
        markersGroup.addLayer(distLine);
      }
    }

    // ── C. FAMILY MEMBERS LOCATIONS ──
    members.forEach((member) => {
      if (member.isCurrentUser) return;
      if (member.sharingStatus === 'SHARING_OFF' || !member.location) return;

      const initial = member.name.charAt(0).toUpperCase();
      const color = member.avatarColor || '#10b981';
      const distText = member.distanceFromUserMeters != null
        ? member.distanceFromUserMeters < 1000
          ? `${Math.round(member.distanceFromUserMeters)} m away`
          : `${(member.distanceFromUserMeters / 1000).toFixed(1)} km away`
        : 'Active sharing';

      const memberIcon = L.divIcon({
        className: 'trackmate-family-marker',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
            <div style="
              width: 38px;
              height: 38px;
              background: ${color};
              color: #ffffff;
              font-weight: 800;
              font-size: 14px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 3px solid #ffffff;
              box-shadow: 0 4px 14px rgba(0,0,0,0.4);
            ">
              ${initial}
            </div>
            <div style="
              background: rgba(15, 23, 42, 0.9);
              color: #ffffff;
              font-size: 11px;
              font-weight: 700;
              padding: 2px 7px;
              border-radius: 10px;
              margin-top: 3px;
              white-space: nowrap;
              border: 1px solid rgba(255,255,255,0.25);
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            ">
              ${member.name}
            </div>
          </div>
        `,
        iconSize: [42, 58],
        iconAnchor: [21, 29],
        popupAnchor: [0, -30]
      });

      const memberMarker = L.marker([member.location.latitude, member.location.longitude], { icon: memberIcon })
        .bindPopup(`
          <div style="font-family: system-ui; min-width: 180px; color: #0f172a;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
              <strong style="font-size: 0.95rem; color: ${color};">${member.name}</strong>
              <span style="font-size: 0.7rem; font-weight: 700; background: #dcfce7; color: #15803d; padding: 2px 6px; border-radius: 4px;">
                🟢 Sharing ON
              </span>
            </div>
            <div style="font-size: 0.8rem; color: #475569; margin-top: 2px;">Relation: ${member.relation}</div>
            ${member.phone ? `<div style="font-size: 0.78rem; color: #2563eb; margin-top: 2px;">📞 ${member.phone}</div>` : ''}
            ${member.distanceFromUserMeters != null ? `<div style="font-size: 0.82rem; font-weight: 700; color: #2563eb; margin-top: 4px;">📏 ${distText}</div>` : ''}
            ${member.location.batteryLevel ? `<div style="font-size: 0.75rem; color: #64748b; margin-top: 2px;">🔋 Battery: ${member.location.batteryLevel}%</div>` : ''}
            <div style="font-size: 0.72rem; color: #94a3b8; margin-top: 4px;">Updated: ${member.lastSeenText || 'Just now'}</div>
          </div>
        `);

      if (onMemberClick) {
        memberMarker.on('click', () => onMemberClick(member));
      }

      markersGroup.addLayer(memberMarker);
      boundsGroup.addLayer(memberMarker);
    });

    // ── D. DESIGNATED MEETING POINT (📌 Meeting Point) ──
    if (meetingPoint && meetingPoint.latitude && meetingPoint.longitude) {
      const mpIcon = L.divIcon({
        className: 'trackmate-meeting-point-marker',
        html: `
          <div style="
            background: linear-gradient(135deg, #ef4444, #b91c1c);
            color: #ffffff;
            font-size: 16px;
            font-weight: 800;
            width: 38px;
            height: 38px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 3px solid #ffffff;
            box-shadow: 0 4px 14px rgba(239, 68, 68, 0.6);
            cursor: pointer;
          ">
            📌
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
        popupAnchor: [0, -20]
      });

      const mpMarker = L.marker([meetingPoint.latitude, meetingPoint.longitude], { icon: mpIcon })
        .bindPopup(`
          <div style="font-family: system-ui; min-width: 170px; color: #0f172a;">
            <strong style="font-size: 0.95rem; color: #dc2626;">📌 Meeting Point</strong>
            <div style="font-weight: 700; font-size: 0.9rem; margin-top: 2px;">${meetingPoint.title}</div>
            ${meetingPoint.description ? `<p style="font-size: 0.78rem; color: #475569; margin: 4px 0 0 0;">${meetingPoint.description}</p>` : ''}
            <div style="font-size: 0.72rem; color: #64748b; margin-top: 4px;">Set by: ${meetingPoint.setByMemberName}</div>
          </div>
        `);
      markersGroup.addLayer(mpMarker);
      boundsGroup.addLayer(mpMarker);
    }

    // ── E. TRAVEL POIS ──
    const demoPois: PoiItem[] = [
      { id: 'poi-1', name: 'Grand Luxury Hotel & Stay', type: 'hotel', latitude: centerLat + 0.005, longitude: centerLon - 0.005, categoryLabel: 'Hotel' },
      { id: 'poi-2', name: 'Authentic Heritage Cuisine', type: 'restaurant', latitude: centerLat - 0.004, longitude: centerLon + 0.005, categoryLabel: 'Restaurant' },
      { id: 'poi-3', name: 'Historical Monument & Park', type: 'attraction', latitude: centerLat + 0.003, longitude: centerLon + 0.004, categoryLabel: 'Tourist Spot' },
      { id: 'poi-4', name: 'District Multi-Specialty Hospital', type: 'hospital', latitude: centerLat - 0.006, longitude: centerLon - 0.006, categoryLabel: 'Hospital' },
      { id: 'poi-5', name: '24x7 Apollo Pharmacy', type: 'pharmacy', latitude: centerLat + 0.005, longitude: centerLon + 0.002, categoryLabel: 'Pharmacy' },
      { id: 'poi-6', name: 'National Bank 24x7 ATM', type: 'atm', latitude: centerLat - 0.003, longitude: centerLon - 0.003, categoryLabel: 'ATM' },
      { id: 'poi-7', name: 'IndianOil Fuel Station', type: 'fuel', latitude: centerLat + 0.007, longitude: centerLon + 0.007, categoryLabel: 'Petrol Station' }
    ];

    const poiEmojis: Record<string, string> = {
      hotel: '🏨',
      restaurant: '🍛',
      attraction: '📍',
      hospital: '🏥',
      pharmacy: '💊',
      atm: '🏧',
      fuel: '⛽'
    };

    demoPois.forEach(poi => {
      if (!activePoiFilters.includes(poi.type)) return;

      const emoji = poiEmojis[poi.type] || '📍';
      const poiIcon = L.divIcon({
        className: 'trackmate-poi-marker',
        html: `
          <div style="
            background: rgba(15, 23, 42, 0.9);
            font-size: 13px;
            padding: 3px 6px;
            border-radius: 8px;
            border: 1px solid rgba(255,255,255,0.25);
            box-shadow: 0 2px 8px rgba(0,0,0,0.35);
            cursor: pointer;
          ">
            ${emoji}
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const poiMarker = L.marker([poi.latitude, poi.longitude], { icon: poiIcon })
        .bindPopup(`
          <div style="font-family: system-ui; min-width: 140px; color: #0f172a;">
            <strong>${emoji} ${poi.name}</strong>
            <div style="font-size: 0.75rem; color: #64748b; margin-top: 2px;">${poi.categoryLabel}</div>
          </div>
        `);
      markersGroup.addLayer(poiMarker);
    });

  }, [
    currentUserLocation,
    selectedDestination,
    members,
    meetingPoint,
    centerLat,
    centerLon,
    separationRadiusMeters,
    activePoiFilters,
    isSharingLocation
  ]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height,
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        border: '1px solid rgba(99,102,241,0.25)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
        background: '#1e293b'
      }}
    >
      {/* FLOATING MAP LAYER SWITCHER */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 1000,
          display: 'flex',
          gap: 4,
          background: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(10px)',
          padding: '4px',
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
            padding: '5px 10px',
            borderRadius: 6,
            fontSize: '0.74rem',
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
            padding: '5px 10px',
            borderRadius: 6,
            fontSize: '0.74rem',
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
            padding: '5px 10px',
            borderRadius: 6,
            fontSize: '0.74rem',
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
            padding: '5px 10px',
            borderRadius: 6,
            fontSize: '0.74rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          title="Topographic Terrain"
        >
          ⛰️ Topo
        </button>
      </div>

      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default TrackMateMap;
