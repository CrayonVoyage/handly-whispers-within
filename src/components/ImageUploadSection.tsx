
import React from 'react';
import ImageUpload from './ImageUpload';

interface ImageUploadSectionProps {
  dominantHandImage: File | null;
  nonDominantHandImage: File | null;
  setDominantHandImage: (file: File | null) => void;
  setNonDominantHandImage: (file: File | null) => void;
}

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  dominantHandImage,
  nonDominantHandImage,
  setDominantHandImage,
  setNonDominantHandImage
}) => {
  return (
    <div className="space-y-6">
      {/* Dominant Hand Image Upload */}
      <ImageUpload
        label="Dominant Hand Photo"
        required={true}
        onImageChange={setDominantHandImage}
        image={dominantHandImage}
      />

      {/* Non-Dominant Hand Image Upload */}
      <ImageUpload
        label="Non-Dominant Hand Photo (Optional)"
        required={false}
        onImageChange={setNonDominantHandImage}
        image={nonDominantHandImage}
      />
    </div>
  );
};

export default ImageUploadSection;
