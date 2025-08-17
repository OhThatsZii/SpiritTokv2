import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Eye, Smile, Zap, Sun, Palette, X } from 'lucide-react';

interface AdvancedBeautyFiltersProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const AdvancedBeautyFilters: React.FC<AdvancedBeautyFiltersProps> = ({ videoRef, canvasRef }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [filters, setFilters] = useState({
    skinSmoothing: 0,
    eyeEnhancement: 0,
    teethWhitening: 0,
    brightness: 100,
    warmth: 0,
    vibrance: 100,
    glow: 0
  });

  const animationRef = useRef<number>();
  const panelRef = useRef<HTMLDivElement>(null);

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

  const applyAdvancedFilters = () => {
    if (!videoRef.current || !canvasRef.current || !isActive) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx || video.videoWidth === 0) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      // Skin smoothing
      if (filters.skinSmoothing > 0) {
        const isSkinTone = r > 95 && g > 40 && b > 20 && r > g && r > b;
        if (isSkinTone) {
          const smooth = filters.skinSmoothing / 100;
          r = r * (1 - smooth) + 200 * smooth;
          g = g * (1 - smooth) + 180 * smooth;
          b = b * (1 - smooth) + 160 * smooth;
        }
      }

      // Eye enhancement
      if (filters.eyeEnhancement > 0) {
        const isEyeArea = r < 100 && g < 100 && b < 100;
        if (isEyeArea) {
          const enhance = 1 + (filters.eyeEnhancement / 100);
          r = Math.min(255, r * enhance);
          g = Math.min(255, g * enhance);
          b = Math.min(255, b * enhance);
        }
      }

      // Teeth whitening
      if (filters.teethWhitening > 0) {
        const isTeeth = r > 180 && g > 180 && b > 150 && Math.abs(r - g) < 30;
        if (isTeeth) {
          const whiten = filters.teethWhitening / 100;
          r = Math.min(255, r + whiten * 20);
          g = Math.min(255, g + whiten * 20);
          b = Math.min(255, b + whiten * 25);
        }
      }

      // Brightness
      const brightnessFactor = filters.brightness / 100;
      r = Math.min(255, r * brightnessFactor);
      g = Math.min(255, g * brightnessFactor);
      b = Math.min(255, b * brightnessFactor);

      // Warmth
      if (filters.warmth !== 0) {
        const warmthFactor = filters.warmth / 100;
        r = Math.max(0, Math.min(255, r + warmthFactor * 25));
        g = Math.max(0, Math.min(255, g + warmthFactor * 15));
        b = Math.max(0, Math.min(255, b - warmthFactor * 10));
      }

      // Vibrance
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      const vibFactor = filters.vibrance / 100;
      r = gray + (r - gray) * vibFactor;
      g = gray + (g - gray) * vibFactor;
      b = gray + (b - gray) * vibFactor;

      // Glow effect
      if (filters.glow > 0) {
        const glowFactor = filters.glow / 100;
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
        if (luminance > 128) {
          r = Math.min(255, r + glowFactor * 30);
          g = Math.min(255, g + glowFactor * 30);
          b = Math.min(255, b + glowFactor * 30);
        }
      }

      data[i] = Math.round(r);
      data[i + 1] = Math.round(g);
      data[i + 2] = Math.round(b);
    }

    ctx.putImageData(imageData, 0, 0);
    animationRef.current = requestAnimationFrame(applyAdvancedFilters);
  };

  useEffect(() => {
    if (isActive) {
      if (canvasRef.current) {
        canvasRef.current.style.display = 'block';
      }
      if (videoRef.current) {
        videoRef.current.style.display = 'none';
      }
      applyAdvancedFilters();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (canvasRef.current) {
        canvasRef.current.style.display = 'none';
      }
      if (videoRef.current) {
        videoRef.current.style.display = 'block';
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, filters]);

  const updateFilter = (key: keyof typeof filters, value: number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div ref={panelRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black/30 backdrop-blur-md rounded-full p-3 border border-purple-500/20 hover:border-purple-400 transition-colors"
      >
        <Sparkles className="text-white" size={20} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 left-0 bg-black/80 backdrop-blur-md rounded-lg p-4 border border-purple-500/20 w-72 max-h-80 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center">
              <Sparkles className="mr-2" size={16} />
              Beauty Filters
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsActive(!isActive)}
                className={`px-2 py-1 rounded text-xs ${
                  isActive ? 'bg-purple-500 text-white' : 'bg-gray-600 text-gray-300'
                }`}
              >
                {isActive ? 'ON' : 'OFF'}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-white text-xs flex items-center mb-1">
                <Zap size={10} className="mr-1" />
                Skin Smoothing: {filters.skinSmoothing}%
              </label>
              <input
                type="range"
                min="0"
                max="80"
                value={filters.skinSmoothing}
                onChange={(e) => updateFilter('skinSmoothing', Number(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>

            <div>
              <label className="text-white text-xs flex items-center mb-1">
                <Eye size={10} className="mr-1" />
                Eye Enhancement: {filters.eyeEnhancement}%
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={filters.eyeEnhancement}
                onChange={(e) => updateFilter('eyeEnhancement', Number(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>

            <div>
              <label className="text-white text-xs flex items-center mb-1">
                <Smile size={10} className="mr-1" />
                Teeth Whitening: {filters.teethWhitening}%
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={filters.teethWhitening}
                onChange={(e) => updateFilter('teethWhitening', Number(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>

            <div>
              <label className="text-white text-xs flex items-center mb-1">
                <Sun size={10} className="mr-1" />
                Brightness: {filters.brightness}%
              </label>
              <input
                type="range"
                min="70"
                max="130"
                value={filters.brightness}
                onChange={(e) => updateFilter('brightness', Number(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>

            <div>
              <label className="text-white text-xs mb-1 block">
                Warmth: {filters.warmth}%
              </label>
              <input
                type="range"
                min="-30"
                max="30"
                value={filters.warmth}
                onChange={(e) => updateFilter('warmth', Number(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>

            <div>
              <label className="text-white text-xs flex items-center mb-1">
                <Palette size={10} className="mr-1" />
                Vibrance: {filters.vibrance}%
              </label>
              <input
                type="range"
                min="50"
                max="150"
                value={filters.vibrance}
                onChange={(e) => updateFilter('vibrance', Number(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>

            <div>
              <label className="text-white text-xs mb-1 block">
                Glow: {filters.glow}%
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={filters.glow}
                onChange={(e) => updateFilter('glow', Number(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedBeautyFilters;