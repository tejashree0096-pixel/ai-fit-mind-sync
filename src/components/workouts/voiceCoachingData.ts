// Voice coaching data for each exercise - step-synced instructions, muscle cues, breathing
export interface VoiceCoachingStep {
  instruction: string;
  muscleCue?: string;
  breathingCue?: string;
}

export interface VoiceCoachingData {
  intro: string;
  steps: VoiceCoachingStep[];
  encouragement: string[];
  muscleTarget: string;
}

export const voiceCoachingData: Record<string, VoiceCoachingData> = {
  "Push-ups": {
    intro: "Let's do push-ups. Get into a high plank position with your hands shoulder-width apart.",
    steps: [
      { instruction: "Start in a high plank. Arms straight, body in one line from head to heels.", muscleCue: "Engage your core and squeeze your glutes to keep your body rigid.", breathingCue: "Take a deep breath in." },
      { instruction: "Slowly lower your chest toward the floor. Keep your elbows at a 45 degree angle.", muscleCue: "You should feel the stretch across your chest and front shoulders.", breathingCue: "Inhale as you lower down." },
      { instruction: "Go all the way down. Your chest should nearly touch the floor.", muscleCue: "Feel the tension in your chest and triceps. If you don't feel it there, bring your elbows closer to your body.", breathingCue: "Hold your breath briefly at the bottom." },
      { instruction: "Now push back up with power. Drive through your palms.", muscleCue: "Squeeze your chest muscles as you push. Focus on the contraction.", breathingCue: "Exhale forcefully as you push up." },
      { instruction: "Return to the top. Lock out your arms and reset.", muscleCue: "Keep squeezing your core. Don't let your hips sag.", breathingCue: "Breathe normally and prepare for the next rep." },
    ],
    encouragement: ["Great form! Keep it up!", "You're doing amazing. Stay strong!", "Last few reps. Push through!"],
    muscleTarget: "You should feel this primarily in your chest and triceps, with your core working to stabilize.",
  },

  "Bodyweight Squats": {
    intro: "Time for bodyweight squats. Stand with your feet shoulder-width apart, toes slightly turned out.",
    steps: [
      { instruction: "Stand tall with your arms relaxed at your sides. Feet shoulder-width apart.", muscleCue: "Engage your core before you begin the movement.", breathingCue: "Take a deep breath in to brace your core." },
      { instruction: "Begin the descent. Push your hips back like you're sitting into a chair.", muscleCue: "You should start feeling tension in your quads and glutes.", breathingCue: "Inhale as you lower down." },
      { instruction: "Continue lowering. Keep your chest up and your weight in your heels.", muscleCue: "Feel the stretch in your quads. Your glutes are loading up.", breathingCue: "Keep inhaling slowly." },
      { instruction: "Go deep. Thighs parallel to the floor or lower if you can.", muscleCue: "Maximum tension in your quads and glutes right here. If you don't feel it, push your knees out.", breathingCue: "Hold briefly at the bottom." },
      { instruction: "Drive up through your heels. Push the floor away.", muscleCue: "Squeeze your glutes hard at the top. Feel them contract.", breathingCue: "Exhale as you stand up." },
      { instruction: "Stand tall. Squeeze your glutes at the top.", muscleCue: "Full glute squeeze. Reset and prepare for the next rep.", breathingCue: "Breathe normally." },
    ],
    encouragement: ["Perfect depth! Keep going!", "Strong legs! You've got this!", "Stay controlled. Quality reps!"],
    muscleTarget: "You should feel this in your quads, glutes, and hamstrings. The burn should be in the front and back of your thighs.",
  },

  "Plank Hold": {
    intro: "Plank hold. Get into position on your forearms and toes.",
    steps: [
      { instruction: "Place your forearms on the ground, elbows directly under your shoulders. Extend your legs back.", muscleCue: "Engage your entire core. Think about pulling your belly button to your spine.", breathingCue: "Breathe steadily. Don't hold your breath." },
      { instruction: "Hold this position. Your body should form a perfectly straight line.", muscleCue: "Feel your abs working. Your shoulders and glutes are supporting you too.", breathingCue: "Breathe in through your nose, out through your mouth." },
      { instruction: "Keep holding. Don't let your hips drop or pike up.", muscleCue: "If you feel it in your lower back, squeeze your glutes harder and tilt your pelvis slightly.", breathingCue: "Maintain steady, calm breathing. You've got this." },
    ],
    encouragement: ["Hold strong! Your core is getting stronger!", "Don't give up! Every second counts!", "Almost there! Stay tight!"],
    muscleTarget: "You should feel this deep in your core, across your abs, and in your shoulders. Your glutes should also be engaged.",
  },

  "Lunges": {
    intro: "Let's do lunges. Stand upright with your feet together.",
    steps: [
      { instruction: "Stand tall with your feet together and hands on your hips or at your sides.", muscleCue: "Brace your core for balance.", breathingCue: "Take a deep breath." },
      { instruction: "Take a big step forward with your right leg. Keep your torso upright.", muscleCue: "Feel your quad and glute start to engage on the front leg.", breathingCue: "Inhale as you step forward." },
      { instruction: "Lower your body until both knees are at 90 degrees. Back knee nearly touches the floor.", muscleCue: "You should feel a deep stretch in your hip flexor and a burn in your front quad and glute. Focus on squeezing.", breathingCue: "Continue inhaling at the bottom." },
      { instruction: "Push through your front heel to drive back up.", muscleCue: "Squeeze your glute on the working leg as you rise.", breathingCue: "Exhale as you push up." },
      { instruction: "Return to the starting position. Switch legs on the next rep.", muscleCue: "Reset. Engage your core for the next rep.", breathingCue: "Breathe normally between reps." },
    ],
    encouragement: ["Great balance! Keep it controlled!", "Strong legs! Push through!", "Almost done with this set!"],
    muscleTarget: "You should feel this in your quads and glutes on the front leg, with a stretch in the hip flexor of the back leg.",
  },

  "Mountain Climbers": {
    intro: "Mountain climbers. Get into a high plank position and get ready to move fast.",
    steps: [
      { instruction: "Start in a strong high plank. Hands under shoulders, body straight.", muscleCue: "Tighten your core. This is going to be fast.", breathingCue: "Breathe naturally and rhythmically." },
      { instruction: "Drive your right knee toward your chest explosively.", muscleCue: "Feel your hip flexors and lower abs working.", breathingCue: "Exhale as the knee comes forward." },
      { instruction: "Switch! Snap that right leg back and drive the left knee in.", muscleCue: "Keep your core tight. You should feel your abs burning.", breathingCue: "Inhale and exhale with each switch." },
      { instruction: "Keep alternating rapidly. Maintain the rhythm.", muscleCue: "Your shoulders, core, and hip flexors are all firing. If you don't feel your abs, bring your knees higher.", breathingCue: "Keep breathing! Don't hold your breath." },
    ],
    encouragement: ["Great pace! Keep those knees driving!", "You're a machine! Don't stop!", "Almost done! Sprint to the finish!"],
    muscleTarget: "You should feel this in your core, hip flexors, and shoulders. Your heart rate should be elevated.",
  },

  "Burpees": {
    intro: "Burpees. The ultimate full-body exercise. Stand tall and let's go.",
    steps: [
      { instruction: "Stand upright. Feet shoulder-width apart. Ready position.", muscleCue: "Brace your entire body. Everything is about to work.", breathingCue: "Take a deep breath in." },
      { instruction: "Squat down and place your hands on the floor in front of you.", muscleCue: "Feel your quads and glutes loading.", breathingCue: "Exhale as you squat down." },
      { instruction: "Jump your feet back into a plank position. Keep your core tight.", muscleCue: "Your core and shoulders are stabilizing you. Stay rigid.", breathingCue: "Quick breath in." },
      { instruction: "Perform a full push-up. Chest to the floor.", muscleCue: "Feel your chest and triceps working. Full range of motion.", breathingCue: "Inhale down, exhale up." },
      { instruction: "Push back up to plank. Strong arms.", muscleCue: "Squeeze your chest at the top.", breathingCue: "Exhale as you push." },
      { instruction: "Jump your feet forward toward your hands. Land in a squat.", muscleCue: "Your quads absorb the landing. Core stays engaged.", breathingCue: "Quick breath in." },
      { instruction: "Explode upward! Jump as high as you can with arms overhead!", muscleCue: "Everything fires! Legs, core, shoulders. Give it everything!", breathingCue: "Exhale explosively as you jump!" },
    ],
    encouragement: ["Beast mode! Keep that energy up!", "Every burpee makes you stronger!", "You're crushing it! Don't slow down!"],
    muscleTarget: "Burpees work everything. Your legs, chest, triceps, shoulders, and core. You should feel it everywhere.",
  },

  "Bench Press": {
    intro: "Bench press. Lie back on the bench and grip the bar slightly wider than shoulder-width.",
    steps: [
      { instruction: "Lie on the bench. Plant your feet flat on the floor. Grip the bar wide.", muscleCue: "Retract your shoulder blades. Squeeze them together like you're pinching a pencil.", breathingCue: "Take a deep breath to fill your chest." },
      { instruction: "Unrack the bar. Hold it with arms fully extended above your mid-chest.", muscleCue: "Feel the weight in your chest and shoulders. Maintain that upper back tightness.", breathingCue: "Breathe in and brace." },
      { instruction: "Lower the bar slowly to your mid-chest. Control the descent.", muscleCue: "Feel your chest stretching under the load. Keep your shoulder blades pinched.", breathingCue: "Inhale as you lower. Two to three seconds down." },
      { instruction: "Bar touches your chest. Brief pause. Don't bounce it.", muscleCue: "Maximum stretch on your chest. You should feel it across your entire pec.", breathingCue: "Hold your breath at the bottom." },
      { instruction: "Press the bar up explosively. Drive through your chest.", muscleCue: "Squeeze your chest hard as you press. Focus on the contraction.", breathingCue: "Exhale forcefully as you press up." },
    ],
    encouragement: ["Solid press! Great control!", "Strong chest! Keep pushing!", "Lock it out! Perfect rep!"],
    muscleTarget: "You should feel this primarily in your chest, with your triceps and front shoulders assisting. The burn should be across your pecs.",
  },

  "Lat Pulldown": {
    intro: "Lat pulldown. Sit down and grip the bar with a wide overhand grip.",
    steps: [
      { instruction: "Grip the bar wide. Arms fully extended overhead. Lean back slightly.", muscleCue: "Feel the stretch in your lats. They should be fully lengthened.", breathingCue: "Take a breath in at the top." },
      { instruction: "Pull the bar down. Lead with your elbows, not your hands.", muscleCue: "Focus on squeezing your shoulder blades together. Feel your lats engaging.", breathingCue: "Exhale as you pull down." },
      { instruction: "Bring the bar to your upper chest. Squeeze your back hard.", muscleCue: "Maximum contraction in your lats. You should feel a deep squeeze in your back. If you feel it more in your arms, widen your grip.", breathingCue: "Hold the squeeze. Keep exhaling." },
      { instruction: "Slowly release the bar back up. Control the negative.", muscleCue: "Feel your lats stretching as the bar goes up. Resist the weight.", breathingCue: "Inhale as you release." },
      { instruction: "Full stretch at the top. Let your lats lengthen completely.", muscleCue: "Feel that deep stretch. This is where your lats grow.", breathingCue: "Deep breath in." },
    ],
    encouragement: ["Great pull! Feel those lats working!", "Control the negative. That's where the gains are!", "Strong back! Keep squeezing!"],
    muscleTarget: "You should feel this in your lats, the large muscles on the sides of your back. Your biceps assist but shouldn't dominate.",
  },

  "Leg Press": {
    intro: "Leg press. Sit in the machine and place your feet shoulder-width apart on the platform.",
    steps: [
      { instruction: "Sit in the machine. Feet shoulder-width on the platform. Back pressed into the seat.", muscleCue: "Feel the starting position. Your quads should be slightly engaged.", breathingCue: "Breathe normally." },
      { instruction: "Release the safety. Slowly lower the platform toward you.", muscleCue: "Feel your quads starting to stretch. Keep your lower back pressed into the seat.", breathingCue: "Inhale as you lower." },
      { instruction: "Bring your knees toward your chest. Deep bend but don't round your lower back.", muscleCue: "Maximum stretch on your quads and glutes. You should feel a deep burn in the front of your thighs.", breathingCue: "Continue inhaling." },
      { instruction: "Press the platform away. Push through your heels.", muscleCue: "Squeeze your quads and glutes as you press. Don't lock your knees at the top.", breathingCue: "Exhale as you press up." },
    ],
    encouragement: ["Strong legs! Push that weight!", "Great depth! Full range of motion!", "You've got this! Keep pressing!"],
    muscleTarget: "You should feel this in your quads, glutes, and hamstrings. The primary burn is in the front of your thighs.",
  },

  "Dumbbell Shoulder Press": {
    intro: "Dumbbell shoulder press. Sit or stand with the dumbbells at shoulder height.",
    steps: [
      { instruction: "Hold the dumbbells at shoulder height. Palms facing forward. Elbows out to the sides.", muscleCue: "Feel the weight in your shoulders. Brace your core.", breathingCue: "Take a deep breath in." },
      { instruction: "Press the dumbbells upward. Push them in a slight arc.", muscleCue: "Feel your shoulders doing the work. Front and side delts are firing.", breathingCue: "Exhale as you press up." },
      { instruction: "Extend your arms fully overhead. Don't lock your elbows aggressively.", muscleCue: "Squeeze your shoulders at the top. You should feel the contraction in the cap of your shoulders.", breathingCue: "Brief pause at the top." },
      { instruction: "Lower the dumbbells with control. Two seconds down.", muscleCue: "Feel the stretch in your shoulders as you lower. Control the weight.", breathingCue: "Inhale as you lower." },
      { instruction: "Return to shoulder height. Reset for the next rep.", muscleCue: "Feel the starting stretch. Keep your core braced.", breathingCue: "Breathe in and prepare." },
    ],
    encouragement: ["Strong shoulders! Great press!", "Control the weight. Quality reps!", "Push through! You're building boulder shoulders!"],
    muscleTarget: "You should feel this in your shoulders, particularly the front and side delts. Your triceps assist at the top of the movement.",
  },

  "Cable Tricep Pushdown": {
    intro: "Cable tricep pushdown. Stand facing the cable machine and grip the bar with an overhand grip.",
    steps: [
      { instruction: "Grip the bar. Pin your elbows to your sides. Forearms angled up.", muscleCue: "Your triceps are in the starting stretch. Keep your upper arms completely still.", breathingCue: "Breathe normally." },
      { instruction: "Push the bar down. Only your forearms should move.", muscleCue: "Feel your triceps starting to contract. The back of your upper arms should be burning.", breathingCue: "Exhale as you push down." },
      { instruction: "Full extension. Squeeze your triceps at the bottom.", muscleCue: "Maximum squeeze! Hold it for one second. You should feel the burn on the back of your arms. If you don't, keep your elbows tighter to your body.", breathingCue: "Hold the exhale." },
      { instruction: "Slowly return the bar up. Fight the pull of the cable.", muscleCue: "Feel the stretch returning to your triceps. Control the negative.", breathingCue: "Inhale as you release slowly." },
    ],
    encouragement: ["Great isolation! Feel those triceps!", "Slow and controlled. Perfect form!", "Squeeze harder at the bottom!"],
    muscleTarget: "You should feel this entirely in your triceps, the back of your upper arms. If you feel it in your shoulders, you're using too much weight.",
  },

  "Barbell Curl": {
    intro: "Barbell curl. Stand with the bar at your thighs, underhand grip, shoulder-width apart.",
    steps: [
      { instruction: "Stand straight. Bar at your thighs. Arms fully extended. Elbows at your sides.", muscleCue: "Feel the stretch in your biceps. Keep your body still.", breathingCue: "Take a breath in." },
      { instruction: "Curl the bar upward. Keep your elbows pinned to your sides.", muscleCue: "Feel your biceps contracting. The front of your upper arms should be working.", breathingCue: "Exhale as you curl up." },
      { instruction: "Bring the bar to shoulder height. Peak contraction.", muscleCue: "Squeeze your biceps as hard as you can at the top. Hold for one second. You should feel an intense squeeze in the front of your arms.", breathingCue: "Hold the exhale at the top." },
      { instruction: "Lower the bar slowly. Fight gravity on the way down.", muscleCue: "Feel the stretch returning. This eccentric phase is crucial for growth.", breathingCue: "Inhale as you lower." },
      { instruction: "Full extension at the bottom. Feel the stretch in your biceps.", muscleCue: "Don't swing your body. If you need momentum, the weight is too heavy.", breathingCue: "Breathe in and prepare for the next rep." },
    ],
    encouragement: ["Great curl! Feel those biceps pumping!", "No swinging! Pure bicep power!", "Squeeze at the top! Make every rep count!"],
    muscleTarget: "You should feel this entirely in your biceps, the front of your upper arms. Your forearms assist with the grip.",
  },
};

// Default coaching for exercises not in the map
export const defaultVoiceCoaching: VoiceCoachingData = {
  intro: "Let's begin this exercise. Focus on proper form throughout.",
  steps: [
    { instruction: "Get into the starting position. Make sure your form is correct.", muscleCue: "Engage your target muscles.", breathingCue: "Take a deep breath." },
    { instruction: "Perform the movement with control.", muscleCue: "Focus on the muscle contraction.", breathingCue: "Exhale during the effort phase." },
    { instruction: "Complete the range of motion.", muscleCue: "Squeeze the target muscle at the peak.", breathingCue: "Hold briefly." },
    { instruction: "Return to the start with control.", muscleCue: "Feel the stretch on the way back.", breathingCue: "Inhale as you return." },
  ],
  encouragement: ["Great work! Keep going!", "Stay focused! You've got this!", "Almost there! Finish strong!"],
  muscleTarget: "Focus on feeling the target muscles working throughout the movement.",
};
