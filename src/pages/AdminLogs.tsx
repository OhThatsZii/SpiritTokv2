import { useAuth } from '@/contexts/AuthContext';
import ErrorHandler from '@/components/ErrorHandler';
import { UserActivityLogs } from '@/components/UserActivityLogs';
import PageMotion from '@/components/PageMotion';

const AdminLogsPage = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'owner') {
    return <ErrorHandler message="Only owners can view activity logs." />;
  }

  return (
    <PageMotion>
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black text-white p-6">
      <UserActivityLogs />
    </div>
    </PageMotion>
    
  );
};

export default AdminLogsPage;
