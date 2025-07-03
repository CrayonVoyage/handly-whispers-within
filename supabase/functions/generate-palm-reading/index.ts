
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

    console.log('Generating palm reading for:', name);

    const prompt = 
      `
    You are a modern, intuitive palm reader.  
    You’ve just received a set of personal data and hand images from someone curious to explore who they are through the lines, shapes and energy of their hands.

    Use the dominant hand photo (and the non-dominant if provided), along with their basic information — name, age, gender, and which hand they use the most — to create a rich, introspective, and poetic reading.

    The Tone:
    - Kind, respectful and explanatory
    - Rational and concrete
    - Symbolic when relevant, but never vague
    - No predictions, no abstract metaphors, no fortune-telling
    
    Use Titles , bullet points and anything that make the reading easier  
    Make it feel natural, like a good friend who knows about palm reading and who wants to gain your trust by being concrete and very clear about what he reads.
    
    The content should organically weave together:
    - A thoughtful synthesis on top to sum up what is told in the rest of the analysis: what their hand says about their energy, personality, and potential
    
    - An introduction using their name  
    - An interpretation of their **life**, **head**, **heart**, and **fate** lines (if visible)  
    - Observations about the **shape of their palm**, **fingers**, and **mounts**
    
    If both hands are provided, subtly explore the **contrast between inner nature (non-dominant)** and **developed traits (dominant)** — only if meaningful.

    User input:
    Name: ${name}  
    Age: ${age}  
    Gender: ${gender}  
    Dominant hand: ${dominant_hand}  
    ${non_dominant_hand_image ? 'Non-dominant hand image: provided' : 'Non-dominant hand image: not provided'}
    
    Use everything you see and know to offer an explanation for someone not used to palm reading, who should trust your expertise.  
    Think of this as the beginning of a quiet inner conversation.
    
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
        max_tokens: 800,
        temperature: 0.7,
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

    console.log('Palm reading generated successfully');

    return new Response(JSON.stringify({ reading }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-palm-reading function:', error);
    
    // Fallback mock reading for demo purposes
    const mockReading = `Dear friend, your hand reveals a story written in lines of possibility and whispered dreams. The gentle curves that flow across your palm speak of a soul both grounded and reaching, someone who carries wisdom beyond their years.

Your life line traces a path of resilience, weaving through experiences that have shaped you into someone who values authentic connection. There's a strength in your hand's architecture that suggests you've learned to trust your intuition, even when the world around you demands logic over feeling.

The heart line tells of a person who loves deeply but carefully, someone who understands that vulnerability is not weakness but the birthplace of genuine intimacy. Your hand speaks of emotional intelligence, of someone who can read the unspoken stories in others' eyes.

Looking at the shape and energy of your fingers, I see creativity that flows like water finding its course. You have the hands of someone who builds bridges—between ideas, between people, between what is and what could be. There's an artist's sensitivity paired with a pragmatist's wisdom.

Your palm whispers of untold stories yet to unfold, of dreams that simmer beneath the surface waiting for their moment to emerge. Trust the map written in your hand. It knows the way forward, even when your mind cannot yet see the path clearly.`;

    return new Response(JSON.stringify({ reading: mockReading }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
