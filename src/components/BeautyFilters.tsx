import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';

interface BeautyFiltersProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  faces: any[];
}

const BeautyFilters: React.FC<BeautyFiltersProps> = ({ videoRef, canvasRef, faces }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const panelRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  const beautyFilters = [
    { id: 'smooth', name: 'Smooth Skin', icon: '✨', intensity: 0.7 },
    { id: 'brighten', name: 'Brighten Face', icon: '☀️', intensity: 0.3 },
    { id: 'eyes', name: 'Big Eyes', icon: '👁️', intensity: 0.2 },
    { id: 'slim', name: 'Slim Face', icon: '🔸', intensity: 0.15 },
    { id: 'lips', name: 'Pink Lips', icon: '💋', intensity: 0.4 },
    { id: 'blush', name: 'Rosy Cheeks', icon: '🌸', intensity: 0.3 },
    { id: 'whiten', name: 'Whiten Teeth', icon: '🦷', intensity: 0.5 },
    { id: 'glow', name: 'Face Glow', icon: '✨', intensity: 0.4 }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const applyBeautyFilters = () => {
      if (!videoRef.current || !canvasRef.current || faces.length === 0) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const video = videoRef.current;

      if (!ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw original video frame
      ctx.drawImage(video, 0, 0);

      // Apply beauty filters to detected faces
      faces.forEach(face => {
        applyFaceBeautyEffects(ctx, face);
      });

      animationRef.current = requestAnimationFrame(applyBeautyFilters);
    };

    if (activeFilters.size > 0) {
      applyBeautyFilters();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [activeFilters, faces]);

  const applyFaceBeautyEffects = (ctx: CanvasRenderingContext2D, face: any) => {
    const { x, y, width, height, landmarks } = face;

    activeFilters.forEach(filterId => {
      const filter = beautyFilters.find(f => f.id === filterId);
      if (!filter) return;

      switch (filterId) {
        case 'smooth':
          applySkinSmoothing(ctx, x, y, width, height, filter.intensity);
          break;
        case 'brighten':
          applyFaceBrightening(ctx, x, y, width, height, filter.intensity);
          break;
        case 'eyes':
          applyEyeEnlargement(ctx, landmarks, filter.intensity);
          break;
        case 'lips':
          applyLipEnhancement(ctx, landmarks, filter.intensity);
          break;
        case 'blush':
          applyBlush(ctx, landmarks, filter.intensity);
          break;
        case 'glow':
          applyFaceGlow(ctx, x, y, width, height, filter.intensity);
          break;
      }
    });
  };

  const applySkinSmoothing = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, intensity: number) => {
    ctx.save();
    ctx.filter = `blur(${intensity * 2}px)`;
    ctx.globalCompositeOperation = 'soft-light';
    ctx.globalAlpha = intensity;
    ctx.drawImage(ctx.canvas, x, y, w, h, x, y, w, h);
    ctx.restore();
  };

  const applyFaceBrightening = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, intensity: number) => {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = intensity;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, w, h);
    ctx.restore();
  };

  const applyEyeEnlargement = (ctx: CanvasRenderingContext2D, landmarks: any, intensity: number) => {
    if (!landmarks.leftEye || !landmarks.rightEye) return;
    
    // Simulate eye enlargement with radial gradients
    const eyeRadius = 20;
    ['leftEye', 'rightEye'].forEach(eye => {
      const eyePos = landmarks[eye];
      const gradient = ctx.createRadialGradient(
        eyePos.x, eyePos.y, 0,
        eyePos.x, eyePos.y, eyeRadius
      );
      gradient.addColorStop(0, `rgba(255,255,255,${intensity})`);
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(eyePos.x, eyePos.y, eyeRadius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();
    });
  };

  const applyLipEnhancement = (ctx: CanvasRenderingContext2D, landmarks: any, intensity: number) => {
    if (!landmarks.mouth) return;
    
    const mouth = landmarks.mouth;
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha = intensity;
    ctx.fillStyle = '#ff69b4';
    ctx.beginPath();
    ctx.ellipse(mouth.x, mouth.y, 15, 8, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
  };

  const applyBlush = (ctx: CanvasRenderingContext2D, landmarks: any, intensity: number) => {
    if (!landmarks.leftEye || !landmarks.rightEye) return;
    
    // Apply blush to cheek areas
    const blushPositions = [
      { x: landmarks.leftEye.x - 30, y: landmarks.leftEye.y + 20 },
      { x: landmarks.rightEye.x + 30, y: landmarks.rightEye.y + 20 }
    ];
    
    blushPositions.forEach(pos => {
      const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 25);
      gradient.addColorStop(0, `rgba(255,182,193,${intensity})`);
      gradient.addColorStop(1, 'rgba(255,182,193,0)');
      
      ctx.save();
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 25, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();
    });
  };

  const applyFaceGlow = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, intensity: number) => {
    ctx.save();
    ctx.filter = `blur(3px)`;
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = intensity * 0.5;
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(x, y, w, h);
    ctx.restore();
  };

  const toggleFilter = (filterId: string) => {
    const newFilters = new Set(activeFilters);
    if (newFilters.has(filterId)) {
      newFilters.delete(filterId);
    } else {
      newFilters.add(filterId);
    }
    setActiveFilters(newFilters);
  };

  return (
    <div ref={panelRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-black/30 backdrop-blur-md rounded-full p-3 border transition-all ${
          activeFilters.size > 0
            ? 'border-pink-500 bg-pink-500/20 shadow-pink-500/50 shadow-lg' 
            : 'border-purple-500/20 hover:border-purple-400'
        }`}
      >
        <Sparkles className="text-white" size={20} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 left-0 bg-black/95 backdrop-blur-md rounded-lg p-4 border border-purple-500/20 w-80 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Beauty Filters</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {beautyFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => toggleFilter(filter.id)}
                className={`p-3 rounded-lg border text-center transition-all hover:scale-105 ${
                  activeFilters.has(filter.id)
                    ? 'border-pink-500 bg-pink-500/20 shadow-pink-500/50 shadow-md'
                    : 'border-purple-500/30 bg-black/50 hover:border-purple-400 hover:bg-purple-500/10'
                }`}
              >
                <div className="text-2xl mb-1">{filter.icon}</div>
                <div className="text-white text-xs">{filter.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BeautyFilters;