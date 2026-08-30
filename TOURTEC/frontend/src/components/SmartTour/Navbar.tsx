import React from 'react';
import {
  Compass,
  MessageSquare,
  MapPin,
  Calendar,
  ShieldAlert,
  Radio
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'chat' | 'destinations' | 'trips' | 'trackmate' | 'safety';
  setActiveTab: (tab: 'chat' | 'destinations' | 'trips' | 'trackmate' | 'safety') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab
}) => {
  return (
    <header className="glass-header" style={{ zIndex: 50, position: 'sticky', top: 0, width: '100%' }}>
      <div style={{ width: '100%', padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flexShrink: 0 }} onClick={() => setActiveTab('chat')}>
          <div className="brand-logo" style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 50%, #10B981 100%)', boxShadow: '0 6px 18px rgba(37, 99, 235, 0.3)' }}>
            <Compass size={20} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="gradient-text-brand" style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.03em' }}>
                SmartTour<span style={{ color: '#F97316' }}>AI</span>
              </span>
              <span className="badge badge-orange" style={{ fontSize: '0.65rem', padding: '1px 6px', fontWeight: 800 }}>🌴 INDIA</span>
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: -2, fontWeight: 550 }}>
              AI Travel, Planning & Safety Assistant
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6, overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none' }}>
          <button
            onClick={() => setActiveTab('chat')}
            className={`nav-item ${activeTab === 'chat' ? 'active' : ''}`}
          >
            <MessageSquare size={15} />
            <span>AI Assistant</span>
          </button>

          <button
            onClick={() => setActiveTab('destinations')}
            className={`nav-item ${activeTab === 'destinations' ? 'active' : ''}`}
          >
            <MapPin size={15} />
            <span>Destinations</span>
          </button>

          <button
            onClick={() => setActiveTab('trips')}
            className={`nav-item ${activeTab === 'trips' ? 'active' : ''}`}
          >
            <Calendar size={15} />
            <span>Trip Planner</span>
          </button>

          <button
            onClick={() => setActiveTab('trackmate')}
            className={`nav-item ${activeTab === 'trackmate' ? 'active' : ''}`}
          >
            <Radio size={15} color={activeTab === 'trackmate' ? '#ffffff' : '#14B8A6'} />
            <span>TrackMate</span>
          </button>

          <button
            onClick={() => setActiveTab('safety')}
            className={`nav-item ${activeTab === 'safety' ? 'active' : ''}`}
          >
            <ShieldAlert size={15} color={activeTab === 'safety' ? '#ffffff' : '#F97316'} />
            <span>Safety & Alerts</span>
          </button>
        </nav>

      </div>
    </header>
  );
};
