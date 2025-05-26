
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
  first_name: string;
  last_name: string;
  grade_level: string;
  bio: string;
  school: string;
  subjects: string[];
}

interface ProfileFormProps {
  profile: ProfileData;
  onProfileUpdate: (profile: ProfileData) => void;
  isEditing: boolean;
  onEditToggle: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  onProfileUpdate,
  isEditing,
  onEditToggle
}) => {
  const [formData, setFormData] = useState<ProfileData>(profile);
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

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          grade_level: formData.grade_level,
          bio: formData.bio,
          school: formData.school,
          subjects: formData.subjects
        })
        .eq('id', user.id);

      if (error) throw error;

      onProfileUpdate(formData);
      onEditToggle();
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

  const handleCancel = () => {
    setFormData(profile);
    onEditToggle();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name</Label>
          <Input
            id="first_name"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name</Label>
          <Input
            id="last_name"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            disabled={!isEditing}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="grade">Grade Level</Label>
        {isEditing ? (
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
        ) : (
          <Input
            id="grade"
            value={formData.grade_level}
            disabled={true}
          />
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="school">School</Label>
        <Input
          id="school"
          value={formData.school}
          onChange={(e) => setFormData({ ...formData, school: e.target.value })}
          disabled={!isEditing}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={formData.bio || ''}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          disabled={!isEditing}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Subjects</Label>
        <div className="flex flex-wrap gap-2">
          {formData.subjects?.map((subject, index) => (
            <Badge key={index} variant="outline">
              {subject}
            </Badge>
          ))}
        </div>
      </div>

      {isEditing && (
        <div className="flex flex-col sm:flex-row gap-2 pt-4">
          <Button 
            size="sm" 
            className="w-full sm:w-auto"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCancel}
            className="w-full sm:w-auto"
            disabled={isSaving}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfileForm;
