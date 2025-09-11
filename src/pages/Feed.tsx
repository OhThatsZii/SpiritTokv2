import Feed from '@/components/Feed';
import CreatePost from '@/components/CreatePost';

const FeedPage = () => {
  const refreshFeed = () => {
    // Optional: logic to refresh Feed
  };

  return (
    <div className="p-4">
      <CreatePost onPostCreated={refreshFeed} />
      <Feed />
    </div>
  );
};

export default FeedPage;

