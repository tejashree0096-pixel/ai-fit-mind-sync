import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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

    const { mood, energy, stress, sleep, currentCalories, targetCalories, proteinGap } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return errorResponse(500, "Internal server error");
    }

    const systemPrompt = `You are a nutrition and wellness AI assistant for an Indian fitness app called "AI Fitness Arena". 
    You provide personalized meal recommendations based on the user's current mood, stress levels, energy, and nutritional needs.
    
    Focus on:
    - Indian vegetarian and non-vegetarian options
    - Mood-boosting foods (serotonin, omega-3 rich foods for low mood)
    - Stress-reducing foods (magnesium, B-vitamins for high stress)
    - Energy-boosting foods (complex carbs, iron for low energy)
    - Sleep-supporting foods (tryptophan, melatonin for poor sleep)
    
    Always provide practical, easily available Indian foods with their approximate nutritional values.
    Keep responses concise, friendly, and actionable.`;

    const userPrompt = `Based on my current state:
- Mood: ${mood} (scale: great, good, okay, low, stressed)
- Energy Level: ${energy}/10
- Stress Level: ${stress}/10  
- Sleep Quality: ${sleep}/10
- Current Calories Today: ${currentCalories} kcal
- Target Calories: ${targetCalories} kcal
- Protein Gap: ${proteinGap}g needed

Please recommend:
1. 3 specific meal/snack suggestions that will help improve my mood and energy
2. One stress-relief food tip
3. One hydration reminder based on my energy level

Format your response as JSON with this structure:
{
  "meals": [
    { "name": "Food Name", "benefit": "Why it helps", "calories": 200, "protein": 10 }
  ],
  "stressTip": "Your stress-relief food tip",
  "hydrationTip": "Your hydration tip",
  "overallAdvice": "A brief personalized wellness message"
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
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return errorResponse(429, "Rate limit exceeded. Please try again in a moment.");
      if (response.status === 402) return errorResponse(402, "AI credits depleted. Please add credits to continue.");
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return errorResponse(500, "Internal server error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    let recommendations;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        recommendations = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      recommendations = {
        meals: [
          { name: "Banana Lassi", benefit: "Natural mood booster with potassium", calories: 180, protein: 5 },
          { name: "Sprouted Moong Chaat", benefit: "High protein, energizing", calories: 150, protein: 12 },
          { name: "Paneer Tikka (4 pcs)", benefit: "Protein-rich, satisfying", calories: 250, protein: 18 },
        ],
        stressTip: "Try a handful of almonds - they're rich in magnesium which helps reduce cortisol.",
        hydrationTip: "Drink warm water with lemon to boost energy and aid digestion.",
        overallAdvice: "Listen to your body today. Small, frequent meals will help maintain steady energy levels.",
      };
    }

    return new Response(JSON.stringify(recommendations), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in meal-recommendations:", error);
    return errorResponse(500, "Internal server error");
  }
});
