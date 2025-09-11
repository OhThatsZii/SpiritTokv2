import { CreatorApplication } from '@/components/CreatorApplication';
import { useAuth } from '@/contexts/AuthContext';
import ErrorHandler from '@/components/ErrorHandler';

const CreatorAppPage = () => {
  const { user } = useAuth();

  if (!user) {
    return <ErrorHandler message="You must be signed in to apply." />;
  }

  const handleApplicationSubmitted = () => {
    // Optional: redirect to /feed or show a success screen
    console.log('Application submitted');
  };

  return (
    <div className="p-4">
      <CreatorApplication onApplicationSubmitted={handleApplicationSubmitted} />
    </div>
  );
};

export default CreatorAppPage;
