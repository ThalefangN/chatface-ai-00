
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, PlusCircle, BookOpen, FileText, Brain } from 'lucide-react';
import DocumentSummarySection from '@/components/DocumentSummarySection';
import CreateCourseDialog from '@/components/CreateCourseDialog';
import CourseViewer from '@/components/CourseViewer';

interface Course {
  id: string;
  name: string;
  gradeLevel: string;
  objectives: string[];
  currentLesson: number;
  totalLessons: number;
}

const AIStudySessions = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'document' | 'course'>('home');
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);

  const handleStartCourse = (course: Course) => {
    setActiveCourse(course);
    setActiveTab('course');
  };

  if (activeTab === 'course' && activeCourse) {
    return <CourseViewer course={activeCourse} onBack={() => setActiveTab('home')} />;
  }

  if (activeTab === 'document') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setActiveTab('home')}
            className="text-blue-600"
          >
            ← Back to Study Sessions
          </Button>
        </div>
        <DocumentSummarySection />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Study Sessions
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
          Transform your learning experience with AI-powered document analysis and custom course generation
        </p>
      </div>

      {/* Progress Card */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">Ready to Start Learning</h3>
              <p className="text-green-600 dark:text-green-400">Choose how you want to study today</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">100%</div>
              <div className="text-sm text-green-500">Ready</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Document Upload Option */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-300">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-xl">Upload Document</CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              Upload your study materials for AI-powered summarization and analysis
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={() => setActiveTab('document')}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              <FileText className="w-4 h-4 mr-2" />
              Upload & Analyze
            </Button>
          </CardContent>
        </Card>

        {/* Create Course Option */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-purple-300">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <PlusCircle className="w-8 h-8 text-purple-600" />
            </div>
            <CardTitle className="text-xl">Create Custom Course</CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              Generate AI-powered courses tailored to Botswana syllabus (PSLE, JCE, BGCSE)
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={() => setIsCreateCourseOpen(true)}
              className="w-full bg-purple-600 hover:bg-purple-700"
              size="lg"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Create Course
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <Card className="text-center p-4">
          <Brain className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <h4 className="font-semibold">AI-Powered</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">Advanced AI generates personalized content</p>
        </Card>
        <Card className="text-center p-4">
          <BookOpen className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <h4 className="font-semibold">Syllabus Aligned</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">Content matches Botswana curriculum</p>
        </Card>
        <Card className="text-center p-4">
          <FileText className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <h4 className="font-semibold">Interactive</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">Quizzes and feedback for better learning</p>
        </Card>
      </div>

      <CreateCourseDialog 
        open={isCreateCourseOpen}
        onOpenChange={setIsCreateCourseOpen}
        onCourseCreated={handleStartCourse}
      />
    </div>
  );
};

export default AIStudySessions;
