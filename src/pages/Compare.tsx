import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users } from 'lucide-react';

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
    <div className="min-h-screen bg-cream-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="mb-6">
          <Button 
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="border-sand-300 text-navy-600 hover:bg-sand-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <Card className="bg-card shadow-lg border-sand-200 rounded-2xl">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <Users className="h-16 w-16 text-violet-600" />
            </div>
            <CardTitle className="text-3xl font-playfair font-medium text-navy-800">
              Compare with Others
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg text-navy-600 mb-4">
              Coming soon
            </p>
            <p className="text-navy-500">
              This feature will allow you to compare your palm reading results with other users and discover interesting patterns and similarities.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Compare;