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

    const prompt = 
      `
    You are an expert palm reader analyzing unique hand features.

    CRITICAL: You must analyze the SPECIFIC visual details in the provided hand image(s) and create a reading based on what you actually observe. Avoid generic palmistry language.

    STEP 1 - DETAILED VISUAL ANALYSIS:
    Look carefully at the provided hand image(s) and describe:
    - The exact shape and length of the major lines (life, head, heart, fate if visible)
    - Unique markings, breaks, or unusual patterns you can see
    - The specific shape of the palm (square, rectangular, narrow, wide)
    - Finger lengths and proportions relative to each other
    - Visible mounts and their development
    - Any distinctive characteristics that make this hand different from others

    STEP 2 - CREATE PERSONALIZED READING:
    Based on your specific observations, create a reading that:
    - References the actual visual features you identified
    - Explains how these specific features relate to personality traits
    - Avoids generic statements that could apply to anyone
    - Uses concrete, observable details to support interpretations

    User Details:
    Name: ${name}  
    Age: ${age}  
    Gender: ${gender}  
    Dominant hand: ${dominant_hand}

    TONE: Professional, specific, and personalized. Reference what you actually see in the images.
    
    STRUCTURE:
    1. **Quick Summary for ${name}**: Based on the most distinctive features you observe
    2. **Line Analysis**: Specific interpretations of the major lines you can clearly see
    3. **Hand Shape & Features**: What the overall structure and unique markings reveal
    ${non_dominant_hand_image ? '4. **Hand Comparison**: Meaningful differences between dominant and non-dominant hands' : ''}

    Remember: Base everything on actual visual observations, not generic palmistry templates.
`;

    const messages = [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          {
            type: 'image_url',
            image_url: {
              url: dominant_hand_image,
              detail: 'high'
            }
          }
        ]
      }
    ];

    if (non_dominant_hand_image) {
      messages[0].content.push({
        type: 'image_url',
        image_url: {
          url: non_dominant_hand_image,
          detail: 'high'
        }
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
        messages,
        max_tokens: 1500,
        temperature: 0.9,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const reading = data.choices[0]?.message?.content;

    if (!reading) {
      throw new Error('No reading generated from OpenAI');
    }

    // Log reading characteristics for debugging
    const wordCount = reading.split(' ').length;
    const hasPersonalization = reading.toLowerCase().includes(name.toLowerCase());
    const uniqueFeatures = ['unusual', 'distinctive', 'specific', 'observe', 'notice'].some(word => 
      reading.toLowerCase().includes(word)
    );
    
    console.log('Palm reading generated successfully', {
      wordCount,
      hasPersonalization,
      hasUniqueFeatures: uniqueFeatures,
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