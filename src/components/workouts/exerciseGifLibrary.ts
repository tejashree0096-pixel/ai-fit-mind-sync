// Curated library of high-quality exercise demo GIFs/videos.
// Sources: musclewiki public CDN (d205bpvrqc9yn1.cloudfront.net) — free demonstrations.
// Each entry maps an exercise name to a primary video (MP4) and a fallback poster image.

export interface ExerciseMedia {
  /** Primary MP4 demo (looped, muted, plays inline). */
  videoUrl: string;
  /** Fallback static image / poster shown while the video loads or if it fails. */
  posterUrl: string;
  /** Short attribution string. */
  source: string;
}

// Musclewiki public CDN — male model, front view.
const MW = "https://media.musclewiki.com/media/uploads/videos/branded/male";
const MW_THUMB = "https://media.musclewiki.com/media/uploads/video-thumbnails";

export const exerciseGifLibrary: Record<string, ExerciseMedia> = {
  // ----- Home / bodyweight -----
  "Push-ups": {
    videoUrl: `${MW}-bodyweight-pushup-front.mp4`,
    posterUrl: `${MW_THUMB}/male-bodyweight-pushup-front.png`,
    source: "MuscleWiki",
  },
  "Bodyweight Squats": {
    videoUrl: `${MW}-bodyweight-squat-front.mp4`,
    posterUrl: `${MW_THUMB}/male-bodyweight-squat-front.png`,
    source: "MuscleWiki",
  },
  "Plank Hold": {
    videoUrl: `${MW}-bodyweight-plank-side.mp4`,
    posterUrl: `${MW_THUMB}/male-bodyweight-plank-side.png`,
    source: "MuscleWiki",
  },
  Lunges: {
    videoUrl: `${MW}-bodyweight-lunge-side.mp4`,
    posterUrl: `${MW_THUMB}/male-bodyweight-lunge-side.png`,
    source: "MuscleWiki",
  },
  "Mountain Climbers": {
    videoUrl: `${MW}-bodyweight-mountainclimber-side.mp4`,
    posterUrl: `${MW_THUMB}/male-bodyweight-mountainclimber-side.png`,
    source: "MuscleWiki",
  },
  Burpees: {
    videoUrl: `${MW}-bodyweight-burpee-side.mp4`,
    posterUrl: `${MW_THUMB}/male-bodyweight-burpee-side.png`,
    source: "MuscleWiki",
  },

  // ----- Gym -----
  "Bench Press": {
    videoUrl: `${MW}-barbell-benchpress-side.mp4`,
    posterUrl: `${MW_THUMB}/male-barbell-benchpress-side.png`,
    source: "MuscleWiki",
  },
  "Lat Pulldown": {
    videoUrl: `${MW}-cable-latpulldown-front.mp4`,
    posterUrl: `${MW_THUMB}/male-cable-latpulldown-front.png`,
    source: "MuscleWiki",
  },
  "Leg Press": {
    videoUrl: `${MW}-machine-legpress-side.mp4`,
    posterUrl: `${MW_THUMB}/male-machine-legpress-side.png`,
    source: "MuscleWiki",
  },
  "Dumbbell Shoulder Press": {
    videoUrl: `${MW}-dumbbell-seatedshoulderpress-front.mp4`,
    posterUrl: `${MW_THUMB}/male-dumbbell-seatedshoulderpress-front.png`,
    source: "MuscleWiki",
  },
  "Cable Tricep Pushdown": {
    videoUrl: `${MW}-cable-tricepspushdown-front.mp4`,
    posterUrl: `${MW_THUMB}/male-cable-tricepspushdown-front.png`,
    source: "MuscleWiki",
  },
  "Barbell Curl": {
    videoUrl: `${MW}-barbell-curl-front.mp4`,
    posterUrl: `${MW_THUMB}/male-barbell-curl-front.png`,
    source: "MuscleWiki",
  },
};

/** Get media for an exercise, with a graceful default. */
export function getExerciseMedia(name: string): ExerciseMedia | null {
  return exerciseGifLibrary[name] ?? null;
}
