import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SafetyEmergencyView } from '../SmartTour/SafetyEmergencyView';
import { ShieldCheck, PhoneCall, AlertTriangle, Radio, ShieldAlert } from 'lucide-react';

export const UnifiedSafetyHub = () => {
  const { globalUserLocation, setIsSosOpen, requireAuth } = useApp();
  const [safetyTab, setSafetyTab] = useState('directory'); // 'directory' | 'sos'

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/60">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Tourist Safety, Helplines & Emergency SOS
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              National tourist helpline 1363, emergency police 112, live state advisories & 1-tap SOS dispatch.
            </p>
          </div>
        </div>

        {/* SOS Action Button */}
        <button
          onClick={() => requireAuth(() => setIsSosOpen(true), { message: 'Please sign in to transmit verified emergency SOS beacons to tourist police.' })}
          className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-red-500/30 transition active:scale-95 cursor-pointer flex items-center gap-2"
        >
          <PhoneCall className="w-4 h-4 animate-pulse" />
          <span>Launch Emergency SOS</span>
        </button>
      </div>

      {/* Safety Hub View */}
      <div className="smarttour-ai-scope bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm">
        <SafetyEmergencyView currentUserLocation={globalUserLocation} />
      </div>

    </div>
  );
};
