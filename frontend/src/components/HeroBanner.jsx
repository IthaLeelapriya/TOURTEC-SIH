import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Calendar,
  Users,
  Search,
  Sparkles,
  ArrowRight,
  Clock,
  Coins,
  ShieldCheck,
  Star,
  Compass
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const HeroBanner = () => {
  const { globalPlace, searchAndSetGlobalPlace, isGlobalSearching, t } = useApp();

  const [searchLocation, setSearchLocation] = useState('');
  const [checkIn, setCheckIn] = useState('2026-08-30');
  const [checkOut, setCheckOut] = useState('2026-09-02');
  const [guestBudget, setGuestBudget] = useState('2 Guests, ₹3,500');

  const handleHeroSearch = (e) => {
    if (e) e.preventDefault();
    if (!searchLocation.trim()) return;
    searchAndSetGlobalPlace(searchLocation);
    confetti({ particleCount: 50, spread: 70 });
  };

  return (
    <div className="space-y-6 animate-fadeIn w-full">
      
      {/* 🌟 HERO SECTION: Cyan Sky + Heading + Search Capsule + Roadtrip Car Graphics */}
      <div className="relative rounded-3xl overflow-hidden holiday-hero-gradient border border-cyan-200/60 shadow-lg pt-12 pb-6 px-4 sm:px-8 lg:px-12">
        
        {/* Animated Flying Birds SVG */}
        <div className="absolute top-8 left-12 opacity-60 pointer-events-none hidden sm:block">
          <svg width="140" height="40" viewBox="0 0 140 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 20C15 15 20 22 25 18C30 14 35 20 40 18" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
            <path d="M50 15C54 11 58 17 62 14C66 11 70 16 74 14" stroke="#1E293B" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M90 25C93 22 96 26 99 24C102 22 105 26 108 24" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Hero Typography */}
        <div className="max-w-3xl mx-auto text-center space-y-3.5 relative z-10">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            {t('heroHeading1')}<br />
            {t('heroHeading2')}
          </h1>
          <p className="text-xs sm:text-base font-medium text-slate-600 max-w-xl mx-auto leading-relaxed">
            {t('heroSubtitle')}
          </p>
        </div>

        {/* 🚀 FLOATING SEARCH CAPSULE WIDGET */}
        <div className="mt-8 max-w-5xl mx-auto relative z-20">
          <form
            onSubmit={handleHeroSearch}
            className="glass-capsule rounded-3xl sm:rounded-full p-2.5 sm:p-3 capsule-shadow grid grid-cols-1 sm:grid-cols-12 items-center gap-2"
          >
            {/* Location Input */}
            <div className="sm:col-span-4 flex items-center gap-3 px-4 py-2 hover:bg-slate-50 rounded-full transition cursor-pointer">
              <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div className="text-left w-full">
                <span className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">{t('labelLocation')}</span>
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder={t('locPlaceholder')}
                  className="w-full text-xs sm:text-sm font-black text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400 placeholder:font-normal"
                />
              </div>
            </div>

            {/* Check In */}
            <div className="sm:col-span-2 flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-2xl sm:rounded-full transition border-t sm:border-t-0 sm:border-l border-slate-200 w-full">
              <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <div className="text-left w-full">
                <span className="text-[9px] uppercase font-black text-slate-400 block tracking-wider">{t('labelCheckIn')}</span>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none w-full cursor-pointer"
                />
              </div>
            </div>

            {/* Check Out */}
            <div className="sm:col-span-2 flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-2xl sm:rounded-full transition border-t sm:border-t-0 sm:border-l border-slate-200 w-full">
              <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <div className="text-left w-full">
                <span className="text-[9px] uppercase font-black text-slate-400 block tracking-wider">{t('labelCheckOut')}</span>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none w-full cursor-pointer"
                />
              </div>
            </div>

            {/* Guest & Budget */}
            <div className="sm:col-span-2 flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-2xl sm:rounded-full transition border-t sm:border-t-0 sm:border-l border-slate-200 w-full">
              <Users className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <div className="text-left w-full">
                <span className="text-[9px] uppercase font-black text-slate-400 block tracking-wider">{t('labelGuests')}</span>
                <select
                  value={guestBudget}
                  onChange={(e) => setGuestBudget(e.target.value)}
                  className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer w-full pr-1"
                >
                  <option>1 Guest</option>
                  <option>2 Guests</option>
                  <option>3 Guests</option>
                  <option>4+ Family</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="sm:col-span-2 w-full">
              <button
                type="submit"
                disabled={isGlobalSearching}
                className="w-full btn-primary-blue rounded-full py-3.5 px-6 font-black text-xs sm:text-sm shadow-md active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>{isGlobalSearching ? t('searching') : t('btnSearch')}</span>
              </button>
            </div>

          </form>
        </div>

        {/* 🚗 SCENIC ROAD TRIP ILLUSTRATION GRAPHIC */}
        <div className="mt-8 relative max-w-4xl mx-auto flex flex-col items-center justify-center">
          
          {/* Road Trip Graphic Box */}
          <div className="relative w-full h-44 sm:h-56 overflow-hidden rounded-3xl bg-gradient-to-b from-cyan-200/40 via-amber-100/30 to-amber-200/60 border border-cyan-300/40 flex items-end justify-center">
            
            {/* Palm Trees Left & Right (SVGs) */}
            <div className="absolute left-4 bottom-0 w-24 sm:w-36 opacity-90">
              <svg viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 150 Q45 80 40 40" stroke="#78350F" strokeWidth="6" strokeLinecap="round" />
                <path d="M40 40 Q20 20 0 35 Q25 45 40 40" fill="#047857" opacity="0.9" />
                <path d="M40 40 Q10 5 30 0 Q40 25 40 40" fill="#059669" />
                <path d="M40 40 Q60 5 80 20 Q55 35 40 40" fill="#10B981" />
                <path d="M40 40 Q80 30 100 50 Q65 55 40 40" fill="#047857" />
              </svg>
            </div>

            <div className="absolute right-4 bottom-0 w-24 sm:w-36 opacity-90 transform scale-x-[-1]">
              <svg viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 150 Q45 80 40 40" stroke="#78350F" strokeWidth="6" strokeLinecap="round" />
                <path d="M40 40 Q20 20 0 35 Q25 45 40 40" fill="#047857" opacity="0.9" />
                <path d="M40 40 Q10 5 30 0 Q40 25 40 40" fill="#059669" />
                <path d="M40 40 Q60 5 80 20 Q55 35 40 40" fill="#10B981" />
                <path d="M40 40 Q80 30 100 50 Q65 55 40 40" fill="#047857" />
              </svg>
            </div>

            {/* Winding Yellow Road */}
            <div className="w-full h-24 bg-gradient-to-t from-amber-400 to-amber-200 relative flex justify-center items-end">
              <div className="w-2 h-full border-r-2 border-dashed border-white/80 opacity-75"></div>
              
              {/* Road Trip Blue Car with Luggage */}
              <div className="absolute -top-12 z-20 flex flex-col items-center animate-bounce-subtle">
                {/* Luggage on Roof */}
                <div className="flex items-end gap-1 -mb-1">
                  <div className="w-8 h-4 bg-orange-500 rounded-t-sm shadow-sm border border-orange-600"></div>
                  <div className="w-6 h-5 bg-purple-600 rounded-t-sm shadow-sm border border-purple-700"></div>
                  <div className="w-7 h-3 bg-emerald-500 rounded-t-sm shadow-sm border border-emerald-600"></div>
                </div>

                {/* Blue SUV Car Body */}
                <div className="w-24 sm:w-28 h-12 bg-blue-600 rounded-2xl shadow-xl relative border-2 border-blue-700 flex flex-col justify-between p-1.5">
                  <div className="w-full h-4 bg-cyan-200/90 rounded-t-xl border border-cyan-400 flex items-center justify-center">
                    <span className="text-[8px] font-black text-blue-900 font-mono">TOURTEC</span>
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <div className="w-3 h-3 rounded-full bg-red-500 border border-red-600"></div>
                    <div className="px-1.5 py-0.2 bg-amber-400 rounded text-[7px] font-black text-slate-950 font-mono">IND 2026</div>
                    <div className="w-3 h-3 rounded-full bg-red-500 border border-red-600"></div>
                  </div>
                </div>

                {/* Wheels */}
                <div className="w-24 sm:w-28 flex justify-between px-2 -mt-1.5 z-10">
                  <div className="w-5 h-5 rounded-full bg-slate-900 border-2 border-slate-700"></div>
                  <div className="w-5 h-5 rounded-full bg-slate-900 border-2 border-slate-700"></div>
                </div>
              </div>
            </div>

          </div>

          {/* Active Synced Location Tag & Quick Pills */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs font-bold text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
              <span>Active Destination:</span>
              <strong className="text-blue-700 font-black">{globalPlace.name}</strong>
            </div>

            {/* Quick Explore Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1">
              {['Varanasi', 'Jaipur', 'Hyderabad', 'Goa', 'Kerala', 'Agra', 'Ladakh'].map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => searchAndSetGlobalPlace(city)}
                  className="px-2.5 py-1 rounded-full bg-white/80 hover:bg-white text-slate-700 hover:text-blue-700 text-[11px] font-bold shadow-xs border border-slate-200/80 transition active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  📍 {city}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
