import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/apiService';
import {
  Compass,
  HelpCircle,
  AlertTriangle,
  RotateCw,
  Navigation,
  ShieldCheck,
  Footprints,
  Activity,
  PhoneCall,
  CheckCircle,
  ArrowRight,
  Radio,
  Eye,
  MapPin,
  Sparkles,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LostTouristDetector = () => {
  const { currentDestination, setIsSosOpen, setActiveTab, setEcoPoints } = useApp();
  const canvasRef = useRef(null);

  const [mode, setMode] = useState('normal'); // 'normal' | 'lost_loop' | 'hesitation'
  const [trajectory, setTrajectory] = useState([]);
  const [anomalyData, setAnomalyData] = useState({
    confusionScore: 12,
    status: 'ON_TRACK',
    isErratic: false,
    indicators: {
      circularityIndex: 'Normal (0.04)',
      hesitationStops: '0 stops in 5m',
      paceVariance: 'Stable (3.8 km/h)',
      orientationEntropy: 'Aligned with heritage path'
    },
    actionableGuidance: 'Tourist path is linear and progressing smoothly along designated heritage corridor.'
  });

  const [recoveryApplied, setRecoveryApplied] = useState(false);
  const [activeVisualLandmark, setActiveVisualLandmark] = useState(null);

  // Generate synthetic trajectory based on mode (Indian Alleyway / Gali context)
  useEffect(() => {
    let points = [];
    const centerX = 200;
    const centerY = 150;

    if (mode === 'normal') {
      for (let i = 0; i < 15; i++) {
        points.push({
          x: 50 + i * 22,
          y: centerY + Math.sin(i * 0.4) * 25,
          angle: 0
        });
      }
    } else if (mode === 'lost_loop') {
      // Backtracking loops in narrow Varanasi / Old Jaipur galis
      for (let i = 0; i < 22; i++) {
        const rad = (i / 7) * Math.PI * 2;
        points.push({
          x: centerX + Math.cos(rad) * (55 + (i % 4) * 8),
          y: centerY + Math.sin(rad) * (48 + (i % 3) * 10),
          angle: (rad * 180) / Math.PI
        });
      }
    } else if (mode === 'hesitation') {
      // Clustered stops and crowd confusion in market chowk
      for (let i = 0; i < 16; i++) {
        points.push({
          x: 100 + i * 6 + (Math.random() - 0.5) * 25,
          y: centerY + (Math.random() - 0.5) * 30,
          angle: Math.random() * 360
        });
      }
    }

    setTrajectory(points);
    setRecoveryApplied(false);

    // Call Backend Anomaly Analysis API
    const analyze = async () => {
      const res = await apiService.analyzeConfusionTrajectory({
        trajectory: points.map(p => ({ lat: p.y, lng: p.x })),
        recentAngles: points.map(p => p.angle),
        averageSpeedKmh: mode === 'normal' ? 3.8 : 0.8
      });

      if (res) {
        setAnomalyData(res);
      } else {
        const isConfused = mode !== 'normal';
        setAnomalyData({
          confusionScore: isConfused ? 88 : 14,
          status: isConfused ? 'CONFUSED_OR_LOST' : 'ON_TRACK',
          isErratic: isConfused,
          indicators: {
            circularityIndex: isConfused ? 'Critical (0.92 Loops in Galis)' : 'Normal (0.04)',
            hesitationStops: isConfused ? '5 stops in 3m' : '0 stops',
            paceVariance: isConfused ? 'Erratic (0.7 km/h in Gali)' : 'Stable (3.8 km/h)',
            orientationEntropy: isConfused ? '180° Direction Inversions' : 'Aligned to Main Ghat'
          },
          actionableGuidance: isConfused
            ? 'Anomaly Detected: Repeated circular path in narrow heritage galis. Tap below for direct bearing heading back to Godowlia Main Chowk & Riverfront promenade.'
            : 'Tourist is moving smoothly along designated heritage corridor.'
        });
      }
    };

    analyze();
  }, [mode]);

  // Canvas visualizer for GPS trajectory (Light Theme)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = canvas.parentElement.clientWidth || 400;
    canvas.height = 300;

    // Light background
    ctx.fillStyle = '#FAF9F6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Light grid lines
    ctx.strokeStyle = 'rgba(217, 119, 6, 0.1)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 25) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 25) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    if (trajectory.length < 2) return;

    // Draw GPS Breadcrumb Polyline Trail
    ctx.beginPath();
    ctx.moveTo(trajectory[0].x, trajectory[0].y);
    for (let i = 1; i < trajectory.length; i++) {
      ctx.lineTo(trajectory[i].x, trajectory[i].y);
    }

    const isErratic = anomalyData.isErratic && !recoveryApplied;
    ctx.strokeStyle = isErratic ? '#DC2626' : '#D97706';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Draw Trail Waypoints
    trajectory.forEach((p, idx) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, idx === trajectory.length - 1 ? 6.5 : 3.5, 0, Math.PI * 2);
      ctx.fillStyle = idx === trajectory.length - 1 ? '#059669' : isErratic ? '#DC2626' : '#D97706';
      ctx.fill();
    });

    // Draw Compass Bearing Origin (Target Main Chowk/Ghat)
    if (isErratic) {
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.arc(canvas.width - 60, 50, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 10px Plus Jakarta Sans';
      ctx.fillText('MAIN CHOWK', canvas.width - 60, 72);
    }
  }, [trajectory, anomalyData, recoveryApplied]);

  const handleApplyGuideBack = () => {
    setRecoveryApplied(true);
    setMode('normal');
    setEcoPoints(p => p + 25);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const isConfused = (anomalyData.confusionScore > 50 || anomalyData.isErratic) && !recoveryApplied;

  return (
    <div className="space-y-6 animate-fadeIn w-full">
      
      {/* Header (Light Theme) */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className={`p-3 rounded-2xl border ${
            isConfused ? 'bg-red-100 text-red-700 border-red-300 animate-pulse' : 'bg-amber-100 text-amber-700 border-amber-300'
          }`}>
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 font-heritage">Lost Tourist & Gali Confusion Anomaly AI</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                isConfused
                  ? 'bg-red-100 text-red-900 border border-red-300 animate-pulse'
                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              }`}>
                {isConfused ? '🚨 ANOMALY: TOURIST DISORIENTED IN GALIS' : '✓ HERITAGE CORRIDOR ON-TRACK'}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Trajectory pattern recognition detects wandering in dense historic alleyways, bazaar loops, and rapid direction reversals.
            </p>
          </div>
        </div>

        {/* Simulation Pattern Selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-300">
          <span className="text-[10px] uppercase font-bold text-slate-500 px-2">Simulate Pattern:</span>
          {[
            { id: 'normal', label: 'Linear Path' },
            { id: 'lost_loop', label: 'Narrow Gali Looping' },
            { id: 'hesitation', label: 'Market Chowk Stutter' }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                mode === m.id
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Explainer Bar: How Lost Tourist Detection Works */}
      <div className="bg-amber-50/80 border border-amber-200 p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-700">
        <div className="flex items-center gap-2 font-bold text-amber-950">
          <HelpCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>How Confusion Detection Works:</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600 font-medium">
          <span>1️⃣ <strong>Entropy Algorithms</strong> detect backtracking loops in narrow heritage galis</span>
          <span>•</span>
          <span>2️⃣ <strong>1-Tap Bearing Compass</strong> directs you straight back to the main avenue/ghat</span>
          <span>•</span>
          <span>3️⃣ <strong>360° Sightline Landmarks</strong> provide visual navigation even with zero GPS signal</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 6 Cols: GPS Trajectory Breadcrumb Canvas & Anomaly Score */}
        <div className="lg:col-span-6 space-y-4">
          
          <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Footprints className="w-4 h-4 text-amber-600" />
                <span>Live GPS Trajectory Breadcrumb Stream</span>
              </h3>
              <span className="text-xs text-amber-800 font-mono font-bold">
                {trajectory.length} Pings Analyzed
              </span>
            </div>

            <div className="relative bg-[#FAF9F6] border border-slate-300 rounded-2xl overflow-hidden shadow-inner">
              <canvas ref={canvasRef} className="w-full block" />
              
              <div className="absolute bottom-2.5 left-3 text-[10px] text-slate-700 font-mono bg-white/90 px-2.5 py-1 rounded-md border border-slate-200 shadow-sm font-semibold">
                Gali Trajectory: {isConfused ? 'Alleyway Looping Detected' : 'Forward Smooth Progression'}
              </div>
            </div>
          </div>

          {/* Anomaly Indicators Breakdown */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 shadow-sm">
            <h3 className="font-bold text-xs text-slate-500 uppercase tracking-wider">
              Entropy & Behavioral Metrics (Heritage Grid)
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[10px] uppercase font-bold">Circularity Index</span>
                <div className={`font-bold font-mono mt-0.5 ${isConfused ? 'text-red-700' : 'text-emerald-700'}`}>
                  {anomalyData.indicators?.circularityIndex || 'Normal'}
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[10px] uppercase font-bold">Hesitation Stops</span>
                <div className={`font-bold font-mono mt-0.5 ${isConfused ? 'text-amber-800' : 'text-cyan-700'}`}>
                  {anomalyData.indicators?.hesitationStops || '0 stops'}
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[10px] uppercase font-bold">Pace Variance</span>
                <div className="font-bold font-mono text-slate-900 mt-0.5">
                  {anomalyData.indicators?.paceVariance || 'Stable (3.8 km/h)'}
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[10px] uppercase font-bold">Confusion Risk</span>
                <div className={`font-black font-mono text-base mt-0.5 ${
                  isConfused ? 'text-red-700' : 'text-emerald-700'
                }`}>
                  {anomalyData.confusionScore || 12} / 100
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right 6 Cols: Intelligent Confusion Assistance & Visual Landmarks */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Active Confusion Assistance Card */}
          {isConfused ? (
            <div className="bg-red-50 border-2 border-red-300 p-6 rounded-3xl space-y-5 shadow-md animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-100 border border-red-300 flex items-center justify-center text-red-600">
                  <AlertTriangle className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Gali Disorientation Alert Triggered</h3>
                  <p className="text-xs text-red-700 font-bold">Tourist is backtracking in narrow alleys</p>
                </div>
              </div>

              <p className="text-xs text-slate-800 leading-relaxed bg-white p-3.5 rounded-2xl border border-red-200 font-medium">
                {anomalyData.actionableGuidance}
              </p>

              {/* Bearing Compass Widget */}
              <div className="bg-white p-4 rounded-2xl border border-amber-300 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-amber-50 border-2 border-amber-500 flex items-center justify-center text-amber-700 shadow-sm">
                    <Navigation className="w-6 h-6 transform rotate-45 animate-pulse" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Bearing Heading to Main Chowk / Riverfront</div>
                    <div className="text-base font-black text-slate-900 font-mono">45° Northeast • 180 meters</div>
                  </div>
                </div>

                <span className="text-[10px] px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 font-bold border border-amber-300">
                  DIRECT LINE
                </span>
              </div>

              {/* One-Tap Recovery Buttons */}
              <div className="space-y-2.5">
                <button
                  onClick={handleApplyGuideBack}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  <Compass className="w-4 h-4" /> 🧭 1-Tap Guide Me Back to Main Chowk (+₹25 Pts)
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveTab('assistant')}
                    className="py-2.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <PhoneCall className="w-4 h-4 text-amber-600" /> Tourist Police Mitra
                  </button>

                  <button
                    onClick={() => setIsSosOpen(true)}
                    className="py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
                  >
                    <Radio className="w-4 h-4 animate-ping" /> Dispatch SOS
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Yatri Flow Confirmed on Route</h3>
                  <p className="text-xs text-emerald-700 font-bold">Pace is linear and matching heritage itinerary</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200 font-medium">
                The anomaly scanner evaluates GPS vectors. If you enter narrow heritage galis where satellite GPS weakens, use the 360° Visual Landmark Orientation helper below for instant line-of-sight direction cues.
              </p>
            </div>
          )}

          {/* 360° Visual Landmark Orientation Helper */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber-600" />
                <span>360° Visual Landmark Sightlines (GPS-Denied)</span>
              </h3>
              <span className="text-[10px] text-amber-800 font-mono font-bold">3 SIGHTLINES ACTIVE</span>
            </div>

            <div className="space-y-3">
              {(currentDestination.visualLandmarks || []).map(lm => (
                <div
                  key={lm.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3 hover:border-amber-400 transition cursor-pointer"
                  onClick={() => setActiveVisualLandmark(lm)}
                >
                  <img
                    src={lm.image}
                    alt={lm.name}
                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{lm.name}</h4>
                      <span className="text-[10px] font-mono text-amber-700 font-bold ml-1">{lm.bearing}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 font-medium">{lm.visualCue}</p>
                    <span className="text-[10px] text-emerald-700 font-mono mt-0.5 block font-bold">Distance: {lm.distance}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Visual Landmark Detail Modal */}
      {activeVisualLandmark && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-slate-200 max-w-md w-full rounded-3xl overflow-hidden shadow-2xl space-y-4">
            <div className="relative h-44 bg-slate-100">
              <img
                src={activeVisualLandmark.image}
                alt={activeVisualLandmark.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <button
                onClick={() => setActiveVisualLandmark(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-slate-800 flex items-center justify-center hover:bg-white font-bold"
              >
                ✕
              </button>
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold">
                  SIGHTLINE ORIENTATION
                </span>
                <h3 className="text-base font-black text-white mt-1">{activeVisualLandmark.name}</h3>
              </div>
            </div>

            <div className="p-5 pt-0 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[10px] font-bold">Compass Angle:</span>
                  <div className="text-amber-800 font-bold font-mono mt-0.5">{activeVisualLandmark.bearing}</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[10px] font-bold">Estimated Distance:</span>
                  <div className="text-emerald-700 font-bold font-mono mt-0.5">{activeVisualLandmark.distance}</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 font-medium">
                <strong className="text-slate-900 block mb-1">Visual Orientation Cue:</strong>
                {activeVisualLandmark.visualCue}
              </div>

              <button
                onClick={() => setActiveVisualLandmark(null)}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl transition shadow-sm"
              >
                Got It, Oriented!
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
