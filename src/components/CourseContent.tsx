
import React, { useState, useEffect } from 'react';
import { FileText, Play, BookOpen, Download, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface CourseContentItem {
  id: string;
  title: string;
  description: string | null;
  content_type: 'note' | 'video' | 'assignment';
  content_url: string | null;
  content_text: string | null;
  duration_minutes: number | null;
  order_index: number;
  is_downloadable: boolean;
  created_at: string;
  updated_at: string;
}

interface Grade {
  id: string;
  assignment_title: string;
  grade: number;
  max_grade: number;
  graded_at: string;
  feedback?: string;
}

interface CourseContentProps {
  courseId: string;
  isTeacher?: boolean;
}

const CourseContent: React.FC<CourseContentProps> = ({ courseId, isTeacher = false }) => {
  const { user } = useAuth();
  const [content, setContent] = useState<CourseContentItem[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('notes');

  useEffect(() => {
    fetchContent();
    if (!isTeacher) {
      fetchGrades();
    }
  }, [courseId, isTeacher]);

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
      toast.error('Failed to load course content');
    } finally {
      setLoading(false);
    }
  };

  const fetchGrades = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('course_grades')
        .select('id, assignment_title, grade, max_grade, graded_at, feedback')
        .eq('course_id', courseId)
        .eq('student_id', user.id);

      if (error) throw error;

      setGrades(data || []);
    } catch (error) {
      console.error('Error fetching grades:', error);
    }
  };

  const notes = content.filter(item => item.content_type === 'note');
  const videos = content.filter(item => item.content_type === 'video');
  const assignments = content.filter(item => item.content_type === 'assignment');

  const renderContentItem = (item: CourseContentItem) => (
    <Card key={item.id} className="mb-4">
      <CardHeader>
        <div className="flex items-center gap-2">
          {item.content_type === 'note' && <FileText className="h-5 w-5 text-blue-500" />}
          {item.content_type === 'video' && <Play className="h-5 w-5 text-red-500" />}
          {item.content_type === 'assignment' && <BookOpen className="h-5 w-5 text-green-500" />}
          <CardTitle className="text-lg">{item.title}</CardTitle>
        </div>
        {item.description && <CardDescription>{item.description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {item.duration_minutes && (
              <span className="text-sm text-muted-foreground">
                {item.duration_minutes} min read
              </span>
            )}
            {item.is_downloadable && (
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            )}
          </div>
          {item.content_url && (
            <Button variant="default" size="sm">
              {item.content_type === 'video' ? 'Watch' : 'View'}
            </Button>
          )}
        </div>
        {item.content_text && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm">{item.content_text.substring(0, 200)}...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Course Notes</h3>
          </div>
          {notes.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No notes available yet.</p>
              </CardContent>
            </Card>
          ) : (
            notes.map(renderContentItem)
          )}
        </TabsContent>

        <TabsContent value="videos" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Course Videos</h3>
          </div>
          {videos.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Play className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No videos available yet.</p>
              </CardContent>
            </Card>
          ) : (
            videos.map(renderContentItem)
          )}
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Assignments</h3>
          </div>
          {assignments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No assignments available yet.</p>
              </CardContent>
            </Card>
          ) : (
            assignments.map(renderContentItem)
          )}
        </TabsContent>

        <TabsContent value="grades" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Your Grades</h3>
          </div>
          {grades.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No grades available yet.</p>
              </CardContent>
            </Card>
          ) : (
            grades.map((grade) => (
              <Card key={grade.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{grade.assignment_title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        {grade.grade}/{grade.max_grade}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {((grade.grade / grade.max_grade) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Graded on {new Date(grade.graded_at).toLocaleDateString()}
                    </div>
                  </div>
                  {grade.feedback && (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-1">Feedback:</p>
                      <p className="text-sm">{grade.feedback}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseContent;
