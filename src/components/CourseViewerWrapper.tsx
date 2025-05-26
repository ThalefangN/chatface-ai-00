
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Users, Clock, ArrowLeft, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import CourseViewer from './CourseViewer';

interface Course {
  id: string;
  title: string;
  description: string;
  subject: string;
  price: number;
  is_free: boolean;
  rating: number;
  students_count: number;
  difficulty_level: string;
  teacher_profiles?: {
    first_name: string;
    last_name: string;
  };
}

const CourseViewerWrapper: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (courseId && user) {
      fetchCourseAndEnrollment();
    }
  }, [courseId, user]);

  const fetchCourseAndEnrollment = async () => {
    if (!courseId || !user) return;

    setLoading(true);
    try {
      // Check if this is a static course ID from TutorSection
      const staticCourses = [
        {
          id: 'static-1',
          title: 'Advanced Mathematics Mastery',
          description: 'Comprehensive BGCSE Mathematics preparation with advanced problem-solving techniques',
          subject: 'Mathematics',
          price: 299,
          is_free: false,
          rating: 4.8,
          students_count: 156,
          difficulty_level: 'advanced',
          teacher_profiles: { first_name: 'Dr. John', last_name: 'Mokone' }
        },
        {
          id: 'static-2',
          title: 'Business Studies Pro',
          description: 'Complete Business Studies curriculum with real-world case studies',
          subject: 'Business Studies',
          price: 199,
          is_free: false,
          rating: 4.7,
          students_count: 89,
          difficulty_level: 'advanced',
          teacher_profiles: { first_name: 'Ms. Sarah', last_name: 'Thabo' }
        },
        {
          id: 'static-3',
          title: 'English Literature Basics',
          description: 'Introduction to English Literature for BGCSE students',
          subject: 'English',
          price: 0,
          is_free: true,
          rating: 4.5,
          students_count: 320,
          difficulty_level: 'beginner',
          teacher_profiles: { first_name: 'Mr. David', last_name: 'Smith' }
        },
        {
          id: 'static-4',
          title: 'Primary Math Excellence',
          description: 'Structured mathematics program for Standard 7 PSLE success',
          subject: 'Mathematics',
          price: 0,
          is_free: true,
          rating: 4.9,
          students_count: 234,
          difficulty_level: 'beginner',
          teacher_profiles: { first_name: 'Mr. Peter', last_name: 'Kgomo' }
        },
        {
          id: 'static-5',
          title: 'Science Foundations',
          description: 'Comprehensive JCE Science preparation with practical experiments',
          subject: 'Science',
          price: 0,
          is_free: true,
          rating: 4.6,
          students_count: 178,
          difficulty_level: 'intermediate',
          teacher_profiles: { first_name: 'Dr. Maria', last_name: 'Sekai' }
        },
        {
          id: 'static-6',
          title: 'Advanced Poetry Analysis',
          description: 'Deep dive into poetic forms and literary devices',
          subject: 'English Literature',
          price: 0,
          is_free: true,
          rating: 4.3,
          students_count: 142,
          difficulty_level: 'advanced',
          teacher_profiles: { first_name: 'StudyBuddy', last_name: 'Instructor' }
        },
        {
          id: 'static-7',
          title: 'Advanced Social Theory',
          description: 'Complex social theories and their applications',
          subject: 'Social Studies',
          price: 0,
          is_free: true,
          rating: 4.4,
          students_count: 98,
          difficulty_level: 'advanced',
          teacher_profiles: { first_name: 'StudyBuddy', last_name: 'Instructor' }
        }
      ];

      const staticCourse = staticCourses.find(c => c.id === courseId);
      
      if (staticCourse) {
        setCourse(staticCourse);
        // For static courses, auto-enroll if free, otherwise show enrollment needed
        setIsEnrolled(staticCourse.is_free);
      } else {
        // Try to fetch from database
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select(`
            *,
            teacher_profiles (
              first_name,
              last_name
            )
          `)
          .eq('id', courseId)
          .single();

        if (courseError) {
          console.error('Error fetching course:', courseError);
          toast.error('Course not found');
          navigate('/courses');
          return;
        }

        setCourse(courseData);

        // Check enrollment status
        const { data: enrollmentData } = await supabase
          .from('course_enrollments')
          .select('*')
          .eq('course_id', courseId)
          .eq('user_id', user.id)
          .eq('is_active', true)
          .single();

        setIsEnrolled(!!enrollmentData);
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
      toast.error('Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollment = async () => {
    if (!course || !user) return;

    if (course.is_free) {
      setEnrolling(true);
      try {
        const { error } = await supabase
          .from('course_enrollments')
          .upsert({
            course_id: course.id,
            user_id: user.id,
            is_active: true,
            enrolled_at: new Date().toISOString()
          });

        if (error) throw error;

        setIsEnrolled(true);
        toast.success('Successfully enrolled in course!');
      } catch (error) {
        console.error('Error enrolling in course:', error);
        toast.error('Failed to enroll in course');
      } finally {
        setEnrolling(false);
      }
    } else {
      // For paid courses, redirect to payment or show payment modal
      toast.info('Payment functionality coming soon!');
    }
  };

  const getInstructorName = () => {
    if (course?.teacher_profiles) {
      return `${course.teacher_profiles.first_name} ${course.teacher_profiles.last_name}`;
    }
    return 'StudyBuddy Instructor';
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Course Not Found</h1>
        <p className="text-gray-600">The course you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/courses')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>
      </div>
    );
  }

  // If enrolled or free course, show the course content
  if (isEnrolled || course.is_free) {
    return <CourseViewer courseId={course.id} />;
  }

  // Show enrollment page for paid courses
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Button 
          onClick={() => navigate('/courses')} 
          variant="outline" 
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>

        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl mb-2">{course.title}</CardTitle>
                <p className="text-blue-100 mb-4">{course.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{course.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course.students_count} students</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {course.subject}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                {course.is_free ? (
                  <Badge className="bg-green-500 text-white text-lg px-3 py-1">
                    FREE
                  </Badge>
                ) : (
                  <div className="text-2xl font-bold">P{course.price}</div>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Course Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Instructor:</span>
                    <span className="font-medium">{getInstructorName()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subject:</span>
                    <span className="font-medium">{course.subject}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Difficulty:</span>
                    <Badge className={getDifficultyColor(course.difficulty_level)}>
                      {course.difficulty_level}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Students Enrolled:</span>
                    <span className="font-medium">{course.students_count}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">What You'll Learn</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <BookOpen className="w-4 h-4 mt-0.5 text-blue-500" />
                    <span>Comprehensive course materials and resources</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BookOpen className="w-4 h-4 mt-0.5 text-blue-500" />
                    <span>Interactive lessons and practical exercises</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BookOpen className="w-4 h-4 mt-0.5 text-blue-500" />
                    <span>Assessments and progress tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BookOpen className="w-4 h-4 mt-0.5 text-blue-500" />
                    <span>Expert guidance and support</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleEnrollment}
                  disabled={enrolling}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
                >
                  {enrolling ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Enrolling...
                    </>
                  ) : course.is_free ? (
                    'Start Free Course'
                  ) : (
                    `Enroll Now - P${course.price}`
                  )}
                </Button>
                {!course.is_free && (
                  <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                    Preview Course
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CourseViewerWrapper;
