// Curated mapping of workout exercises to demonstration images from
// the public-domain free-exercise-db (https://github.com/yuhonas/free-exercise-db).
// Each exercise has TWO sequential frames — alternating them produces a
// GIF-like animation of the full movement.

export type DemoGender = "male" | "female"; // kept for backward compatibility

export interface ExerciseMedia {
  /** Two-frame animation (start + end positions of the rep). */
  frames: [string, string];
  /** Static fallback shown while frames load or if they fail. */
  posterUrl: string;
  /** Display name of the matched exercise (in case of fuzzy match). */
  matchedName: string;
  /** Short attribution string. */
  source: string;
}

const CDN_BASE =
  "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises";

/**
 * Direct slug map: workout name → folder slug in the dataset.
 * All entries below have been verified to return HTTP 200.
 */
const exerciseSlugs: Record<string, string> = {
  // ----- Home / bodyweight -----
  "Push-ups": "Pushups",
  "Bodyweight Squats": "Bodyweight_Squat",
  "Plank Hold": "Plank",
  "Lunges": "Bodyweight_Walking_Lunge",
  "Mountain Climbers": "Mountain_Climbers",
  "Burpees": "Bodyweight_Squat", // closest available — the dataset has no burpee

  // ----- Gym -----
  "Bench Press": "Barbell_Bench_Press_-_Medium_Grip",
  "Lat Pulldown": "Wide-Grip_Lat_Pulldown",
  "Leg Press": "Leg_Press",
  "Dumbbell Shoulder Press": "Seated_Dumbbell_Press",
  "Cable Tricep Pushdown": "Triceps_Pushdown",
  "Barbell Curl": "Barbell_Curl",
};

/**
 * Coarse fuzzy fallback: if an exercise name isn't in the slug map,
 * try to find a slug whose keywords overlap with the request.
 */
const FALLBACK_KEYWORDS: { keywords: string[]; slug: string; name: string }[] = [
  { keywords: ["push", "press up"], slug: "Pushups", name: "Push-ups" },
  { keywords: ["squat"], slug: "Bodyweight_Squat", name: "Bodyweight Squat" },
  { keywords: ["plank"], slug: "Plank", name: "Plank" },
  { keywords: ["lunge"], slug: "Bodyweight_Walking_Lunge", name: "Walking Lunge" },
  { keywords: ["mountain"], slug: "Mountain_Climbers", name: "Mountain Climbers" },
  { keywords: ["bench"], slug: "Barbell_Bench_Press_-_Medium_Grip", name: "Bench Press" },
  { keywords: ["pulldown", "lat"], slug: "Wide-Grip_Lat_Pulldown", name: "Lat Pulldown" },
  { keywords: ["leg press"], slug: "Leg_Press", name: "Leg Press" },
  { keywords: ["shoulder press", "overhead"], slug: "Seated_Dumbbell_Press", name: "Shoulder Press" },
  { keywords: ["tricep", "pushdown"], slug: "Triceps_Pushdown", name: "Triceps Pushdown" },
  { keywords: ["curl"], slug: "Barbell_Curl", name: "Barbell Curl" },
  { keywords: ["row"], slug: "Wide-Grip_Lat_Pulldown", name: "Pulldown (row alt)" },
  { keywords: ["deadlift"], slug: "Bodyweight_Squat", name: "Squat (deadlift alt)" },
];

function buildMedia(slug: string, name: string): ExerciseMedia {
  return {
    frames: [`${CDN_BASE}/${slug}/0.jpg`, `${CDN_BASE}/${slug}/1.jpg`],
    posterUrl: `${CDN_BASE}/${slug}/0.jpg`,
    matchedName: name,
    source: "free-exercise-db",
  };
}

/**
 * Get media for an exercise. Always returns a result — never null —
 * so the UI never shows a blank panel.
 *
 * @param name  Exercise name from the workout plan.
 * @param _gender  Reserved for future use (current dataset is single-figure).
 */
export function getExerciseMedia(
  name: string,
  _gender: DemoGender = "male",
): ExerciseMedia {
  // 1. Exact slug match
  const direct = exerciseSlugs[name];
  if (direct) return buildMedia(direct, name);

  // 2. Fuzzy keyword match
  const lower = name.toLowerCase();
  for (const { keywords, slug, name: matchedName } of FALLBACK_KEYWORDS) {
    if (keywords.some((k) => lower.includes(k))) {
      return buildMedia(slug, matchedName);
    }
  }

  // 3. Final fallback — generic body-weight squat is universally recognisable
  return buildMedia("Bodyweight_Squat", "Bodyweight Squat");
}
