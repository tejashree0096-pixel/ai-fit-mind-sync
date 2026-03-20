// Realistic human figure animation data with biomechanically correct poses
// Each pose defines joint positions for: head, neck, shoulders, elbows, hands, hips, knees, feet, torso

export interface JointPositions {
  head: [number, number];
  neck: [number, number];
  shoulderL: [number, number];
  shoulderR: [number, number];
  elbowL: [number, number];
  elbowR: [number, number];
  handL: [number, number];
  handR: [number, number];
  hipL: [number, number];
  hipR: [number, number];
  kneeL: [number, number];
  kneeR: [number, number];
  footL: [number, number];
  footR: [number, number];
  torsoMid: [number, number];
}

export interface ExerciseStep {
  label: string;
  pose: JointPositions;
}

export interface ExerciseAnimation {
  steps: ExerciseStep[];
  tips: string[];
  muscles: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

// Standing neutral pose (base)
const standing: JointPositions = {
  head: [50, 14],
  neck: [50, 22],
  shoulderL: [38, 26],
  shoulderR: [62, 26],
  elbowL: [34, 40],
  elbowR: [66, 40],
  handL: [32, 54],
  handR: [68, 54],
  hipL: [43, 52],
  hipR: [57, 52],
  kneeL: [42, 70],
  kneeR: [58, 70],
  footL: [40, 88],
  footR: [60, 88],
  torsoMid: [50, 38],
};

export const exerciseAnimationData: Record<string, ExerciseAnimation> = {
  "Push-ups": {
    steps: [
      {
        label: "High plank position",
        pose: {
          head: [25, 32], neck: [30, 34], shoulderL: [34, 36], shoulderR: [34, 32],
          elbowL: [34, 50], elbowR: [34, 46], handL: [34, 62], handR: [34, 58],
          hipL: [58, 38], hipR: [58, 34], kneeL: [72, 40], kneeR: [72, 36],
          footL: [84, 42], footR: [84, 38], torsoMid: [46, 36],
        },
      },
      {
        label: "Lower chest to ground",
        pose: {
          head: [25, 40], neck: [30, 42], shoulderL: [34, 44], shoulderR: [34, 40],
          elbowL: [28, 52], elbowR: [28, 48], handL: [34, 62], handR: [34, 58],
          hipL: [58, 44], hipR: [58, 40], kneeL: [72, 44], kneeR: [72, 40],
          footL: [84, 46], footR: [84, 42], torsoMid: [46, 43],
        },
      },
      {
        label: "Bottom position — chest near floor",
        pose: {
          head: [25, 46], neck: [30, 48], shoulderL: [34, 50], shoulderR: [34, 46],
          elbowL: [24, 54], elbowR: [24, 50], handL: [34, 62], handR: [34, 58],
          hipL: [58, 48], hipR: [58, 44], kneeL: [72, 48], kneeR: [72, 44],
          footL: [84, 50], footR: [84, 46], torsoMid: [46, 48],
        },
      },
      {
        label: "Push back up — extend arms",
        pose: {
          head: [25, 40], neck: [30, 42], shoulderL: [34, 44], shoulderR: [34, 40],
          elbowL: [28, 52], elbowR: [28, 48], handL: [34, 62], handR: [34, 58],
          hipL: [58, 44], hipR: [58, 40], kneeL: [72, 44], kneeR: [72, 40],
          footL: [84, 46], footR: [84, 42], torsoMid: [46, 43],
        },
      },
      {
        label: "Return to high plank",
        pose: {
          head: [25, 32], neck: [30, 34], shoulderL: [34, 36], shoulderR: [34, 32],
          elbowL: [34, 50], elbowR: [34, 46], handL: [34, 62], handR: [34, 58],
          hipL: [58, 38], hipR: [58, 34], kneeL: [72, 40], kneeR: [72, 36],
          footL: [84, 42], footR: [84, 38], torsoMid: [46, 36],
        },
      },
    ],
    tips: ["Keep core braced — body in a straight line", "Elbows at 45° angle, not flared", "Full range of motion to chest near floor"],
    muscles: ["Chest", "Triceps", "Core"],
    difficulty: "Beginner",
  },

  "Bodyweight Squats": {
    steps: [
      {
        label: "Stand tall — feet shoulder-width",
        pose: { ...standing },
      },
      {
        label: "Begin descent — push hips back",
        pose: {
          head: [50, 18], neck: [50, 26], shoulderL: [38, 30], shoulderR: [62, 30],
          elbowL: [30, 38], elbowR: [70, 38], handL: [26, 36], handR: [74, 36],
          hipL: [42, 54], hipR: [58, 54], kneeL: [38, 68], kneeR: [62, 68],
          footL: [40, 88], footR: [60, 88], torsoMid: [50, 42],
        },
      },
      {
        label: "Half squat — thighs at 45°",
        pose: {
          head: [50, 24], neck: [50, 32], shoulderL: [38, 36], shoulderR: [62, 36],
          elbowL: [26, 40], elbowR: [74, 40], handL: [22, 36], handR: [78, 36],
          hipL: [42, 58], hipR: [58, 58], kneeL: [34, 72], kneeR: [66, 72],
          footL: [40, 88], footR: [60, 88], torsoMid: [50, 47],
        },
      },
      {
        label: "Deep squat — thighs parallel",
        pose: {
          head: [50, 30], neck: [50, 38], shoulderL: [38, 42], shoulderR: [62, 42],
          elbowL: [24, 44], elbowR: [76, 44], handL: [20, 40], handR: [80, 40],
          hipL: [42, 62], hipR: [58, 62], kneeL: [32, 74], kneeR: [68, 74],
          footL: [40, 88], footR: [60, 88], torsoMid: [50, 52],
        },
      },
      {
        label: "Drive up through heels",
        pose: {
          head: [50, 24], neck: [50, 32], shoulderL: [38, 36], shoulderR: [62, 36],
          elbowL: [26, 40], elbowR: [74, 40], handL: [22, 36], handR: [78, 36],
          hipL: [42, 58], hipR: [58, 58], kneeL: [34, 72], kneeR: [66, 72],
          footL: [40, 88], footR: [60, 88], torsoMid: [50, 47],
        },
      },
      {
        label: "Return to standing",
        pose: { ...standing },
      },
    ],
    tips: ["Knees track over toes — never cave inward", "Keep chest up and back neutral", "Push through heels, squeeze glutes at top"],
    muscles: ["Quads", "Glutes", "Hamstrings"],
    difficulty: "Beginner",
  },

  "Plank Hold": {
    steps: [
      {
        label: "Start on forearms and toes",
        pose: {
          head: [22, 34], neck: [28, 36], shoulderL: [32, 38], shoulderR: [32, 34],
          elbowL: [32, 50], elbowR: [32, 46], handL: [24, 54], handR: [24, 50],
          hipL: [56, 40], hipR: [56, 36], kneeL: [72, 42], kneeR: [72, 38],
          footL: [86, 44], footR: [86, 40], torsoMid: [44, 38],
        },
      },
      {
        label: "Hold — body in straight line",
        pose: {
          head: [22, 34], neck: [28, 36], shoulderL: [32, 38], shoulderR: [32, 34],
          elbowL: [32, 50], elbowR: [32, 46], handL: [24, 54], handR: [24, 50],
          hipL: [56, 39], hipR: [56, 35], kneeL: [72, 41], kneeR: [72, 37],
          footL: [86, 43], footR: [86, 39], torsoMid: [44, 37],
        },
      },
      {
        label: "Breathe — maintain alignment",
        pose: {
          head: [22, 35], neck: [28, 37], shoulderL: [32, 39], shoulderR: [32, 35],
          elbowL: [32, 51], elbowR: [32, 47], handL: [24, 55], handR: [24, 51],
          hipL: [56, 40], hipR: [56, 36], kneeL: [72, 42], kneeR: [72, 38],
          footL: [86, 44], footR: [86, 40], torsoMid: [44, 38],
        },
      },
    ],
    tips: ["Don't let hips sag or pike up", "Engage core and glutes throughout", "Keep neck neutral — look at floor"],
    muscles: ["Core", "Shoulders", "Glutes"],
    difficulty: "Beginner",
  },

  "Lunges": {
    steps: [
      {
        label: "Stand upright — feet together",
        pose: {
          head: [50, 14], neck: [50, 22], shoulderL: [38, 26], shoulderR: [62, 26],
          elbowL: [36, 40], elbowR: [64, 40], handL: [36, 52], handR: [64, 52],
          hipL: [45, 52], hipR: [55, 52], kneeL: [45, 70], kneeR: [55, 70],
          footL: [45, 88], footR: [55, 88], torsoMid: [50, 38],
        },
      },
      {
        label: "Step forward with right leg",
        pose: {
          head: [50, 14], neck: [50, 22], shoulderL: [38, 26], shoulderR: [62, 26],
          elbowL: [36, 40], elbowR: [64, 40], handL: [36, 52], handR: [64, 52],
          hipL: [44, 52], hipR: [56, 52], kneeL: [42, 70], kneeR: [62, 64],
          footL: [42, 88], footR: [70, 80], torsoMid: [50, 38],
        },
      },
      {
        label: "Lower — both knees at 90°",
        pose: {
          head: [50, 18], neck: [50, 26], shoulderL: [38, 30], shoulderR: [62, 30],
          elbowL: [36, 44], elbowR: [64, 44], handL: [36, 56], handR: [64, 56],
          hipL: [44, 56], hipR: [56, 56], kneeL: [38, 76], kneeR: [66, 68],
          footL: [38, 88], footR: [74, 84], torsoMid: [50, 42],
        },
      },
      {
        label: "Drive back up to standing",
        pose: {
          head: [50, 14], neck: [50, 22], shoulderL: [38, 26], shoulderR: [62, 26],
          elbowL: [36, 40], elbowR: [64, 40], handL: [36, 52], handR: [64, 52],
          hipL: [44, 52], hipR: [56, 52], kneeL: [42, 70], kneeR: [62, 64],
          footL: [42, 88], footR: [70, 80], torsoMid: [50, 38],
        },
      },
      {
        label: "Return to start",
        pose: {
          head: [50, 14], neck: [50, 22], shoulderL: [38, 26], shoulderR: [62, 26],
          elbowL: [36, 40], elbowR: [64, 40], handL: [36, 52], handR: [64, 52],
          hipL: [45, 52], hipR: [55, 52], kneeL: [45, 70], kneeR: [55, 70],
          footL: [45, 88], footR: [55, 88], torsoMid: [50, 38],
        },
      },
    ],
    tips: ["Front knee stays over ankle, not past toes", "Keep torso upright throughout", "Back knee nearly touches the ground"],
    muscles: ["Quads", "Glutes", "Hamstrings"],
    difficulty: "Beginner",
  },

  "Mountain Climbers": {
    steps: [
      {
        label: "Start in high plank",
        pose: {
          head: [22, 32], neck: [28, 34], shoulderL: [32, 36], shoulderR: [32, 32],
          elbowL: [32, 50], elbowR: [32, 46], handL: [32, 62], handR: [32, 58],
          hipL: [58, 38], hipR: [58, 34], kneeL: [72, 40], kneeR: [72, 36],
          footL: [84, 42], footR: [84, 38], torsoMid: [44, 36],
        },
      },
      {
        label: "Drive right knee to chest",
        pose: {
          head: [22, 32], neck: [28, 34], shoulderL: [32, 36], shoulderR: [32, 32],
          elbowL: [32, 50], elbowR: [32, 46], handL: [32, 62], handR: [32, 58],
          hipL: [58, 38], hipR: [52, 36], kneeL: [72, 40], kneeR: [42, 42],
          footL: [84, 42], footR: [38, 50], torsoMid: [44, 36],
        },
      },
      {
        label: "Return right leg, drive left knee",
        pose: {
          head: [22, 32], neck: [28, 34], shoulderL: [32, 36], shoulderR: [32, 32],
          elbowL: [32, 50], elbowR: [32, 46], handL: [32, 62], handR: [32, 58],
          hipL: [52, 40], hipR: [58, 34], kneeL: [42, 46], kneeR: [72, 36],
          footL: [38, 54], footR: [84, 38], torsoMid: [44, 36],
        },
      },
      {
        label: "Alternate rapidly",
        pose: {
          head: [22, 32], neck: [28, 34], shoulderL: [32, 36], shoulderR: [32, 32],
          elbowL: [32, 50], elbowR: [32, 46], handL: [32, 62], handR: [32, 58],
          hipL: [58, 38], hipR: [52, 36], kneeL: [72, 40], kneeR: [42, 42],
          footL: [84, 42], footR: [38, 50], torsoMid: [44, 36],
        },
      },
    ],
    tips: ["Keep hips level — don't pike up", "Drive knees quickly for cardio effect", "Hands directly under shoulders"],
    muscles: ["Core", "Hip Flexors", "Shoulders"],
    difficulty: "Intermediate",
  },

  "Burpees": {
    steps: [
      {
        label: "1. Stand upright",
        pose: { ...standing },
      },
      {
        label: "2. Squat down — hands to floor",
        pose: {
          head: [50, 30], neck: [50, 38], shoulderL: [38, 42], shoulderR: [62, 42],
          elbowL: [34, 54], elbowR: [66, 54], handL: [38, 66], handR: [62, 66],
          hipL: [42, 60], hipR: [58, 60], kneeL: [34, 74], kneeR: [66, 74],
          footL: [38, 88], footR: [62, 88], torsoMid: [50, 50],
        },
      },
      {
        label: "3. Jump feet back — plank",
        pose: {
          head: [22, 36], neck: [28, 38], shoulderL: [32, 40], shoulderR: [32, 36],
          elbowL: [32, 52], elbowR: [32, 48], handL: [32, 64], handR: [32, 60],
          hipL: [58, 42], hipR: [58, 38], kneeL: [72, 44], kneeR: [72, 40],
          footL: [84, 46], footR: [84, 42], torsoMid: [44, 40],
        },
      },
      {
        label: "4. Perform push-up (down)",
        pose: {
          head: [22, 46], neck: [28, 48], shoulderL: [32, 50], shoulderR: [32, 46],
          elbowL: [24, 56], elbowR: [24, 52], handL: [32, 64], handR: [32, 60],
          hipL: [58, 50], hipR: [58, 46], kneeL: [72, 50], kneeR: [72, 46],
          footL: [84, 52], footR: [84, 48], torsoMid: [44, 49],
        },
      },
      {
        label: "5. Push up — return to plank",
        pose: {
          head: [22, 36], neck: [28, 38], shoulderL: [32, 40], shoulderR: [32, 36],
          elbowL: [32, 52], elbowR: [32, 48], handL: [32, 64], handR: [32, 60],
          hipL: [58, 42], hipR: [58, 38], kneeL: [72, 44], kneeR: [72, 40],
          footL: [84, 46], footR: [84, 42], torsoMid: [44, 40],
        },
      },
      {
        label: "6. Jump feet forward — squat",
        pose: {
          head: [50, 30], neck: [50, 38], shoulderL: [38, 42], shoulderR: [62, 42],
          elbowL: [34, 54], elbowR: [66, 54], handL: [38, 66], handR: [62, 66],
          hipL: [42, 60], hipR: [58, 60], kneeL: [34, 74], kneeR: [66, 74],
          footL: [38, 88], footR: [62, 88], torsoMid: [50, 50],
        },
      },
      {
        label: "7. Explode up — jump!",
        pose: {
          head: [50, 6], neck: [50, 14], shoulderL: [34, 16], shoulderR: [66, 16],
          elbowL: [28, 10], elbowR: [72, 10], handL: [24, 4], handR: [76, 4],
          hipL: [44, 42], hipR: [56, 42], kneeL: [42, 58], kneeR: [58, 58],
          footL: [40, 74], footR: [60, 74], torsoMid: [50, 28],
        },
      },
    ],
    tips: ["Full push-up at the bottom — chest to floor", "Explosive jump at the top — arms overhead", "Maintain rhythm — don't pause between steps"],
    muscles: ["Full Body", "Chest", "Legs", "Core"],
    difficulty: "Advanced",
  },

  "Bench Press": {
    steps: [
      {
        label: "Lie on bench — grip bar wide",
        pose: {
          head: [18, 44], neck: [24, 44], shoulderL: [30, 42], shoulderR: [30, 46],
          elbowL: [30, 34], elbowR: [30, 54], handL: [44, 28], handR: [44, 60],
          hipL: [56, 44], hipR: [56, 46], kneeL: [72, 56], kneeR: [72, 58],
          footL: [82, 68], footR: [82, 70], torsoMid: [42, 44],
        },
      },
      {
        label: "Unrack — arms extended above chest",
        pose: {
          head: [18, 44], neck: [24, 44], shoulderL: [30, 42], shoulderR: [30, 46],
          elbowL: [36, 34], elbowR: [36, 54], handL: [44, 32], handR: [44, 56],
          hipL: [56, 44], hipR: [56, 46], kneeL: [72, 56], kneeR: [72, 58],
          footL: [82, 68], footR: [82, 70], torsoMid: [42, 44],
        },
      },
      {
        label: "Lower bar to mid-chest",
        pose: {
          head: [18, 44], neck: [24, 44], shoulderL: [30, 42], shoulderR: [30, 46],
          elbowL: [34, 28], elbowR: [34, 60], handL: [38, 34], handR: [38, 54],
          hipL: [56, 44], hipR: [56, 46], kneeL: [72, 56], kneeR: [72, 58],
          footL: [82, 68], footR: [82, 70], torsoMid: [42, 44],
        },
      },
      {
        label: "Bar touches chest — pause",
        pose: {
          head: [18, 44], neck: [24, 44], shoulderL: [30, 42], shoulderR: [30, 46],
          elbowL: [32, 26], elbowR: [32, 62], handL: [34, 36], handR: [34, 52],
          hipL: [56, 44], hipR: [56, 46], kneeL: [72, 56], kneeR: [72, 58],
          footL: [82, 68], footR: [82, 70], torsoMid: [42, 44],
        },
      },
      {
        label: "Press up — drive through chest",
        pose: {
          head: [18, 44], neck: [24, 44], shoulderL: [30, 42], shoulderR: [30, 46],
          elbowL: [36, 34], elbowR: [36, 54], handL: [44, 32], handR: [44, 56],
          hipL: [56, 44], hipR: [56, 46], kneeL: [72, 56], kneeR: [72, 58],
          footL: [82, 68], footR: [82, 70], torsoMid: [42, 44],
        },
      },
    ],
    tips: ["Retract shoulder blades — arch upper back slightly", "Feet flat on floor, drive through legs", "Control the descent — 2-3 seconds down"],
    muscles: ["Chest", "Triceps", "Front Delts"],
    difficulty: "Intermediate",
  },

  "Lat Pulldown": {
    steps: [
      {
        label: "Grip bar wide — arms extended",
        pose: {
          head: [50, 18], neck: [50, 26], shoulderL: [38, 30], shoulderR: [62, 30],
          elbowL: [30, 16], elbowR: [70, 16], handL: [26, 8], handR: [74, 8],
          hipL: [44, 54], hipR: [56, 54], kneeL: [44, 72], kneeR: [56, 72],
          footL: [44, 88], footR: [56, 88], torsoMid: [50, 42],
        },
      },
      {
        label: "Pull bar down — elbows drive back",
        pose: {
          head: [50, 18], neck: [50, 26], shoulderL: [38, 30], shoulderR: [62, 30],
          elbowL: [28, 30], elbowR: [72, 30], handL: [32, 18], handR: [68, 18],
          hipL: [44, 54], hipR: [56, 54], kneeL: [44, 72], kneeR: [56, 72],
          footL: [44, 88], footR: [56, 88], torsoMid: [50, 42],
        },
      },
      {
        label: "Bar to upper chest — squeeze lats",
        pose: {
          head: [50, 18], neck: [50, 26], shoulderL: [38, 30], shoulderR: [62, 30],
          elbowL: [26, 42], elbowR: [74, 42], handL: [36, 30], handR: [64, 30],
          hipL: [44, 54], hipR: [56, 54], kneeL: [44, 72], kneeR: [56, 72],
          footL: [44, 88], footR: [56, 88], torsoMid: [50, 42],
        },
      },
      {
        label: "Slowly release — control the negative",
        pose: {
          head: [50, 18], neck: [50, 26], shoulderL: [38, 30], shoulderR: [62, 30],
          elbowL: [28, 30], elbowR: [72, 30], handL: [32, 18], handR: [68, 18],
          hipL: [44, 54], hipR: [56, 54], kneeL: [44, 72], kneeR: [56, 72],
          footL: [44, 88], footR: [56, 88], torsoMid: [50, 42],
        },
      },
      {
        label: "Full stretch at top",
        pose: {
          head: [50, 18], neck: [50, 26], shoulderL: [38, 30], shoulderR: [62, 30],
          elbowL: [30, 16], elbowR: [70, 16], handL: [26, 8], handR: [74, 8],
          hipL: [44, 54], hipR: [56, 54], kneeL: [44, 72], kneeR: [56, 72],
          footL: [44, 88], footR: [56, 88], torsoMid: [50, 42],
        },
      },
    ],
    tips: ["Lean back slightly — lead with chest", "Pull elbows down and back, not just hands", "Full stretch at the top — feel the lats lengthen"],
    muscles: ["Lats", "Biceps", "Rear Delts"],
    difficulty: "Beginner",
  },

  "Leg Press": {
    steps: [
      {
        label: "Seated — feet on platform",
        pose: {
          head: [20, 36], neck: [26, 38], shoulderL: [30, 42], shoulderR: [30, 38],
          elbowL: [28, 52], elbowR: [28, 48], handL: [24, 56], handR: [24, 52],
          hipL: [40, 56], hipR: [40, 52], kneeL: [52, 46], kneeR: [52, 42],
          footL: [64, 36], footR: [64, 32], torsoMid: [34, 46],
        },
      },
      {
        label: "Release safety — lower platform",
        pose: {
          head: [20, 36], neck: [26, 38], shoulderL: [30, 42], shoulderR: [30, 38],
          elbowL: [28, 52], elbowR: [28, 48], handL: [24, 56], handR: [24, 52],
          hipL: [40, 56], hipR: [40, 52], kneeL: [46, 50], kneeR: [46, 46],
          footL: [56, 40], footR: [56, 36], torsoMid: [34, 46],
        },
      },
      {
        label: "Knees toward chest — deep bend",
        pose: {
          head: [20, 38], neck: [26, 40], shoulderL: [30, 44], shoulderR: [30, 40],
          elbowL: [28, 54], elbowR: [28, 50], handL: [24, 58], handR: [24, 54],
          hipL: [40, 58], hipR: [40, 54], kneeL: [42, 54], kneeR: [42, 50],
          footL: [48, 44], footR: [48, 40], torsoMid: [34, 48],
        },
      },
      {
        label: "Press up — extend legs",
        pose: {
          head: [20, 36], neck: [26, 38], shoulderL: [30, 42], shoulderR: [30, 38],
          elbowL: [28, 52], elbowR: [28, 48], handL: [24, 56], handR: [24, 52],
          hipL: [40, 56], hipR: [40, 52], kneeL: [52, 46], kneeR: [52, 42],
          footL: [64, 36], footR: [64, 32], torsoMid: [34, 46],
        },
      },
    ],
    tips: ["Don't lock knees at the top", "Keep lower back pressed into seat", "Feet shoulder-width apart on platform"],
    muscles: ["Quads", "Glutes", "Hamstrings"],
    difficulty: "Beginner",
  },

  "Dumbbell Shoulder Press": {
    steps: [
      {
        label: "Dumbbells at shoulder height",
        pose: {
          head: [50, 14], neck: [50, 22], shoulderL: [38, 26], shoulderR: [62, 26],
          elbowL: [30, 34], elbowR: [70, 34], handL: [30, 22], handR: [70, 22],
          hipL: [44, 54], hipR: [56, 54], kneeL: [44, 72], kneeR: [56, 72],
          footL: [44, 88], footR: [56, 88], torsoMid: [50, 40],
        },
      },
      {
        label: "Press up — extend arms overhead",
        pose: {
          head: [50, 14], neck: [50, 22], shoulderL: [38, 26], shoulderR: [62, 26],
          elbowL: [32, 20], elbowR: [68, 20], handL: [34, 10], handR: [66, 10],
          hipL: [44, 54], hipR: [56, 54], kneeL: [44, 72], kneeR: [56, 72],
          footL: [44, 88], footR: [56, 88], torsoMid: [50, 40],
        },
      },
      {
        label: "Full lockout — arms straight",
        pose: {
          head: [50, 14], neck: [50, 22], shoulderL: [38, 26], shoulderR: [62, 26],
          elbowL: [36, 14], elbowR: [64, 14], handL: [36, 4], handR: [64, 4],
          hipL: [44, 54], hipR: [56, 54], kneeL: [44, 72], kneeR: [56, 72],
          footL: [44, 88], footR: [56, 88], torsoMid: [50, 40],
        },
      },
      {
        label: "Lower with control",
        pose: {
          head: [50, 14], neck: [50, 22], shoulderL: [38, 26], shoulderR: [62, 26],
          elbowL: [32, 20], elbowR: [68, 20], handL: [34, 10], handR: [66, 10],
          hipL: [44, 54], hipR: [56, 54], kneeL: [44, 72], kneeR: [56, 72],
          footL: [44, 88], footR: [56, 88], torsoMid: [50, 40],
        },
      },
      {
        label: "Return to shoulders",
        pose: {
          head: [50, 14], neck: [50, 22], shoulderL: [38, 26], shoulderR: [62, 26],
          elbowL: [30, 34], elbowR: [70, 34], handL: [30, 22], handR: [70, 22],
          hipL: [44, 54], hipR: [56, 54], kneeL: [44, 72], kneeR: [56, 72],
          footL: [44, 88], footR: [56, 88], torsoMid: [50, 40],
        },
      },
    ],
    tips: ["Don't arch lower back — brace core", "Press in a slight arc, not straight up", "Control the negative — 2 seconds down"],
    muscles: ["Shoulders", "Triceps", "Upper Chest"],
    difficulty: "Intermediate",
  },

  "Cable Tricep Pushdown": {
    steps: [
      {
        label: "Grip cable bar — elbows at sides",
        pose: {
          head: [50, 14], neck: [50, 22], shoulderL: [40, 26], shoulderR: [60, 26],
          elbowL: [40, 40], elbowR: [60, 40], handL: [44, 32], handR: [56, 32],
          hipL: [44, 54], hipR: [56, 54], kneeL: [44, 72], kneeR: [56, 72],
          footL: [44, 88], footR: [56, 88], torsoMid: [50, 40],
        },
      },
      {
        label: "Push down — extend forearms",
        pose: {
          head: [50, 14], neck: [50, 22], shoulderL: [40, 26], shoulderR: [60, 26],
          elbowL: [40, 40], elbowR: [60, 40], handL: [42, 46], handR: [58, 46],
          hipL: [44, 54], hipR: [56, 54], kneeL: [44, 72], kneeR: [56, 72],
          footL: [44, 88], footR: [56, 88], torsoMid: [50, 40],
        },
      },
      {
        label: "Full extension — squeeze triceps",
        pose: {
          head: [50, 14], neck: [50, 22], shoulderL: [40, 26], shoulderR: [60, 26],
          elbowL: [40, 40], elbowR: [60, 40], handL: [40, 54], handR: [60, 54],
          hipL: [44, 54], hipR: [56, 54], kneeL: [44, 72], kneeR: [56, 72],
          footL: [44, 88], footR: [56, 88], torsoMid: [50, 40],
        },
      },
      {
        label: "Slowly return — resist the pull",
        pose: {
          head: [50, 14], neck: [50, 22], shoulderL: [40, 26], shoulderR: [60, 26],
          elbowL: [40, 40], elbowR: [60, 40], handL: [44, 32], handR: [56, 32],
          hipL: [44, 54], hipR: [56, 54], kneeL: [44, 72], kneeR: [56, 72],
          footL: [44, 88], footR: [56, 88], torsoMid: [50, 40],
        },
      },
    ],
    tips: ["Keep elbows pinned to your sides", "Only forearms move — upper arms stay fixed", "Squeeze at the bottom for 1 second"],
    muscles: ["Triceps"],
    difficulty: "Beginner",
  },

  "Barbell Curl": {
    steps: [
      {
        label: "Stand — bar at thighs",
        pose: {
          head: [50, 14], neck: [50, 22], shoulderL: [38, 26], shoulderR: [62, 26],
          elbowL: [36, 40], elbowR: [64, 40], handL: [40, 54], handR: [60, 54],
          hipL: [44, 52], hipR: [56, 52], kneeL: [44, 70], kneeR: [56, 70],
          footL: [44, 88], footR: [56, 88], torsoMid: [50, 38],
        },
      },
      {
        label: "Curl up — forearms rise",
        pose: {
          head: [50, 14], neck: [50, 22], shoulderL: [38, 26], shoulderR: [62, 26],
          elbowL: [36, 40], elbowR: [64, 40], handL: [38, 40], handR: [62, 40],
          hipL: [44, 52], hipR: [56, 52], kneeL: [44, 70], kneeR: [56, 70],
          footL: [44, 88], footR: [56, 88], torsoMid: [50, 38],
        },
      },
      {
        label: "Peak contraction — bar at shoulders",
        pose: {
          head: [50, 14], neck: [50, 22], shoulderL: [38, 26], shoulderR: [62, 26],
          elbowL: [36, 40], elbowR: [64, 40], handL: [36, 28], handR: [64, 28],
          hipL: [44, 52], hipR: [56, 52], kneeL: [44, 70], kneeR: [56, 70],
          footL: [44, 88], footR: [56, 88], torsoMid: [50, 38],
        },
      },
      {
        label: "Lower slowly — fight gravity",
        pose: {
          head: [50, 14], neck: [50, 22], shoulderL: [38, 26], shoulderR: [62, 26],
          elbowL: [36, 40], elbowR: [64, 40], handL: [38, 40], handR: [62, 40],
          hipL: [44, 52], hipR: [56, 52], kneeL: [44, 70], kneeR: [56, 70],
          footL: [44, 88], footR: [56, 88], torsoMid: [50, 38],
        },
      },
      {
        label: "Full extension — stretch biceps",
        pose: {
          head: [50, 14], neck: [50, 22], shoulderL: [38, 26], shoulderR: [62, 26],
          elbowL: [36, 40], elbowR: [64, 40], handL: [40, 54], handR: [60, 54],
          hipL: [44, 52], hipR: [56, 52], kneeL: [44, 70], kneeR: [56, 70],
          footL: [44, 88], footR: [56, 88], torsoMid: [50, 38],
        },
      },
    ],
    tips: ["Don't swing the body — isolate biceps", "Keep elbows at your sides throughout", "Full stretch at bottom, full squeeze at top"],
    muscles: ["Biceps", "Forearms"],
    difficulty: "Beginner",
  },
};

// Default animation for exercises not in the map
export const defaultAnimation: ExerciseAnimation = {
  steps: [
    { label: "Starting position", pose: { ...standing } },
    {
      label: "Movement phase",
      pose: {
        ...standing,
        elbowL: [30, 34], elbowR: [70, 34],
        handL: [28, 28], handR: [72, 28],
      },
    },
    {
      label: "Peak contraction",
      pose: {
        ...standing,
        elbowL: [32, 22], elbowR: [68, 22],
        handL: [34, 14], handR: [66, 14],
      },
    },
    { label: "Return to start", pose: { ...standing } },
  ],
  tips: ["Focus on controlled form", "Breathe steadily throughout", "Use appropriate weight"],
  muscles: ["Target Muscle"],
  difficulty: "Beginner",
};
