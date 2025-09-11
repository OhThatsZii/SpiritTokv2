import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ErrorHandler from '@/components/ErrorHandler';
import LiveStreamSettings from '@/components/LiveStreamSettings';

const LiveSettingsPage = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  if (!user || user.role !== 'owner') {
    return <ErrorHandler message="Only owners can access live stream settings." />;
  }

  const toggleCamera = () => setIsVideoOn((prev) => !prev);
  const toggleMic = () => setIsMuted((prev) => !prev);

  return (
    <div className="min-h-screen bg-black text-white">
      <LiveStreamSettings
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onCameraToggle={toggleCamera}
        onMicToggle={toggleMic}
        isVideoOn={isVideoOn}
        isMuted={isMuted}
      />
    </div>
  );
};

export default LiveSettingsPage;
