import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Bot, Sparkles, X, Send, ArrowRight, MessageSquare, Compass, ShieldCheck, MapPin } from 'lucide-react';
import { ChatView } from '../SmartTour/ChatView';

export const FloatingAIAssistant = () => {
  const {
    isFloatingAiOpen,
    setIsFloatingAiOpen,
    currentDestination,
    travelProfile,
    currentTrip,
    currency,
    language,
    messages,
    setMessages,
    setActiveTab,
    globalUserLocation,
    setShowPrefModal,
    planTripForDestination,
    requireAuth
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  const cityName = currentDestination?.shortName || currentDestination?.name?.split(',')[0] || 'Varanasi';

  const quickPrompts = [
    `Plan a ${travelProfile?.durationDays || 3}-day trip to ${cityName}`,
    `Top vegetarian restaurants in ${cityName}`,
    `Is ${cityName} safe to travel right now?`,
    `Budget breakdown for ₹${travelProfile?.totalBudget || 10000} in ${cityName}`
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      {!isFloatingAiOpen && (
        <button
          onClick={() => requireAuth(() => setIsFloatingAiOpen(true), { message: 'Please sign in to chat with the AI Travel Assistant.' })}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl shadow-blue-500/40 flex items-center gap-2.5 transition-all duration-200 hover:scale-105 active:scale-95 group cursor-pointer border border-white/30"
          title="Ask SmartTourAI (Context-Aware)"
        >
          <div className="relative">
            <Bot className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
          </div>
          <span className="hidden sm:inline text-xs font-black tracking-wide">
            Ask SmartTourAI
          </span>
          <span className="hidden md:inline px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold">
            📍 {cityName}
          </span>
        </button>
      )}

      {/* Floating Drawer / Modal */}
      {isFloatingAiOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-[95vw] sm:w-[500px] h-[680px] max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fadeIn">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white px-5 py-4 flex items-center justify-between shadow-md flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white/15 rounded-xl backdrop-blur-md">
                <Bot className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm tracking-tight">SmartTour AI Assistant</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-bold">
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-blue-100 font-medium">
                  Active Context: <strong>{cityName}</strong> • ₹{travelProfile?.totalBudget || 10000} ({travelProfile?.durationDays || 3}D)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setIsFloatingAiOpen(false);
                  setActiveTab('assistant');
                }}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition cursor-pointer"
                title="Expand to Full Screen"
              >
                Full View
              </button>
              <button
                onClick={() => setIsFloatingAiOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                title="Close Drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Context Strip */}
          <div className="bg-slate-50 border-b border-slate-200/80 px-4 py-2 flex items-center justify-between text-xs text-slate-600 flex-shrink-0">
            <div className="flex items-center gap-2 truncate">
              <span className="font-bold text-slate-800">💡 Context:</span>
              <span className="truncate">Trip to {cityName}, {travelProfile?.travelers || 2} traveler(s)</span>
            </div>
            <button
              onClick={() => setShowPrefModal(true)}
              className="text-[11px] font-bold text-blue-600 hover:underline flex-shrink-0 cursor-pointer"
            >
              Tune Profile
            </button>
          </div>

          {/* Chat Body (Scoped SmartTourAI View) */}
          <div className="flex-1 min-h-0 smarttour-ai-scope overflow-hidden">
            <ChatView
              messages={messages}
              setMessages={setMessages}
              currency={currency}
              language={language}
              travelProfile={travelProfile}
              onOpenTrip={() => {
                setIsFloatingAiOpen(false);
                setActiveTab('roadmap');
              }}
              onSelectDestination={(dest) => {
                planTripForDestination(dest);
              }}
              onOpenPreferences={() => setShowPrefModal(true)}
              currentUserLocation={globalUserLocation}
            />
          </div>

        </div>
      )}
    </>
  );
};
