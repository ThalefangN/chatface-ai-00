
import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ChangePasswordDialog from '@/components/ChangePasswordDialog';
import ProfileImageUpload from '@/components/ProfileImageUpload';
import ProfileForm from '@/components/ProfileForm';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  Mail, 
  Calendar, 
  Trophy, 
  Target, 
  BookOpen, 
  Clock,
  Bell,
  Shield,
  Settings as SettingsIcon,
  Edit
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: user?.email || '',
    bio: '',
    grade_level: '12th Grade',
    school: 'Virtual Academy',
    subjects: ['Mathematics', 'Physics', 'Chemistry'],
    profile_image_url: ''
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    studyReminders: true,
    darkMode: false,
    autoSave: true
  });

  const studyStats = {
    totalStudyTime: '127 hours',
    completedTopics: 45,
    currentStreak: 7,
    averageScore: 87
  };

  const achievements = [
    { name: 'First Week Complete', description: 'Completed 7 days of study', earned: true },
    { name: 'Math Master', description: 'Scored 90%+ in 5 math topics', earned: true },
    { name: 'Consistency Champion', description: 'Study for 30 days straight', earned: false },
    { name: 'Perfect Score', description: 'Get 100% on any assessment', earned: false }
  ];

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: user.email || '',
          bio: data.bio || '',
          grade_level: data.grade_level || '12th Grade',
          school: data.school || 'Virtual Academy',
          subjects: data.subjects || ['Mathematics', 'Physics', 'Chemistry'],
          profile_image_url: data.profile_image_url || ''
        });
      } else {
        // Create profile if it doesn't exist
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            first_name: user.user_metadata?.first_name || '',
            last_name: user.user_metadata?.last_name || '',
            email: user.email
          });

        if (insertError) {
          console.error('Error creating profile:', insertError);
        }
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpdate = (url: string) => {
    setProfile(prev => ({ ...prev, profile_image_url: url }));
  };

  const handleProfileUpdate = (updatedProfile: any) => {
    setProfile(prev => ({ ...prev, ...updatedProfile }));
  };

  const fullName = `${profile.first_name} ${profile.last_name}`.trim() || 'Student User';

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset className="flex-1">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-2 sm:px-4">
              <SidebarTrigger className="-ml-1" />
              <h1 className="text-sm sm:text-lg font-semibold">Profile & Settings</h1>
            </header>
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-2 sm:px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-sm sm:text-lg font-semibold">Profile & Settings</h1>
          </header>
          
          <div className="flex-1 p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6 overflow-auto">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile" className="text-xs sm:text-sm">Profile</TabsTrigger>
                <TabsTrigger value="stats" className="text-xs sm:text-sm">Statistics</TabsTrigger>
                <TabsTrigger value="settings" className="text-xs sm:text-sm">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-4 sm:space-y-6">
                {/* Profile Header */}
                <Card>
                  <CardHeader>
                    <div className="flex flex-col items-center sm:flex-row sm:items-center gap-4">
                      <ProfileImageUpload
                        currentImageUrl={profile.profile_image_url}
                        userName={fullName}
                        onImageUpdate={handleImageUpdate}
                        isEditing={isEditing}
                      />
                      <div className="flex-1 space-y-2 text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <CardTitle className="text-lg sm:text-xl">{fullName}</CardTitle>
                          <Badge variant="secondary">{profile.grade_level}</Badge>
                        </div>
                        <CardDescription className="flex items-center justify-center sm:justify-start gap-2">
                          <Mail className="h-4 w-4" />
                          <span className="text-xs sm:text-sm">{profile.email}</span>
                        </CardDescription>
                        <CardDescription className="flex items-center justify-center sm:justify-start gap-2">
                          <BookOpen className="h-4 w-4" />
                          <span className="text-xs sm:text-sm">{profile.school}</span>
                        </CardDescription>
                      </div>
                      <Button 
                        variant={isEditing ? "secondary" : "outline"}
                        onClick={() => setIsEditing(!isEditing)}
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        {isEditing ? 'Cancel' : 'Edit'}
                      </Button>
                    </div>
                  </CardHeader>
                </Card>

                {/* Profile Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProfileForm
                      profile={{
                        first_name: profile.first_name,
                        last_name: profile.last_name,
                        grade_level: profile.grade_level,
                        bio: profile.bio,
                        school: profile.school,
                        subjects: profile.subjects
                      }}
                      onProfileUpdate={handleProfileUpdate}
                      isEditing={isEditing}
                      onEditToggle={() => setIsEditing(!isEditing)}
                    />
                  </CardContent>
                </Card>

                {/* Achievements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Trophy className="h-5 w-5" />
                      Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                      {achievements.map((achievement, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border ${
                            achievement.earned 
                              ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20' 
                              : 'bg-gray-50 border-gray-200 dark:bg-gray-800'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <Trophy 
                              className={`h-5 w-5 mt-0.5 ${
                                achievement.earned ? 'text-yellow-600' : 'text-gray-400'
                              }`} 
                            />
                            <div>
                              <h4 className="font-medium text-sm">{achievement.name}</h4>
                              <p className="text-xs text-gray-600 dark:text-gray-300">
                                {achievement.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stats" className="space-y-4 sm:space-y-6">
                {/* Study Statistics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Study Time</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl sm:text-2xl font-bold">{studyStats.totalStudyTime}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Topics Completed</CardTitle>
                      <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl sm:text-2xl font-bold">{studyStats.completedTopics}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl sm:text-2xl font-bold">{studyStats.currentStreak} days</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                      <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl sm:text-2xl font-bold">{studyStats.averageScore}%</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Progress Chart Placeholder */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Study Progress</CardTitle>
                    <CardDescription>Your learning journey over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[150px] sm:h-[200px] flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-200 rounded text-center text-sm">
                      Progress chart will be displayed here
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4 sm:space-y-6">
                {/* Notification Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Bell className="h-5 w-5" />
                      Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 pr-4">
                        <Label htmlFor="email-notifications" className="text-sm font-medium">Email Notifications</Label>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                          Receive study reminders via email
                        </p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) => 
                          setSettings({...settings, emailNotifications: checked})
                        }
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex-1 pr-4">
                        <Label htmlFor="push-notifications" className="text-sm font-medium">Push Notifications</Label>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                          Get instant notifications on your device
                        </p>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={settings.pushNotifications}
                        onCheckedChange={(checked) => 
                          setSettings({...settings, pushNotifications: checked})
                        }
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex-1 pr-4">
                        <Label htmlFor="study-reminders" className="text-sm font-medium">Study Reminders</Label>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                          Daily reminders to maintain study habits
                        </p>
                      </div>
                      <Switch
                        id="study-reminders"
                        checked={settings.studyReminders}
                        onCheckedChange={(checked) => 
                          setSettings({...settings, studyReminders: checked})
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* App Preferences */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <SettingsIcon className="h-5 w-5" />
                      App Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 pr-4">
                        <Label htmlFor="dark-mode" className="text-sm font-medium">Dark Mode</Label>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                          Switch to dark theme for better night studying
                        </p>
                      </div>
                      <Switch
                        id="dark-mode"
                        checked={settings.darkMode}
                        onCheckedChange={(checked) => 
                          setSettings({...settings, darkMode: checked})
                        }
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex-1 pr-4">
                        <Label htmlFor="auto-save" className="text-sm font-medium">Auto Save</Label>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                          Automatically save your progress
                        </p>
                      </div>
                      <Switch
                        id="auto-save"
                        checked={settings.autoSave}
                        onCheckedChange={(checked) => 
                          setSettings({...settings, autoSave: checked})
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Security Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Shield className="h-5 w-5" />
                      Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ChangePasswordDialog />
                    <Button variant="outline" className="w-full">
                      Download My Data
                    </Button>
                    <Button variant="destructive" className="w-full">
                      Delete Account
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Profile;
