import { useCallback, useRef, useState, useEffect } from "react";

interface UseVoiceCoachOptions {
  enabled: boolean;
  volume: number; // 0 to 1
  rate?: number; // speech rate 0.5 to 2
}

export function useVoiceCoach({ enabled, volume, rate = 0.9 }: UseVoiceCoachOptions) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const queueRef = useRef<string[]>([]);
  const isSpeakingRef = useRef(false);

  useEffect(() => {
    setIsSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  const stop = useCallback(() => {
    if (!isSupported) return;
    queueRef.current = [];
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    isSpeakingRef.current = false;
  }, [isSupported]);

  const processQueue = useCallback(() => {
    if (!isSupported || !enabled || queueRef.current.length === 0) {
      setIsSpeaking(false);
      isSpeakingRef.current = false;
      return;
    }

    const text = queueRef.current.shift()!;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = volume;
    utterance.rate = rate;
    utterance.pitch = 1.0;

    // Pick a good English voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Daniel") || v.name.includes("Natural"))
    ) || voices.find((v) => v.lang.startsWith("en"));
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onend = () => {
      processQueue();
    };
    utterance.onerror = () => {
      processQueue();
    };

    utteranceRef.current = utterance;
    setIsSpeaking(true);
    isSpeakingRef.current = true;
    window.speechSynthesis.speak(utterance);
  }, [enabled, volume, rate, isSupported]);

  const speak = useCallback(
    (text: string, interrupt = false) => {
      if (!isSupported || !enabled) return;
      if (interrupt) {
        window.speechSynthesis.cancel();
        queueRef.current = [text];
      } else {
        queueRef.current.push(text);
      }
      if (!isSpeakingRef.current) {
        processQueue();
      }
    },
    [enabled, isSupported, processQueue]
  );

  const speakStep = useCallback(
    (instruction: string, muscleCue?: string, breathingCue?: string) => {
      if (!enabled || !isSupported) return;
      // Combine into one natural sentence
      let fullText = instruction;
      if (breathingCue) fullText += ` ${breathingCue}`;
      if (muscleCue) fullText += ` ${muscleCue}`;
      speak(fullText, true);
    },
    [enabled, isSupported, speak]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  // Stop when disabled
  useEffect(() => {
    if (!enabled) stop();
  }, [enabled, stop]);

  // Load voices (some browsers load async)
  useEffect(() => {
    if (!isSupported) return;
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }, [isSupported]);

  return { speak, speakStep, stop, isSpeaking, isSupported };
}
