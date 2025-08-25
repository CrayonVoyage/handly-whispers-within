import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import MarkdownRenderer from '../MarkdownRenderer';

interface UserProfile {
  username: string;
  full_name: string;
  avatar_url: string | null;
}

interface PalmLineData {
  shape: string;
  depth: string;
  interpretation: string;
}

interface PalmLinesData {
  lifeLine?: PalmLineData;
  headLine?: PalmLineData;
  heartLine?: PalmLineData;
}

interface PalmReadingData {
  age: number;
  gender: string;
  dominant_hand: string;
  reading_result: string | null;
  palm_lines_data?: PalmLinesData | null;
}

interface UserComparisonData {
  profile: UserProfile;
  palmData: PalmReadingData;
}

interface PalmReadingComparisonProps {
  currentUser: UserComparisonData;
  compareUser: UserComparisonData;
}

// Helper function to get stub data if structured data is not available
const getStubPalmData = (): PalmLinesData => ({
  lifeLine: {
    shape: "long and curved",
    depth: "deep",
    interpretation: "Indicates vitality and longevity with strong life force"
  },
  headLine: {
    shape: "straight and clear",
    depth: "medium",
    interpretation: "Shows logical thinking and practical approach to life"
  },
  heartLine: {
    shape: "curved upward",
    depth: "deep",
    interpretation: "Reveals emotional depth and capacity for love"
  }
});

// Helper function to compare two line attributes
const getComparisonBadge = (attr1: string, attr2: string) => {
  if (attr1.toLowerCase() === attr2.toLowerCase()) {
    return <Badge variant="secondary" className="bg-blue-100 text-blue-800">🔵 Similar</Badge>;
  }
  
  // Simple heuristics for opposite/complementary
  const opposites = [
    ['long', 'short'], ['deep', 'shallow'], ['curved', 'straight'],
    ['clear', 'faint'], ['strong', 'weak']
  ];
  
  const isOpposite = opposites.some(([a, b]) => 
    (attr1.toLowerCase().includes(a) && attr2.toLowerCase().includes(b)) ||
    (attr1.toLowerCase().includes(b) && attr2.toLowerCase().includes(a))
  );
  
  if (isOpposite) {
    return <Badge variant="destructive" className="bg-red-100 text-red-800">🔴 Opposite</Badge>;
  }
  
  return <Badge variant="outline" className="bg-orange-100 text-orange-800">🟠 Complementary</Badge>;
};

export const PalmReadingComparison: React.FC<PalmReadingComparisonProps> = ({
  currentUser,
  compareUser
}) => {
  // Get palm lines data or use stub data
  const currentPalmLines = currentUser.palmData.palm_lines_data || getStubPalmData();
  const comparePalmLines = compareUser.palmData.palm_lines_data || getStubPalmData();

  const palmLines = [
    { key: 'lifeLine', name: 'Life Line', data: [currentPalmLines.lifeLine, comparePalmLines.lifeLine] },
    { key: 'headLine', name: 'Head Line', data: [currentPalmLines.headLine, comparePalmLines.headLine] },
    { key: 'heartLine', name: 'Heart Line', data: [currentPalmLines.heartLine, comparePalmLines.heartLine] }
  ];

  return (
    <div className="space-y-6">
      {/* Line-by-line comparison */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground mb-4">Palm Lines Comparison</h3>
        
        {palmLines.map(({ key, name, data }) => {
          const [currentLine, compareLine] = data;
          
          if (!currentLine || !compareLine) return null;
          
          return (
            <Card key={key} className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-primary">{name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Current user */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-primary">Your {name}</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Shape:</span>
                        <span>{currentLine.shape}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Depth:</span>
                        <span>{currentLine.depth}</span>
                      </div>
                      <div className="mt-2">
                        <span className="font-medium">Interpretation:</span>
                        <p className="text-muted-foreground mt-1">{currentLine.interpretation}</p>
                      </div>
                    </div>
                  </div>

                  {/* Compare user */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-secondary">{compareUser.profile.username}'s {name}</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Shape:</span>
                        <span>{compareLine.shape}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Depth:</span>
                        <span>{compareLine.depth}</span>
                      </div>
                      <div className="mt-2">
                        <span className="font-medium">Interpretation:</span>
                        <p className="text-muted-foreground mt-1">{compareLine.interpretation}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comparison badges */}
                <div className="border-t pt-3">
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Shape:</span>
                      {getComparisonBadge(currentLine.shape, compareLine.shape)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Depth:</span>
                      {getComparisonBadge(currentLine.depth, compareLine.depth)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Overall reading comparison - fallback */}
      {(!currentPalmLines.lifeLine && !currentPalmLines.headLine && !currentPalmLines.heartLine) && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg text-primary text-center">Your Palm Reading</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-foreground line-clamp-6">
                <MarkdownRenderer content={currentUser.palmData.reading_result || ''} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-secondary/20">
            <CardHeader>
              <CardTitle className="text-lg text-secondary text-center">{compareUser.profile.username}'s Palm Reading</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-foreground line-clamp-6">
                <MarkdownRenderer content={compareUser.palmData.reading_result || ''} />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Disclaimer */}
      <div className="text-center mt-6">
        <p className="text-sm text-muted-foreground italic">
          This is a fun and reflective comparison. Palm reading interpretations are for entertainment purposes.
        </p>
      </div>
    </div>
  );
};