
export interface PersonalInfo {
  name: string;
  age: string;
  gender: string;
  dominant_hand: string;
}

export interface PalmReadingRequest {
  name: string;
  age: number;
  gender: 'Female' | 'Male' | 'Non-binary' | 'Prefer not to say';
  dominant_hand: 'Left' | 'Right';
  dominant_hand_image: string;
  non_dominant_hand_image?: string | null;
}
