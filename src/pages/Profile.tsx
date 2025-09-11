import { useAuth } from '@/contexts/AuthContext';
import ErrorHandler from '@/components/ErrorHandler';
import ProfileSetup from '@/components/ProfileSetup';

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) {
    return <ErrorHandler message="You must be signed in to view or edit your profile." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black text-white p-6">
      <ProfileSetup />
    </div>
  );
};

export default ProfilePage;
