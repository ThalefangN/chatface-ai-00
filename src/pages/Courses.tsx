
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Users, FileText, Download, GraduationCap, BookOpen, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

const Courses = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const navigate = useNavigate();

  const allCourses: Course[] = [
    // BGCSE Courses
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
    },
    // PSLE Courses
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
    },
    // JCE Courses
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
  ];

  const filteredCourses = selectedFilter === 'all' 
    ? allCourses 
    : allCourses.filter(course => course.level === selectedFilter);

  const handleCourseAction = (course: Course) => {
    if (course.isFree) {
      // Navigate to course content page for free courses
      const courseSlug = course.title.toLowerCase().replace(/\s+/g, '-');
      navigate(`/courses/${courseSlug}`);
    } else {
      // Handle paid course enrollment
      console.log('Enrolling in paid course:', course.title);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-lg font-semibold">All Courses</h1>
          </header>
          
          <div className="p-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Explore All Courses
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Browse through all available courses across different grade levels
              </p>
            </motion.div>

            {/* Filter Tabs */}
            <Tabs value={selectedFilter} onValueChange={setSelectedFilter} className="w-full mb-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  All Courses
                </TabsTrigger>
                <TabsTrigger value="BGCSE" className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  BGCSE
                </TabsTrigger>
                <TabsTrigger value="PSLE" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  PSLE
                </TabsTrigger>
                <TabsTrigger value="JCE" className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  JCE
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base line-clamp-2 mb-1">
                            {course.title}
                          </CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            by {course.instructor}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {course.isFree ? (
                            <Badge className="bg-green-100 text-green-800 text-xs">Free</Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">P{course.price}</Badge>
                          )}
                          <Badge variant="secondary" className="text-xs">
                            {course.level}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
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
                        <Button size="sm" variant="outline" className="h-7 px-2">
                          <Download className="w-3 h-3 mr-1" />
                          Materials
                        </Button>
                      </div>

                      {/* Action Button */}
                      <Button 
                        className="w-full text-sm h-9" 
                        variant={course.isFree ? "default" : "outline"}
                        onClick={() => handleCourseAction(course)}
                      >
                        {course.isFree ? 'Start Free Course' : `Enroll for P${course.price}`}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No courses found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your filter to see more courses.
                </p>
              </div>
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Courses;
