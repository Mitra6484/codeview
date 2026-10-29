"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export type AuraEmotion =
  | "encouraging"
  | "curious"
  | "empathetic"
  | "celebratory"
  | "analytical";

export interface EmotionProsodyConfig {
  pitch: number;
  rate: number;
  volume: number;
}

/**
 * Calibrated prosody for Aura:
 * Rates: 0.80 - 0.88 (relaxed, natural human cadence, ~15-20% slower than raw mechanical TTS)
 * Pitches: 1.05 - 1.16 (warm, melodious, feminine sweetness eliminating monotone drone)
 */
export const EMOTION_PROSODY: Record<AuraEmotion, EmotionProsodyConfig> = {
  // Joyful, sweet melodic lift, delighted and celebratory without rushing
  celebratory: {
    pitch: 1.16,
    rate: 0.88,
    volume: 1.0,
  },
  // Warm, uplifting, sweet positive reinforcement, relaxed cadence
  encouraging: {
    pitch: 1.12,
    rate: 0.85,
    volume: 1.0,
  },
  // Inquisitive, gentle, thoughtful, friendly conversational cadence
  curious: {
    pitch: 1.08,
    rate: 0.84,
    volume: 0.98,
  },
  // Soft, calming, patient, tender slow pace when candidate is nervous or stuck
  empathetic: {
    pitch: 1.06,
    rate: 0.80,
    volume: 0.96,
  },
  // Crisp, articulate, sweet and clear technical discussion
  analytical: {
    pitch: 1.05,
    rate: 0.84,
    volume: 1.0,
  },
};

/**
 * Normalizes speech text into a natural conversational flow:
 * - Expands Big-O and mathematical notation (e.g. O(N) -> "O of N")
 * - Expands code operators (e.g. === -> "equals", arr[i] -> "element at index i")
 * - Expands contractions to warm, natural phrasing ("I am" -> "I'm")
 * - Adds micro-breathing pauses via gentle ellipses (...)
 * - Strips raw markdown syntax, backticks, asterisks
 */
export function prepareSpeechText(rawText: string): string {
  if (!rawText) return "";

  let text = rawText;

  // 1. Remove markdown formatting (bold, italic, headers, backticks, codeblocks)
  text = text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/^#+\s+/gm, "")
    .replace(/^[*\-+]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "");

  // 2. Expand algorithmic Big-O notation into conversational spoken English
  text = text
    .replace(/O\(\s*1\s*\)/gi, "O of one")
    .replace(/O\(\s*n\s*\^\s*2\s*\)/gi, "O of N squared")
    .replace(/O\(\s*n\s*log\s*n\s*\)/gi, "O of N log N")
    .replace(/O\(\s*log\s*n\s*\)/gi, "O of log N")
    .replace(/O\(\s*n\s*\)/gi, "O of N")
    .replace(/O\(\s*m\s*\*\s*n\s*\)/gi, "O of M times N")
    .replace(/O\(\s*2\s*\^\s*n\s*\)/gi, "O of two to the N");

  // 3. Expand code symbols that cause harsh mechanical glitching in TTS
  text = text
    .replace(/===/g, " equals ")
    .replace(/!==/g, " does not equal ")
    .replace(/==/g, " equals ")
    .replace(/!=/g, " is not equal to ")
    .replace(/=>/g, " returns ")
    .replace(/&&/g, " and ")
    .replace(/\|\|/g, " or ")
    .replace(/\+\+/g, " plus plus ")
    .replace(/--/g, " minus minus ")
    .replace(/([a-zA-Z0-9_$]+)\[\s*([a-zA-Z0-9_$]+)\s*\]/g, "$1 at index $2")
    .replace(/\[\s*([a-zA-Z0-9_$]+)\s*,\s*([a-zA-Z0-9_$]+)\s*\]/g, "indices $1 and $2")
    .replace(/\[\s*i\s*\]/g, " at index i")
    .replace(/\[\s*j\s*\]/g, " at index j")
    .replace(/\[\s*k\s*\]/g, " at index k");

  // 4. Soften formal robot phrases into warm conversational contractions
  text = text
    .replace(/\bI am\b/g, "I'm")
    .replace(/\bWe will\b/g, "We'll")
    .replace(/\bwe will\b/g, "we'll")
    .replace(/\bYou will\b/g, "You'll")
    .replace(/\byou will\b/g, "you'll")
    .replace(/\bIt is\b/g, "It's")
    .replace(/\bit is\b/g, "it's")
    .replace(/\bThat is\b/g, "That's")
    .replace(/\bthat is\b/g, "that's")
    .replace(/\bdo not\b/g, "don't")
    .replace(/\bcannot\b/g, "can't")
    .replace(/\bLet us\b/g, "Let's")
    .replace(/\blet us\b/g, "let's");

  // 5. Add micro-breathing pauses around sweet conversational markers
  text = text
    .replace(/\b(Oh,\s*nice[!.]?)/gi, "Oh, nice!... ")
    .replace(/\b(Great work[!.]?)/gi, "Great work!... ")
    .replace(/\b(Awesome[!.]?)/gi, "Awesome!... ")
    .replace(/\b(Take your time[!.]?)/gi, "Take your time... ")
    .replace(/\b(No worries[!.]?)/gi, "No worries... ")
    .replace(/\b(Hmm[,.]?)/gi, "Hmm... ")
    .replace(/\b(Hi there[!.]?)/gi, "Hi there!... ");

  // 6. Clean up spacing and trailing punctuation
  text = text
    .replace(/\.{4,}/g, "...")
    .replace(/\s+/g, " ")
    .trim();

  return text;
}

