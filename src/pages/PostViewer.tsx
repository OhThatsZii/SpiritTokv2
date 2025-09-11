import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ErrorHandler from '@/components/ErrorHandler';
import PostCard from '@/components/PostCard';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const PostViewerPage = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          user:profiles(username, avatar_url)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && id) {
      fetchPost();
    }
  }, [user, id]);

  if (!user) {
    return <ErrorHandler message="You must be signed in to view posts." />;
  }

  if (loading) {
    return <div className="text-center py-8">Loading post...</div>;
  }

  if (!post) {
    return <ErrorHandler message="Post not found." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black text-white p-6">
      <PostCard post={post} onUpdate={fetchPost} />
    </div>
  );
};

export default PostViewerPage;
