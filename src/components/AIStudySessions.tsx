import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, BookOpen, Brain, Trophy, Star, Users, Clock, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CourseViewer from '@/components/CourseViewer';

interface Course {
  id: string;
  name: string;
  instructor: string;
  rating: number;
  students: number;
  duration: string;
  level: string;
  subject: string;
  description: string;
  features: string[];
}

const AIStudySessions = () => {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const courses: Course[] = [
    {
      id: 'static-3',
      name: 'English Literature Basics',
      instructor: 'Mr. David Smith',
      rating: 4.5,
      students: 320,
      duration: '8 weeks',
      level: 'BGCSE',
      subject: 'English Literature',
      description: 'Introduction to English Literature for BGCSE students with comprehensive analysis techniques',
      features: ['Interactive lessons', 'Practice exercises', 'Progress tracking', 'AI tutoring']
    },
    {
      id: 'math-advanced',
      name: 'Advanced Mathematics',
      instructor: 'Dr. Sarah Molefe',
      rating: 4.8,
      students: 156,
      duration: '12 weeks',
      level: 'BGCSE',
      subject: 'Mathematics',
      description: 'Comprehensive BGCSE Mathematics preparation with advanced problem-solving techniques',
      features: ['Step-by-step solutions', 'Practice tests', 'Video explanations', 'Progress analytics']
    },
    {
      id: 'science-foundation',
      name: 'Science Foundations',
      instructor: 'Prof. Keabetswe Phiri',
      rating: 4.6,
      students: 234,
      duration: '10 weeks',
      level: 'JCE',
      subject: 'Science',
      description: 'Build strong foundations in general science with practical experiments and theory',
      features: ['Virtual labs', 'Interactive simulations', 'Practical guides', 'Assessment tools']
    }
  ];

  if (selectedCourse) {
    return <CourseViewer courseId={selectedCourse} />;
  }

  return (
    <div className="space-y-6">
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            AI Study Sessions
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Personalized learning experiences powered by artificial intelligence
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                      {course.name}
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      by {course.instructor}
                    </p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">AI Powered</Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {course.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{course.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{course.students}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    <Badge variant="secondary" className="text-xs">
                      {course.subject}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {course.level}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Award className="w-3 h-3" />
                    <span>Features:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {course.features.map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => setSelectedCourse(course.id)}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start AI Session
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AIStudySessions;
