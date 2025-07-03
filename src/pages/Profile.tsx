
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
          title: "Erreur",
          description: "Impossible de mettre à jour le profil",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Profil mis à jour avec succès"
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Hand className="h-12 w-12 text-indigo-600 mx-auto animate-pulse" />
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
          <Button onClick={handleSignOut} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="h-20 w-20 mx-auto mb-4">
                  <AvatarImage src={profile?.avatar_url || ''} />
                  <AvatarFallback>
                    <User className="h-10 w-10" />
                  </AvatarFallback>
                </Avatar>
                <CardTitle>{profile?.full_name || 'Utilisateur'}</CardTitle>
                <CardDescription>@{profile?.username || 'nouveau-utilisateur'}</CardDescription>
              </CardHeader>
              <CardContent>
                {!editing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900">{user?.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Nom d'utilisateur</label>
                      <p className="text-gray-900">{profile?.username || 'Non défini'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Nom complet</label>
                      <p className="text-gray-900">{profile?.full_name || 'Non défini'}</p>
                    </div>
                    <Button onClick={() => setEditing(true)} className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Modifier le profil
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Nom d'utilisateur</label>
                      <Input
                        value={editForm.username}
                        onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                        placeholder="Nom d'utilisateur"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Nom complet</label>
                      <Input
                        value={editForm.full_name}
                        onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                        placeholder="Nom complet"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" size="sm">Sauvegarder</Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => setEditing(false)}>
                        Annuler
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Readings History */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Mes Lectures de Main</CardTitle>
                <CardDescription>
                  Historique de vos lectures palmaires ({readings.length} lecture{readings.length !== 1 ? 's' : ''})
                </CardDescription>
              </CardHeader>
              <CardContent>
                {readings.length === 0 ? (
                  <div className="text-center py-8">
                    <Hand className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Aucune lecture de main pour le moment</p>
                    <Button onClick={() => navigate('/')} className="mt-4">
                      Commencer une lecture
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {readings.map((reading) => (
                      <div key={reading.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{reading.name}</h3>
                            <p className="text-sm text-gray-600">
                              {reading.age} ans • {reading.gender} • Main dominante: {reading.dominant_hand}
                            </p>
                            <p className="text-xs text-gray-500">
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
                          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
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
