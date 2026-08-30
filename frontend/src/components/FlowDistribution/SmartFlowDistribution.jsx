import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/apiService';
import {
  Users,
  ArrowRight,
  Sparkles,
  Award,
  CheckCircle2,
  Clock,
  MapPin,
  QrCode,
  Ticket,
  ChevronRight,
  TrendingDown,
  Gift
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SmartFlowDistribution = () => {
  const { currentDestination, setEcoPoints, requireAuth } = useApp();
  const [claimedVouchers, setClaimedVouchers] = useState({});
  const [activeModalVoucher, setActiveModalVoucher] = useState(null);

  // Group zones into Busy vs Calm
  const crowdedZones = currentDestination.zones.filter(
    z => z.status === 'overcrowded' || z.status === 'heavy'
  );
  const calmZones = currentDestination.zones.filter(
    z => z.status === 'optimal' || z.status === 'recommended'
  );

  const handleClaimFastPass = (voucher) => {
    requireAuth(() => {
      setClaimedVouchers(prev => ({ ...prev, [voucher.id]: true }));
      setEcoPoints(p => p + (voucher.rewardPoints || 50));
      setActiveModalVoucher(voucher);

      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 }
      });
    }, { message: 'Please sign in to claim VIP FastPass temple vouchers and bonus points.' });
  };

  return (
    <div className="space-y-6 animate-fadeIn w-full">
      
      {/* Header (Simplified & Friendly) */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-amber-100 text-amber-700 border border-amber-300">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 font-heritage">Avoid Crowds & Get Free FastPass</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-mono font-bold">
                भीड़ से बचें
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Skip 45-minute queues at packed temples. Visit peaceful nearby heritage spots and get free VIP passes & reward points!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Live Balancer:</span>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            Dispersing 3,400 Yatris
          </span>
        </div>
      </div>

      {/* Quick Explainer Bar */}
      <div className="bg-amber-50/80 border border-amber-200 p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-700">
        <div className="flex items-center gap-2 font-bold text-amber-900">
          <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>Why Use This:</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600 font-medium">
          <span>1️⃣ <strong>Red cards</strong> have long waiting lines right now</span>
          <span>•</span>
          <span>2️⃣ <strong>Green cards</strong> have 0 wait time</span>
          <span>•</span>
          <span>3️⃣ <strong>Click "Claim Free VIP Pass"</strong> to get free entry and skip all lines</span>
        </div>
      </div>

      {/* Side-by-Side Comparison: Busy vs Calm */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Column: Busy Spots */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <span>Crowded Spots (Long Waiting Lines)</span>
            </h3>
            <span className="text-xs font-mono font-bold text-rose-700">{crowdedZones.length} Zones</span>
          </div>

          <div className="space-y-3">
            {crowdedZones.map(zone => (
              <div key={zone.id} className="p-4 rounded-2xl bg-white border border-rose-200 shadow-sm space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-black text-slate-900">{zone.name}</h4>
                    <span className="text-xs text-slate-500 font-medium">{currentDestination.name.split('&')[0]}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-900 border border-rose-300">
                    {zone.density || '95% Full'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-rose-500" />
                    <span>Estimated Wait: <strong>{zone.waitTime || '45 mins'}</strong></span>
                  </div>
                  <span className="text-rose-700 font-bold text-[11px]">⚠️ High Rush</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Calm & Relaxing Alternatives with VIP Passes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Calm Alternatives (0 Wait Time + Free Perks)</span>
            </h3>
            <span className="text-xs font-mono font-bold text-emerald-700">{calmZones.length} Zones</span>
          </div>

          <div className="space-y-3">
            {calmZones.map(zone => {
              const isClaimed = claimedVouchers[zone.id];
              return (
                <div key={zone.id} className="p-4 rounded-2xl bg-white border border-emerald-300 shadow-sm space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-black text-slate-900">{zone.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-500 font-medium">Peaceful & Beautiful</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold">
                          0 Mins Queue
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-amber-700 font-mono">
                      +₹{zone.ecoRewardTokens || 45} PTS
                    </span>
                  </div>

                  <div className="p-2.5 bg-emerald-50/80 rounded-xl text-xs text-emerald-900 font-semibold flex items-center gap-2">
                    <Gift className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Includes: Free Priority Entry + Cold RO Water + Kulhad Chai</span>
                  </div>

                  <button
                    onClick={() => handleClaimFastPass({
                      id: zone.id,
                      name: zone.name,
                      rewardPoints: zone.ecoRewardTokens || 45,
                      destination: currentDestination.name
                    })}
                    className={`w-full py-2.5 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 shadow-sm ${
                      isClaimed
                        ? 'bg-slate-100 text-emerald-700 border border-emerald-300 cursor-default'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
                    }`}
                  >
                    {isClaimed ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>VIP FastPass Claimed! (Click to View QR)</span>
                      </>
                    ) : (
                      <>
                        <Ticket className="w-4 h-4 text-white" />
                        <span>Claim Free VIP FastPass (+₹{zone.ecoRewardTokens || 45} PTS)</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Claimed VIP FastPass Modal */}
      {activeModalVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-slate-200 max-w-sm w-full rounded-3xl p-6 shadow-2xl space-y-4 text-center">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="font-heritage text-sm font-black text-slate-900">VIP Darshan & Heritage FastPass</span>
              <button onClick={() => setActiveModalVoucher(null)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <div className="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-2xl inline-block shadow-inner">
              <div className="w-36 h-36 mx-auto bg-slate-900 p-2 rounded-xl flex items-center justify-center text-white font-mono text-center text-xs">
                [ VIP FASTPASS ]
                <br />
                {activeModalVoucher.name.split(' ')[0]}
                <br />
                PRIORITY ACCESS
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <h4 className="font-black text-slate-900">{activeModalVoucher.name}</h4>
              <p className="text-slate-500 font-medium">Show this barcode at the priority gate to skip queues instantly.</p>
              <div className="p-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 font-bold mt-2">
                🎉 ₹{activeModalVoucher.rewardPoints} Reward Points Added to your Wallet!
              </div>
            </div>

            <button
              onClick={() => setActiveModalVoucher(null)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl transition shadow-sm"
            >
              Close & Continue Trip
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
