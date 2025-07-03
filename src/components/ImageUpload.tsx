
import React, { useRef, useState } from 'react';
import { Hand, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  label: string;
  required?: boolean;
  onImageChange: (file: File | null) => void;
  image: File | null;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  label, 
  required = false, 
  onImageChange, 
  image 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageChange(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    onImageChange(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-indigo-800 font-inter">
        {label} {required && <span className="text-indigo-600">*</span>}
      </label>
      
      <div 
        onClick={handleClick}
        className="relative border-2 border-dashed border-sand-300 rounded-lg p-6 cursor-pointer hover:border-sand-400 transition-colors bg-sand-50/50"
      >
        {preview ? (
          <div className="relative">
            <img 
              src={preview} 
              alt="Hand preview" 
              className="w-full h-48 object-cover rounded-md"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveImage();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <Hand className="mx-auto h-12 w-12 text-sand-400" />
            <div className="mt-4">
              <p className="text-sm text-sand-600 font-inter">
                Click to upload your hand photo
              </p>
              <p className="text-xs text-sand-500 mt-1">
                PNG, JPG up to 10MB
              </p>
            </div>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          required={required}
        />
      </div>
    </div>
  );
};

export default ImageUpload;
