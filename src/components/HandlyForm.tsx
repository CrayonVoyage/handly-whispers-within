
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { generatePalmReading } from '@/services/palmReading';
import { useToast } from '@/hooks/use-toast';
import PersonalInfoForm from './PersonalInfoForm';
import ImageUploadSection from './ImageUploadSection';
import PalmReadingResult from './PalmReadingResult';

const HandlyForm: React.FC = () => {
  console.log('HandlyForm component rendering...');
  
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    dominant_hand: '',
  });
  
  const [dominantHandImage, setDominantHandImage] = useState<File | null>(null);
  const [nonDominantHandImage, setNonDominantHandImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [readingResult, setReadingResult] = useState<string>('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const uploadImage = async (file: File, fileName: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase.storage
        .from('hand-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('hand-images')
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    
    if (!dominantHandImage) {
      toast({
        title: "Error",
        description: "Please upload your dominant hand image",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Upload images to Supabase Storage
      const timestamp = Date.now();
      const dominantHandFileName = `${timestamp}_dominant_${dominantHandImage.name}`;
      const dominantHandUrl = await uploadImage(dominantHandImage, dominantHandFileName);

      if (!dominantHandUrl) {
        throw new Error('Failed to upload dominant hand image');
      }

      let nonDominantHandUrl = null;
      if (nonDominantHandImage) {
        const nonDominantHandFileName = `${timestamp}_non_dominant_${nonDominantHandImage.name}`;
        nonDominantHandUrl = await uploadImage(nonDominantHandImage, nonDominantHandFileName);
      }

      // Generate palm reading
      const reading = await generatePalmReading({
        name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender as any,
        dominant_hand: formData.dominant_hand as any,
        dominant_hand_image: dominantHandUrl,
        non_dominant_hand_image: nonDominantHandUrl
      });

      // Save to database
      const { data, error } = await supabase
        .from('handly_users')
        .insert({
          name: formData.name,
          age: parseInt(formData.age),
          gender: formData.gender as any,
          dominant_hand: formData.dominant_hand as any,
          dominant_hand_image_url: dominantHandUrl,
          non_dominant_hand_image_url: nonDominantHandUrl,
          reading_result: reading
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      setReadingResult(reading);
      toast({
        title: "Success!",
        description: "Your palm reading has been generated and saved.",
      });

    } catch (error) {
      console.error('Error processing form:', error);
      toast({
        title: "Error",
        description: "Failed to process your palm reading. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  try {
    return (
      <div className="min-h-screen bg-sand-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Enhanced Header */}
          <header className="text-center mb-16">
            <h1 className="text-6xl md:text-7xl font-playfair font-bold text-sand-900 mb-6 tracking-wide">
              Handly
            </h1>
            <p className="text-xl md:text-2xl font-playfair italic text-sand-700 font-medium">
              There's a map in your hand.
            </p>
          </header>

          {/* Form */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-sand-200">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-playfair text-sand-900">
                Discover Your Hand's Story
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <PersonalInfoForm 
                  formData={formData}
                  onInputChange={handleInputChange}
                />

                <ImageUploadSection
                  dominantHandImage={dominantHandImage}
                  nonDominantHandImage={nonDominantHandImage}
                  setDominantHandImage={setDominantHandImage}
                  setNonDominantHandImage={setNonDominantHandImage}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-sand-700 hover:bg-sand-800 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
                >
                  {isLoading ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                      Reading your palm...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Read my hand
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Reading Result Card */}
          <PalmReadingResult readingResult={readingResult} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error rendering HandlyForm:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
          <p className="text-red-500">Please check the console for details</p>
        </div>
      </div>
    );
  }
};

export default HandlyForm;
