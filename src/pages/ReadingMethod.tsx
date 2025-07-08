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
            Méthode de lecture
          </h1>
          <p className="text-xl text-navy-600 font-playfair italic">
            Comprendre notre approche de la lecture palmaire
          </p>
        </div>

        {/* Introduction */}
        <Card className="shadow-lg border-sand-200 bg-card rounded-2xl">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-6">
              <Hand className="h-16 w-16 text-violet-600" />
            </div>
            <CardTitle className="text-3xl font-playfair text-navy-800">
              Comment se fait la lecture de votre main ?
            </CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <p className="text-navy-600 text-lg leading-relaxed text-center">
              Notre méthode repose sur l'observation rigoureuse des lignes principales et de la forme de la main. 
              Voici comment nous procédons :
            </p>
          </CardContent>
        </Card>

        {/* Section 1: Observation générale */}
        <Card className="shadow-lg border-sand-200 bg-card rounded-2xl">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-4">
              <Eye className="h-8 w-8 text-violet-600" />
              <CardTitle className="text-2xl font-playfair text-navy-800">
                1. Observation générale
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <p className="text-navy-600 text-base leading-relaxed mb-6">
              Nous commençons par analyser :
            </p>
            <ul className="space-y-3 text-navy-600">
              <li className="flex items-start gap-3">
                <span className="text-violet-600 mt-1">•</span>
                <span>La <strong>forme de la main</strong> (carrée, rectangulaire, etc.)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-violet-600 mt-1">•</span>
                <span>La <strong>longueur et la position des doigts</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-violet-600 mt-1">•</span>
                <span>Les <strong>monts</strong> (zones bombées sous les doigts)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-violet-600 mt-1">•</span>
                <span>La <strong>texture et souplesse de la peau</strong></span>
              </li>
            </ul>
            <p className="text-navy-600 text-base leading-relaxed mt-6">
              Cela nous permet de comprendre votre <strong>tempérament général</strong> : êtes-vous plutôt cérébral, 
              intuitif, pratique, émotionnel ?
            </p>
          </CardContent>
        </Card>

        {/* Section 2: Lignes principales */}
        <Card className="shadow-lg border-sand-200 bg-card rounded-2xl">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-4">
              <Target className="h-8 w-8 text-violet-600" />
              <CardTitle className="text-2xl font-playfair text-navy-800">
                2. Analyse des lignes principales
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8 space-y-8">
            
            {/* Ligne de cœur */}
            <div className="bg-cream-50/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="h-6 w-6 text-violet-600" />
                <h3 className="text-xl font-playfair font-medium text-navy-800">Ligne de cœur</h3>
              </div>
              <p className="text-navy-600 mb-4">
                Elle renseigne sur votre manière d'aimer et vos émotions :
              </p>
              <ul className="space-y-2 text-navy-600">
                <li>• Longue et incurvée : affectivité intense</li>
                <li>• Droite sous l'index : maîtrise émotionnelle</li>
                <li>• Ramifiée : sensibilité évolutive</li>
                <li>• Brisée : tensions affectives ou ruptures</li>
              </ul>
            </div>

            {/* Ligne de tête */}
            <div className="bg-cream-50/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="h-6 w-6 text-violet-600" />
                <h3 className="text-xl font-playfair font-medium text-navy-800">Ligne de tête</h3>
              </div>
              <p className="text-navy-600 mb-4">
                Elle reflète votre mode de pensée :
              </p>
              <ul className="space-y-2 text-navy-600">
                <li>• Droite : esprit logique, structuré</li>
                <li>• Courbe vers le bas : imagination développée</li>
                <li>• Courte : décisions rapides</li>
                <li>• Double : deux types d'intelligence coexistent</li>
              </ul>
            </div>

            {/* Ligne de vie */}
            <div className="bg-cream-50/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="h-6 w-6 text-violet-600" />
                <h3 className="text-xl font-playfair font-medium text-navy-800">Ligne de vie</h3>
              </div>
              <p className="text-navy-600 mb-4">
                Elle parle de votre énergie vitale et stabilité :
              </p>
              <ul className="space-y-2 text-navy-600">
                <li>• Longue et marquée : vitalité, stabilité</li>
                <li>• Fine ou brisée : périodes de fatigue ou changement</li>
                <li>• Déviée vers le bas : besoin d'évasion ou de renouveau</li>
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
                3. Autres lignes
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <p className="text-navy-600 text-base leading-relaxed mb-6">
              Selon la netteté de votre main, d'autres lignes peuvent apparaître :
            </p>
            <ul className="space-y-3 text-navy-600">
              <li className="flex items-start gap-3">
                <span className="text-violet-600 mt-1">•</span>
                <span>Ligne de destinée : vocation ou trajectoire de vie</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-violet-600 mt-1">•</span>
                <span>Ligne du Soleil : expression personnelle, créativité</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-violet-600 mt-1">•</span>
                <span>Ligne de Mercure : communication ou sens pratique</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Section 4: Synthèse */}
        <Card className="shadow-lg border-sand-200 bg-card rounded-2xl">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-playfair text-navy-800">
              4. Synthèse
            </CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <p className="text-navy-600 text-base leading-relaxed">
              Nous croisons les informations de l'ensemble de la main (dominante et non dominante) pour proposer 
              une lecture structurée de vos forces, tensions internes et axes de développement.
            </p>
          </CardContent>
        </Card>

        {/* Conclusion */}
        <Card className="shadow-lg border-violet-200 bg-lavender-50/50 rounded-2xl">
          <CardContent className="p-8 text-center">
            <p className="text-lg font-medium text-navy-800 mb-2">
              Important à retenir
            </p>
            <p className="text-navy-600 text-base leading-relaxed">
              La lecture ne prédit rien : elle propose un <strong>portrait de votre personnalité</strong> à partir 
              de traits physiques observables.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReadingMethod;