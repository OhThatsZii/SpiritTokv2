import { useAuth } from '@/contexts/AuthContext';
import ErrorHandler from '@/components/ErrorHandler';
import { UsersList } from '@/components/UsersList';
import PageMotion from '@/components/PageMotion';

const UsersPage = () => {
  const { user } = useAuth();

  if (!user) {
    return <ErrorHandler message="You must be signed in to view the user directory." />;
  }

  return (
    <PageMotion>
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black text-white p-6">
      <UsersList />
    </div>
    </PageMotion>
  );
};

export default UsersPage;
