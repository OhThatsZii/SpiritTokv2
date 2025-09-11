import CreatePost from '@/components/CreatePost';
import { useAuth } from '@/contexts/AuthContext';
import ErrorHandler from '@/components/ErrorHandler';

const CreatePage = () => {
  const { user } = useAuth();

  if (!user || (user.role !== 'owner' && user.role !== 'creator')) {
    return <ErrorHandler message="Only creators and owners can post." />;
  }

  const refreshFeed = () => {
    // Optional: logic to refresh or redirect after post
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <CreatePost onPostCreated={refreshFeed} />
    </div>
  );
};

export default CreatePage;
