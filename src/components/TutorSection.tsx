import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, FileText, Trophy, Star, Users, DollarSign, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useTeacherAuth } from '@/contexts/TeacherAuthContext';

interface Course {
  id: string;
  title: string;
  subject: string;
  teacher_profiles?: {
    first_name: string;
    last_name: string;
  };
  price: number;
  is_free: boolean;
  rating: number;
  students_count: number;
  materials_count: number;
  description: string;
  difficulty_level: string;
}

interface GradeLevel {
  id: string;
  name: string;
  fullName: string;
  description: string;
  icon: React.ElementType;
  color: string;
  courses: Course[];
  totalCourses: number;
  freeCourses: number;
  premiumCourses: number;
}

// Static course data that will always be available
const getStaticCourses = (): Course[] => [
  {
    id: 'static-1',
    title: 'Advanced Mathematics Mastery',
    subject: 'Mathematics',
    teacher_profiles: { first_name: 'Dr. John', last_name: 'Mokone' },
    price: 299,
    is_free: false,
    rating: 4.8,
    students_count: 156,
    materials_count: 45,
    description: 'Comprehensive BGCSE Mathematics preparation with advanced problem-solving techniques',
    difficulty_level: 'advanced'
  },
  {
    id: 'static-2',
    title: 'Business Studies Pro',
    subject: 'Business Studies',
    teacher_profiles: { first_name: 'Ms. Sarah', last_name: 'Thabo' },
    price: 199,
    is_free: false,
    rating: 4.7,
    students_count: 89,
    materials_count: 32,
    description: 'Complete Business Studies curriculum with real-world case studies',
    difficulty_level: 'advanced'
  },
  {
    id: 'static-3',
    title: 'English Literature Basics',
    subject: 'English',
    teacher_profiles: { first_name: 'Mr. David', last_name: 'Smith' },
    price: 0,
    is_free: true,
    rating: 4.5,
    students_count: 320,
    materials_count: 28,
    description: 'Introduction to English Literature for BGCSE students',
    difficulty_level: 'beginner'
  },
  {
    id: 'static-4',
    title: 'Primary Math Excellence',
    subject: 'Mathematics',
    teacher_profiles: { first_name: 'Mr. Peter', last_name: 'Kgomo' },
    price: 0,
    is_free: true,
    rating: 4.9,
    students_count: 234,
    materials_count: 28,
    description: 'Structured mathematics program for Standard 7 PSLE success',
    difficulty_level: 'beginner'
  },
  {
    id: 'static-5',
    title: 'Science Foundations',
    subject: 'Science',
    teacher_profiles: { first_name: 'Dr. Maria', last_name: 'Sekai' },
    price: 0,
    is_free: true,
    rating: 4.6,
    students_count: 178,
    materials_count: 35,
    description: 'Comprehensive JCE Science preparation with practical experiments',
    difficulty_level: 'intermediate'
  },
  {
    id: 'setswana-language',
    title: 'Setswana Language',
    subject: 'Setswana',
    teacher_profiles: { first_name: 'Mme Mpho', last_name: 'Kebonang' },
    price: 0,
    is_free: true,
    rating: 4.5,
    students_count: 187,
    materials_count: 25,
    description: 'Free Setswana language course for PSLE preparation',
    difficulty_level: 'beginner'
  },
  {
    id: 'social-studies',
    title: 'Social Studies',
    subject: 'Social Studies',
    teacher_profiles: { first_name: 'Mr. Gaolathe', last_name: 'Mmolawa' },
    price: 0,
    is_free: true,
    rating: 4.4,
    students_count: 98,
    materials_count: 30,
    description: 'Free Social Studies course with interactive content',
    difficulty_level: 'intermediate'
  }
];

