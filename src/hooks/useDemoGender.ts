import { useEffect, useState } from "react";
import type { DemoGender } from "@/components/workouts/exerciseGifLibrary";

const STORAGE_KEY = "demo-gender-preference";

/** Persisted preference for which demonstrator gender to show in exercise videos. */
export function useDemoGender(): [DemoGender, (g: DemoGender) => void] {
  const [gender, setGenderState] = useState<DemoGender>(() => {
    if (typeof window === "undefined") return "male";
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "female" ? "female" : "male";
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, gender);
    } catch {
      /* ignore quota errors */
    }
  }, [gender]);

  return [gender, setGenderState];
}
