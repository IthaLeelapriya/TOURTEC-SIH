import React, { useState, useRef } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Trash2,
  Share2,
  DollarSign,
  Accessibility,
  Car,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Hotel,
  Utensils,
  ShieldCheck,
  Star,
  ExternalLink,
  Sliders,
  ArrowRight,
  RefreshCw,
  Info,
  Navigation,
  Train,
  Bus,
  Plane,
  ShieldAlert,
  Building,
  HeartPulse,
  Fuel,
  CreditCard
} from 'lucide-react';
import { Radio } from 'lucide-react';
import { Trip, ItineraryDay, ItineraryItem, HotelRecommendation, RestaurantRecommendation, TransportOption } from '../../types/smartTourTypes';
import { DEMO_SAMPLE_TRIP, formatCurrency, optimizeTripBudget, optimizeFullTripItinerary, OptimizationResult, setStoredTrip } from '../../services/smartTourApi';
import OsmInteractiveMap from './OsmInteractiveMap';

interface TripPlannerViewProps {
  trip: Trip | null;
  setTrip: React.Dispatch<React.SetStateAction<Trip | null>>;
  currency: string;
  onAskAiToOptimize: (tripTitle: string) => void;
  onOpenPreferences?: () => void;
  onOpenTrackMate?: (destinationName?: string) => void;
  currentUserLocation?: { latitude: number; longitude: number; accuracy?: number } | null;
}

// Star rating renderer
const StarRating: React.FC<{ rating: number; reviewCount?: number }> = ({ rating, reviewCount }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
    {[1, 2, 3, 4, 5].map(star => (
      <Star
        key={star}
        size={12}
        fill={star <= Math.round(rating) ? '#FBBF24' : 'transparent'}
        color={star <= Math.round(rating) ? '#FBBF24' : '#475569'}
        strokeWidth={1.5}
      />
    ))}
    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FBBF24', marginLeft: 2 }}>{rating}</span>
    {reviewCount && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({reviewCount.toLocaleString()})</span>}
  </div>
);

