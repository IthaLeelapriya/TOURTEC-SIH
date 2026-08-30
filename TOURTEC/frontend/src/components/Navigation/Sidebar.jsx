import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  MapPin,
  Compass,
  Sparkles,
  Bot,
  Building2,
  Car,
  Users,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Zap,
  User
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home, section: 'main' },
  { id: 'destinations', label: 'Destinations', icon: MapPin, section: 'main' },
  { id: 'explore', label: 'Explore', icon: Compass, section: 'main' },
  { id: 'roadmap', label: 'Trip Planner', icon: Sparkles, section: 'main' },
  { id: 'assistant', label: 'AI Assistant', icon: Bot, isSpecial: true, section: 'main' },
  { id: 'hotels', label: 'Stays & Food', icon: Building2, section: 'services' },
  { id: 'rentals', label: 'Cabs & Transit', icon: Car, section: 'services' },
  { id: 'digitalTwin', label: 'Live Crowds', icon: Users, section: 'services' },
  { id: 'flow', label: 'FastPass', icon: Zap, section: 'services' },
  { id: 'safety', label: 'Safety & SOS', icon: ShieldCheck, section: 'safety' },
  { id: 'profile', label: 'Travel Profile', icon: User, section: 'safety', isModal: true },
];

export const Sidebar = () => {
  const {
    activeTab,
    setActiveTab,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    currentDestination,
    setShowPrefModal,
    requireAuth,
  } = useApp();

  const cityName = currentDestination?.shortName || currentDestination?.name?.split(',')[0] || 'Varanasi';

  const handleNavClick = (tabId, item) => {
    if (tabId === 'profile' || item?.isModal) {
      requireAuth(() => setShowPrefModal(true), { message: 'Please sign in to view and edit your travel profile.' });
      return;
    }
    setActiveTab(tabId);
    if (tabId !== 'home') {
      const moduleSection = document.getElementById('feature-module-section');
      if (moduleSection) {
        moduleSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const mainItems = NAV_ITEMS.filter(i => i.section === 'main');
  const serviceItems = NAV_ITEMS.filter(i => i.section === 'services');
  const safetyItems = NAV_ITEMS.filter(i => i.section === 'safety');

  return (
    <aside
      className={`hidden lg:flex flex-col fixed top-0 left-0 h-screen z-40 sidebar-glass sidebar-scroll transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isSidebarCollapsed ? 'w-[72px]' : 'w-[280px]'
      }`}
      style={{ paddingTop: '64px' }}
    >
      {/* Destination Context Badge */}
      {!isSidebarCollapsed && (
        <div className="px-4 pt-5 pb-2 animate-fadeIn">
          <div className="flex items-center gap-2.5 px-3 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 rounded-2xl">
            <div className="p-1.5 bg-blue-600 rounded-xl">
              <MapPin className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Exploring</p>
              <p className="text-xs font-black text-slate-900 truncate">{cityName}</p>
            </div>
          </div>
        </div>
      )}

      {isSidebarCollapsed && (
        <div className="px-3 pt-5 pb-2 flex justify-center">
          <div className="p-2 bg-blue-600 rounded-xl" title={`Exploring: ${cityName}`}>
            <MapPin className="w-4 h-4 text-white" />
          </div>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto sidebar-scroll px-3 pt-2 space-y-1">

        {/* Main Section */}
        {!isSidebarCollapsed && (
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 pt-2 pb-1">
            Navigate
          </p>
        )}
        {mainItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id, item)}
              className={`sidebar-nav-item w-full ${isActive ? 'active' : ''} ${
                item.isSpecial && !isActive ? 'special' : ''
              } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
              title={isSidebarCollapsed ? item.label : undefined}
            >
              <Icon className="sidebar-icon" />
              {!isSidebarCollapsed && <span>{item.label}</span>}
              {isSidebarCollapsed && (
                <span className="sidebar-tooltip">{item.label}</span>
              )}
            </button>
          );
        })}

        {/* Divider */}
        <div className={`border-t border-slate-200/80 my-2.5 ${isSidebarCollapsed ? 'mx-2' : 'mx-1'}`} />

        {/* Services Section */}
        {!isSidebarCollapsed && (
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 pt-1 pb-1">
            Services
          </p>
        )}
        {serviceItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id, item)}
              className={`sidebar-nav-item w-full ${isActive ? 'active' : ''} ${
                isSidebarCollapsed ? 'justify-center px-0' : ''
              }`}
              title={isSidebarCollapsed ? item.label : undefined}
            >
              <Icon className="sidebar-icon" />
              {!isSidebarCollapsed && <span>{item.label}</span>}
              {isSidebarCollapsed && (
                <span className="sidebar-tooltip">{item.label}</span>
              )}
            </button>
          );
        })}

        {/* Divider */}
        <div className={`border-t border-slate-200/80 my-2.5 ${isSidebarCollapsed ? 'mx-2' : 'mx-1'}`} />

        {/* Safety Section */}
        {safetyItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id, item)}
              className={`sidebar-nav-item w-full ${isActive ? 'active' : ''} ${
                isSidebarCollapsed ? 'justify-center px-0' : ''
              }`}
              title={isSidebarCollapsed ? item.label : undefined}
            >
              <Icon className="sidebar-icon" />
              {!isSidebarCollapsed && <span>{item.label}</span>}
              {isSidebarCollapsed && (
                <span className="sidebar-tooltip">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse / Expand Toggle */}
      <div className="px-3 pb-4 pt-2 border-t border-slate-200/60">
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 text-xs font-bold transition-all cursor-pointer"
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
