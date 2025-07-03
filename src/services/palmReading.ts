
import { PalmReadingRequest } from '@/types/handly';
import { supabase } from '@/integrations/supabase/client';

export const generatePalmReading = async (request: PalmReadingRequest): Promise<string> => {
  console.log('Generating palm reading for:', request.name);
  
  try {
    const { data, error } = await supabase.functions.invoke('generate-palm-reading', {
      body: {
        name: request.name,
        age: request.age,
        gender: request.gender,
        dominant_hand: request.dominant_hand,
        dominant_hand_image: request.dominant_hand_image,
        non_dominant_hand_image: request.non_dominant_hand_image
      }
    });

    if (error) {
      console.error('Error calling palm reading function:', error);
      throw error;
    }

    return data.reading;
  } catch (error) {
    console.error('Error generating palm reading:', error);
    throw new Error('Failed to generate palm reading. Please try again.');
  }
};
