import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, LogOut, Settings, Hand, ArrowLeft, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MarkdownRenderer from '@/components/MarkdownRenderer';

interface UserProfile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
}

interface HandlyReading {
  id: string;
  name: string;
  age: number;
  gender: string;
  dominant_hand: string;
  reading_result: string | null;
  created_at: string;
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [readings, setReadings] = useState<HandlyReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    full_name: '',
    age: '',
    gender: '',
    dominant_hand: ''
  });
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    fetchProfile();
    fetchReadings();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setProfile(data);
        setEditForm({
          username: data.username || '',
          full_name: data.full_name || '',
          age: '',
          gender: '',
          dominant_hand: ''
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReadings = async () => {
    try {
      const { data, error } = await supabase
        .from('handly_users')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching readings:', error);
        return;
      }

      setReadings(data || []);
      
      // Get latest palm reading data for age, gender, dominant_hand
      if (data && data.length > 0) {
        const latestReading = data[0];
        setEditForm(prev => ({
          ...prev,
          age: latestReading.age?.toString() || '',
          gender: latestReading.gender || '',
          dominant_hand: latestReading.dominant_hand || ''
        }));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Update profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: user?.id,
          username: editForm.username || null,
          full_name: editForm.full_name || null,
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        toast({
          title: "Error",
          description: "Unable to update profile",
          variant: "destructive"
        });
        return;
      }

      // Update handly_users table if age, gender, or dominant_hand changed
      if (editForm.age || editForm.gender || editForm.dominant_hand) {
        const { data: existingData } = await supabase
          .from('handly_users')
          .select('id')
          .eq('user_id', user?.id)
          .maybeSingle();

        if (existingData) {
          // Update existing record
          const { error: handlyError } = await supabase
            .from('handly_users')
            .update({
              name: editForm.full_name || editForm.username || '',
              age: parseInt(editForm.age) || 0,
              gender: editForm.gender as any,
              dominant_hand: editForm.dominant_hand as any,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user?.id);

          if (handlyError) {
            console.error('Handly update error:', handlyError);
          }
        } else {
          // Insert new record
          const { error: handlyError } = await supabase
            .from('handly_users')
            .insert({
              user_id: user?.id,
              name: editForm.full_name || editForm.username || '',
              age: parseInt(editForm.age) || 0,
              gender: editForm.gender as any,
              dominant_hand: editForm.dominant_hand as any
            });

          if (handlyError) {
            console.error('Handly insert error:', handlyError);
          }
        }
      }

      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
      
      setEditing(false);
      fetchProfile();
      fetchReadings();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploadingAvatar(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('hand-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('hand-images')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: urlData.publicUrl })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Profile picture updated successfully"
      });
      
      fetchProfile();
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Error",
        description: "Failed to upload profile picture",
        variant: "destructive"
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Hand className="h-16 w-16 text-primary mx-auto animate-pulse" />
          <p className="mt-6 text-foreground text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Hand className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-playfair font-medium text-foreground mb-6">Handly</h1>
          <h2 className="text-3xl font-playfair font-medium text-foreground mb-6">My Profile</h2>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button onClick={() => navigate('/dashboard')} variant="outline" className="rounded-xl px-6 py-3">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Dashboard
            </Button>
            <Button onClick={handleSignOut} variant="outline" className="rounded-xl px-6 py-3">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-border bg-card rounded-2xl">
              <CardHeader className="text-center pb-6">
                <div className="relative mx-auto mb-6">
                  <Avatar className="h-24 w-24 border-4 border-primary/20">
                    <AvatarImage src={profile?.avatar_url || ''} />
                    <AvatarFallback className="bg-primary/10">
                      <User className="h-12 w-12 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    id="avatar-upload"
                    disabled={uploadingAvatar}
                  />
                  <label htmlFor="avatar-upload">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0 cursor-pointer"
                      disabled={uploadingAvatar}
                      asChild
                    >
                      <span>
                        {uploadingAvatar ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        ) : (
                          <Camera className="h-4 w-4" />
                        )}
                      </span>
                    </Button>
                  </label>
                </div>
                <CardTitle className="text-xl font-playfair text-foreground">{profile?.full_name || 'User'}</CardTitle>
                <CardDescription className="text-muted-foreground">@{profile?.username || 'new-user'}</CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                {!editing ? (
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground block mb-1">Email</label>
                      <p className="text-foreground font-medium">{user?.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground block mb-1">Username (unique) *</label>
                      <p className="text-foreground font-medium">{profile?.username || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground block mb-1">Full name (optional)</label>
                      <p className="text-foreground font-medium">{profile?.full_name || 'Not set'}</p>
                    </div>
                    {(editForm.age || editForm.gender || editForm.dominant_hand) && (
                      <>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground block mb-1">Age</label>
                          <p className="text-foreground font-medium">{editForm.age || 'Not set'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground block mb-1">Gender</label>
                          <p className="text-foreground font-medium">{editForm.gender || 'Not set'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground block mb-1">Dominant Hand</label>
                          <p className="text-foreground font-medium">{editForm.dominant_hand || 'Not set'}</p>
                        </div>
                      </>
                    )}
                    <Button onClick={() => setEditing(true)} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-3">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit profile
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground block mb-2">Username (unique) *</label>
                      <Input
                        value={editForm.username}
                        onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                        placeholder="Username"
                        className="bg-background border-border focus:border-primary focus:ring-primary rounded-xl"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground block mb-2">Full name (optional)</label>
                      <Input
                        value={editForm.full_name}
                        onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                        placeholder="Full name"
                        className="bg-background border-border focus:border-primary focus:ring-primary rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground block mb-2">Age</label>
                      <Input
                        type="number"
                        value={editForm.age}
                        onChange={(e) => setEditForm({...editForm, age: e.target.value})}
                        placeholder="Your age"
                        min="1"
                        max="150"
                        className="bg-background border-border focus:border-primary focus:ring-primary rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground block mb-2">Gender</label>
                      <select 
                        value={editForm.gender}
                        onChange={(e) => setEditForm({...editForm, gender: e.target.value})}
                        className="w-full py-3 px-4 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground text-base"
                      >
                        <option value="">Select your gender</option>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Non-binary">Non-binary</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground block mb-2">Dominant Hand</label>
                      <select 
                        value={editForm.dominant_hand}
                        onChange={(e) => setEditForm({...editForm, dominant_hand: e.target.value})}
                        className="w-full py-3 px-4 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground text-base"
                      >
                        <option value="">Select your dominant hand</option>
                        <option value="Left">Left</option>
                        <option value="Right">Right</option>
                      </select>
                    </div>
                    <div className="flex gap-3">
                      <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl">Save</Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => setEditing(false)} className="rounded-xl">
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Readings History */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-border bg-card rounded-2xl">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-playfair text-foreground">My Palm Readings</CardTitle>
                <CardDescription className="text-muted-foreground text-base mt-2">
                  History of your palm readings ({readings.length} reading{readings.length !== 1 ? 's' : ''})
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                {readings.length === 0 ? (
                  <div className="text-center py-12">
                    <Hand className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                    <p className="text-foreground text-lg mb-6">No palm readings yet</p>
                    <Button onClick={() => navigate('/palm-reading')} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 py-3">
                      Start a reading
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {readings.map((reading) => (
                      <div key={reading.id} className="border border-border rounded-xl p-6 bg-muted/30">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h3 className="font-playfair font-medium text-xl text-foreground">{reading.name}</h3>
                            <p className="text-foreground mt-1">
                              {reading.age} years old • {reading.gender} • Dominant hand: {reading.dominant_hand}
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                              {new Date(reading.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        {reading.reading_result && (
                          <div className="mt-6 p-6 bg-background rounded-xl">
                            <MarkdownRenderer content={reading.reading_result} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
