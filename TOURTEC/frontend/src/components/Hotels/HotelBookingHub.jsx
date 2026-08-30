import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { getHotelsForLocation } from '../../services/hotelBookingService';
import { getDiningForLocation } from '../../services/diningService';
import {
  Building2,
  Hotel,
  UtensilsCrossed,
  MapPin,
  Star,
  Sparkles,
  Calendar,
  Users,
  Search,
  Filter,
  Check,
  CheckCircle2,
  ExternalLink,
  Tag,
  Coins,
  ShieldCheck,
  Coffee,
  Wifi,
  Waves,
  QrCode,
  ArrowRight,
  ChevronDown,
  Loader2,
  Phone,
  BedDouble,
  DollarSign,
  Calculator,
  Compass,
  Navigation,
  Clock,
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const HotelBookingHub = () => {
  const { currentDestination, ecoPoints, setEcoPoints, requireAuth, currentUser } = useApp();

  const cityName = currentDestination.name.split(',')[0].trim();
  const [activeTab, setActiveTab] = useState('stays'); // 'stays' | 'dining' | 'budget_calculator'
  
  // Budget Filter State
  const [budgetTier, setBudgetTier] = useState('all'); // 'all' | 'budget' | 'comfort' | 'luxury'
  const [dailyBudgetSlider, setDailyBudgetSlider] = useState(3500); // INR slider

  // Stays & Dining Data
  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

  // Stay Filter & Sorting
  const [checkInDate, setCheckInDate] = useState('2026-08-30');
  const [checkOutDate, setCheckOutDate] = useState('2026-09-01');
  const [guestsCount, setGuestsCount] = useState('2 Guests, 1 Room');
  
  // Instant Booking Modal State
  const [selectedHotelForBooking, setSelectedHotelForBooking] = useState(null);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [useRewardPointsDiscount, setUseRewardPointsDiscount] = useState(true);
  const [confirmedBookingPass, setConfirmedBookingPass] = useState(null);
  const [isProcessingBooking, setIsProcessingBooking] = useState(false);

  // Food Voucher Modal State
  const [claimedFoodVoucher, setClaimedFoodVoucher] = useState(null);

  useEffect(() => {
    setHotels(getHotelsForLocation(currentDestination.name));
    setRestaurants(getDiningForLocation(currentDestination.name));
  }, [currentDestination]);

  // Filter Hotels based on Budget Slider & Tier
  const filteredHotels = hotels.filter(h => {
    if (budgetTier === 'budget') return h.priceINR <= 1500;
    if (budgetTier === 'comfort') return h.priceINR > 1500 && h.priceINR <= 5000;
    if (budgetTier === 'luxury') return h.priceINR > 5000;
    return h.priceINR <= dailyBudgetSlider * 1.5;
  });

  // Filter Restaurants based on Budget Tier
  const filteredRestaurants = restaurants.filter(r => {
    if (budgetTier === 'budget') return r.priceForTwoINR <= 200;
    if (budgetTier === 'comfort') return r.priceForTwoINR > 200 && r.priceForTwoINR <= 1000;
    if (budgetTier === 'luxury') return r.priceForTwoINR > 1000;
    return true;
  });

  const handleOpenBookingModal = (hotel) => {
    requireAuth(() => {
      setSelectedHotelForBooking(hotel);
      setConfirmedBookingPass(null);
      if (currentUser?.name) {
        setGuestName(currentUser.name);
      }
      if (currentUser?.phone) {
        setGuestPhone(currentUser.phone);
      }
    }, { message: 'Please sign in to book your hotel stay and claim instant pass discounts.' });
  };

  const handleConfirmReservation = (e) => {
    if (e) e.preventDefault();
    if (!guestName.trim()) {
      alert('Please enter guest name');
      return;
    }

    requireAuth(() => {
      setIsProcessingBooking(true);
      setTimeout(() => {
        setIsProcessingBooking(false);
        const discountINR = useRewardPointsDiscount && ecoPoints >= 50 ? 150 : 0;
        const finalPrice = Math.max(100, selectedHotelForBooking.priceINR - discountINR);
        const bookingId = `IND-HTL-${Math.floor(100000 + Math.random() * 900000)}`;

        if (discountINR > 0) {
          setEcoPoints(p => Math.max(0, p - 50));
        } else {
          setEcoPoints(p => p + 40);
        }

        setConfirmedBookingPass({
          bookingId,
          hotelName: selectedHotelForBooking.name,
          city: cityName,
          guestName,
          checkInDate,
          checkOutDate,
          guestsCount,
          finalPrice,
          discountApplied: discountINR,
          amenities: selectedHotelForBooking.amenities
        });

        confetti({ particleCount: 70, spread: 80 });
      }, 900);
    }, { message: 'Please sign in to confirm your hotel reservation.' });
  };

  const handleClaimFoodCoupon = (foodSpot) => {
    requireAuth(() => {
      setEcoPoints(p => Math.max(0, p - 30));
      const couponCode = `FOOD-${cityName.toUpperCase().slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`;
      setClaimedFoodVoucher({
        spotName: foodSpot.name,
        couponCode,
        discount: 'Flat 15% OFF + Free Kulhad Chai',
        validUntil: 'Valid for next 24 hours'
      });
      confetti({ particleCount: 50, spread: 60 });
    }, { message: 'Please sign in to claim dining vouchers and food discounts.' });
  };

  // Sample Budget Estimator
  const avgStayCost = filteredHotels[0]?.priceINR || 1200;
  const avgFoodCost = (filteredRestaurants[0]?.priceForTwoINR || 250) * 1.5;
  const avgTransitCost = 120;
  const totalEstimatedDailyCost = Math.round(avgStayCost + avgFoodCost + avgTransitCost);

  return (
    <div className="space-y-6 animate-fadeIn w-full">
      
      {/* Top Location Header */}
      <div className="bg-white border border-slate-200 p-5 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 text-white shadow-md">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 font-heritage">
                Budget Stays & Authentic Food in {cityName}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold">
                ✓ Curated for Your Budget
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Select your budget to discover verified hotels, temple dharamshalas, iconic breakfast stalls & royal dining in <strong>{currentDestination.name}</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Destination:</span>
          <span className="px-3.5 py-1.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-black font-heritage">
            🇮🇳 {cityName}
          </span>
        </div>
      </div>

      {/* 🎯 INTERACTIVE "TELL US YOUR BUDGET" CARD */}
      <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-indigo-500/15 border-2 border-amber-400/80 p-5 sm:p-6 rounded-3xl shadow-sm space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-500 text-slate-950 rounded-xl font-bold shadow-sm">
              <Calculator className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-black text-slate-900 font-heritage">
                Select Your Daily Travel Budget for {cityName}:
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">We will instantly filter hotels, hostels, and authentic street food matching your wallet.</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-2xl border border-amber-300 shadow-sm">
            <span className="text-[11px] font-bold text-slate-500">Your Budget:</span>
            <strong className="text-sm font-mono font-black text-amber-700">₹{dailyBudgetSlider.toLocaleString()} / day</strong>
          </div>
        </div>

        {/* 3 One-Click Budget Tiers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* 1. Budget / Backpacker Tier */}
          <button
            type="button"
            onClick={() => {
              setBudgetTier('budget');
              setDailyBudgetSlider(1000);
            }}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              budgetTier === 'budget'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md ring-2 ring-amber-400 border-amber-500'
                : 'bg-white text-slate-700 hover:bg-amber-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black">🎒 Budget / Pilgrim</span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                budgetTier === 'budget' ? 'bg-slate-950 text-white' : 'bg-emerald-100 text-emerald-800'
              }`}>
                Under ₹1,000/day
              </span>
            </div>
            <p className={`text-[11px] mt-1 ${budgetTier === 'budget' ? 'text-slate-900 font-semibold' : 'text-slate-500'}`}>
              Dharamshalas, Zostel Hostels, Kulhad Chai & Street Tiffins.
            </p>
          </button>

          {/* 2. Comfort & Family Tier */}
          <button
            type="button"
            onClick={() => {
              setBudgetTier('comfort');
              setDailyBudgetSlider(3500);
            }}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              budgetTier === 'comfort'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md ring-2 ring-amber-400 border-amber-500'
                : 'bg-white text-slate-700 hover:bg-amber-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black">🛏️ Comfort & Family</span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                budgetTier === 'comfort' ? 'bg-slate-950 text-white' : 'bg-amber-100 text-amber-900'
              }`}>
                ₹1,500 – ₹4,500/day
              </span>
            </div>
            <p className={`text-[11px] mt-1 ${budgetTier === 'comfort' ? 'text-slate-900 font-semibold' : 'text-slate-500'}`}>
              AC 3-Star Hotels, Banana Leaf Thalis, Biryani & River Cafes.
            </p>
          </button>

          {/* 3. Luxury Palace Tier */}
          <button
            type="button"
            onClick={() => {
              setBudgetTier('luxury');
              setDailyBudgetSlider(12000);
            }}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              budgetTier === 'luxury'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md ring-2 ring-amber-400 border-amber-500'
                : 'bg-white text-slate-700 hover:bg-amber-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black">👑 Royal Heritage</span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                budgetTier === 'luxury' ? 'bg-slate-950 text-white' : 'bg-purple-100 text-purple-900'
              }`}>
                ₹5,000+ / day
              </span>
            </div>
            <p className={`text-[11px] mt-1 ${budgetTier === 'luxury' ? 'text-slate-900 font-semibold' : 'text-slate-500'}`}>
              Royal Palaces (Taj Falaknuma/BrijRama), Spas & Fine Dining.
            </p>
          </button>

        </div>

        {/* Interactive Custom Budget Slider */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-700">
            <span>Adjust Custom Daily Budget:</span>
            <span className="font-mono text-amber-700 font-black">₹{dailyBudgetSlider.toLocaleString()} / day</span>
          </div>
          <input
            type="range"
            min="500"
            max="25000"
            step="250"
            value={dailyBudgetSlider}
            onChange={(e) => {
              setDailyBudgetSlider(Number(e.target.value));
              setBudgetTier('all');
            }}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-bold font-mono">
            <span>₹500 (Dharamshalas)</span>
            <span>₹5,000 (3-Star & Thalis)</span>
            <span>₹25,000+ (Royal Palaces)</span>
          </div>
        </div>

      </div>

      {/* 3 VIEW SWITCHERS: Stays | Places to Eat | Daily Cost Breakdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full sm:w-auto text-xs">
          <button
            onClick={() => setActiveTab('stays')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-black transition flex items-center justify-center gap-1.5 ${
              activeTab === 'stays' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Hotel className="w-3.5 h-3.5" />
            <span>🏨 Stays & Hotels ({filteredHotels.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('dining')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-black transition flex items-center justify-center gap-1.5 ${
              activeTab === 'dining' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>🍽️ Places to Eat & Food ({filteredRestaurants.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('budget_calculator')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-black transition flex items-center justify-center gap-1.5 ${
              activeTab === 'budget_calculator' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>📊 Daily Budget Breakdown</span>
          </button>
        </div>

        <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl text-center">
          Matching {cityName} for ₹{dailyBudgetSlider.toLocaleString()}
        </span>
      </div>

      {/* Notification Toast for Food Coupon */}
      {claimedFoodVoucher && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <div>
              <span>🎉 15% Discount Voucher Claimed for <strong>{claimedFoodVoucher.spotName}</strong>!</span>
              <span className="block text-[11px] font-mono text-emerald-700">Coupon Code: <strong>{claimedFoodVoucher.couponCode}</strong></span>
            </div>
          </div>
          <button onClick={() => setClaimedFoodVoucher(null)} className="text-emerald-800 font-bold text-sm px-2">
            ✕
          </button>
        </div>
      )}

      {/* 1. STAYS & HOTELS TAB */}
      {activeTab === 'stays' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <h4 className="font-black text-slate-900 font-heritage">
              Hotels & Stays within your budget in {cityName}:
            </h4>
            <span className="font-bold text-slate-500">Showing {filteredHotels.length} options</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredHotels.map((hotel) => (
              <div
                key={hotel.id}
                className="bg-white border border-slate-200 hover:border-amber-400 rounded-3xl overflow-hidden transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between"
              >
                {/* Image */}
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-950/80 backdrop-blur-md text-amber-300 border border-amber-400/40">
                    {hotel.badge}
                  </span>
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-xl text-xs font-black bg-white/95 text-slate-950 flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{hotel.rating}</span>
                  </span>
                </div>

                {/* Body */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-600" />
                      <span>{hotel.distanceToLandmark}</span>
                    </span>
                    <h3 className="text-sm font-black text-slate-900">{hotel.name}</h3>
                    <p className="text-[11px] text-slate-500 font-medium line-clamp-2">{hotel.tagline}</p>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {hotel.amenities.slice(0, 2).map((a, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-[9px] font-bold text-slate-600">
                        ✓ {a}
                      </span>
                    ))}
                  </div>

                  {/* Price & Action */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-base font-black text-slate-900 font-mono">
                        ₹{hotel.priceINR.toLocaleString()}
                        <span className="text-[10px] text-slate-400 font-normal font-sans">/night</span>
                      </div>
                      <span className="text-[9px] text-emerald-700 font-bold">₹150 off with PTS</span>
                    </div>

                    <button
                      onClick={() => handleOpenBookingModal(hotel)}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-sm transition active:scale-95 flex items-center gap-1"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Book Pass</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. PLACES TO EAT & FOOD TAB */}
      {activeTab === 'dining' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <h4 className="font-black text-slate-900 font-heritage">
              Authentic Places to Eat & Must-Try Dishes in {cityName}:
            </h4>
            <span className="font-bold text-slate-500">Showing {filteredRestaurants.length} food spots</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRestaurants.map((food) => (
              <div
                key={food.id}
                className="bg-white border border-slate-200 hover:border-amber-400 rounded-3xl overflow-hidden transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between"
              >
                {/* Image */}
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-950/80 backdrop-blur-md text-amber-300 border border-amber-400/40">
                    {food.badge}
                  </span>
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-xl text-xs font-black bg-white/95 text-slate-950 flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{food.rating}</span>
                  </span>
                </div>

                {/* Body */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-600" />
                      <span>{food.location}</span>
                    </span>
                    <h3 className="text-sm font-black text-slate-900">{food.name}</h3>
                    <span className="text-[10px] uppercase font-bold text-amber-800 block">{food.cuisine}</span>
                  </div>

                  {/* Must-Try Dishes List */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1 text-xs">
                    <span className="text-[9px] uppercase font-black text-slate-400 block">Must-Try Specialties:</span>
                    <ul className="text-[11px] text-slate-700 font-bold space-y-0.5">
                      {food.mustTryDishes.map((dish, i) => (
                        <li key={i} className="flex items-center gap-1">
                          <span className="text-amber-600">•</span>
                          <span>{dish}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price & Coupon Action */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-base font-black text-slate-900 font-mono">
                        {food.priceForTwoINR === 0 ? 'FREE Annadanam' : `₹${food.priceForTwoINR}`}
                        <span className="text-[10px] text-slate-400 font-normal font-sans"> for 2 people</span>
                      </div>
                      <span className="text-[9px] text-slate-500 font-medium">Timings: {food.timings?.split('–')[0] || 'Daytime'}</span>
                    </div>

                    <button
                      onClick={() => handleClaimFoodCoupon(food)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-sm transition active:scale-95 flex items-center gap-1"
                    >
                      <Tag className="w-3 h-3" />
                      <span>15% Coupon</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. DAILY BUDGET CALCULATOR BREAKDOWN */}
      {activeTab === 'budget_calculator' && (
        <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-5 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="p-2 bg-amber-100 text-amber-900 rounded-xl font-bold">
              <Calculator className="w-5 h-5 text-amber-700" />
            </span>
            <div>
              <h4 className="text-base font-black text-slate-900 font-heritage">
                Daily Travel Expense Estimate for {cityName}:
              </h4>
              <p className="text-xs text-slate-500 font-medium">Estimated cost per person based on your selected budget preferences.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Stay Expense */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">1. Stay / Accommodation</span>
              <div className="text-xl font-black text-slate-900 font-mono">₹{avgStayCost.toLocaleString()}</div>
              <p className="text-xs text-slate-500 font-medium">Clean AC stay or hostel pod near sights</p>
            </div>

            {/* Food Expense */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">2. Food (Breakfast, Lunch & Dinner)</span>
              <div className="text-xl font-black text-amber-700 font-mono">₹{Math.round(avgFoodCost).toLocaleString()}</div>
              <p className="text-xs text-slate-500 font-medium">Authentic morning tiffins, Thalis & chai</p>
            </div>

            {/* Local Transit Expense */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">3. Local Transport</span>
              <div className="text-xl font-black text-emerald-700 font-mono">₹{avgTransitCost}</div>
              <p className="text-xs text-slate-500 font-medium">Auto-rickshaws, metro & solar ferry</p>
            </div>

          </div>

          {/* Total Summary */}
          <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
                Total Estimated Cost per Person:
              </span>
              <div className="text-3xl font-black font-mono mt-0.5">
                ₹{totalEstimatedDailyCost.toLocaleString()} <span className="text-sm font-sans font-normal text-slate-300">/ day</span>
              </div>
            </div>

            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-xs font-black ${
                totalEstimatedDailyCost <= dailyBudgetSlider ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400' : 'bg-amber-500/20 text-amber-300 border border-amber-400'
              }`}>
                {totalEstimatedDailyCost <= dailyBudgetSlider ? '✓ 100% Within Your Budget!' : '⚠️ Slightly Exceeds Target Budget'}
              </span>
              <span className="text-[10px] text-slate-400 font-medium block mt-1">Saved ₹150 using Tourtec FastPasses & Eco-Points</span>
            </div>
          </div>
        </div>
      )}

      {/* INSTANT HOTEL RESERVATION PASS MODAL */}
      {selectedHotelForBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white border border-amber-200/90 max-w-lg w-full rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 p-5 text-slate-950 relative">
              <button
                onClick={() => setSelectedHotelForBooking(null)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-950/20 hover:bg-slate-950/40 text-slate-950 flex items-center justify-center font-black transition"
              >
                ✕
              </button>

              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-white rounded-xl text-lg shadow-sm">🏨</span>
                <div>
                  <span className="text-[10px] uppercase font-black tracking-widest text-slate-950/80 block">
                    Instant Hotel Reservation Pass
                  </span>
                  <h3 className="text-base font-black text-slate-950 leading-tight">
                    {selectedHotelForBooking.name}
                  </h3>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4">
              
              {!confirmedBookingPass ? (
                <form onSubmit={handleConfirmReservation} className="space-y-3.5">
                  
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Destination:</span>
                      <strong className="text-slate-900">{cityName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Dates:</span>
                      <strong className="text-slate-900">{checkInDate} to {checkOutDate}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Rooms & Guests:</span>
                      <strong className="text-slate-900">{guestsCount}</strong>
                    </div>
                  </div>

                  {/* Guest Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Primary Guest Full Name *</label>
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Enter full name as per Aadhaar / ID..."
                      className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500 shadow-sm"
                    />
                  </div>

                  {/* Phone Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Contact Phone Number *</label>
                    <input
                      type="tel"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500 shadow-sm"
                    />
                  </div>

                  {/* Reward Points Discount Toggle */}
                  <div className="p-3 bg-amber-50/80 border border-amber-300 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4 text-amber-600" />
                      <div>
                        <div className="text-xs font-black text-amber-950">Use Reward Points Discount</div>
                        <div className="text-[10px] text-amber-800 font-medium">Save ₹150 using 50 Reward Points</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={useRewardPointsDiscount}
                      onChange={(e) => setUseRewardPointsDiscount(e.target.checked)}
                      className="w-4 h-4 text-amber-600 rounded cursor-pointer"
                    />
                  </div>

                  {/* Price Summary */}
                  <div className="p-3.5 bg-slate-900 text-white rounded-2xl space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Room Tariff (1 Night):</span>
                      <span>₹{selectedHotelForBooking.priceINR}</span>
                    </div>
                    {useRewardPointsDiscount && (
                      <div className="flex justify-between text-emerald-400 font-bold">
                        <span>Reward Points Discount:</span>
                        <span>- ₹150</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-black border-t border-slate-700 pt-1.5 text-amber-400">
                      <span>Total Payable at Check-in:</span>
                      <span>₹{(selectedHotelForBooking.priceINR - (useRewardPointsDiscount ? 150 : 0)).toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessingBooking}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition shadow-md flex items-center justify-center gap-2"
                  >
                    {isProcessingBooking ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span>{isProcessingBooking ? 'Generating Hotel Voucher...' : 'Confirm Instant Reservation Pass'}</span>
                  </button>
                </form>
              ) : (
                /* CONFIRMED BOOKING PASS WITH QR */
                <div className="space-y-4 text-center animate-fadeIn">
                  <div className="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-2xl space-y-3">
                    <div className="inline-block p-2 bg-emerald-100 text-emerald-800 rounded-full">
                      <Check className="w-6 h-6" />
                    </div>

                    <h4 className="font-black text-base text-emerald-950 font-heritage">
                      Hotel Booking Confirmed!
                    </h4>

                    {/* QR Code Container */}
                    <div className="p-3 bg-white border-2 border-amber-400 rounded-2xl inline-block shadow-inner">
                      <div className="w-32 h-32 mx-auto bg-slate-900 p-2 rounded-xl flex items-center justify-center text-white font-mono text-center text-[10px]">
                        [ QR HOTEL PASS ]
                        <br />
                        {confirmedBookingPass.bookingId}
                        <br />
                        {confirmedBookingPass.city}
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-left bg-white p-3.5 rounded-xl border border-emerald-200">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Booking ID:</span>
                        <strong className="font-mono text-slate-900">{confirmedBookingPass.bookingId}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Guest:</span>
                        <strong className="text-slate-900">{confirmedBookingPass.guestName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Hotel:</span>
                        <strong className="text-slate-900 truncate max-w-[200px]">{confirmedBookingPass.hotelName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Check-in:</span>
                        <strong className="text-slate-900">{confirmedBookingPass.checkInDate}</strong>
                      </div>
                      <div className="flex justify-between border-t border-slate-100 pt-1 text-emerald-700 font-bold">
                        <span>Total Tariff:</span>
                        <span>₹{confirmedBookingPass.finalPrice.toLocaleString()} (Pay at Reception)</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedHotelForBooking(null)}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition"
                  >
                    Done / Close Pass
                  </button>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
