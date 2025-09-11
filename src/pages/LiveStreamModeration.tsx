import { useAuth } from '@/contexts/AuthContext';
import ErrorHandler from '@/components/ErrorHandler';
import LiveStreamControls from '@/components/LiveStreamControls';

const ModerationPage = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'owner') {
    return <ErrorHandler message="Only owners can access moderation tools." />;
  }

  const mockViewers = [
    { id: '1', name: 'SpiritSeeker123', isBlocked: false, isMuted: false },
    { id: '2', name: 'TarotLover', isBlocked: true, isMuted: false },
    { id: '3', name: 'CrystalHealer', isBlocked: false, isMuted: true },
  ];

  const handleBlockUser = (id: string) => console.log('Block:', id);
  const handleMuteUser = (id: string) => console.log('Mute:', id);
  const handleUnblockUser = (id: string) => console.log('Unblock:', id);
  const handleUnmuteUser = (id: string) => console.log('Unmute:', id);

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Moderation Panel</h1>
      <LiveStreamControls
        viewers={mockViewers}
        onBlockUser={handleBlockUser}
        onMuteUser={handleMuteUser}
        onUnblockUser={handleUnblockUser}
        onUnmuteUser={handleUnmuteUser}
      />
    </div>
  );
};

export default ModerationPage;
