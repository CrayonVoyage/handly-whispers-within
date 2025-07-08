import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Hand } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card shadow-lg border-sand-200 rounded-2xl">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-6">
            <Hand className="h-16 w-16 text-violet-600" />
          </div>
          <CardTitle className="text-3xl font-playfair font-medium text-navy-800">
            Welcome to Handly
          </CardTitle>
          <CardDescription className="text-navy-600 text-base mt-2">
            Discover the secrets hidden in your palms
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8 space-y-4">
          <Button 
            onClick={() => navigate('/auth?mode=login')}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-4 text-base font-medium shadow-sm hover:shadow-md transition-all"
          >
            Login
          </Button>
          <Button 
            onClick={() => navigate('/auth?mode=signup')}
            variant="outline"
            className="w-full border-violet-600 text-violet-600 hover:bg-violet-50 rounded-xl py-4 text-base font-medium"
          >
            Create Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Landing;