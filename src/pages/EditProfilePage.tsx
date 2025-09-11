import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ErrorHandler from '@/components/ErrorHandler';
import { EditProfile } from '@/components/EditProfileComplete';

const EditProfilePage = () => {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(true);

  if (!user) {
    return <ErrorHandler message="You must be signed in to edit your profile." />;
  }

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <EditProfile onClose={() => setIsVisible(false)} />
    </div>
  );
};

export default EditProfilePage;
