import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  MapPin,
  Compass,
  Calendar,
  Bot,
  Building2,
  Car,
  Users,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const MobileBottomNav = () => {
  const { activeTab, setActiveTab } = useApp();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'destinations', label: 'Places', icon: MapPin },
    { id: 'roadmap', label: 'Planner', icon: Calendar },
    { id: 'assistant', label: 'AI Guide', icon: Bot, isSpecial: true },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'hotels', label: 'Stays', icon: Building2 },
    { id: 'safety', label: 'Safety', icon: ShieldCheck }
  ];

  const handleMobileNavClick = (tabId) => {
    setActiveTab(tabId);
    if (tabId !== 'home') {
      const moduleSection = document.getElementById('feature-module-section');
      if (moduleSection) {
        moduleSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200 px-1 py-1 shadow-2xl safe-area-bottom">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => handleMobileNavClick(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-2xl transition-all duration-150 active:scale-95 cursor-pointer ${
                isActive
                  ? 'text-blue-600 font-black'
                  : 'text-slate-500 hover:text-slate-900 font-semibold'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  item.isSpecial && !isActive
                    ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-200'
                    : isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-transparent text-slate-500'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[9px] tracking-tight mt-0.5 whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
