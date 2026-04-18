// Curated library of high-quality exercise demo videos.
// Sources: musclewiki public CDN (media.musclewiki.com) — free demonstrations.
// Each exercise has both male and female demonstrators.

export type DemoGender = "male" | "female";

export interface ExerciseMedia {
  /** Primary MP4 demo (looped, muted, plays inline). */
  videoUrl: string;
  /** Fallback static image / poster shown while the video loads or if it fails. */
  posterUrl: string;
  /** Short attribution string. */
  source: string;
}

const VID_BASE = "https://media.musclewiki.com/media/uploads/videos/branded";
const THUMB_BASE = "https://media.musclewiki.com/media/uploads/video-thumbnails";

/** Slug suffix for each exercise (without the gender prefix). */
const exerciseSlugs: Record<string, string> = {
  // ----- Home / bodyweight -----
  "Push-ups": "bodyweight-pushup-front",
  "Bodyweight Squats": "bodyweight-squat-front",
  "Plank Hold": "bodyweight-plank-side",
  Lunges: "bodyweight-lunge-side",
  "Mountain Climbers": "bodyweight-mountainclimber-side",
  Burpees: "bodyweight-burpee-side",

  // ----- Gym -----
  "Bench Press": "barbell-benchpress-side",
  "Lat Pulldown": "cable-latpulldown-front",
  "Leg Press": "machine-legpress-side",
  "Dumbbell Shoulder Press": "dumbbell-seatedshoulderpress-front",
  "Cable Tricep Pushdown": "cable-tricepspushdown-front",
  "Barbell Curl": "barbell-curl-front",
};

/** Get media for an exercise + chosen gender. */
export function getExerciseMedia(
  name: string,
  gender: DemoGender,
): ExerciseMedia | null {
  const slug = exerciseSlugs[name];
  if (!slug) return null;
  return {
    videoUrl: `${VID_BASE}/${gender}-${slug}.mp4`,
    posterUrl: `${THUMB_BASE}/${gender}-${slug}.png`,
    source: "MuscleWiki",
  };
}
