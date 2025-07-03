
import React from 'react';
import { Input } from '@/components/ui/input';

interface PersonalInfoFormProps {
  formData: {
    name: string;
    age: string;
    gender: string;
    dominant_hand: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ formData, onInputChange }) => {
  return (
    <div className="space-y-6">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-sand-800 mb-2">
          Your Name *
        </label>
        <Input 
          value={formData.name}
          onChange={(e) => onInputChange('name', e.target.value)}
          className="bg-white/70 border-sand-300 focus:border-sand-500 focus:ring-sand-500"
          placeholder="Enter your name"
          required
        />
      </div>

      {/* Age */}
      <div>
        <label className="block text-sm font-medium text-sand-800 mb-2">
          Your Age *
        </label>
        <Input 
          type="number"
          value={formData.age}
          onChange={(e) => onInputChange('age', e.target.value)}
          className="bg-white/70 border-sand-300 focus:border-sand-500 focus:ring-sand-500"
          placeholder="Enter your age"
          min="1"
          max="150"
          required
        />
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium text-sand-800 mb-2">
          Gender *
        </label>
        <select 
          value={formData.gender}
          onChange={(e) => onInputChange('gender', e.target.value)}
          className="w-full h-10 px-3 py-2 bg-white/70 border border-sand-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sand-500 focus:border-sand-500 text-sand-900"
          required
        >
          <option value="">Select gender</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Non-binary">Non-binary</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>
      </div>

      {/* Dominant Hand */}
      <div>
        <label className="block text-sm font-medium text-sand-800 mb-2">
          Dominant Hand *
        </label>
        <select 
          value={formData.dominant_hand}
          onChange={(e) => onInputChange('dominant_hand', e.target.value)}
          className="w-full h-10 px-3 py-2 bg-white/70 border border-sand-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sand-500 focus:border-sand-500 text-sand-900"
          required
        >
          <option value="">Select dominant hand</option>
          <option value="Left">Left</option>
          <option value="Right">Right</option>
        </select>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