/**
 * Selects the sweetest, warmest, and most natural-sounding human female voice
 * available in the browser/OS, while discarding mechanical/robotic voices.
 */
export function selectBestSweetVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  const englishVoices = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
  const candidatePool = englishVoices.length > 0 ? englishVoices : voices;

  const scored = candidatePool.map((voice) => {
    let score = 0;
    const name = voice.name.toLowerCase();
    const uri = (voice.voiceURI || "").toLowerCase();

    // Heavy penalty for known robotic/monotone/gimmick voices
    const isRobotic = [
      "bad news", "bahh", "bells", "boing", "bubbles", "cellos",
      "deranged", "good news", "hysterical", "organ", "superstar",
      "trinoids", "whisper", "zarvox", "albert", "fred", "junior",
      "ralph", "wobble", "alex", "daniel", "eddy", "reed", "rocko"
    ].some((term) => name.includes(term) || uri.includes(term));

    if (isRobotic) score -= 1000;

    // Quality tier bonuses (enhanced, premium, neural, natural)
    if (name.includes("premium") || uri.includes("premium")) score += 200;
    if (name.includes("enhanced") || uri.includes("enhanced")) score += 160;
    if (name.includes("natural") || uri.includes("natural")) score += 180;
    if (name.includes("neural") || uri.includes("neural")) score += 180;
    if (name.includes("online") || uri.includes("online")) score += 120;

    // Sweet, warm, feminine voice priorities
    if (name.includes("ava")) score += 110;
    if (name.includes("jenny")) score += 110;
    if (name.includes("aria")) score += 105;
    if (name.includes("samantha")) score += 100;
    if (name.includes("zoe")) score += 95;
    if (name.includes("allison")) score += 90;
    if (name.includes("google us english") || (name.includes("google") && name.includes("english"))) score += 90;
    if (name.includes("victoria")) score += 85;
    if (name.includes("serena")) score += 85;
    if (name.includes("karen")) score += 80;
    if (name.includes("tessa")) score += 75;
    if (name.includes("moira")) score += 70;
    if (name.includes("sandy")) score += 65;
    if (name.includes("flo")) score += 65;
    if (name.includes("shelley")) score += 60;
    if (name.includes("kathy")) score += 55;

    // Locale preference (US English sounds most balanced for Aura)
    if (voice.lang === "en-US" || voice.lang === "en_US") score += 25;
    else if (voice.lang.startsWith("en")) score += 10;

    // Penalize compact low-bitrate voices if enhanced exists
    if (name.includes("compact")) score -= 40;

    return { voice, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.voice || candidatePool[0];
}

interface UseVoiceInterviewOptions {
  onSpeechResult?: (transcript: string) => void;
}

export function useVoiceInterview({ onSpeechResult }: UseVoiceInterviewOptions = {}) {
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [currentTranscript, setCurrentTranscript] = useState<string>("");
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [currentEmotion, setCurrentEmotion] = useState<AuraEmotion>("encouraging");
  const [activeVoiceName, setActiveVoiceName] = useState<string>("Calibrated Natural Voice");
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>("");
  const [speechRateMultiplier, setSpeechRateMultiplier] = useState<number>(1.0);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const selectedVoiceURIRef = useRef<string>("");
  const speechRateMultiplierRef = useRef<number>(1.0);
  selectedVoiceURIRef.current = selectedVoiceURI;
  speechRateMultiplierRef.current = speechRateMultiplier;
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isListeningRef = useRef<boolean>(false);
  const isAuraSpeakingRef = useRef<boolean>(false);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const accumulatedSpeechRef = useRef<string>("");
  const onSpeechResultRef = useRef(onSpeechResult);
  onSpeechResultRef.current = onSpeechResult;

  // Initialize Speech Recognition & Synthesis Voices
  useEffect(() => {
    if (typeof window === "undefined") return;

    synthRef.current = window.speechSynthesis;

    const loadVoices = () => {
      if (!synthRef.current) return;
      const available = synthRef.current.getVoices();
      if (available && available.length > 0) {
        voicesRef.current = available;
        const englishOnly = available.filter((v) => v.lang.toLowerCase().startsWith("en"));
        setAvailableVoices(englishOnly.length > 0 ? englishOnly : available);
        const best = selectBestSweetVoice(available);
        if (best) {
          setActiveVoiceName(best.name);
          if (!selectedVoiceURIRef.current) {
            setSelectedVoiceURI(best.voiceURI);
          }
        }
      }
    };

    loadVoices();

    if (synthRef.current.onvoiceschanged !== undefined) {
      synthRef.current.onvoiceschanged = loadVoices;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech recognition is not supported in this browser.");
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      // Echo suppression: Ignore input while Aura is actively speaking through speakers
      if (isAuraSpeakingRef.current) return;

      let interim = "";
      let finalChunk = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalChunk += transcript;
        } else {
          interim += transcript;
        }
      }

      const activeText = (accumulatedSpeechRef.current + " " + (finalChunk || interim)).trim();
      setCurrentTranscript(activeText);

      // Audio waveform simulation
      setAudioLevel(Math.min(100, Math.max(20, activeText.length * 5)));

      // 1. Browser emitted a definitive isFinal result
      if (finalChunk.trim()) {
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
        const fullSpoken = (accumulatedSpeechRef.current + " " + finalChunk).trim();
        accumulatedSpeechRef.current = "";
        setCurrentTranscript("");
        setAudioLevel(0);
        if (fullSpoken && onSpeechResultRef.current) {
          onSpeechResultRef.current(fullSpoken);
        }
        return;
      }

      // 2. Browser only stream interim results (common on Chrome with background room noise)
      // Use 1.2s silence detection debounce to auto-commit when candidate pauses speaking
      if (interim.trim()) {
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }
        silenceTimerRef.current = setTimeout(() => {
          const autoCommitText = (accumulatedSpeechRef.current + " " + interim).trim();
          if (autoCommitText.length > 0 && onSpeechResultRef.current && !isAuraSpeakingRef.current) {
            accumulatedSpeechRef.current = "";
            setCurrentTranscript("");
            setAudioLevel(0);
            onSpeechResultRef.current(autoCommitText);
          }
        }, 1200);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn("Speech recognition warning/error:", event.error);
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        isListeningRef.current = false;
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      // If recognition cycled while we had pending speech, commit it
      if (accumulatedSpeechRef.current.trim() && onSpeechResultRef.current && !isAuraSpeakingRef.current) {
        const pending = accumulatedSpeechRef.current.trim();
        accumulatedSpeechRef.current = "";
        setCurrentTranscript("");
        setAudioLevel(0);
        onSpeechResultRef.current(pending);
      }

      // Auto-restart continuous listening unless stopped or Aura is currently vocalizing
      if (isListeningRef.current && !isAuraSpeakingRef.current) {
        try {
          recognition.start();
        } catch (e) {
          // Already running
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Text-To-Speech Output with Natural Cadence, Prosody & Chrome Heartbeat
  const speak = useCallback((rawText: string, emotion: AuraEmotion = "encouraging") => {
    if (typeof window === "undefined" || !synthRef.current || !rawText) return;

    const text = prepareSpeechText(rawText);
    if (!text) return;

    // Flag Aura as actively vocalizing to prevent hearing her own voice through mic
    isAuraSpeakingRef.current = true;
    setCurrentEmotion(emotion || "encouraging");

    // Pause recognition during speech
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    const doSpeak = () => {
      if (!synthRef.current) return;

      try {
        if (synthRef.current.paused) {
          synthRef.current.resume();
        }
      } catch (e) {}

      let voices = voicesRef.current;
      if (!voices || voices.length === 0) {
        voices = synthRef.current.getVoices() || [];
        if (voices.length > 0) {
          voicesRef.current = voices;
        }
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";

      // Modulate prosody: slower tempo and sweet melodious pitch, scaled by user multiplier
      const prosody = EMOTION_PROSODY[emotion] || EMOTION_PROSODY.encouraging;
      const mult = speechRateMultiplierRef.current || 1.0;
      utterance.rate = Math.min(1.5, Math.max(0.6, prosody.rate * mult));
      utterance.pitch = prosody.pitch;
      utterance.volume = prosody.volume;

      // Select user-chosen voice or sweet feminine voice
      if (voices.length > 0) {
        const chosenVoice = selectedVoiceURIRef.current
          ? voices.find((v) => v.voiceURI === selectedVoiceURIRef.current)
          : null;
        const targetVoice = chosenVoice || selectBestSweetVoice(voices);
        if (targetVoice) {
          utterance.voice = targetVoice;
          setActiveVoiceName(targetVoice.name);
        }
      }

      activeUtteranceRef.current = utterance;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setAudioLevel(65);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setAudioLevel(0);
        activeUtteranceRef.current = null;
        // 250ms room echo cooldown before reopening mic
        setTimeout(() => {
          isAuraSpeakingRef.current = false;
          if (isListeningRef.current && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (e) {}
          }
        }, 250);
      };

      utterance.onerror = (e) => {
        console.warn("Speech synthesis notice:", e);
        setIsSpeaking(false);
        setAudioLevel(0);
        activeUtteranceRef.current = null;
        setTimeout(() => {
          isAuraSpeakingRef.current = false;
          if (isListeningRef.current && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (e) {}
          }
        }, 250);
      };

      try {
        synthRef.current.resume();
        synthRef.current.speak(utterance);
      } catch (e) {
        console.warn("Speech synthesis speak exception:", e);
        isAuraSpeakingRef.current = false;
      }
    };

    if (synthRef.current.speaking || synthRef.current.pending) {
      synthRef.current.cancel();
      setTimeout(doSpeak, 60);
    } else {
      doSpeak();
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      setAudioLevel(0);
      activeUtteranceRef.current = null;
      isAuraSpeakingRef.current = false;
    }
  }, []);

  const startListening = useCallback(() => {
    isListeningRef.current = true;
    setIsListening(true);
    if (!recognitionRef.current || isAuraSpeakingRef.current) return;
    try {
      recognitionRef.current.start();
    } catch (e) {
      // Already running
    }
  }, []);

  const stopListening = useCallback(() => {
    isListeningRef.current = false;
    setIsListening(false);
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    accumulatedSpeechRef.current = "";
    setCurrentTranscript("");
    setAudioLevel(0);
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch (e) {}
  }, []);

  const toggleListening = useCallback(() => {
    if (isListeningRef.current) {
      stopListening();
    } else {
      startListening();
    }
  }, [startListening, stopListening]);

  // Manually commit whatever has been spoken so far without waiting for silence timer
  const commitCurrentSpeech = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    const textToCommit = currentTranscript.trim();
    if (textToCommit && onSpeechResultRef.current) {
      accumulatedSpeechRef.current = "";
      setCurrentTranscript("");
      setAudioLevel(0);
      onSpeechResultRef.current(textToCommit);
    }
  }, [currentTranscript]);

  return {
    isSupported,
    isListening,
    isSpeaking,
    currentTranscript,
    audioLevel,
    currentEmotion,
    activeVoiceName,
    availableVoices,
    selectedVoiceURI,
    setSelectedVoiceURI,
    speechRateMultiplier,
    setSpeechRateMultiplier,
    speak,
    stopSpeaking,
    startListening,
    stopListening,
    toggleListening,
    commitCurrentSpeech,
  };
}
