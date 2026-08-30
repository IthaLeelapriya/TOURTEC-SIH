import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Coins,
  X,
  Sparkles,
  Ticket,
  Coffee,
  Ship,
  ShoppingBag,
  CheckCircle2,
  Gift,
  ArrowRight,
  TrendingUp,
  Droplets,
  Footprints,
  Award,
  Copy,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const RewardsWalletModal = () => {
  const {
    ecoPoints,
    isRewardsWalletOpen,
    setIsRewardsWalletOpen,
    rewardTransactions,
    earnReward,
    redeemReward,
    requireAuth
  } = useApp();

  const [activeTab, setActiveTab] = useState('redeem'); // 'redeem' | 'earn' | 'history'
  const [copiedCode, setCopiedCode] = useState(null);
  const [activeRedeemedVoucher, setActiveRedeemedVoucher] = useState(null);

  if (!isRewardsWalletOpen) return null;

  const redeemCatalog = [
    {
      id: 'r-1',
      category: 'fastpass',
      title: 'VIP Temple Skip-the-Line FastPass',
      cost: 50,
      icon: Ticket,
      badge: 'Most Popular',
      benefit: 'Priority Gate #2 entry, bypass 45-min queues',
      partner: 'Archaeological Survey & Temple Trust'
    },
    {
      id: 'r-2',
      category: 'chai',
      title: 'Free Kulhad Chai & Temple Prasad Pack',
      cost: 30,
      icon: Coffee,
      badge: 'Instant Refreshment',
      benefit: '1 Free hot aromatic Chai & fresh Prasad voucher',
      partner: 'Verified Heritage Stalls & Ghat Cafes'
    },
    {
      id: 'r-3',
      category: 'boat',
      title: 'Solar Ferry & E-Boat 50% Off Ride',
      cost: 60,
      icon: Ship,
      badge: 'Eco Transit',
      benefit: 'Flat 50% discount on scenic solar river boat cruises',
      partner: 'State Tourism Waterways Grid'
    },
    {
      id: 'r-4',
      category: 'handicraft',
      title: '₹100 Off Local Handloom & Souvenirs',
      cost: 100,
      icon: ShoppingBag,
      badge: 'Artisan Support',
      benefit: 'Instant ₹100 deduction on authentic silk & wooden toys',
      partner: 'Registered District Artisan Guild'
    }
  ];

  const handleRedeemClick = (item) => {
    requireAuth(() => {
      const res = redeemReward(item);
      if (res && res.success) {
        setActiveRedeemedVoucher({ ...item, code: res.code });
      }
    }, { message: 'Please sign in to redeem travel rewards and coupons.' });
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white border border-amber-200/90 max-w-xl w-full rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Top Header with Heritage Colors */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-6 text-slate-950 relative">
          <button
            onClick={() => setIsRewardsWalletOpen(false)}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-950/20 hover:bg-slate-950/40 text-slate-950 flex items-center justify-center font-black transition"
          >
            ✕
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white p-2.5 shadow-md flex items-center justify-center text-2xl">
              🪙
            </div>
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-slate-950/80 block">
                Incredible India Smart Rewards
              </span>
              <h3 className="text-xl font-black text-slate-950 font-heritage leading-tight">
                Your Travel Rewards Wallet
              </h3>
            </div>
          </div>

          {/* Current Balance Card */}
          <div className="mt-5 bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-white/60 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Available Balance</span>
              <div className="text-3xl font-black text-amber-700 font-mono">₹{ecoPoints} PTS</div>
            </div>

            <div className="text-right">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-black">
                🌟 Gold Explorer Tier
              </span>
              <span className="text-[10px] text-slate-500 font-bold block mt-1">1 PTS = ₹1 Tourism Value</span>
            </div>
          </div>
        </div>

        {/* 3 Nav Tabs: Redeem Store | Earn Points | Transaction History */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2 text-xs font-bold">
          {[
            { id: 'redeem', label: '🎟️ Redeem Store', desc: 'Discounts & Passes' },
            { id: 'earn', label: '✨ Earn Points', desc: '1-Click Green Tasks' },
            { id: 'history', label: '📜 History', desc: 'Past Vouchers' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2.5 px-3 border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-amber-500 text-amber-900 font-black'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* Active Redeemed Voucher Notification */}
          {activeRedeemedVoucher && (
            <div className="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-2xl space-y-2 animate-fadeIn shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span className="font-black text-xs text-emerald-950">Voucher Successfully Redeemed!</span>
                </div>
                <button onClick={() => setActiveRedeemedVoucher(null)} className="text-xs text-emerald-800 font-bold">✕</button>
              </div>

              <div className="bg-white p-3 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Your Voucher Code</div>
                  <div className="text-base font-black font-mono text-slate-900">{activeRedeemedVoucher.code}</div>
                </div>
                <button
                  onClick={() => handleCopyCode(activeRedeemedVoucher.code)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition flex items-center gap-1"
                >
                  {copiedCode === activeRedeemedVoucher.code ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === activeRedeemedVoucher.code ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>
              <p className="text-[11px] text-emerald-800 font-medium">Show this code at the venue or apply online during booking for instant discount.</p>
            </div>
          )}

          {/* 1. REDEEM STORE TAB */}
          {activeTab === 'redeem' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Select a perk to redeem with your points:</span>
                <span>Balance: <strong>₹{ecoPoints} PTS</strong></span>
              </div>

              <div className="space-y-3">
                {redeemCatalog.map((item) => {
                  const Icon = item.icon;
                  const canAfford = ecoPoints >= item.cost;

                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        canAfford
                          ? 'bg-white border-slate-200 hover:border-amber-400 shadow-sm'
                          : 'bg-slate-50 border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-3 bg-amber-100 text-amber-900 rounded-xl flex-shrink-0">
                          <Icon className="w-5 h-5 text-amber-700" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-xs sm:text-sm text-slate-900">{item.title}</h4>
                            <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-900 border border-amber-300">
                              {item.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 font-medium mt-0.5">{item.benefit}</p>
                          <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Partner: {item.partner}</span>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 flex-shrink-0">
                        <div className="text-right">
                          <span className="text-sm font-black text-amber-800 font-mono block">₹{item.cost} PTS</span>
                        </div>
                        <button
                          onClick={() => handleRedeemClick(item)}
                          disabled={!canAfford}
                          className={`px-4 py-2 rounded-xl text-xs font-black transition active:scale-95 flex items-center gap-1 ${
                            canAfford
                              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm'
                              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          <span>{canAfford ? 'Redeem Now' : 'Need More PTS'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. EARN POINTS TAB */}
          {activeTab === 'earn' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 font-medium">Complete instant green & smart actions to boost your wallet points:</p>
              
              <div className="space-y-3">
                
                {/* Task 1: RO Water Refill */}
                <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
                      <Droplets className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-xs text-slate-900">Refill at Clean RO Water Point</h4>
                      <p className="text-[11px] text-slate-600 font-medium">Avoid single-use plastic bottles at temples.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => earnReward('Refilled at Certified RO Water Point', 10, '🚰')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition shadow-sm whitespace-nowrap active:scale-95"
                  >
                    +10 PTS Claim
                  </button>
                </div>

                {/* Task 2: 5000 Steps Walk */}
                <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
                      <Footprints className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-xs text-slate-900">Complete 5,000 Heritage Steps</h4>
                      <p className="text-[11px] text-slate-600 font-medium">Walk scenic heritage alleys & ghats.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => earnReward('5,000 Heritage Walking Steps Completed', 25, '🚶‍♂️')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition shadow-sm whitespace-nowrap active:scale-95"
                  >
                    +25 PTS Claim
                  </button>
                </div>

                {/* Task 3: Calm Sight Visit */}
                <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-amber-100 text-amber-800 rounded-xl">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-xs text-slate-900">Visit Calm & Peaceful Alternative</h4>
                      <p className="text-[11px] text-slate-600 font-medium">Help disperse crowds during peak temple rush.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => earnReward('Visited Calm Alternative Sight', 35, '🌿')}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition shadow-sm whitespace-nowrap active:scale-95"
                  >
                    +35 PTS Claim
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* 3. TRANSACTION HISTORY TAB */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Recent Reward Points Activity:</span>
                <span>{rewardTransactions.length} Transactions</span>
              </div>

              <div className="space-y-2">
                {rewardTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 bg-white border border-slate-200 rounded-2xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{tx.icon || '✨'}</span>
                      <div>
                        <span className="font-bold text-slate-900 block">{tx.title}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{tx.time}</span>
                        {tx.code && (
                          <span className="text-[10px] font-mono font-bold text-emerald-700 block mt-0.5">
                            Code: {tx.code}
                          </span>
                        )}
                      </div>
                    </div>

                    <span className={`font-black font-mono text-xs px-2.5 py-1 rounded-xl ${
                      tx.points > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {tx.points > 0 ? `+${tx.points}` : tx.points} PTS
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium text-[11px]">
            Powered by Ministry of Tourism Eco-Grid
          </span>
          <button
            onClick={() => setIsRewardsWalletOpen(false)}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition"
          >
            Close Wallet
          </button>
        </div>

      </div>
    </div>
  );
};
