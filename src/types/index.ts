export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  role: 'owner' | 'creator' | 'viewer';
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  user?: User;
  likes_count?: number;
  comments_count?: number;
  is_liked?: boolean;
}

export interface Comment {
  id: string;
  user_id: string;
  post_id: string;
  content: string;
  created_at: string;
  user?: User;
}

export interface Like {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  read: boolean;
  created_at: string;
  sender?: User;
  recipient?: User;
}

export interface LiveStream {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  is_active: boolean;
  viewer_count: number;
  created_at: string;
  ended_at?: string;
  user?: User;
}

export interface LiveComment {
  id: string;
  user_id: string;
  stream_id: string;
  content: string;
  created_at: string;
  user?: User;
}