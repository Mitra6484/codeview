"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface UseVoiceInterviewOptions {
  onSpeechResult?: (transcript: string) => void;
}

export function useVoiceInterview({ onSpeechResult }: UseVoiceInterviewOptions = {}) {
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [currentTranscript, setCurrentTranscript] = useState<string>("");
  const [audioLevel, setAudioLevel] = useState<number>(0);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const onSpeechResultRef = useRef(onSpeechResult);
  onSpeechResultRef.current = onSpeechResult;

  // Initialize Speech Recognition & Synthesis
  useEffect(() => {
    if (typeof window === "undefined") return;

    synthRef.current = window.speechSynthesis;

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
      let interim = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interim += transcript;
        }
      }

      const activeText = finalTranscript || interim;
      setCurrentTranscript(activeText);

      // Simulate audio frequency wave when user speaks
      setAudioLevel(Math.min(100, Math.max(20, activeText.length * 5)));

      if (finalTranscript.trim()) {
        if (onSpeechResultRef.current) {
          onSpeechResultRef.current(finalTranscript.trim());
        }
        setCurrentTranscript("");
        setAudioLevel(0);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn("Speech recognition error:", event.error);
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      // If still set to listening, safely restart (unless user turned it off)
      setIsListening((prev) => {
        if (prev) {
          try {
            recognition.start();
          } catch (e) {
            // Already active
          }
        }
        return prev;
      });
    };

    recognitionRef.current = recognition;

    return () => {
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

  // Text-To-Speech Output
  const speak = useCallback((text: string) => {
    if (!synthRef.current || !text) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    // Temporarily pause recognition to prevent AI hearing itself
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick best natural voice if available
    const voices = synthRef.current.getVoices();
    const naturalVoice = voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.includes("Natural") ||
          v.name.includes("Google") ||
          v.name.includes("Samantha") ||
          v.name.includes("Daniel") ||
          v.name.includes("Alex"))
    );
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setAudioLevel(65);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setAudioLevel(0);
      // Resume listening for candidate's response
      if (isListening && recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {}
      }
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setAudioLevel(0);
    };

    synthRef.current.speak(utterance);
  }, [isListening]);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      setAudioLevel(0);
    }
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (e) {
      // Already running
      setIsListening(true);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
      setIsListening(false);
      setCurrentTranscript("");
      setAudioLevel(0);
    } catch (e) {}
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isSupported,
    isListening,
    isSpeaking,
    currentTranscript,
    audioLevel,
    speak,
    stopSpeaking,
    startListening,
    stopListening,
    toggleListening,
  };
}
