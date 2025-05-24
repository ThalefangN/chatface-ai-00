
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Video, 
  FileText, 
  Trophy, 
  Star, 
  Clock, 
  Users, 
  Download,
  Play,
  CheckCircle,
  Circle
} from 'lucide-react';

interface CourseContentProps {
  courseTitle: string;
  instructor: string;
  rating: number;
  students: number;
  level: string;
  subject: string;
}

const CourseContent = ({ 
  courseTitle, 
  instructor, 
  rating, 
  students, 
  level, 
  subject 
}: CourseContentProps) => {
  const [activeTab, setActiveTab] = useState('notes');
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());

  const toggleItemCompletion = (itemId: string) => {
    const newCompleted = new Set(completedItems);
    if (newCompleted.has(itemId)) {
      newCompleted.delete(itemId);
    } else {
      newCompleted.add(itemId);
    }
    setCompletedItems(newCompleted);
  };

  const courseNotes = [
    {
      id: 'note1',
      title: 'Introduction to Course Content',
      duration: '15 min read',
      description: 'Overview of the course structure and learning objectives'
    },
    {
      id: 'note2',
      title: 'Chapter 1: Basic Concepts',
      duration: '25 min read',
      description: 'Fundamental concepts and definitions'
    },
    {
      id: 'note3',
      title: 'Chapter 2: Practical Applications',
      duration: '30 min read',
      description: 'Real-world examples and case studies'
    },
    {
      id: 'note4',
      title: 'Chapter 3: Advanced Topics',
      duration: '35 min read',
      description: 'Deep dive into complex concepts'
    }
  ];

  const courseVideos = [
    {
      id: 'video1',
      title: 'Course Introduction',
      duration: '12:30',
      description: 'Welcome and course overview'
    },
    {
      id: 'video2',
      title: 'Lesson 1: Getting Started',
      duration: '18:45',
      description: 'Basic concepts and fundamentals'
    },
    {
      id: 'video3',
      title: 'Lesson 2: Practical Examples',
      duration: '22:15',
      description: 'Working through real examples'
    },
    {
      id: 'video4',
      title: 'Lesson 3: Advanced Techniques',
      duration: '28:10',
      description: 'Complex problem-solving methods'
    }
  ];

  const assignments = [
    {
      id: 'assign1',
      title: 'Assignment 1: Basic Exercises',
      dueDate: 'Due in 5 days',
      status: 'pending',
      grade: null
    },
    {
      id: 'assign2',
      title: 'Assignment 2: Case Study Analysis',
      dueDate: 'Due in 12 days',
      status: 'pending',
      grade: null
    },
    {
      id: 'assign3',
      title: 'Final Project',
      dueDate: 'Due in 20 days',
      status: 'pending',
      grade: null
    }
  ];

  const grades = [
    {
      item: 'Quiz 1',
      score: 85,
      maxScore: 100,
      date: '2024-01-15'
    },
    {
      item: 'Assignment 1',
      score: 92,
      maxScore: 100,
      date: '2024-01-20'
    },
    {
      item: 'Midterm Exam',
      score: 78,
      maxScore: 100,
      date: '2024-01-25'
    }
  ];

  const totalItems = courseNotes.length + courseVideos.length + assignments.length;
  const completedCount = completedItems.size;
  const progressPercentage = (completedCount / totalItems) * 100;

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-xl md:text-2xl font-bold text-blue-900 dark:text-blue-100 mb-2">
                  {courseTitle}
                </CardTitle>
                <p className="text-blue-700 dark:text-blue-300 mb-3">
                  Instructor: {instructor}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Free Course
                  </Badge>
                  <Badge variant="outline" className="border-blue-300 text-blue-700 dark:border-blue-600 dark:text-blue-300">
                    {level}
                  </Badge>
                  <Badge variant="secondary">
                    {subject}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-blue-600 dark:text-blue-400">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{students} students</span>
                  </div>
                </div>
              </div>
              <div className="text-center md:text-right">
                <div className="mb-2">
                  <span className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {Math.round(progressPercentage)}%
                  </span>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Complete</p>
                </div>
                <Progress value={progressPercentage} className="w-32 mx-auto md:mx-0" />
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Course Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Notes</span>
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            <span className="hidden sm:inline">Videos</span>
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Assignments</span>
          </TabsTrigger>
          <TabsTrigger value="grades" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            <span className="hidden sm:inline">Grades</span>
          </TabsTrigger>
        </TabsList>

        {/* Course Notes */}
        <TabsContent value="notes" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-4">Course Notes</h3>
            <div className="space-y-3">
              {courseNotes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleItemCompletion(note.id)}
                          className="flex-shrink-0"
                        >
                          {completedItems.has(note.id) ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {note.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {note.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{note.duration}</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </TabsContent>

        {/* Course Videos */}
        <TabsContent value="videos" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-4">Video Lessons</h3>
            <div className="space-y-3">
              {courseVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleItemCompletion(video.id)}
                          className="flex-shrink-0"
                        >
                          {completedItems.has(video.id) ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                        <div className="w-16 h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center flex-shrink-0">
                          <Play className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {video.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {video.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{video.duration}</span>
                          </div>
                        </div>
                        <Button size="sm">
                          <Play className="w-3 h-3 mr-1" />
                          Watch
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </TabsContent>

        {/* Assignments */}
        <TabsContent value="assignments" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-4">Assignments</h3>
            <div className="space-y-3">
              {assignments.map((assignment, index) => (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleItemCompletion(assignment.id)}
                            className="flex-shrink-0"
                          >
                            {completedItems.has(assignment.id) ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-400" />
                            )}
                          </button>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {assignment.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {assignment.dueDate}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {assignment.status}
                          </Badge>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </TabsContent>

        {/* Grades */}
        <TabsContent value="grades" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-4">Grades</h3>
            <div className="space-y-3">
              {grades.map((grade, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {grade.item}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {grade.date}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            <span className={grade.score >= 80 ? 'text-green-600' : grade.score >= 60 ? 'text-yellow-600' : 'text-red-600'}>
                              {grade.score}
                            </span>
                            <span className="text-gray-500">/{grade.maxScore}</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {Math.round((grade.score / grade.maxScore) * 100)}%
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            {grades.length > 0 && (
              <Card className="bg-gray-50 dark:bg-gray-800">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Overall Average:</span>
                    <span className="text-lg font-bold text-blue-600">
                      {Math.round(grades.reduce((acc, grade) => acc + (grade.score / grade.maxScore) * 100, 0) / grades.length)}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseContent;
