import React, { useState } from 'react';
import { X, Camera, Mic, Volume2, Wifi, Palette, Sparkles } from 'lucide-react';

interface LiveStreamSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onCameraToggle: () => void;
  onMicToggle: () => void;
  isVideoOn: boolean;
  isMuted: boolean;
}

const LiveStreamSettings: React.FC<LiveStreamSettingsProps> = ({
  isOpen,
  onClose,
  onCameraToggle,
  onMicToggle,
  isVideoOn,
  isMuted
}) => {
  const [videoQuality, setVideoQuality] = useState('720p');
  const [audioQuality, setAudioQuality] = useState('high');
  const [enableSDK, setEnableSDK] = useState(false);
  const [sdkProvider, setSdkProvider] = useState('banuba');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-black/90 backdrop-blur-md rounded-2xl p-6 border border-purple-500/20 w-96 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Live Stream Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Camera & Audio Controls */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Media Controls</h3>
          
          <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-purple-500/20">
            <div className="flex items-center space-x-3">
              <Camera className="text-purple-400" size={20} />
              <span className="text-white">Camera</span>
            </div>
            <button
              onClick={onCameraToggle}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isVideoOn 
                  ? 'bg-green-500 text-white' 
                  : 'bg-red-500 text-white'
              }`}
            >
              {isVideoOn ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-purple-500/20">
            <div className="flex items-center space-x-3">
              <Mic className="text-purple-400" size={20} />
              <span className="text-white">Microphone</span>
            </div>
            <button
              onClick={onMicToggle}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !isMuted 
                  ? 'bg-green-500 text-white' 
                  : 'bg-red-500 text-white'
              }`}
            >
              {!isMuted ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Quality Settings */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Quality Settings</h3>
          
          <div className="space-y-3">
            <div>
              <label className="text-white text-sm mb-2 block">Video Quality</label>
              <select 
                value={videoQuality}
                onChange={(e) => setVideoQuality(e.target.value)}
                className="w-full bg-black/30 border border-purple-500/30 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-purple-400"
              >
                <option value="480p">480p (Standard)</option>
                <option value="720p">720p (HD)</option>
                <option value="1080p">1080p (Full HD)</option>
              </select>
            </div>

            <div>
              <label className="text-white text-sm mb-2 block">Audio Quality</label>
              <select 
                value={audioQuality}
                onChange={(e) => setAudioQuality(e.target.value)}
                className="w-full bg-black/30 border border-purple-500/30 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-purple-400"
              >
                <option value="low">Low (32kbps)</option>
                <option value="medium">Medium (64kbps)</option>
                <option value="high">High (128kbps)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter SDK Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-3">Advanced Filters</h3>
          
          <div className="p-3 bg-black/30 rounded-lg border border-purple-500/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Sparkles className="text-purple-400" size={20} />
                <span className="text-white">Professional Filter SDK</span>
              </div>
              <button
                onClick={() => setEnableSDK(!enableSDK)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  enableSDK 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-gray-600 text-gray-300'
                }`}
              >
                {enableSDK ? 'ON' : 'OFF'}
              </button>
            </div>
            
            {enableSDK && (
              <div>
                <label className="text-white text-sm mb-2 block">SDK Provider</label>
                <select 
                  value={sdkProvider}
                  onChange={(e) => setSdkProvider(e.target.value)}
                  className="w-full bg-black/30 border border-purple-500/30 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-purple-400"
                >
                  <option value="banuba">Banuba (Coming Soon)</option>
                  <option value="bytedance">ByteDance (Coming Soon)</option>
                  <option value="agora">Agora Extensions</option>
                </select>
                <p className="text-gray-400 text-xs mt-2">
                  Professional filter SDKs provide advanced AR effects and beauty filters
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-purple-500/20">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveStreamSettings;