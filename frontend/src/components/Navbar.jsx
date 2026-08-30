import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  Users,
  Building2,
  Car,
  Bot,
  Coins,
  Globe,
  Sparkles,
  MapPin,
  ChevronDown,
  Check,
  User,
  LogOut,
  ShieldCheck,
  Home,
  SlidersHorizontal,
  DollarSign
} from 'lucide-react';
import confetti from 'canvas-confetti';

const CURRENCIES = [
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'AED', symbol: 'د.إ', label: 'UAE Dirham' }
];

export const Navbar = () => {
  const {
    activeTab,
    setActiveTab,
    ecoPoints,
    setIsRewardsWalletOpen,
    language,
    setLanguage,
    currency,
    setCurrency,
    t,
    SUPPORTED_LANGUAGES,
    currentUser,
    requireAuth,
    setIsAuthModalOpen,
    setAuthMode,
    logoutUser,
    setShowPrefModal
  } = useApp();

  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const langDropdownRef = useRef(null);
  const currencyDropdownRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
        setIsLangDropdownOpen(false);
      }
      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(e.target)) {
        setIsCurrencyDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'destinations', label: 'Destinations', icon: MapPin },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'roadmap', label: 'Trip Planner', icon: Sparkles },
    { id: 'assistant', label: 'AI Assistant', icon: Bot, isSpecial: true },
    { id: 'hotels', label: 'Stays & Food', icon: Building2 },
    { id: 'rentals', label: 'Cabs & Transit', icon: Car },
    { id: 'digitalTwin', label: 'Live Crowds', icon: Users },
    { id: 'flow', label: 'FastPass', icon: Sparkles },
    { id: 'safety', label: 'Safety & SOS', icon: ShieldCheck }
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (tabId !== 'home') {
      const moduleSection = document.getElementById('feature-module-section');
      if (moduleSection) {
        moduleSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleSelectLanguage = (langCode) => {
    setLanguage(langCode);
    setIsLangDropdownOpen(false);
    confetti({ particleCount: 40, spread: 60 });
  };

  const handleSelectCurrency = (currCode) => {
    setCurrency(currCode);
    setIsCurrencyDropdownOpen(false);
  };

  const activeLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];
  const activeCurrObj = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-2xl border-b border-slate-200 shadow-xs transition-all w-full">
      <div className="w-full px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo - Unified SmartTourAI & Tourtec */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => handleTabClick('home')}
          >
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs tracking-wide shadow-md flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>AI</span>
              </span>
              <span className="font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
                SmartTour<span className="text-blue-600">AI</span>
              </span>
              <span className="hidden xl:inline text-[11px] font-bold text-slate-400 border-l border-slate-200 pl-2">
                Tourtec India
              </span>
            </div>
          </div>


          {/* Desktop navigation is now in the Sidebar component */}


          {/* Right Action Controls: Currency, Language, Profile & Wallet */}
          <div className="flex items-center gap-1.5 sm:gap-2 relative">

            {/* Currency Selector */}
            <div className="relative" ref={currencyDropdownRef}>
              <button
                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-bold hover:bg-slate-200 transition cursor-pointer border border-slate-200"
                title="Change Currency"
              >
                <span className="font-mono font-black text-blue-600">{activeCurrObj.symbol}</span>
                <span className="hidden sm:inline text-[11px]">{activeCurrObj.code}</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isCurrencyDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCurrencyDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-fadeIn">
                  <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    Currency
                  </div>
                  {CURRENCIES.map((curr) => {
                    const isSelected = currency === curr.code;
                    return (
                      <button
                        key={curr.code}
                        onClick={() => handleSelectCurrency(curr.code)}
                        className={`w-full px-3 py-1.5 text-left text-xs font-bold flex items-center justify-between transition hover:bg-blue-50 ${
                          isSelected ? 'text-blue-600 bg-blue-50/60 font-black' : 'text-slate-700'
                        }`}
                      >
                        <span>{curr.symbol} {curr.code} ({curr.label})</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Language Selector Dropdown */}
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-bold hover:bg-slate-200 transition cursor-pointer border border-slate-200"
                title="Change Website Language"
              >
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline text-[11px]">{activeLangObj.flag} {activeLangObj.native}</span>
                <span className="sm:hidden">{activeLangObj.flag}</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-fadeIn max-h-72 overflow-y-auto">
                  <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    Select Language
                  </div>
                  {SUPPORTED_LANGUAGES.map((lang) => {
                    const isSelected = language === lang.code;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => handleSelectLanguage(lang.code)}
                        className={`w-full px-3.5 py-2 text-left text-xs font-bold flex items-center justify-between transition hover:bg-blue-50 ${
                          isSelected ? 'text-blue-600 bg-blue-50/60 font-black' : 'text-slate-700'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-base">{lang.flag}</span>
                          <span>{lang.native} ({lang.label})</span>
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Travel Preferences Button */}
            <button
              onClick={() => requireAuth(() => setShowPrefModal(true), { message: 'Please sign in to manage your AI travel profile & preferences.' })}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition cursor-pointer"
              title="Edit AI Travel Profile & Preferences"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Profile</span>
            </button>

            {/* Reward Points Wallet Button */}
            <button
              onClick={() => requireAuth(() => setIsRewardsWalletOpen(true), { message: 'Please sign in to view and redeem your Eco-Rupee rewards.' })}
              className="flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-2.5 sm:px-3.5 py-1.5 rounded-full shadow-sm text-xs font-black transition active:scale-95 cursor-pointer"
              title="View Reward Points Wallet & Discounts"
            >
              <Coins className="w-3.5 h-3.5" />
              <span>₹{ecoPoints}</span>
            </button>

            {/* User Profile / Auth */}
            {currentUser ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 pl-1 pr-2.5 py-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-full transition cursor-pointer"
                >
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-full object-cover ring-2 ring-blue-500"
                  />
                  <span className="text-xs font-black text-slate-800 max-w-[80px] truncate hidden sm:inline">
                    {currentUser.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 animate-fadeIn space-y-3">
                    <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
                      <img
                        src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                        alt={currentUser.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500"
                      />
                      <div className="overflow-hidden">
                        <h4 className="text-xs font-black text-slate-900 truncate">{currentUser.name}</h4>
                        <p className="text-[10px] text-slate-500 truncate">{currentUser.email}</p>
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600 mt-0.5">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Verified Traveler</span>
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setShowPrefModal(true);
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full py-2 px-3 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition flex items-center gap-2 cursor-pointer"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                      <span>Travel Preferences</span>
                    </button>

                    <button
                      onClick={() => {
                        logoutUser();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full py-2 px-3 text-left text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setAuthMode('signin');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-2.5 py-1.5 text-xs font-black text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-full transition cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setAuthMode('signup');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-black shadow-md shadow-blue-500/20 transition active:scale-95 cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}

          </div>

        </div>

        {/* Mobile Sub-Navigation Tabs */}
        <div className="flex lg:hidden items-center gap-1.5 overflow-x-auto py-2.5 scrollbar-none border-t border-slate-100 text-xs font-bold">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap transition flex items-center gap-1 text-[11px] ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm font-black'
                    : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
