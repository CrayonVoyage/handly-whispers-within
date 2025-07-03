
import React, { useRef, useState } from 'react';
import { Hand, Upload, X, Loader2 } from 'lucide-react';
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
  const [compressionInfo, setCompressionInfo] = useState<CompressionResult | null>(null);

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
      setCompressionInfo(result);
      
      // Pass compressed file to parent
      onImageChange(result.compressedFile);
      
      // Create preview from compressed file
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(result.compressedFile);
      
    } catch (error) {
      console.error('Error compressing image:', error);
      // Fallback to original file if compression fails
      onImageChange(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleRemoveImage = () => {
    onImageChange(null);
    setPreview(null);
    setCompressionInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!isCompressing) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-indigo-800">
        {label} {required && <span className="text-indigo-600">*</span>}
      </label>
      
      <div 
        onClick={handleClick}
        className={`relative border-2 border-dashed border-gray-300 rounded-lg p-6 transition-colors bg-gray-50/50 ${
          isCompressing ? 'cursor-wait' : 'cursor-pointer hover:border-gray-400'
        }`}
      >
        {isCompressing ? (
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 text-indigo-600 animate-spin" />
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Compression de l'image en cours...
              </p>
            </div>
          </div>
        ) : preview ? (
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
            <Hand className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Cliquez pour télécharger votre photo
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG - Optimisation automatique à moins de 1 Mo
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

      {/* Compression info */}
      {compressionInfo && (
        <div className="text-xs text-gray-500 mt-2 p-2 bg-green-50 rounded">
          <p>
            Image optimisée: {formatFileSize(compressionInfo.originalSize)} → {formatFileSize(compressionInfo.compressedSize)}
            {compressionInfo.compressionRatio > 0 && (
              <span className="text-green-600 font-medium"> (-{compressionInfo.compressionRatio}%)</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