const TutorSection = () => {
  const [selectedGrade, setSelectedGrade] = useState<string>('bgcse');
  const [gradeLevels, setGradeLevels] = useState<GradeLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { teacherProfile } = useTeacherAuth();

  useEffect(() => {
    // Always initialize with static data first to prevent loading forever
    initializeWithStaticData();
    
    // Then try to fetch additional data from database
    fetchAdditionalCourses();
  }, []);

  const initializeWithStaticData = () => {
    const staticCourses = getStaticCourses();
    
    // Group courses by difficulty/grade level and limit to 3 per grade
    const bgcseCourses = staticCourses.filter(course => 
      course.difficulty_level === 'advanced' || 
      ['Mathematics', 'English', 'Business Studies', 'English Literature'].includes(course.subject)
    );
    
    const psleCourses = staticCourses.filter(course => 
      course.difficulty_level === 'beginner' || 
      (course.subject === 'Mathematics' && course.title.includes('Primary')) ||
      course.subject === 'Setswana'
    );
    
    const jceCourses = staticCourses.filter(course => 
      course.difficulty_level === 'intermediate' || 
      ['Science', 'Social Studies'].includes(course.subject)
    );

    const initialGradeLevels = [
      {
        id: 'bgcse',
        name: 'BGCSE',
        fullName: 'Botswana General Certificate of Secondary Education',
        description: 'Form 4-5 students preparing for national examinations',
        icon: GraduationCap,
        color: 'bg-blue-500',
        courses: bgcseCourses.slice(0, 3),
        totalCourses: bgcseCourses.length,
        freeCourses: bgcseCourses.filter(c => c.is_free).length,
        premiumCourses: bgcseCourses.filter(c => !c.is_free).length
      },
      {
        id: 'psle',
        name: 'PSLE',
        fullName: 'Primary School Leaving Examination',
        description: 'Standard 7 students preparing for primary school completion',
        icon: BookOpen,
        color: 'bg-green-500',
        courses: psleCourses.slice(0, 3),
        totalCourses: psleCourses.length,
        freeCourses: psleCourses.filter(c => c.is_free).length,
        premiumCourses: psleCourses.filter(c => !c.is_free).length
      },
      {
        id: 'jce',
        name: 'JCE',
        fullName: 'Junior Certificate Examination',
        description: 'Form 3 students preparing for junior secondary completion',
        icon: Trophy,
        color: 'bg-purple-500',
        courses: jceCourses.slice(0, 3),
        totalCourses: jceCourses.length,
        freeCourses: jceCourses.filter(c => c.is_free).length,
        premiumCourses: jceCourses.filter(c => !c.is_free).length
      }
    ];

    setGradeLevels(initialGradeLevels);
    setLoading(false);
  };

  const fetchAdditionalCourses = async () => {
    try {
      // Try to fetch from database but don't block if it fails
      const { data: courses } = await supabase
        .from('courses')
        .select(`
          *,
          teacher_profiles (
            first_name,
            last_name
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (courses && courses.length > 0) {
        // Merge database courses with static courses
        const staticCourses = getStaticCourses();
        const allCourses = [...staticCourses, ...courses];
        
        // Re-group with combined data and limit to 3 per grade
        const bgcseCourses = allCourses.filter(course => 
          course.difficulty_level === 'advanced' || 
          ['Mathematics', 'English', 'Business Studies', 'English Literature'].includes(course.subject)
        );
        
        const psleCourses = allCourses.filter(course => 
          course.difficulty_level === 'beginner' || 
          (course.subject === 'Mathematics' && course.title.includes('Primary')) ||
          course.subject === 'Setswana'
        );
        
        const jceCourses = allCourses.filter(course => 
          course.difficulty_level === 'intermediate' || 
          ['Science', 'Social Studies'].includes(course.subject)
        );

        const updatedGradeLevels = [
          {
            id: 'bgcse',
            name: 'BGCSE',
            fullName: 'Botswana General Certificate of Secondary Education',
            description: 'Form 4-5 students preparing for national examinations',
            icon: GraduationCap,
            color: 'bg-blue-500',
            courses: bgcseCourses.slice(0, 3),
            totalCourses: bgcseCourses.length,
            freeCourses: bgcseCourses.filter(c => c.is_free).length,
            premiumCourses: bgcseCourses.filter(c => !c.is_free).length
          },
          {
            id: 'psle',
            name: 'PSLE',
            fullName: 'Primary School Leaving Examination',
            description: 'Standard 7 students preparing for primary school completion',
            icon: BookOpen,
            color: 'bg-green-500',
            courses: psleCourses.slice(0, 3),
            totalCourses: psleCourses.length,
            freeCourses: psleCourses.filter(c => c.is_free).length,
            premiumCourses: psleCourses.filter(c => !c.is_free).length
          },
          {
            id: 'jce',
            name: 'JCE',
            fullName: 'Junior Certificate Examination',
            description: 'Form 3 students preparing for junior secondary completion',
            icon: Trophy,
            color: 'bg-purple-500',
            courses: jceCourses.slice(0, 3),
            totalCourses: jceCourses.length,
            freeCourses: jceCourses.filter(c => c.is_free).length,
            premiumCourses: jceCourses.filter(c => !c.is_free).length
          }
        ];

        setGradeLevels(updatedGradeLevels);
      }
    } catch (error) {
      console.warn('Failed to fetch additional courses from database, using static data:', error);
      // Static data is already loaded, so we don't need to do anything
    }
  };

  const currentGrade = gradeLevels.find(grade => grade.id === selectedGrade);

  const handleCourseAction = async (course: Course) => {
    if (teacherProfile) {
      navigate(`/teacher/manage-course/${course.id}`);
      return;
    }

    if (course.is_free) {
      try {
        if (user) {
          const { error } = await supabase
            .from('course_enrollments')
            .upsert({
              course_id: course.id,
              user_id: user.id,
              is_active: true
            });

          if (error) {
            console.error('Error enrolling in course:', error);
          }
        }

        // Map course IDs to their specific routes like the courses page does
        const courseRoutes: Record<string, string> = {
          'setswana-language': '/courses/setswana-language',
          'social-studies': '/courses/social-studies',
          'static-3': '/courses/english-literature'
        };

        const route = courseRoutes[course.id];
        if (route) {
          navigate(route);
        } else {
          // For other courses, navigate to generic course viewer
          navigate(`/courses/view/${course.id}`);
        }
      } catch (error) {
        console.error('Error enrolling in course:', error);
      }
    } else {
      // For paid courses, navigate to enrollment/payment page
      navigate(`/courses/enroll/${course.id}`);
    }
  };

  const handleViewMoreCourses = () => {
    navigate('/courses');
  };

  const getInstructorName = (course: Course) => {
    if (course.teacher_profiles) {
      return `${course.teacher_profiles.first_name} ${course.teacher_profiles.last_name}`;
    }
    return 'StudyBuddy Instructor';
  };

  const getActionButtonText = (course: Course) => {
    if (teacherProfile) {
      return 'Manage Course';
    }
    return course.is_free ? 'Start Free Course' : `Enroll for P${course.price}`;
  };

  // Show loading only for a brief moment, then always show content
  if (loading) {
    return (
      <div className="border-t border-gray-200 dark:border-gray-700 p-6">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 p-3 sm:p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
            Tutor Section
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
          Browse courses and study materials by grade level for Botswana syllabus
        </p>
      </motion.div>

      <Tabs value={selectedGrade} onValueChange={setSelectedGrade} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          {gradeLevels.map((grade) => (
            <TabsTrigger 
              key={grade.id} 
              value={grade.id}
              className="flex items-center gap-2 text-xs sm:text-sm"
            >
              <grade.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{grade.name}</span>
              <span className="sm:hidden">{grade.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {gradeLevels.map((grade) => (
          <TabsContent key={grade.id} value={grade.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <Card className="border border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`${grade.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                      <grade.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base sm:text-lg">{grade.fullName}</CardTitle>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {grade.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {grade.totalCourses} Courses Available
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {grade.freeCourses} Free Courses
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {grade.premiumCourses} Premium Courses
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
              {grade.courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-sm sm:text-base line-clamp-2 mb-1">
                            {course.title}
                          </CardTitle>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            by {getInstructorName(course)}
                          </p>
                        </div>
                        {course.is_free ? (
                          <Badge className="bg-green-100 text-green-800 text-xs">Free</Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">P{course.price}</Badge>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {course.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{course.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{course.students_count}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          <span>{course.materials_count}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {course.subject}
                        </Badge>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" className="h-7 px-2">
                            <Download className="w-3 h-3 mr-1" />
                            Materials
                          </Button>
                        </div>
                      </div>

                      <Button 
                        className="w-full text-xs sm:text-sm h-8" 
                        variant={course.is_free && !teacherProfile ? "default" : "outline"}
                        onClick={() => handleCourseAction(course)}
                      >
                        {getActionButtonText(course)}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="mt-6 text-center py-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                More courses available
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Explore courses from all grade levels and subjects
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleViewMoreCourses}
              >
                View All Courses
              </Button>
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default TutorSection;
