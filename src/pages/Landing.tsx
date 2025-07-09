import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Hand } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card shadow-lg border-border rounded-2xl">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-6">
            <Hand className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-3xl font-playfair font-medium text-foreground">
            Welcome to Handly
          </CardTitle>
          <CardDescription className="text-muted-foreground text-base mt-2">
            Discover the secrets hidden in your palms
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8 space-y-4">
          <Button 
            onClick={() => navigate('/auth?mode=login')}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-4 text-base font-medium shadow-sm hover:shadow-md transition-all"
          >
            Login
          </Button>
          <Button 
            onClick={() => navigate('/auth?mode=signup')}
            variant="outline"
            className="w-full border-primary text-primary hover:bg-primary/10 rounded-xl py-4 text-base font-medium"
          >
            Create Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Landing;