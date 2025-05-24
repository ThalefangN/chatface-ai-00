
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, FileText, Trophy, Star, Users, DollarSign, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Course {
  id: string;
  title: string;
  subject: string;
  instructor: string;
  price: number;
  isFree: boolean;
  rating: number;
  students: number;
  materials: number;
  description: string;
  level: string;
}

interface GradeLevel {
  id: string;
  name: string;
  fullName: string;
  description: string;
  icon: React.ElementType;
  color: string;
  courses: Course[];
}

const TutorSection = () => {
  const [selectedGrade, setSelectedGrade] = useState<string>('bgcse');

  const gradeLevels: GradeLevel[] = [
    {
      id: 'bgcse',
      name: 'BGCSE',
      fullName: 'Botswana General Certificate of Secondary Education',
      description: 'Form 4-5 students preparing for national examinations',
      icon: GraduationCap,
      color: 'bg-blue-500',
      courses: [
        {
          id: '1',
          title: 'Advanced Mathematics',
          subject: 'Mathematics',
          instructor: 'Mr. Kgosi Motswana',
          price: 299,
          isFree: false,
          rating: 4.8,
          students: 156,
          materials: 45,
          description: 'Comprehensive BGCSE Mathematics preparation covering all topics',
          level: 'BGCSE'
        },
        {
          id: '2',
          title: 'English Literature',
          subject: 'English',
          instructor: 'Ms. Bontle Ramotswe',
          price: 0,
          isFree: true,
          rating: 4.6,
          students: 203,
          materials: 32,
          description: 'Free BGCSE English Literature course with past papers',
          level: 'BGCSE'
        },
        {
          id: '3',
          title: 'Business Studies',
          subject: 'Business',
          instructor: 'Mr. Thabo Seretse',
          price: 199,
          isFree: false,
          rating: 4.7,
          students: 89,
          materials: 28,
          description: 'Complete Business Studies curriculum for BGCSE students',
          level: 'BGCSE'
        }
      ]
    },
    {
      id: 'psle',
      name: 'PSLE',
      fullName: 'Primary School Leaving Examination',
      description: 'Standard 7 students preparing for primary school completion',
      icon: BookOpen,
      color: 'bg-green-500',
      courses: [
        {
          id: '4',
          title: 'Primary Mathematics',
          subject: 'Mathematics',
          instructor: 'Mrs. Neo Molefe',
          price: 149,
          isFree: false,
          rating: 4.9,
          students: 234,
          materials: 38,
          description: 'Fun and engaging mathematics for Standard 7 students',
          level: 'PSLE'
        },
        {
          id: '5',
          title: 'Setswana Language',
          subject: 'Setswana',
          instructor: 'Mme Mpho Kebonang',
          price: 0,
          isFree: true,
          rating: 4.5,
          students: 187,
          materials: 25,
          description: 'Free Setswana language course for PSLE preparation',
          level: 'PSLE'
        }
      ]
    },
    {
      id: 'jce',
      name: 'JCE',
      fullName: 'Junior Certificate Examination',
      description: 'Form 3 students preparing for junior secondary completion',
      icon: Trophy,
      color: 'bg-purple-500',
      courses: [
        {
          id: '6',
          title: 'General Science',
          subject: 'Science',
          instructor: 'Dr. Keabetswe Phiri',
          price: 249,
          isFree: false,
          rating: 4.7,
          students: 145,
          materials: 52,
          description: 'Comprehensive science course covering all JCE topics',
          level: 'JCE'
        },
        {
          id: '7',
          title: 'Social Studies',
          subject: 'Social Studies',
          instructor: 'Mr. Gaolathe Mmolawa',
          price: 0,
          isFree: true,
          rating: 4.4,
          students: 198,
          materials: 30,
          description: 'Free Social Studies course with interactive content',
          level: 'JCE'
        }
      ]
    }
  ];

  const currentGrade = gradeLevels.find(grade => grade.id === selectedGrade);

  return (
    <div className="mt-6 sm:mt-8">
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

      {/* Grade Level Tabs */}
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
            {/* Grade Level Info */}
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
                      {grade.courses.length} Courses Available
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {grade.courses.filter(c => c.isFree).length} Free Courses
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Courses Grid */}
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
                            by {course.instructor}
                          </p>
                        </div>
                        {course.isFree ? (
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
                      
                      {/* Course Stats */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{course.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{course.students}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          <span>{course.materials}</span>
                        </div>
                      </div>

                      {/* Subject Badge */}
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

                      {/* Action Button */}
                      <Button 
                        className="w-full text-xs sm:text-sm h-8" 
                        variant={course.isFree ? "default" : "outline"}
                      >
                        {course.isFree ? 'Start Free Course' : `Enroll for P${course.price}`}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Empty State for more courses */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="mt-6 text-center py-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                More courses coming soon
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                We're adding more {grade.name} courses and study materials
              </p>
              <Button variant="outline" size="sm">
                Request a Course
              </Button>
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default TutorSection;
