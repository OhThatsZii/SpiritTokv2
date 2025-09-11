import { useAuth } from '@/contexts/AuthContext';
import ErrorHandler from '@/components/ErrorHandler';
import { UserManagement } from '@/components/UserManagement';

const AdminUsersPage = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'owner') {
    return <ErrorHandler message="Only admins can manage users." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black text-white p-6">
      <UserManagement />
    </div>
  );
};

export default AdminUsersPage;
