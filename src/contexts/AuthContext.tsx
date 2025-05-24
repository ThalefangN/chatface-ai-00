
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: any }>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for mock user in localStorage for bypass authentication
    const mockUser = localStorage.getItem('mockUser');
    if (mockUser) {
      const parsedUser = JSON.parse(mockUser);
      // Create a minimal user object that matches the User type
      const minimalUser = {
        id: parsedUser.id,
        email: parsedUser.email,
        user_metadata: {
          first_name: parsedUser.first_name || '',
          last_name: parsedUser.last_name || '',
        },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        phone: '',
        email_confirmed_at: new Date().toISOString(),
        confirmed_at: new Date().toISOString(),
        last_sign_in_at: new Date().toISOString(),
        role: 'authenticated',
        updated_at: new Date().toISOString(),
        identities: [],
        factors: [],
      } as User;
      setUser(minimalUser);
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Bypass authentication - any email/password combination works
      if (email && password) {
        const minimalUser = {
          id: 'mock-user-id',
          email,
          user_metadata: {
            first_name: '',
            last_name: '',
          },
          app_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
          phone: '',
          email_confirmed_at: new Date().toISOString(),
          confirmed_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
          role: 'authenticated',
          updated_at: new Date().toISOString(),
          identities: [],
          factors: [],
        } as User;
        
        localStorage.setItem('mockUser', JSON.stringify({ email, id: 'mock-user-id' }));
        setUser(minimalUser);
        return { error: null };
      }
      return { error: 'Email and password required' };
    } catch (error) {
      console.error('Error during sign in:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      // Bypass authentication for sign up as well
      if (email && password) {
        const minimalUser = {
          id: 'mock-user-id',
          email,
          user_metadata: {
            first_name: firstName || '',
            last_name: lastName || '',
          },
          app_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
          phone: '',
          email_confirmed_at: new Date().toISOString(),
          confirmed_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
          role: 'authenticated',
          updated_at: new Date().toISOString(),
          identities: [],
          factors: [],
        } as User;
        
        localStorage.setItem('mockUser', JSON.stringify({ 
          email, 
          id: 'mock-user-id', 
          first_name: firstName,
          last_name: lastName 
        }));
        setUser(minimalUser);
        return { error: null };
      }
      return { error: 'Email and password required' };
    } catch (error) {
      console.error('Error during sign up:', error);
      return { error };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('mockUser');
    setUser(null);
    setSession(null);
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  };

  const value = {
    user,
    session,
    signIn,
    signUp,
    signOut,
    resetPassword,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
