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
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-lg text-primary">Your Profile</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-2">
          <p><span className="font-medium">Name:</span> {currentUser.profile.username}</p>
          <p><span className="font-medium">Age:</span> {currentUser.palmData.age}</p>
          <p><span className="font-medium">Gender:</span> {currentUser.palmData.gender}</p>
          <p><span className="font-medium">Dominant Hand:</span> {currentUser.palmData.dominant_hand}</p>
        </CardContent>
      </Card>

      <Card className="border-secondary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-lg text-secondary">{compareUser.profile.username}'s Profile</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-2">
          <p><span className="font-medium">Name:</span> {compareUser.profile.username}</p>
          <p><span className="font-medium">Age:</span> {compareUser.palmData.age}</p>
          <p><span className="font-medium">Gender:</span> {compareUser.palmData.gender}</p>
          <p><span className="font-medium">Dominant Hand:</span> {compareUser.palmData.dominant_hand}</p>
        </CardContent>
      </Card>
    </div>
  );
};