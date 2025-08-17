import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Auth from './Auth';
import Feed from './Feed';
import CreatePost from './CreatePost';
import LiveStream from './LiveStream';
import Messages from './Messages';
import { CreatorApplication } from './CreatorApplication';
import { AdminPanel } from './AdminPanel';
import { UsersList } from './UsersList';
import { EditProfile } from './EditProfileComplete';
import ErrorHandler from './ErrorHandler';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Home, Video, MessageSquare, LogOut, Users, Settings, UserPlus, Edit3 } from 'lucide-react';
const AppLayout: React.FC = () => {
  const { user, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'feed' | 'live' | 'messages' | 'users' | 'apply' | 'admin' | 'profile'>('feed');
  const [showEditProfile, setShowEditProfile] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const refreshFeed = () => {
    // This will trigger a re-render of the Feed component
    setActiveTab('feed');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold">SpiritTok</h1>
          
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={user.avatar_url} />
              <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{user.username}</span>
            {user.role === 'creator' && (
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                Creator
              </span>
            )}
            {user.role === 'owner' && (
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                Owner
              </span>
            )}
            <Button variant="ghost" size="sm" onClick={() => setShowEditProfile(true)}>
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen p-4">
          <div className="space-y-2">
            <Button
              variant={activeTab === 'feed' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('feed')}
            >
              <Home className="h-4 w-4 mr-2" />
              Feed
            </Button>
            
            {(user.role === 'owner' || user.role === 'creator') && (
              <Button
                variant={activeTab === 'live' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('live')}
              >
                <Video className="h-4 w-4 mr-2" />
                Go Live
              </Button>
            )}
            
            <Button
              variant={activeTab === 'messages' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('messages')}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Messages
            </Button>
            
            <Button
              variant={activeTab === 'users' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('users')}
            >
              <Users className="h-4 w-4 mr-2" />
              Users
            </Button>

            <Button
              variant={activeTab === 'apply' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('apply')}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Creator Application
            </Button>

            {user.role === 'owner' && (
              <Button
                variant={activeTab === 'admin' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('admin')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Admin Panel
              </Button>
            )}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'feed' && (
            <div>
              <CreatePost onPostCreated={refreshFeed} />
              <Feed key={activeTab} />
            </div>
          )}
          
          {activeTab === 'live' && (user.role === 'owner' || user.role === 'creator') && (
            <LiveStream />
          )}
          
          {activeTab === 'messages' && (
            <Messages />
          )}
          
          {activeTab === 'users' && user.role === 'owner' && (
            <AdminPanel />
          )}

          {activeTab === 'users' && user.role !== 'owner' && (
            <UsersList />
          )}

          {activeTab === 'apply' && (
            <CreatorApplication onApplicationSubmitted={() => setActiveTab('feed')} />
          )}

          {activeTab === 'admin' && user.role === 'owner' && (
            <AdminPanel />
          )}
        </main>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <EditProfile onClose={() => setShowEditProfile(false)} />
        </div>
      )}
    </div>
  );
};

export default AppLayout;