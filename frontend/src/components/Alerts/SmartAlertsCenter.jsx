import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertTriangle,
  ShieldCheck,
  Navigation,
  CheckCircle2,
  Clock,
  Sparkles,
  Info,
  Radio,
  Flame,
  CloudRain,
  MapPin
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SmartAlertsCenter = () => {
  const {
    alerts,
    currentDestination,
    acknowledgeAlert,
    applyDivertedRoute,
    setActiveTab,
    setIsSosOpen
  } = useApp();

  const currentAlerts = alerts.filter(
    a => !a.destinationId || a.destinationId === currentDestination.id
  );

  const handleDivertClick = () => {
    applyDivertedRoute();
    setActiveTab('roadmap');
    confetti({ particleCount: 50, spread: 60 });
  };

  return (
    <div className="space-y-6 animate-fadeIn w-full">
      
      {/* Header (Simplified & Friendly) */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-amber-100 text-amber-700 border border-amber-300">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 font-heritage">Safety & Weather Alerts</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-300 text-[10px] font-mono font-bold">
                सुरक्षा अलर्ट
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Live updates on temple rules, locker requirements, sudden rain or high temperatures, and safe walking diversions.
            </p>
          </div>
        </div>

        {/* 1-Tap SOS Emergency Button */}
        <button
          onClick={() => setIsSosOpen(true)}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-2"
        >
          <Radio className="w-4 h-4 animate-ping" />
          <span>Call Tourist Police (1363 / 112)</span>
        </button>
      </div>

      {/* Quick Explainer Bar */}
      <div className="bg-amber-50/80 border border-amber-200 p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-700">
        <div className="flex items-center gap-2 font-bold text-amber-900">
          <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>How It Works:</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600 font-medium">
          <span>1️⃣ <strong>Read safety notices</strong> before entering crowded temples</span>
          <span>•</span>
          <span>2️⃣ <strong>Click "Take Safe Diversion"</strong> to auto-route your map away from packed spots</span>
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentAlerts.map(alert => {
          const isDanger = alert.severity === 'danger' || alert.severity === 'critical';
          return (
            <div
              key={alert.id}
              className={`p-5 rounded-3xl border transition-all space-y-3 ${
                isDanger
                  ? 'bg-rose-50/70 border-rose-200 shadow-sm'
                  : 'bg-amber-50/60 border-amber-200 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">
                    {alert.type === 'crowd_surge' ? '👥' : alert.type === 'weather' ? '☀️' : '🔒'}
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">{alert.title}</h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{alert.timestamp || 'Active right now'}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    isDanger
                      ? 'bg-rose-200 text-rose-900 border border-rose-300'
                      : 'bg-amber-200 text-amber-900 border border-amber-300'
                  }`}
                >
                  {alert.severity}
                </span>
              </div>

              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                {alert.message}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                {alert.type === 'crowd_surge' && (
                  <button
                    onClick={handleDivertClick}
                    className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>🚶‍♂️ Take Safe Diversion (Update Map)</span>
                  </button>
                )}

                <button
                  onClick={() => acknowledgeAlert(alert.id)}
                  className="py-2 px-3 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 transition flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>I Understand</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {currentAlerts.length === 0 && (
        <div className="text-center p-12 bg-white rounded-3xl border border-slate-200 space-y-2">
          <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto" />
          <h3 className="font-bold text-base text-slate-900">All Clear! No Active Safety Warnings</h3>
          <p className="text-xs text-slate-500">
            {currentDestination.name} corridor is currently operating smoothly with normal wait times.
          </p>
        </div>
      )}

    </div>
  );
};
