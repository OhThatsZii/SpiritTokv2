import React, { useState, useRef, useEffect } from 'react';
import { Ban, VolumeX, MessageSquare, Users, Shield, X } from 'lucide-react';

interface LiveStreamControlsProps {
  viewers: Array<{ id: string; name: string; isBlocked?: boolean; isMuted?: boolean }>;
  onBlockUser: (userId: string) => void;
  onMuteUser: (userId: string) => void;
  onUnblockUser: (userId: string) => void;
  onUnmuteUser: (userId: string) => void;
}

const LiveStreamControls: React.FC<LiveStreamControlsProps> = ({
  viewers,
  onBlockUser,
  onMuteUser,
  onUnblockUser,
  onUnmuteUser
}) => {
  const [showModPanel, setShowModPanel] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setShowModPanel(false);
      }
    };

    if (showModPanel) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModPanel]);

  return (
    <div ref={panelRef} className="absolute top-16 right-4 z-10">
      <button
        onClick={() => setShowModPanel(!showModPanel)}
        className="bg-black/50 backdrop-blur-md rounded-full p-3 mb-2 border border-purple-500/20 hover:border-purple-400 transition-colors"
      >
        <Shield className="text-white" size={20} />
      </button>

      {showModPanel && (
        <div className="bg-black/80 backdrop-blur-md rounded-xl p-4 w-64 border border-purple-500/20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold flex items-center">
              <Users size={16} className="mr-2" />
              Moderation Panel
            </h3>
            <button
              onClick={() => setShowModPanel(false)}
              className="text-gray-400 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="max-h-48 overflow-y-auto space-y-2">
            {viewers.length === 0 ? (
              <div className="text-gray-400 text-sm text-center py-4">
                No viewers to moderate
              </div>
            ) : (
              viewers.map((viewer) => (
                <div key={viewer.id} className="flex items-center justify-between bg-black/30 rounded-lg p-2">
                  <span className="text-white text-sm truncate flex-1">{viewer.name}</span>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => viewer.isMuted ? onUnmuteUser(viewer.id) : onMuteUser(viewer.id)}
                      className={`p-1 rounded transition-colors ${
                        viewer.isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'
                      }`}
                      title={viewer.isMuted ? 'Unmute' : 'Mute'}
                    >
                      <VolumeX size={12} className="text-white" />
                    </button>
                    <button
                      onClick={() => viewer.isBlocked ? onUnblockUser(viewer.id) : onBlockUser(viewer.id)}
                      className={`p-1 rounded transition-colors ${
                        viewer.isBlocked ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'
                      }`}
                      title={viewer.isBlocked ? 'Unblock' : 'Block'}
                    >
                      <Ban size={12} className="text-white" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveStreamControls;