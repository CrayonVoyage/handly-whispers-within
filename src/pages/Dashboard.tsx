import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { supabase } from '@/integrations/supabase/client';
import { Hand, Users, User, ChevronDown, ChevronUp, Info } from 'lucide-react';

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

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [palmData, setPalmData] = useState<PalmReadingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileExpanded, setProfileExpanded] = useState(false);
  const [readingExpanded, setReadingExpanded] = useState(false);

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
          .select('username, full_name, avatar_url')
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
              My Profile
            </CardTitle>
          </CardHeader>
          <Collapsible open={profileExpanded} onOpenChange={setProfileExpanded}>
            <CardContent className="pb-4">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12 border-2 border-primary/20">
                    <AvatarImage src={profile?.avatar_url || ''} />
                    <AvatarFallback className="bg-primary/10">
                      <User className="h-6 w-6 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <p className="font-medium text-foreground">
                      {profile?.username || 'User'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {profile?.full_name || 'No name set'}
                    </p>
                  </div>
                </div>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <span className="text-sm">
                      {profileExpanded ? 'Show less' : 'Show more'}
                    </span>
                    {profileExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>
            </CardContent>
            <CollapsibleContent>
              <CardContent className="pt-0 text-center">
                {palmData ? (
                  <div className="space-y-2 text-foreground text-sm">
                    <p><span className="font-medium">Age:</span> {palmData.age}</p>
                    <p><span className="font-medium">Gender:</span> {palmData.gender}</p>
                    <p><span className="font-medium">Dominant Hand:</span> {palmData.dominant_hand}</p>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No additional profile information available yet.</p>
                )}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
          <CardContent className="pt-0 text-center">
            <Button 
              onClick={() => navigate('/profile')}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Edit Profile
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
          {palmData?.reading_result ? (
            <Collapsible open={readingExpanded} onOpenChange={setReadingExpanded}>
              <CardContent className="text-center">
                <div className="text-foreground">
                  <p className="line-clamp-3 text-sm mb-4">{palmData.reading_result}</p>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2 mx-auto">
                      <span className="text-sm">
                        {readingExpanded ? 'Show less' : 'Show more'}
                      </span>
                      {readingExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </CardContent>
              <CollapsibleContent>
                <CardContent className="pt-0 text-center">
                  <div className="text-foreground text-sm whitespace-pre-wrap">
                    {palmData.reading_result}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <CardContent className="text-center">
              <div className="text-foreground">
                <p className="mb-4 text-sm">Your palm reading isn't ready yet. Go to the Palm Reading page to generate it.</p>
                <Button 
                  onClick={() => navigate('/palm-reading')}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Start Palm Reading
                </Button>
              </div>
            </CardContent>
          )}
        </Card>


        {/* Main Navigation Options */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-card shadow-lg border-border rounded-2xl hover:shadow-xl transition-shadow cursor-pointer group">
            <CardHeader 
              onClick={() => navigate('/palm-reading')}
              className="pb-4 text-center"
            >
              <div className="flex flex-col items-center space-y-3">
                <Hand className="h-10 w-10 text-primary" />
                <div>
                  <CardTitle className="text-xl font-playfair text-foreground group-hover:text-primary transition-colors">
                    New Palm Reading
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Generate a new reading to replace your current one
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
                <Users className="h-10 w-10 text-primary" />
                <div>
                  <CardTitle className="text-xl font-playfair text-foreground group-hover:text-primary transition-colors">
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

        {/* Secondary Links */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-card/50 border-border rounded-xl hover:bg-card/70 transition-colors cursor-pointer">
            <CardHeader 
              onClick={() => navigate('/reading-method')}
              className="pb-3 text-center"
            >
              <div className="flex items-center justify-center space-x-2">
                <Hand className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Reading Method
                </CardTitle>
              </div>
            </CardHeader>
          </Card>

          <Card className="bg-card/50 border-border rounded-xl hover:bg-card/70 transition-colors cursor-pointer">
            <CardHeader 
              onClick={() => navigate('/about')}
              className="pb-3 text-center"
            >
              <div className="flex items-center justify-center space-x-2">
                <Info className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </CardTitle>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;