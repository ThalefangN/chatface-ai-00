
import React, { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import MobileNavigation from '@/components/MobileNavigation';
import { User, Settings, LogOut, Award, Calendar, Clock, BarChart3, Mic, Users, Presentation } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { format } from 'date-fns';

interface UserSkill {
  id: string;
  name: string;
  value: number;
}

interface PracticeSession {
  id: string;
  type: string;
  title: string;
  duration: number | null;
  created_at: string;
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [recentSessions, setRecentSessions] = useState<PracticeSession[]>([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    practiceTime: 0,
    presentations: 0,
    interviews: 0,
    publicSpeaking: 0
  });
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    memberSince: '',
    subscriptionType: 'Free'
  });

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchUserSkills();
      fetchRecentSessions();
    }
  }, [user]);
  
  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, email, member_since, subscription_type, username')
        .eq('id', user?.id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setProfile({
          firstName: data.first_name || (user?.user_metadata?.first_name as string) || '',
          lastName: data.last_name || (user?.user_metadata?.last_name as string) || '',
          email: data.email || user?.email || '',
          memberSince: data.member_since ? format(new Date(data.member_since), 'MMMM yyyy') : 'October 2023',
          subscriptionType: data.subscription_type || 'Free'
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };
  
  const fetchUserSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('user_skills')
        .select('*')
        .eq('user_id', user?.id);
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        setUserSkills(data);
      } else {
        // If no skills found, create default skills
        const defaultSkills = [
          { name: 'Clarity', value: 70 },
          { name: 'Confidence', value: 85 },
          { name: 'Pacing', value: 60 },
          { name: 'Structure', value: 75 }
        ];
        
        // Insert default skills
        for (const skill of defaultSkills) {
          await supabase.from('user_skills').insert({
            user_id: user?.id,
            name: skill.name,
            value: skill.value
          });
        }
        
        setUserSkills(defaultSkills.map((skill, index) => ({ 
          id: index.toString(), 
          ...skill 
        })));
      }
    } catch (error) {
      console.error('Error fetching user skills:', error);
    }
  };
  
  const fetchRecentSessions = async () => {
    try {
      setLoading(true);
      
      // Fetch recent practice sessions
      const { data: sessions, error: sessionsError } = await supabase
        .from('practice_sessions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(3);
        
      if (sessionsError) throw sessionsError;
      
      if (sessions) {
        setRecentSessions(sessions);
        
        // Calculate overall stats
        const { data: allSessions, error: statsError } = await supabase
          .from('practice_sessions')
          .select('*')
          .eq('user_id', user?.id);
          
        if (statsError) throw statsError;
        
        if (allSessions) {
          const totalTime = allSessions.reduce((sum, session) => sum + (session.duration || 0), 0);
          const presentations = allSessions.filter(s => s.type === 'presentation').length;
          const interviews = allSessions.filter(s => s.type === 'interview').length;
          const publicSpeaking = allSessions.filter(s => s.type === 'public-speaking').length;
          
          setStats({
            totalSessions: allSessions.length,
            practiceTime: parseFloat((totalTime / 60).toFixed(1)), // Convert to hours
            presentations,
            interviews,
            publicSpeaking
          });
        }
      } else {
        setRecentSessions([]);
      }
    } catch (error) {
      console.error('Error fetching practice sessions:', error);
      toast({
        title: "Failed to load data",
        description: "Could not retrieve your practice sessions.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  const getInitials = () => {
    const firstInitial = profile.firstName ? profile.firstName.charAt(0) : '';
    const lastInitial = profile.lastName ? profile.lastName.charAt(0) : '';
    return (firstInitial + lastInitial).toUpperCase() || 'U';
  };
  
  if (loading && !userSkills.length && !recentSessions.length) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 container mx-auto px-4 py-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </main>
        <MobileNavigation />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-6 pb-24 md:pb-6">
        <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">
                {profile.firstName 
                  ? `${profile.firstName} ${profile.lastName}`
                  : 'User Profile'}
              </h1>
              <p className="text-muted-foreground">{profile.email}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex items-center bg-card border border-border px-4 py-2 rounded-lg text-sm hover:bg-muted transition-colors">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </button>
            <button 
              onClick={handleSignOut}
              className="inline-flex items-center bg-card border border-border px-4 py-2 rounded-lg text-sm hover:bg-destructive/10 text-destructive transition-colors"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Skills Overview</h3>
              <Award className="h-5 w-5 text-primary" />
            </div>
            
            <div className="space-y-4">
              {userSkills.map((skill) => (
                <div key={skill.id || skill.name}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">{skill.name}</span>
                    <span className="text-sm font-medium">{skill.value}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${skill.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Practice Stats</h3>
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="text-sm">Total Sessions</span>
                </div>
                <span className="font-medium">{stats.totalSessions}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="text-sm">Practice Time</span>
                </div>
                <span className="font-medium">{stats.practiceTime} hours</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Presentation className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="text-sm">Presentations</span>
                </div>
                <span className="font-medium">{stats.presentations}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="text-sm">Interviews</span>
                </div>
                <span className="font-medium">{stats.interviews}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Mic className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="text-sm">Public Speaking</span>
                </div>
                <span className="font-medium">{stats.publicSpeaking}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm md:col-span-2 lg:col-span-1">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Account Info</h3>
              <User className="h-5 w-5 text-primary" />
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">
                  {profile.firstName ? `${profile.firstName} ${profile.lastName}` : 'Not provided'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{profile.email}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium">{profile.memberSince}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Subscription</p>
                <p className="font-medium">{profile.subscriptionType}</p>
              </div>
            </div>
          </div>
        </div>
        
        <section>
          <h2 className="text-xl font-semibold mb-4">Recent Practice Sessions</h2>
          
          {recentSessions.length > 0 ? (
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="p-6">
                {recentSessions.map((session) => {
                  let IconComponent = Presentation;
                  
                  if (session.type === 'interview') {
                    IconComponent = Users;
                  } else if (session.type === 'public-speaking') {
                    IconComponent = Mic;
                  }
                  
                  return (
                    <div key={session.id} className="flex items-center justify-between py-3 border-b last:border-b-0 border-border">
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-primary/10 mr-3">
                          <IconComponent className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{session.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {new Date(session.created_at).toLocaleDateString()} • {session.duration ? `${session.duration} min` : 'In progress'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-xs bg-card border border-border px-3 py-1 rounded hover:bg-muted transition-colors">
                          View
                        </button>
                        <button className="text-xs bg-primary/10 text-primary px-3 py-1 rounded hover:bg-primary/20 transition-colors">
                          Replay
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="bg-muted/30 p-4 text-center">
                <button className="text-sm text-primary hover:underline">
                  View all practice sessions
                </button>
              </div>
            </div>
          ) : (
            <Alert>
              <AlertTitle>No practice sessions yet</AlertTitle>
              <AlertDescription>
                You haven't completed any practice sessions. Start a new session to begin tracking your progress.
              </AlertDescription>
            </Alert>
          )}
        </section>
      </main>
      
      <MobileNavigation />
    </div>
  );
};

export default Profile;
