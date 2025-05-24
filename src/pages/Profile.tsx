
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
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
  Palette,
  Settings as SettingsIcon,
  Edit
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.user_metadata?.full_name || 'Student User',
    email: user?.email || '',
    bio: 'Passionate learner exploring mathematics and science',
    grade: '12th Grade',
    school: 'Virtual Academy',
    subjects: ['Mathematics', 'Physics', 'Chemistry']
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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-lg font-semibold">Profile & Settings</h1>
          </header>
          
          <div className="flex-1 p-4 md:p-6 space-y-6 overflow-auto">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="stats">Statistics</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                {/* Profile Header */}
                <Card>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={user?.user_metadata?.avatar_url} />
                        <AvatarFallback className="text-lg">
                          {profile.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <CardTitle className="text-xl">{profile.name}</CardTitle>
                          <Badge variant="secondary">{profile.grade}</Badge>
                        </div>
                        <CardDescription className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {profile.email}
                        </CardDescription>
                        <CardDescription className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          {profile.school}
                        </CardDescription>
                      </div>
                      <Button 
                        variant={isEditing ? "secondary" : "outline"}
                        onClick={() => setIsEditing(!isEditing)}
                        size="sm"
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
                    <CardTitle>Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={(e) => setProfile({...profile, name: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="grade">Grade Level</Label>
                        <Input
                          id="grade"
                          value={profile.grade}
                          onChange={(e) => setProfile({...profile, grade: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                        disabled={!isEditing}
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Subjects</Label>
                      <div className="flex flex-wrap gap-2">
                        {profile.subjects.map((subject, index) => (
                          <Badge key={index} variant="outline">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex gap-2 pt-4">
                        <Button size="sm">Save Changes</Button>
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Achievements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <TabsContent value="stats" className="space-y-6">
                {/* Study Statistics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Study Time</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{studyStats.totalStudyTime}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Topics Completed</CardTitle>
                      <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{studyStats.completedTopics}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{studyStats.currentStreak} days</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                      <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{studyStats.averageScore}%</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Progress Chart Placeholder */}
                <Card>
                  <CardHeader>
                    <CardTitle>Study Progress</CardTitle>
                    <CardDescription>Your learning journey over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-200 rounded">
                      Progress chart will be displayed here
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                {/* Notification Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
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
                      <div>
                        <Label htmlFor="push-notifications">Push Notifications</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
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
                      <div>
                        <Label htmlFor="study-reminders">Study Reminders</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
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
                    <CardTitle className="flex items-center gap-2">
                      <SettingsIcon className="h-5 w-5" />
                      App Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="dark-mode">Dark Mode</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
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
                      <div>
                        <Label htmlFor="auto-save">Auto Save</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
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
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full sm:w-auto">
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full sm:w-auto">
                      Download My Data
                    </Button>
                    <Button variant="destructive" className="w-full sm:w-auto">
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
