import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import mysticalHand from '@/assets/mystical-hand.png';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl text-center space-y-8">
        {/* Titre principal */}
        <h1 className="text-5xl md:text-6xl font-playfair font-medium text-foreground leading-tight">
          Tu portes ton histoire dans ta main.
        </h1>
        
        {/* Sous-titre */}
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Uploade deux photos de tes mains. Laisse l'application lire ce qu'elles révèlent sur toi.
        </p>
        
        {/* Visuel mystique */}
        <div className="flex justify-center py-8">
          <img 
            src={mysticalHand} 
            alt="Main mystique" 
            className="max-w-md w-full h-auto opacity-90"
          />
        </div>
        
        {/* Bouton centré */}
        <Button 
          onClick={() => navigate('/palm-reading')}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-6 px-8 text-xl font-medium shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        >
          Commencer la lecture ✋
        </Button>
      </div>
    </div>
  );
};

export default Landing;