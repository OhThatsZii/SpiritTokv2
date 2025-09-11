import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ErrorHandler from '@/components/ErrorHandler';
import { MessageModal } from '@/components/MessageModal';

const MessagePreviewPage = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(true);

  if (!user) {
    return <ErrorHandler message="You must be signed in to send messages." />;
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <MessageModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        recipientId="demo-recipient-id"
        recipientUsername="MysticOracle"
      />
    </div>
  );
};

export default MessagePreviewPage;
