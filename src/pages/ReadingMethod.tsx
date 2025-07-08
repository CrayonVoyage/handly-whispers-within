import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Hand, Heart, Brain, Zap, Star, Eye, Target } from 'lucide-react';

const ReadingMethod = () => {
  return (
    <div className="min-h-screen bg-cream-50 p-4 py-12">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-playfair font-medium text-navy-800 mb-4">
            Reading Method
          </h1>
          <p className="text-xl text-navy-600 font-playfair italic">
            Understanding our palm reading approach
          </p>
        </div>

        {/* Introduction */}
        <Card className="shadow-lg border-sand-200 bg-card rounded-2xl">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-6">
              <Hand className="h-16 w-16 text-violet-600" />
            </div>
            <CardTitle className="text-3xl font-playfair text-navy-800">
              How is your palm reading performed?
            </CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <p className="text-navy-600 text-lg leading-relaxed text-center">
              Our method relies on careful observation of the main lines and hand shape. 
              Here is how we proceed:
            </p>
          </CardContent>
        </Card>

        {/* Section 1: Observation générale */}
        <Card className="shadow-lg border-sand-200 bg-card rounded-2xl">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-4">
              <Eye className="h-8 w-8 text-violet-600" />
              <CardTitle className="text-2xl font-playfair text-navy-800">
                1. General observation
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <p className="text-navy-600 text-base leading-relaxed mb-6">
              We begin by analyzing:
            </p>
            <ul className="space-y-3 text-navy-600">
              <li className="flex items-start gap-3">
                <span className="text-violet-600 mt-1">•</span>
                <span>The <strong>hand shape</strong> (square, rectangular, etc.)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-violet-600 mt-1">•</span>
                <span>The <strong>length and position of fingers</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-violet-600 mt-1">•</span>
                <span>The <strong>mounts</strong> (raised areas beneath the fingers)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-violet-600 mt-1">•</span>
                <span>The <strong>texture and flexibility of the skin</strong></span>
              </li>
            </ul>
            <p className="text-navy-600 text-base leading-relaxed mt-6">
              This allows us to understand your <strong>general temperament</strong>: are you more cerebral, 
              intuitive, practical, or emotional?
            </p>
          </CardContent>
        </Card>

        {/* Section 2: Lignes principales */}
        <Card className="shadow-lg border-sand-200 bg-card rounded-2xl">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-4">
              <Target className="h-8 w-8 text-violet-600" />
              <CardTitle className="text-2xl font-playfair text-navy-800">
                2. Analysis of main lines
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8 space-y-8">
            
            {/* Heart line */}
            <div className="bg-cream-50/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="h-6 w-6 text-violet-600" />
                <h3 className="text-xl font-playfair font-medium text-navy-800">Heart line</h3>
              </div>
              <p className="text-navy-600 mb-4">
                It reveals your way of loving and your emotions:
              </p>
              <ul className="space-y-2 text-navy-600">
                <li>• Long and curved: intense affectivity</li>
                <li>• Straight under the index: emotional control</li>
                <li>• Branched: evolving sensitivity</li>
                <li>• Broken: emotional tensions or ruptures</li>
              </ul>
            </div>

            {/* Head line */}
            <div className="bg-cream-50/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="h-6 w-6 text-violet-600" />
                <h3 className="text-xl font-playfair font-medium text-navy-800">Head line</h3>
              </div>
              <p className="text-navy-600 mb-4">
                It reflects your thinking patterns:
              </p>
              <ul className="space-y-2 text-navy-600">
                <li>• Straight: logical, structured mind</li>
                <li>• Curved downward: developed imagination</li>
                <li>• Short: quick decisions</li>
                <li>• Double: two types of intelligence coexist</li>
              </ul>
            </div>

            {/* Life line */}
            <div className="bg-cream-50/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="h-6 w-6 text-violet-600" />
                <h3 className="text-xl font-playfair font-medium text-navy-800">Life line</h3>
              </div>
              <p className="text-navy-600 mb-4">
                It speaks of your vital energy and stability:
              </p>
              <ul className="space-y-2 text-navy-600">
                <li>• Long and marked: vitality, stability</li>
                <li>• Fine or broken: periods of fatigue or change</li>
                <li>• Deviated downward: need for escape or renewal</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Autres lignes */}
        <Card className="shadow-lg border-sand-200 bg-card rounded-2xl">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-4">
              <Star className="h-8 w-8 text-violet-600" />
              <CardTitle className="text-2xl font-playfair text-navy-800">
                3. Other lines
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <p className="text-navy-600 text-base leading-relaxed mb-6">
              Depending on the clarity of your hand, other lines may appear:
            </p>
            <ul className="space-y-3 text-navy-600">
              <li className="flex items-start gap-3">
                <span className="text-violet-600 mt-1">•</span>
                <span>Fate line: vocation or life trajectory</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-violet-600 mt-1">•</span>
                <span>Sun line: personal expression, creativity</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-violet-600 mt-1">•</span>
                <span>Mercury line: communication or practical sense</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Section 4: Synthèse */}
        <Card className="shadow-lg border-sand-200 bg-card rounded-2xl">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-playfair text-navy-800">
              4. Synthesis
            </CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <p className="text-navy-600 text-base leading-relaxed">
              We combine information from the entire hand (dominant and non-dominant) to provide 
              a structured reading of your strengths, internal tensions, and areas for development.
            </p>
          </CardContent>
        </Card>

        {/* Conclusion */}
        <Card className="shadow-lg border-violet-200 bg-lavender-50/50 rounded-2xl">
          <CardContent className="p-8 text-center">
            <p className="text-lg font-medium text-navy-800 mb-2">
              Important to remember
            </p>
            <p className="text-navy-600 text-base leading-relaxed">
              Reading does not predict anything: it offers a <strong>portrait of your personality</strong> based on 
              observable physical traits.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReadingMethod;