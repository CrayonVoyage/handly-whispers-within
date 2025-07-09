import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PalmReadingData {
  age: number;
  gender: string;
  dominant_hand: string;
}

interface ComparisonInsightsProps {
  currentUserData: PalmReadingData;
  compareUserData: PalmReadingData;
}

export const ComparisonInsights: React.FC<ComparisonInsightsProps> = ({
  currentUserData,
  compareUserData
}) => {
  const getComparisons = () => {
    const similarities: string[] = [];
    const differences: string[] = [];

    // Age comparison
    const ageDiff = Math.abs(currentUserData.age - compareUserData.age);
    if (ageDiff <= 5) {
      similarities.push(`Similar age range → shared generational perspectives`);
    } else {
      differences.push(`Different age groups → varied life experiences`);
    }

    // Gender comparison
    if (currentUserData.gender === compareUserData.gender) {
      similarities.push(`Same gender → potential shared experiences`);
    } else {
      differences.push(`Different genders → diverse perspectives`);
    }

    // Dominant hand comparison
    if (currentUserData.dominant_hand === compareUserData.dominant_hand) {
      similarities.push(`Both ${currentUserData.dominant_hand.toLowerCase()}-handed → similar brain dominance patterns`);
    } else {
      differences.push(`Different dominant hands → varied brain hemisphere preferences`);
    }

    return { similarities, differences };
  };

  const { similarities, differences } = getComparisons();

  return (
    <Card className="bg-muted/20">
      <CardHeader>
        <CardTitle className="text-xl text-center">Comparison Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {similarities.length > 0 && (
          <div>
            <h4 className="font-medium text-primary mb-2">✨ Similarities:</h4>
            <ul className="space-y-1">
              {similarities.map((item, index) => (
                <li key={index} className="text-sm text-foreground">• {item}</li>
              ))}
            </ul>
          </div>
        )}
        
        {differences.length > 0 && (
          <div>
            <h4 className="font-medium text-secondary mb-2">🔄 Differences:</h4>
            <ul className="space-y-1">
              {differences.map((item, index) => (
                <li key={index} className="text-sm text-foreground">• {item}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="mt-6 p-4 bg-background/50 rounded-lg border">
          <p className="text-sm text-muted-foreground text-center italic">
            This is a fun and reflective comparison — no judgment, no prediction, just perspective.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};