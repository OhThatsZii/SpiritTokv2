import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';
import * as FilterHelpers from './TikTokFiltersHelpers';

interface TikTokFiltersProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  faces: any[];
  onFilterChange?: (filterId: string | null) => void;
}

const TikTokFilters: React.FC<TikTokFiltersProps> = ({ videoRef, canvasRef, faces, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  const faceFilters = [
    { id: 'none', name: 'None', preview: '🚫', type: 'none' },
    { id: 'smooth', name: 'Smooth', preview: '✨', type: 'beauty' },
    { id: 'glow', name: 'Glow', preview: '🌟', type: 'beauty' },
    { id: 'rosy', name: 'Rosy', preview: '🌹', type: 'beauty' },
    { id: 'bright', name: 'Bright', preview: '☀️', type: 'beauty' },
    { id: 'cute', name: 'Cute', preview: '🥰', type: 'beauty' },
    { id: 'doll', name: 'Doll', preview: '🎎', type: 'beauty' },
    { id: 'vintage', name: 'Vintage', preview: '📸', type: 'artistic' },
    { id: 'neon', name: 'Neon', preview: '🌈', type: 'artistic' },
    { id: 'cyberpunk', name: 'Cyber', preview: '🤖', type: 'artistic' },
    { id: 'dreamy', name: 'Dreamy', preview: '💫', type: 'artistic' },
    { id: 'galaxy', name: 'Galaxy', preview: '🌌', type: 'artistic' }
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
    let frameCount = 0;
    const applyFaceFilters = () => {
      // Limit to 30fps to prevent freezing
      frameCount++;
      if (frameCount % 2 !== 0) {
        if (activeFilter && activeFilter !== 'none') {
          animationRef.current = requestAnimationFrame(applyFaceFilters);
        }
        return;
      }

      if (!videoRef.current || !canvasRef.current || !activeFilter || activeFilter === 'none') {
        return;
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const video = videoRef.current;

      if (!ctx || video.videoWidth === 0 || video.videoHeight === 0 || video.paused || video.ended) {
        if (activeFilter && activeFilter !== 'none') {
          animationRef.current = requestAnimationFrame(applyFaceFilters);
        }
        return;
      }

      // Set canvas dimensions to match video
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      try {
        // Clear canvas and draw original video frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0);

        // Apply face-specific filters only if faces are detected
        if (faces.length > 0) {
          faces.forEach(face => {
            applyFaceFilter(ctx, face, activeFilter);
          });
        } else {
          // Apply full-screen filter if no faces detected
          applyFullScreenFilter(ctx, canvas.width, canvas.height, activeFilter);
        }
      } catch (error) {
        console.warn('Filter application error:', error);
      }

      // Continue animation loop only if filter is active
      if (activeFilter && activeFilter !== 'none') {
        animationRef.current = requestAnimationFrame(applyFaceFilters);
      }
    };

    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Start animation loop only if filter is active and not 'none'
    if (activeFilter && activeFilter !== 'none' && videoRef.current && canvasRef.current) {
      // Small delay to ensure video is ready
      setTimeout(() => {
        applyFaceFilters();
      }, 100);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [activeFilter, faces, videoRef, canvasRef]);

  const applyFaceFilter = (ctx: CanvasRenderingContext2D, face: any, filterId: string) => {
    const { x, y, width, height } = face;

    switch (filterId) {
      case 'smooth': FilterHelpers.applySmoothFilter(ctx, x, y, width, height); break;
      case 'glow': FilterHelpers.applyGlowFilter(ctx, x, y, width, height); break;
      case 'rosy': FilterHelpers.applyRosyFilter(ctx, x, y, width, height); break;
      case 'bright': FilterHelpers.applyBrightFilter(ctx, x, y, width, height); break;
      case 'cute': FilterHelpers.applyCuteFilter(ctx, face); break;
      case 'doll': FilterHelpers.applyDollFilter(ctx, face); break;
      case 'vintage': FilterHelpers.applyVintageFilter(ctx, x, y, width, height); break;
      case 'neon': FilterHelpers.applyNeonFilter(ctx, x, y, width, height); break;
      case 'cyberpunk': FilterHelpers.applyCyberpunkFilter(ctx, x, y, width, height); break;
      case 'dreamy': FilterHelpers.applyDreamyFilter(ctx, x, y, width, height); break;
      case 'galaxy': FilterHelpers.applyGalaxyFilter(ctx, x, y, width, height); break;
    }
  };

  const applyFullScreenFilter = (ctx: CanvasRenderingContext2D, width: number, height: number, filterId: string) => {
    // Apply full-screen filters when no faces are detected
    switch (filterId) {
      case 'smooth':
      case 'glow':
      case 'rosy':
      case 'bright':
      case 'cute':
      case 'doll':
        FilterHelpers.applySmoothFilter(ctx, 0, 0, width, height);
        break;
      case 'vintage':
        FilterHelpers.applyVintageFilter(ctx, 0, 0, width, height);
        break;
      case 'neon':
        FilterHelpers.applyNeonFilter(ctx, 0, 0, width, height);
        break;
      case 'cyberpunk':
        FilterHelpers.applyCyberpunkFilter(ctx, 0, 0, width, height);
        break;
      case 'dreamy':
        FilterHelpers.applyDreamyFilter(ctx, 0, 0, width, height);
        break;
      case 'galaxy':
        FilterHelpers.applyGalaxyFilter(ctx, 0, 0, width, height);
        break;
    }
  };
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
            ? 'border-pink-500 bg-pink-500/20 shadow-pink-500/50 shadow-lg' 
            : 'border-purple-500/20 hover:border-purple-400'
        }`}
      >
        <Sparkles className="text-white" size={20} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 left-0 bg-black/95 backdrop-blur-md rounded-lg p-4 border border-purple-500/20 w-80 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Face Filters</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {faceFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => selectFilter(filter.id)}
                className={`p-3 rounded-lg border text-center transition-all hover:scale-105 ${
                  activeFilter === filter.id
                    ? 'border-pink-500 bg-pink-500/20 shadow-pink-500/50 shadow-md'
                    : 'border-purple-500/30 bg-black/50 hover:border-purple-400 hover:bg-purple-500/10'
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

export default TikTokFilters;