export const TripPlannerView: React.FC<TripPlannerViewProps> = ({
  trip,
  setTrip,
  currency,
  onAskAiToOptimize,
  onOpenPreferences,
  onOpenTrackMate,
  currentUserLocation
}) => {
  const currentTrip = trip || DEMO_SAMPLE_TRIP;
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [mapCategory, setMapCategory] = useState<string>('all');
  const [mapCenter, setMapCenter] = useState<{ lat: number; lon: number } | null>(null);
  const [mapZoom, setMapZoom] = useState<number>(12);
  const [hotelSort, setHotelSort] = useState<'budget' | 'rating'>('budget');
  const mapSectionRef = useRef<HTMLDivElement>(null);

  // Optimizer state
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [showOptimizationModal, setShowOptimizationModal] = useState(false);

  // New item form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Attraction');
  const [newItemStartTime, setNewItemStartTime] = useState('10:00');
  const [newItemEndTime, setNewItemEndTime] = useState('12:00');
  const [newItemCost, setNewItemCost] = useState('200');
  const [newItemNotes, setNewItemNotes] = useState('');
  const [newItemTransport, setNewItemTransport] = useState('Cab / Auto');

  const selectedDay = currentTrip.days[selectedDayIdx] || currentTrip.days[0];
  const aiPlan = currentTrip.aiPlan;
  const userReqs = currentTrip.userRequirements;

  // Calculate total spent across all itinerary items + AI plan allocations
  const itineraryItemsCost = currentTrip.days.reduce((acc, day) => {
    return acc + day.items.reduce((dayAcc, item) => dayAcc + (item.estimatedCostInr || 0), 0);
  }, 0);

  const totalSpentInr = aiPlan?.totalEstimatedSpentInr || itineraryItemsCost;
  const remainingBudgetInr = Math.max(0, currentTrip.budgetInr - totalSpentInr);
  const isOverBudget = totalSpentInr > currentTrip.budgetInr;
  const overBudgetAmount = totalSpentInr - currentTrip.budgetInr;

  // Handle focusing on map for a place
  const handleViewOnMap = (lat: number, lng: number, _label?: string) => {
    setMapCenter({ lat, lon: lng });
    setMapZoom(15);
    mapSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Handle switching transport mode
  const handleSwitchTransport = (newMode: TransportOption) => {
    if (!aiPlan) return;
    const oldRec = aiPlan.recommendedTransport;
    const updatedTrip: Trip = {
      ...currentTrip,
      aiPlan: {
        ...aiPlan,
        recommendedTransport: newMode,
        alternativeTransport: oldRec,
        totalEstimatedSpentInr: (aiPlan.totalEstimatedSpentInr || totalSpentInr) - (oldRec?.estimatedCostInr || 0) + newMode.estimatedCostInr,
      }
    };
    setTrip(updatedTrip);
    setStoredTrip(updatedTrip);
  };

  // Handle AI optimization execution
  const handleRunOptimizer = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      const result = optimizeFullTripItinerary(currentTrip);
      setTrip(result.optimizedTrip);
      setStoredTrip(result.optimizedTrip);
      setOptimizationResult(result);
      setIsOptimizing(false);
      setShowOptimizationModal(true);
    }, 600);
  };

  // Handle instant AI optimization to budget
  const handleOptimizeToBudget = () => {
    handleRunOptimizer();
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: ItineraryItem = {
      id: 'item-' + Date.now(),
      placeName: newItemName,
      category: newItemCategory,
      startTime: newItemStartTime,
      endTime: newItemEndTime,
      estimatedCostInr: parseFloat(newItemCost) || 0,
      notes: newItemNotes,
      transportMode: newItemTransport,
      travelTimeMinutes: 15,
      latitude: selectedDay.items[0]?.latitude || 17.3850,
      longitude: selectedDay.items[0]?.longitude || 78.4867,
      wheelchairAccessible: true
    };

    const updatedDays = currentTrip.days.map((d, idx) => {
      if (idx === selectedDayIdx) {
        return {
          ...d,
          items: [...d.items, newItem]
        };
      }
      return d;
    });

    const updatedTrip: Trip = {
      ...currentTrip,
      days: updatedDays,
      aiPlan: aiPlan ? {
        ...aiPlan,
        totalEstimatedSpentInr: (aiPlan.totalEstimatedSpentInr || totalSpentInr) + newItem.estimatedCostInr
      } : undefined
    };

    setTrip(updatedTrip);
    setStoredTrip(updatedTrip);

    setNewItemName('');
    setNewItemNotes('');
    setShowAddItemModal(false);
  };

  const handleDeleteItem = (itemId: string) => {
    let deletedCost = 0;
    const updatedDays = currentTrip.days.map((d, idx) => {
      if (idx === selectedDayIdx) {
        const itemToDelete = d.items.find(i => i.id === itemId);
        if (itemToDelete) deletedCost = itemToDelete.estimatedCostInr || 0;
        return {
          ...d,
          items: d.items.filter((item) => item.id !== itemId)
        };
      }
      return d;
    });

    const updatedTrip: Trip = {
      ...currentTrip,
      days: updatedDays,
      aiPlan: aiPlan ? {
        ...aiPlan,
        totalEstimatedSpentInr: Math.max(0, (aiPlan.totalEstimatedSpentInr || totalSpentInr) - deletedCost)
      } : undefined
    };

    setTrip(updatedTrip);
    setStoredTrip(updatedTrip);
  };

  const handleExport = () => {
    const summary = `🏰 ${currentTrip.title}\n📍 Destination: ${currentTrip.destinationName}\n💰 Total Budget: ₹${currentTrip.budgetInr.toLocaleString('en-IN')}\n💵 Estimated Cost: ₹${totalSpentInr.toLocaleString('en-IN')}\n👥 Travelers: ${currentTrip.numTravelers}\n\n` +
      `🚆 Transport: ${aiPlan?.recommendedTransport?.mode || 'Train'} (~₹${aiPlan?.recommendedTransport?.estimatedCostInr})\n` +
      `🏨 Hotel Range: ₹${aiPlan?.hotelBudgetMin || 1000}–₹${aiPlan?.hotelBudgetMax || 1800}/night\n` +
      `🍛 Food: ${userReqs?.foodPreferences?.join(', ') || 'Vegetarian'}\n\n` +
      currentTrip.days.map((d) => (
        `Day ${d.dayNumber}: ${d.theme || ''}\n` +
        d.items.map((i) => `  • ${i.startTime} - ${i.endTime}: ${i.placeName} (₹${i.estimatedCostInr}) - ${i.notes}`).join('\n')
      )).join('\n\n');

    navigator.clipboard.writeText(summary);
    alert('Full itinerary and budget summary copied to clipboard!');
  };

  // Map markers filtering
  const allMarkers = aiPlan?.mapMarkers || [];
  const filteredMarkers = mapCategory === 'all'
    ? allMarkers
    : allMarkers.filter(m => m.category === mapCategory);

  // Sorted hotels
  const displayHotels = [...(aiPlan?.hotels || [])].sort((a, b) => {
    if (hotelSort === 'rating') return b.rating - a.rating;
    return a.pricePerNightInr - b.pricePerNightInr;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1200, margin: '0 auto', paddingBottom: 40 }}>
      
      {/* ── TRIP OVERVIEW HEADER CARD ── */}
      <div className="gradient-border-card" style={{ padding: '26px', background: 'linear-gradient(135deg, rgba(239, 246, 255, 0.95) 0%, rgba(240, 253, 250, 0.9) 100%)', border: '1.5px solid #BFDBFE' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span className="badge badge-safe" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Sparkles size={12} /> Verified AI Plan
              </span>
              <span className="badge badge-primary">{currentTrip.destinationName}</span>
              {userReqs?.foodPreferences && userReqs.foodPreferences.map(f => (
                <span key={f} className="badge badge-saffron">🍛 {f}</span>
              ))}
              {userReqs?.accessibilityPreferences && userReqs.accessibilityPreferences.map(a => (
                <span key={a} className="badge badge-safe">♿ {a.replace('_', ' ')}</span>
              ))}
            </div>
            <h2 className="gradient-text" style={{ fontSize: '2.1rem', fontWeight: 900, marginTop: 10, letterSpacing: '-0.025em' }}>
              {currentTrip.title}
            </h2>
            <p style={{ fontSize: '0.98rem', color: 'var(--text-secondary)', marginTop: 6, fontWeight: 500, lineHeight: 1.65 }}>
              {currentTrip.travelerNotes || 'Multi-day personalized tour itinerary with smart timing, dietary matching, and accessibility'}
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {onOpenPreferences && (
              <button onClick={onOpenPreferences} className="btn btn-secondary" style={{ fontSize: '0.85rem' }} title="Edit Requirements">
                <Sliders size={15} />
                <span>Edit Profile</span>
              </button>
            )}
            {onOpenTrackMate && (
              <button
                onClick={() => onOpenTrackMate(currentTrip.destinationName || currentTrip.title)}
                className="btn btn-secondary"
                style={{ fontSize: '0.85rem', color: '#34d399' }}
                title="Track family live with TrackMate"
              >
                <Radio size={15} />
                <span>Track Family (TrackMate)</span>
              </button>
            )}
            <button onClick={handleExport} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
              <Share2 size={15} />
              <span>Copy Summary</span>
            </button>
            <button
              onClick={handleRunOptimizer}
              disabled={isOptimizing}
              className="btn btn-primary"
              style={{ fontSize: '0.85rem', fontWeight: 700 }}
              title="Run AI Route & Budget Optimizer"
            >
              {isOptimizing ? (
                <>
                  <RefreshCw size={15} className="spin" />
                  <span>Optimizing...</span>
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  <span>AI Optimize Itinerary</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Dynamic Metric Badges Row */}
        <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14 }}>
          <div style={{ padding: '10px 14px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 12 }}>
            <div style={{ fontSize: '0.7rem', color: '#2563EB', textTransform: 'uppercase', fontWeight: 700 }}>Total Budget</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E3A8A' }}>
              {formatCurrency(currentTrip.budgetInr, currency)}
            </div>
          </div>

          <div style={{ padding: '10px 14px', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 12 }}>
            <div style={{ fontSize: '0.7rem', color: '#EA580C', textTransform: 'uppercase', fontWeight: 700 }}>Estimated Spent</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: isOverBudget ? '#DC2626' : '#C2410C' }}>
              {formatCurrency(totalSpentInr, currency)}
            </div>
          </div>

          <div style={{ padding: '10px 14px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 12 }}>
            <div style={{ fontSize: '0.7rem', color: '#16A34A', textTransform: 'uppercase', fontWeight: 700 }}>Remaining Budget</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: remainingBudgetInr > 0 ? '#15803D' : '#DC2626' }}>
              {formatCurrency(remainingBudgetInr, currency)}
            </div>
          </div>

          <div style={{ padding: '10px 14px', background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: 12 }}>
            <div style={{ fontSize: '0.7rem', color: '#7C3AED', textTransform: 'uppercase', fontWeight: 700 }}>Travelers</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#5B21B6' }}>{currentTrip.numTravelers || 2} People</div>
          </div>

          <div style={{ padding: '10px 14px', background: '#ECFEFF', border: '1px solid #A5F3FC', borderRadius: 12 }}>
            <div style={{ fontSize: '0.7rem', color: '#0891B2', textTransform: 'uppercase', fontWeight: 700 }}>Transport</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0E7490' }}>
              🚆 {aiPlan?.recommendedTransport?.mode || 'Train'}
            </div>
          </div>

          <div style={{ padding: '10px 14px', background: '#FEFCE8', border: '1px solid #FEF08A', borderRadius: 12 }}>
            <div style={{ fontSize: '0.7rem', color: '#CA8A04', textTransform: 'uppercase', fontWeight: 700 }}>Hotel Range</div>
            <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#854D0E' }}>
              ₹{aiPlan?.hotelBudgetMin || 1000}–₹{aiPlan?.hotelBudgetMax || 1800}/nt
            </div>
          </div>
        </div>
      </div>

      {/* ── OVER-BUDGET ALERT & ONE-CLICK OPTIMIZATION BANNER ── */}
      {isOverBudget && (
        <div className="glass-panel" style={{ padding: '16px 20px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <AlertTriangle size={24} color="#f87171" style={{ flexShrink: 0 }} />
            <div>
              <strong style={{ fontSize: '0.95rem', color: '#fca5a5' }}>
                ⚠️ Budget Alert: Estimated trip cost is ₹{totalSpentInr.toLocaleString('en-IN')} (₹{overBudgetAmount.toLocaleString('en-IN')} above your ₹{currentTrip.budgetInr.toLocaleString('en-IN')} budget)
              </strong>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                The AI can rebalance transport, hotel categories, and free attractions to fit within ₹{currentTrip.budgetInr.toLocaleString('en-IN')}.
              </p>
            </div>
          </div>
          <button
            onClick={handleOptimizeToBudget}
            className="btn btn-primary"
            style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', fontWeight: 700, fontSize: '0.85rem', padding: '8px 16px' }}
          >
            <RefreshCw size={14} />
            <span>Optimize to ₹{currentTrip.budgetInr.toLocaleString('en-IN')}</span>
          </button>
        </div>
      )}

      {/* ── BUDGET BREAKDOWN ALLOCATION BAR ── */}
      {aiPlan?.budgetBreakdown && aiPlan.budgetBreakdown.length > 0 && (
        <div className="glass-panel" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <DollarSign size={18} color="#34d399" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Autonomous Budget Allocation</h3>
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Total Plan: <strong style={{ color: '#34d399' }}>{formatCurrency(totalSpentInr, currency)}</strong>
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
            {aiPlan.budgetBreakdown.map((item, idx) => {
              const pct = Math.round((item.estimatedCostInr / (totalSpentInr || 1)) * 100);
              return (
                <div key={idx} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 6 }}>
                    <span style={{ fontWeight: 600 }}>{item.category}</span>
                    <strong style={{ color: '#34d399' }}>{formatCurrency(item.estimatedCostInr, currency)}</strong>
                  </div>
                  <div style={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.08)', overflow: 'hidden', marginBottom: 4 }}>
                    <div style={{ width: `${Math.min(100, pct)}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #10b981)' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    <span>{item.notes}</span>
                    <span>{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── AI SELECTED TRANSPORTATION & HOTELS & FOOD (3-COLUMN GRID) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
        
        {/* 1. TRANSPORTATION CARD */}
        {aiPlan?.recommendedTransport && (
          <div className="glass-panel" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Train size={18} color="#818cf8" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>AI Selected Transportation</h3>
              </div>
              <span className="badge badge-primary" style={{ fontSize: '0.68rem' }}>Optimal Route</span>
            </div>

            <div style={{ padding: '12px 14px', background: 'rgba(99, 102, 241, 0.12)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                    {aiPlan.recommendedTransport.mode === 'Train' ? '🚆 Train' : aiPlan.recommendedTransport.mode === 'Bus' ? '🚌 AC Bus' : aiPlan.recommendedTransport.mode === 'Flight' ? '✈️ Flight' : '🚕 Outstation Cab'}
                  </h4>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    {aiPlan.recommendedTransport.from} → {aiPlan.recommendedTransport.to} • ~{aiPlan.recommendedTransport.durationHours} hrs
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399' }}>
                    {formatCurrency(aiPlan.recommendedTransport.estimatedCostInr, currency)}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Estimated for trip</div>
                </div>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#c7d2fe', marginTop: 8, lineHeight: 1.4 }}>
                💡 {aiPlan.recommendedTransport.notes}
              </p>
            </div>

            {/* Alternative Transport Switch */}
            {aiPlan.alternativeTransport && (
              <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Alternative: </span>
                  <strong>{aiPlan.alternativeTransport.mode}</strong> (~{formatCurrency(aiPlan.alternativeTransport.estimatedCostInr, currency)})
                </div>
                <button
                  type="button"
                  onClick={() => handleSwitchTransport(aiPlan.alternativeTransport!)}
                  className="btn btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                >
                  Switch
                </button>
              </div>
            )}

            {/* Local Transit Summary */}
            {aiPlan.localTransport && (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', paddingTop: 6, borderTop: '1px solid var(--border-subtle)' }}>
                <strong>🚕 Local Transport:</strong> {aiPlan.localTransport.modes} (~{formatCurrency(aiPlan.localTransport.estimatedCostInr, currency)})
              </div>
            )}
          </div>
        )}

        {/* 2. FOOD & DINING CARD */}
        {aiPlan?.restaurants && aiPlan.restaurants.length > 0 && (
          <div className="glass-panel" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Utensils size={18} color="#ff9933" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Dietary-Matched Dining</h3>
              </div>
              <span className="badge badge-saffron" style={{ fontSize: '0.68rem' }}>
                {userReqs?.foodPreferences?.join(', ') || 'Pure Veg'}
              </span>
            </div>

            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Estimated daily food budget: <strong>₹{aiPlan.dailyFoodBudgetMin || 600}–₹{aiPlan.dailyFoodBudgetMax || 900}</strong>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {aiPlan.restaurants.slice(0, 3).map((r, idx) => (
                <div key={idx} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <strong style={{ fontSize: '0.9rem' }}>{r.name}</strong>
                        {r.isVegetarian && <span className="badge badge-safe" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>Pure Veg</span>}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{r.address}</div>
                    </div>
                    <button
                      onClick={() => handleViewOnMap(r.latitude, r.longitude, r.name)}
                      className="btn btn-secondary"
                      style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                      title="View on Map"
                    >
                      <MapPin size={11} /> Map
                    </button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6, fontSize: '0.78rem' }}>
                    <StarRating rating={r.rating} reviewCount={r.reviewCount} />
                    <span style={{ color: '#34d399', fontWeight: 600 }}>~₹{r.avgCostForTwoInr} for 2</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. HOTEL & ACCOMMODATION CARD */}
        {aiPlan?.hotels && aiPlan.hotels.length > 0 && (
          <div className="glass-panel" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Hotel size={18} color="#38bdf8" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Budget-Matched Stays</h3>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button
                  type="button"
                  onClick={() => setHotelSort('budget')}
                  className={`btn ${hotelSort === 'budget' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '3px 8px', fontSize: '0.68rem' }}
                >
                  Price
                </button>
                <button
                  type="button"
                  onClick={() => setHotelSort('rating')}
                  className={`btn ${hotelSort === 'rating' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '3px 8px', fontSize: '0.68rem' }}
                >
                  Top Rated
                </button>
              </div>
            </div>

            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Calculated nightly budget range: <strong>₹{aiPlan.hotelBudgetMin || 1000}–₹{aiPlan.hotelBudgetMax || 1800}/night</strong>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {displayHotels.slice(0, 3).map((h, idx) => (
                <div key={idx} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <strong style={{ fontSize: '0.9rem' }}>{h.name}</strong>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                        {h.type} • {h.address}
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewOnMap(h.latitude, h.longitude, h.name)}
                      className="btn btn-secondary"
                      style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                      title="View on Map"
                    >
                      <MapPin size={11} /> Map
                    </button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6, fontSize: '0.78rem' }}>
                    <StarRating rating={h.rating} reviewCount={h.reviewCount} />
                    <span style={{ color: '#38bdf8', fontWeight: 700 }}>₹{h.pricePerNightInr}/nt</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── INTERACTIVE TRIP MAP WITH AMENITIES ── */}
      <div ref={mapSectionRef} className="glass-panel" style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <MapPin size={18} color="#6366f1" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
              Interactive Trip Map ({filteredMarkers.length} Locations)
            </h3>
          </div>

          {/* Category Filter Chips */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            {currentUserLocation && (
              <button
                type="button"
                onClick={() => {
                  setMapCenter({ lat: currentUserLocation.latitude, lon: currentUserLocation.longitude });
                  setMapZoom(15);
                }}
                className="chip active"
                style={{ fontSize: '0.75rem', padding: '4px 10px', background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)', color: '#fff', border: 'none', fontWeight: 750 }}
                title="Center map on your live GPS location"
              >
                🔵 My Live GPS
              </button>
            )}
            {[
              { id: 'all', label: 'All Places', icon: '🌐' },
              { id: 'attraction', label: 'Attractions', icon: '📍' },
              { id: 'hotel', label: 'Hotels', icon: '🏨' },
              { id: 'restaurant', label: 'Food', icon: '🍛' },
              { id: 'hospital', label: 'Hospitals', icon: '🏥' },
              { id: 'atm', label: 'ATMs', icon: '🏧' },
              { id: 'fuel', label: 'Fuel / EV', icon: '⛽' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setMapCategory(cat.id)}
                className={`chip ${mapCategory === cat.id ? 'active' : ''}`}
                style={{ fontSize: '0.75rem', padding: '4px 10px' }}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>

        <OsmInteractiveMap
          markers={filteredMarkers.map((m: any) => ({
            latitude: m.latitude,
            longitude: m.longitude,
            label: `${m.title} ${m.cost ? `(${m.cost})` : ''}`,
            iconType: m.category === 'hotel' ? 'hotel' : m.category === 'restaurant' ? 'restaurant' : m.category === 'hospital' ? 'location' : 'attraction',
          }))}
          center={mapCenter || (filteredMarkers[0] ? { lat: filteredMarkers[0].latitude, lon: filteredMarkers[0].longitude } : { lat: 17.3850, lon: 78.4867 })}
          zoom={mapZoom}
          height={340}
          currentUserLocation={currentUserLocation}
        />
      </div>

      {/* ── DAY TABS & TIMELINE ITINERARY ── */}
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
        {currentTrip.days.map((d, idx) => (
          <button
            key={d.id}
            onClick={() => setSelectedDayIdx(idx)}
            className={`btn ${selectedDayIdx === idx ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '10px 18px', fontSize: '0.9rem', flexShrink: 0 }}
          >
            <Calendar size={16} />
            <span>Day {d.dayNumber}</span>
          </button>
        ))}
      </div>

      {/* Selected Day Timeline View */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              Day {selectedDay?.dayNumber}: {selectedDay?.theme || 'Daily Sightseeing'}
            </h3>
            {selectedDay?.notes && (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 4 }}>
                💡 Tip: {selectedDay.notes}
              </p>
            )}
          </div>

          <button onClick={() => setShowAddItemModal(true)} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
            <Plus size={16} />
            <span>Add Attraction</span>
          </button>
        </div>

        {/* Timeline Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
          {selectedDay?.items.map((item) => (
            <div
              key={item.id}
              className="glass-panel-interactive"
              style={{
                padding: '18px 20px',
                display: 'grid',
                gridTemplateColumns: '120px 1fr auto',
                gap: 16,
                alignItems: 'center'
              }}
            >
              {/* Timing Badge */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.88rem', fontWeight: 700, color: '#a5b4fc' }}>
                  <Clock size={14} />
                  <span>{item.startTime}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  to {item.endTime}
                </div>
                <span className="badge badge-primary" style={{ fontSize: '0.68rem', marginTop: 4 }}>
                  {item.category}
                </span>
              </div>

              {/* Place Information */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{item.placeName}</h4>
                  {item.wheelchairAccessible && (
                    <span className="badge badge-safe" title="Wheelchair Accessible" style={{ fontSize: '0.68rem' }}>
                      <Accessibility size={11} /> Accessible
                    </span>
                  )}
                  {item.latitude && item.longitude && (
                    <button
                      type="button"
                      onClick={() => handleViewOnMap(item.latitude, item.longitude, item.placeName)}
                      className="btn btn-secondary"
                      style={{ padding: '2px 8px', fontSize: '0.7rem' }}
                    >
                      <MapPin size={10} /> View on Map
                    </button>
                  )}
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {item.notes}
                </p>

                {/* Transport tag */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Car size={13} /> {item.transportMode} (~{item.travelTimeMinutes} mins)
                  </span>
                </div>
              </div>

              {/* Cost & Delete */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#34d399' }}>
                  {item.estimatedCostInr === 0 ? 'Free' : formatCurrency(item.estimatedCostInr, currency)}
                </div>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="btn btn-secondary"
                  title="Remove from itinerary"
                  style={{ padding: '6px 10px', color: '#fb7185' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* ── TRAVEL SAFETY & ALERTS SECTION ── */}
      {aiPlan?.safetyAlerts && aiPlan.safetyAlerts.length > 0 && (
        <div className="glass-panel" style={{ padding: 20, border: '1px solid rgba(234, 179, 8, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <ShieldAlert size={18} color="#eab308" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fde047' }}>Travel Safety & Destination Alerts</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10 }}>
            {aiPlan.safetyAlerts.map((alert, idx) => (
              <div key={idx} style={{ padding: '10px 14px', background: 'rgba(234, 179, 8, 0.06)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(234, 179, 8, 0.18)', fontSize: '0.82rem', color: '#fef08a', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <ShieldCheck size={14} color="#eab308" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{alert}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddItemModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            zIndex: 100
          }}
          onClick={() => setShowAddItemModal(false)}
        >
          <form
            onSubmit={handleAddItem}
            className="glass-panel"
            style={{ maxWidth: 480, width: '100%', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Add Itinerary Stop (Day {selectedDay?.dayNumber})</h3>

            <div>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Attraction / Activity Name</label>
              <input
                type="text"
                required
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="e.g. City Palace Museum or Royal Rajasthani Dinner"
                className="input-field"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Start Time</label>
                <input
                  type="time"
                  value={newItemStartTime}
                  onChange={(e) => setNewItemStartTime(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>End Time</label>
                <input
                  type="time"
                  value={newItemEndTime}
                  onChange={(e) => setNewItemEndTime(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Estimated Cost (₹ INR)</label>
                <input
                  type="number"
                  value={newItemCost}
                  onChange={(e) => setNewItemCost(e.target.value)}
                  placeholder="200"
                  className="input-field"
                />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Transport Mode</label>
                <select
                  value={newItemTransport}
                  onChange={(e) => setNewItemTransport(e.target.value)}
                  className="input-field"
                >
                  <option value="Walking">Walking</option>
                  <option value="Cab / Auto">Cab / Auto Rickshaw</option>
                  <option value="Metro / Train">Metro / Train</option>
                  <option value="Tour Bus">Tour Bus</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Notes / Tips</label>
              <textarea
                value={newItemNotes}
                onChange={(e) => setNewItemNotes(e.target.value)}
                placeholder="e.g. Best photo spots, entry ticket discount with student ID"
                className="input-field"
                rows={2}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
              <button type="button" onClick={() => setShowAddItemModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Add to Itinerary
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── AI OPTIMIZATION RESULTS MODAL ── */}
      {showOptimizationModal && optimizationResult && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10, 15, 30, 0.88)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            zIndex: 160
          }}
          onClick={() => setShowOptimizationModal(false)}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: 540,
              width: '100%',
              padding: 26,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              border: '1px solid #10b981',
              boxShadow: '0 12px 40px rgba(16,185,129,0.25)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <Sparkles size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
                    Itinerary Optimized Successfully!
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: '#34d399', margin: 0, fontWeight: 600 }}>
                    ✓ Route sequencing, timing & budget balanced
                  </p>
                </div>
              </div>
              <button onClick={() => setShowOptimizationModal(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            {/* Metric Highlights */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: '12px 14px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10 }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Estimated Savings</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399' }}>
                  {formatCurrency(optimizationResult.savingsInr, currency)}
                </div>
              </div>

              <div style={{ padding: '12px 14px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10 }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Transit Time Saved</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#818cf8' }}>
                  ~{optimizationResult.timeSavedMinutes} mins
                </div>
              </div>
            </div>

            {/* What Was Improved List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <strong style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>Key Optimizations Applied:</strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 180, overflowY: 'auto' }}>
                {optimizationResult.routeImprovements.map((imp, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    <CheckCircle2 size={15} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>{imp}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 6, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
              <button
                onClick={() => {
                  setShowOptimizationModal(false);
                  onAskAiToOptimize(currentTrip.title);
                }}
                className="btn btn-secondary"
                style={{ fontSize: '0.82rem' }}
              >
                <span>Ask AI Follow-up in Chat</span>
              </button>
              <button
                onClick={() => setShowOptimizationModal(false)}
                className="btn btn-primary"
                style={{ fontSize: '0.82rem', fontWeight: 700 }}
              >
                <span>Apply & View Itinerary</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
