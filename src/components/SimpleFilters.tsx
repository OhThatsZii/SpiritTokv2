import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';

interface SimpleFiltersProps {
  onFilterChange?: (filterId: string | null) => void;
}

const SimpleFilters: React.FC<SimpleFiltersProps> = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filters = [
    { id: 'none', name: 'None', preview: '🚫' },
    { id: 'smooth', name: 'Smooth', preview: '✨' },
    { id: 'glow', name: 'Glow', preview: '🌟' },
    { id: 'rosy', name: 'Rosy', preview: '🌹' },
    { id: 'bright', name: 'Bright', preview: '☀️' },
    { id: 'cute', name: 'Cute', preview: '🥰' },
  ];

  const selectFilter = (filterId: string) => {
    setActiveFilter(filterId);
    onFilterChange?.(filterId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
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
            {filters.map((filter) => (
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

export default SimpleFilters;