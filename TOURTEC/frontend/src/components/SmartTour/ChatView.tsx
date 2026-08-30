import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  MapPin,
  CloudSun,
  ShieldCheck,
  Calendar,
  Compass,
  ArrowRight,
  Info,
  Clock,
  Accessibility,
  CheckCircle2,
  Trash2,
  Volume2,
  Star,
  ExternalLink,
  Utensils,
  Hotel,
  Train,
  DollarSign,
  ShoppingBag,
  Camera,
  ArrowRightLeft,
  Heart,
  Phone,
  Globe,
  ChevronDown,
  ChevronUp,
  Droplets,
  Wind,
  Eye,
  Thermometer,
  Sun,
  Gauge,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { ChatMessage, StructuredAiResponse, RestaurantRecommendation, HotelRecommendation, TransportOption, BudgetBreakdown, OsmPlaceResult, OsmNearbyData, OsmGeocodeResult, TravelProfile } from '../../types/smartTourTypes';
import { sendMessageToAI, formatCurrency } from '../../services/smartTourApi';
import OsmInteractiveMap from './OsmInteractiveMap';

interface ChatViewProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  currency: string;
  language: string;
  travelProfile: TravelProfile;
  onOpenTrip: () => void;
  onSelectDestination: (name: string) => void;
  onOpenPreferences: () => void;
  currentUserLocation?: { latitude: number; longitude: number; accuracy?: number } | null;
}

// Profile summary label maps
const BUDGET_EMOJI: Record<string, string> = { budget: '💼', moderate: '✨', luxury: '👑' };
const BUDGET_LABEL: Record<string, string> = { budget: 'Budget', moderate: 'Moderate', luxury: 'Luxury' };
const ACCESS_EMOJI: Record<string, string> = { wheelchair_access: '♿', low_walking_distance: '🚶', senior_friendly: '👴', family_friendly: '👨‍👩‍👧' };
const ACCESS_LABEL: Record<string, string> = { wheelchair_access: 'Wheelchair', low_walking_distance: 'Low Walk', senior_friendly: 'Senior', family_friendly: 'Family' };
const FOOD_EMOJI = '🍛';
const FOOD_LABEL: Record<string, string> = {
  vegetarian: 'Pure Veg',
  vegan: 'Vegan',
  jain: 'Jain',
  halal: 'Halal',
  gluten_free: 'Gluten-Free',
  no_preference: 'No Preference',
  other: 'Dietary',
  rajasthani: 'Rajasthani',
  seafood: 'Seafood'
};

// Star rating renderer
const StarRating: React.FC<{ rating: number; reviewCount?: number }> = ({ rating, reviewCount }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
    {[1, 2, 3, 4, 5].map(star => (
      <Star
        key={star}
        size={13}
        fill={star <= Math.round(rating) ? '#FBBF24' : 'transparent'}
        color={star <= Math.round(rating) ? '#FBBF24' : '#475569'}
        strokeWidth={1.5}
      />
    ))}
    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FBBF24', marginLeft: 2 }}>{rating}</span>
    {reviewCount && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>({reviewCount.toLocaleString()} reviews)</span>}
  </div>
);

// Price level renderer
const PriceLevel: React.FC<{ level: number }> = ({ level }) => (
  <span style={{ color: '#34d399', fontWeight: 700, fontSize: '0.85rem' }}>
    {'₹'.repeat(level)}
    <span style={{ color: '#334155' }}>{'₹'.repeat(4 - level)}</span>
  </span>
);

