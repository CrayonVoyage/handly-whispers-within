
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

interface PalmReadingResultProps {
  readingResult: string;
}

const PalmReadingResult: React.FC<PalmReadingResultProps> = ({ readingResult }) => {
  if (!readingResult) return null;

  return (
    <Card className="mt-12 bg-white/95 backdrop-blur-sm shadow-2xl border-sand-200">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-playfair text-sand-900 flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 text-sand-600" />
          Your Hand's Story
          <Sparkles className="h-6 w-6 text-sand-600" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <MarkdownRenderer content={readingResult} />
      </CardContent>
    </Card>
  );
};

export default PalmReadingResult;
