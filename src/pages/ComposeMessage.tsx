import { ComposeMessage } from '@/components/ComposeMessage';
import { useAuth } from '@/contexts/AuthContext';
import ErrorHandler from '@/components/ErrorHandler';

const MessagesPage = () => {
  const { user } = useAuth();

  if (!user) {
    return <ErrorHandler message="You must be signed in to send messages." />;
  }

  return (
    <div className="p-4">
      <ComposeMessage />
    </div>
  );
};

export default MessagesPage;
