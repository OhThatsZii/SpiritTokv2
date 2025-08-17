import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        setLoading(false);
        return;
      }
      
      // Check if account is locked, suspended, or deactivated
      if (data.account_status && data.account_status !== 'active') {
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }
      
      setUser(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        // Track failed login attempt - but don't fail if this fails
        try {
          await supabase.functions.invoke('track-failed-login', {
            body: { email }
          });
        } catch (trackError) {
          console.error('Error tracking failed login:', trackError);
        }
        throw error;
      }
      
      // Reset failed login attempts on successful login
      const { data: session } = await supabase.auth.getSession();
      if (session.session?.user) {
        try {
          await supabase
            .from('profiles')
            .update({ 
              failed_login_attempts: 0,
              account_locked_at: null,
              account_locked_reason: null
            })
            .eq('id', session.session.user.id);
        } catch (resetError) {
          console.error('Error resetting failed attempts:', resetError);
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    if (data.user) {
      // Create user profile with default role
      const defaultRole = email === 'owner@spirittok.com' ? 'owner' : 'viewer';
      
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ 
          id: data.user.id, 
          username,
          role: defaultRole,
          account_status: 'active'
        }]);
      
      if (profileError) throw profileError;

      // Also create entry in users table for compatibility
      try {
        await supabase
          .from('users')
          .insert([{
            id: data.user.id,
            email,
            username,
            role: defaultRole
          }]);
      } catch (userError) {
        console.error('Error creating user entry:', userError);
      }
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const refreshUser = async () => {
    if (user) {
      await fetchUserProfile(user.id);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};