import React, { useState, useEffect, useRef } from 'react';
import {
  Globe,
  DollarSign,
  Sliders,
  Sun,
  Moon,
  Settings,
  X,
  ChevronRight
} from 'lucide-react';

interface SideControlsProps {
  currency: string;
  setCurrency: (c: string) => void;
  language: string;
  setLanguage: (l: string) => void;
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
  onOpenPreferences: () => void;
}

export const SideControls: React.FC<SideControlsProps> = ({
  currency,
  setCurrency,
  language,
  setLanguage,
  theme,
  setTheme,
  onOpenPreferences
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={containerRef}>
      {/* ── 1. COLLAPSED FLOATING SLIDE TAB ── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="side-dock-trigger-tab"
          title="Open Settings & Preferences"
          aria-label="Open Settings"
        >
          <Settings size={18} />
          <span>Settings</span>
        </button>
      )}

      {/* ── 2. ANIMATED EXPANDED SLIDING DRAWER ── */}
      {isOpen && (
        <aside
          className="side-controls-drawer"
          aria-label="Settings and Preferences Drawer"
        >
          {/* Header with Title and Close Button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1.5px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              <Settings size={16} color="var(--primary)" />
              <span>Settings</span>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'var(--surface-soft)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                transition: 'all 0.2s ease'
              }}
              title="Close Panel"
              aria-label="Close Settings"
            >
              <X size={15} />
            </button>
          </div>

          {/* 1. Currency Selector */}
          <div
            className="control"
            style={{
              width: '100%',
              height: '42px',
              padding: 0,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '11px',
              boxShadow: '0 2px 6px rgba(15,23,42,0.04)'
            }}
          >
            <DollarSign
              size={16}
              color="var(--primary)"
              style={{ position: 'absolute', left: 10, pointerEvents: 'none' }}
            />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              aria-label="Select Currency"
              style={{
                width: '100%',
                height: '100%',
                padding: '0 10px 0 30px',
                fontSize: '0.88rem',
                border: 0,
                outline: 0,
                background: 'transparent',
                color: 'var(--text-primary)',
                fontWeight: 750,
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >
              <option value="INR">₹ INR</option>
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
              <option value="GBP">£ GBP</option>
              <option value="AED">AED</option>
            </select>
          </div>

          {/* 2. Language Selector */}
          <div
            className="control"
            style={{
              width: '100%',
              height: '42px',
              padding: 0,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '11px',
              boxShadow: '0 2px 6px rgba(15,23,42,0.04)'
            }}
          >
            <Globe
              size={16}
              color="var(--secondary)"
              style={{ position: 'absolute', left: 10, pointerEvents: 'none' }}
            />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label="Select Language"
              style={{
                width: '100%',
                height: '100%',
                padding: '0 10px 0 30px',
                fontSize: '0.88rem',
                border: 0,
                outline: 0,
                background: 'transparent',
                color: 'var(--text-primary)',
                fontWeight: 750,
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="te">తెలుగు</option>
              <option value="ta">தமிழ்</option>
            </select>
          </div>

          {/* 3. Theme Toggle (Dark / Light) */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="control"
            title={`Switch to ${theme === 'dark' ? 'Tropical Light' : 'Dark'} Mode`}
            style={{
              width: '100%',
              height: '42px',
              padding: '0 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '10px',
              borderRadius: '11px',
              boxShadow: '0 2px 6px rgba(15,23,42,0.04)'
            }}
          >
            {theme === 'dark' ? (
              <>
                <Sun size={17} color="#FACC15" />
                <span style={{ fontSize: '0.88rem', fontWeight: 750 }}>Light Mode</span>
              </>
            ) : (
              <>
                <Moon size={17} color="#2563EB" />
                <span style={{ fontSize: '0.88rem', fontWeight: 750 }}>Dark Mode</span>
              </>
            )}
          </button>

          {/* 4. Travel Profile & Preferences */}
          <button
            onClick={() => {
              onOpenPreferences();
              setIsOpen(false);
            }}
            className="control"
            title="Travel Preferences & Requirements"
            style={{
              width: '100%',
              height: '42px',
              padding: '0 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '10px',
              borderRadius: '11px',
              boxShadow: '0 2px 6px rgba(15,23,42,0.04)'
            }}
          >
            <Sliders size={17} color="#EA580C" />
            <span style={{ fontSize: '0.88rem', fontWeight: 750 }}>Preferences</span>
          </button>

          {/* Quick Tip Footer */}
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', paddingTop: 4 }}>
            Click outside or ✕ to close
          </div>
        </aside>
      )}
    </div>
  );
};
