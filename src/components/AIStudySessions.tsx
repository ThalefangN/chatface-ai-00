
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, BookOpen, Upload, Plus } from 'lucide-react';
import CreateCourseDialog from '@/components/CreateCourseDialog';
import CourseViewer from '@/components/CourseViewer';
import SavedCoursesList from '@/components/SavedCoursesList';

interface Course {
  id: string;
  name: string;
  gradeLevel: string;
  objectives: string[];
  currentLesson: number;
  totalLessons: number;
}

const AIStudySessions = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const handleCourseCreated = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleBackToSessions = () => {
    setSelectedCourse(null);
  };

  if (selectedCourse) {
    return (
      <CourseViewer 
        course={selectedCourse} 
        onBack={handleBackToSessions}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          AI Study Sessions
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Create personalized courses or upload your documents for AI-powered learning assistance
        </p>
      </div>

      {/* Action Cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Upload Document Card */}
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 hover:shadow-lg transition-all cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-purple-600" />
            </div>
            <CardTitle className="text-xl text-purple-800 dark:text-purple-300">
              Upload Document
            </CardTitle>
            <p className="text-purple-600 dark:text-purple-400">
              Upload your study materials for AI-powered summarization and analysis
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
              <FileText className="w-4 h-4 mr-2" />
              Upload & Analyze
            </Button>
          </CardContent>
        </Card>

        {/* Create Course Card */}
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 hover:shadow-lg transition-all cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-xl text-green-800 dark:text-green-300">
              Create Custom Course
            </CardTitle>
            <p className="text-green-600 dark:text-green-400">
              Generate AI-powered courses tailored to Botswana syllabus (PSLE, JCE, BGCSE)
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={() => setShowCreateDialog(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Course
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Saved Courses Section */}
      <div className="max-w-4xl mx-auto">
        <SavedCoursesList onCourseSelect={handleCourseSelect} />
      </div>

      {/* Create Course Dialog */}
      <CreateCourseDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCourseCreated={handleCourseCreated}
      />
    </div>
  );
};

export default AIStudySessions;
