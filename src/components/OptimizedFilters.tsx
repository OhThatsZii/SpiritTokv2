import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, X } from 'lucide-react';

interface OptimizedFiltersProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  faces: any[];
  onFilterChange?: (filterId: string | null) => void;
}

const OptimizedFilters: React.FC<OptimizedFiltersProps> = ({ 
  videoRef, 
  canvasRef, 
  faces, 
  onFilterChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const lastFrameTime = useRef<number>(0);

  const faceFilters = [
    { id: 'none', name: 'None', preview: '🚫' },
    { id: 'smooth', name: 'Smooth', preview: '✨' },
    { id: 'glow', name: 'Glow', preview: '🌟' },
    { id: 'rosy', name: 'Rosy', preview: '🌹' },
    { id: 'bright', name: 'Bright', preview: '☀️' },
    { id: 'cute', name: 'Cute', preview: '🥰' },
  ];

  // Throttled filter application
  const applyFilter = useCallback((ctx: CanvasRenderingContext2D, face: any, filterId: string) => {
    const { x, y, width, height } = face;
    
    ctx.save();
    switch (filterId) {
      case 'smooth':
        ctx.filter = 'blur(1px) brightness(1.1)';
        break;
      case 'glow':
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 10;
        break;
      case 'rosy':
        ctx.globalCompositeOperation = 'overlay';
        ctx.fillStyle = 'rgba(255, 192, 203, 0.2)';
        ctx.fillRect(x, y, width, height);
        break;
      case 'bright':
        ctx.filter = 'brightness(1.2) contrast(1.1)';
        break;
      case 'cute':
        ctx.filter = 'saturate(1.3) brightness(1.1)';
        break;
    }
    ctx.restore();
  }, []);

  const renderFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !activeFilter || activeFilter === 'none') {
      return;
    }

    const now = performance.now();
    if (now - lastFrameTime.current < 33) { // ~30fps limit
      animationRef.current = requestAnimationFrame(renderFrame);
      return;
    }
    lastFrameTime.current = now;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;

    if (!ctx || video.videoWidth === 0 || video.videoHeight === 0) {
      animationRef.current = requestAnimationFrame(renderFrame);
      return;
    }

    try {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0);

      if (faces.length > 0) {
        faces.forEach(face => applyFilter(ctx, face, activeFilter));
      }
    } catch (error) {
      console.warn('Filter error:', error);
    }

    if (activeFilter && activeFilter !== 'none') {
      animationRef.current = requestAnimationFrame(renderFrame);
    }
  }, [activeFilter, faces, applyFilter, videoRef, canvasRef]);

  useEffect(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    if (activeFilter && activeFilter !== 'none') {
      renderFrame();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [activeFilter, renderFrame]);

  const selectFilter = (filterId: string) => {
    setActiveFilter(filterId);
    onFilterChange?.(filterId);
    setIsOpen(false);
  };

  return (
    <div ref={panelRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-black/30 backdrop-blur-md rounded-full p-3 border transition-all ${
          activeFilter && activeFilter !== 'none' 
            ? 'border-pink-500 bg-pink-500/20' 
            : 'border-purple-500/20'
        }`}
      >
        <Sparkles className="text-white" size={20} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 left-0 bg-black/95 backdrop-blur-md rounded-lg p-4 border border-purple-500/20 w-80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Filters</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400">
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {faceFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => selectFilter(filter.id)}
                className={`p-3 rounded-lg border text-center transition-all ${
                  activeFilter === filter.id
                    ? 'border-pink-500 bg-pink-500/20'
                    : 'border-purple-500/30 bg-black/50'
                }`}
              >
                <div className="text-2xl mb-1">{filter.preview}</div>
                <div className="text-white text-xs">{filter.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedFilters;