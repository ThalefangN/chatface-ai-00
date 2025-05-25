
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Edit, Trash2, Download, Video, FileText, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTeacherAuth } from '@/contexts/TeacherAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Course {
  id: string;
  title: string;
  subject: string;
  description: string;
  price: number;
  is_free: boolean;
  rating: number;
  students_count: number;
  materials_count: number;
  difficulty_level: string;
}

interface CourseContent {
  id: string;
  title: string;
  description: string;
  content_type: 'note' | 'video' | 'assignment';
  content_url?: string;
  content_text?: string;
  duration_minutes?: number;
  order_index: number;
  is_downloadable: boolean;
  created_at: string;
}

interface Grade {
  id: string;
  student_id: string;
  assignment_title: string;
  grade: number;
  max_grade: number;
  feedback?: string;
  graded_at: string;
}

const ManageCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { teacherProfile } = useTeacherAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [courseContent, setCourseContent] = useState<CourseContent[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('notes');

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const fetchCourseData = async () => {
    if (!courseId || !teacherProfile?.id) return;

    try {
      // Fetch course details
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .eq('teacher_id', teacherProfile.id)
        .single();

      if (courseError) {
        console.error('Error fetching course:', courseError);
        toast.error('Course not found or access denied');
        navigate('/teacher-dashboard');
        return;
      }

      setCourse(courseData);

      // Fetch course content
      const { data: contentData, error: contentError } = await supabase
        .from('course_content')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index');

      if (contentError) {
        console.error('Error fetching course content:', contentError);
      } else {
        setCourseContent(contentData || []);
      }

      // Fetch grades
      const { data: gradesData, error: gradesError } = await supabase
        .from('course_grades')
        .select('*')
        .eq('course_id', courseId)
        .order('graded_at', { ascending: false });

      if (gradesError) {
        console.error('Error fetching grades:', gradesError);
      } else {
        setGrades(gradesData || []);
      }

    } catch (error) {
      console.error('Error fetching course data:', error);
      toast.error('Failed to load course data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddContent = (contentType: 'note' | 'video' | 'assignment') => {
    navigate(`/teacher/add-content/${courseId}?type=${contentType}`);
  };

  const deleteContent = async (contentId: string) => {
    try {
      const { error } = await supabase
        .from('course_content')
        .delete()
        .eq('id', contentId);

      if (error) {
        console.error('Error deleting content:', error);
        toast.error('Failed to delete content');
        return;
      }

      toast.success('Content deleted successfully');
      fetchCourseData();
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Failed to delete content');
    }
  };

  const getContentByType = (type: 'note' | 'video' | 'assignment') => {
    return courseContent.filter(content => content.content_type === type);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Course not found
          </h2>
          <Button onClick={() => navigate('/teacher-dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/teacher-dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Manage Course: {course.title}
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl mb-2">{course.title}</CardTitle>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{course.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{course.subject}</Badge>
                    <Badge variant="outline">{course.difficulty_level}</Badge>
                    {course.is_free ? (
                      <Badge className="bg-green-100 text-green-800">Free</Badge>
                    ) : (
                      <Badge variant="outline">P{course.price}</Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{course.students_count}</div>
                  <div className="text-sm text-gray-500">Students Enrolled</div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Content Management Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Notes ({getContentByType('note').length})
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              Videos ({getContentByType('video').length})
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Assignments ({getContentByType('assignment').length})
            </TabsTrigger>
            <TabsTrigger value="grades" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Grades ({grades.length})
            </TabsTrigger>
          </TabsList>

          {/* Notes Tab */}
          <TabsContent value="notes" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Course Notes</h3>
              <Button onClick={() => handleAddContent('note')}>
                <Plus className="w-4 h-4 mr-2" />
                Add Note
              </Button>
            </div>
            <div className="space-y-3">
              {getContentByType('note').map((note) => (
                <Card key={note.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{note.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {note.description}
                        </p>
                        {note.duration_minutes && (
                          <p className="text-xs text-gray-500 mt-1">
                            {note.duration_minutes} min read
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {note.is_downloadable && (
                          <Badge variant="outline" className="text-xs">
                            <Download className="w-3 h-3 mr-1" />
                            Downloadable
                          </Badge>
                        )}
                        <Button size="sm" variant="outline">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => deleteContent(note.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {getContentByType('note').length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No notes added yet. Click "Add Note" to create your first note.
                </div>
              )}
            </div>
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Video Lessons</h3>
              <Button onClick={() => handleAddContent('video')}>
                <Plus className="w-4 h-4 mr-2" />
                Add Video
              </Button>
            </div>
            <div className="space-y-3">
              {getContentByType('video').map((video) => (
                <Card key={video.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                          <Video className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{video.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {video.description}
                          </p>
                          {video.duration_minutes && (
                            <p className="text-xs text-gray-500 mt-1">
                              {video.duration_minutes} minutes
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => deleteContent(video.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {getContentByType('video').length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No videos added yet. Click "Add Video" to upload your first video.
                </div>
              )}
            </div>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Assignments</h3>
              <Button onClick={() => handleAddContent('assignment')}>
                <Plus className="w-4 h-4 mr-2" />
                Add Assignment
              </Button>
            </div>
            <div className="space-y-3">
              {getContentByType('assignment').map((assignment) => (
                <Card key={assignment.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{assignment.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {assignment.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => deleteContent(assignment.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {getContentByType('assignment').length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No assignments added yet. Click "Add Assignment" to create your first assignment.
                </div>
              )}
            </div>
          </TabsContent>

          {/* Grades Tab */}
          <TabsContent value="grades" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Student Grades</h3>
            </div>
            <div className="space-y-3">
              {grades.map((grade) => (
                <Card key={grade.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{grade.assignment_title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Student ID: {grade.student_id}
                        </p>
                        {grade.feedback && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Feedback: {grade.feedback}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          <span className={grade.grade >= grade.max_grade * 0.8 ? 'text-green-600' : grade.grade >= grade.max_grade * 0.6 ? 'text-yellow-600' : 'text-red-600'}>
                            {grade.grade}
                          </span>
                          <span className="text-gray-500">/{grade.max_grade}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {Math.round((grade.grade / grade.max_grade) * 100)}%
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {grades.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No grades recorded yet.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ManageCourse;
