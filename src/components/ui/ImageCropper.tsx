import { useRef, useState, useEffect } from 'react';
import { X, Loader } from 'lucide-react';

interface ImageCropperProps {
  imageFile: File;
  onCropComplete: (croppedFile: File) => void;
  onCancel: () => void;
}

export default function ImageCropper({ imageFile, onCropComplete, onCancel }: ImageCropperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, size: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [processing, setProcessing] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      setImage(img);
      // Initialize crop area as center square
      const minDimension = Math.min(img.width, img.height);
      setCropArea({
        x: (img.width - minDimension) / 2,
        y: (img.height - minDimension) / 2,
        size: minDimension,
      });
    };

    reader.readAsDataURL(imageFile);
  }, [imageFile]);

  useEffect(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const containerWidth = canvas.parentElement?.clientWidth || 600;
    const containerHeight = 500;
    
    // Calculate scale to fit image in container
    const scaleX = containerWidth / image.width;
    const scaleY = containerHeight / image.height;
    const newScale = Math.min(scaleX, scaleY, 1);
    setScale(newScale);

    canvas.width = image.width * newScale;
    canvas.height = image.height * newScale;

    // Draw image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Draw crop overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clear crop area
    ctx.clearRect(
      cropArea.x * newScale,
      cropArea.y * newScale,
      cropArea.size * newScale,
      cropArea.size * newScale
    );

    // Draw image in crop area
    ctx.drawImage(
      image,
      cropArea.x,
      cropArea.y,
      cropArea.size,
      cropArea.size,
      cropArea.x * newScale,
      cropArea.y * newScale,
      cropArea.size * newScale,
      cropArea.size * newScale
    );

    // Draw crop border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(
      cropArea.x * newScale,
      cropArea.y * newScale,
      cropArea.size * newScale,
      cropArea.size * newScale
    );

    // Draw corner handles
    const handleSize = 12;
    ctx.fillStyle = '#3b82f6';
    const corners = [
      [cropArea.x * newScale, cropArea.y * newScale],
      [(cropArea.x + cropArea.size) * newScale, cropArea.y * newScale],
      [cropArea.x * newScale, (cropArea.y + cropArea.size) * newScale],
      [(cropArea.x + cropArea.size) * newScale, (cropArea.y + cropArea.size) * newScale],
    ];
    corners.forEach(([x, y]) => {
      ctx.fillRect(x - handleSize / 2, y - handleSize / 2, handleSize, handleSize);
    });
  }, [image, cropArea, scale]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    setIsDragging(true);
    setDragStart({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !image) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    const dx = x - dragStart.x;
    const dy = y - dragStart.y;

    let newX = cropArea.x + dx;
    let newY = cropArea.y + dy;

    // Constrain to image boundaries
    newX = Math.max(0, Math.min(newX, image.width - cropArea.size));
    newY = Math.max(0, Math.min(newY, image.height - cropArea.size));

    setCropArea({ ...cropArea, x: newX, y: newY });
    setDragStart({ x, y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (delta: number) => {
    if (!image) return;

    const newSize = Math.max(100, Math.min(cropArea.size + delta, Math.min(image.width, image.height)));
    
    // Adjust position to keep crop centered
    const centerX = cropArea.x + cropArea.size / 2;
    const centerY = cropArea.y + cropArea.size / 2;
    
    let newX = centerX - newSize / 2;
    let newY = centerY - newSize / 2;

    // Constrain to boundaries
    newX = Math.max(0, Math.min(newX, image.width - newSize));
    newY = Math.max(0, Math.min(newY, image.height - newSize));

    setCropArea({ x: newX, y: newY, size: newSize });
  };

  const handleCrop = async () => {
    if (!image) return;

    setProcessing(true);
    try {
      // Create a canvas for the cropped image
      const canvas = document.createElement('canvas');
      const targetSize = 800;
      canvas.width = targetSize;
      canvas.height = targetSize;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Failed to get canvas context');

      // Draw the cropped area
      ctx.drawImage(
        image,
        cropArea.x,
        cropArea.y,
        cropArea.size,
        cropArea.size,
        0,
        0,
        targetSize,
        targetSize
      );

      // Convert to WebP blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setProcessing(false);
            return;
          }

          const croppedFile = new File(
            [blob],
            imageFile.name.replace(/\.[^/.]+$/, '.webp'),
            { type: 'image/webp' }
          );

          onCropComplete(croppedFile);
          setProcessing(false);
        },
        'image/webp',
        0.85
      );
    } catch (error) {
      console.error('Error cropping image:', error);
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-card)] rounded-xl shadow-2xl max-w-3xl w-full">
        {/* Header */}
        <div className="border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--color-foreground)]">Crop Profile Photo</h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-[var(--color-background-secondary)] rounded-lg transition-colors"
          >
            <X size={24} className="text-[var(--color-foreground-secondary)]" />
          </button>
        </div>

        {/* Canvas */}
        <div className="p-6">
          <div className="mb-4 text-center text-sm text-[var(--color-foreground-secondary)]">
            Drag to reposition • Use zoom buttons to adjust size
          </div>
          <div className="flex justify-center mb-4">
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="border border-[var(--color-border)] rounded-lg cursor-move max-w-full"
              style={{ maxHeight: '500px' }}
            />
          </div>

          {/* Zoom Controls */}
          <div className="flex justify-center gap-2 mb-6">
            <button
              onClick={() => handleZoom(-50)}
              className="px-4 py-2 bg-[var(--color-background-secondary)] text-[var(--color-foreground)] rounded-lg hover:bg-[var(--color-border)] transition-colors"
            >
              Zoom Out
            </button>
            <button
              onClick={() => handleZoom(50)}
              className="px-4 py-2 bg-[var(--color-background-secondary)] text-[var(--color-foreground)] rounded-lg hover:bg-[var(--color-border)] transition-colors"
            >
              Zoom In
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <button
              onClick={onCancel}
              disabled={processing}
              className="px-6 py-2 border border-[var(--color-border)] text-[var(--color-foreground)] rounded-lg hover:bg-[var(--color-background-secondary)] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCrop}
              disabled={processing}
              className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {processing ? (
                <>
                  <Loader className="animate-spin" size={18} />
                  Processing...
                </>
              ) : (
                'Crop & Upload'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
