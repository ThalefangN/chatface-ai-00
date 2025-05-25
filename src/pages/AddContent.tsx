
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useTeacherAuth } from '@/contexts/TeacherAuthContext';
import { toast } from 'sonner';

const AddContent = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { teacherProfile } = useTeacherAuth();
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content_type: '',
    content_text: '',
    content_url: '',
    duration_minutes: '',
    is_downloadable: false
  });

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (error) throw error;
      setCourse(data);
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Failed to load course');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !teacherProfile) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('course_content')
        .insert({
          course_id: courseId,
          title: formData.title,
          description: formData.description || null,
          content_type: formData.content_type,
          content_text: formData.content_text || null,
          content_url: formData.content_url || null,
          duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : null,
          is_downloadable: formData.is_downloadable
        });

      if (error) throw error;

      toast.success('Content added successfully!');
      navigate(`/teacher/manage-course/${courseId}`);
    } catch (error) {
      console.error('Error adding content:', error);
      toast.error('Failed to add content');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // For now, we'll just set a placeholder URL
      // In production, you'd upload to Supabase Storage
      const fileName = `${Date.now()}-${file.name}`;
      setFormData(prev => ({ ...prev, content_url: fileName }));
      toast.success('File selected successfully');
    } catch (error) {
      console.error('Error handling file:', error);
      toast.error('Failed to handle file');
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Link 
            to={`/teacher/manage-course/${courseId}`}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to course management
          </Link>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Add Content to {course.title}</CardTitle>
              <CardDescription>
                Create new learning materials for your students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title">Content Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Introduction to Algebra"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the content"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="content_type">Content Type</Label>
                  <Select
                    value={formData.content_type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, content_type: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="note">Note</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.content_type === 'note' && (
                  <div>
                    <Label htmlFor="content_text">Content Text</Label>
                    <Textarea
                      id="content_text"
                      value={formData.content_text}
                      onChange={(e) => setFormData(prev => ({ ...prev, content_text: e.target.value }))}
                      placeholder="Enter the note content"
                      rows={8}
                    />
                  </div>
                )}

                {(formData.content_type === 'video' || formData.content_type === 'assignment') && (
                  <div>
                    <Label htmlFor="file_upload">Upload File</Label>
                    <div className="mt-2">
                      <Input
                        type="file"
                        onChange={handleFileUpload}
                        accept={formData.content_type === 'video' ? 'video/*' : '*'}
                      />
                    </div>
                    {formData.content_url && (
                      <p className="mt-2 text-sm text-green-600">
                        File selected: {formData.content_url}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: e.target.value }))}
                    placeholder="Estimated reading/viewing time"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="downloadable"
                    checked={formData.is_downloadable}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_downloadable: checked }))}
                  />
                  <Label htmlFor="downloadable">Allow students to download this content</Label>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/teacher/manage-course/${courseId}`)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Content'}
                    <Save className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddContent;
