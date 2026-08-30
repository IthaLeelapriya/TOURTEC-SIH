import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/apiService';
import { generateIntelligentChatReply } from '../../services/aiChatbotService';
import {
  MessageSquare,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Globe2,
  BookOpen,
  Sparkles,
  Send,
  HelpCircle,
  Compass,
  Check,
  Camera,
  Scan,
  Info,
  Languages,
  ScanLine,
  Play,
  Square,
  RotateCcw,
  Upload,
  User,
  Bot,
  Loader2,
  Copy,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ContextLanguageAssistant = () => {
  const { currentDestination, userLocation } = useApp();

  const [targetLanguage, setTargetLanguage] = useState('en');
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentlyPlayingAudioIndex, setCurrentlyPlayingAudioIndex] = useState(null);

  const cityName = currentDestination.name.split(',')[0].trim();
  const messagesEndRef = useRef(null);

  // Multi-Turn Chat Messages Stream
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'msg-1',
      sender: 'bot',
      category: 'Incredible India AI Guide',
      text: `Namaste & Welcome to ${cityName}! I am your real-time multilingual AI tour guide. Ask me anything about temple dress codes, history, authentic street food, Aarti timings, or auto fares!`,
      time: 'Just now'
    }
  ]);

  // AR Sign Scanner State
  const [activeSignIndex, setActiveSignIndex] = useState(0);
  const [isScanningSign, setIsScanningSign] = useState(false);
  const [translatedSign, setTranslatedSign] = useState(null);

  // Signboards Catalog
  const sampleSigns = [
    {
      title: '🛕 Temple Entry Rules (Hindi)',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop',
      nativeText: 'श्री मंदिर गर्भगृह प्रवेश नियमावली: जूते-चप्पल बाहर जूता घर में जमा करें। चमड़े की वस्तुएं एवं मोबाइल फोन वर्जित हैं।',
      englishTranslation: 'Temple Inner Sanctum Rules: Please deposit footwear at the free shoe stand outside. Leather items and mobile phones are strictly prohibited inside.',
      culturalInsight: 'Traditional temple sanctity requires pure cotton attire and footwear removal before darshan.'
    },
    {
      title: '🍛 Heritage Restaurant Menu (Hindi)',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800&auto=format&fit=crop',
      nativeText: 'शुद्ध देशी घी कचौड़ी-जलेबी, मलाई लस्सी कुल्हड़ में, और बनारसी मीठा पान।',
      englishTranslation: 'Pure Desi Ghee Kachori with Jalebi, Thick Malai Lassi served in traditional earthen Kulhad cup, and Authentic Sweet Paan.',
      culturalInsight: 'Local morning breakfast staple served hot directly from the kadhai.'
    },
    {
      title: '🛥️ Solar Ferry & Jetty Notice (Hindi)',
      image: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?q=80&w=800&auto=format&fit=crop',
      nativeText: 'उत्तर प्रदेश पर्यटन सौर नौका सेवा: शाम की महा आरती हेतु टिकट काउंटर नंबर २ पर उपलब्ध है। लाइफ जैकेट अनिवार्य है।',
      englishTranslation: 'Tourism Solar Boat Service: Evening Grand Aarti tickets available at Counter #2. Wearing life jackets is mandatory during the river cruise.',
      culturalInsight: 'Eco-friendly solar boats produce zero noise and zero river pollution.'
    }
  ];

  // Essential Multilingual Phrasebook
  const phrasebook = [
    { phrase: 'Namaste / Pranam', meaning: 'Greetings / Hello', hindi: 'नमस्ते / प्रणाम', telugu: 'నమస్కారం (Namaskaram)', audio: 'Namaste' },
    { phrase: 'Kitna hua? / How much?', meaning: 'Asking auto fare or price', hindi: 'कितना हुआ? (Kitna hua?)', telugu: 'ఎంత అయింది? (Entha ayindi?)', audio: 'Kitna hua' },
    { phrase: 'Mandi rasta kahan hai?', meaning: 'Where is the temple route?', hindi: 'मंदिर का रास्ता कहाँ है?', telugu: 'గుడి దారి ఎక్కడ? (Gudi daari ekkada?)', audio: 'Mandir ka rasta kahan hai' },
    { phrase: 'Kam teekha banayein', meaning: 'Make it less spicy please', hindi: 'कम तीखा बनायें (Kam teekha)', telugu: 'కారం తక్కువ చేయండి (Kaaram thakkuva)', audio: 'Kam teekha banayein' },
    { phrase: 'Shukriya / Dhanyawad', meaning: 'Thank you very much', hindi: 'धन्यवाद / शुक्रिया', telugu: 'ధన్యవాదాలు (Dhanyavadalu)', audio: 'Dhanyawad' }
  ];

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isLoading]);

  // Update Welcome message when city changes
  useEffect(() => {
    setChatMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'bot',
        category: 'Incredible India AI Guide',
        text: `Namaste! You are exploring ${cityName}. I am your real-time AI guide. What would you like to know about ${cityName}'s history, temple dress codes, food, or timings?`,
        time: 'Just now'
      }
    ]);
    setTranslatedSign(null);
  }, [currentDestination]);

  // Submit Query to AI Engine
  const handleSendQuery = async (queryText = null) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend || !textToSend.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      // Always run intelligent knowledge engine to ensure 100% accurate city context
      let replyData = await generateIntelligentChatReply(textToSend, cityName, userLocation.landmark, targetLanguage);

      // Also try backend and merge if backend returned an even richer valid response
      try {
        const backendRes = await apiService.queryAssistant(
          textToSend,
          targetLanguage,
          userLocation.landmark || cityName,
          currentDestination.id
        );
        if (backendRes && backendRes.reply && !backendRes.reply.includes('As your Incredible India AI guide, I suggest')) {
          // Verify backend didn't return Varanasi text for another city
          const isMismatched = !cityName.toLowerCase().includes('varanasi') && 
            (backendRes.reply.includes('Kashi Vishwanath') || backendRes.reply.includes('Dashashwamedh'));
          
          if (!isMismatched) {
            replyData = {
              category: backendRes.category || replyData.category,
              reply: backendRes.reply
            };
          }
        }
      } catch (beErr) {
        // use rich knowledge engine
      }

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        category: replyData.category,
        text: replyData.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.warn('AI query error, using local knowledge engine:', err);
      const fallback = generateIntelligentChatReply(textToSend, cityName, userLocation.landmark, targetLanguage);
      setChatMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          category: fallback.category,
          text: fallback.reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Text-To-Speech (Speech Synthesis)
  const handlePlayVoice = (text, index = null) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking && currentlyPlayingAudioIndex === index) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setCurrentlyPlayingAudioIndex(null);
        return;
      }

      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*_#`~]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = targetLanguage === 'hi' ? 'hi-IN' : targetLanguage === 'te' ? 'te-IN' : 'en-IN';
      utterance.rate = 0.95;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setCurrentlyPlayingAudioIndex(index);
      };
      utterance.onend = () => {
        setIsSpeaking(false);
        setCurrentlyPlayingAudioIndex(null);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setCurrentlyPlayingAudioIndex(null);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  // Speech Recognition (Microphone Voice Input)
  const handleToggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Microphone speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = targetLanguage === 'hi' ? 'hi-IN' : targetLanguage === 'te' ? 'te-IN' : 'en-IN';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputQuery(transcript);
      setIsListening(false);
      handleSendQuery(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Handle AR Sign Scanning Simulation
  const handleScanCurrentSign = () => {
    setIsScanningSign(true);
    setTranslatedSign(null);

    setTimeout(() => {
      setIsScanningSign(false);
      setTranslatedSign(sampleSigns[activeSignIndex]);
      confetti({ particleCount: 40, spread: 50 });
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fadeIn w-full">
      
      {/* Top Multilingual Assistant Banner */}
      <div className="bg-white border border-slate-200 p-5 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 text-slate-950 shadow-md">
            <Languages className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 font-heritage">
                Voice Guide, AI Chatbot & Camera Translator
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold">
                Live AI Assistant
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Ask any question in your language or point your camera to translate local Hindi/Telugu notices in <strong>{cityName}</strong>.
            </p>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-2xl">
          <Globe2 className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-bold text-slate-600">Language:</span>
          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="bg-transparent text-xs font-black text-slate-900 focus:outline-none cursor-pointer pr-2"
          >
            <option value="en">English (India)</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="te">తెలుగు (Telugu)</option>
            <option value="ta">தமிழ் (Tamil)</option>
            <option value="bn">বাংলা (Bengali)</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Left (Interactive Chatbot) | Right (AR Signboards Scanner & Cultural Etiquette) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT 7 COLS: MULTI-TURN AI CHATBOT & VOICE NARRATOR */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col h-[650px]">
          
          {/* Chat Window Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs shadow-sm">
                🤖
              </div>
              <div>
                <h4 className="font-black text-sm text-slate-900 font-heritage">{cityName} Travel AI Assistant</h4>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Online & Geolocation Aware</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setChatMessages([{
                id: `msg-${Date.now()}`,
                sender: 'bot',
                category: 'Incredible India AI Guide',
                text: `Namaste! How may I assist your travel in ${cityName} today?`,
                time: 'Just now'
              }])}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
              title="Reset Chat"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages Stream */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
            {chatMessages.map((msg, idx) => {
              const isBot = msg.sender === 'bot';

              return (
                <div
                  key={msg.id || idx}
                  className={`flex items-start gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
                >
                  {isBot && (
                    <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center text-xs flex-shrink-0 mt-1">
                      🇮🇳
                    </div>
                  )}

                  <div className={`max-w-[85%] space-y-1.5 ${isBot ? 'items-start' : 'items-end'}`}>
                    {isBot && msg.category && (
                      <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80 inline-block">
                        {msg.category}
                      </span>
                    )}

                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed shadow-sm ${
                        isBot
                          ? 'bg-slate-50 text-slate-900 border border-slate-200/90'
                          : 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold ml-auto'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-slate-400 px-1">
                      <span>{msg.time}</span>
                      {isBot && (
                        <button
                          onClick={() => handlePlayVoice(msg.text, idx)}
                          className="text-amber-700 font-bold hover:underline flex items-center gap-1 ml-1"
                        >
                          {isSpeaking && currentlyPlayingAudioIndex === idx ? (
                            <>
                              <Square className="w-3 h-3 text-red-600 fill-current" />
                              <span className="text-red-600">Stop Audio</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3 h-3" />
                              <span>Listen to Answer</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl w-fit text-xs text-slate-500 font-medium">
                <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                <span>AI Guide is generating accurate insights...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Topic Chips Tailored to Active City */}
          <div className="pt-3 pb-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Ask:</span>
            {[
              `What are the temple dress codes & rules?`,
              `Tell me the history of ${cityName}`,
              `Where can I taste authentic ${cityName} food?`,
              `What are the Aarti & Darshan timings today?`,
              `How do I reach here and auto rates?`
            ].map((chip, i) => (
              <button
                key={i}
                onClick={() => handleSendQuery(chip)}
                className="px-3 py-1.5 bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200 hover:border-amber-300 rounded-xl whitespace-nowrap text-[11px] font-bold transition flex-shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuery();
            }}
            className="flex items-center gap-2 pt-2"
          >
            <button
              type="button"
              onClick={handleToggleVoiceInput}
              className={`p-3.5 rounded-2xl transition shadow-sm ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-slate-200'
              }`}
              title={isListening ? 'Listening... click to stop' : 'Click to speak question via microphone'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={`Ask about ${cityName} customs, history, food, aarti timings, or transport...`}
              className="flex-1 p-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-amber-500 shadow-sm"
            />

            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="p-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 rounded-2xl font-black transition shadow-md active:scale-95 flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

        {/* RIGHT 5 COLS: AR VISUAL SIGNBOARD TRANSLATOR & PHRASEBOOK */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 1. AR VISUAL SIGN & MENU SCANNER */}
          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-amber-100 text-amber-900 rounded-xl">
                  <Camera className="w-4 h-4 text-amber-700" />
                </span>
                <div>
                  <h4 className="text-sm font-black text-slate-900 font-heritage">AR Visual Sign & Menu Translator</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Select a signboard from {cityName} to simulate instant camera OCR translation.</p>
                </div>
              </div>
            </div>

            {/* Sample Selector Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {sampleSigns.map((sample, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveSignIndex(i);
                    setTranslatedSign(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition text-[11px] ${
                    activeSignIndex === i
                      ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {sample.title}
                </button>
              ))}
            </div>

            {/* Viewfinder Simulator Box */}
            <div className="relative rounded-2xl border-2 border-dashed border-amber-400 bg-slate-950 p-4 text-white overflow-hidden min-h-[160px] flex flex-col justify-center items-center text-center space-y-3">
              
              {/* Native Hindi/Telugu Text on Signboard */}
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 max-w-md">
                <span className="text-[9px] uppercase font-bold text-amber-400 block mb-1">Native Signboard Text</span>
                <p className="font-heritage text-sm sm:text-base font-black text-amber-100">
                  "{sampleSigns[activeSignIndex].nativeText}"
                </p>
              </div>

              {/* Scan Button */}
              <button
                onClick={handleScanCurrentSign}
                disabled={isScanningSign}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition active:scale-95 flex items-center gap-2"
              >
                {isScanningSign ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scan className="w-4 h-4" />}
                <span>{isScanningSign ? 'Translating Board...' : 'Scan / Translate Signboard'}</span>
              </button>
            </div>

            {/* Translation Output Result */}
            {translatedSign && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-2 animate-fadeIn text-xs shadow-sm">
                <div className="flex items-center gap-2 text-emerald-950 font-black">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>English Translation (Optical OCR):</span>
                </div>
                <p className="text-slate-900 font-bold leading-relaxed bg-white p-3 rounded-xl border border-emerald-200">
                  {translatedSign.englishTranslation}
                </p>
                <div className="text-[11px] text-emerald-800 font-medium pl-1">
                  💡 <strong>Cultural Context:</strong> {translatedSign.culturalInsight}
                </div>
              </div>
            )}
          </div>

          {/* 2. ESSENTIAL AUDIO PHRASEBOOK */}
          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <h4 className="text-xs font-black uppercase text-slate-900">Essential Travel Phrasebook</h4>
              </div>
              <span className="text-[10px] font-bold text-slate-400">Click to listen & speak</span>
            </div>

            <div className="space-y-2">
              {phrasebook.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-slate-50 hover:bg-amber-50/60 border border-slate-200 hover:border-amber-300 rounded-2xl flex items-center justify-between gap-2 transition text-xs"
                >
                  <div>
                    <span className="font-black text-slate-900 block">{item.phrase}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{item.meaning} • {item.hindi}</span>
                  </div>

                  <button
                    onClick={() => handlePlayVoice(item.audio, `phrase-${idx}`)}
                    className="p-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl transition shadow-sm flex-shrink-0"
                    title="Play Pronunciation"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
