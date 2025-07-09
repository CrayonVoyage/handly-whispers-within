import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Hand } from 'lucide-react';

export const CompletePalmReadingPrompt: React.FC = () => {
  const navigate = useNavigate();

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
            <CardTitle className="text-2xl font-playfair font-medium text-foreground">
              Complete Your Palm Reading First
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              You need to complete your own palm reading before you can compare with others.
            </p>
            <Button onClick={() => navigate('/palm-reading')}>
              Start Palm Reading
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};