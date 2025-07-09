import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

interface NarrativeComparisonProps {
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

export const NarrativeComparison: React.FC<NarrativeComparisonProps> = ({
  currentUser,
  compareUser
}) => {
  // Get palm lines data or use stub data
  const currentPalmLines = currentUser.palmData.palm_lines_data || getStubPalmData();
  const comparePalmLines = compareUser.palmData.palm_lines_data || getStubPalmData();

  const generateNarrativeSummary = () => {
    const ageDiff = Math.abs(currentUser.palmData.age - compareUser.palmData.age);
    const sameHand = currentUser.palmData.dominant_hand === compareUser.palmData.dominant_hand;
    
    let summary = `${currentUser.profile.username} and ${compareUser.profile.username} `;
    
    if (ageDiff <= 5) {
      summary += "share a similar generational perspective, which creates natural common ground. ";
    } else {
      summary += "bring different generational experiences, offering fresh perspectives to each other. ";
    }
    
    if (sameHand) {
      summary += "Both being " + currentUser.palmData.dominant_hand.toLowerCase() + "-handed suggests similar cognitive patterns. ";
    } else {
      summary += "Their different dominant hands hint at complementary thinking styles. ";
    }
    
    summary += "Together, they could form a balanced partnership where differences spark growth and similarities provide comfort.";
    
    return summary;
  };

  const analyzeMentality = () => {
    const currentHead = currentPalmLines.headLine;
    const compareHead = comparePalmLines.headLine;
    
    if (!currentHead || !compareHead) return "Both individuals show thoughtful approaches to problem-solving, though their specific mental patterns vary in unique ways.";
    
    const similar = currentHead.shape.toLowerCase().includes(compareHead.shape.toLowerCase().split(' ')[0]) || 
                   compareHead.shape.toLowerCase().includes(currentHead.shape.toLowerCase().split(' ')[0]);
    
    if (similar) {
      return `Both ${currentUser.profile.username} and ${compareUser.profile.username} demonstrate similar thinking patterns with their ${currentHead.shape} head lines. This alignment suggests they naturally understand each other's mental processes and could collaborate effortlessly on complex tasks.`;
    } else {
      return `${currentUser.profile.username}'s ${currentHead.shape} head line contrasts beautifully with ${compareUser.profile.username}'s ${compareHead.shape} approach. This difference creates a dynamic where one's analytical strength complements the other's intuitive insights, leading to well-rounded decisions.`;
    }
  };

  const analyzeEmotions = () => {
    const currentHeart = currentPalmLines.heartLine;
    const compareHeart = comparePalmLines.heartLine;
    
    if (!currentHeart || !compareHeart) return "Both individuals show capacity for deep emotional connections, though they express affection in their own distinctive ways.";
    
    const depthMatch = currentHeart.depth === compareHeart.depth;
    
    if (depthMatch) {
      return `With both having ${currentHeart.depth} heart lines, ${currentUser.profile.username} and ${compareUser.profile.username} operate on similar emotional wavelengths. They likely understand each other's need for intimacy and emotional expression without much explanation needed.`;
    } else {
      return `${currentUser.profile.username}'s ${currentHeart.depth} emotional expression pairs intriguingly with ${compareUser.profile.username}'s ${compareHeart.depth} approach to relationships. This creates opportunities for one to draw out the other's hidden depths while learning new ways to connect.`;
    }
  };

  const analyzeEnergy = () => {
    const currentLife = currentPalmLines.lifeLine;
    const compareLife = comparePalmLines.lifeLine;
    
    if (!currentLife || !compareLife) return "Both individuals bring their own unique energy and vitality to any shared endeavor or relationship.";
    
    const shapeCompat = currentLife.shape.toLowerCase().includes('long') && compareLife.shape.toLowerCase().includes('long');
    
    if (shapeCompat) {
      return `Both ${currentUser.profile.username} and ${compareUser.profile.username} possess strong life forces with their ${currentLife.shape} life lines. This shared vitality means they can match each other's pace and enthusiasm, whether in adventures or long-term commitments.`;
    } else {
      return `The contrast between ${currentUser.profile.username}'s ${currentLife.shape} life line and ${compareUser.profile.username}'s ${compareLife.shape} creates an interesting energy dynamic. One might provide steady grounding while the other brings bursts of inspiration, creating a balanced rhythm together.`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Narrative Summary */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl text-center text-foreground">Compatibility Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed text-center">
            {generateNarrativeSummary()}
          </p>
        </CardContent>
      </Card>

      {/* Narrative Sections */}
      <div className="space-y-4">
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-primary">Mentality & Thinking</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed">
              {analyzeMentality()}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-primary">Emotions & Relationships</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed">
              {analyzeEmotions()}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-primary">Energy & Rhythm</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed">
              {analyzeEnergy()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Closing Note */}
      <div className="text-center mt-6">
        <p className="text-sm text-muted-foreground italic">
          This is a fun and reflective comparison — no judgment, no prediction.
        </p>
      </div>
    </div>
  );
};