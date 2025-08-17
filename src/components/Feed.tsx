import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Post } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import PostCard from './PostCard';
import { useToast } from '@/hooks/use-toast';

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadPosts = async () => {
    try {
      // First get posts with user info
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          *,
          users(id, username, avatar_url, role)
        `)
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      if (!postsData) {
        setPosts([]);
        return;
      }

      // Get likes and comments counts for each post
      const postsWithCounts = await Promise.all(
        postsData.map(async (post) => {
          // Get likes count
          const { count: likesCount } = await supabase
            .from('likes')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id);

          // Get comments count
          const { count: commentsCount } = await supabase
            .from('comments')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id);

          // Check if current user liked this post
          let isLiked = false;
          if (user) {
            const { data: likeData } = await supabase
              .from('likes')
              .select('id')
              .eq('post_id', post.id)
              .eq('user_id', user.id)
              .single();
            isLiked = !!likeData;
          }

          return {
            ...post,
            user: post.users,
            likes_count: likesCount || 0,
            comments_count: commentsCount || 0,
            is_liked: isLiked
          };
        })
      );

      setPosts(postsWithCounts);
    } catch (error: any) {
      console.error('Error loading posts:', error);
      toast({
        title: 'Error loading posts',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No posts yet. Check back later!</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onUpdate={loadPosts} />
      ))}
    </div>
  );
};

export default Feed;