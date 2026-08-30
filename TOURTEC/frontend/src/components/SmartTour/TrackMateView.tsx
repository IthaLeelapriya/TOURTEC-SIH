import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Radio,
  MapPin,
  Users,
  Shield,
  AlertTriangle,
  Compass,
  Clock,
  Battery,
  Phone,
  MessageCircle,
  Share2,
  Navigation,
  CheckCircle2,
  X,
  Plus,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  Bell,
  RefreshCw,
  Sparkles,
  Sliders,
  Layers,
  PhoneCall,
  Activity,
  AlertOctagon,
  ArrowRight,
  Crosshair,
  LocateFixed,
  AlertCircle,
  Trash2,
  UserMinus
} from 'lucide-react';
import {
  TrackMateGroup,
  TrackMateMember,
  TrackMateMeetingPoint,
  TrackMateAlert,
  TrackMateSharingDuration,
  TrackMateMemberStatus,
  TrackMateDestinationLandmark,
  User
} from '../../types/smartTourTypes';
import { trackMateApi, DEMO_DESTINATIONS } from '../../services/smartTourApi';
import TrackMateMap from './TrackMateMap';

interface TrackMateViewProps {
  currentUser?: User | null;
  currency: string;
  initialDestination?: string;
  onOpenTripPlanner?: () => void;
  currentUserLocation?: { latitude: number; longitude: number; accuracy?: number } | null;
}

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

