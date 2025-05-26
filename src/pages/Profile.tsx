
import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProfileForm from '@/components/ProfileForm';
import ProfileImageUpload from '@/components/ProfileImageUpload';
import ChangePasswordDialog from '@/components/ChangePasswordDialog';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { User, Mail, Calendar, MapPin, GraduationCap, Book, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url: string;
  bio?: string;
  grade_level?: string;
  school?: string;
  subjects?: string[];
  created_at: string;
  updated_at: string;
}

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching profile for user:', user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      }

      if (data) {
        console.log('Profile fetched successfully:', data);
        setProfile(data);
      } else {
        // Create a basic profile if none exists
        console.log('No profile found, creating basic profile...');
        const basicProfile = {
          id: user.id,
          first_name: '',
          last_name: '',
          email: user.email || '',
          avatar_url: '',
          bio: '',
          grade_level: '',
          school: '',
          subjects: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        // Try to create the profile
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert(basicProfile)
          .select()
          .maybeSingle();
          
        if (createError) {
          console.warn('Could not create profile:', createError);
        }
        
        setProfile(newProfile || basicProfile);
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      // Create fallback profile
      setProfile({
        id: user.id,
        first_name: '',
        last_name: '',
        email: user.email || '',
        avatar_url: '',
        bio: '',
        grade_level: '',
        school: '',
        subjects: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = (updatedProfile: ProfileData) => {
    setProfile(updatedProfile);
  };

  if (!user) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset className="flex-1">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <h1 className="text-lg font-semibold">Profile</h1>
            </header>
            <div className="flex-1 p-6">
              <p>Please log in to view your profile.</p>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset className="flex-1">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <h1 className="text-lg font-semibold">Profile</h1>
            </header>
            <div className="flex-1 p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  if (!profile) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset className="flex-1">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <h1 className="text-lg font-semibold">Profile</h1>
            </header>
            <div className="flex-1 p-6">
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Unable to load profile</p>
                <Button onClick={() => window.location.reload()}>
                  Refresh Page
                </Button>
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  const bio = profile.bio || 'No bio available';
  const gradeLevel = profile.grade_level || 'Not specified';
  const school = profile.school || 'Not specified';
  const subjects = profile.subjects || [];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-lg font-semibold">Profile</h1>
          </header>
          
          <div className="flex-1 p-6 max-w-4xl mx-auto space-y-6">
            {/* Profile Header */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <ProfileImageUpload 
                      userId={profile.id}
                      currentImageUrl={profile.avatar_url}
                      onImageUpdate={(newUrl) => setProfile({ ...profile, avatar_url: newUrl })}
                    />
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">
                          {profile.first_name || profile.last_name 
                            ? `${profile.first_name} ${profile.last_name}`.trim()
                            : 'Name not set'
                          }
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span>{profile.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-gray-500" />
                        <span>Grade: {gradeLevel}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>School: {school}</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Book className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Subjects:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {subjects.length > 0 ? (
                          subjects.map((subject, index) => (
                            <Badge key={index} variant="secondary">
                              {subject}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-gray-500">No subjects selected</span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">{bio}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>Member since {new Date(profile.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Edit Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Edit Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProfileForm 
                  initialData={profile}
                  onUpdate={handleProfileUpdate}
                />
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowPasswordDialog(true)}
                  >
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>

            <ChangePasswordDialog 
              open={showPasswordDialog}
              onOpenChange={setShowPasswordDialog}
            />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Profile;
