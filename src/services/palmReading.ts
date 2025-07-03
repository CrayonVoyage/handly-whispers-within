
import { PalmReadingRequest } from '@/types/handly';

const OPENAI_API_KEY = process.env.VITE_OPENAI_API_KEY || '';

export const generatePalmReading = async (request: PalmReadingRequest): Promise<string> => {
  console.log('Generating palm reading for:', request.name);
  
  if (!OPENAI_API_KEY) {
    // Fallback mock response for demo purposes
    console.log('No API key found, using mock response');
    return generateMockReading(request);
  }

  const prompt = `You are a modern, intuitive palm reader. You've received personal data and hand photos from a user who wants to know themselves better through their palm lines. Use the image of the dominant hand (and non-dominant if present), combined with their basic data (name, age, gender, dominant hand) to create a rich, introspective and poetic portrait.

Tone:
Kind, mysterious, spiritual
Personal but not predictive
Poetic yet understandable
Never fatalistic or vague

Structure (aim for 4–5 short sections):

Introduction (personalized with the user's name)
Reading of palm lines (life, head, heart, fate line if visible)
Hand shape, fingers & mounts (interpreting form and energy)
Synthesis (personality, tendencies, inner voice, message)
${request.non_dominant_hand_image ? '(Optional) Comparison of dominant vs non‑dominant hand if both are provided' : ''}

User input:

Name: ${request.name}
Age: ${request.age}
Gender: ${request.gender}
Dominant hand: ${request.dominant_hand}

Write the result as a fluid, evocative narrative under 500 words. No bullet points. No headings. Use symbolic language, but be clear.`;

  try {
    const messages = [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          {
            type: 'image_url',
            image_url: {
              url: request.dominant_hand_image,
              detail: 'high'
            }
          }
        ]
      }
    ];

    if (request.non_dominant_hand_image) {
      messages[0].content.push({
        type: 'image_url',
        image_url: {
          url: request.non_dominant_hand_image,
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
        model: 'gpt-4-vision-preview',
        messages,
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Unable to generate reading at this time.';
  } catch (error) {
    console.error('Error generating palm reading:', error);
    return generateMockReading(request);
  }
};

const generateMockReading = (request: PalmReadingRequest): string => {
  return `Dear ${request.name}, your ${request.dominant_hand.toLowerCase()} hand reveals a story written in lines of possibility and whispered dreams. The gentle curves that flow across your palm speak of a soul both grounded and reaching, someone who carries wisdom beyond their ${request.age} years.

Your life line traces a path of resilience, weaving through experiences that have shaped you into someone who values authentic connection. There's a strength in your hand's architecture that suggests you've learned to trust your intuition, even when the world around you demands logic over feeling.

The heart line tells of a person who loves deeply but carefully, someone who understands that vulnerability is not weakness but the birthplace of genuine intimacy. Your hand speaks of emotional intelligence, of someone who can read the unspoken stories in others' eyes.

Looking at the shape and energy of your fingers, I see creativity that flows like water finding its course. You have the hands of someone who builds bridges—between ideas, between people, between what is and what could be. There's an artist's sensitivity paired with a pragmatist's wisdom.

Your palm whispers of untold stories yet to unfold, of dreams that simmer beneath the surface waiting for their moment to emerge. Trust the map written in your hand, ${request.name}. It knows the way forward, even when your mind cannot yet see the path clearly.`;
};
