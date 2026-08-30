import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChatView } from '../SmartTour/ChatView';
import { ContextLanguageAssistant } from '../LanguageAssistant/ContextLanguageAssistant';
import { Bot, Mic, Camera, SlidersHorizontal, Sparkles, MessageSquare } from 'lucide-react';

export const UnifiedAIAssistant = () => {
  const {
    messages,
    setMessages,
    currency,
    language,
    travelProfile,
    setActiveTab,
    planTripForDestination,
    setShowPrefModal,
    globalUserLocation
  } = useApp();

  const [subTab, setSubTab] = useState('chat'); // 'chat' | 'voiceGuide'

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Sub-Header Tabs */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200/60">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              SmartTour AI Travel Intelligence
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Ask travel questions, optimize itineraries, generate multi-day plans, or use live voice guidance.
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 border border-slate-200">
            <button
              onClick={() => setSubTab('chat')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                subTab === 'chat'
                  ? 'bg-blue-600 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>AI Chat Assistant</span>
            </button>

            <button
              onClick={() => setSubTab('voiceGuide')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                subTab === 'voiceGuide'
                  ? 'bg-blue-600 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Voice Guide & OCR</span>
            </button>
          </div>

          <button
            onClick={() => setShowPrefModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer border border-slate-200 flex items-center gap-1.5"
            title="Edit Travel Profile"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Preferences</span>
          </button>
        </div>
      </div>

      {/* Main View Area */}
      <div className="w-full">
        {subTab === 'chat' ? (
          <div className="smarttour-ai-scope bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[650px] flex flex-col">
            <ChatView
              messages={messages}
              setMessages={setMessages}
              currency={currency}
              language={language}
              travelProfile={travelProfile}
              onOpenTrip={() => setActiveTab('roadmap')}
              onSelectDestination={(dest) => planTripForDestination(dest)}
              onOpenPreferences={() => setShowPrefModal(true)}
              currentUserLocation={globalUserLocation}
            />
          </div>
        ) : (
          <ContextLanguageAssistant />
        )}
      </div>

    </div>
  );
};
