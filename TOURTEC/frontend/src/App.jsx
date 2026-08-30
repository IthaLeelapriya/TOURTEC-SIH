import React from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/Navigation/Sidebar';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { UnifiedDestinationsView } from './components/Destinations/UnifiedDestinationsView';
import { UnifiedExploreView } from './components/Explore/UnifiedExploreView';
import { UnifiedTripPlanner } from './components/Itinerary/UnifiedTripPlanner';
import { UnifiedAIAssistant } from './components/Assistant/UnifiedAIAssistant';
import { HotelBookingHub } from './components/Hotels/HotelBookingHub';
import { TransportRentalsHub } from './components/Transport/TransportRentalsHub';
import { TravelDigitalTwin } from './components/DigitalTwin/TravelDigitalTwin';
import { SmartFlowDistribution } from './components/FlowDistribution/SmartFlowDistribution';
import { UnifiedSafetyHub } from './components/Safety/UnifiedSafetyHub';
import { MobileBottomNav } from './components/Navigation/MobileBottomNav';
import { FloatingAIAssistant } from './components/Assistant/FloatingAIAssistant';
import { SosModal } from './components/Common/SosModal';
import { RewardsWalletModal } from './components/Common/RewardsWalletModal';
import { AuthModal } from './components/Auth/AuthModal';
import { PreferencesModal } from './components/SmartTour/PreferencesModal';
import {
  Heart,
  Shield,
  Sparkles,
  MapPin,
  Mail,
  ArrowRight,
  Globe,
  Share2,
  Compass,
  Bot,
  Calendar,
  Building2,
  Car,
  Users,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const AppContent = () => {
  const {
    activeTab,
    setActiveTab,
    currentDestination,
    showPrefModal,
    setShowPrefModal,
    travelProfile,
    handleProfileSave,
    searchAndSetGlobalPlace,
    isSidebarCollapsed
  } = useApp();

  const cityName = currentDestination?.shortName || currentDestination?.name?.split(',')[0] || 'Varanasi';

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 font-holiday antialiased selection:bg-blue-200 selection:text-blue-950 pb-16 lg:pb-0">
      
      {/* 1. Top Modern Navigation */}
      <Navbar />

      {/* 2. Left Sidebar (Desktop Only) */}
      <Sidebar />

      {/* 3. Main Full-Screen Fluid Content Area & Footer Container */}
      <div className={`flex-1 flex flex-col min-w-0 w-full main-content-transition ${isSidebarCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[280px]'}`}>
        
        <main className="flex-1 w-full px-3 sm:px-6 lg:px-8 py-6 space-y-8 max-w-7xl mx-auto">
          
          {/* Hero Banner (Always shown on Home, collapsed on deep sub-modules) */}
          {activeTab === 'home' && (
          <div className="space-y-8">
            <HeroBanner />

            {/* Quick Feature Modules Grid on Home */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
              <div
                onClick={() => setActiveTab('assistant')}
                className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-5 shadow-lg shadow-blue-500/20 hover:scale-[1.02] transition cursor-pointer flex flex-col justify-between h-40 group"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
                    <Bot className="w-6 h-6 text-amber-300" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                    AI Travel Gen
                  </span>
                </div>
                <div>
                  <h4 className="font-black text-base group-hover:translate-x-1 transition">AI Travel Assistant</h4>
                  <p className="text-[11px] text-blue-100 mt-0.5">Instant multi-day plans & live answers</p>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('destinations')}
                className="bg-white hover:bg-slate-50 border border-slate-200 rounded-3xl p-5 shadow-xs hover:scale-[1.02] transition cursor-pointer flex flex-col justify-between h-40 group"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    35+ States
                  </span>
                </div>
                <div>
                  <h4 className="font-black text-base text-slate-900 group-hover:translate-x-1 transition">Destinations</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Explore heritage, beaches & hilltops</p>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('roadmap')}
                className="bg-white hover:bg-slate-50 border border-slate-200 rounded-3xl p-5 shadow-xs hover:scale-[1.02] transition cursor-pointer flex flex-col justify-between h-40 group"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-purple-50 text-purple-600 rounded-2xl">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Itinerary
                  </span>
                </div>
                <div>
                  <h4 className="font-black text-base text-slate-900 group-hover:translate-x-1 transition">Trip Planner</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Roadmap routes & budget optimizer</p>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('digitalTwin')}
                className="bg-white hover:bg-slate-50 border border-slate-200 rounded-3xl p-5 shadow-xs hover:scale-[1.02] transition cursor-pointer flex flex-col justify-between h-40 group"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-amber-50 text-amber-600 rounded-2xl">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Live Queues
                  </span>
                </div>
                <div>
                  <h4 className="font-black text-base text-slate-900 group-hover:translate-x-1 transition">Crowd Digital Twin</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Real-time heatmaps & fastpasses</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Feature Modules Section */}
        <div id="feature-module-section" className="pt-2 scroll-mt-24">
          
          {/* Header Title for Non-Home Tabs — matches module header pattern */}
          {activeTab !== 'home' && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl border ${
                  activeTab === 'destinations' ? 'bg-emerald-50 text-emerald-600 border-emerald-200/60' :
                  activeTab === 'explore' ? 'bg-cyan-50 text-cyan-600 border-cyan-200/60' :
                  activeTab === 'roadmap' ? 'bg-blue-50 text-blue-600 border-blue-200/60' :
                  activeTab === 'assistant' ? 'bg-blue-50 text-blue-600 border-blue-200/60' :
                  activeTab === 'hotels' ? 'bg-amber-50 text-amber-600 border-amber-200/60' :
                  activeTab === 'rentals' ? 'bg-indigo-50 text-indigo-600 border-indigo-200/60' :
                  activeTab === 'digitalTwin' ? 'bg-orange-50 text-orange-600 border-orange-200/60' :
                  activeTab === 'flow' ? 'bg-purple-50 text-purple-600 border-purple-200/60' :
                  activeTab === 'safety' ? 'bg-emerald-50 text-emerald-600 border-emerald-200/60' :
                  'bg-slate-50 text-slate-600 border-slate-200/60'
                }`}>
                  {activeTab === 'destinations' && <MapPin className="w-6 h-6" />}
                  {activeTab === 'explore' && <Compass className="w-6 h-6" />}
                  {activeTab === 'roadmap' && <Calendar className="w-6 h-6" />}
                  {activeTab === 'assistant' && <Bot className="w-6 h-6" />}
                  {activeTab === 'hotels' && <Building2 className="w-6 h-6" />}
                  {activeTab === 'rentals' && <Car className="w-6 h-6" />}
                  {activeTab === 'digitalTwin' && <Users className="w-6 h-6" />}
                  {activeTab === 'flow' && <Zap className="w-6 h-6" />}
                  {activeTab === 'safety' && <ShieldCheck className="w-6 h-6" />}
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">
                    SmartTourAI Travel Platform
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                    {activeTab === 'destinations' && 'Explore Top Destinations Across India'}
                    {activeTab === 'explore' && `Live City Explorer & Nearby POIs in ${cityName}`}
                    {activeTab === 'roadmap' && `Trip Planner & Itinerary for ${cityName}`}
                    {activeTab === 'assistant' && 'AI Travel Assistant & Multilingual Voice Guide'}
                    {activeTab === 'hotels' && `Exclusive Hotel & Food Stays in ${cityName}`}
                    {activeTab === 'rentals' && `Private Cabs, Tourist Buses & Verified Agencies in ${cityName}`}
                    {activeTab === 'digitalTwin' && `Live Crowd Density & Queue Clearance in ${cityName}`}
                    {activeTab === 'flow' && 'Avoid Queues with 1-Click VIP FastPasses'}
                    {activeTab === 'safety' && 'Tourist Safety Advisories, Helplines & SOS'}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{cityName}</span>
                </span>
              </div>
            </div>
          )}

          {/* Active Module View Rendering */}
          <div className="w-full">
            {activeTab === 'home' && <UnifiedTripPlanner />}
            {activeTab === 'destinations' && <UnifiedDestinationsView />}
            {activeTab === 'explore' && <UnifiedExploreView />}
            {activeTab === 'roadmap' && <UnifiedTripPlanner />}
            {activeTab === 'assistant' && <UnifiedAIAssistant />}
            {activeTab === 'hotels' && <HotelBookingHub />}
            {activeTab === 'rentals' && <TransportRentalsHub />}
            {activeTab === 'digitalTwin' && <TravelDigitalTwin />}
            {activeTab === 'flow' && <SmartFlowDistribution />}
            {activeTab === 'safety' && <UnifiedSafetyHub />}
          </div>
        </div>

      </main>

      {/* 3. Modern Dark Navy Footer */}
      <footer className="bg-[#0F172A] text-slate-400 mt-20 pt-16 pb-12 w-full border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Top Newsletter & Promo Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-10 text-white flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 text-center lg:text-left">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                Ready to plan your trip with SmartTourAI?
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 font-medium">
                Get real-time crowd alerts, exclusive hotel discounts, verified temple fastpasses & AI-optimized itineraries.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="email"
                placeholder="Enter your email..."
                className="px-4 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-blue-200 text-xs sm:text-sm focus:outline-none focus:bg-white/20 w-full sm:w-64"
              />
              <button
                onClick={() => alert('Thank you for subscribing to SmartTourAI Travel Updates!')}
                className="px-6 py-3 bg-white hover:bg-blue-50 text-blue-900 font-black rounded-full text-xs sm:text-sm whitespace-nowrap shadow-md transition active:scale-95 cursor-pointer"
              >
                Get Started
              </button>
            </div>
          </div>

          {/* Links Columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
            
            {/* Brand Col */}
            <div className="space-y-4 col-span-2 md:col-span-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-black text-xs">
                  AI
                </span>
                <span className="font-extrabold text-xl text-white">
                  SmartTour<span className="text-blue-400">AI</span>
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                India's Unified AI Tourism, Itinerary Planning, Crowd Prediction & Geospatial Navigation Platform.
              </p>
              <div className="flex items-center gap-3 pt-2 text-slate-300">
                <div className="p-2 bg-slate-800 hover:bg-blue-600 rounded-full transition cursor-pointer"><Globe className="w-4 h-4" /></div>
                <div className="p-2 bg-slate-800 hover:bg-blue-600 rounded-full transition cursor-pointer"><Share2 className="w-4 h-4" /></div>
                <div className="p-2 bg-slate-800 hover:bg-blue-600 rounded-full transition cursor-pointer"><Compass className="w-4 h-4" /></div>
              </div>
            </div>

            {/* Col 2: Destinations */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Explore Cities</h4>
              <ul className="space-y-2 text-slate-400">
                <li className="hover:text-white cursor-pointer" onClick={() => { searchAndSetGlobalPlace('Varanasi'); setActiveTab('roadmap'); }}>Varanasi (Sacred Ghats)</li>
                <li className="hover:text-white cursor-pointer" onClick={() => { searchAndSetGlobalPlace('Jaipur'); setActiveTab('roadmap'); }}>Jaipur (Pink City)</li>
                <li className="hover:text-white cursor-pointer" onClick={() => { searchAndSetGlobalPlace('Hyderabad'); setActiveTab('roadmap'); }}>Hyderabad (City of Pearls)</li>
                <li className="hover:text-white cursor-pointer" onClick={() => { searchAndSetGlobalPlace('Agra'); setActiveTab('roadmap'); }}>Agra (Taj Mahal)</li>
                <li className="hover:text-white cursor-pointer" onClick={() => { searchAndSetGlobalPlace('Goa'); setActiveTab('roadmap'); }}>Goa (Coastal Paradise)</li>
              </ul>
            </div>

            {/* Col 3: Features */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Features</h4>
              <ul className="space-y-2 text-slate-400">
                <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('assistant')}>SmartTour AI Assistant</li>
                <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('explore')}>TrackMate Live Explorer</li>
                <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('hotels')}>Hotels & Food by Budget</li>
                <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('digitalTwin')}>Live Crowd & Queue Times</li>
                <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('flow')}>VIP FastPass & Rewards</li>
              </ul>
            </div>

            {/* Col 4: Trust & Safety */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Trust & Safety</h4>
              <ul className="space-y-2 text-slate-400">
                <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('safety')}>National Tourist Helpline 1363</li>
                <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('safety')}>Emergency Police 112</li>
                <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('safety')}>Incredible India Verified</li>
                <li className="hover:text-white cursor-pointer">OpenStreetMap & Open-Meteo</li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright Bar */}
          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              © 2026 SmartTourAI • TOURTEC India. All rights reserved. Built for Smart Indian Tourism.
            </div>
            <div className="flex items-center gap-6">
              <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
              <span className="hover:text-slate-400 cursor-pointer">Security</span>
            </div>
          </div>

        </div>
      </footer>

      </div>

      {/* Universal Floating Context-Aware AI Assistant */}
      <FloatingAIAssistant />

      {/* Travel Preferences Modal */}
      <PreferencesModal
        isOpen={showPrefModal}
        onClose={() => setShowPrefModal(false)}
        travelProfile={travelProfile}
        onProfileSave={handleProfileSave}
      />

      {/* User Sign Up / Sign In SSO Modal */}
      <AuthModal />

      {/* Rewards Points & Wallet Modal */}
      <RewardsWalletModal />

      {/* Emergency SOS Modal */}
      <SosModal />

      {/* 4. Mobile Bottom Fixed App Bar */}
      <MobileBottomNav />

    </div>
  );
};

export default function App() {
  return <AppContent />;
}
