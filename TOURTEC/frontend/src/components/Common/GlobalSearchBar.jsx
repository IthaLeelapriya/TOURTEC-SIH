import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, MapPin, Loader2, Sparkles, Navigation, Globe } from 'lucide-react';

export const GlobalSearchBar = () => {
  const { globalPlace, searchAndSetGlobalPlace, isGlobalSearching } = useApp();
  const [searchInput, setSearchInput] = useState('');

  const popularCities = [
    { label: '🏛️ Hyderabad', name: 'Hyderabad' },
    { label: '🕉️ Vijayawada', name: 'Vijayawada' },
    { label: '🌊 Varanasi', name: 'Varanasi' },
    { label: '🏰 Jaipur', name: 'Jaipur' },
    { label: '🏛️ Agra', name: 'Agra' },
    { label: '🏖️ Goa', name: 'Goa' },
    { label: '🕉️ Tirupati', name: 'Tirupati' },
    { label: '⛰️ Ladakh', name: 'Ladakh' }
  ];

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (!searchInput.trim()) return;
    searchAndSetGlobalPlace(searchInput);
  };

  const handleQuickCityClick = (cityName) => {
    setSearchInput(cityName);
    searchAndSetGlobalPlace(cityName);
  };

  return (
    <div className="w-full bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-emerald-500/15 border-y border-amber-200/90 py-4 px-4 sm:px-6 lg:px-10 shadow-sm transition-all animate-fadeIn">
      <div className="max-w-7xl mx-auto space-y-3">
        
        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-3">
          
          {/* Label / Icon */}
          <div className="flex items-center gap-2 text-slate-900 font-bold text-xs flex-shrink-0">
            <span className="p-2 bg-amber-500 text-slate-950 rounded-xl shadow-md">
              <Search className="w-4 h-4" />
            </span>
            <div className="hidden sm:block">
              <span className="font-heritage text-sm font-black block leading-none">Universal Place Search</span>
              <span className="text-[10px] text-slate-500 font-medium">One search updates all 5 pages</span>
            </div>
          </div>

          {/* Main Input */}
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={`Search any place in India (e.g. Hyderabad, Vijayawada, Varanasi, Jaipur, Agra, Tirupati, Delhi)...`}
              className="w-full py-3 pl-10 pr-4 bg-white border-2 border-slate-300 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-amber-500 shadow-sm"
            />
            <MapPin className="w-4 h-4 text-amber-600 absolute left-3.5 top-3.5" />
          </div>

          {/* Search Button */}
          <button
            type="submit"
            disabled={isGlobalSearching}
            className="w-full md:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-md transition flex items-center justify-center gap-2 flex-shrink-0 active:scale-95"
          >
            {isGlobalSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{isGlobalSearching ? 'Updating All Pages...' : 'Explore Place (All Pages)'}</span>
          </button>
        </form>

        {/* Quick Popular Pills & Active City Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-amber-200/50 text-xs">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
              Quick Places:
            </span>
            {popularCities.map((city, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickCityClick(city.name)}
                className={`px-3 py-1 rounded-xl font-bold text-[11px] whitespace-nowrap transition shadow-sm border ${
                  globalPlace.name.toLowerCase().includes(city.name.toLowerCase())
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                    : 'bg-white hover:bg-amber-50 text-slate-700 border-slate-200'
                }`}
              >
                {city.label}
              </button>
            ))}
          </div>

          {/* Active Synced Place Tag */}
          <div className="flex items-center gap-1.5 text-slate-600 font-medium text-[11px] whitespace-nowrap flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Active on All Pages:</span>
            <strong className="text-slate-900 font-black">{globalPlace.name.split(',')[0]}</strong>
          </div>
        </div>

      </div>
    </div>
  );
};
