import { useAuth } from '@/contexts/AuthContext';
import ErrorHandler from '@/components/ErrorHandler';
import SearchPage from '@/components/SearchPage';

const SearchRoutePage = () => {
  const { user } = useAuth();

  if (!user) {
    return <ErrorHandler message="You must be signed in to explore SpiritTok." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black text-white p-6">
      <SearchPage />
    </div>
  );
};

export default SearchRoutePage;
