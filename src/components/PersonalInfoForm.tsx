
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
          Your name *
        </label>
        <Input 
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="bg-white border-sand-300 focus:border-violet-400 focus:ring-violet-400 rounded-xl py-3 px-4 text-base"
          placeholder="Enter your name"
          required
        />
      </div>

      {/* Age */}
      <div>
        <label className="block text-base font-medium text-navy-700 mb-3">
          Your age *
        </label>
        <Input 
          type="number"
          value={formData.age}
          onChange={(e) => handleInputChange('age', e.target.value)}
          className="bg-white border-sand-300 focus:border-violet-400 focus:ring-violet-400 rounded-xl py-3 px-4 text-base"
          placeholder="Enter your age"
          min="1"
          max="150"
          required
        />
      </div>

      {/* Gender */}
      <div>
        <label className="block text-base font-medium text-navy-700 mb-3">
          Gender *
        </label>
        <select 
          value={formData.gender}
          onChange={(e) => handleInputChange('gender', e.target.value)}
          className="w-full py-3 px-4 bg-white border border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 text-navy-700 text-base"
          required
        >
          <option value="">Select your gender</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Non-binary">Non-binary</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>
      </div>

      {/* Dominant Hand */}
      <div>
        <label className="block text-base font-medium text-navy-700 mb-3">
          Dominant hand *
        </label>
        <select 
          value={formData.dominant_hand}
          onChange={(e) => handleInputChange('dominant_hand', e.target.value)}
          className="w-full py-3 px-4 bg-white border border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 text-navy-700 text-base"
          required
        >
          <option value="">Select your dominant hand</option>
          <option value="Left">Left</option>
          <option value="Right">Right</option>
        </select>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-4 text-base font-medium shadow-sm hover:shadow-md transition-all"
      >
        Continue
      </Button>
    </form>
  );
};

export default PersonalInfoForm;
