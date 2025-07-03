
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { PersonalInfo } from '@/types/handly';

interface PersonalInfoFormProps {
  onSubmit: (info: PersonalInfo) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<PersonalInfo>({
    name: '',
    age: '',
    gender: '',
    dominant_hand: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.age && formData.gender && formData.dominant_hand) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Name */}
      <div>
        <label className="block text-base font-medium text-navy-700 mb-3">
          Votre nom *
        </label>
        <Input 
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="bg-white border-sand-300 focus:border-violet-400 focus:ring-violet-400 rounded-xl py-3 px-4 text-base"
          placeholder="Entrez votre nom"
          required
        />
      </div>

      {/* Age */}
      <div>
        <label className="block text-base font-medium text-navy-700 mb-3">
          Votre âge *
        </label>
        <Input 
          type="number"
          value={formData.age}
          onChange={(e) => handleInputChange('age', e.target.value)}
          className="bg-white border-sand-300 focus:border-violet-400 focus:ring-violet-400 rounded-xl py-3 px-4 text-base"
          placeholder="Entrez votre âge"
          min="1"
          max="150"
          required
        />
      </div>

      {/* Gender */}
      <div>
        <label className="block text-base font-medium text-navy-700 mb-3">
          Genre *
        </label>
        <select 
          value={formData.gender}
          onChange={(e) => handleInputChange('gender', e.target.value)}
          className="w-full py-3 px-4 bg-white border border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 text-navy-700 text-base"
          required
        >
          <option value="">Sélectionnez votre genre</option>
          <option value="Female">Femme</option>
          <option value="Male">Homme</option>
          <option value="Non-binary">Non-binaire</option>
          <option value="Prefer not to say">Préfère ne pas dire</option>
        </select>
      </div>

      {/* Dominant Hand */}
      <div>
        <label className="block text-base font-medium text-navy-700 mb-3">
          Main dominante *
        </label>
        <select 
          value={formData.dominant_hand}
          onChange={(e) => handleInputChange('dominant_hand', e.target.value)}
          className="w-full py-3 px-4 bg-white border border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 text-navy-700 text-base"
          required
        >
          <option value="">Sélectionnez votre main dominante</option>
          <option value="Left">Gauche</option>
          <option value="Right">Droite</option>
        </select>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-4 text-base font-medium shadow-sm hover:shadow-md transition-all"
      >
        Continuer
      </Button>
    </form>
  );
};

export default PersonalInfoForm;
