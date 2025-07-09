import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UserProfile {
  username: string;
  full_name: string;
  avatar_url: string | null;
}

interface PalmReadingData {
  age: number;
  gender: string;
  dominant_hand: string;
  reading_result: string | null;
}

interface UserComparisonData {
  profile: UserProfile;
  palmData: PalmReadingData;
}

interface PalmReadingComparisonProps {
  currentUser: UserComparisonData;
  compareUser: UserComparisonData;
}

export const PalmReadingComparison: React.FC<PalmReadingComparisonProps> = ({
  currentUser,
  compareUser
}) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg text-primary text-center">Your Palm Reading</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground line-clamp-6">
            {currentUser.palmData.reading_result}
          </p>
        </CardContent>
      </Card>

      <Card className="border-secondary/20">
        <CardHeader>
          <CardTitle className="text-lg text-secondary text-center">{compareUser.profile.username}'s Palm Reading</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground line-clamp-6">
            {compareUser.palmData.reading_result}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};