
import React, { useRef, useState } from 'react';
import { Hand, Upload, X, Loader2, RotateCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { compressImage, formatFileSize, type CompressionResult } from '@/utils/imageCompression';

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
  const [isCompressing, setIsCompressing] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showOrientationTip, setShowOrientationTip] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      console.error('Selected file is not an image');
      return;
    }

    setIsCompressing(true);
    
    try {
      // Compress the image
      const result = await compressImage(file);
      
      // Pass compressed file to parent
      onImageChange(result.compressedFile);
      
      // Create preview from compressed file
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
        // Check image orientation for tips
        checkImageOrientation(result.compressedFile);
      };
      reader.readAsDataURL(result.compressedFile);
      
    } catch (error) {
      console.error('Error compressing image:', error);
      // Fallback to original file if compression fails
      onImageChange(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
        // Check image orientation for tips
        checkImageOrientation(file);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleRemoveImage = () => {
    onImageChange(null);
    setPreview(null);
    setRotation(0);
    setShowOrientationTip(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const checkImageOrientation = (file: File) => {
    const img = new Image();
    img.onload = () => {
      // Show tip if image appears to be landscape (wider than tall)
      const isLandscape = img.width > img.height * 1.2;
      setShowOrientationTip(isLandscape);
    };
    img.src = URL.createObjectURL(file);
  };

  const handleRotate = () => {
    const newRotation = (rotation + 90) % 360;
    setRotation(newRotation);
    setShowOrientationTip(false); // Hide tip after rotation
  };

  const handleClick = () => {
    if (!isCompressing) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-base font-medium text-navy-700">
        {label} {required && <span className="text-violet-600">*</span>}
      </label>
      
      <div 
        onClick={handleClick}
        className={`relative border-2 border-dashed border-sand-300 rounded-2xl p-8 transition-all bg-white/50 ${
          isCompressing ? 'cursor-wait' : 'cursor-pointer hover:border-violet-300 hover:bg-violet-50/30'
        }`}
      >
        {isCompressing ? (
          <div className="text-center">
            <Loader2 className="mx-auto h-16 w-16 text-violet-600 animate-spin" />
            <div className="mt-6">
              <p className="text-base text-navy-600">
                Compressing image...
              </p>
            </div>
          </div>
        ) : preview ? (
          <div className="relative">
            <img 
              src={preview} 
              alt="Hand preview" 
              className="w-full h-56 object-cover rounded-xl"
              style={{ transform: `rotate(${rotation}deg)` }}
            />
            <div className="absolute top-3 right-3 flex gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="rounded-full h-8 w-8 p-0 bg-white/90 hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRotate();
                }}
                title="Rotate image 90°"
              >
                <RotateCw className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="rounded-full h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {showOrientationTip && (
              <div className="absolute bottom-3 left-3 right-3 bg-amber-50 border border-amber-200 rounded-lg p-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-800">
                    It looks like your hand is sideways. You can rotate the image for better analysis.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Hand className="mx-auto h-16 w-16 text-sand-400" />
            <div className="mt-6">
              <p className="text-base text-navy-600 font-medium">
                Click to upload your photo
              </p>
              <p className="text-sm text-navy-500 mt-2">
                PNG, JPG - Automatic optimization under 1 MB
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
          disabled={isCompressing}
        />
      </div>
    </div>
  );
};

export default ImageUpload;
