import React, { useState, useEffect, useCallback } from 'react';
import {
  Sliders,
  Accessibility,
  Utensils,
  CheckCircle2,
  X,
  AlertTriangle,
  Wallet,
  MapPin,
  Users,
  Calendar,
  ShieldCheck,
  Compass,
  Info,
  Sparkles,
  Bot,
  Loader2,
  Navigation,
  Check
} from 'lucide-react';
import { TravelProfile, AccessibilityPref, FoodPref, DEFAULT_TRAVEL_PROFILE, Trip } from '../../types/smartTourTypes';
import { setTravelProfile, generateTripFromProfile } from '../../services/smartTourApi';

// ==========================================
// CONFIG & OPTIONS
// ==========================================

const POPULAR_DESTINATIONS = [
  'Hyderabad',
  'Jaipur',
  'Goa',
  'Kerala',
  'Varanasi',
  'Agra',
  'Ladakh',
  'Udaipur',
  'Manali',
  'Delhi',
  'Amritsar',
  'Rishikesh'
];

const CURRENCIES = [
  { code: 'INR', symbol: '₹', label: 'INR (₹)' },
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
  { code: 'AED', symbol: 'AED', label: 'AED' },
];

const BUDGET_PRESETS = [
  { label: '₹5,000', amount: 5000 },
  { label: '₹10,000', amount: 10000 },
  { label: '₹18,000', amount: 18000 },
  { label: '₹30,000', amount: 30000 },
  { label: '₹50,000', amount: 50000 },
];

const ACCESSIBILITY_OPTIONS: { id: AccessibilityPref; emoji: string; label: string; desc: string }[] = [
  { id: 'wheelchair_access',    emoji: '♿', label: 'Wheelchair Ramp Access', desc: 'Ramps, elevators & step-free paths' },
  { id: 'low_walking_distance', emoji: '🚶', label: 'Low Walking Distance',   desc: 'Clusters nearby spots & transit' },
  { id: 'senior_friendly',      emoji: '👴', label: 'Senior Citizen Friendly', desc: 'Rest periods, less stairs, gentle pace' },
  { id: 'family_friendly',      emoji: '👨‍👩‍👧', label: 'Child / Family Friendly', desc: 'Family suites & child-safe activities' },
];

const FOOD_OPTIONS: { id: FoodPref; emoji: string; label: string }[] = [
  { id: 'vegetarian',    emoji: '🥗', label: 'Pure Vegetarian' },
  { id: 'vegan',         emoji: '🌱', label: 'Vegan' },
  { id: 'jain',          emoji: '🥬', label: 'Jain (No Root Veg)' },
  { id: 'halal',         emoji: '🍖', label: 'Halal Certified' },
  { id: 'gluten_free',   emoji: '🌾', label: 'Gluten-Free' },
  { id: 'no_preference', emoji: '🍽️', label: 'No Preference' },
  { id: 'other',         emoji: '🍲', label: 'Other' },
  { id: 'rajasthani',    emoji: '👑', label: 'Rajasthani Royal Thali' },
  { id: 'seafood',       emoji: '🦐', label: 'Seafood / Coastal' },
];

const SAFETY_OPTIONS = [
  { id: 'solo_female', label: '👩 Solo Female Safety', desc: 'Safe transit, well-lit areas, verified hotels' },
  { id: 'night_safety', label: '🌙 Night Travel Alerts', desc: 'Avoid unlit or high-risk areas after dark' },
  { id: 'verified_zones', label: '🛡️ Tourist Police Zones', desc: 'Prioritize police-patrolled sights' },
  { id: 'scam_protection', label: '⚠️ Tourist Scam Warnings', desc: 'Alerts on local touts & taxi scams' },
];

const GENERATION_STEPS = [
  { title: 'Analyzing budget & traveler constraints', icon: '💰' },
  { title: 'Selecting optimal intercity transportation (Cost & Time)', icon: '🚆' },
  { title: 'Calculating hotel budget & finding budget-matched stays', icon: '🏨' },
  { title: 'Filtering food options matching dietary preference', icon: '🍛' },
  { title: 'Grouping attractions geographically for minimal travel', icon: '📍' },
  { title: 'Evaluating tourist safety, scams, and health advisories', icon: '🛡️' },
  { title: 'Finalizing your personalized Trip Planner plan!', icon: '✨' },
];

