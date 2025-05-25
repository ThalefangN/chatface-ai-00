
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface TeacherProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  bio?: string;
  specialization?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

interface TeacherAuthContextType {
  user: User | null;
  session: Session | null;
  teacherProfile: TeacherProfile | null;
  loading: boolean;
}

const TeacherAuthContext = createContext<TeacherAuthContextType | undefined>(undefined);

export const useTeacherAuth = () => {
  const context = useContext(TeacherAuthContext);
  if (context === undefined) {
    throw new Error('useTeacherAuth must be used within a TeacherAuthProvider');
  }
  return context;
};

export const TeacherAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTeacherProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('teacher_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching teacher profile:', error);
        return;
      }

      setTeacherProfile(data);
    } catch (error) {
      console.error('Error fetching teacher profile:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchTeacherProfile(session.user.id);
        } else {
          setTeacherProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchTeacherProfile(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    session,
    teacherProfile,
    loading,
  };

  return <TeacherAuthContext.Provider value={value}>{children}</TeacherAuthContext.Provider>;
};
