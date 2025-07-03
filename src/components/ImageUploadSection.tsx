
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
      {/* Dominant Hand Image Upload */}
      <ImageUpload
        label="Photo de la main dominante"
        required={true}
        onImageChange={onDominantHandChange}
        image={dominantHandImage}
      />

      {/* Non-Dominant Hand Image Upload */}
      <ImageUpload
        label="Photo de la main non-dominante (Optionnel)"
        required={false}
        onImageChange={onNonDominantHandChange}
        image={nonDominantHandImage}
      />
    </div>
  );
};

export default ImageUploadSection;
