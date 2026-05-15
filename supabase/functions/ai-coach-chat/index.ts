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
    // --- Auth check ---
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

    const { messages, userProfile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return errorResponse(500, "Internal server error");
    }

    const systemPrompt = `You are an expert AI Fitness Coach for "AI Fitness Arena" — a premium personal trainer AI.

USER PROFILE:
${userProfile ? `Age: ${userProfile.age}, Weight: ${userProfile.weight}kg, Height: ${userProfile.height}cm, Goal: ${userProfile.fitness_goal}, Experience: ${userProfile.experience}` : "No profile data available yet."}

YOUR CAPABILITIES:
- Generate personalized workout plans (home & gym)
- Provide nutrition advice with Indian food focus
- Give motivational coaching and mental wellness tips
- Adapt recommendations based on user's mood, energy, and progress
- Provide exercise form tips and injury prevention advice

GUIDELINES:
- Be warm, motivating, and professional like a real personal trainer
- Give specific, actionable advice (not generic)
- Use emojis sparingly for engagement
- Format responses with markdown (bold, lists, headers) for readability
- When suggesting workouts, include sets, reps, and rest periods
- Always consider the user's fitness level and goals
- Provide breathing cues and form tips when discussing exercises`;

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
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return errorResponse(429, "Rate limits exceeded, please try again later.");
      if (response.status === 402) return errorResponse(402, "AI credits depleted. Please add funds.");
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return errorResponse(500, "Internal server error");
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return errorResponse(500, "Internal server error");
  }
});
