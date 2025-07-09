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
}

interface UserComparisonData {
  profile: UserProfile;
  palmData: PalmReadingData;
}

interface UserProfileComparisonProps {
  currentUser: UserComparisonData;
  compareUser: UserComparisonData;
}

export const UserProfileComparison: React.FC<UserProfileComparisonProps> = ({
  currentUser,
  compareUser
}) => {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="text-center py-4 space-y-1">
          <p className="font-medium text-primary">{currentUser.profile.username}</p>
          <p className="text-sm text-muted-foreground">Age {currentUser.palmData.age} • {currentUser.palmData.dominant_hand} handed</p>
        </CardContent>
      </Card>

      <Card className="border-secondary/20 bg-secondary/5">
        <CardContent className="text-center py-4 space-y-1">
          <p className="font-medium text-secondary">{compareUser.profile.username}</p>
          <p className="text-sm text-muted-foreground">Age {compareUser.palmData.age} • {compareUser.palmData.dominant_hand} handed</p>
        </CardContent>
      </Card>
    </div>
  );
};