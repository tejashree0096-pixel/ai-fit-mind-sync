import { useEffect, useRef, useState } from "react";
import { Dumbbell, Loader2 } from "lucide-react";
import { getExerciseMedia, type DemoGender } from "./exerciseGifLibrary";

interface ExerciseVideoPlayerProps {
  exerciseName: string;
  isPlaying: boolean;
  speed: number;
  gender: DemoGender;
}

/**
 * Animates two demonstration frames as a looping GIF-like player.
 * Frames come from the public-domain free-exercise-db (always available).
 *
 * - Preloads both frames so the swap is instant (no flicker).
 * - Speed prop scales the per-frame duration.
 * - Pausing freezes on the current frame.
 * - If both frames fail to load, shows a styled placeholder.
 */
export const ExerciseVideoPlayer = ({
  exerciseName,
  isPlaying,
  speed,
  gender,
}: ExerciseVideoPlayerProps) => {
  const media = getExerciseMedia(exerciseName, gender);
  const [frameIndex, setFrameIndex] = useState(0);
  const [loadedFrames, setLoadedFrames] = useState<boolean[]>([false, false]);
  const [allFailed, setAllFailed] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // Reset when exercise changes
  useEffect(() => {
    setFrameIndex(0);
    setLoadedFrames([false, false]);
    setAllFailed(false);

    // Preload both frames in parallel
    const loaders: HTMLImageElement[] = [];
    let failures = 0;
    media.frames.forEach((src, i) => {
      const img = new Image();
      img.onload = () =>
        setLoadedFrames((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      img.onerror = () => {
        failures += 1;
        if (failures === media.frames.length) setAllFailed(true);
      };
      img.src = src;
      loaders.push(img);
    });

    return () => {
      loaders.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [exerciseName, media.frames[0], media.frames[1]]);

  // Frame-swap animation loop
  useEffect(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (!isPlaying) return;
    if (!loadedFrames[0] || !loadedFrames[1]) return;

    // ~700ms per frame at 1×, scales with speed
    const delay = Math.max(120, 700 / speed);
    intervalRef.current = window.setInterval(() => {
      setFrameIndex((i) => (i === 0 ? 1 : 0));
    }, delay);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, speed, loadedFrames]);

  if (allFailed) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2 px-3 text-center">
        <Dumbbell className="w-10 h-10 text-primary/40" />
        <span className="text-[11px] font-semibold text-foreground/80">
          {exerciseName}
        </span>
        <span className="text-[10px] text-muted-foreground">
          Demo unavailable — follow the steps below
        </span>
      </div>
    );
  }

  const isReady = loadedFrames[0] && loadedFrames[1];

  return (
    <div className="relative w-full h-full">
      {/* Loading state */}
      {!isReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/40">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
          <span className="text-[10px] text-muted-foreground">Loading demo…</span>
        </div>
      )}

      {/* Both frames rendered, only one visible — gives instant swap */}
      {media.frames.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`${media.matchedName} — frame ${i + 1}`}
          className="absolute inset-0 w-full h-full object-contain transition-opacity duration-150"
          style={{ opacity: isReady && frameIndex === i ? 1 : 0 }}
          loading="lazy"
          draggable={false}
        />
      ))}

      {/* Attribution / fuzzy-match note */}
      {isReady && media.matchedName !== exerciseName && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] text-muted-foreground bg-card/80 px-1.5 py-0.5 rounded">
          showing: {media.matchedName}
        </div>
      )}
    </div>
  );
};
