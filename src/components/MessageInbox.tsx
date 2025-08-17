import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X, Eye } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  status: string;
  created_at: string;
  sender: {
    username: string;
    avatar_url?: string;
  };
  recipient: {
    username: string;
  };
}

export const MessageInbox: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchMessages = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_messages')
        .select(`
          id,
          content,
          status,
          created_at,
          sender_id,
          sender:profiles!user_messages_sender_id_fkey(username, avatar_url)
        `)
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Check if sender is followed for each message
      const messagesWithFollowStatus = await Promise.all(
        (data || []).map(async (message) => {
          const { data: followData } = await supabase
            .from('follows')
            .select('id')
            .eq('follower_id', user.id)
            .eq('following_id', message.sender_id)
            .single();
          
          return {
            ...message,
            senderIsFollowed: !!followData
          };
        })
      );
      
      setMessages(messagesWithFollowStatus);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  const updateMessageStatus = async (messageId: string, status: string) => {
    try {
      await supabase
        .from('user_messages')
        .update({ status })
        .eq('id', messageId);
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, status } : msg
        )
      );
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  const pendingMessages = messages.filter(m => m.status === 'pending');
  const approvedMessages = messages.filter(m => m.status === 'approved' || m.status === 'read');

  if (loading) {
    return <div className="text-center py-8">Loading messages...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Messages</h2>
      
      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pendingMessages.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approvedMessages.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="space-y-4">
          {pendingMessages.map((message) => (
            <Card key={message.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">From: {message.sender.username}</CardTitle>
                  <Badge variant="outline">Pending Review</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{message.content}</p>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => updateMessageStatus(message.id, 'approved')}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateMessageStatus(message.id, 'denied')}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Deny
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {pendingMessages.length === 0 && (
            <p className="text-center text-gray-500">No pending messages</p>
          )}
        </TabsContent>
        
        <TabsContent value="approved" className="space-y-4">
          {approvedMessages.map((message) => (
            <Card key={message.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">From: {message.sender.username}</CardTitle>
                  <Badge variant="secondary">Approved</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{message.content}</p>
                {message.status === 'approved' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => updateMessageStatus(message.id, 'read')}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Mark as Read
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
          {approvedMessages.length === 0 && (
            <p className="text-center text-gray-500">No approved messages</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};