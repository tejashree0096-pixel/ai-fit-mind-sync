import { useCallback, useRef, useState, useEffect } from "react";

interface UseVoiceCoachOptions {
  enabled: boolean;
  volume: number; // 0 to 1
  rate?: number; // speech rate 0.5 to 2
  onSpeechEnd?: () => void; // callback when current speech finishes
}

export function useVoiceCoach({ enabled, volume, rate = 0.7, onSpeechEnd }: UseVoiceCoachOptions) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const queueRef = useRef<{ text: string; pauseAfterMs: number }[]>([]);
  const isSpeakingRef = useRef(false);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onSpeechEndRef = useRef(onSpeechEnd);

  useEffect(() => {
    onSpeechEndRef.current = onSpeechEnd;
  }, [onSpeechEnd]);

  useEffect(() => {
    setIsSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  const clearPauseTimer = useCallback(() => {
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    if (!isSupported) return;
    queueRef.current = [];
    clearPauseTimer();
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    isSpeakingRef.current = false;
  }, [isSupported, clearPauseTimer]);

  const processQueue = useCallback(() => {
    if (!isSupported || !enabled || queueRef.current.length === 0) {
      setIsSpeaking(false);
      isSpeakingRef.current = false;
      onSpeechEndRef.current?.();
      return;
    }

    const { text, pauseAfterMs } = queueRef.current.shift()!;
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
      // Add a natural pause after this utterance before processing next
      if (pauseAfterMs > 0 && queueRef.current.length > 0) {
        pauseTimerRef.current = setTimeout(() => {
          processQueue();
        }, pauseAfterMs);
      } else {
        processQueue();
      }
    };
    utterance.onerror = () => {
      processQueue();
    };

    utteranceRef.current = utterance;
    setIsSpeaking(true);
    isSpeakingRef.current = true;
    window.speechSynthesis.speak(utterance);
  }, [enabled, volume, rate, isSupported]);

  // Speak with optional pause after
  const speak = useCallback(
    (text: string, interrupt = false, pauseAfterMs = 0) => {
      if (!isSupported || !enabled) return;
      if (interrupt) {
        clearPauseTimer();
        window.speechSynthesis.cancel();
        queueRef.current = [{ text, pauseAfterMs }];
      } else {
        queueRef.current.push({ text, pauseAfterMs });
      }
      if (!isSpeakingRef.current) {
        processQueue();
      }
    },
    [enabled, isSupported, processQueue, clearPauseTimer]
  );

  // Speak a coaching step with natural pauses between parts
  const speakStep = useCallback(
    (instruction: string, muscleCue?: string, breathingCue?: string, isShortCue = false) => {
      if (!enabled || !isSupported) return;

      if (isShortCue) {
        // For repeat reps, just speak the short instruction
        speak(instruction, true, 0);
        return;
      }

      // Clear previous and speak instruction first with a pause after
      clearPauseTimer();
      window.speechSynthesis.cancel();
      queueRef.current = [];
      isSpeakingRef.current = false;

      // Main instruction - pause 1.5s after
      speak(instruction, false, 1500);
      // Breathing cue - pause 1s after
      if (breathingCue) speak(breathingCue, false, 1000);
      // Muscle cue - pause 2s after (let them feel it)
      if (muscleCue) speak(muscleCue, false, 2000);
    },
    [enabled, isSupported, speak, clearPauseTimer]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearPauseTimer();
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported, clearPauseTimer]);

  // Stop when disabled
  useEffect(() => {
    if (!enabled) stop();
  }, [enabled, stop]);

  // Load voices
  useEffect(() => {
    if (!isSupported) return;
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }, [isSupported]);

  return { speak, speakStep, stop, isSpeaking, isSupported };
}
