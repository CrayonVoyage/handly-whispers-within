import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Hand, Users, ArrowRight } from 'lucide-react';

interface UserProfile {
  username: string;
  full_name: string;
}

interface PalmReadingData {
  age: number;
  gender: string;
  dominant_hand: string;
  reading_result: string | null;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [palmData, setPalmData] = useState<PalmReadingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchUserData = async () => {
      try {
        // Fetch profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('username, full_name')
          .eq('user_id', user.id)
          .single();

        if (profileData) {
          setProfile(profileData);
        }

        // Fetch palm reading data
        const { data: palmReadingData } = await supabase
          .from('handly_users')
          .select('age, gender, dominant_hand, reading_result')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (palmReadingData) {
          setPalmData(palmReadingData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Hand className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-playfair font-medium text-foreground mb-2">
            Handly
          </h1>
          <h2 className="text-2xl font-playfair text-foreground">
            Hello, {profile?.username || 'there'}
          </h2>
          <Button 
            onClick={handleSignOut}
            variant="outline"
            className="mt-4"
          >
            Sign Out
          </Button>
        </div>

        {/* Profile Summary */}
        <Card className="bg-card shadow-lg border-border rounded-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-playfair text-foreground">
              Your Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {palmData ? (
              <div className="space-y-2 text-foreground">
                <p><span className="font-medium">Age:</span> {palmData.age}</p>
                <p><span className="font-medium">Gender:</span> {palmData.gender}</p>
                <p><span className="font-medium">Dominant Hand:</span> {palmData.dominant_hand}</p>
              </div>
            ) : (
              <p className="text-muted-foreground">No profile information available yet.</p>
            )}
            <Button 
              onClick={() => navigate('/profile')}
              variant="link"
              className="text-primary hover:text-primary/80 mt-2"
            >
              Edit Profile →
            </Button>
          </CardContent>
        </Card>

        {/* Palm Reading Summary */}
        <Card className="bg-card shadow-lg border-border rounded-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-playfair text-foreground">
              Your Palm Reading
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {palmData?.reading_result ? (
              <div className="text-foreground">
                <p className="line-clamp-4">{palmData.reading_result}</p>
                <Button 
                  onClick={() => navigate('/palm-reading')}
                  variant="link"
                  className="text-primary hover:text-primary/80 p-0 mt-2"
                >
                  Read full analysis →
                </Button>
              </div>
            ) : (
              <div className="text-foreground">
                <p className="mb-4">Your palm reading isn't ready yet. Go to the Palm Reading page to generate it.</p>
                <Button 
                  onClick={() => navigate('/palm-reading')}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Start Palm Reading
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Options */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-card shadow-lg border-border rounded-2xl hover:shadow-xl transition-shadow cursor-pointer group">
            <CardHeader 
              onClick={() => navigate('/palm-reading')}
              className="pb-4 text-center"
            >
              <div className="flex flex-col items-center space-y-3">
                <Hand className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle className="text-lg font-playfair text-foreground group-hover:text-primary transition-colors">
                    Palm Reading
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Analyze your palms and discover insights
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="bg-card shadow-lg border-border rounded-2xl hover:shadow-xl transition-shadow cursor-pointer group">
            <CardHeader 
              onClick={() => navigate('/reading-method')}
              className="pb-4 text-center"
            >
              <div className="flex flex-col items-center space-y-3">
                <Hand className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle className="text-lg font-playfair text-foreground group-hover:text-primary transition-colors">
                    Reading Method
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Learn about our palm reading approach
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="bg-card shadow-lg border-border rounded-2xl hover:shadow-xl transition-shadow cursor-pointer group">
            <CardHeader 
              onClick={() => navigate('/compare')}
              className="pb-4 text-center"
            >
              <div className="flex flex-col items-center space-y-3">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle className="text-lg font-playfair text-foreground group-hover:text-primary transition-colors">
                    Compare with Others
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Compare your reading with other users
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;