import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { Post, Comment } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

interface PostCardProps {
  post: Post;
  onUpdate: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onUpdate }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (!user) return;

    try {
      if (post.is_liked) {
        await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', post.id);
      } else {
        await supabase
          .from('likes')
          .insert([{ user_id: user.id, post_id: post.id }]);
      }
      onUpdate();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const loadComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          users(username, avatar_url)
        `)
        .eq('post_id', post.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
      setShowComments(true);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setLoading(true);
    try {
      await supabase
        .from('comments')
        .insert([{ user_id: user.id, post_id: post.id, content: newComment }]);
      
      setNewComment('');
      await loadComments();
      onUpdate();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={post.user?.avatar_url} />
            <AvatarFallback>{post.user?.username?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{post.user?.username}</p>
            <p className="text-sm text-gray-500">
              {new Date(post.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{post.content}</p>
        {post.image_url && (
          <img src={post.image_url} alt="Post" className="w-full rounded-lg mb-4" />
        )}
        
        <div className="flex items-center space-x-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`flex items-center space-x-1 ${post.is_liked ? 'text-red-500' : ''}`}
          >
            <Heart className={`h-4 w-4 ${post.is_liked ? 'fill-current' : ''}`} />
            <span>{post.likes_count || 0}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={loadComments}
            className="flex items-center space-x-1"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{post.comments_count || 0}</span>
          </Button>
        </div>

        {showComments && (
          <div className="border-t pt-4">
            <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.id} className="flex items-start space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={comment.user?.avatar_url} />
                    <AvatarFallback className="text-xs">
                      {comment.user?.username?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <span className="font-semibold text-sm">{comment.user?.username}</span>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <form onSubmit={handleComment} className="flex space-x-2">
              <Input
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="sm" disabled={loading}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PostCard;