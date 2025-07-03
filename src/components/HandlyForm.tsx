
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import PersonalInfoForm from './PersonalInfoForm';
import ImageUploadSection from './ImageUploadSection';
import PalmReadingResult from './PalmReadingResult';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Hand, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { generatePalmReading } from '@/services/palmReading';
import type { PersonalInfo } from '@/types/handly';

const HandlyForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
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

  const handlePersonalInfoSubmit = (info: PersonalInfo) => {
    console.log('Personal info submitted:', info);
    setPersonalInfo(info);
    setCurrentStep(2);
  };

  const handleImagesSubmit = async () => {
    if (!dominantHandImage || !nonDominantHandImage) {
      toast({
        title: "Images manquantes",
        description: "Veuillez télécharger les deux photos de vos mains",
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

      setCurrentStep(3);
      
    } catch (error) {
      console.error('Error processing images:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du traitement de vos images",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setPersonalInfo({ name: '', age: '', gender: '', dominant_hand: '' });
    setDominantHandImage(null);
    setNonDominantHandImage(null);
    setPalmReading('');
  };

  return (
    <div className="min-h-screen bg-cream-50 p-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Hand className="h-20 w-20 text-violet-600" />
          </div>
          <h1 className="text-5xl font-playfair font-medium text-navy-800 mb-4">
            Handly
          </h1>
          <p className="text-xl font-playfair italic text-navy-600 mb-2">
            "There's a map in your hand."
          </p>
          <p className="text-lg text-navy-600 font-inter">
            Découvrez les secrets cachés dans vos lignes de main
          </p>
        </div>

        {/* Auth Notice */}
        {!user && (
          <Card className="mb-12 border-violet-200 bg-lavender-50/50 shadow-sm">
            <CardContent className="flex flex-col sm:flex-row items-center justify-between p-8 gap-4">
              <div className="text-center sm:text-left">
                <h3 className="font-playfair font-medium text-lg text-navy-800 mb-2">Sauvegardez vos lectures</h3>
                <p className="text-navy-600">Connectez-vous pour sauvegarder et retrouver vos lectures de main</p>
              </div>
              <Button onClick={() => navigate('/auth')} className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all">
                <LogIn className="h-4 w-4 mr-2" />
                Se connecter
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Progress Indicator */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-6">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-medium text-lg font-playfair transition-all ${
                  step <= currentStep 
                    ? 'bg-violet-600 text-white shadow-md' 
                    : 'bg-sand-200 text-navy-500'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-20 h-1 mx-3 rounded-full transition-all ${
                    step < currentStep ? 'bg-violet-600' : 'bg-sand-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 1 && (
          <Card className="shadow-lg border-sand-200 bg-card rounded-2xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-playfair text-navy-800">Étape 1: Informations Personnelles</CardTitle>
              <CardDescription className="text-navy-600 text-base mt-2">
                Ces informations nous aident à personnaliser votre lecture
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <PersonalInfoForm onSubmit={handlePersonalInfoSubmit} />
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card className="shadow-lg border-sand-200 bg-card rounded-2xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-playfair text-navy-800">Étape 2: Photos de vos Mains</CardTitle>
              <CardDescription className="text-navy-600 text-base mt-2">
                Prenez des photos claires de vos deux mains pour une lecture précise
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <ImageUploadSection
                dominantHandImage={dominantHandImage}
                nonDominantHandImage={nonDominantHandImage}
                onDominantHandChange={setDominantHandImage}
                onNonDominantHandChange={setNonDominantHandImage}
              />
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 border-sand-300 text-navy-700 hover:bg-sand-100 rounded-xl py-3"
                >
                  Retour
                </Button>
                <Button 
                  onClick={handleImagesSubmit}
                  disabled={isLoading || !dominantHandImage || !nonDominantHandImage}
                  className="flex-1 bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-3 shadow-sm hover:shadow-md transition-all"
                >
                  {isLoading ? 'Analyse en cours...' : 'Générer ma lecture'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && (
          <PalmReadingResult 
            result={palmReading}
            personalInfo={personalInfo}
            onReset={resetForm}
          />
        )}
      </div>
    </div>
  );
};

export default HandlyForm;
