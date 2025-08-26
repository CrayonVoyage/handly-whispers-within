import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users, Hand } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserSearch } from '@/components/compare/UserSearch';
import { UserProfileComparison } from '@/components/compare/UserProfileComparison';
import { NarrativeComparison } from '@/components/compare/NarrativeComparison';
import { CompletePalmReadingPrompt } from '@/components/compare/CompletePalmReadingPrompt';

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
  palm_lines_data?: any;
}

interface UserComparisonData {
  profile: UserProfile;
  palmData: PalmReadingData;
}

const Compare = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUserData, setCurrentUserData] = useState<UserComparisonData | null>(null);
  const [compareUserData, setCompareUserData] = useState<UserComparisonData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isComparing, setIsComparing] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    fetchCurrentUserData();
  }, [user, navigate]);

  const fetchCurrentUserData = async () => {
    if (!user) return;

    try {
      // Fetch current user's profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('username, full_name, avatar_url')
        .eq('user_id', user.id)
        .single();

      // Fetch current user's palm reading data
      const { data: palmData } = await supabase
        .from('handly_users')
        .select('age, gender, dominant_hand, reading_result, palm_lines_data')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (profileData && palmData) {
        setCurrentUserData({
          profile: profileData,
          palmData: palmData
        });
      }
    } catch (error) {
      console.error('Error fetching current user data:', error);
    }
  };

  const handleCompare = async (username: string) => {

    setLoading(true);
    try {
      // Find user by username
      const { data: profileData } = await supabase
        .from('profiles')
        .select('user_id, username, full_name, avatar_url')
        .eq('username', username)
        .single();

      if (!profileData) {
        toast({
          title: "User not found",
          description: "This username doesn't exist.",
          variant: "destructive"
        });
        return;
      }

      // Fetch their palm reading data via secure RPC
      const { data: rpcData, error: rpcError } = await supabase
        .rpc('get_reading_for_compare', { target_user_id: profileData.user_id });

      if (rpcError) {
        throw rpcError;
      }

      const palmData: any = Array.isArray(rpcData) ? rpcData[0] : rpcData;

      if (!palmData || !palmData.reading_result) {
        toast({
          title: "No palm reading found",
          description: "This user hasn't completed their palm reading yet.",
          variant: "destructive"
        });
        return;
      }

      setCompareUserData({
        profile: {
          username: profileData.username,
          full_name: profileData.full_name,
          avatar_url: profileData.avatar_url
        },
        palmData: palmData
      });
      setIsComparing(true);

    } catch (error) {
      console.error('Error fetching compare user data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch user data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  if (!currentUserData || !currentUserData.palmData.reading_result) {
    return <CompletePalmReadingPrompt />;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Hand className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-playfair font-medium text-foreground mb-6">
            Handly
          </h1>
          <Button 
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <Card className="bg-card shadow-lg border-border rounded-2xl">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <Users className="h-16 w-16 text-primary" />
            </div>
            <CardTitle className="text-3xl font-playfair font-medium text-foreground">
              Compare with Others
            </CardTitle>
            <p className="text-muted-foreground mt-4">
              Select another user to compare your palm profile with theirs.
            </p>
          </CardHeader>
          
          {!isComparing && (
            <CardContent>
              <UserSearch 
                onUserSelect={handleCompare}
                loading={loading}
                currentUserId={user!.id}
              />
            </CardContent>
          )}

          {isComparing && compareUserData && (
            <CardContent className="space-y-6">
              <Button 
                onClick={() => {
                  setIsComparing(false);
                  setCompareUserData(null);
                }}
                variant="outline"
                size="sm"
              >
                ← Compare with someone else
              </Button>

              <UserProfileComparison 
                currentUser={currentUserData}
                compareUser={compareUserData}
              />

              <NarrativeComparison 
                currentUser={currentUserData}
                compareUser={compareUserData}
              />
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Compare;