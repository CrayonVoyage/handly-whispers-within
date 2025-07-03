
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, RotateCcw } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';
import type { PersonalInfo } from '@/types/handly';

interface PalmReadingResultProps {
  result: string;
  personalInfo: PersonalInfo;
  onReset: () => void;
}

const PalmReadingResult: React.FC<PalmReadingResultProps> = ({ 
  result, 
  personalInfo, 
  onReset 
}) => {
  if (!result) return null;

  return (
    <div className="space-y-6">
      <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-indigo-200">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-indigo-900 flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-indigo-600" />
            Votre Lecture de Main
            <Sparkles className="h-6 w-6 text-indigo-600" />
          </CardTitle>
          <p className="text-indigo-700">
            Lecture personnalisée pour {personalInfo.name}
          </p>
        </CardHeader>
        <CardContent>
          <MarkdownRenderer content={result} />
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button 
          onClick={onReset}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Nouvelle lecture
        </Button>
      </div>
    </div>
  );
};

export default PalmReadingResult;
