
export interface HandlyUser {
  id?: string;
  name: string;
  age: number;
  gender: 'Female' | 'Male' | 'Non-binary' | 'Prefer not to say';
  dominant_hand: 'Left' | 'Right';
  dominant_hand_image: File | null;
  non_dominant_hand_image: File | null;
  reading_result?: string;
  is_premium: boolean;
  created_at?: Date;
}

export interface PalmReadingRequest {
  name: string;
  age: number;
  gender: string;
  dominant_hand: string;
  dominant_hand_image: string; // base64 encoded
  non_dominant_hand_image?: string; // base64 encoded
}
