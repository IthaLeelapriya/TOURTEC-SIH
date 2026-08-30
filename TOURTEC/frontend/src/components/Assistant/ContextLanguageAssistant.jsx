import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/apiService';
import { speechService } from '../../services/speechService';
import {
  MessageSquare,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Camera,
  Send,
  Sparkles,
  HelpCircle,
  RotateCcw,
  Languages,
  BookOpen,
  Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ContextLanguageAssistant = () => {
  const { currentDestination, selectedLanguage, setSelectedLanguage } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: `नमस्ते! मैं आपका टूरिस्ट गाइड हूँ (I am your Tour Guide for ${currentDestination.name.split('&')[0]}). You can ask me anything by voice, or type questions below.`,
      category: 'Welcome'
    }
  ]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);

  // Quick Friendly Questions for Everyone
  const quickQuestions = [
    { label: '🚰 Where is free drinking water?', text: 'Where can I find clean RO drinking water refill nearby?' },
    { label: '🕉️ What are the temple dress rules?', text: 'What is the dress code and locker rules for the main temple?' },
    { label: '🍵 Best street food nearby?', text: 'What is the most famous authentic local street food here?' },
    { label: '🚤 How to book Ganga solar boat?', text: 'How do I take a solar electric boat ride across the river?' }
  ];

  const handleSend = async (queryText) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');

    // Call API Assistant
    const res = await apiService.askLanguageAssistant(
      textToSend,
      selectedLanguage,
      currentDestination.name
    );

    const reply = res?.reply || `Here is helpful tourist advice for ${currentDestination.name}: All main ghats and temples have free RO water stations and Tourist Police assistance desks.`;

    const botMsg = {
      sender: 'assistant',
      text: reply,
      category: res?.category || 'Helpful Guide'
    };

    setMessages(prev => [...prev, botMsg]);

    // Speak audio aloud
    speechService.speak(reply, selectedLanguage);
    setIsSpeaking(true);
  };

  const handleToggleVoiceInput = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      speechService.startListening(
        (transcript) => {
          setInputQuery(transcript);
          setIsListening(false);
          handleSend(transcript);
        },
        () => setIsListening(false),
        selectedLanguage
      );
    }
  };

  const handleStopSpeech = () => {
    speechService.stop();
    setIsSpeaking(false);
  };

  const handleSimulateCameraOcr = () => {
    setIsCameraActive(true);
    setOcrResult(null);

    setTimeout(() => {
      setOcrResult({
        hindi: 'श्री काशी विश्वनाथ मंदिर - निःशुल्क जूता व बैग लॉकर काउंटर नं. ४',
        english: 'Shree Kashi Vishwanath Temple — Free Shoe & Bag Locker Counter #4',
        tip: 'Drop your mobile phone and leather items here before entering Gate 4.'
      });
      confetti({ particleCount: 40, spread: 50 });
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fadeIn w-full">
      
      {/* Header (Simplified & Friendly) */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-amber-100 text-amber-700 border border-amber-300">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 font-heritage">Voice Guide & Camera Translator</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-mono font-bold">
                बोलने वाला गाइड
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Speak into your microphone or scan Indian heritage signs & menus with your camera for instant Hindi & English translation.
            </p>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1.5 rounded-2xl">
          <Languages className="w-4 h-4 text-amber-600 ml-2" />
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer pr-2"
          >
            <option value="hi">हिंदी (Hindi)</option>
            <option value="en">English (India)</option>
            <option value="bn">বাংলা (Bengali)</option>
            <option value="te">తెలుగు (Telugu)</option>
            <option value="ta">தமிழ் (Tamil)</option>
            <option value="mr">मराठी (Marathi)</option>
            <option value="gu">ગુજરાતી (Gujarati)</option>
          </select>
        </div>
      </div>

      {/* Quick Explainer Bar */}
      <div className="bg-amber-50/80 border border-amber-200 p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-700">
        <div className="flex items-center gap-2 font-bold text-amber-900">
          <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>How to Use:</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600 font-medium">
          <span>1️⃣ <strong>Click the Microphone</strong> and ask any question in your language</span>
          <span>•</span>
          <span>2️⃣ <strong>Click "Camera Sign Translator"</strong> to read temple signs</span>
          <span>•</span>
          <span>3️⃣ <strong>Click any quick question</strong> below</span>
        </div>
      </div>

      {/* Main Grid: Chat Assistant & Camera OCR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: Conversational Voice Chat */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-4 shadow-sm flex flex-col h-[520px]">
            
            {/* Audio Voice Status Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>AI Guide Ready ({currentDestination.name.split(' ')[0]})</span>
              </span>
              {isSpeaking && (
                <button
                  onClick={handleStopSpeech}
                  className="px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg font-bold text-[10px] flex items-center gap-1"
                >
                  <VolumeX className="w-3 h-3" /> Stop Audio Voice
                </button>
              )}
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl text-xs space-y-1 ${
                      m.sender === 'user'
                        ? 'bg-amber-500 text-slate-950 font-semibold rounded-br-none shadow-sm'
                        : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {m.category && (
                      <span className="text-[9px] uppercase font-bold text-amber-800 block">
                        {m.category}
                      </span>
                    )}
                    <p className="leading-relaxed font-medium">{m.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Questions Pill Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q.text)}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl text-slate-700 font-bold whitespace-nowrap transition shadow-sm"
                >
                  {q.label}
                </button>
              ))}
            </div>

            {/* Chat Input Bar with Big Mic Button */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask anything (e.g. Ganga Aarti timings, best lassi shop)..."
                className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
              />

              <button
                onClick={handleToggleVoiceInput}
                className={`p-3 rounded-xl transition flex items-center justify-center shadow-md ${
                  isListening
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                }`}
                title="Speak to Guide"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                onClick={() => handleSend()}
                className="p-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition shadow-md"
                title="Send Question"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Right 5 Cols: Camera Sign & Menu Scanner */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-600" />
                <span>Camera Sign & Menu Translator</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
                AR SCANNER
              </span>
            </div>

            <p className="text-xs text-slate-500 font-medium">
              Point your smartphone camera at temple notices, stone inscriptions, or Hindi street signs for immediate translation.
            </p>

            {/* Camera Viewfinder Mockup */}
            <div className="relative rounded-2xl bg-slate-900 h-48 flex flex-col items-center justify-center text-center p-4 border border-slate-300 overflow-hidden shadow-inner">
              <div className="absolute inset-4 border-2 border-amber-400/60 rounded-xl pointer-events-none animate-pulse"></div>
              
              <div className="text-white/80 space-y-2">
                <Camera className="w-8 h-8 mx-auto text-amber-400" />
                <div className="text-xs font-bold font-mono">AR CAMERA LENS ACTIVE</div>
                <div className="text-[10px] text-slate-400">Position temple sign inside the box</div>
              </div>
            </div>

            <button
              onClick={handleSimulateCameraOcr}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl transition shadow-md flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>📸 Scan Temple Sign (Instant Translation)</span>
            </button>

            {/* Translation Output Card */}
            {ocrResult && (
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl space-y-2 text-xs animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-amber-950">Detected Sign Text:</span>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-amber-200 text-amber-900 font-bold font-mono">HINDI ➔ ENGLISH</span>
                </div>
                <p className="font-bold text-slate-800 font-heritage text-sm">"{ocrResult.hindi}"</p>
                <div className="p-2.5 bg-white rounded-xl border border-amber-200 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">English Meaning:</span>
                  <p className="font-semibold text-slate-900">{ocrResult.english}</p>
                </div>
                <p className="text-[11px] text-emerald-800 font-bold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                  💡 Tip: {ocrResult.tip}
                </p>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
