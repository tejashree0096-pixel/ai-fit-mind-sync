import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { mood, energy, stress, sleep, currentCalories, targetCalories, proteinGap } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
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
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to get AI recommendations");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    // Parse the JSON response from the AI
    let recommendations;
    try {
      // Extract JSON from the response (it might be wrapped in markdown code blocks)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        recommendations = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      // Provide fallback recommendations
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
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
