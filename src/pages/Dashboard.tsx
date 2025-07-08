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
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-navy-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-playfair font-medium text-navy-800">
            Hello, {profile?.username || 'there'}
          </h1>
          <Button 
            onClick={handleSignOut}
            variant="outline"
            className="border-sand-300 text-navy-600 hover:bg-sand-50"
          >
            Sign Out
          </Button>
        </div>

        {/* Profile Summary */}
        <Card className="bg-card shadow-lg border-sand-200 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-playfair text-navy-800">
              Your Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            {palmData ? (
              <div className="space-y-2 text-navy-600">
                <p><span className="font-medium">Age:</span> {palmData.age}</p>
                <p><span className="font-medium">Gender:</span> {palmData.gender}</p>
                <p><span className="font-medium">Dominant Hand:</span> {palmData.dominant_hand}</p>
              </div>
            ) : (
              <p className="text-navy-600">No profile information available yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Palm Reading Summary */}
        <Card className="bg-card shadow-lg border-sand-200 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-playfair text-navy-800">
              Your Palm Reading
            </CardTitle>
          </CardHeader>
          <CardContent>
            {palmData?.reading_result ? (
              <div className="text-navy-600">
                <p className="line-clamp-4">{palmData.reading_result}</p>
                <Button 
                  onClick={() => navigate('/palm-reading')}
                  variant="link"
                  className="text-violet-600 hover:text-violet-800 p-0 mt-2"
                >
                  Read full analysis →
                </Button>
              </div>
            ) : (
              <div className="text-navy-600">
                <p className="mb-4">Your palm reading isn't ready yet. Go to the Palm Reading page to generate it.</p>
                <Button 
                  onClick={() => navigate('/palm-reading')}
                  className="bg-violet-600 hover:bg-violet-700 text-white"
                >
                  Start Palm Reading
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Options */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-card shadow-lg border-sand-200 rounded-2xl hover:shadow-xl transition-shadow cursor-pointer group">
            <CardHeader 
              onClick={() => navigate('/palm-reading')}
              className="pb-4"
            >
              <div className="flex items-center space-x-3">
                <Hand className="h-8 w-8 text-violet-600" />
                <div>
                  <CardTitle className="text-lg font-playfair text-navy-800 group-hover:text-violet-600 transition-colors">
                    Palm Reading
                  </CardTitle>
                  <CardDescription className="text-navy-600">
                    Analyze your palms and discover insights
                  </CardDescription>
                </div>
                <ArrowRight className="h-5 w-5 text-navy-400 group-hover:text-violet-600 transition-colors ml-auto" />
              </div>
            </CardHeader>
          </Card>

          <Card className="bg-card shadow-lg border-sand-200 rounded-2xl hover:shadow-xl transition-shadow cursor-pointer group">
            <CardHeader 
              onClick={() => navigate('/compare')}
              className="pb-4"
            >
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-violet-600" />
                <div>
                  <CardTitle className="text-lg font-playfair text-navy-800 group-hover:text-violet-600 transition-colors">
                    Compare with Others
                  </CardTitle>
                  <CardDescription className="text-navy-600">
                    Compare your reading with other users
                  </CardDescription>
                </div>
                <ArrowRight className="h-5 w-5 text-navy-400 group-hover:text-violet-600 transition-colors ml-auto" />
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;