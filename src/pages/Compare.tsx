import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Users, Hand, Search, Check, ChevronsUpDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

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

const Compare = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [compareUsername, setCompareUsername] = useState('');
  const [currentUserData, setCurrentUserData] = useState<UserComparisonData | null>(null);
  const [compareUserData, setCompareUserData] = useState<UserComparisonData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userSuggestions, setUserSuggestions] = useState<Array<{username: string, full_name: string}>>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

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
        .select('age, gender, dominant_hand, reading_result')
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

  const searchUsers = useCallback(async (query: string) => {
    if (!query || query.length < 2 || !user) return;

    setSearchLoading(true);
    try {
      // Fetch users with completed palm readings, excluding current user
      const { data: profiles } = await supabase
        .from('profiles')
        .select(`
          username, 
          full_name,
          user_id,
          handly_users!inner(reading_result)
        `)
        .ilike('username', `%${query}%`)
        .neq('user_id', user.id)
        .not('handly_users.reading_result', 'is', null)
        .limit(10);

      if (profiles) {
        setUserSuggestions(profiles.map(p => ({
          username: p.username,
          full_name: p.full_name || p.username
        })));
      }
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setSearchLoading(false);
    }
  }, [user]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchUsers]);

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!compareUsername.trim()) return;

    setLoading(true);
    try {
      // Find user by username
      const { data: profileData } = await supabase
        .from('profiles')
        .select('user_id, username, full_name, avatar_url')
        .eq('username', compareUsername.trim())
        .single();

      if (!profileData) {
        toast({
          title: "User not found",
          description: "This username doesn't exist.",
          variant: "destructive"
        });
        return;
      }

      // Fetch their palm reading data
      const { data: palmData } = await supabase
        .from('handly_users')
        .select('age, gender, dominant_hand, reading_result')
        .eq('user_id', profileData.user_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

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

  const getComparisons = () => {
    if (!currentUserData || !compareUserData) return { similarities: [], differences: [] };

    const similarities: string[] = [];
    const differences: string[] = [];

    // Age comparison
    const ageDiff = Math.abs(currentUserData.palmData.age - compareUserData.palmData.age);
    if (ageDiff <= 5) {
      similarities.push(`Similar age range → shared generational perspectives`);
    } else {
      differences.push(`Different age groups → varied life experiences`);
    }

    // Gender comparison
    if (currentUserData.palmData.gender === compareUserData.palmData.gender) {
      similarities.push(`Same gender → potential shared experiences`);
    } else {
      differences.push(`Different genders → diverse perspectives`);
    }

    // Dominant hand comparison
    if (currentUserData.palmData.dominant_hand === compareUserData.palmData.dominant_hand) {
      similarities.push(`Both ${currentUserData.palmData.dominant_hand.toLowerCase()}-handed → similar brain dominance patterns`);
    } else {
      differences.push(`Different dominant hands → varied brain hemisphere preferences`);
    }

    return { similarities, differences };
  };

  if (!user) return null;

  if (!currentUserData || !currentUserData.palmData.reading_result) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto space-y-6">
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
              <CardTitle className="text-2xl font-playfair font-medium text-foreground">
                Complete Your Palm Reading First
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                You need to complete your own palm reading before you can compare with others.
              </p>
              <Button onClick={() => navigate('/palm-reading')}>
                Start Palm Reading
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
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
              <form onSubmit={handleCompare} className="max-w-md mx-auto space-y-4">
                <div>
                  <Label className="text-foreground">
                    Search username to compare with:
                  </Label>
                  <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={isPopoverOpen}
                        className="w-full justify-between mt-2"
                      >
                        {compareUsername || "Search username..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput 
                          placeholder="Type username..." 
                          value={searchQuery}
                          onValueChange={setSearchQuery}
                        />
                        <CommandList>
                          <CommandEmpty>
                            {searchLoading ? "Searching..." : "No users found."}
                          </CommandEmpty>
                          <CommandGroup>
                            {userSuggestions.map((suggestion) => (
                              <CommandItem
                                key={suggestion.username}
                                value={suggestion.username}
                                onSelect={(value) => {
                                  setCompareUsername(value);
                                  setSearchQuery('');
                                  setIsPopoverOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    compareUsername === suggestion.username ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <div className="flex flex-col">
                                  <span className="font-medium">{suggestion.username}</span>
                                  {suggestion.full_name !== suggestion.username && (
                                    <span className="text-sm text-muted-foreground">{suggestion.full_name}</span>
                                  )}
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <Button 
                  type="submit" 
                  disabled={loading || !compareUsername.trim()}
                  className="w-full"
                >
                  {loading ? (
                    "Searching..."
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Compare Readings
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          )}

          {isComparing && compareUserData && (
            <CardContent className="space-y-6">
              <Button 
                onClick={() => {
                  setIsComparing(false);
                  setCompareUserData(null);
                  setCompareUsername('');
                }}
                variant="outline"
                size="sm"
              >
                ← Compare with someone else
              </Button>

              {/* Profile Comparison */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-primary/20">
                  <CardHeader className="text-center">
                    <CardTitle className="text-lg text-primary">Your Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-2">
                    <p><span className="font-medium">Name:</span> {currentUserData.profile.username}</p>
                    <p><span className="font-medium">Age:</span> {currentUserData.palmData.age}</p>
                    <p><span className="font-medium">Gender:</span> {currentUserData.palmData.gender}</p>
                    <p><span className="font-medium">Dominant Hand:</span> {currentUserData.palmData.dominant_hand}</p>
                  </CardContent>
                </Card>

                <Card className="border-secondary/20">
                  <CardHeader className="text-center">
                    <CardTitle className="text-lg text-secondary">{compareUserData.profile.username}'s Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-2">
                    <p><span className="font-medium">Name:</span> {compareUserData.profile.username}</p>
                    <p><span className="font-medium">Age:</span> {compareUserData.palmData.age}</p>
                    <p><span className="font-medium">Gender:</span> {compareUserData.palmData.gender}</p>
                    <p><span className="font-medium">Dominant Hand:</span> {compareUserData.palmData.dominant_hand}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Palm Reading Comparison */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg text-primary text-center">Your Palm Reading</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground line-clamp-6">
                      {currentUserData.palmData.reading_result}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-secondary/20">
                  <CardHeader>
                    <CardTitle className="text-lg text-secondary text-center">{compareUserData.profile.username}'s Palm Reading</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground line-clamp-6">
                      {compareUserData.palmData.reading_result}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Similarities and Differences */}
              <Card className="bg-muted/20">
                <CardHeader>
                  <CardTitle className="text-xl text-center">Comparison Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(() => {
                    const { similarities, differences } = getComparisons();
                    return (
                      <>
                        {similarities.length > 0 && (
                          <div>
                            <h4 className="font-medium text-primary mb-2">✨ Similarities:</h4>
                            <ul className="space-y-1">
                              {similarities.map((item, index) => (
                                <li key={index} className="text-sm text-foreground">• {item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {differences.length > 0 && (
                          <div>
                            <h4 className="font-medium text-secondary mb-2">🔄 Differences:</h4>
                            <ul className="space-y-1">
                              {differences.map((item, index) => (
                                <li key={index} className="text-sm text-foreground">• {item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    );
                  })()}
                  
                  <div className="mt-6 p-4 bg-background/50 rounded-lg border">
                    <p className="text-sm text-muted-foreground text-center italic">
                      This is a fun and reflective comparison — no judgment, no prediction, just perspective.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Compare;