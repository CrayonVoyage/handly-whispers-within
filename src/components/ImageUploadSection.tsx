
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
      {/* Enhanced Image Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
        <h4 className="font-semibold text-blue-900 mb-4 flex items-center text-lg">
          🖐️ Hand photo tips:
        </h4>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Instructions */}
          <div>
            <ul className="text-blue-800 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-medium">•</span>
                <span>Place your hand flat on a table or neutral background</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-medium">•</span>
                <span>Make sure the palm is fully visible — from wrist to fingertips</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-medium">•</span>
                <span>Keep the camera directly above your hand, not tilted</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-medium">•</span>
                <span>Position your fingers pointing upwards, centered in the frame</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-medium">•</span>
                <span>Avoid shadows or bright spots</span>
              </li>
            </ul>
          </div>
          
          {/* Example Hand Image */}
          <div className="text-center">
            <p className="text-blue-700 font-medium mb-3">Good example:</p>
            <div className="bg-white p-3 rounded-lg border-2 border-blue-200 inline-block">
              <img 
                src="/lovable-uploads/177d0ff6-b220-499b-8e6d-215a90345018.png" 
                alt="Hand diagram showing proper positioning" 
                className="w-32 h-40 object-contain"
              />
            </div>
            <p className="text-xs text-blue-600 mt-2">Top-down, fingers up, clean lighting</p>
          </div>
        </div>
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
