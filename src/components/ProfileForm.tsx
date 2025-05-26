
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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

interface ProfileFormProps {
  initialData: ProfileData;
  onUpdate: (profile: ProfileData) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  initialData,
  onUpdate
}) => {
  const [formData, setFormData] = useState({
    first_name: initialData.first_name || '',
    last_name: initialData.last_name || '',
    bio: initialData.bio || '',
    grade_level: initialData.grade_level || '',
    school: initialData.school || '',
    subjects: initialData.subjects || []
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const gradeOptions = [
    'PSLE',
    'JCE',
    'BGCSE',
    '10th Grade',
    '11th Grade',
    '12th Grade'
  ];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          bio: formData.bio,
          grade_level: formData.grade_level,
          school: formData.school,
          subjects: formData.subjects
        })
        .eq('id', user.id);

      if (error) throw error;

      const updatedProfile = {
        ...initialData,
        ...formData,
        updated_at: new Date().toISOString()
      };

      onUpdate(updatedProfile);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name</Label>
          <Input
            id="first_name"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name</Label>
          <Input
            id="last_name"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="grade">Grade Level</Label>
        <Select 
          value={formData.grade_level} 
          onValueChange={(value) => setFormData({ ...formData, grade_level: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select grade level" />
          </SelectTrigger>
          <SelectContent>
            {gradeOptions.map((grade) => (
              <SelectItem key={grade} value={grade}>
                {grade}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="school">School</Label>
        <Input
          id="school"
          value={formData.school}
          onChange={(e) => setFormData({ ...formData, school: e.target.value })}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Subjects</Label>
        <div className="flex flex-wrap gap-2">
          {formData.subjects.length > 0 ? (
            formData.subjects.map((subject, index) => (
              <Badge key={index} variant="outline">
                {subject}
              </Badge>
            ))
          ) : (
            <span className="text-gray-500 text-sm">No subjects selected</span>
          )}
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button 
          type="submit"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
