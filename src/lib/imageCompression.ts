/**
 * Image compression utility for converting and compressing images to WebP format
 */

export interface CompressionOptions {
  quality?: number; // 0 to 1, default 0.8
  maxWidth?: number; // Max width in pixels, default 1280
  maxHeight?: number; // Max height in pixels, default 720
}

/**
 * Converts a base64 image (JPEG/PNG) to compressed WebP format
 * @param base64Image - Base64 encoded image string (data:image/...)
 * @param options - Compression options
 * @returns Promise<string> - Base64 encoded WebP image
 */
export async function convertToWebP(
  base64Image: string,
  options: CompressionOptions = {}
): Promise<string> {
  const {
    quality = 0.8,
    maxWidth = 1280,
    maxHeight = 720
  } = options;

  return new Promise((resolve, reject) => {
    // Create an image element
    const img = new Image();
    
    img.onload = () => {
      try {
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;
          
          if (width > height) {
            width = maxWidth;
            height = Math.round(width / aspectRatio);
          } else {
            height = maxHeight;
            width = Math.round(height * aspectRatio);
          }
        }

        // Create canvas and draw resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Draw the image on canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP using toBlob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create WebP blob'));
              return;
            }

            // Convert blob to base64
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result as string);
            };
            reader.onerror = () => {
              reject(new Error('Failed to read blob'));
            };
            reader.readAsDataURL(blob);
          },
          'image/webp',
          quality
        );
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    // Load the base64 image
    img.src = base64Image;
  });
}

/**
 * Get the size of a base64 image in KB
 * @param base64String - Base64 encoded image string
 * @returns Size in KB
 */
export function getBase64Size(base64String: string): number {
  const base64Length = base64String.length - (base64String.indexOf(',') + 1);
  const padding = (base64String.charAt(base64String.length - 2) === '=') ? 2 : ((base64String.charAt(base64String.length - 1) === '=') ? 1 : 0);
  const sizeInBytes = (base64Length * 0.75) - padding;
  return Math.round(sizeInBytes / 1024);
}

/**
 * Crop image to square and convert to WebP format
 * @param file - Image file to crop
 * @param size - Target square size in pixels (default 800)
 * @param quality - WebP quality 0-1 (default 0.85)
 * @returns Promise<File> - Cropped and compressed WebP file
 */
export async function cropToSquareWebP(
  file: File,
  size: number = 800,
  quality: number = 0.85
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    img.onload = () => {
      try {
        // Determine the crop dimensions (center square crop)
        const minDimension = Math.min(img.width, img.height);
        const sx = (img.width - minDimension) / 2;
        const sy = (img.height - minDimension) / 2;

        // Create canvas with square dimensions
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Draw the center square crop, resized to target size
        ctx.drawImage(
          img,
          sx, sy, minDimension, minDimension, // source rectangle
          0, 0, size, size // destination rectangle
        );

        // Convert to WebP blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create WebP blob'));
              return;
            }

            // Create a File object from the blob
            const webpFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, '.webp'),
              { type: 'image/webp' }
            );

            resolve(webpFile);
          },
          'image/webp',
          quality
        );
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Crop image to custom square dimensions with preview
 * @param file - Image file to crop
 * @param cropArea - Crop coordinates { x, y, size }
 * @param targetSize - Target square size in pixels (default 800)
 * @param quality - WebP quality 0-1 (default 0.85)
 * @returns Promise<File> - Cropped and compressed WebP file
 */
export async function cropImageWithCoords(
  file: File,
  cropArea: { x: number; y: number; size: number },
  targetSize: number = 800,
  quality: number = 0.85
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    img.onload = () => {
      try {
        // Create canvas with square dimensions
        const canvas = document.createElement('canvas');
        canvas.width = targetSize;
        canvas.height = targetSize;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Draw the custom crop area, resized to target size
        ctx.drawImage(
          img,
          cropArea.x, cropArea.y, cropArea.size, cropArea.size, // source rectangle
          0, 0, targetSize, targetSize // destination rectangle
        );

        // Convert to WebP blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create WebP blob'));
              return;
            }

            // Create a File object from the blob
            const webpFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, '.webp'),
              { type: 'image/webp' }
            );

            resolve(webpFile);
          },
          'image/webp',
          quality
        );
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    reader.readAsDataURL(file);
  });
}
