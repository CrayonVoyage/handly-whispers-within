import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Hand, ArrowLeft } from 'lucide-react';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Hand className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-playfair font-medium text-foreground mb-6">About Handly</h1>
          <Button onClick={() => navigate('/dashboard')} variant="outline" className="rounded-xl px-6 py-3">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Dashboard
          </Button>
        </div>

        <div className="space-y-8">
          {/* About the App */}
          <Card className="shadow-lg border-border bg-card rounded-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-playfair text-foreground">About the App</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-foreground">
              <p>
                Handly is an innovative palm reading application that combines traditional palmistry 
                with modern technology to provide personalized insights about your personality, 
                life patterns, and potential future paths.
              </p>
              <p>
                Our advanced AI analyzes the unique lines, mounts, and characteristics of your palms 
                to generate detailed readings that can help you better understand yourself and make 
                informed decisions about your life journey.
              </p>
              <p>
                Whether you're curious about your love life, career prospects, or personal growth, 
                Handly offers a fascinating glimpse into what your hands might reveal about your destiny.
              </p>
            </CardContent>
          </Card>

          {/* About the Creator */}
          <Card className="shadow-lg border-border bg-card rounded-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-playfair text-foreground">About the Creator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-foreground">
              <p>
                This application was created with passion for combining ancient wisdom with cutting-edge technology. 
                Our mission is to make palmistry accessible to everyone while maintaining respect for this 
                traditional practice.
              </p>
              <p>
                We believe that self-discovery and personal insight are valuable tools for personal growth, 
                and we're committed to providing accurate, thoughtful, and meaningful palm readings.
              </p>
              <p>
                <em>More details about the creator and development journey will be added here soon.</em>
              </p>
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="shadow-lg border-border bg-card rounded-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-playfair text-foreground">Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-foreground">
              <ul className="space-y-2">
                <li>• AI-powered palm analysis</li>
                <li>• Detailed personality insights</li>
                <li>• Life path predictions</li>
                <li>• Secure image processing</li>
                <li>• Personal reading history</li>
                <li>• Community comparison features</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;