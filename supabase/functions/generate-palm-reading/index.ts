import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const { 
      name, 
      age, 
      gender, 
      dominant_hand, 
      dominant_hand_image, 
      non_dominant_hand_image 
    } = await req.json();

    console.log('Generating palm reading for:', name, {
      age,
      gender,
      dominant_hand,
      hasNonDominantImage: !!non_dominant_hand_image
    });

    // Step 1: Extract structured visual features from the image(s)
    // We'll ask the model to return ONLY JSON so we can reliably ground the final reading
    const analysisSystem = `You are a meticulous palmistry visual analyst. Your task is to LOOK at the provided hand image(s) and extract simple, interpretable visual features.
- Be concrete and only state what you can reasonably observe.
- If a feature is unclear, set visibility=false and add an explanatory note.
- Return ONLY valid minified JSON (no prose, no code fences).`;

    const analysisPrompt = `Extract features from the hand image(s) and return only this JSON schema:
{
  "lines": {
    "life": {"visibility": boolean, "length": "short|medium|long|unknown", "depth": "faint|medium|deep|unknown", "curvature": "straight|curved|unknown", "breaks": boolean, "forks": boolean, "crosses": boolean, "notes": string},
    "head":  {"visibility": boolean, "length": "short|medium|long|unknown", "depth": "faint|medium|deep|unknown", "curvature": "straight|curved|unknown", "breaks": boolean, "forks": boolean, "crosses": boolean, "notes": string},
    "heart": {"visibility": boolean, "length": "short|medium|long|unknown", "depth": "faint|medium|deep|unknown", "curvature": "straight|curved|unknown", "breaks": boolean, "forks": boolean, "crosses": boolean, "notes": string},
    "fate":  {"visibility": boolean, "length": "short|medium|long|unknown", "depth": "faint|medium|deep|unknown", "curvature": "straight|curved|unknown", "breaks": boolean, "forks": boolean, "crosses": boolean, "notes": string}
  },
  "hand": {
    "palm_shape": "square|rectangular|narrow|wide|unknown",
    "mounts": {"venus": "low|medium|high|unknown", "jupiter": "low|medium|high|unknown", "saturn": "low|medium|high|unknown", "apollo": "low|medium|high|unknown", "mercury": "low|medium|high|unknown"},
    "finger_proportions": {
      "index_vs_ring": "index_longer|ring_longer|similar|unknown",
      "fingers": {"thumb": "short|average|long|unknown", "index": "short|average|long|unknown", "middle": "short|average|long|unknown", "ring": "short|average|long|unknown", "pinky": "short|average|long|unknown"}
    },
    "thumb_openness": "closed|neutral|open|unknown",
    "skin_texture": "fine|medium|coarse|unknown",
    "special_marks": string[]
  },
  "overall_confidence": number
}`;

    // Helper to safely parse JSON from model responses
    const parseJsonSafe = (text: string) => {
      try {
        return JSON.parse(text);
      } catch (_) {
        try {
          const start = text.indexOf('{');
          const end = text.lastIndexOf('}');
          if (start !== -1 && end !== -1 && end > start) {
            return JSON.parse(text.slice(start, end + 1));
          }
        } catch (_) {}
        return null;
      }
    };

    const analysisMessages: any[] = [
      { role: 'system', content: analysisSystem },
      {
        role: 'user',
        content: [
          { type: 'text', text: analysisPrompt },
          {
            type: 'image_url',
            image_url: { url: dominant_hand_image, detail: 'high' }
          }
        ]
      }
    ];

    if (non_dominant_hand_image) {
      (analysisMessages[1].content as any[]).push({
        type: 'image_url',
        image_url: { url: non_dominant_hand_image, detail: 'high' }
      });
    }

    const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: analysisMessages,
        max_tokens: 800,
        temperature: 0.2,
      }),
    });

    if (!analysisResponse.ok) {
      const errorData = await analysisResponse.text();
      console.error('OpenAI analysis error:', errorData);
      throw new Error(`OpenAI analysis request failed: ${analysisResponse.statusText}`);
    }

    const analysisData = await analysisResponse.json();
    const analysisText: string = analysisData.choices?.[0]?.message?.content ?? '';
    const features = parseJsonSafe(analysisText) ?? {
      lines: { life: { visibility: false, length: 'unknown', depth: 'unknown', curvature: 'unknown', breaks: false, forks: false, crosses: false, notes: 'unclear' }, head: { visibility: false, length: 'unknown', depth: 'unknown', curvature: 'unknown', breaks: false, forks: false, crosses: false, notes: 'unclear' }, heart: { visibility: false, length: 'unknown', depth: 'unknown', curvature: 'unknown', breaks: false, forks: false, crosses: false, notes: 'unclear' }, fate: { visibility: false, length: 'unknown', depth: 'unknown', curvature: 'unknown', breaks: false, forks: false, crosses: false, notes: 'unclear' } },
      hand: { palm_shape: 'unknown', mounts: { venus: 'unknown', jupiter: 'unknown', saturn: 'unknown', apollo: 'unknown', mercury: 'unknown' }, finger_proportions: { index_vs_ring: 'unknown', fingers: { thumb: 'unknown', index: 'unknown', middle: 'unknown', ring: 'unknown', pinky: 'unknown' } }, thumb_openness: 'unknown', skin_texture: 'unknown', special_marks: [] },
      overall_confidence: 0.0,
    };

    console.log('Extracted palm features', {
      hasFeatures: !!features,
      confidence: features?.overall_confidence,
      sample: JSON.stringify(features).slice(0, 200) + '...'
    });

    // Step 2: Generate personalized reading grounded in extracted features
    const featuresJson = JSON.stringify(features, null, 2);

    const generationPrompt = `You are an expert palm reader. Use the STRUCTURED OBSERVATIONS below (derived directly from the user's image(s)) as the factual basis. Do not contradict them. If a feature is unknown or low confidence, say so.

USER DETAILS:
- Name: ${name}
- Age: ${age}
- Gender: ${gender}
- Dominant hand: ${dominant_hand}

STRUCTURED OBSERVATIONS (from vision analysis):
${featuresJson}

GUIDELINES:
- Reference specific observed features (length, depth, curvature, breaks, forks, finger proportions, palm shape, mounts).
- Avoid generic, templated statements or repetition.
- Be explicit about uncertainties where visibility=false or values=unknown.

STRUCTURE:
1. Quick Summary for ${name}
2. Line Analysis (life, head, heart, fate if visible)
3. Hand Shape & Features (palm shape, mounts, finger proportions, thumb openness, texture, special marks)
${non_dominant_hand_image ? '4. Hand Comparison (if differences are suggested by features)' : ''}

Tone: professional, specific, and grounded in the observations.`;

    const generationMessages: any[] = [
      {
        role: 'user',
        content: [
          { type: 'text', text: generationPrompt },
          { type: 'image_url', image_url: { url: dominant_hand_image, detail: 'high' } }
        ]
      }
    ];

    if (non_dominant_hand_image) {
      (generationMessages[0].content as any[]).push({
        type: 'image_url',
        image_url: { url: non_dominant_hand_image, detail: 'high' }
      });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: generationMessages,
        max_tokens: 1500,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI generation error:', errorData);
      throw new Error(`OpenAI generation request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const reading = data.choices[0]?.message?.content;

    if (!reading) {
      throw new Error('No reading generated from OpenAI');
    }

    // Log reading characteristics for debugging
    const wordCount = reading.split(' ').length;
    const hasPersonalization = reading.toLowerCase().includes(name.toLowerCase());
    const uniqueFeatures = ['unusual', 'distinctive', 'specific', 'observe', 'notice', 'visible', 'curved', 'straight', 'deep', 'faint', 'fork', 'break']
      .some(word => reading.toLowerCase().includes(word));
    
    console.log('Palm reading generated successfully', {
      wordCount,
      hasPersonalization,
      hasUniqueFeatures: uniqueFeatures,
      featureConfidence: features?.overall_confidence,
      readingPreview: reading.substring(0, 150) + '...'
    });

    return new Response(JSON.stringify({ reading }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-palm-reading function:', error);
    
    // More specific fallback that acknowledges the limitation
    const fallbackReading = `I apologize, ${name}, but I'm currently unable to analyze your hand images properly due to a technical issue. 

This appears to be a temporary problem with the image analysis system. Please try again in a few moments, or check that your images are:
- Clear and well-lit
- Showing your full palm
- Taken from directly above your hand

Each hand is unique, and I want to give you a reading based on what I can actually observe in your specific palm lines and features, rather than providing a generic response.`;

    return new Response(JSON.stringify({ reading: fallbackReading }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});