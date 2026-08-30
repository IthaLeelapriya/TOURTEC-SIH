// Web Speech API Service for Voice Synthesis and Voice Input

class SpeechService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.isSpeaking = false;
    
    if (this.synth) {
      this.loadVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  speak(text, options = {}) {
    if (!this.synth) {
      console.warn('Speech synthesis not supported in this browser environment');
      return;
    }

    // Stop ongoing speech
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 1.0;
    utterance.pitch = options.pitch || 1.0;
    utterance.volume = options.volume || 1.0;

    // Pick appropriate voice
    const langCode = options.lang || 'en-US';
    utterance.lang = langCode;
    
    if (this.voices.length > 0) {
      const match = this.voices.find(v => v.lang.startsWith(langCode.substring(0, 2))) || this.voices[0];
      if (match) utterance.voice = match;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (options.onStart) options.onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (options.onEnd) options.onEnd();
    };

    utterance.onerror = (e) => {
      this.isSpeaking = false;
      if (options.onError) options.onError(e);
    };

    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }

  // Voice recognition helper (Web Speech Recognition)
  createRecognition(onResult, onEnd, onError) {
    const SpeechRecognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported in this browser');
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (onResult) onResult(transcript);
    };

    recognition.onend = () => {
      if (onEnd) onEnd();
    };

    recognition.onerror = (event) => {
      if (onError) onError(event);
    };

    return recognition;
  }
}

export const speechService = new SpeechService();
