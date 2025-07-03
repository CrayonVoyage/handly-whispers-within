
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

const HandlyForm: React.FC = () => {
  console.log('HandlyForm component rendering...');
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    dominant_hand: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [readingResult, setReadingResult] = useState<string>('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    setIsLoading(true);
    
    // Mock reading for now
    setTimeout(() => {
      setReadingResult(`Dear ${formData.name || 'friend'}, your hand reveals a story of resilience and creativity. The lines speak of someone who values authentic connections and has the wisdom to trust their intuition.`);
      setIsLoading(false);
    }, 2000);
  };

  try {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-indigo-900 mb-4">
              Handly
            </h1>
            <p className="text-lg text-indigo-700 italic">
              There's a map in your hand.
            </p>
          </div>

          {/* Form */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl text-indigo-900">
                Discover Your Hand's Story
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-indigo-800 mb-2">
                    Your Name *
                  </label>
                  <Input 
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="bg-white/50"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-indigo-800 mb-2">
                    Your Age *
                  </label>
                  <Input 
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    className="bg-white/50"
                    placeholder="Enter your age"
                    required
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-indigo-800 mb-2">
                    Gender *
                  </label>
                  <select 
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full h-10 px-3 py-2 bg-white/50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                {/* Dominant Hand */}
                <div>
                  <label className="block text-sm font-medium text-indigo-800 mb-2">
                    Dominant Hand *
                  </label>
                  <select 
                    value={formData.dominant_hand}
                    onChange={(e) => handleInputChange('dominant_hand', e.target.value)}
                    className="w-full h-10 px-3 py-2 bg-white/50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    required
                  >
                    <option value="">Select dominant hand</option>
                    <option value="Left">Left</option>
                    <option value="Right">Right</option>
                  </select>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
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
          {readingResult && (
            <Card className="mt-12 bg-white/90 backdrop-blur-sm shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl text-indigo-900 flex items-center justify-center gap-2">
                  <Sparkles className="h-6 w-6 text-indigo-600" />
                  Your Hand's Story
                  <Sparkles className="h-6 w-6 text-indigo-600" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-lg max-w-none">
                  <p className="text-indigo-800 leading-relaxed whitespace-pre-wrap">
                    {readingResult}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
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
