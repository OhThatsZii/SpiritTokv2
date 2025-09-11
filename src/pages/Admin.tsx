import { useAuth } from '@/contexts/AuthContext';
import { AdminPanel } from '@/components/AdminPanel';
import ErrorHandler from '@/components/ErrorHandler';
import PageMotion from '@/components/PageMotion';

const AdminPage = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'owner') {
    return <ErrorHandler message="Access denied. Owner only." />;
  }

  return (
    <PageMotion>
      <AdminPanel />
    </PageMotion>
  );
};

export default AdminPage;

