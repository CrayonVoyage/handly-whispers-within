import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users, Hand } from 'lucide-react';

const Compare = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Hand className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-playfair font-medium text-foreground mb-6">
            Handly
          </h1>
          <Button 
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <Card className="bg-card shadow-lg border-border rounded-2xl">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <Users className="h-16 w-16 text-primary" />
            </div>
            <CardTitle className="text-3xl font-playfair font-medium text-foreground">
              Compare with Others
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg text-foreground mb-4">
              Coming soon
            </p>
            <p className="text-muted-foreground">
              This feature will allow you to compare your palm reading results with other users and discover interesting patterns and similarities.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Compare;