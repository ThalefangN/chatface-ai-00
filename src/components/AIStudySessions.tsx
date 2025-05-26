
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
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);

  const handleCourseCreated = (course: Course) => {
    setSelectedCourse(course);
    setIsCreatingCourse(false);
  };

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleBackToSessions = () => {
    setSelectedCourse(null);
    setIsCreatingCourse(false);
  };

  const handleCreateCourse = () => {
    setShowCreateDialog(true);
    setIsCreatingCourse(true);
  };

  const handleUploadDocument = () => {
    // For now, show a toast message - this can be enhanced later
    console.log('Document upload feature will be implemented');
  };

  if (selectedCourse) {
    return (
      <div className="w-full max-w-full overflow-hidden">
        <CourseViewer 
          course={selectedCourse} 
          onBack={handleBackToSessions}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="space-y-8 px-2">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            AI Study Sessions
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
            Create personalized courses or upload your documents for AI-powered learning assistance
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
          {/* Upload Document Card */}
          <Card 
            className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 hover:shadow-lg transition-all cursor-pointer"
            onClick={handleUploadDocument}
          >
            <CardHeader className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
              </div>
              <CardTitle className="text-lg md:text-xl text-purple-800 dark:text-purple-300">
                Upload Document
              </CardTitle>
              <p className="text-sm md:text-base text-purple-600 dark:text-purple-400">
                Upload your study materials for AI-powered summarization and analysis
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                variant="outline" 
                className="border-purple-300 text-purple-700 hover:bg-purple-50 w-full md:w-auto"
                onClick={handleUploadDocument}
              >
                <FileText className="w-4 h-4 mr-2" />
                Upload & Analyze
              </Button>
            </CardContent>
          </Card>

          {/* Create Course Card */}
          <Card 
            className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 hover:shadow-lg transition-all cursor-pointer"
            onClick={handleCreateCourse}
          >
            <CardHeader className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
              </div>
              <CardTitle className="text-lg md:text-xl text-green-800 dark:text-green-300">
                Create Custom Course
              </CardTitle>
              <p className="text-sm md:text-base text-green-600 dark:text-green-400">
                Generate AI-powered courses tailored to Botswana syllabus (PSLE, JCE, BGCSE)
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                onClick={handleCreateCourse}
                className="bg-green-600 hover:bg-green-700 w-full md:w-auto"
                disabled={isCreatingCourse}
              >
                <Plus className="w-4 h-4 mr-2" />
                {isCreatingCourse ? 'Creating...' : 'Create Course'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Saved Courses Section - This will always show */}
        <div className="max-w-4xl mx-auto w-full">
          <SavedCoursesList onCourseSelect={handleCourseSelect} />
        </div>

        {/* Create Course Dialog */}
        <CreateCourseDialog
          open={showCreateDialog}
          onOpenChange={(open) => {
            setShowCreateDialog(open);
            if (!open) {
              setIsCreatingCourse(false);
            }
          }}
          onCourseCreated={handleCourseCreated}
        />
      </div>
    </div>
  );
};

export default AIStudySessions;
