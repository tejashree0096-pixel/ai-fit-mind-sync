import { useEffect, useRef, useState } from "react";
import { Dumbbell } from "lucide-react";
import { getExerciseMedia } from "./exerciseGifLibrary";

interface ExerciseVideoPlayerProps {
  exerciseName: string;
  isPlaying: boolean;
  speed: number;
}

/**
 * Plays a real-world exercise demo video (looped, muted, autoplays inline).
 * Falls back to a poster image, then to a styled placeholder if the asset fails.
 */
export const ExerciseVideoPlayer = ({
  exerciseName,
  isPlaying,
  speed,
}: ExerciseVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  const media = getExerciseMedia(exerciseName);

  // Reset failure flags when exercise changes
  useEffect(() => {
    setVideoFailed(false);
    setPosterFailed(false);
  }, [exerciseName]);

  // Sync playback state and speed
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = speed;
    if (isPlaying) {
      video.play().catch(() => {
        /* autoplay may be blocked; user can tap to retry */
      });
    } else {
      video.pause();
    }
  }, [isPlaying, speed, exerciseName]);

  if (!media || videoFailed) {
    // Fallback to poster image, then to placeholder
    if (media && !posterFailed) {
      return (
        <img
          src={media.posterUrl}
          alt={`${exerciseName} demonstration`}
          className="w-full h-full object-contain"
          onError={() => setPosterFailed(true)}
          loading="lazy"
        />
      );
    }
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
        <Dumbbell className="w-10 h-10 text-primary/40" />
        <span className="text-[10px] font-medium">Demo unavailable</span>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      src={media.videoUrl}
      poster={media.posterUrl}
      className="w-full h-full object-contain"
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      onError={() => setVideoFailed(true)}
    />
  );
};
