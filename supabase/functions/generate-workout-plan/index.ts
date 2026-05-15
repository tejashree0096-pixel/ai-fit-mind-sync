import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function errorResponse(status: number, message: string) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) return errorResponse(401, "Unauthorized");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: claimsData, error: claimsErr } = await supabase.auth.getClaims(
      authHeader.replace("Bearer ", ""),
    );
    if (claimsErr || !claimsData?.claims) return errorResponse(401, "Unauthorized");

    const { workoutType, fitnessGoal, experience, duration, targetMuscles, recentWorkouts } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return errorResponse(500, "Internal server error");
    }

    const systemPrompt = `You are an expert fitness trainer AI that creates personalized workout plans. Always respond with valid JSON only, no markdown.`;

    const userPrompt = `Create a ${workoutType} workout plan with these requirements:
- Goal: ${fitnessGoal || "general fitness"}
- Experience: ${experience || "intermediate"}
- Duration: ~${duration || 45} minutes
- Target muscles: ${targetMuscles?.join(", ") || "full body"}
${recentWorkouts ? `- Recent workouts to avoid repetition: ${recentWorkouts}` : ""}

Return JSON with this exact structure:
{
  "planName": "descriptive plan name",
  "difficulty": "beginner|intermediate|advanced",
  "durationMinutes": number,
  "targetMuscles": ["muscle1", "muscle2"],
  "exercises": [
    {
      "name": "Exercise Name",
      "sets": 3,
      "reps": "10-12",
      "rest": "60s",
      "muscle": "Target Muscle",
      "emoji": "💪",
      "tips": "Form tip for this exercise"
    }
  ],
  "warmup": "Brief warmup description",
  "cooldown": "Brief cooldown description",
  "aiNotes": "Personalized coaching notes"
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "create_workout_plan",
            description: "Create a structured workout plan",
            parameters: {
              type: "object",
              properties: {
                planName: { type: "string" },
                difficulty: { type: "string", enum: ["beginner", "intermediate", "advanced"] },
                durationMinutes: { type: "number" },
                targetMuscles: { type: "array", items: { type: "string" } },
                exercises: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      sets: { type: "number" },
                      reps: { type: "string" },
                      rest: { type: "string" },
                      muscle: { type: "string" },
                      emoji: { type: "string" },
                      tips: { type: "string" },
                    },
                    required: ["name", "sets", "reps", "rest", "muscle"],
                  },
                },
                warmup: { type: "string" },
                cooldown: { type: "string" },
                aiNotes: { type: "string" },
              },
              required: ["planName", "exercises", "durationMinutes"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "create_workout_plan" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return errorResponse(429, "Rate limited. Try again shortly.");
      if (response.status === 402) return errorResponse(402, "AI credits depleted.");
      console.error("AI gateway error:", response.status);
      return errorResponse(500, "Internal server error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    let plan;

    if (toolCall) {
      plan = JSON.parse(toolCall.function.arguments);
    } else {
      const content = data.choices?.[0]?.message?.content || "";
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      plan = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    }

    if (!plan) {
      console.error("Failed to parse workout plan");
      return errorResponse(500, "Internal server error");
    }

    return new Response(JSON.stringify(plan), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return errorResponse(500, "Internal server error");
  }
});
