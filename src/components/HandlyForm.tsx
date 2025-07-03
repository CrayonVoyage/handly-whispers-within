
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from '@/components/ui/form';
import ImageUpload from './ImageUpload';
import { HandlyUser } from '@/types/handly';
import { generatePalmReading } from '@/services/palmReading';
import { useToast } from '@/hooks/use-toast';
import { Sparkles } from 'lucide-react';

const HandlyForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [readingResult, setReadingResult] = useState<string>('');
  const { toast } = useToast();

  const form = useForm<HandlyUser>({
    defaultValues: {
      name: '',
      age: 0,
      gender: undefined,
      dominant_hand: undefined,
      dominant_hand_image: null,
      non_dominant_hand_image: null,
      is_premium: false,
    },
  });

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = async (data: HandlyUser) => {
    if (!data.dominant_hand_image) {
      toast({
        title: "Missing Image",
        description: "Please upload your dominant hand image to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const dominantHandBase64 = await convertFileToBase64(data.dominant_hand_image);
      let nonDominantHandBase64: string | undefined;
      
      if (data.non_dominant_hand_image) {
        nonDominantHandBase64 = await convertFileToBase64(data.non_dominant_hand_image);
      }

      const reading = await generatePalmReading({
        name: data.name,
        age: data.age,
        gender: data.gender,
        dominant_hand: data.dominant_hand,
        dominant_hand_image: dominantHandBase64,
        non_dominant_hand_image: nonDominantHandBase64,
      });

      setReadingResult(reading);
      
      toast({
        title: "Reading Complete",
        description: "Your palm has revealed its secrets. Scroll down to read your story.",
      });
    } catch (error) {
      console.error('Error generating reading:', error);
      toast({
        title: "Reading Error",
        description: "Unable to generate your palm reading. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-50 to-sand-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-playfair font-bold text-indigo-900 mb-4">
            Handly
          </h1>
          <p className="text-lg text-indigo-700 font-inter font-light italic">
            There's a map in your hand.
          </p>
        </div>

        {/* Form */}
        <Card className="bg-white/80 backdrop-blur-sm border-sand-200 shadow-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-playfair text-indigo-900">
              Discover Your Hand's Story
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: "Name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-indigo-800 font-inter font-medium">
                        Your Name *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="border-sand-300 focus:border-indigo-400 bg-white/50"
                          placeholder="Enter your name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Age */}
                <FormField
                  control={form.control}
                  name="age"
                  rules={{ 
                    required: "Age is required",
                    min: { value: 1, message: "Please enter a valid age" },
                    max: { value: 120, message: "Please enter a valid age" }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-indigo-800 font-inter font-medium">
                        Your Age *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number"
                          className="border-sand-300 focus:border-indigo-400 bg-white/50"
                          placeholder="Enter your age"
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Gender */}
                <FormField
                  control={form.control}
                  name="gender"
                  rules={{ required: "Please select your gender" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-indigo-800 font-inter font-medium">
                        Gender *
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-sand-300 focus:border-indigo-400 bg-white/50">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border-sand-200">
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Non-binary">Non-binary</SelectItem>
                          <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Dominant Hand */}
                <FormField
                  control={form.control}
                  name="dominant_hand"
                  rules={{ required: "Please select your dominant hand" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-indigo-800 font-inter font-medium">
                        Dominant Hand *
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-sand-300 focus:border-indigo-400 bg-white/50">
                            <SelectValue placeholder="Select dominant hand" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border-sand-200">
                          <SelectItem value="Left">Left</SelectItem>
                          <SelectItem value="Right">Right</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Dominant Hand Image */}
                <FormField
                  control={form.control}
                  name="dominant_hand_image"
                  rules={{ required: "Dominant hand image is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <ImageUpload
                        label="Dominant Hand Photo"
                        required
                        image={field.value}
                        onImageChange={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Non-Dominant Hand Image */}
                <FormField
                  control={form.control}
                  name="non_dominant_hand_image"
                  render={({ field }) => (
                    <FormItem>
                      <ImageUpload
                        label="Non-Dominant Hand Photo (Optional)"
                        image={field.value}
                        onImageChange={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-inter font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
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
            </Form>
          </CardContent>
        </Card>

        {/* Reading Result Card */}
        {readingResult && (
          <Card className="mt-12 bg-white/90 backdrop-blur-sm border-sand-200 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-playfair text-indigo-900 flex items-center justify-center gap-2">
                <Sparkles className="h-6 w-6 text-indigo-600" />
                Your Hand's Story
                <Sparkles className="h-6 w-6 text-indigo-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-lg max-w-none">
                <p className="text-indigo-800 font-inter leading-relaxed whitespace-pre-wrap">
                  {readingResult}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HandlyForm;
