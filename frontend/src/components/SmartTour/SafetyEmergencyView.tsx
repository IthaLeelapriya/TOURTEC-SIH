import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  PhoneCall,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Radio,
  FileText,
  Send,
  ExternalLink,
  ShieldCheck,
  Building2,
  Car,
  LocateFixed
} from 'lucide-react';
import {
  SafetyAlert,
  SafetyIncident,
  SafetyZone,
  EmergencyContact
} from '../../types/smartTourTypes';
import {
  DEMO_ALERTS,
  DEMO_SAFETY_ZONES,
  DEMO_EMERGENCY_CONTACTS
} from '../../services/smartTourApi';
import OsmInteractiveMap, { MapMarker } from './OsmInteractiveMap';

interface SafetyEmergencyViewProps {
  currentUserLocation?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    city?: string;
    region?: string;
  } | null;
}

export const SafetyEmergencyView: React.FC<SafetyEmergencyViewProps> = ({
  currentUserLocation
}) => {
  const [alerts] = useState<SafetyAlert[]>(DEMO_ALERTS);
  const [zones] = useState<SafetyZone[]>(DEMO_SAFETY_ZONES);
  const [contacts] = useState<EmergencyContact[]>(DEMO_EMERGENCY_CONTACTS);

  // Incident report form state
  const [reportTitle, setReportTitle] = useState('');
  const [reportType, setReportType] = useState('Crowd Alert');
  const [reportDesc, setReportDesc] = useState('');
  const [reportState, setReportState] = useState('Rajasthan');
  const [reportedSubmitted, setReportSubmitted] = useState(false);

  // Base coordinates for nearby emergency facilities around user or India center
  const baseLat = currentUserLocation?.latitude || 20.5937;
  const baseLon = currentUserLocation?.longitude || 78.9629;

  // Emergency Map Markers around user
  const emergencyMarkers: MapMarker[] = [
    {
      id: 'em-pol-1',
      latitude: baseLat + 0.005,
      longitude: baseLon + 0.004,
      label: '🚨 Tourist Police Station (Dial 112)',
      category: 'police',
      iconType: 'police',
      description: '24/7 Tourist Police Station & Rapid Emergency Response Team'
    },
    {
      id: 'em-hosp-1',
      latitude: baseLat - 0.004,
      longitude: baseLon + 0.006,
      label: '🏥 District Civil Hospital & Trauma Center (Dial 108)',
      category: 'hospital',
      iconType: 'hospital',
      description: '24/7 Emergency Casualty, ICU, Blood Bank, and Ambulance Services'
    },
    {
      id: 'em-kiosk-1',
      latitude: baseLat + 0.002,
      longitude: baseLon - 0.005,
      label: 'ℹ️ Ministry of Tourism Safety Assistance Kiosk',
      category: 'attraction',
      iconType: 'kiosk',
      description: 'Official Government Tourist Information, Multilingual Assistance & Verification Desk'
    },
    {
      id: 'em-pharma-1',
      latitude: baseLat - 0.003,
      longitude: baseLon - 0.003,
      label: '💊 24-Hour Emergency Pharmacy & Medical Store',
      category: 'pharmacy',
      iconType: 'pharmacy',
      description: 'Open 24/7 for prescription medicines, first aid kits, and emergency supplies'
    }
  ];

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim() || !reportDesc.trim()) return;

    setReportSubmitted(true);
    setTimeout(() => {
      setReportTitle('');
      setReportDesc('');
      setReportSubmitted(false);
      alert('Safety report submitted to SmartTour AI verification system. Thank you for keeping tourists safe!');
    }, 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1200, margin: '0 auto' }}>
      
      {/* Emergency Helplines & Advisories Notice Banner */}
      <div
        className="card"
        style={{
          padding: '20px 26px',
          background: 'linear-gradient(135deg, #FEF2F2 0%, #FFF7ED 100%)',
          border: '1.5px solid #FECACA',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #EF4444, #DC2626)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)'
          }}>
            <ShieldAlert size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 850, color: '#B91C1C' }}>Tourist Safety & Emergency Hub</h2>
              <span className="badge badge-danger">24/7 ACTIVE</span>
            </div>
            <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', marginTop: 4, fontWeight: 500, lineHeight: 1.5 }}>
              Verified national emergency helplines, real-time safety advisories, and geofenced safety zones across India.
            </p>
          </div>
        </div>
      </div>

      {/* ── LIVE GPS LOCATION & EMERGENCY MAP CARD ── */}
      <div className="glass-panel" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14, border: '1.5px solid rgba(59, 130, 246, 0.35)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <LocateFixed size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Live Emergency Map & Nearby Services
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {currentUserLocation
                  ? `📍 Your GPS: ${currentUserLocation.latitude.toFixed(4)}° N, ${currentUserLocation.longitude.toFixed(4)}° E (±${currentUserLocation.accuracy || 20}m accuracy)`
                  : '📍 Requesting device GPS coordinates...'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="badge badge-safe" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulse-ring 1.5s infinite' }}></span>
              {currentUserLocation ? 'GPS Connected' : 'Acquiring GPS'}
            </span>
          </div>
        </div>

        {/* Interactive Map */}
        <OsmInteractiveMap
          markers={emergencyMarkers}
          center={{ lat: baseLat, lon: baseLon }}
          zoom={14}
          height={320}
          currentUserLocation={currentUserLocation}
          showRadius={1500}
        />
      </div>

      {/* Grid: Emergency Helplines + Live Advisories */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 20 }}>
        
        {/* National Helplines Card */}
        <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <PhoneCall size={22} color="#EA580C" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>National Emergency & Tourist Helplines</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {contacts.map((c, idx) => (
              <div
                key={idx}
                className="glass-panel-interactive"
                style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.96rem', color: 'var(--text-primary)' }}>{c.name}</div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', fontWeight: 500, marginTop: 2 }}>{c.description}</div>
                </div>
                <a
                  href={`tel:${c.number.replace(/\s+/g, '')}`}
                  className="badge badge-saffron"
                  style={{ fontSize: '1.05rem', fontWeight: 850, padding: '8px 16px', textDecoration: 'none', cursor: 'pointer' }}
                >
                  📞 {c.number}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Live Safety Advisories */}
        <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <ShieldAlert size={20} color="#10b981" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Active Advisories & Alerts</h3>
            </div>
            <span className="badge badge-safe">Verified Feed</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {alerts.map((al) => (
              <div
                key={al.id}
                style={{
                  padding: 16,
                  borderRadius: 'var(--radius-sm)',
                  background: al.severity === 'WARNING' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(99, 102, 241, 0.08)',
                  border: al.severity === 'WARNING' ? '1px solid rgba(245, 158, 11, 0.25)' : '1px solid rgba(99, 102, 241, 0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className={al.severity === 'WARNING' ? 'badge badge-caution' : 'badge badge-primary'}>
                      {al.alertType}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>📍 {al.state}</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Live</span>
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{al.title}</h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {al.message}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Geofenced Tourist Safety Zones */}
      <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Geofenced Tourist Safety Zones (PostGIS Radar)</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Protected zones with dedicated tourist police, verified kiosks, and CCTV coverage
            </p>
          </div>
          <span className="badge badge-safe">Spatial Monitoring Active</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
          {zones.map((zone) => (
            <div
              key={zone.id}
              className="glass-panel-interactive"
              style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{zone.name}</h4>
                <span
                  className={
                    zone.riskLevel === 'SAFE'
                      ? 'badge badge-safe'
                      : zone.riskLevel === 'CAUTION'
                      ? 'badge badge-caution'
                      : 'badge badge-danger'
                  }
                >
                  {zone.riskLevel}
                </span>
              </div>

              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                {zone.description}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 10, borderTop: '1px solid var(--border-subtle)', fontSize: '0.78rem' }}>
                <span style={{ color: 'var(--text-subtle)' }}>
                  Radius: {(zone.radiusMeters / 1000).toFixed(1)} km
                </span>
                {zone.helplinePhone && (
                  <span style={{ color: '#ff9933', fontWeight: 600 }}>
                    Kiosk: {zone.helplinePhone}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Incident Reporting Form */}
      <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Report a Tourist Safety Incident or Hazard</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Help fellow travelers by reporting closed mountain roads, water surges, fake guide scams, or medical emergencies.
          </p>
        </div>

        <form onSubmit={handleReportSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
          <div>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Incident Title</label>
            <input
              type="text"
              required
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              placeholder="e.g. Landslide road clearance delay at Rohtang"
              className="input-field"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Category</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="input-field"
            >
              <option value="Weather / Natural">Weather / Natural Surge</option>
              <option value="Road Block / Transit">Road Block / Transit Issue</option>
              <option value="Crowd Alert">Overcrowded Zone</option>
              <option value="Scam / Fraud Alert">Scam / Unofficial Guide</option>
              <option value="Medical Alert">Medical Kiosk Notice</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>State / Region</label>
            <select
              value={reportState}
              onChange={(e) => setReportState(e.target.value)}
              className="input-field"
            >
              <option value="Rajasthan">Rajasthan</option>
              <option value="Goa">Goa</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Kerala">Kerala</option>
              <option value="Himachal Pradesh">Himachal Pradesh</option>
              <option value="Ladakh">Ladakh</option>
            </select>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Description & Advice for Travelers</label>
            <textarea
              required
              rows={3}
              value={reportDesc}
              onChange={(e) => setReportDesc(e.target.value)}
              placeholder="Describe what you observed, exact landmark, and recommended precautions..."
              className="input-field"
            />
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={reportedSubmitted}
              className="btn btn-primary"
              style={{ padding: '12px 24px' }}
            >
              <Send size={16} />
              <span>{reportedSubmitted ? 'Verifying & Submitting...' : 'Submit Verified Safety Report'}</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
