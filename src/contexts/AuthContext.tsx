import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check for mock user in localStorage
    const mockUser = localStorage.getItem('mockUser');
    if (mockUser) {
      const userData = JSON.parse(mockUser);
      setUser({
        id: userData.id,
        email: userData.email,
        user_metadata: {
          first_name: userData.firstName,
          last_name: userData.lastName,
        }
      } as User);
    }

    // Set up the auth state listener for real Supabase auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          toast({
            title: "Logged in successfully",
            description: "Welcome to StudyBuddy!",
          });
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Logged out",
            description: "You have been logged out successfully",
          });
          navigate('/');
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (!mockUser) { // Only set Supabase session if no mock user
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // For bypass mode, just check if email and password are provided
      if (email && password) {
        const mockUser = {
          id: 'mock-user-id',
          email: email,
          user_metadata: {}
        };
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        setUser(mockUser as User);
        
        toast({
          title: "Logged in successfully",
          description: "Welcome to StudyBuddy!",
        });
        
        navigate('/dashboard');
        return;
      }

      // Original Supabase auth (commented out for bypass)
      // const { error } = await supabase.auth.signInWithPassword({ email, password });
      // if (error) throw error;
      // navigate('/dashboard');
      
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during sign in",
        variant: "destructive"
      });
      console.error('Error signing in:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      setLoading(true);
      
      // For bypass mode
      if (email && password && firstName && lastName) {
        const mockUser = {
          id: 'mock-user-id',
          email: email,
          user_metadata: {
            first_name: firstName,
            last_name: lastName
          }
        };
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        setUser(mockUser as User);
        
        toast({
          title: "Account created",
          description: "Welcome to StudyBuddy!",
        });
        
        navigate('/dashboard');
        return;
      }

      // Original Supabase code (commented out for bypass)
      /*
      const { data: { user }, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });
      
      if (error) throw error;
      
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            first_name: firstName,
            last_name: lastName,
            email: email
          })
          .eq('id', user.id);
          
        if (profileError) {
          console.error('Error updating profile:', profileError);
        }
        
        await createInitialUserData(user.id);
      }
      
      toast({
        title: "Account created",
        description: "Please check your email to confirm your account",
      });
      
      navigate('/dashboard');
      */
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during sign up",
        variant: "destructive"
      });
      console.error('Error signing up:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const createInitialUserData = async (userId: string) => {
    try {
      const skills = [
        { name: 'Clarity', value: 65 },
        { name: 'Confidence', value: 70 },
        { name: 'Pacing', value: 50 },
        { name: 'Structure', value: 60 }
      ];
      
      await supabase.from('user_skills')
        .insert(skills.map(skill => ({
          user_id: userId,
          name: skill.name,
          value: skill.value
        })));
        
      const alerts = [
        {
          type: 'info',
          title: 'Welcome to StudyBuddy!',
          message: 'Get started by scheduling your first practice session.',
          icon: 'Info'
        },
        {
          type: 'reminder',
          title: 'Complete your profile',
          message: 'Add more details to your profile to personalize your experience.',
          icon: 'User'
        }
      ];
      
      await supabase.from('user_alerts')
        .insert(alerts.map(alert => ({
          user_id: userId,
          type: alert.type,
          title: alert.title,
          message: alert.message,
          icon: alert.icon,
          is_read: false
        })));
        
    } catch (error) {
      console.error('Error creating initial user data:', error);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      // Clear mock user
      localStorage.removeItem('mockUser');
      setUser(null);
      setSession(null);
      
      // Also sign out from Supabase if needed
      await supabase.auth.signOut();
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message || "An error occurred during sign out",
        variant: "destructive"
      });
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (error) throw error;
      
      toast({
        title: "Password reset email sent",
        description: "Check your email for instructions to reset your password"
      });
    } catch (error: any) {
      toast({
        title: "Password reset failed",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
      console.error('Error resetting password:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, signIn, signUp, signOut, loading, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
