
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
    <div className="space-y-8">
      <Card className="shadow-lg border-sand-200 bg-card rounded-2xl">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl font-playfair text-navy-800 flex items-center justify-center gap-3">
            <Sparkles className="h-7 w-7 text-violet-600" />
            Your Palm Reading
            <Sparkles className="h-7 w-7 text-violet-600" />
          </CardTitle>
          <p className="text-lg text-navy-600 font-playfair italic mt-2">
            Personal reading for {personalInfo.name}
          </p>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <div className="bg-cream-50/50 rounded-xl p-6">
            <MarkdownRenderer content={result} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button 
          onClick={onReset}
          variant="outline"
          className="flex items-center gap-3 border-violet-300 text-violet-700 hover:bg-violet-50 rounded-xl px-8 py-3 text-base shadow-sm hover:shadow-md transition-all"
        >
          <RotateCcw className="h-5 w-5" />
          New reading
        </Button>
      </div>
    </div>
  );
};

export default PalmReadingResult;
