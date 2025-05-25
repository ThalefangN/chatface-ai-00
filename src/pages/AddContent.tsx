import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, Save, FileText, File, CheckCircle, X } from 'lucide-react';
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
  const [uploading, setUploading] = useState(false);
  const [course, setCourse] = useState<any>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>('');
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type for notes (documents)
    if (formData.content_type === 'notes') {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'text/markdown'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a valid document file (PDF, DOC, DOCX, TXT, MD)');
        return;
      }
    }

    setUploading(true);
    try {
      // Create unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${courseId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('course-documents')
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('course-documents')
        .getPublicUrl(fileName);

      setUploadedFile(file);
      setUploadedFileUrl(publicUrl);
      setFormData(prev => ({ ...prev, content_url: publicUrl }));
      toast.success('Document uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const removeUploadedFile = async () => {
    if (uploadedFileUrl && formData.content_url) {
      try {
        // Extract file path from URL for deletion
        const fileName = uploadedFileUrl.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('course-documents')
            .remove([`${courseId}/${fileName}`]);
        }
      } catch (error) {
        console.error('Error removing file:', error);
      }
    }
    
    setUploadedFile(null);
    setUploadedFileUrl('');
    setFormData(prev => ({ ...prev, content_url: '' }));
    toast.success('Document removed');
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
              <CardTitle>Add Content to {course?.title}</CardTitle>
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
                      <SelectItem value="notes">Notes</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.content_type === 'notes' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="document_upload">Upload Document</Label>
                      <div className="mt-2">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Upload your document
                          </h3>
                          <p className="text-gray-500 mb-4">
                            Supports PDF, DOC, DOCX, TXT, MD files
                          </p>
                          <label htmlFor="document_upload" className="cursor-pointer">
                            <Button type="button" disabled={uploading}>
                              <FileText className="w-4 h-4 mr-2" />
                              {uploading ? 'Uploading...' : 'Choose Document'}
                            </Button>
                            <Input
                              id="document_upload"
                              type="file"
                              onChange={handleFileUpload}
                              accept=".pdf,.doc,.docx,.txt,.md,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown"
                              className="hidden"
                              disabled={uploading}
                            />
                          </label>
                        </div>
                      </div>
                      {uploadedFile && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <div>
                                <p className="text-sm font-medium text-green-800">
                                  Document uploaded: {uploadedFile.name}
                                </p>
                                <p className="text-xs text-green-600">
                                  Size: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={removeUploadedFile}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="content_text">Content Text (Optional)</Label>
                      <Textarea
                        id="content_text"
                        value={formData.content_text}
                        onChange={(e) => setFormData(prev => ({ ...prev, content_text: e.target.value }))}
                        placeholder="Enter additional note content or leave empty if uploading document"
                        rows={6}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Add text content here or upload a document above
                      </p>
                    </div>
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
                        disabled={uploading}
                      />
                    </div>
                    {uploading && (
                      <p className="mt-2 text-sm text-blue-600">Uploading...</p>
                    )}
                    {uploadedFile && (
                      <p className="mt-2 text-sm text-green-600">
                        File uploaded: {uploadedFile.name}
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
                  <Button type="submit" disabled={loading || uploading}>
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
