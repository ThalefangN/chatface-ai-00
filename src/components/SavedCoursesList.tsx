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

// Static sample courses that will always be available
const getStaticSampleCourses = (): SavedCourse[] => [
  {
    id: 'sample-1',
    name: 'Mathematics Junior Certificate (JCE)',
    grade_level: 'Junior Certificate (JCE)',
    description: 'Comprehensive mathematics course for JCE preparation',
    total_lessons: 6,
    current_lesson: 1,
    created_at: '2025-05-26',
    objectives: [
      'Understand algebraic expressions and equations',
      'Master geometric principles and calculations',
      'Solve quadratic equations and inequalities',
      'Apply trigonometric ratios and functions',
      'Analyze statistical data and probability',
      'Demonstrate problem-solving techniques'
    ],
    hasGeneratedContent: true,
    completedLessons: [1]
  },
  {
    id: 'sample-2',
    name: 'Mathematics Fundamentals',
    grade_level: 'Junior Certificate (JCE)',
    description: 'Essential mathematical concepts and foundations',
    total_lessons: 6,
    current_lesson: 1,
    created_at: '2025-05-26',
    objectives: [
      'Master basic arithmetic operations',
      'Understand fractions and decimals',
      'Learn basic algebraic concepts',
      'Explore geometric shapes and properties',
      'Introduction to data handling',
      'Develop logical reasoning skills'
    ],
    hasGeneratedContent: true,
    completedLessons: [1]
  }
];

const SavedCoursesList: React.FC<SavedCoursesListProps> = ({ onCourseSelect }) => {
  const [courses, setCourses] = useState<SavedCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Always initialize with static data first
    if (!isInitialized) {
      const staticCourses = getStaticSampleCourses();
      setCourses(staticCourses);
      setLoading(false);
      setIsInitialized(true);
    }
    
    // Then try to fetch real data
    fetchSavedCourses();
  }, [isInitialized]);

  const fetchSavedCourses = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        // Keep static courses if no user
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

      if (coursesError) {
        console.warn('Error fetching courses, using static data:', coursesError);
        return;
      }

      if (coursesData && coursesData.length > 0) {
        // Process real courses
        const coursesWithContent = await Promise.all(
          coursesData.map(async (course) => {
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

        // Combine real courses with static courses
        const staticCourses = getStaticSampleCourses();
        const allCourses = [...coursesWithContent, ...staticCourses];
        setCourses(allCourses);
      }
    } catch (error) {
      console.warn('Error fetching saved courses, using static data:', error);
      // Static courses are already set, so no need to do anything
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

  const calculateProgress = (course: SavedCourse) => {
    if (!course.completedLessons || course.completedLessons.length === 0) {
      return course.current_lesson > 1 ? ((course.current_lesson - 1) / course.total_lessons) * 100 : 0;
    }
    return (course.completedLessons.length / course.total_lessons) * 100;
  };

  // Show loading only briefly, then always show content
  if (loading && !isInitialized) {
    return (
      <div className="space-y-4 w-full">
        <h3 className="text-lg font-semibold mb-4">Your Saved Courses</h3>
        <div className="grid gap-4">
          {[1, 2].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Your Saved Courses</h3>
        <Badge variant="secondary" className="text-sm">
          ({courses.length})
        </Badge>
      </div>
      
      {courses.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No saved courses yet
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Create your first AI-powered course to get started
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base md:text-lg mb-1">
                      {course.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Badge variant="outline" className="text-xs">
                        {course.grade_level}
                      </Badge>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Created {formatDate(course.created_at)}
                      </span>
                    </div>
                  </div>
                  {course.hasGeneratedContent && (
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Ready
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {course.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {course.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      Lesson {course.current_lesson} of {course.total_lessons}
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      {course.objectives.length} objectives
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">
                      {course.completedLessons ? course.completedLessons.length : 0} lessons generated
                    </span>
                    <span className="font-medium">
                      Progress: {Math.round(calculateProgress(course))}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${calculateProgress(course)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleContinueStudying(course)}
                    className="flex-1"
                    size="sm"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Continue Studying
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedCoursesList;
