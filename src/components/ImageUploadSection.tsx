
import React from 'react';
import ImageUpload from './ImageUpload';

interface ImageUploadSectionProps {
  dominantHandImage: File | null;
  nonDominantHandImage: File | null;
  onDominantHandChange: (file: File | null) => void;
  onNonDominantHandChange: (file: File | null) => void;
}

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  dominantHandImage,
  nonDominantHandImage,
  onDominantHandChange,
  onNonDominantHandChange
}) => {
  return (
    <div className="space-y-6">
      {/* Image Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <h4 className="font-medium text-blue-900 mb-3 flex items-center">
          <span className="mr-2">📸</span>
          Tips for best results:
        </h4>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Take the photo from above, with your palm flat and fully visible</li>
          <li>• Make sure the lighting is even (no strong shadows)</li>
          <li>• Use a plain background if possible (table, white paper, etc.)</li>
          <li>• Show the full hand, including the wrist and fingers</li>
        </ul>
      </div>

      {/* Dominant Hand Image Upload */}
      <ImageUpload
        label="Dominant hand photo"
        required={true}
        onImageChange={onDominantHandChange}
        image={dominantHandImage}
      />

      {/* Non-Dominant Hand Image Upload */}
      <ImageUpload
        label="Non-dominant hand photo (Optional)"
        required={false}
        onImageChange={onNonDominantHandChange}
        image={nonDominantHandImage}
      />
    </div>
  );
};

export default ImageUploadSection;
