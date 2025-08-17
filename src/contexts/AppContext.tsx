import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  avatar: string;
  isLive: boolean;
  followers: number;
  following: number;
  bio: string;
  specialties: string[];
}

interface Post {
  id: string;
  user: User;
  content: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  timestamp: string;
  type: 'reading' | 'meditation' | 'crystals' | 'astrology';
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  isLive: boolean;
  setIsLive: (isLive: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLive, setIsLive] = useState(false);

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      posts,
      setPosts,
      isLive,
      setIsLive,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};