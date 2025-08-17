import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FollowButton } from './FollowButton';
import { MessageModal } from './MessageModal';
import { MessageSquare } from 'lucide-react';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  avatar_url?: string;
  created_at: string;
}

export const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageModal, setMessageModal] = useState<{
    isOpen: boolean;
    recipientId: string;
    recipientUsername: string;
  }>({
    isOpen: false,
    recipientId: '',
    recipientUsername: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const openMessageModal = (recipientId: string, recipientUsername: string) => {
    setMessageModal({
      isOpen: true,
      recipientId,
      recipientUsername
    });
  };

  const closeMessageModal = () => {
    setMessageModal({
      isOpen: false,
      recipientId: '',
      recipientUsername: ''
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Users</h2>
      
      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h3 className="font-semibold">{user.username}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  
                  <Badge variant={
                    user.role === 'owner' ? 'destructive' : 
                    user.role === 'creator' ? 'secondary' : 'outline'
                  }>
                    {user.role === 'owner' ? 'Owner' : 
                     user.role === 'creator' ? 'Creator' : 'Viewer'}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openMessageModal(user.id, user.username)}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                  <FollowButton userId={user.id} username={user.username} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <MessageModal
        isOpen={messageModal.isOpen}
        onClose={closeMessageModal}
        recipientId={messageModal.recipientId}
        recipientUsername={messageModal.recipientUsername}
      />
    </div>
  );
};
