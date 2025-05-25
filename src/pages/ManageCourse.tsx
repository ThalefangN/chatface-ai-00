
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Users, BookOpen, Video, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useTeacherAuth } from '@/contexts/TeacherAuthContext';
import { toast } from 'sonner';

interface CourseContent {
  id: string;
  title: string;
  description: string | null;
  content_type: 'note' | 'video' | 'assignment';
  content_url: string | null;
  duration_minutes: number | null;
  is_downloadable: boolean;
  created_at: string;
}

const ManageCourse = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { teacherProfile } = useTeacherAuth();
  const [course, setCourse] = useState<any>(null);
  const [content, setContent] = useState<CourseContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseId) {
      fetchCourse();
      fetchContent();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          teacher_profiles!inner(first_name, last_name)
        `)
        .eq('id', courseId)
        .single();

      if (error) throw error;
      setCourse(data);
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Failed to load course');
    }
  };

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('course_content')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index');

      if (error) throw error;

      // Type assertion to ensure content_type is properly typed
      const typedData = (data || []).map(item => ({
        ...item,
        content_type: item.content_type as 'note' | 'video' | 'assignment'
      }));

      setContent(typedData);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteContent = async (contentId: string) => {
    try {
      const { error } = await supabase
        .from('course_content')
        .delete()
        .eq('id', contentId);

      if (error) throw error;

      setContent(prev => prev.filter(item => item.id !== contentId));
      toast.success('Content deleted successfully');
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Failed to delete content');
    }
  };

  const notes = content.filter(item => item.content_type === 'note');
  const videos = content.filter(item => item.content_type === 'video');
  const assignments = content.filter(item => item.content_type === 'assignment');

  const renderContentList = (items: CourseContent[], type: string) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{type}</h3>
        <Button onClick={() => navigate(`/teacher/add-content/${courseId}`)}>
          <Plus className="h-4 w-4 mr-2" />
          Add {type.slice(0, -1)}
        </Button>
      </div>
      
      {items.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No {type.toLowerCase()} added yet.</p>
          </CardContent>
        </Card>
      ) : (
        items.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  {item.description && <CardDescription>{item.description}</CardDescription>}
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{item.content_type}</Badge>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => deleteContent(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {item.duration_minutes && (
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Duration: {item.duration_minutes} minutes
                </p>
              </CardContent>
            )}
          </Card>
        ))
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Course not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Link 
            to="/teacher-dashboard"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to dashboard
          </Link>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{course.students_count}</p>
                    <p className="text-sm text-muted-foreground">Students</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{content.length}</p>
                    <p className="text-sm text-muted-foreground">Materials</p>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Tabs defaultValue="notes" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="notes" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Notes
              </TabsTrigger>
              <TabsTrigger value="videos" className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                Videos
              </TabsTrigger>
              <TabsTrigger value="assignments" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Assignments
              </TabsTrigger>
              <TabsTrigger value="grades" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Grades
              </TabsTrigger>
            </TabsList>

            <TabsContent value="notes" className="space-y-4">
              {renderContentList(notes, 'Notes')}
            </TabsContent>

            <TabsContent value="videos" className="space-y-4">
              {renderContentList(videos, 'Videos')}
            </TabsContent>

            <TabsContent value="assignments" className="space-y-4">
              {renderContentList(assignments, 'Assignments')}
            </TabsContent>

            <TabsContent value="grades" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Student Grades</h3>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Grade
                </Button>
              </div>
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No grades recorded yet.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ManageCourse;
