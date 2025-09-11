import { useAuth } from '@/contexts/AuthContext';
import ErrorHandler from '@/components/ErrorHandler';
import { MessageInbox } from '@/components/MessageInbox';

const MessagesPage = () => {
  const { user } = useAuth();

  if (!user) {
    return <ErrorHandler message="You must be signed in to view your inbox." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black text-white p-6">
      <MessageInbox />
    </div>
  );
};

export default MessagesPage;