export const TrackMateView: React.FC<TrackMateViewProps> = ({
  currentUser,
  currency,
  initialDestination,
  onOpenTripPlanner,
  currentUserLocation: propLocation
}) => {
  // ── 1. INDEPENDENT STATE SEPARATION ──
  // A. Actual Live Device GPS Location (strictly from Geolocation API)
  const [currentUserLocation, setCurrentUserLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy?: number;
    timestamp: string;
  } | null>(() => {
    if (propLocation) {
      return {
        latitude: propLocation.latitude,
        longitude: propLocation.longitude,
        accuracy: propLocation.accuracy,
        timestamp: new Date().toISOString()
      };
    }
    return null;
  });

  // Sync prop changes
  useEffect(() => {
    if (propLocation) {
      setCurrentUserLocation({
        latitude: propLocation.latitude,
        longitude: propLocation.longitude,
        accuracy: propLocation.accuracy,
        timestamp: new Date().toISOString()
      });
      setGpsAccuracy(propLocation.accuracy || null);
    }
  }, [propLocation]);

  // B. Selected Trip / Map Destination (strictly from destination selection, NEVER user's GPS!)
  const [selectedDestination, setSelectedDestination] = useState<TrackMateDestinationLandmark | null>(null);

  // C. Active TrackMate Group & Family Members
  const [currentGroup, setCurrentGroup] = useState<TrackMateGroup | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMember, setSelectedMember] = useState<TrackMateMember | null>(null);

  // D. Geolocation & Sharing Status
  const [isSharingLocation, setIsSharingLocation] = useState<boolean>(false);
  const [locationPermissionStatus, setLocationPermissionStatus] = useState<'PROMPT' | 'GRANTED' | 'DENIED' | 'UNAVAILABLE'>('PROMPT');
  const [sharingDuration, setSharingDuration] = useState<TrackMateSharingDuration>('4h');
  const [remainingSeconds, setRemainingSeconds] = useState<number>(4 * 3600);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [locationStatus, setLocationStatus] = useState<TrackMateMemberStatus>('SHARING_OFF');
  const watchIdRef = useRef<number | null>(null);

  // Modals & Panels
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showJoinModal, setShowJoinModal] = useState<boolean>(false);
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [showMeetingPointModal, setShowMeetingPointModal] = useState<boolean>(false);
  const [showContactModal, setShowContactModal] = useState<TrackMateMember | null>(null);
  const [showSosConfirmModal, setShowSosConfirmModal] = useState<boolean>(false);
  const [memberToRemove, setMemberToRemove] = useState<TrackMateMember | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Forms
  const [createGroupName, setCreateGroupName] = useState<string>(
    initialDestination ? `${initialDestination} Family Trip` : 'Hyderabad Family Trip'
  );
  const [creatorName, setCreatorName] = useState<string>(currentUser ? currentUser.fullName : 'You');
  const [creatorPhone, setCreatorPhone] = useState<string>('+91 98765 43210');
  const [joinInviteCode, setJoinInviteCode] = useState<string>('');
  const [joinMemberName, setJoinMemberName] = useState<string>('Brother');
  const [joinRelation, setJoinRelation] = useState<string>('Brother');
  const [joinMemberPhone, setJoinMemberPhone] = useState<string>('+91 98765 33333');

  // Meeting Point Form
  const [meetingPointTitle, setMeetingPointTitle] = useState<string>(
    initialDestination ? `${initialDestination} Main Gate` : 'Charminar Clock Tower (Main Arch)'
  );
  const [meetingPointDesc, setMeetingPointDesc] = useState<string>('Central meeting area near ticket entrance');

  // Map Filter & View State
  const [activePoiFilters, setActivePoiFilters] = useState<string[]>([
    'attraction',
    'hotel',
    'restaurant',
    'hospital'
  ]);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lon: number } | null>(null);
  const [mapZoom, setMapZoom] = useState<number>(14);

  // Separation alert settings
  const [separationAlertEnabled, setSeparationAlertEnabled] = useState<boolean>(true);
  const [separationThresholdMeters, setSeparationThresholdMeters] = useState<number>(1500);

  // Show Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // ── RESOLVE INITIAL DESTINATION (WITHOUT OVERWRITING USER'S GPS!) ──
  useEffect(() => {
    if (initialDestination) {
      const match = DEMO_DESTINATIONS.find(
        (d) =>
          d.name.toLowerCase().includes(initialDestination.toLowerCase()) ||
          (d.city && d.city.toLowerCase().includes(initialDestination.toLowerCase())) ||
          (d.state && d.state.toLowerCase().includes(initialDestination.toLowerCase()))
      );

      if (match) {
        setSelectedDestination({
          name: match.name,
          state: match.state,
          city: match.city,
          latitude: match.location.latitude,
          longitude: match.location.longitude,
          description: match.description,
          category: match.category
        });
      } else {
        setSelectedDestination({
          name: initialDestination,
          latitude: 16.5167,
          longitude: 80.6083,
          description: 'Selected tour destination'
        });
      }
    }
  }, [initialDestination]);

  // ── INITIALIZE TRACKMATE GROUP ──
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const code = initialDestination?.toLowerCase().includes('vijayawada') ? 'VIJ-FAM' : 'HYD-FAM';
      const group = await trackMateApi.getGroup(code);
      if (group) {
        setCurrentGroup(group);
      } else {
        const created = await trackMateApi.createGroup({
          name: initialDestination ? `${initialDestination} Family Trip` : 'Hyderabad Family Trip',
          creatorName: currentUser ? currentUser.fullName : 'You',
          destinationCity: initialDestination || 'Hyderabad'
        });
        setCurrentGroup(created);
      }
      setLoading(false);
    };

    init();
  }, [initialDestination, currentUser]);

  // Subscribe to real-time updates when group changes
  useEffect(() => {
    if (!currentGroup) return;

    const unsubscribe = trackMateApi.subscribeToStream(currentGroup.inviteCode, (updatedGroup) => {
      setCurrentGroup(updatedGroup);
    });

    return () => unsubscribe();
  }, [currentGroup?.inviteCode]);

  // Timer countdown for temporary location sharing
  useEffect(() => {
    if (!isSharingLocation || sharingDuration === 'indefinite' || sharingDuration === 'trip') {
      return;
    }

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleStopSharing('Sharing time limit reached');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSharingLocation, sharingDuration]);

  // ── BROWSER GEOLOCATION API: SHARE MY LOCATION ──
  const handleStartSharing = () => {
    if (!('geolocation' in navigator)) {
      setLocationPermissionStatus('UNAVAILABLE');
      showToast('Geolocation is not supported by your device/browser.');
      return;
    }

    setLocationStatus('UPDATING');
    showToast('Requesting browser GPS location permission...');

    const durationSecondsMap: Record<TrackMateSharingDuration, number> = {
      '30m': 1800,
      '1h': 3600,
      '4h': 14400,
      'trip': 86400,
      'indefinite': 0
    };
    setRemainingSeconds(durationSecondsMap[sharingDuration]);

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    // Continuous watchPosition
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy, speed, heading } = position.coords;
        const nowIso = new Date().toISOString();

        setLocationPermissionStatus('GRANTED');
        setCurrentUserLocation({
          latitude,
          longitude,
          accuracy: Math.round(accuracy),
          timestamp: nowIso
        });
        setGpsAccuracy(Math.round(accuracy));
        setLocationStatus('SHARING_ON');
        setIsSharingLocation(true);

        // Center map on user's actual device location when starting sharing
        setMapCenter({ lat: latitude, lon: longitude });

        // Push to backend
        if (currentGroup) {
          trackMateApi.updateLocation(currentGroup.inviteCode, {
            latitude,
            longitude,
            accuracy,
            speed: speed || undefined,
            heading: heading || undefined,
            sharingStatus: 'SHARING_ON',
            sharingDuration
          });
        }
      },
      (error) => {
        console.warn('Geolocation watch error:', error);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationPermissionStatus('DENIED');
          setLocationStatus('SHARING_OFF');
          setIsSharingLocation(false);
          showToast('Location permission was denied. Please allow location access in your browser settings.');
        } else {
          setLocationPermissionStatus('UNAVAILABLE');
          setLocationStatus('SHARING_OFF');
          setIsSharingLocation(false);
          showToast('Unable to obtain GPS location. Please check device location services.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000
      }
    );
  };

  // ── STOP SHARING ──
  const handleStopSharing = async (reason?: string) => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    setIsSharingLocation(false);
    setLocationStatus('SHARING_OFF');

    if (currentGroup) {
      await trackMateApi.stopSharing(currentGroup.inviteCode);
    }

    showToast(reason || 'Your location is no longer being shared.');
  };

  // ── [📍 MY CURRENT LOCATION] BUTTON HANDLER ──
  const handleFocusMyCurrentLocation = () => {
    if (currentUserLocation && isSharingLocation) {
      setMapCenter({ lat: currentUserLocation.latitude, lon: currentUserLocation.longitude });
      setMapZoom(16);
      showToast('Centered map on your actual GPS location (You are here).');
    } else {
      // If not yet sharing or coordinates not fetched, request location
      showToast('Getting your actual device location...');
      handleStartSharing();
    }
  };

  // ── [📍 FOCUS DESTINATION] BUTTON HANDLER ──
  const handleFocusDestination = () => {
    if (selectedDestination) {
      setMapCenter({ lat: selectedDestination.latitude, lon: selectedDestination.longitude });
      setMapZoom(15);
      showToast(`Focused map on destination: ${selectedDestination.name}`);
    }
  };

  // ── [👥 FIT ALL] BUTTON HANDLER ──
  const handleFitAll = () => {
    // Reset explicit center so Leaflet auto-fits all active markers
    setMapCenter(null);
    showToast('Fitted map to show all family members, destination, and meeting point.');
  };

  // Format Duration Timer
  const formatTimer = (seconds: number) => {
    if (sharingDuration === 'indefinite') return 'Active (Until stopped)';
    if (sharingDuration === 'trip') return 'Active (Until end of trip)';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? `${hrs}h ` : ''}${mins}m ${secs}s remaining`;
  };

  // Haversine distance calculator
  const calculateDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  };

  // Distance to destination
  const distanceToDestinationKm = useMemo(() => {
    if (!currentUserLocation || !selectedDestination) return null;
    return calculateDistanceKm(
      currentUserLocation.latitude,
      currentUserLocation.longitude,
      selectedDestination.latitude,
      selectedDestination.longitude
    );
  }, [currentUserLocation, selectedDestination]);

  // Create Group Handler
  const handleCreateGroup = async () => {
    if (!createGroupName.trim()) return;
    const newGroup = await trackMateApi.createGroup({
      name: createGroupName,
      creatorName: creatorName || 'You',
      creatorRelation: 'Self',
      creatorPhone: creatorPhone || '+91 98765 43210',
      destinationCity: selectedDestination?.name || initialDestination || 'Hyderabad'
    });
    setCurrentGroup(newGroup);
    setShowCreateModal(false);
    showToast(`Created TrackMate Group "${newGroup.name}" with code ${newGroup.inviteCode}!`);
  };

  // Join Group Handler
  const handleJoinGroup = async () => {
    if (!joinInviteCode.trim()) return;
    const joined = await trackMateApi.joinGroup(joinInviteCode, {
      inviteCode: joinInviteCode,
      memberName: joinMemberName,
      relation: joinRelation,
      phone: joinMemberPhone
    });
    if (joined) {
      setCurrentGroup(joined);
      setShowJoinModal(false);
      showToast(`Joined group "${joined.name}" (${joinMemberName} • ${joinMemberPhone})!`);
    } else {
      showToast('Could not find TrackMate group with that code.');
    }
  };

  // Set Meeting Point Handler
  const handleSetMeetingPoint = async () => {
    if (!currentGroup || !meetingPointTitle.trim()) return;
    const baseLat = currentUserLocation?.latitude || selectedDestination?.latitude || 17.3616;
    const baseLon = currentUserLocation?.longitude || selectedDestination?.longitude || 78.4747;

    await trackMateApi.setMeetingPoint(currentGroup.inviteCode, {
      id: 'mp-' + Date.now(),
      title: meetingPointTitle,
      description: meetingPointDesc,
      latitude: baseLat + 0.002,
      longitude: baseLon + 0.002,
      setByMemberName: currentUser ? currentUser.fullName : 'You',
      createdAt: new Date().toISOString()
    });

    setShowMeetingPointModal(false);
    showToast(`Meeting point updated to "${meetingPointTitle}"!`);
  };

  // Trigger Emergency SOS Handler
  const handleTriggerEmergency = async () => {
    if (!currentGroup) return;
    await trackMateApi.triggerEmergency(currentGroup.inviteCode, undefined, 'Emergency assistance requested!');
    showToast('🚨 Emergency alert broadcast to all TrackMate family members with your GPS location!');
  };

  // Focus Map on Member
  const handleFocusMemberOnMap = (member: TrackMateMember) => {
    if (member.location) {
      setMapCenter({ lat: member.location.latitude, lon: member.location.longitude });
      setMapZoom(16);
      showToast(`Centered map on ${member.name} (${member.relation})`);
    } else {
      showToast(`${member.name}'s location is currently turned OFF.`);
    }
  };

  // Remove Member from Group Handler
  const handleRemoveMember = async (member: TrackMateMember) => {
    if (!currentGroup) return;
    try {
      const updated = await trackMateApi.removeMember(currentGroup.inviteCode, member.id);
      if (updated) {
        setCurrentGroup(updated);
      } else {
        setCurrentGroup((prev) => prev ? {
          ...prev,
          members: prev.members.filter((m) => m.id !== member.id)
        } : null);
      }
      setMemberToRemove(null);
      if (showContactModal?.id === member.id) {
        setShowContactModal(null);
      }
      showToast(`Removed ${member.name} (${member.relation}) from ${currentGroup.name}.`);
    } catch (err) {
      console.error('Error removing member:', err);
      showToast(`Failed to remove ${member.name}.`);
    }
  };

  // Toggle POI Filters
  const togglePoiFilter = (type: string) => {
    setActivePoiFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // SIMULATOR HANDLERS (for family members only — strictly leaves user's GPS untouched!)
  const handleSimulateMovement = (type: 'FATHER_WALK' | 'BROTHER_SEPARATION' | 'FATHER_ARRIVED') => {
    if (!currentGroup) return;

    if (type === 'FATHER_WALK') {
      const father = currentGroup.members.find((m) => m.relation === 'Father');
      if (father && father.location) {
        trackMateApi.updateLocation(currentGroup.inviteCode, {
          memberId: father.id,
          latitude: father.location.latitude + 0.001,
          longitude: father.location.longitude + 0.001,
          speed: 1.2,
          sharingStatus: 'SHARING_ON'
        });
        showToast('Simulated Father walking 100m towards market.');
      }
    } else if (type === 'BROTHER_SEPARATION') {
      const brother = currentGroup.members.find((m) => m.relation === 'Brother');
      if (brother && brother.location) {
        trackMateApi.updateLocation(currentGroup.inviteCode, {
          memberId: brother.id,
          latitude: brother.location.latitude + 0.015,
          longitude: brother.location.longitude + 0.012,
          speed: 4.5,
          sharingStatus: 'SHARING_ON'
        });
        showToast('⚠️ Simulated Brother moving 1.8km away (Separation Alert Triggered!)');
      }
    } else if (type === 'FATHER_ARRIVED') {
      const father = currentGroup.members.find((m) => m.relation === 'Father');
      const mp = currentGroup.meetingPoint;
      if (father && mp) {
        trackMateApi.updateLocation(currentGroup.inviteCode, {
          memberId: father.id,
          latitude: mp.latitude,
          longitude: mp.longitude,
          sharingStatus: 'SHARING_ON'
        });
        showToast(`✅ Simulated Father arriving at "${mp.title}" (Arrival Alert Triggered!)`);
      }
    }
  };

  if (loading && !currentGroup) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <RefreshCw size={32} className="spin" color="#6366f1" style={{ margin: '0 auto 16px' }} />
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Connecting to TrackMate...</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Loading family group & live location stream</p>
      </div>
    );
  }

  const activeSharingCount = currentGroup?.members.filter((m) => m.sharingStatus === 'SHARING_ON').length || 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1320, margin: '0 auto', paddingBottom: 40 }}>
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: 24,
            right: 24,
            zIndex: 200,
            background: 'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95))',
            border: '1px solid #6366f1',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(10px)',
            animation: 'slideIn 0.3s ease-out'
          }}
        >
          <Sparkles size={16} color="#6366f1" />
          <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f8fafc' }}>{toastMessage}</span>
        </div>
      )}

      {/* ── HEADER BANNER ── */}
      <div className="glass-panel" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span className="badge badge-primary" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Radio size={13} color="#34d399" /> TrackMate Live
              </span>
              <span className={`badge ${isSharingLocation ? 'badge-safe' : 'badge-danger'}`}>
                {isSharingLocation ? '🟢 Sharing: ON' : '🔴 Sharing: OFF'}
              </span>
              {currentGroup && (
                <span className="badge badge-saffron">
                  Invite Code: <strong style={{ letterSpacing: '0.05em', marginLeft: 4 }}>{currentGroup.inviteCode}</strong>
                </span>
              )}
            </div>

            <h1 className="gradient-text" style={{ fontSize: '2.4rem', fontWeight: 900, marginTop: 10, letterSpacing: '-0.03em' }}>
              TrackMate
            </h1>
            <p style={{ fontSize: '0.98rem', color: 'var(--text-secondary)', marginTop: 6, maxWidth: 700, fontWeight: 500, lineHeight: 1.65 }}>
              "Stay connected with your family while traveling." Share real-time location, set meeting spots, receive separation warnings, and travel together safely.
            </p>
          </div>

          {/* Group Actions */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={() => setShowInviteModal(true)}
              className="btn btn-secondary"
              style={{ fontSize: '0.82rem', padding: '8px 14px' }}
            >
              <Share2 size={14} />
              <span>Invite Member</span>
            </button>

            <button
              onClick={() => setShowJoinModal(true)}
              className="btn btn-secondary"
              style={{ fontSize: '0.82rem', padding: '8px 14px' }}
            >
              <Users size={14} />
              <span>Join Group</span>
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary"
              style={{ fontSize: '0.82rem', padding: '8px 14px' }}
            >
              <Plus size={14} />
              <span>Create Group</span>
            </button>
          </div>
        </div>

        {/* Group Bar & Destination Status */}
        {currentGroup && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255,255,255,0.03)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            flexWrap: 'wrap',
            gap: 12
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>Active Group</span>
                <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#ffffff' }}>
                  {currentGroup.name}
                </div>
              </div>
              <div style={{ height: 24, width: 1, background: 'var(--border-subtle)' }} />
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>Family Sharing</span>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#34d399' }}>
                  {activeSharingCount} of {currentGroup.members.length} Members Live
                </div>
              </div>
              {selectedDestination && (
                <>
                  <div style={{ height: 24, width: 1, background: 'var(--border-subtle)' }} />
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>Trip Destination</span>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ff9933' }}>
                      📍 {selectedDestination.name}
                    </div>
                  </div>
                </>
              )}
            </div>

            {onOpenTripPlanner && (
              <button
                onClick={onOpenTripPlanner}
                className="btn btn-secondary"
                style={{ fontSize: '0.78rem', padding: '6px 12px' }}
              >
                <Sparkles size={13} color="#ff9933" />
                <span>Open Trip Planner</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── SELECTED DESTINATION SEPARATION BANNER (Clear distinction from user GPS) ── */}
      {selectedDestination && (
        <div
          className="glass-panel"
          style={{
            padding: '14px 20px',
            background: 'linear-gradient(135deg, rgba(255,153,51,0.12), rgba(99,102,241,0.08))',
            border: '1px solid rgba(255,153,51,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#ff9933', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: '#fff' }}>
              📍
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <strong style={{ fontSize: '0.96rem', color: '#fef08a' }}>
                  Trip Destination: {selectedDestination.name}
                </strong>
                <span className="badge badge-saffron" style={{ fontSize: '0.68rem' }}>
                  {selectedDestination.city || selectedDestination.state || 'India'}
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                {currentUserLocation && isSharingLocation ? (
                  distanceToDestinationKm != null ? (
                    <span style={{ color: '#38bdf8', fontWeight: 600 }}>
                      📏 You are currently <strong>{distanceToDestinationKm} km</strong> away from this destination based on your device GPS.
                    </span>
                  ) : 'Calculating distance from your device GPS...'
                ) : (
                  <span>
                    ℹ️ You have selected this destination on the map. Click <strong>"Share My Location"</strong> to see your live GPS distance.
                  </span>
                )}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleFocusDestination}
              className="btn btn-secondary"
              style={{ fontSize: '0.78rem', padding: '6px 12px' }}
            >
              <MapPin size={13} color="#ff9933" />
              <span>Center Destination</span>
            </button>
            <button
              onClick={() => setSelectedDestination(null)}
              className="btn btn-secondary"
              style={{ fontSize: '0.78rem', padding: '6px 8px' }}
              title="Clear Destination Filter"
            >
              <X size={13} />
            </button>
          </div>
        </div>
      )}

      {/* ── ALERTS BANNER (If any alerts exist) ── */}
      {currentGroup?.alerts && currentGroup.alerts.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {currentGroup.alerts.slice(0, 2).map((alert) => (
            <div
              key={alert.id}
              className="glass-panel"
              style={{
                padding: '12px 18px',
                borderLeft: alert.type === 'EMERGENCY' ? '4px solid #ef4444' : '4px solid #f59e0b',
                background: alert.type === 'EMERGENCY' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 10
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {alert.type === 'EMERGENCY' ? <AlertOctagon size={20} color="#ef4444" /> : <AlertTriangle size={18} color="#f59e0b" />}
                <div>
                  <strong style={{ fontSize: '0.88rem', color: alert.type === 'EMERGENCY' ? '#fca5a5' : '#fde047' }}>
                    {alert.title}
                  </strong>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginLeft: 8 }}>
                    {alert.message}
                  </span>
                </div>
              </div>

              {alert.location && (
                <button
                  onClick={() => {
                    setMapCenter({ lat: alert.location!.latitude, lon: alert.location!.longitude });
                    setMapZoom(16);
                  }}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                >
                  <MapPin size={12} /> View Location
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── TWO COLUMN MAIN LAYOUT ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
        
        {/* LEFT COLUMN: Controls, Members List, Meeting Point & Safety */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* 1. 📍 LOCATION SHARING CONTROLLER (STRICTLY FROM DEVICE GPS) */}
          <div className="glass-panel" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Radio size={18} color="#3b82f6" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Live Geolocation Controller</h3>
              </div>
              <span className={`badge ${isSharingLocation ? 'badge-safe' : 'badge-danger'}`}>
                {locationStatus === 'SHARING_ON' ? '🟢 Active GPS' : locationStatus === 'UPDATING' ? '🟡 Updating' : '🔴 OFF'}
              </span>
            </div>

            {/* Permission Denied Notice */}
            {locationPermissionStatus === 'DENIED' && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', padding: '10px 14px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertCircle size={16} color="#ef4444" />
                <div style={{ fontSize: '0.8rem', color: '#fca5a5' }}>
                  Location permission was denied. Please allow location access in your browser settings to share your live GPS location.
                </div>
              </div>
            )}

            {/* Current Coordinates Box (if active) */}
            {currentUserLocation && isSharingLocation ? (
              <div style={{
                background: 'rgba(59,130,246,0.08)',
                border: '1px solid rgba(59,130,246,0.3)',
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: 6
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', color: '#93c5fd', fontWeight: 700 }}>
                    🔵 Your Device GPS Coordinates:
                  </span>
                  {gpsAccuracy && (
                    <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 600 }}>
                      🎯 ±{gpsAccuracy}m Accuracy
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {currentUserLocation.latitude.toFixed(4)}° N, {currentUserLocation.longitude.toFixed(4)}° E
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                    <Clock size={13} color="#2563EB" /> {formatTimer(remainingSeconds)}
                  </span>
                  <button
                    onClick={handleFocusMyCurrentLocation}
                    style={{ background: 'none', border: 'none', color: '#2563EB', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'underline' }}
                  >
                    Center on Map ↗
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ padding: '14px 16px', background: 'var(--surface-soft)', borderRadius: 'var(--radius-sm)', border: '1.5px dashed var(--border)', fontSize: '0.86rem', color: 'var(--text-secondary)', fontWeight: 500, lineHeight: 1.5 }}>
                📍 Location Sharing is currently <strong>OFF</strong>. Click the button below to prompt browser permission and share your live GPS coordinates with family.
              </div>
            )}

            {/* Sharing Duration Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Share Location For Duration:
              </label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {(['30m', '1h', '4h', 'trip', 'indefinite'] as TrackMateSharingDuration[]).map((dur) => {
                  const labels: Record<TrackMateSharingDuration, string> = {
                    '30m': '30 Mins',
                    '1h': '1 Hour',
                    '4h': '4 Hours',
                    'trip': 'Until Trip Ends',
                    'indefinite': 'Until I Stop'
                  };
                  const active = sharingDuration === dur;
                  return (
                    <button
                      key={dur}
                      onClick={() => {
                        setSharingDuration(dur);
                        if (isSharingLocation) handleStartSharing();
                      }}
                      className={`chip ${active ? 'active' : ''}`}
                      style={{ fontSize: '0.75rem', padding: '5px 10px' }}
                    >
                      {labels[dur]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions Buttons */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {isSharingLocation ? (
                <button
                  onClick={() => handleStopSharing()}
                  className="btn btn-emergency"
                  style={{ flex: '1 1 180px', padding: '10px', fontSize: '0.86rem', fontWeight: 700 }}
                >
                  <EyeOff size={15} />
                  <span>Stop Sharing Location</span>
                </button>
              ) : (
                <button
                  onClick={handleStartSharing}
                  className="btn btn-primary"
                  style={{ flex: '1 1 180px', padding: '10px', fontSize: '0.86rem', fontWeight: 700 }}
                >
                  <Radio size={15} />
                  <span>Share My Location</span>
                </button>
              )}

              {/* [📍 My Current Location] Button */}
              <button
                onClick={handleFocusMyCurrentLocation}
                className="btn btn-secondary"
                style={{ flex: '1 1 140px', padding: '10px', fontSize: '0.82rem', color: '#60a5fa', fontWeight: 600 }}
                title="Center map on your actual device GPS location"
              >
                <LocateFixed size={15} />
                <span>My Current Location</span>
              </button>
            </div>
          </div>

          {/* 2. 👨‍👩‍👧 TRACKMATE MEMBERS CARDS */}
          <div className="glass-panel" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Users size={18} color="#10b981" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                  TrackMate Family Members ({currentGroup?.members.length || 0})
                </h3>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {activeSharingCount} Live
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Current User Card */}
              <div
                className="glass-panel-interactive"
                style={{
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(59,130,246,0.06)',
                  border: '1px solid rgba(59,130,246,0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: '#3b82f6',
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid rgba(255,255,255,0.4)'
                    }}>
                      👤
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <strong style={{ fontSize: '0.94rem' }}>You</strong>
                        <span className="badge badge-primary" style={{ fontSize: '0.62rem', padding: '1px 5px' }}>YOUR DEVICE</span>
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-subtle)', marginTop: 2 }}>
                        {isSharingLocation ? '🟢 Sharing: ON (Live GPS)' : '🔴 Sharing: OFF'}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    {isSharingLocation && currentUserLocation ? (
                      <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 700 }}>
                        "You are here"
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Location unavailable
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 6, paddingTop: 6, borderTop: '1px solid var(--border-subtle)', justifyContent: 'flex-end' }}>
                  <button
                    onClick={handleFocusMyCurrentLocation}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.72rem', padding: '4px 10px', color: '#60a5fa' }}
                  >
                    <LocateFixed size={12} />
                    <span>Focus GPS on Map</span>
                  </button>
                </div>
              </div>

              {/* Family Members Cards */}
              {currentGroup?.members.filter(m => !m.isCurrentUser).map((member) => {
                const isSharing = member.sharingStatus === 'SHARING_ON';

                return (
                  <div
                    key={member.id}
                    className="glass-panel-interactive"
                    style={{
                      padding: '14px 16px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          background: member.avatarColor || '#10b981',
                          color: '#fff',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '2px solid rgba(255,255,255,0.2)'
                        }}>
                          {member.name.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <strong style={{ fontSize: '0.94rem' }}>{member.name}</strong>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              ({member.relation})
                            </span>
                          </div>
                          
                          <div style={{ fontSize: '0.76rem', color: 'var(--text-subtle)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span>{isSharing ? '🟢 Sharing: ON' : '🔴 Sharing: OFF'}</span>
                            {member.location?.batteryLevel && (
                              <span>🔋 {member.location.batteryLevel}%</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Distance Badge */}
                      <div style={{ textAlign: 'right' }}>
                        {(() => {
                          const dist = isSharing && member.location && currentUserLocation
                            ? Math.round(calculateDistanceMeters(currentUserLocation.latitude, currentUserLocation.longitude, member.location.latitude, member.location.longitude))
                            : member.distanceFromUserMeters;

                          if (isSharing && dist != null) {
                            return (
                              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#34d399' }}>
                                {dist < 1000 ? `${dist} m` : `${(dist / 1000).toFixed(1)} km`}
                                <div style={{ fontSize: '0.68rem', fontWeight: 400, color: 'var(--text-muted)' }}>away from you</div>
                              </div>
                            );
                          }
                          return <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Not sharing</span>;
                        })()}
                      </div>
                    </div>

                    {/* Member Action Buttons */}
                    <div style={{ display: 'flex', gap: 6, paddingTop: 6, borderTop: '1px solid var(--border-subtle)', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      {isSharing && (
                        <button
                          onClick={() => handleFocusMemberOnMap(member)}
                          className="btn btn-secondary"
                          style={{ fontSize: '0.72rem', padding: '4px 8px' }}
                          title="View on Map"
                        >
                          <MapPin size={12} />
                          <span>View on Map</span>
                        </button>
                      )}

                      <button
                        onClick={() => setShowContactModal(member)}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.72rem', padding: '4px 8px' }}
                        title="Contact Member"
                      >
                        <Phone size={12} />
                        <span>Contact</span>
                      </button>

                      <button
                        onClick={() => {
                          showToast(`Arrival alert set for ${member.name}! You will be notified when they reach the hotel or meeting point.`);
                        }}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.72rem', padding: '4px 8px' }}
                        title="Notify when member arrives"
                      >
                        <Bell size={12} />
                        <span>Arrival Alert</span>
                      </button>

                      <button
                        onClick={() => setMemberToRemove(member)}
                        className="btn btn-secondary"
                        style={{
                          fontSize: '0.72rem',
                          padding: '4px 8px',
                          color: '#ef4444',
                          borderColor: 'rgba(239, 68, 68, 0.35)',
                          background: 'rgba(239, 68, 68, 0.04)'
                        }}
                        title={`Remove ${member.name} from group`}
                      >
                        <Trash2 size={12} color="#ef4444" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. 📌 MEETING POINT PANEL */}
          <div className="glass-panel" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={18} color="#ef4444" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Family Meeting Point</h3>
              </div>
              <button
                onClick={() => setShowMeetingPointModal(true)}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '4px 10px' }}
              >
                Set Meeting Point
              </button>
            </div>

            {currentGroup?.meetingPoint ? (
              <div style={{
                background: 'rgba(239,68,68,0.06)',
                border: '1px solid rgba(239,68,68,0.2)',
                padding: '14px 16px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: 8
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <strong style={{ fontSize: '0.95rem', color: '#fca5a5' }}>
                    📌 {currentGroup.meetingPoint.title}
                  </strong>
                  <span className="badge badge-danger" style={{ fontSize: '0.7rem' }}>
                    Designated Regrouping Spot
                  </span>
                </div>
                {currentGroup.meetingPoint.description && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                    {currentGroup.meetingPoint.description}
                  </p>
                )}
                {currentGroup.meetingPoint.address && (
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                    📍 {currentGroup.meetingPoint.address}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <button
                    onClick={() => {
                      if (currentGroup.meetingPoint) {
                        setMapCenter({ lat: currentGroup.meetingPoint.latitude, lon: currentGroup.meetingPoint.longitude });
                        setMapZoom(16);
                        showToast(`Focused on Meeting Point "${currentGroup.meetingPoint.title}"`);
                      }
                    }}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.74rem', padding: '4px 8px' }}
                  >
                    <Navigation size={12} />
                    <span>Get Directions</span>
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ padding: '16px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-subtle)' }}>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  No meeting point set yet. Designate a landmark where everyone can regroup if separated.
                </p>
                <button
                  onClick={() => setShowMeetingPointModal(true)}
                  className="btn btn-primary"
                  style={{ fontSize: '0.78rem', marginTop: 8 }}
                >
                  Set Landmark Meeting Point
                </button>
              </div>
            )}
          </div>

          {/* 4. 🆘 TRACKMATE EMERGENCY PANEL */}
          <div className="glass-panel" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14, border: '1px solid rgba(239,68,68,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={18} color="#ef4444" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fca5a5' }}>
                TrackMate Emergency & SOS
              </h3>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              Instantly broadcast an urgent assistance notification with your exact GPS coordinates to all family members.
            </p>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                onClick={handleTriggerEmergency}
                className="btn btn-emergency"
                style={{ flex: '1 1 140px', padding: '10px', fontSize: '0.82rem', fontWeight: 700 }}
              >
                <AlertOctagon size={15} />
                <span>Alert Family</span>
              </button>

              <button
                onClick={handleStartSharing}
                className="btn btn-secondary"
                style={{ flex: '1 1 140px', padding: '10px', fontSize: '0.82rem' }}
              >
                <Radio size={14} color="#34d399" />
                <span>Share My Location</span>
              </button>

              <button
                onClick={() => setShowSosConfirmModal(true)}
                className="btn btn-emergency"
                style={{ flex: '1 1 120px', padding: '10px', fontSize: '0.82rem', background: '#991b1b' }}
              >
                <PhoneCall size={14} />
                <span>Call 112</span>
              </button>
            </div>
          </div>

          {/* 5. 🔐 LOCATION PRIVACY NOTICE */}
          <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 8, background: 'rgba(15,23,42,0.4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Shield size={16} color="#818cf8" />
              <strong style={{ fontSize: '0.88rem', color: '#c7d2fe' }}>Location Privacy & Consent</strong>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              Your location is shared <strong>only with approved members of your TrackMate group</strong> who have your invite code ({currentGroup?.inviteCode}). You can stop sharing at any time. The selected trip destination is never reported as your current location.
            </p>
          </div>

        </div>

        {/* RIGHT COLUMN: Interactive TrackMate Map, POI Filters & Simulator */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* MAP CONTAINER */}
          <div className="glass-panel" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Compass size={18} color="#6366f1" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>TrackMate Live Map</h3>
              </div>

              {/* Map controls overlay */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button
                  onClick={handleFocusMyCurrentLocation}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.72rem', padding: '5px 10px', color: '#60a5fa', fontWeight: 700 }}
                  title="Center map on your actual device GPS location"
                >
                  <LocateFixed size={13} />
                  <span>My Current Location</span>
                </button>

                {selectedDestination && (
                  <button
                    onClick={handleFocusDestination}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.72rem', padding: '5px 10px', color: '#ff9933' }}
                    title="Center map on selected trip destination"
                  >
                    <MapPin size={13} />
                    <span>Destination</span>
                  </button>
                )}

                {currentGroup?.meetingPoint && (
                  <button
                    onClick={() => {
                      setMapCenter({ lat: currentGroup.meetingPoint!.latitude, lon: currentGroup.meetingPoint!.longitude });
                      setMapZoom(16);
                    }}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.72rem', padding: '5px 10px', color: '#f87171' }}
                  >
                    📌 Meeting Point
                  </button>
                )}

                <button
                  onClick={handleFitAll}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.72rem', padding: '5px 10px' }}
                >
                  👥 Fit All
                </button>
              </div>
            </div>

            {/* Travel POI Filter Chips */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', paddingTop: 2 }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', textTransform: 'uppercase', marginRight: 4 }}>
                Show on Map:
              </span>
              {[
                { id: 'attraction', label: '📍 Attractions' },
                { id: 'hotel', label: '🏨 Hotels' },
                { id: 'restaurant', label: '🍛 Dining' },
                { id: 'hospital', label: '🏥 Hospitals' },
                { id: 'pharmacy', label: '💊 Pharmacy' },
                { id: 'atm', label: '🏧 ATMs' },
                { id: 'fuel', label: '⛽ Petrol' }
              ].map((poi) => {
                const active = activePoiFilters.includes(poi.id);
                return (
                  <button
                    key={poi.id}
                    onClick={() => togglePoiFilter(poi.id)}
                    className={`chip ${active ? 'active' : ''}`}
                    style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                  >
                    {poi.label}
                  </button>
                );
              })}
            </div>

            {/* Interactive Leaflet Map (WITH STRICT GPS vs DESTINATION SEPARATION) */}
            {currentGroup && (
              <TrackMateMap
                currentUserLocation={currentUserLocation}
                selectedDestination={selectedDestination}
                members={currentGroup.members}
                meetingPoint={currentGroup.meetingPoint}
                center={mapCenter}
                zoom={mapZoom}
                height={460}
                separationRadiusMeters={separationThresholdMeters}
                activePoiFilters={activePoiFilters}
                isSharingLocation={isSharingLocation}
                onMemberClick={(m) => setSelectedMember(m)}
                onFocusCurrentLocation={handleFocusMyCurrentLocation}
                onFocusDestination={handleFocusDestination}
              />
            )}

            {/* Map Legend (Requirement #10) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, fontSize: '0.75rem', color: 'var(--text-muted)', paddingTop: 6, borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#3b82f6', border: '1.5px solid #fff' }} />
                  <strong style={{ color: '#93c5fd' }}>🔵 My Current Location</strong>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', border: '1.5px solid #fff' }} />
                  <span>🟢 Family Member</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff9933', border: '1.5px solid #fff' }} />
                  <span style={{ color: '#fde047' }}>📍 Selected Destination</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', border: '1.5px solid #fff' }} />
                  <span>📌 Meeting Point</span>
                </span>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>OpenStreetMap + GPS Engine</span>
            </div>
          </div>

          {/* 6. ⚠️ SAFETY & SEPARATION SETTINGS */}
          <div className="glass-panel" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Shield size={18} color="#ff9933" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Family Safety & Separation Alerts</h3>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={separationAlertEnabled}
                  onChange={(e) => setSeparationAlertEnabled(e.target.checked)}
                />
                <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Enable Alerts</span>
              </label>
            </div>

            {separationAlertEnabled && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Separation Distance Threshold:</span>
                  <strong style={{ color: '#818cf8' }}>{separationThresholdMeters} meters ({(separationThresholdMeters / 1000).toFixed(1)} km)</strong>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[500, 1000, 1500, 2000, 3000].map((dist) => (
                    <button
                      key={dist}
                      onClick={() => setSeparationThresholdMeters(dist)}
                      className={`chip ${separationThresholdMeters === dist ? 'active' : ''}`}
                      style={{ fontSize: '0.74rem', padding: '4px 8px' }}
                    >
                      {dist >= 1000 ? `${dist / 1000} km` : `${dist}m`}
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', margin: '4px 0 0 0' }}>
                  If any family member wanders beyond this distance from the group, an automatic warning alert is displayed.
                </p>
              </div>
            )}
          </div>

          {/* 7. 🎮 DEMO FAMILY MOVEMENT SIMULATOR */}
          <div className="glass-panel" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12, background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={18} color="#818cf8" />
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#c7d2fe' }}>
                🎮 Interactive Movement Simulator (Single-Device Testing)
              </h3>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              Test how family member location pins and alerts react in real-time (does not affect your device GPS):
            </p>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                onClick={() => handleSimulateMovement('FATHER_WALK')}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '6px 10px' }}
              >
                🚶 Simulate Father Walking (100m)
              </button>

              <button
                onClick={() => handleSimulateMovement('BROTHER_SEPARATION')}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '6px 10px', color: '#fde047' }}
              >
                ⚠️ Simulate Brother 1.8km Away (Separation Alert)
              </button>

              <button
                onClick={() => handleSimulateMovement('FATHER_ARRIVED')}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '6px 10px', color: '#86efac' }}
              >
                🏁 Simulate Father Reaching Meeting Point (Arrival Alert)
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* ── MODALS ── */}

      {/* 1. CREATE GROUP MODAL */}
      {showCreateModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10, 15, 30, 0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            zIndex: 150
          }}
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="glass-panel"
            style={{ maxWidth: 480, width: '100%', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Create TrackMate Group</h3>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Group Name (e.g. Hyderabad Family Trip)</label>
              <input
                type="text"
                value={createGroupName}
                onChange={(e) => setCreateGroupName(e.target.value)}
                placeholder="Enter trip / family group name"
                className="input-field"
              />

              <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Your Name</label>
              <input
                type="text"
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                placeholder="Your Name"
                className="input-field"
              />

              <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Your Phone Number (for family contact)</label>
              <input
                type="tel"
                value={creatorPhone}
                onChange={(e) => setCreatorPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="input-field"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
              <button onClick={() => setShowCreateModal(false)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleCreateGroup} className="btn btn-primary" style={{ fontWeight: 700 }}>
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. JOIN GROUP MODAL */}
      {showJoinModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10, 15, 30, 0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            zIndex: 150
          }}
          onClick={() => setShowJoinModal(false)}
        >
          <div
            className="glass-panel"
            style={{ maxWidth: 480, width: '100%', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Join TrackMate Group</h3>
              <button onClick={() => setShowJoinModal(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>6-Character Invite Code (e.g. HYD-FAM)</label>
              <input
                type="text"
                value={joinInviteCode}
                onChange={(e) => setJoinInviteCode(e.target.value.toUpperCase())}
                placeholder="Enter invite code"
                className="input-field"
                style={{ letterSpacing: '0.1em', fontWeight: 700 }}
              />

              <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Your Name</label>
              <input
                type="text"
                value={joinMemberName}
                onChange={(e) => setJoinMemberName(e.target.value)}
                placeholder="Your Name"
                className="input-field"
              />

              <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Your Phone Number (for family contact & WhatsApp)</label>
              <input
                type="tel"
                value={joinMemberPhone}
                onChange={(e) => setJoinMemberPhone(e.target.value)}
                placeholder="e.g. +91 98765 33333"
                className="input-field"
              />

              <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Your Relation to Group</label>
              <select
                value={joinRelation}
                onChange={(e) => setJoinRelation(e.target.value)}
                className="input-field"
              >
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Brother">Brother</option>
                <option value="Sister">Sister</option>
                <option value="Spouse">Spouse</option>
                <option value="Child">Child</option>
                <option value="Friend">Friend</option>
                <option value="Relative">Relative</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
              <button onClick={() => setShowJoinModal(false)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleJoinGroup} className="btn btn-primary" style={{ fontWeight: 700 }}>
                Join Group
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. INVITE MODAL */}
      {showInviteModal && currentGroup && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10, 15, 30, 0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            zIndex: 150
          }}
          onClick={() => setShowInviteModal(false)}
        >
          <div
            className="glass-panel"
            style={{ maxWidth: 480, width: '100%', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Invite Family Member</h3>
              <button onClick={() => setShowInviteModal(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Share this invite code or link with your family members so they can join <strong>{currentGroup.name}</strong>:
            </p>

            <div style={{
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid #6366f1',
              padding: '16px',
              borderRadius: 'var(--radius-sm)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#cbd5e1', textTransform: 'uppercase' }}>Group Invite Code</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.15em', marginTop: 4 }}>
                {currentGroup.inviteCode}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(currentGroup.inviteCode);
                  showToast(`Copied code "${currentGroup.inviteCode}" to clipboard!`);
                }}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                <Copy size={14} /> Copy Code
              </button>

              <button
                onClick={() => {
                  const link = `${window.location.origin}/?trackmate=${currentGroup.inviteCode}`;
                  navigator.clipboard.writeText(link);
                  showToast('Copied TrackMate invite link to clipboard!');
                }}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                <Share2 size={14} /> Copy Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. SET MEETING POINT MODAL */}
      {showMeetingPointModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10, 15, 30, 0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            zIndex: 150
          }}
          onClick={() => setShowMeetingPointModal(false)}
        >
          <div
            className="glass-panel"
            style={{ maxWidth: 480, width: '100%', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>📌 Set Family Meeting Point</h3>
              <button onClick={() => setShowMeetingPointModal(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Meeting Point Landmark Name</label>
              <input
                type="text"
                value={meetingPointTitle}
                onChange={(e) => setMeetingPointTitle(e.target.value)}
                placeholder="e.g. Kanaka Durga Temple Main Entrance / Charminar Clock Tower"
                className="input-field"
              />

              <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Location Details / Specific Instructions</label>
              <textarea
                value={meetingPointDesc}
                onChange={(e) => setMeetingPointDesc(e.target.value)}
                placeholder="e.g. Meet near the south gate ticket counter"
                className="input-field"
                rows={3}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
              <button onClick={() => setShowMeetingPointModal(false)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleSetMeetingPoint} className="btn btn-primary" style={{ fontWeight: 700 }}>
                Set Meeting Point
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. CONTACT MEMBER MODAL */}
      {showContactModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10, 15, 30, 0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            zIndex: 150
          }}
          onClick={() => setShowContactModal(null)}
        >
          <div
            className="glass-panel"
            style={{ maxWidth: 420, width: '100%', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Contact {showContactModal.name}</h3>
              <button onClick={() => setShowContactModal(null)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.03)', padding: 14, borderRadius: 'var(--radius-sm)' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: showContactModal.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: '#fff', fontWeight: 800 }}>
                {showContactModal.name.charAt(0)}
              </div>
              <div>
                <strong style={{ fontSize: '1rem' }}>{showContactModal.name}</strong>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Relation: {showContactModal.relation}</div>
                <div style={{ fontSize: '0.8rem', color: '#38bdf8' }}>{showContactModal.phone || '+91 98765 43210'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a
                href={`tel:${showContactModal.phone || '+919876543210'}`}
                className="btn btn-primary"
                style={{ textAlign: 'center', textDecoration: 'none', padding: '10px' }}
                onClick={() => setShowContactModal(null)}
              >
                <Phone size={14} /> Call Phone
              </a>

              <a
                href={`https://wa.me/${(showContactModal.phone || '919876543210').replace(/[^0-9]/g, '')}?text=Hi%20${showContactModal.name},%20checking%20in%20from%20TrackMate.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ textAlign: 'center', textDecoration: 'none', padding: '10px', color: '#34d399' }}
                onClick={() => setShowContactModal(null)}
              >
                <MessageCircle size={14} /> WhatsApp Message
              </a>

              <button
                onClick={() => {
                  const m = showContactModal;
                  setShowContactModal(null);
                  setMemberToRemove(m);
                }}
                className="btn btn-secondary"
                style={{ textAlign: 'center', padding: '10px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.35)', marginTop: 4, background: 'rgba(239, 68, 68, 0.04)' }}
              >
                <Trash2 size={14} color="#ef4444" /> Remove from Group
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. CALL 112 CONFIRMATION MODAL */}
      {showSosConfirmModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10, 15, 30, 0.9)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            zIndex: 160
          }}
          onClick={() => setShowSosConfirmModal(false)}
        >
          <div
            className="glass-panel"
            style={{ maxWidth: 440, width: '100%', padding: 26, display: 'flex', flexDirection: 'column', gap: 16, border: '1px solid #ef4444' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <AlertTriangle size={24} color="#ef4444" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fca5a5' }}>
                Confirm Emergency Call 112
              </h3>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
              This will dial the <strong>National Emergency Helpline (112)</strong> for India (Police, Fire, Ambulance).
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
              <button onClick={() => setShowSosConfirmModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <a
                href="tel:112"
                className="btn btn-emergency"
                style={{ padding: '10px 18px', fontWeight: 800, textDecoration: 'none' }}
                onClick={() => setShowSosConfirmModal(false)}
              >
                <PhoneCall size={16} />
                <span>Call 112 Now</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 7. REMOVE MEMBER CONFIRMATION MODAL */}
      {memberToRemove && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10, 15, 30, 0.88)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            zIndex: 160
          }}
          onClick={() => setMemberToRemove(null)}
        >
          <div
            className="glass-panel"
            style={{ maxWidth: 440, width: '100%', padding: 24, display: 'flex', flexDirection: 'column', gap: 16, border: '1.5px solid rgba(239, 68, 68, 0.4)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Trash2 size={20} color="#ef4444" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Remove Member
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  TrackMate Family Safety Circle
                </p>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Are you sure you want to remove <strong>{memberToRemove.name}</strong> ({memberToRemove.relation}) from <strong>{currentGroup?.name}</strong>?
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              Their live GPS location, proximity distance, and safety alerts will no longer be shared with this group.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
              <button
                onClick={() => setMemberToRemove(null)}
                className="btn btn-secondary"
                style={{ padding: '8px 16px' }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemoveMember(memberToRemove)}
                className="btn btn-emergency"
                style={{ padding: '8px 18px', fontWeight: 750 }}
              >
                <Trash2 size={14} />
                <span>Remove Member</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TrackMateView;
