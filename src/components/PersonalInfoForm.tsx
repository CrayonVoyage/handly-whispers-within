
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-2">
          Votre nom *
        </label>
        <Input 
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="bg-white/70 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Entrez votre nom"
          required
        />
      </div>

      {/* Age */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-2">
          Votre âge *
        </label>
        <Input 
          type="number"
          value={formData.age}
          onChange={(e) => handleInputChange('age', e.target.value)}
          className="bg-white/70 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Entrez votre âge"
          min="1"
          max="150"
          required
        />
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-2">
          Genre *
        </label>
        <select 
          value={formData.gender}
          onChange={(e) => handleInputChange('gender', e.target.value)}
          className="w-full h-10 px-3 py-2 bg-white/70 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
          required
        >
          <option value="">Sélectionnez le genre</option>
          <option value="Female">Femme</option>
          <option value="Male">Homme</option>
          <option value="Non-binary">Non-binaire</option>
          <option value="Prefer not to say">Préfère ne pas dire</option>
        </select>
      </div>

      {/* Dominant Hand */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-2">
          Main dominante *
        </label>
        <select 
          value={formData.dominant_hand}
          onChange={(e) => handleInputChange('dominant_hand', e.target.value)}
          className="w-full h-10 px-3 py-2 bg-white/70 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
          required
        >
          <option value="">Sélectionnez la main dominante</option>
          <option value="Left">Gauche</option>
          <option value="Right">Droite</option>
        </select>
      </div>

      <Button type="submit" className="w-full">
        Continuer
      </Button>
    </form>
  );
};

export default PersonalInfoForm;