// ==========================================
// COMPONENT PROPS
// ==========================================

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  travelProfile: TravelProfile;
  onProfileSave: (profile: TravelProfile, generatedTrip?: Trip) => void;
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export const PreferencesModal: React.FC<PreferencesModalProps> = ({
  isOpen,
  onClose,
  travelProfile,
  onProfileSave,
}) => {
  // Local state initialized from travelProfile
  const [destination, setDestination] = useState<string>(travelProfile.destination || 'Hyderabad');
  const [startingLocation, setStartingLocation] = useState<string>(travelProfile.startingLocation || 'Current Location');
  const [totalBudget, setTotalBudget] = useState<number>(travelProfile.totalBudget || 10000);
  const [currency, setCurrency] = useState<string>(travelProfile.currency || 'INR');
  const [travelers, setTravelers] = useState<number>(travelProfile.travelers || 2);
  const [durationDays, setDurationDays] = useState<number>(travelProfile.durationDays || 3);
  const [startDate, setStartDate] = useState<string>(travelProfile.startDate || '');
  const [endDate, setEndDate] = useState<string>(travelProfile.endDate || '');
  const [food, setFood] = useState<FoodPref[]>([...(travelProfile.foodPreferences || ['vegetarian'])]);
  const [accessibility, setAccessibility] = useState<AccessibilityPref[]>([...(travelProfile.accessibilityPreferences || [])]);
  const [safety, setSafety] = useState<string[]>([...(travelProfile.safetyPreferences || [])]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showDiscardWarning, setShowDiscardWarning] = useState(false);

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      setDestination(travelProfile.destination || 'Hyderabad');
      setStartingLocation(travelProfile.startingLocation || 'Current Location');
      setTotalBudget(travelProfile.totalBudget || 10000);
      setCurrency(travelProfile.currency || 'INR');
      setTravelers(travelProfile.travelers || 2);
      setDurationDays(travelProfile.durationDays || 3);
      setStartDate(travelProfile.startDate || '');
      setEndDate(travelProfile.endDate || '');
      setFood([...(travelProfile.foodPreferences || ['vegetarian'])]);
      setAccessibility([...(travelProfile.accessibilityPreferences || [])]);
      setSafety([...(travelProfile.safetyPreferences || [])]);
      setSavedSuccess(false);
      setShowDiscardWarning(false);
    }
  }, [isOpen, travelProfile]);

  // Check for unsaved changes
  const hasChanges = useCallback(() => {
    if (destination !== (travelProfile.destination || 'Hyderabad')) return true;
    if (startingLocation !== (travelProfile.startingLocation || 'Current Location')) return true;
    if (totalBudget !== (travelProfile.totalBudget || 10000)) return true;
    if (currency !== (travelProfile.currency || 'INR')) return true;
    if (travelers !== (travelProfile.travelers || 2)) return true;
    if (durationDays !== (travelProfile.durationDays || 3)) return true;
    if (JSON.stringify([...food].sort()) !== JSON.stringify([...(travelProfile.foodPreferences || [])].sort())) return true;
    if (JSON.stringify([...accessibility].sort()) !== JSON.stringify([...(travelProfile.accessibilityPreferences || [])].sort())) return true;
    if (JSON.stringify([...safety].sort()) !== JSON.stringify([...(travelProfile.safetyPreferences || [])].sort())) return true;
    return false;
  }, [destination, startingLocation, totalBudget, currency, travelers, durationDays, food, accessibility, safety, travelProfile]);

  const toggleFood = (id: FoodPref) => {
    setFood(prev =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter(f => f !== id) : prev) : [...prev, id]
    );
  };

  const toggleAccessibility = (id: AccessibilityPref) => {
    setAccessibility(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const toggleSafety = (id: string) => {
    setSafety(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGenerating) return;

    const newProfile: TravelProfile = {
      ...travelProfile,
      destination: destination.trim() || 'Hyderabad',
      startingLocation: startingLocation.trim() || 'Current Location',
      totalBudget: Number(totalBudget) > 0 ? Number(totalBudget) : 10000,
      currency,
      travelers: Number(travelers) > 0 ? Number(travelers) : 2,
      durationDays: Number(durationDays) > 0 ? Number(durationDays) : 3,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      foodPreferences: food.length > 0 ? food : ['vegetarian'],
      accessibilityPreferences: accessibility,
      safetyPreferences: safety,
      budgetTier: totalBudget < 8000 ? 'budget' : totalBudget > 25000 ? 'luxury' : 'moderate',
    };

    // 1. Save profile to storage
    setTravelProfile(newProfile);

    // 2. Start Animated Multi-Step AI Generation
    setIsGenerating(true);
    setCurrentStep(0);

    for (let i = 0; i < GENERATION_STEPS.length; i++) {
      setCurrentStep(i);
      await new Promise(res => setTimeout(res, 260));
    }

    // 3. Generate Complete Trip with Autonomous AI Decision Engine
    const { trip } = generateTripFromProfile(newProfile);

    await new Promise(res => setTimeout(res, 300));

    setIsGenerating(false);
    setSavedSuccess(true);

    // 4. Update app state & navigate to Trip Planner
    onProfileSave(newProfile, trip);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 400);
  };

  const handleClose = () => {
    if (hasChanges()) {
      setShowDiscardWarning(true);
    } else {
      onClose();
    }
  };

  const handleDiscardConfirm = () => {
    setShowDiscardWarning(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        zIndex: 100,
        animation: 'modalOverlayIn 0.2s ease-out',
      }}
      onClick={handleClose}
    >
      <form
        onSubmit={handleSave}
        className="card"
        style={{
          maxWidth: 680,
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          animation: 'modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '0 20px 50px -12px rgba(15, 23, 42, 0.2)',
          border: '1px solid var(--border)',
          background: 'var(--surface)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── HEADER ── */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
          background: 'var(--surface)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #2563EB, #06B6D4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
            }}>
              <Sliders size={20} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, lineHeight: 1.2, color: 'var(--text-primary)' }}>
                Travel & Accessibility Profile
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                You provide the requirements • AI automatically calculates transport, hotels, and the plan
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="btn btn-secondary"
            style={{
              width: 32,
              height: 32,
              padding: 0,
              borderRadius: 8,
            }}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── INFO BANNER ── */}
        <div style={{
          padding: '10px 24px',
          background: '#EFF6FF',
          borderBottom: '1px solid #BFDBFE',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <Info size={16} color="#2563EB" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '0.78rem', color: '#1E40AF', lineHeight: 1.4, fontWeight: 500 }}>
            Enter your destination, total budget, duration & food preferences. Our AI will automatically suggest the best transportation, hotel range, activities, and daily itinerary without forcing manual category selection.
          </span>
        </div>

        {/* ── BODY ── */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 22, overflowY: 'auto' }}>

          {/* ── 1. DESTINATION & ORIGIN ── */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <MapPin size={16} color="#2563EB" />
              <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>1. Destination & Starting Location</span>
              <span style={{ fontSize: '0.7rem', color: '#EF4444', fontWeight: 700 }}>*Required</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 12, marginBottom: 10 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 4, fontWeight: 600 }}>
                  Destination City
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Hyderabad, Jaipur, Goa"
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 4, fontWeight: 600 }}>
                  Starting Location / Origin
                </label>
                <input
                  type="text"
                  value={startingLocation}
                  onChange={(e) => setStartingLocation(e.target.value)}
                  placeholder="e.g. Delhi, Bangalore, Mumbai"
                  className="input-field"
                />
              </div>
            </div>

            {/* Destination quick chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', alignSelf: 'center', marginRight: 4, fontWeight: 600 }}>Popular:</span>
              {POPULAR_DESTINATIONS.map((city) => {
                const isSelected = destination.toLowerCase() === city.toLowerCase();
                return (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setDestination(city)}
                    style={{
                      padding: '4px 11px',
                      borderRadius: 14,
                      fontSize: '0.75rem',
                      fontWeight: isSelected ? 700 : 500,
                      border: isSelected ? '1px solid #2563EB' : '1px solid var(--border)',
                      background: isSelected ? '#EFF6FF' : '#FFFFFF',
                      color: isSelected ? '#2563EB' : 'var(--text-primary)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {city}
                  </button>
                );
              })}
            </div>
          </section>

          {/* ── 2. TOTAL BUDGET ── */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Wallet size={16} color="#fbbf24" />
                <span style={{ fontSize: '0.92rem', fontWeight: 700 }}>2. Total Trip Budget</span>
                <span style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 600 }}>*Required</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 600 }}>
                {currency} {Number(totalBudget).toLocaleString()} TOTAL
              </span>
            </div>

            <p style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginBottom: 10, lineHeight: 1.4 }}>
              💡 Enter your <strong>actual total trip budget</strong> (not per day). The AI optimizes and distributes this across transport, accommodation, food, local transit, activities, and an emergency buffer.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: 10, marginBottom: 10 }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  min="1000"
                  step="500"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(Number(e.target.value))}
                  placeholder="e.g. 10000"
                  required
                  className="input-field"
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: '#B45309',
                    background: 'var(--bg-input)',
                    border: '2px solid #F59E0B'
                  }}
                />
              </div>

              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="input-field"
                style={{
                  fontSize: '0.92rem',
                  fontWeight: 750,
                  cursor: 'pointer'
                }}
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Quick budget presets */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {BUDGET_PRESETS.map((preset) => (
                <button
                  key={preset.amount}
                  type="button"
                  onClick={() => setTotalBudget(preset.amount)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 8,
                    fontSize: '0.82rem',
                    border: totalBudget === preset.amount ? '1.5px solid #D97706' : '1.5px solid var(--border)',
                    background: totalBudget === preset.amount ? '#FEF3C7' : 'var(--surface)',
                    color: totalBudget === preset.amount ? '#92400E' : 'var(--text-primary)',
                    fontWeight: totalBudget === preset.amount ? 800 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </section>

          {/* ── 3. TRAVELERS & DURATION ── */}
          <section>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {/* Number of Travelers */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <Users size={16} color="#2563EB" />
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>3. Number of Travelers</span>
                  <span style={{ fontSize: '0.7rem', color: '#EF4444', fontWeight: 700 }}>*</span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[1, 2, 3, 4, 6].map((num) => {
                    const isSelected = travelers === num;
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setTravelers(num)}
                        style={{
                          flex: 1,
                          padding: '10px 0',
                          textAlign: 'center',
                          borderRadius: 'var(--radius-md)',
                          border: isSelected ? '2px solid #2563EB' : '1px solid var(--border)',
                          background: isSelected ? '#EFF6FF' : '#FFFFFF',
                          color: isSelected ? '#2563EB' : 'var(--text-primary)',
                          fontWeight: 700,
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {num === 6 ? '5+' : num}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Duration in Days */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <Calendar size={16} color="#14B8A6" />
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>4. Trip Duration</span>
                  <span style={{ fontSize: '0.7rem', color: '#EF4444', fontWeight: 700 }}>*</span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[1, 2, 3, 4, 5, 7].map((days) => {
                    const isSelected = durationDays === days;
                    return (
                      <button
                        key={days}
                        type="button"
                        onClick={() => setDurationDays(days)}
                        style={{
                          flex: 1,
                          padding: '10px 0',
                          textAlign: 'center',
                          borderRadius: 'var(--radius-md)',
                          border: isSelected ? '2px solid #14B8A6' : '1px solid var(--border)',
                          background: isSelected ? '#F0FDFA' : '#FFFFFF',
                          color: isSelected ? '#0D9488' : 'var(--text-primary)',
                          fontWeight: 700,
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {days}d
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* ── 4. FOOD PREFERENCES ── */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Utensils size={16} color="#F97316" />
                <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>5. Food & Dietary Preference</span>
                <span style={{ fontSize: '0.7rem', color: '#EF4444', fontWeight: 700 }}>*Mandatory</span>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Multi-select enabled</span>
            </div>

            <p style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', marginBottom: 10 }}>
              AI strictly filters restaurant and dining suggestions to respect your dietary constraints.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {FOOD_OPTIONS.map((f) => {
                const selected = food.includes(f.id);
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => toggleFood(f.id)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 20,
                      fontSize: '0.82rem',
                      fontWeight: selected ? 700 : 500,
                      border: selected ? '2px solid #F97316' : '1px solid var(--border)',
                      background: selected ? '#FFF7ED' : '#FFFFFF',
                      color: selected ? '#C2410C' : 'var(--text-primary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      transition: 'all 0.15s ease',
                      boxShadow: selected ? '0 2px 8px rgba(249,115,22,0.15)' : 'none'
                    }}
                    aria-pressed={selected}
                  >
                    <span>{f.emoji}</span>
                    <span>{f.label}</span>
                    {selected && <CheckCircle2 size={14} color="#F97316" />}
                  </button>
                );
              })}
            </div>
          </section>

          {/* ── 5. ACCESSIBILITY (OPTIONAL) ── */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Accessibility size={16} color="#22C55E" />
              <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>6. Accessibility Accommodations</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>(Optional)</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {ACCESSIBILITY_OPTIONS.map((opt) => {
                const checked = accessibility.includes(opt.id);
                return (
                  <label
                    key={opt.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      background: checked ? '#F0FDF4' : '#FFFFFF',
                      border: checked ? '1.5px solid #22C55E' : '1px solid var(--border)',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAccessibility(opt.id)}
                      style={{
                        accentColor: '#22C55E',
                        width: 16,
                        height: 16,
                        cursor: 'pointer',
                        marginTop: 2,
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, color: checked ? '#15803D' : 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span>{opt.emoji}</span> {opt.label}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                        {opt.desc}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </section>

          {/* ── 6. SAFETY PREFERENCES (OPTIONAL) ── */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <ShieldCheck size={16} color="#F97316" />
              <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>7. Safety Preferences & Advisories</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>(Optional)</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {SAFETY_OPTIONS.map((s) => {
                const checked = safety.includes(s.id);
                return (
                  <label
                    key={s.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      background: checked ? '#FFF7ED' : '#FFFFFF',
                      border: checked ? '1.5px solid #F97316' : '1px solid var(--border)',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleSafety(s.id)}
                      style={{
                        accentColor: '#F97316',
                        width: 16,
                        height: 16,
                        cursor: 'pointer',
                        marginTop: 2,
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, color: checked ? '#C2410C' : 'var(--text-primary)' }}>
                        {s.label}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                        {s.desc}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </section>

        </div>

        {/* ── FOOTER ACTIONS ── */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
          background: 'var(--surface)',
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            💡 Stored securely in your profile
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" onClick={handleClose} className="btn btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                minWidth: 170,
                background: 'linear-gradient(135deg, #2563EB, #06B6D4)',
                fontWeight: 700,
              }}
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 size={16} /> Profile Saved!
                </>
              ) : (
                'Save Travel Profile'
              )}
            </button>
          </div>
        </div>
      </form>

      {/* ── AI GENERATING PROGRESS MODAL OVERLAY ── */}
      {isGenerating && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 120,
            padding: 20
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="card"
            style={{
              padding: '32px 28px',
              maxWidth: 520,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              boxShadow: '0 20px 60px rgba(15, 23, 42, 0.25)',
              animation: 'modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Header animation */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: 'linear-gradient(135deg, #2563EB, #06B6D4, #14B8A6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(37, 99, 235, 0.4)',
                animation: 'pulse-sos 1.8s infinite'
              }}>
                <Sparkles size={24} color="#ffffff" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>AI is Creating Your Personalized Trip...</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                  Destination: <strong>{destination}</strong> • Budget: <strong>₹{Number(totalBudget).toLocaleString('en-IN')}</strong> • {travelers} Travelers
                </p>
              </div>
            </div>

            {/* Checklist items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--surface-soft, #F8FAFC)', padding: '16px 18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              {GENERATION_STEPS.map((step, idx) => {
                const isDone = idx < currentStep;
                const isCurrent = idx === currentStep;

                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      fontSize: '0.86rem',
                      color: isDone ? '#16A34A' : isCurrent ? '#2563EB' : 'var(--text-secondary)',
                      fontWeight: isCurrent ? 700 : 500,
                      transition: 'all 0.25s ease'
                    }}
                  >
                    <div style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isDone ? '#F0FDF4' : isCurrent ? '#EFF6FF' : '#FFFFFF',
                      border: isDone ? '1.5px solid #22C55E' : isCurrent ? '1.5px solid #2563EB' : '1px solid var(--border)',
                      flexShrink: 0
                    }}>
                      {isDone ? (
                        <Check size={13} color="#22C55E" strokeWidth={3} />
                      ) : isCurrent ? (
                        <Loader2 size={13} color="#2563EB" style={{ animation: 'spin 1s linear infinite' }} />
                      ) : (
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{idx + 1}</span>
                      )}
                    </div>

                    <span>{step.icon} {step.title}</span>
                  </div>
                );
              })}
            </div>

            {/* Progress Bar */}
            <div style={{ width: '100%', height: 6, borderRadius: 3, background: '#E2E8F0', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${Math.round(((currentStep + 1) / GENERATION_STEPS.length) * 100)}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #2563EB, #06B6D4, #14B8A6)',
                  transition: 'width 0.25s ease-out'
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── DISCARD WARNING ── */}
      {showDiscardWarning && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 110,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="glass-panel"
            style={{
              padding: 24,
              maxWidth: 400,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              animation: 'modalSlideIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <AlertTriangle size={22} color="#f59e0b" />
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Discard unsaved profile changes?</h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              You have unsaved changes to your budget, destination, or food preferences. Are you sure you want to discard them?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowDiscardWarning(false)}
              >
                Keep Editing
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
                onClick={handleDiscardConfirm}
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
