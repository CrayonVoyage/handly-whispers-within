import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, LogOut, Settings, Hand } from 'lucide-react';
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
    full_name: ''
  });

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
          full_name: data.full_name || ''
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
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user?.id,
          username: editForm.username || null,
          full_name: editForm.full_name || null,
          updated_at: new Date().toISOString()
        });

      if (error) {
        toast({
          title: "Error",
          description: "Unable to update profile",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
      
      setEditing(false);
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <Hand className="h-16 w-16 text-violet-600 mx-auto animate-pulse" />
          <p className="mt-6 text-navy-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 p-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
          <h1 className="text-4xl font-playfair font-medium text-navy-800">My Profile</h1>
          <Button onClick={handleSignOut} variant="outline" className="border-sand-300 text-navy-700 hover:bg-sand-100 rounded-xl px-6 py-3">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-sand-200 bg-card rounded-2xl">
              <CardHeader className="text-center pb-6">
                <Avatar className="h-24 w-24 mx-auto mb-6 border-4 border-violet-200">
                  <AvatarImage src={profile?.avatar_url || ''} />
                  <AvatarFallback className="bg-violet-100">
                    <User className="h-12 w-12 text-violet-600" />
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl font-playfair text-navy-800">{profile?.full_name || 'User'}</CardTitle>
                <CardDescription className="text-navy-600">@{profile?.username || 'new-user'}</CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                {!editing ? (
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium text-navy-600 block mb-1">Email</label>
                      <p className="text-navy-800 font-medium">{user?.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-navy-600 block mb-1">Username</label>
                      <p className="text-navy-800 font-medium">{profile?.username || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-navy-600 block mb-1">Full name</label>
                      <p className="text-navy-800 font-medium">{profile?.full_name || 'Not set'}</p>
                    </div>
                    <Button onClick={() => setEditing(true)} className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-3">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit profile
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div>
                      <label className="text-sm font-medium text-navy-600 block mb-2">Username</label>
                      <Input
                        value={editForm.username}
                        onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                        placeholder="Username"
                        className="bg-white border-sand-300 focus:border-violet-400 focus:ring-violet-400 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-navy-600 block mb-2">Full name</label>
                      <Input
                        value={editForm.full_name}
                        onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                        placeholder="Full name"
                        className="bg-white border-sand-300 focus:border-violet-400 focus:ring-violet-400 rounded-xl"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button type="submit" size="sm" className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl">Save</Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => setEditing(false)} className="border-sand-300 text-navy-700 hover:bg-sand-100 rounded-xl">
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
            <Card className="shadow-lg border-sand-200 bg-card rounded-2xl">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-playfair text-navy-800">My Palm Readings</CardTitle>
                <CardDescription className="text-navy-600 text-base mt-2">
                  History of your palm readings ({readings.length} reading{readings.length !== 1 ? 's' : ''})
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                {readings.length === 0 ? (
                  <div className="text-center py-12">
                    <Hand className="h-16 w-16 text-sand-400 mx-auto mb-6" />
                    <p className="text-navy-600 text-lg mb-6">No palm readings yet</p>
                    <Button onClick={() => navigate('/')} className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-6 py-3">
                      Start a reading
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {readings.map((reading) => (
                      <div key={reading.id} className="border border-sand-200 rounded-xl p-6 bg-cream-50/30">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h3 className="font-playfair font-medium text-xl text-navy-800">{reading.name}</h3>
                            <p className="text-navy-600 mt-1">
                              {reading.age} years old • {reading.gender} • Dominant hand: {reading.dominant_hand}
                            </p>
                            <p className="text-sm text-navy-500 mt-2">
                              {new Date(reading.created_at).toLocaleDateString('fr-FR', {
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
                          <div className="mt-6 p-6 bg-white rounded-xl">
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
