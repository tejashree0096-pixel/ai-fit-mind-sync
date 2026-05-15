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

    let body;
    try {
      body = await req.json();
    } catch {
      return errorResponse(400, "Invalid request body. Expected JSON with imageBase64 field.");
    }

    const { imageBase64 } = body;
    if (!imageBase64 || typeof imageBase64 !== "string" || imageBase64.length < 100) {
      return errorResponse(400, "No valid image data provided. Please capture a photo first.");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return errorResponse(500, "Internal server error");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a food recognition and nutrition analysis AI for an Indian fitness app. 
            Analyze food images and estimate nutritional values. Focus on Indian foods.
            Always respond with valid JSON in this exact format:
            {
              "name": "Food Name",
              "calories": 250,
              "protein": 10,
              "carbs": 30,
              "fats": 8,
              "portion": "1 serving",
              "confidence": "high",
              "description": "Brief description of what you see"
            }
            If you cannot identify the food clearly, set confidence to "low" and provide your best guess.`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this food image. Identify the food item(s) and estimate the nutritional values per serving. If it's an Indian dish, provide accurate estimates.",
              },
              {
                type: "image_url",
                image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
              },
            ],
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return errorResponse(429, "Rate limit exceeded. Please try again.");
      if (response.status === 402) return errorResponse(402, "AI credits depleted.");
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return errorResponse(500, "Internal server error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    let analysis;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found");
      }
    } catch {
      analysis = {
        name: "Unidentified Food",
        calories: 200,
        protein: 8,
        carbs: 25,
        fats: 8,
        portion: "1 serving",
        confidence: "low",
        description: "Could not clearly identify the food. Please adjust values manually.",
      };
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in analyze-food-image:", error);
    return errorResponse(500, "Internal server error");
  }
});
