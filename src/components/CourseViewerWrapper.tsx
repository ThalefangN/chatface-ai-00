
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import CourseViewer from './CourseViewer';
import { toast } from 'sonner';

const CourseViewerWrapper = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) return;

      try {
        // Try to fetch from database first
        const { data: dbCourse } = await supabase
          .from('courses')
          .select('*')
          .eq('id', courseId)
          .single();

        if (dbCourse) {
          // Transform database course to expected format
          setCourse({
            id: dbCourse.id,
            name: dbCourse.title,
            gradeLevel: dbCourse.difficulty_level || 'Intermediate',
            objectives: [
              'Understand fundamental concepts and principles',
              'Apply knowledge through practical exercises',
              'Develop critical thinking and analysis skills',
              'Prepare for assessments and examinations',
              'Connect learning to real-world applications',
              'Build problem-solving capabilities'
            ],
            currentLesson: 1,
            totalLessons: 12
          });
        } else {
          // Fallback to static course data
          const staticCourses = {
            'static-1': {
              id: 'static-1',
              name: 'Advanced Mathematics Mastery',
              gradeLevel: 'BGCSE',
              objectives: [
                'Master advanced algebraic concepts and equations',
                'Develop proficiency in calculus and derivatives',
                'Apply geometric principles to complex problems',
                'Understand statistical analysis and probability',
                'Prepare comprehensively for BGCSE examinations',
                'Build confidence in mathematical problem-solving'
              ],
              currentLesson: 1,
              totalLessons: 15
            },
            'static-2': {
              id: 'static-2',
              name: 'Business Studies Pro',
              gradeLevel: 'BGCSE',
              objectives: [
                'Understand business fundamentals and principles',
                'Learn marketing strategies and implementation',
                'Develop financial literacy and accounting skills',
                'Explore entrepreneurship and business planning',
                'Analyze case studies from Botswana businesses',
                'Prepare for BGCSE Business Studies examination'
              ],
              currentLesson: 1,
              totalLessons: 12
            },
            'static-3': {
              id: 'static-3',
              name: 'English Literature Basics',
              gradeLevel: 'BGCSE',
              objectives: [
                'Analyze literary texts and themes effectively',
                'Develop critical reading and interpretation skills',
                'Understand poetic devices and literary techniques',
                'Explore diverse cultural perspectives in literature',
                'Enhance written expression and essay writing',
                'Prepare for English Literature assessments'
              ],
              currentLesson: 1,
              totalLessons: 10
            }
          };

          const staticCourse = staticCourses[courseId];
          if (staticCourse) {
            setCourse(staticCourse);
          } else {
            toast.error('Course not found');
            navigate('/courses');
            return;
          }
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        toast.error('Failed to load course');
        navigate('/courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, navigate]);

  const handleBack = () => {
    navigate('/courses');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Course not found</p>
      </div>
    );
  }

  return <CourseViewer course={course} onBack={handleBack} />;
};

export default CourseViewerWrapper;
