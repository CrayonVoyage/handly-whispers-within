
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Hand className="h-16 w-16 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Handly - Lecture de la Main
          </h1>
          <p className="text-lg text-gray-600">
            Découvrez les secrets cachés dans vos lignes de main
          </p>
        </div>

        {/* Auth Notice */}
        {!user && (
          <Card className="mb-8 border-indigo-200 bg-indigo-50">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <h3 className="font-semibold text-indigo-900">Sauvegardez vos lectures</h3>
                <p className="text-indigo-700">Connectez-vous pour sauvegarder et retrouver vos lectures de main</p>
              </div>
              <Button onClick={() => navigate('/auth')} className="bg-indigo-600 hover:bg-indigo-700">
                <LogIn className="h-4 w-4 mr-2" />
                Se connecter
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step <= currentStep 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step < currentStep ? 'bg-indigo-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Étape 1: Informations Personnelles</CardTitle>
              <CardDescription>
                Ces informations nous aident à personnaliser votre lecture
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PersonalInfoForm onSubmit={handlePersonalInfoSubmit} />
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Étape 2: Photos de vos Mains</CardTitle>
              <CardDescription>
                Prenez des photos claires de vos deux mains pour une lecture précise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUploadSection
                dominantHandImage={dominantHandImage}
                nonDominantHandImage={nonDominantHandImage}
                onDominantHandChange={setDominantHandImage}
                onNonDominantHandChange={setNonDominantHandImage}
              />
              <div className="flex gap-4 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep(1)}
                  className="flex-1"
                >
                  Retour
                </Button>
                <Button 
                  onClick={handleImagesSubmit}
                  disabled={isLoading || !dominantHandImage || !nonDominantHandImage}
                  className="flex-1"
                >
                  {isLoading ? 'Analyse en cours...' : 'Générer ma lecture'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Votre Lecture de Main</CardTitle>
              <CardDescription>
                Découvrez ce que vos lignes de main révèlent sur vous
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PalmReadingResult 
                result={palmReading}
                personalInfo={personalInfo}
                onReset={resetForm}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HandlyForm;
