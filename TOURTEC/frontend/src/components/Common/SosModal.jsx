import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/apiService';
import { AlertOctagon, PhoneCall, Radio, ShieldCheck, X, CheckCircle, MapPin, Activity, ShieldAlert, HeartHandshake } from 'lucide-react';

export const SosModal = () => {
  const { isSosOpen, setIsSosOpen, userLocation, selectedDestinationId, currentDestination, sosState, setSosState, requireAuth } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(180);

  useEffect(() => {
    let timer;
    if (sosState.active && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [sosState.active, countdown]);

  if (!isSosOpen) return null;

  const handleTriggerSOS = async (reason = 'Medical / Lost in Narrow Galis') => {
    requireAuth(async () => {
      setIsSubmitting(true);
      const res = await apiService.sendSos({
        touristId: 'TOURIST-INDIA-01',
        coordinates: userLocation,
        destinationId: selectedDestinationId,
        reason
      });

      setIsSubmitting(false);
      if (res && res.success) {
        setSosState({
          active: true,
          dispatchId: res.dispatchId,
          officer: res.assignedOfficer,
          contact: res.rangerContact,
          eta: res.etaRanger
        });
      }
    }, { message: 'Please sign in to transmit verified live SOS emergency beacons to tourist police.' });
  };

  const handleCancelSOS = () => {
    setSosState({ active: false, dispatchId: null, officer: null });
    setIsSosOpen(false);
  };

  const formatCountdown = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white border-2 border-rose-400 rounded-3xl p-6 shadow-2xl text-slate-800 overflow-hidden">
        {/* Top Heritage Tiranga Emergency Stripe */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500 via-white to-emerald-600 animate-pulse" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-600 animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg text-slate-900 tracking-wide">TOURIST POLICE MITRA SOS</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold border border-rose-300">
                  1363 / 112
                </span>
              </div>
              <p className="text-xs text-rose-700 font-semibold">Direct Satellite & Tourism Command Uplink (India)</p>
            </div>
          </div>
          <button
            onClick={() => setIsSosOpen(false)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition font-bold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!sosState.active ? (
          <div className="mt-5 space-y-4">
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-center">
              <Radio className="w-10 h-10 text-rose-600 mx-auto mb-2 animate-ping-slow" />
              <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                Triggering the SOS beacon will instantly broadcast your live GPS coordinates, medical status, and standing location to the nearest <strong className="text-amber-800">{currentDestination.name}</strong> Tourist Police Mitra & Rapid Action Responders.
              </p>
            </div>

            {/* Location Pill */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between text-xs font-medium">
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>Current Coordinates:</span>
              </div>
              <span className="font-mono text-amber-800 font-bold">
                {userLocation.lat.toFixed(4)}° N, {userLocation.lng.toFixed(4)}° E ({userLocation.landmark})
              </span>
            </div>

            {/* Quick Reason Selection */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => handleTriggerSOS('Medical Emergency / Heatstroke')}
                disabled={isSubmitting}
                className="p-3 bg-rose-50 hover:bg-rose-100 border border-rose-300 rounded-xl text-xs font-bold text-rose-800 text-left transition flex items-center gap-2"
              >
                <Activity className="w-4 h-4 text-rose-600 flex-shrink-0" /> Medical / Heatstroke
              </button>
              <button
                onClick={() => handleTriggerSOS('Lost in Heritage Galis / Crowd Separation')}
                disabled={isSubmitting}
                className="p-3 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl text-xs font-bold text-amber-900 text-left transition flex items-center gap-2"
              >
                <MapPin className="w-4 h-4 text-amber-600 flex-shrink-0" /> Lost in Galis / Maze
              </button>
            </div>

            {/* Main Big SOS Trigger Button */}
            <button
              onClick={() => handleTriggerSOS('Emergency Broadcast to Tourist Police')}
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-500 text-white font-black text-sm sm:text-base tracking-wider rounded-2xl shadow-lg transition active:scale-[0.98] flex items-center justify-center gap-3 border border-rose-400"
            >
              <AlertOctagon className="w-6 h-6 animate-bounce-subtle" />
              {isSubmitting ? 'TRANSMITTING BEACON...' : 'BROADCAST IMMEDIATE POLICE MITRA SOS'}
            </button>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-500 mx-auto flex items-center justify-center text-emerald-700 mb-3 animate-pulse">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-900">TOURIST POLICE MITRA DISPATCHED</h4>
              <p className="text-xs text-emerald-800 mt-1 font-mono font-bold">Dispatch Token: #{sosState.dispatchId}</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Assigned Officer / Mitra:</span>
                <span className="text-slate-900 font-bold">{sosState.officer || 'Inspector Rajesh Sharma (Badge #UP-TOURIST-502)'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Estimated Arrival (ETA):</span>
                <span className="text-amber-700 font-bold text-sm">{formatCountdown(countdown)} min ({sosState.eta || '3-4 mins'})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">National Helpline:</span>
                <span className="text-amber-800 font-mono font-bold">1363 (Tourist) / 112 (All Emergency)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Audio Radar Pulse:</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> High-Frequency Pulse Emitting
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <a
                href="tel:1363"
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-center text-xs font-bold text-white flex items-center justify-center gap-2 shadow-md transition"
              >
                <PhoneCall className="w-4 h-4" /> CALL 1363 TOURIST HELPLINE
              </a>
              <button
                onClick={handleCancelSOS}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition"
              >
                Cancel Beacon
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
