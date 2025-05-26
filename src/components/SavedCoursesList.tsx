
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Play, Calendar, Clock, CheckCircle, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SavedCourse {
  id: string;
  name: string;
  grade_level: string;
  description: string | null;
  total_lessons: number;
  current_lesson: number;
  created_at: string;
  objectives: string[];
  hasGeneratedContent?: boolean;
  completedLessons?: number[];
}

interface SavedCoursesListProps {
  onCourseSelect: (course: any) => void;
}

const SavedCoursesList: React.FC<SavedCoursesListProps> = ({ onCourseSelect }) => {
  const [courses, setCourses] = useState<SavedCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedCourses();
  }, []);

  const fetchSavedCourses = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setLoading(false);
        return;
      }

      // Fetch courses with their objectives and lesson content
      const { data: coursesData, error: coursesError } = await supabase
        .from('ai_courses')
        .select(`
          *,
          ai_course_objectives(objective_text, order_index)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (coursesError) throw coursesError;

      // For each course, check if it has generated lesson content
      const coursesWithContent = await Promise.all(
        (coursesData || []).map(async (course) => {
          // Check for existing lesson parts
          const { data: lessonParts } = await supabase
            .from('ai_lesson_parts')
            .select('lesson_number, part_number')
            .eq('course_id', course.id);

          const hasGeneratedContent = lessonParts && lessonParts.length > 0;
          
          // Get unique lesson numbers that have content
          const completedLessons = lessonParts 
            ? [...new Set(lessonParts.map(part => part.lesson_number))]
            : [];

          return {
            ...course,
            objectives: course.ai_course_objectives
              ?.sort((a, b) => a.order_index - b.order_index)
              .map(obj => obj.objective_text) || [],
            hasGeneratedContent,
            completedLessons
          };
        })
      );

      setCourses(coursesWithContent);
    } catch (error) {
      console.error('Error fetching saved courses:', error);
      toast.error('Failed to load saved courses');
    } finally {
      setLoading(false);
    }
  };

  const handleContinueStudying = (course: SavedCourse) => {
    // Transform to the expected Course interface
    const courseForViewer = {
      id: course.id,
      name: course.name,
      gradeLevel: course.grade_level,
      objectives: course.objectives,
      currentLesson: course.current_lesson,
      totalLessons: course.total_lessons
    };
    
    onCourseSelect(courseForViewer);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-4 w-full">
        <h3 className="text-lg font-semibold mb-4">Your Saved Courses</h3>
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-8 w-full">
        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Saved Courses</h3>
        <p className="text-gray-500 mb-4">Create your first AI-generated course to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5" />
        Your Saved Courses ({courses.length})
      </h3>
      
      <div className="grid gap-4">
        {courses.map(course => (
          <Card key={course.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2 flex items-center gap-2">
                    {course.name}
                    {course.hasGeneratedContent && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <Badge variant="secondary">{course.grade_level}</Badge>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Created {formatDate(course.created_at)}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              {course.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>
              )}
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Lesson {course.current_lesson} of {course.total_lessons}
                  </div>
                  <div>
                    {course.objectives.length} objectives
                  </div>
                  {course.hasGeneratedContent && (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      {course.completedLessons?.length || 0} lessons generated
                    </div>
                  )}
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-1">
                    Progress: {Math.round((course.current_lesson / course.total_lessons) * 100)}%
                  </div>
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all"
                      style={{ width: `${(course.current_lesson / course.total_lessons) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => handleContinueStudying(course)}
                className="w-full"
                size="sm"
              >
                <Play className="w-4 h-4 mr-2" />
                {course.hasGeneratedContent ? 'Continue Studying' : 'Start Learning'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SavedCoursesList;
