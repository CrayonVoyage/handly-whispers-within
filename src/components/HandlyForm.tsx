
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import PersonalInfoForm from './PersonalInfoForm';
import ImageUploadSection from './ImageUploadSection';
import PalmReadingResult from './PalmReadingResult';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { generatePalmReading } from '@/services/palmReading';
import type { PersonalInfo } from '@/types/handly';

const HandlyForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: '',
    age: '',
    gender: '',
    dominant_hand: ''
  });
  const [dominantHandImage, setDominantHandImage] = useState<File | null>(null);
  const [nonDominantHandImage, setNonDominantHandImage] = useState<File | null>(null);
  const [palmReading, setPalmReading] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user profile data to pre-fill form
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        // Get profile data
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, username')
          .eq('user_id', user.id)
          .maybeSingle();

        // Get palm reading data
        const { data: palmData } = await supabase
          .from('handly_users')
          .select('age, gender, dominant_hand')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        // Pre-fill form with existing data
        setPersonalInfo({
          name: profileData?.full_name || profileData?.username || '',
          age: palmData?.age?.toString() || '',
          gender: palmData?.gender || '',
          dominant_hand: palmData?.dominant_hand || ''
        });
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchUserProfile();
  }, [user]);

  const uploadImage = async (file: File, path: string) => {
    console.log('Uploading image to path:', path);
    
    const { data, error } = await supabase.storage
      .from('hand-images')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Upload error:', error);
      throw error;
    }

    const { data: urlData } = supabase.storage
      .from('hand-images')
      .getPublicUrl(path);

    console.log('Image uploaded successfully:', urlData.publicUrl);
    return urlData.publicUrl;
  };

  const handleInputChange = (field: string, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!personalInfo.name || !personalInfo.age || !personalInfo.gender || !personalInfo.dominant_hand) {
      toast({
        title: "Missing information",
        description: "Please fill in all personal information fields",
        variant: "destructive"
      });
      return;
    }

    if (!dominantHandImage || !nonDominantHandImage) {
      toast({
        title: "Missing images",
        description: "Please upload both hand photos",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const timestamp = Date.now();
      const userId = user?.id || 'anonymous';
      
      const dominantHandUrl = await uploadImage(
        dominantHandImage, 
        `${userId}/dominant_hand_${timestamp}.jpg`
      );
      
      const nonDominantHandUrl = await uploadImage(
        nonDominantHandImage, 
        `${userId}/non_dominant_hand_${timestamp}.jpg`
      );

      console.log('Generating palm reading...');
      const reading = await generatePalmReading({
        name: personalInfo.name,
        age: parseInt(personalInfo.age),
        gender: personalInfo.gender as any,
        dominant_hand: personalInfo.dominant_hand as any,
        dominant_hand_image: dominantHandUrl,
        non_dominant_hand_image: nonDominantHandUrl
      });

      console.log('Palm reading generated successfully');
      setPalmReading(reading);
      
      // Save to database
      const { error: dbError } = await supabase
        .from('handly_users')
        .insert({
          name: personalInfo.name,
          age: parseInt(personalInfo.age),
          gender: personalInfo.gender as any,
          dominant_hand: personalInfo.dominant_hand as any,
          dominant_hand_image_url: dominantHandUrl,
          non_dominant_hand_image_url: nonDominantHandUrl,
          reading_result: reading,
          user_id: user?.id || null
        });

      if (dbError) {
        console.error('Database error:', dbError);
        throw dbError;
      }
      
    } catch (error) {
      console.error('Error processing images:', error);
      toast({
        title: "Error",
        description: "An error occurred while processing your images",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setPersonalInfo({ name: '', age: '', gender: '', dominant_hand: '' });
    setDominantHandImage(null);
    setNonDominantHandImage(null);
    setPalmReading('');
  };

  return (
    <div className="min-h-screen bg-cream-50 p-4 py-12">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-playfair font-medium text-navy-800 mb-4">
            Handly
          </h1>
          <p className="text-xl font-playfair italic text-navy-600">
            "There's a map in your hand."
          </p>
        </div>

        {/* Auth Notice */}
        {!user && (
          <Card className="border-violet-200 bg-lavender-50/50 shadow-sm">
            <CardContent className="flex flex-col sm:flex-row items-center justify-between p-8 gap-4">
              <div className="text-center sm:text-left">
                <h3 className="font-playfair font-medium text-lg text-navy-800 mb-2">Save your readings</h3>
                <p className="text-navy-600">Sign in to save and access your palm readings</p>
              </div>
              <Button onClick={() => navigate('/auth')} className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Main Form */}
        <Card className="shadow-lg border-sand-200 bg-card rounded-2xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-playfair text-navy-800">Your Information</CardTitle>
            <CardDescription className="text-navy-600 text-base mt-2">
              Tell us about yourself for a personalized reading
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-8">
                {/* Name */}
                <div>
                  <label className="block text-base font-medium text-navy-700 mb-3">
                    Your name *
                  </label>
                  <input 
                    value={personalInfo.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full bg-white border border-sand-300 focus:border-violet-400 focus:ring-violet-400 focus:ring-2 focus:ring-opacity-20 rounded-xl py-3 px-4 text-base outline-none transition-all"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="block text-base font-medium text-navy-700 mb-3">
                    Your age *
                  </label>
                  <input 
                    type="number"
                    value={personalInfo.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    className="w-full bg-white border border-sand-300 focus:border-violet-400 focus:ring-violet-400 focus:ring-2 focus:ring-opacity-20 rounded-xl py-3 px-4 text-base outline-none transition-all"
                    placeholder="Enter your age"
                    min="1"
                    max="150"
                    required
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-base font-medium text-navy-700 mb-3">
                    Gender *
                  </label>
                  <select 
                    value={personalInfo.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full py-3 px-4 bg-white border border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-20 focus:border-violet-400 text-navy-700 text-base transition-all"
                    required
                  >
                    <option value="">Select your gender</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                {/* Dominant Hand */}
                <div>
                  <label className="block text-base font-medium text-navy-700 mb-3">
                    Dominant hand *
                  </label>
                  <select 
                    value={personalInfo.dominant_hand}
                    onChange={(e) => handleInputChange('dominant_hand', e.target.value)}
                    className="w-full py-3 px-4 bg-white border border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-20 focus:border-violet-400 text-navy-700 text-base transition-all"
                    required
                  >
                    <option value="">Select your dominant hand</option>
                    <option value="Left">Left</option>
                    <option value="Right">Right</option>
                  </select>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="pt-4">
                <h3 className="text-xl font-playfair font-medium text-navy-800 mb-6 text-center">Hand Photos</h3>
                <p className="text-navy-600 text-center mb-8">Take clear photos of both hands for an accurate reading</p>
                <ImageUploadSection
                  dominantHandImage={dominantHandImage}
                  nonDominantHandImage={nonDominantHandImage}
                  onDominantHandChange={setDominantHandImage}
                  onNonDominantHandChange={setNonDominantHandImage}
                />
              </div>

              {/* Submit Button */}
              <Button 
                type="submit"
                disabled={isLoading || !personalInfo.name || !personalInfo.age || !personalInfo.gender || !personalInfo.dominant_hand || !dominantHandImage || !nonDominantHandImage}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-4 text-base font-medium shadow-sm hover:shadow-md transition-all"
              >
                {isLoading ? 'Reading your palm...' : 'Read my hand'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Palm Reading Result */}
        {palmReading && (
          <PalmReadingResult 
            result={palmReading}
            personalInfo={personalInfo}
            onReset={resetForm}
          />
        )}

        {/* Footer link */}
        <div className="text-center">
          <button
            onClick={() => navigate('/reading-method')}
            className="text-base text-violet-600 hover:text-violet-800 font-medium underline"
          >
            How does our reading method work?
          </button>
        </div>
      </div>
    </div>
  );
};

export default HandlyForm;