// Rich Markdown & Text Formatter Helper
const renderFormattedMarkdown = (text: string) => {
  if (!text) return null;
  const lines = text.split('\n');

  const formatInline = (str: string) => {
    const parts = str.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
    return parts.map((part, pIdx) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
        return (
          <strong key={pIdx} style={{ fontWeight: 750, color: 'inherit' }}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
        return <em key={pIdx}>{part.slice(1, -1)}</em>;
      }
      if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
        return (
          <code
            key={pIdx}
            style={{
              background: 'rgba(0, 0, 0, 0.08)',
              padding: '2px 6px',
              borderRadius: 4,
              fontFamily: 'monospace',
              fontSize: '0.88em'
            }}
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} style={{ height: 4 }} />;
        }

        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} style={{ fontSize: '1.05rem', fontWeight: 800, marginTop: 6, marginBottom: 2 }}>
              {formatInline(trimmed.slice(4))}
            </h4>
          );
        }

        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={idx} style={{ fontSize: '1.15rem', fontWeight: 850, marginTop: 8, marginBottom: 4 }}>
              {formatInline(trimmed.slice(3))}
            </h3>
          );
        }

        if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || (trimmed.startsWith('* ') && !trimmed.endsWith('*'))) {
          const bulletContent = trimmed.replace(/^[-•*]\s+/, '');
          return (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, paddingLeft: 4 }}>
              <span style={{ color: 'var(--primary)', fontWeight: 800, lineHeight: 1.5, fontSize: '0.9rem' }}>•</span>
              <div style={{ flex: 1 }}>{formatInline(bulletContent)}</div>
            </div>
          );
        }

        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, paddingLeft: 4 }}>
              <span style={{ color: 'var(--primary)', fontWeight: 750, minWidth: 20 }}>{numMatch[1]}.</span>
              <div style={{ flex: 1 }}>{formatInline(numMatch[2])}</div>
            </div>
          );
        }

        return <div key={idx}>{formatInline(line)}</div>;
      })}
    </div>
  );
};

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  setMessages,
  currency,
  language,
  travelProfile,
  onOpenTrip,
  onSelectDestination,
  onOpenPreferences,
  currentUserLocation
}) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(() => {
    return currentUserLocation ? { lat: currentUserLocation.latitude, lng: currentUserLocation.longitude } : null;
  });
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      setIsFullscreen(true);
      try {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      } catch (e) {}
    } else {
      setIsFullscreen(false);
      try {
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      } catch (e) {}
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Sync prop changes
  useEffect(() => {
    if (currentUserLocation) {
      setUserLocation({ lat: currentUserLocation.latitude, lng: currentUserLocation.longitude });
    }
  }, [currentUserLocation]);

  // Request browser geolocation once if not provided
  useEffect(() => {
    if (!currentUserLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {},
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  }, [currentUserLocation]);

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'USER',
      content: textToSend,
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await sendMessageToAI(
        textToSend,
        undefined,
        userLocation?.lat,
        userLocation?.lng,
        language,
        travelProfile
      );

      const aiMsg: ChatMessage = {
        id: 'msg-ai-' + Date.now(),
        role: 'ASSISTANT',
        content: response.message,
        structuredResponse: response,
        language: response.language,
        createdAt: new Date().toISOString()
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('AI chat failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome-1',
        role: 'ASSISTANT',
        content: `Namaste! 🙏 I am **SmartTour AI**, your intelligent travel, planning, and safety companion for India.\n\nTell me your dream destination, budget, or safety questions, and I'll create a full personalized experience!`,
        createdAt: new Date().toISOString()
      }
    ]);
  };

  // ==========================================
  // RESTAURANT CARD
  // ==========================================
  const renderRestaurantCard = (rest: RestaurantRecommendation, idx: number) => (
    <div key={idx} className="glass-panel-interactive" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Utensils size={14} color="#ff9933" />
            {rest.name}
          </h4>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rest.cuisine}</span>
        </div>
        {rest.isVegetarian && (
          <span className="badge badge-safe" style={{ fontSize: '0.68rem' }}>🟢 Pure Veg</span>
        )}
      </div>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {rest.description}
      </p>
      {rest.specialties.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {rest.specialties.slice(0, 4).map((s, i) => (
            <span key={i} style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 99, background: 'rgba(255,153,51,0.12)', color: '#ff9933', border: '1px solid rgba(255,153,51,0.25)' }}>{s}</span>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 8, borderTop: '1px solid var(--border-subtle)', fontSize: '0.8rem' }}>
        <StarRating rating={rest.rating} reviewCount={rest.reviewCount} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <PriceLevel level={rest.priceLevel} />
          <span style={{ color: 'var(--text-muted)' }}>~{formatCurrency(rest.avgCostForTwoInr, currency)}/2</span>
        </div>
      </div>
      {rest.googleMapsUrl && (
        <a href={rest.googleMapsUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: '#6366f1', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none', marginTop: 4 }}>
          <ExternalLink size={12} /> View on Google Maps
        </a>
      )}
    </div>
  );

  // ==========================================
  // HOTEL CARD
  // ==========================================
  const renderHotelCard = (hotel: HotelRecommendation, idx: number) => (
    <div key={idx} className="glass-panel-interactive" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Hotel size={14} color="#6366f1" />
            {hotel.name}
          </h4>
          <span className="badge badge-primary" style={{ fontSize: '0.68rem', marginTop: 4, display: 'inline-flex' }}>{hotel.type}</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399' }}>{formatCurrency(hotel.pricePerNightInr, currency)}</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>per night</span>
        </div>
      </div>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {hotel.description}
      </p>
      {hotel.amenities.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {hotel.amenities.slice(0, 5).map((a, i) => (
            <span key={i} style={{ fontSize: '0.68rem', padding: '2px 7px', borderRadius: 99, background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}>{a}</span>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 8, borderTop: '1px solid var(--border-subtle)' }}>
        <StarRating rating={hotel.rating} reviewCount={hotel.reviewCount} />
        {hotel.googleMapsUrl && (
          <a href={hotel.googleMapsUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: '#6366f1', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
            <ExternalLink size={12} /> Maps
          </a>
        )}
      </div>
    </div>
  );

  // ==========================================
  // TRANSPORT OPTIONS TABLE
  // ==========================================
  const renderTransportOptions = (options: TransportOption[]) => (
    <div className="glass-panel" style={{ padding: 16, overflow: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Train size={18} color="var(--primary)" />
        <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>Transport Options & Route Comparison</strong>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {options.map((opt, idx) => (
          <div key={idx} style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            background: opt.recommended ? 'var(--bg-soft-green)' : 'var(--bg-soft-blue)',
            border: opt.recommended ? '1.5px solid #86EFAC' : '1.5px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            transition: 'all 0.2s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 160 }}>
              <span style={{ fontSize: '1.4rem' }}>
                {opt.mode === 'Train' ? '🚂' : opt.mode === 'Flight' ? '✈️' : opt.mode === 'Bus' ? '🚌' : opt.mode === 'Cab' ? '🚗' : opt.mode === 'Auto Rickshaw' ? '🛺' : opt.mode === 'Metro' ? '🚇' : '🚐'}
              </span>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {opt.mode}
                  {opt.recommended && <span className="badge badge-safe" style={{ fontSize: '0.62rem' }}>⭐ Best Value</span>}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{opt.frequency}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: '0.88rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{opt.durationHours < 1 ? `${Math.round(opt.durationHours * 60)} min` : `${opt.durationHours} hrs`}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Duration</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 850, color: 'var(--green)', fontSize: '0.98rem' }}>{formatCurrency(opt.estimatedCostInr, currency)}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Est. Cost</div>
              </div>
            </div>
            {opt.bookingUrl && (
              <a href={opt.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.75rem', textDecoration: 'none', borderRadius: '8px' }}>
                Book <ExternalLink size={12} />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // ==========================================
  // BUDGET BREAKDOWN
  // ==========================================
  const renderBudgetBreakdown = (breakdown: BudgetBreakdown[]) => {
    const total = breakdown.reduce((sum, b) => sum + b.estimatedCostInr, 0);
    return (
      <div className="glass-panel" style={{ padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <DollarSign size={18} color="var(--green)" />
          <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>Budget Breakdown</strong>
          <span style={{ marginLeft: 'auto', fontSize: '1.05rem', fontWeight: 800, color: 'var(--green)' }}>
            Total: {formatCurrency(total, currency)}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {breakdown.map((item, idx) => {
            const pct = Math.round((item.estimatedCostInr / total) * 100);
            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, minWidth: 160, color: 'var(--text-primary)' }}>{item.category}</span>
                <div style={{ flex: 1, height: 8, borderRadius: 4, background: 'var(--surface-soft)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', borderRadius: 4, background: 'linear-gradient(90deg, #2563EB, #10B981)' }} />
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 750, minWidth: 80, textAlign: 'right', color: 'var(--text-primary)' }}>{formatCurrency(item.estimatedCostInr, currency)}</span>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', minWidth: 34 }}>{pct}%</span>
              </div>
            );
          })}
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 10, fontWeight: 550 }}>
          💡 Prices are estimates based on moderate travel style. Budget travelers can reduce costs by 30-40%.
        </p>
      </div>
    );
  };

  return (
    <div
      className={`chat-container-wrap ${isFullscreen ? 'chat-fullscreen' : ''}`}
      style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', minHeight: 0, flex: 1 }}
    >
      <div className="chat-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'hidden', flex: 1 }}>
        
        {/* Solid Header: AI Top Bar + Travel Profile Strip */}
        <div style={{ flexShrink: 0, background: 'var(--surface)', borderBottom: '1.5px solid var(--border)', zIndex: 10 }}>
          {/* AI Top Bar */}
          <div className="ai-bar" style={{ padding: isFullscreen ? '14px 36px' : '14px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="ai-avatar">
                <Bot size={20} color="#ffffff" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h3 className="gradient-text-brand" style={{ fontSize: '1.1rem', fontWeight: 850 }}>SmartTour AI Assistant</h3>
                  <span className="online-pill">
                    <span className="online-dot" />
                    Online
                  </span>
                  {isFullscreen && (
                    <span className="badge badge-primary" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                      ⛶ Full Screen
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 550 }}>
                  Powered by AI • Google Maps Data • 24+ Destinations • 15 Query Types
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {userLocation && (
                <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
                  <MapPin size={12} /> GPS Active
                </span>
              )}

              {/* Full Screen Toggle Button */}
              <button
                onClick={toggleFullscreen}
                className={`control ${isFullscreen ? 'control-fullscreen-active' : ''}`}
                title={isFullscreen ? "Exit Full Screen (Esc)" : "Enter Full Screen"}
                style={{
                  height: 36,
                  fontSize: '0.78rem',
                  gap: 6,
                  transition: 'all 0.2s ease',
                  ...(isFullscreen ? {
                    background: 'linear-gradient(135deg, #2563EB, #0891B2)',
                    color: '#ffffff',
                    borderColor: '#2563EB',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
                  } : {})
                }}
              >
                {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                <span>{isFullscreen ? 'Exit Full Screen' : 'Full Screen'}</span>
              </button>

              <button
                onClick={handleClear}
                className="control"
                title="Clear Conversation"
                style={{ height: 36, fontSize: '0.78rem' }}
              >
                <Trash2 size={14} /> Clear
              </button>
            </div>
          </div>

          {/* Travel Profile Strip */}
          <div className="trip-profile" style={{ margin: '10px 28px 12px' }}>
            <span className="profile-label">Trip Profile:</span>
            <span className="profile-chip">📍 {travelProfile.destination || 'Hyderabad'}</span>
            <span className="profile-chip orange">
              💰 {travelProfile.currency || '₹'} {Number(travelProfile.totalBudget || 10000).toLocaleString('en-IN')} Total
            </span>
            <span className="profile-chip">👥 {travelProfile.travelers || 2} Travelers</span>
            <span className="profile-chip">📅 {travelProfile.durationDays || 3} Days</span>
            {travelProfile.foodPreferences && travelProfile.foodPreferences.map(p => (
              <span key={p} className="profile-chip orange">
                {FOOD_EMOJI} {FOOD_LABEL[p] || p}
              </span>
            ))}
            {travelProfile.accessibilityPreferences && travelProfile.accessibilityPreferences.map(p => (
              <span key={p} className="profile-chip green">
                {ACCESS_EMOJI[p]} {ACCESS_LABEL[p] || p}
              </span>
            ))}
            <button className="primary-button" onClick={onOpenPreferences} type="button" style={{ marginLeft: 'auto', minHeight: 32, paddingInline: 12, fontSize: '0.75rem', flexShrink: 0 }}>
              Edit Profile
            </button>
          </div>
        </div>

        {/* Message Feed */}
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {messages.map((msg) => {
            const isUser = msg.role === 'USER';
            const structured = msg.structuredResponse;

            return (
              <div
                key={msg.id}
                className="animate-fade-in"
                style={{
                  display: 'flex',
                  gap: 12,
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  maxWidth: isUser ? '85%' : '95%',
                  flexDirection: isUser ? 'row-reverse' : 'row'
                }}
              >
                {/* Avatar */}
                <div className={isUser ? '' : 'ai-avatar'} style={{
                  width: 34,
                  height: 34,
                  borderRadius: isUser ? 10 : 13,
                  flexShrink: 0,
                  background: isUser ? '#2563EB' : undefined,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isUser ? '0 2px 10px rgba(37,99,235,0.25)' : undefined
                }}>
                  {isUser ? <User size={18} color="#fff" /> : <Sparkles size={18} color="#fff" />}
                </div>

                {/* Message Bubble */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: '100%', minWidth: 0 }}>
                  <div style={{
                    background: isUser ? 'linear-gradient(135deg, #2563EB, #1D4ED8)' : 'var(--surface)',
                    border: isUser ? 'none' : '1.5px solid var(--border)',
                    borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                    padding: '16px 22px',
                    color: isUser ? '#FFFFFF' : 'var(--text-primary)',
                    fontSize: '0.98rem',
                    fontWeight: 500,
                    lineHeight: 1.7,
                    boxShadow: isUser ? '0 4px 16px rgba(37,99,235,0.25)' : '0 2px 10px rgba(15,23,42,0.04)'
                  }}>
                    <div>
                      {renderFormattedMarkdown(msg.content)}
                    </div>

                    {/* Data Provenance Badge */}
                    {structured?.provenance && (
                      <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        <ShieldCheck size={12} color="#10b981" />
                        <span>Source: {structured.provenance.source}</span>
                      </div>
                    )}
                  </div>

                  {/* Open-Meteo Weather Card */}
                  {structured?.type === 'WEATHER' && structured?.data && (() => {
                    const wd = structured.data as any;
                    const loc = wd.location;
                    const cur = wd.current;
                    const daily: any[] = wd.daily || [];
                    const hourly: any[] = wd.hourly || [];
                    const hasDaily = daily.length > 0;
                    const hasHourly = hourly.length > 0;

                    return (
                      <div className="glass-panel" style={{
                        padding: 0,
                        background: cur?.isDay
                          ? 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(99,102,241,0.08))'
                          : 'linear-gradient(135deg, rgba(30,27,75,0.25), rgba(99,102,241,0.12))',
                        border: '1px solid rgba(99,102,241,0.35)',
                        overflow: 'hidden',
                        marginTop: 8
                      }}>
                        {/* Header: location + live/cached badge */}
                        <div style={{ padding: '14px 16px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: '2rem', lineHeight: 1 }}>{cur?.conditionEmoji || '🌡️'}</span>
                            <div>
                              <strong style={{ fontSize: '0.95rem' }}>{loc?.name}{loc?.country ? `, ${loc.country}` : ''}</strong>
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>
                                {loc?.region && <span>{loc.region} · </span>}
                                <Clock size={10} style={{ marginRight: 3, verticalAlign: 'middle' }} />
                                {loc?.localTime || 'Just now'}
                                {loc?.timezone && <span style={{ marginLeft: 6, opacity: 0.7 }}>({loc.timezone})</span>}
                              </div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                            <span style={{ fontSize: '0.62rem', padding: '3px 8px', borderRadius: 12, background: wd.cached ? 'rgba(234,179,8,0.15)' : 'rgba(16,185,129,0.15)', color: wd.cached ? '#eab308' : '#10b981', fontWeight: 600 }}>
                              {wd.cached ? '📦 Cached' : '🟢 Live'}
                            </span>
                            <span style={{ fontSize: '0.6rem', padding: '2px 6px', borderRadius: 10, background: 'rgba(99,102,241,0.15)', color: '#818cf8', fontWeight: 600 }}>
                              Open-Meteo · Free
                            </span>
                          </div>
                        </div>

                        {/* Main temp + condition */}
                        <div style={{ padding: '14px 16px 8px', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                          <div>
                            <div style={{ fontSize: '2.8rem', fontWeight: 800, lineHeight: 1, letterSpacing: '-1px' }}>
                              {cur?.temperature}°C
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
                              <Thermometer size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                              Feels like <strong>{cur?.feelsLike}°C</strong>
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                              {cur?.condition}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                              {cur?.isDay ? '☀️ Daytime' : '🌙 Nighttime'}
                            </div>
                          </div>
                        </div>

                        {/* Stats grid */}
                        <div style={{ padding: '0 16px 12px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 6 }}>
                          {[
                            { icon: <Droplets size={13} color="#3b82f6" />, label: 'Humidity', value: `${cur?.humidity}%` },
                            { icon: <Wind size={13} color="#8b5cf6" />, label: 'Wind', value: `${cur?.windSpeed} km/h ${cur?.windDirection || ''}` },
                            { icon: <Eye size={13} color="#06b6d4" />, label: 'Visibility', value: `${cur?.visibility} km` },
                            { icon: <Sun size={13} color="#f59e0b" />, label: 'UV Index', value: `${cur?.uvIndex}` },
                            { icon: <CloudSun size={13} color="#64748b" />, label: 'Cloud Cover', value: `${cur?.cloudCover}%` },
                            { icon: <span style={{ fontSize: '0.75rem' }}>🌧️</span>, label: 'Precipitation', value: `${cur?.precipitation} mm` },
                          ].map((stat, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.76rem', padding: '5px 8px', background: 'rgba(255,255,255,0.04)', borderRadius: 8 }}>
                              {stat.icon}
                              <span style={{ color: 'var(--text-muted)' }}>{stat.label}:</span>
                              <strong>{stat.value}</strong>
                            </div>
                          ))}
                        </div>

                        {/* 7-Day Forecast Strip */}
                        {hasDaily && (
                          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '10px 16px 12px' }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                              📅 7-Day Forecast
                            </div>
                            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
                              {daily.slice(0, 7).map((day: any, i: number) => (
                                <div key={i} style={{
                                  minWidth: 72,
                                  padding: '8px 6px',
                                  background: i === 0 ? 'rgba(99,102,241,0.18)' : 'rgba(255,255,255,0.04)',
                                  borderRadius: 10,
                                  border: i === 0 ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(255,255,255,0.06)',
                                  textAlign: 'center',
                                  flexShrink: 0
                                }}>
                                  <div style={{ fontSize: '0.68rem', fontWeight: 600, color: i === 0 ? '#818cf8' : 'var(--text-muted)', marginBottom: 4 }}>
                                    {day.dayName}
                                  </div>
                                  <div style={{ fontSize: '1.3rem', lineHeight: 1, marginBottom: 4 }}>{day.conditionEmoji}</div>
                                  <div style={{ fontSize: '0.72rem', fontWeight: 700 }}>{Math.round(day.maxTemp)}°</div>
                                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{Math.round(day.minTemp)}°</div>
                                  {day.precipitationProbability > 10 && (
                                    <div style={{ fontSize: '0.62rem', color: '#60a5fa', marginTop: 3 }}>
                                      💧{day.precipitationProbability}%
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 24h Hourly Strip (shown when hourly data available) */}
                        {hasHourly && hourly.length > 2 && (
                          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '10px 16px 12px' }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                              🕐 Hourly Forecast
                            </div>
                            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
                              {hourly.slice(0, 12).map((h: any, i: number) => (
                                <div key={i} style={{
                                  minWidth: 58,
                                  padding: '7px 5px',
                                  background: 'rgba(255,255,255,0.04)',
                                  borderRadius: 10,
                                  border: '1px solid rgba(255,255,255,0.06)',
                                  textAlign: 'center',
                                  flexShrink: 0
                                }}>
                                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginBottom: 3 }}>{h.hour}</div>
                                  <div style={{ fontSize: '1.1rem', lineHeight: 1, marginBottom: 3 }}>{h.conditionEmoji}</div>
                                  <div style={{ fontSize: '0.72rem', fontWeight: 700 }}>{Math.round(h.temperature)}°</div>
                                  {h.precipitationProbability > 10 && (
                                    <div style={{ fontSize: '0.6rem', color: '#60a5fa', marginTop: 2 }}>
                                      {h.precipitationProbability}%
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Footer: source attribution */}
                        <div style={{ padding: '6px 16px 10px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.65rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <ShieldCheck size={10} color="#10b981" />
                          Powered by Open-Meteo · Free & Open Source · Updated: {wd.observationTime || 'Just now'}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Fallback Weather Widget Card (client-side engine) */}
                  {structured?.weather && structured?.type !== 'WEATHER' && (
                    <div className="glass-panel" style={{ padding: 16, background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <CloudSun size={20} color="#ff9933" />
                          <strong style={{ fontSize: '0.95rem' }}>{structured.weather.destination} Weather</strong>
                        </div>
                        <span className={`badge ${structured.weather.isSafeForTravel ? 'badge-safe' : 'badge-warning'}`}>
                          {structured.weather.isSafeForTravel ? <><CheckCircle2 size={12} /> Safe for Travel</> : '⚠️ Check Advisory'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                        <div>
                          <span style={{ fontSize: '1.75rem', fontWeight: 800 }}>{structured.weather.temperatureC}°C</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: 8 }}>{structured.weather.condition}</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          <div>Humidity: <strong>{structured.weather.humidity}%</strong></div>
                          <div>Wind: <strong>{structured.weather.windSpeedKmh} km/h</strong></div>
                        </div>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8 }}>
                        {structured.weather.forecastSummary}
                      </p>
                    </div>
                  )}

                  {/* ============================================ */}
                  {/* OpenStreetMap Nearby Places Card */}
                  {/* ============================================ */}
                  {structured?.type === 'NEARBY_PLACES' && structured?.data && (() => {
                    const nd = structured.data as OsmNearbyData;
                    const places = nd?.places || [];
                    const center = nd?.searchCenter;
                    const placeType = nd?.placeType || 'place';

                    // Place type emoji mapping
                    const typeEmoji: Record<string, string> = {
                      restaurant: '🍽️', hospital: '🏥', pharmacy: '💊', hotel: '🏨',
                      school: '🏫', atm: '🏧', bank: '🏦', cafe: '☕', park: '🌳',
                      museum: '🏛️', temple: '🛕', mosque: '🕌', church: '⛪',
                      police: '🚔', cinema: '🎬', library: '📚', bus_station: '🚌',
                      train_station: '🚂', airport: '✈️', attraction: '🎯', hostel: '🏠',
                      parking: '🅿️', fuel: '⛽', post_office: '📮', bar: '🍺',
                      clinic: '🏥', doctor: '👨‍⚕️', dentist: '🦷', guest_house: '🏡',
                    };
                    const emoji = typeEmoji[placeType] || '📍';

                    const formatDist = (m: number) =>
                      m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`;

                    return (
                      <div className="glass-panel" style={{
                        padding: 0,
                        background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(99,102,241,0.06))',
                        border: '1px solid rgba(16,185,129,0.3)',
                        overflow: 'hidden',
                        marginTop: 8
                      }}>
                        {/* Header */}
                        <div style={{ padding: '12px 16px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: '1.6rem' }}>{emoji}</span>
                            <div>
                              <strong style={{ fontSize: '0.92rem' }}>
                                {places.length} {placeType.replace('_', ' ')}{places.length !== 1 ? 's' : ''} found
                              </strong>
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>
                                <MapPin size={10} style={{ verticalAlign: 'middle', marginRight: 3 }} />
                                {center?.label || 'Search area'} · {nd?.radiusMeters ? formatDist(nd.radiusMeters) : '2 km'} radius
                              </div>
                            </div>
                          </div>
                          <span style={{ fontSize: '0.6rem', padding: '3px 8px', borderRadius: 10, background: 'rgba(16,185,129,0.15)', color: '#10b981', fontWeight: 600 }}>
                            OpenStreetMap
                          </span>
                        </div>

                        {/* Interactive Map */}
                        {places.length > 0 && (
                          <div style={{ padding: '0 12px' }}>
                            <OsmInteractiveMap
                              markers={places.map(p => ({
                                latitude: p.latitude,
                                longitude: p.longitude,
                                label: p.name,
                                iconType: p.type || placeType,
                                placeId: p.osmType && p.osmId ? `${p.osmType}/${p.osmId}` : undefined,
                                distance: p.distance,
                              }))}
                              center={center ? { lat: center.lat, lon: center.lon } : undefined}
                              showRadius={nd?.radiusMeters}
                              height={240}
                              currentUserLocation={currentUserLocation}
                            />
                          </div>
                        )}

                        {/* Places List */}
                        <div style={{ padding: '10px 12px', maxHeight: 300, overflowY: 'auto' }}>
                          {places.slice(0, 15).map((p: OsmPlaceResult, i: number) => (
                            <div key={i} style={{
                              display: 'flex', alignItems: 'center', gap: 10,
                              padding: '8px 10px',
                              background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent',
                              borderRadius: 8,
                              marginBottom: 2,
                              transition: 'background 0.2s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.1)')}
                            onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent')}
                            >
                              <div style={{
                                width: 28, height: 28, borderRadius: 8,
                                background: 'rgba(99,102,241,0.15)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.7rem', fontWeight: 800, color: '#818cf8', flexShrink: 0,
                              }}>
                                {i + 1}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '0.82rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {p.name}
                                </div>
                                {p.address && (
                                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {p.address}
                                  </div>
                                )}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                                <span style={{
                                  fontSize: '0.68rem', padding: '2px 8px', borderRadius: 10,
                                  background: p.distance < 500 ? 'rgba(16,185,129,0.15)' : p.distance < 1500 ? 'rgba(59,130,246,0.12)' : 'rgba(251,191,36,0.12)',
                                  color: p.distance < 500 ? '#10b981' : p.distance < 1500 ? '#3b82f6' : '#f59e0b',
                                  fontWeight: 600, whiteSpace: 'nowrap',
                                }}>
                                  {formatDist(p.distance)}
                                </span>
                                {p.osmUrl && (
                                  <a href={p.osmUrl} target="_blank" rel="noopener noreferrer" title="View on OpenStreetMap" style={{ color: '#6366f1', display: 'flex' }}>
                                    <ExternalLink size={12} />
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Suggested Actions */}
                        {structured?.suggestedActions && structured.suggestedActions.length > 0 && (
                          <div style={{ padding: '6px 12px 10px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {structured.suggestedActions.map((action: any, i: number) => (
                              <button
                                key={i}
                                onClick={() => {
                                  if (action.payload && action.action === 'search_wider') {
                                    setInput(action.payload);
                                  }
                                }}
                                style={{
                                  padding: '5px 12px', borderRadius: 16,
                                  background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)',
                                  color: '#818cf8', fontSize: '0.72rem', fontWeight: 600,
                                  cursor: 'pointer', transition: 'all 0.2s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.25)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.12)'; }}
                              >
                                {action.label}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Footer: OSM attribution */}
                        <div style={{ padding: '6px 16px 8px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.62rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Globe size={10} color="#10b981" />
                          © OpenStreetMap contributors · Free & Open Data
                        </div>
                      </div>
                    );
                  })()}

                  {/* ============================================ */}
                  {/* OpenStreetMap Geocode Result Card */}
                  {/* ============================================ */}
                  {structured?.type === 'GEOCODE_RESULT' && structured?.data && (() => {
                    const geo = structured.data as OsmGeocodeResult;
                    return (
                      <div className="glass-panel" style={{
                        padding: 0,
                        background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(59,130,246,0.06))',
                        border: '1px solid rgba(99,102,241,0.3)',
                        overflow: 'hidden',
                        marginTop: 8
                      }}>
                        {/* Header */}
                        <div style={{ padding: '12px 16px 10px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                          <span style={{ fontSize: '1.5rem' }}>📍</span>
                          <div style={{ flex: 1 }}>
                            <strong style={{ fontSize: '0.92rem' }}>{geo.name || geo.displayName?.split(',')[0]}</strong>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>
                              {geo.displayName}
                            </div>
                          </div>
                          <span style={{ fontSize: '0.6rem', padding: '3px 8px', borderRadius: 10, background: 'rgba(99,102,241,0.15)', color: '#818cf8', fontWeight: 600 }}>
                            Nominatim
                          </span>
                        </div>

                        {/* Map */}
                        <div style={{ padding: '0 12px' }}>
                          <OsmInteractiveMap
                            markers={[{
                              latitude: geo.latitude,
                              longitude: geo.longitude,
                              label: geo.name || geo.displayName?.split(',')[0] || 'Location',
                              iconType: 'location',
                            }]}
                            center={{ lat: geo.latitude, lon: geo.longitude }}
                            zoom={14}
                            height={200}
                            currentUserLocation={currentUserLocation}
                          />
                        </div>

                        {/* Details Grid */}
                        <div style={{ padding: '10px 16px 12px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 6 }}>
                          {[
                            { label: 'Latitude', value: geo.latitude?.toFixed(6) },
                            { label: 'Longitude', value: geo.longitude?.toFixed(6) },
                            ...(geo.country ? [{ label: 'Country', value: geo.country }] : []),
                            ...(geo.state ? [{ label: 'State', value: geo.state }] : []),
                            ...(geo.city ? [{ label: 'City', value: geo.city }] : []),
                            ...(geo.postcode ? [{ label: 'Postcode', value: geo.postcode }] : []),
                          ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.76rem', padding: '5px 8px', background: 'rgba(255,255,255,0.04)', borderRadius: 8 }}>
                              <span style={{ color: 'var(--text-muted)' }}>{item.label}:</span>
                              <strong>{item.value}</strong>
                            </div>
                          ))}
                        </div>

                        {/* OSM Link */}
                        {geo.osmUrl && (
                          <div style={{ padding: '0 16px 8px' }}>
                            <a href={geo.osmUrl} target="_blank" rel="noopener noreferrer" style={{
                              fontSize: '0.75rem', color: '#6366f1', display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none'
                            }}>
                              <ExternalLink size={12} /> View on OpenStreetMap
                            </a>
                          </div>
                        )}

                        {/* Footer */}
                        <div style={{ padding: '6px 16px 8px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.62rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Globe size={10} color="#6366f1" />
                          © OpenStreetMap contributors · Nominatim Geocoding
                        </div>
                      </div>
                    );
                  })()}

                  {/* Place Recommendation Cards */}
                  {structured?.places && structured.places.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14, marginTop: 6 }}>
                      {structured.places.map((place, idx) => (
                        <div key={idx} className="glass-panel-interactive" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {place.imageUrl && (
                            <img
                              src={place.imageUrl}
                              alt={place.name}
                              style={{ width: '100%', height: 130, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                            />
                          )}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{place.name}</h4>
                            <span className="badge badge-primary">{place.category}</span>
                          </div>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {place.description}
                          </p>
                          {/* Star Rating */}
                          {place.rating && <StarRating rating={place.rating} reviewCount={place.reviewCount} />}
                          {/* Opening Hours */}
                          {place.openingHours && place.openingHours.length > 0 && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Clock size={11} />
                              <span>{place.openingHours[0]}</span>
                            </div>
                          )}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 8, borderTop: '1px solid var(--border-subtle)', fontSize: '0.8rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <Clock size={13} color="var(--text-muted)" />
                              <span>{place.avgVisitHours} hrs</span>
                            </div>
                            {place.wheelchairAccessible && (
                              <span className="badge badge-safe" title="Wheelchair Accessible" style={{ fontSize: '0.7rem' }}>
                                <Accessibility size={12} /> Accessible
                              </span>
                            )}
                            <div style={{ fontWeight: 700, color: '#34d399' }}>
                              {place.entryFeeInr === 0 ? 'Free Entry' : formatCurrency(place.entryFeeInr, currency)}
                            </div>
                          </div>
                          {/* Google Maps Link */}
                          {place.googleMapsUrl && (
                            <a href={place.googleMapsUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: '#6366f1', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none', marginTop: 2 }}>
                              <ExternalLink size={12} /> View on Google Maps
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Restaurant Recommendation Cards */}
                  {structured?.restaurants && structured.restaurants.length > 0 && (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                        <Utensils size={16} color="#ff9933" />
                        <strong style={{ fontSize: '0.9rem' }}>Restaurant Recommendations</strong>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
                        {structured.restaurants.map((rest, idx) => renderRestaurantCard(rest, idx))}
                      </div>
                    </div>
                  )}

                  {/* Hotel Recommendation Cards */}
                  {structured?.hotels && structured.hotels.length > 0 && (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                        <Hotel size={16} color="#6366f1" />
                        <strong style={{ fontSize: '0.9rem' }}>Accommodation Options</strong>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
                        {structured.hotels.map((hotel, idx) => renderHotelCard(hotel, idx))}
                      </div>
                    </div>
                  )}

                  {/* Transport Options */}
                  {structured?.transportOptions && structured.transportOptions.length > 0 && (
                    renderTransportOptions(structured.transportOptions)
                  )}

                  {/* Budget Breakdown */}
                  {structured?.budgetBreakdown && structured.budgetBreakdown.length > 0 && (
                    renderBudgetBreakdown(structured.budgetBreakdown)
                  )}

                  {/* Trip Itinerary Action Banner */}
                  {structured?.trip && (
                    <div className="glass-panel" style={{ padding: 16, background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(16, 185, 129, 0.15))', border: '1px solid rgba(99, 102, 241, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Calendar size={18} color="#6366f1" />
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{structured.trip.title}</h4>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                          {structured.trip.days.length} Days Itinerary • Budget: {formatCurrency(structured.trip.budgetInr, currency)}
                        </p>
                      </div>
                      <button
                        onClick={onOpenTrip}
                        className="btn btn-primary"
                        style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                      >
                        <span>Open Trip Planner</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  )}

                  {/* Interactive Map for Trip Itinerary & Recommended Places */}
                  {structured?.mapMarkers && structured.mapMarkers.length > 0 && (
                    <div className="glass-panel" style={{ padding: 12, marginTop: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, padding: '0 4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <MapPin size={16} color="#38bdf8" />
                          <strong style={{ fontSize: '0.88rem' }}>Trip Destinations Map ({structured.mapMarkers.length} locations)</strong>
                        </div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>📍 Hotels • 🍛 Restaurants • 🏛️ Attractions</span>
                      </div>
                      <OsmInteractiveMap
                        markers={structured.mapMarkers.map((m: any) => ({
                          latitude: m.latitude,
                          longitude: m.longitude,
                          label: `${m.title} (${m.cost || m.category})`,
                          iconType: m.category === 'hotel' ? 'hotel' : m.category === 'restaurant' ? 'restaurant' : 'attraction',
                        }))}
                        center={{ lat: structured.mapMarkers[0].latitude, lon: structured.mapMarkers[0].longitude }}
                        zoom={12}
                        height={240}
                      />
                    </div>
                  )}

                  {/* Safety Notice */}
                  {structured?.safetyNotice && (
                    <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'rgba(234, 179, 8, 0.08)', border: '1px solid rgba(234, 179, 8, 0.25)', fontSize: '0.8rem', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <ShieldCheck size={14} color="#eab308" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={{ color: '#fde047' }}>{structured.safetyNotice}</span>
                    </div>
                  )}

                  {/* Action Suggestion Chips */}
                  {structured?.suggestedActions && structured.suggestedActions.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                      {structured.suggestedActions.map((act, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(act.promptText)}
                          className="chip"
                          style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 6 }}
                        >
                          <Sparkles size={12} color="#ff9933" />
                          <span>{act.label}</span>
                        </button>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            );
          })}

          {loading && (
            <div className="animate-fade-in" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #2563EB, #06B6D4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Bot size={18} color="#fff" />
              </div>
              <div className="glass-panel" style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563EB', animation: 'pulse-sos 1.2s infinite' }} />
                <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  SmartTour AI is searching verified places, routes, and reviews...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Composer Input Area */}
        <div style={{ padding: '16px 28px', borderTop: '1px solid var(--border)' }}>
          
          {/* Quick Suggestion Pills */}
          {messages.length <= 2 && (
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, scrollbarWidth: 'none' }}>
              <button onClick={() => handleSend("Plan a 3-day trip to Jaipur under ₹15,000")} className="suggestion" style={{ minHeight: 42, fontSize: '0.82rem' }}>
                🏰 3-Day Jaipur Heritage Plan
              </button>
              <button onClick={() => handleSend("Best restaurants and street food in Delhi")} className="suggestion" style={{ minHeight: 42, fontSize: '0.82rem' }}>
                🍛 Best Street Food in Delhi
              </button>
              <button onClick={() => handleSend("Compare Goa vs Kerala for a relaxing holiday")} className="suggestion" style={{ minHeight: 42, fontSize: '0.82rem' }}>
                🔄 Compare Goa vs Kerala
              </button>
              <button onClick={() => handleSend("How to reach Agra from Delhi — train, bus, flight options")} className="suggestion" style={{ minHeight: 42, fontSize: '0.82rem' }}>
                🚂 Delhi → Agra Transport
              </button>
              <button onClick={() => handleSend("Safety tips for solo female travelers in India")} className="suggestion" style={{ minHeight: 42, fontSize: '0.82rem' }}>
                🛡️ Solo Travel Safety
              </button>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="composer"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything — places, food, hotels, transport, budget, safety, shopping, culture..."
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="send-button"
            >
              <Send size={18} />
              <span>Send</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
