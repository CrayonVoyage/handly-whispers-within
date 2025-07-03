
export interface CompressionResult {
  compressedFile: File;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

export const compressImage = async (file: File, targetSizeKB: number = 1024): Promise<CompressionResult> => {
  const originalSize = file.size;
  
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions (max 1920px on longest side)
      const maxDimension = 1920;
      let { width, height } = img;
      
      if (width > height && width > maxDimension) {
        height = (height * maxDimension) / width;
        width = maxDimension;
      } else if (height > maxDimension) {
        width = (width * maxDimension) / height;
        height = maxDimension;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Draw and compress progressively
      ctx.drawImage(img, 0, 0, width, height);
      
      const compressProgressively = (quality: number) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }
            
            const compressedSize = blob.size;
            const targetSize = targetSizeKB * 1024;
            
            // If still too large and quality can be reduced further
            if (compressedSize > targetSize && quality > 0.1) {
              compressProgressively(quality - 0.1);
              return;
            }
            
            // If still too large, reduce dimensions
            if (compressedSize > targetSize && (width > 800 || height > 800)) {
              const newWidth = Math.floor(width * 0.8);
              const newHeight = Math.floor(height * 0.8);
              
              canvas.width = newWidth;
              canvas.height = newHeight;
              ctx.drawImage(img, 0, 0, newWidth, newHeight);
              
              compressProgressively(0.8);
              return;
            }
            
            // Create compressed file
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            
            resolve({
              compressedFile,
              originalSize,
              compressedSize: blob.size,
              compressionRatio: Math.round((1 - blob.size / originalSize) * 100)
            });
          },
          'image/jpeg',
          quality
        );
      };
      
      compressProgressively(0.8);
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
