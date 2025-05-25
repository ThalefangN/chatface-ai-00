
import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useTeacherAuth } from '@/contexts/TeacherAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AddContent = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const contentType = searchParams.get('type') as 'note' | 'video' | 'assignment';
  const { teacherProfile } = useTeacherAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content_text: '',
    content_url: '',
    duration_minutes: 0,
    is_downloadable: false,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !contentType) {
      toast.error('Invalid course or content type');
      return;
    }

    setLoading(true);

    try {
      // Get the highest order_index for this course
      const { data: existingContent } = await supabase
        .from('course_content')
        .select('order_index')
        .eq('course_id', courseId)
        .order('order_index', { ascending: false })
        .limit(1);

      const nextOrderIndex = existingContent && existingContent.length > 0 
        ? existingContent[0].order_index + 1 
        : 0;

      const { data, error } = await supabase
        .from('course_content')
        .insert({
          course_id: courseId,
          content_type: contentType,
          order_index: nextOrderIndex,
          ...formData,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating content:', error);
        toast.error('Failed to create content');
        return;
      }

      // Update materials count
      const { error: updateError } = await supabase
        .from('courses')
        .update({ 
          materials_count: supabase.raw('materials_count + 1') 
        })
        .eq('id', courseId);

      if (updateError) {
        console.error('Error updating materials count:', updateError);
      }

      toast.success(`${contentType} created successfully!`);
      navigate(`/teacher/manage-course/${courseId}`);
    } catch (error) {
      console.error('Error creating content:', error);
      toast.error('Failed to create content');
    } finally {
      setLoading(false);
    }
  };

  const getContentTypeLabel = () => {
    switch (contentType) {
      case 'note': return 'Note';
      case 'video': return 'Video';
      case 'assignment': return 'Assignment';
      default: return 'Content';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(`/teacher/manage-course/${courseId}`)}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Course
            </Button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Add {getContentTypeLabel()}
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Add New {getContentTypeLabel()}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder={`e.g., ${contentType === 'note' ? 'Chapter 1: Introduction' : contentType === 'video' ? 'Lesson 1: Getting Started' : 'Assignment 1: Basic Exercises'}`}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder={`Describe this ${contentType}...`}
                    rows={3}
                  />
                </div>

                {contentType === 'note' && (
                  <div className="space-y-2">
                    <Label htmlFor="content_text">Content *</Label>
                    <Textarea
                      id="content_text"
                      value={formData.content_text}
                      onChange={(e) => handleInputChange('content_text', e.target.value)}
                      placeholder="Enter the note content here..."
                      rows={10}
                      required
                    />
                  </div>
                )}

                {(contentType === 'video' || contentType === 'assignment') && (
                  <div className="space-y-2">
                    <Label htmlFor="content_url">{contentType === 'video' ? 'Video URL' : 'Assignment File URL'}</Label>
                    <Input
                      id="content_url"
                      value={formData.content_url}
                      onChange={(e) => handleInputChange('content_url', e.target.value)}
                      placeholder={contentType === 'video' ? 'https://youtube.com/watch?v=...' : 'https://example.com/assignment.pdf'}
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration_minutes}
                      onChange={(e) => handleInputChange('duration_minutes', parseInt(e.target.value) || 0)}
                      placeholder="e.g., 15"
                      min="0"
                    />
                  </div>

                  {contentType === 'note' && (
                    <div className="flex items-center space-x-3 pt-8">
                      <Switch
                        id="is_downloadable"
                        checked={formData.is_downloadable}
                        onCheckedChange={(checked) => handleInputChange('is_downloadable', checked)}
                      />
                      <Label htmlFor="is_downloadable">Downloadable</Label>
                    </div>
                  )}
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
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Add {getContentTypeLabel()}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AddContent;
