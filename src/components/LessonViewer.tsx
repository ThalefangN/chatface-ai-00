
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, BookOpen, Brain, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import QuizPage from '@/components/QuizPage';

interface Course {
  id: string;
  name: string;
  gradeLevel: string;
  objectives: string[];
  currentLesson: number;
  totalLessons: number;
}

interface LessonViewerProps {
  course: Course;
  lessonNumber: number;
  onBack: () => void;
  onNextLesson: (nextLesson: number) => void;
}

const LessonViewer: React.FC<LessonViewerProps> = ({ 
  course, 
  lessonNumber, 
  onBack, 
  onNextLesson 
}) => {
  const [lessonContent, setLessonContent] = useState('');
  const [currentPart, setCurrentPart] = useState(1);
  const [totalParts, setTotalParts] = useState(3);
  const [isLoading, setIsLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    generateLessonContent();
  }, [lessonNumber]);

  const generateLessonContent = async () => {
    setIsLoading(true);
    try {
      const objective = course.objectives[lessonNumber - 1] || 'Core concepts and fundamentals';
      const prompt = `Create a comprehensive lesson for "${course.name}" at ${course.gradeLevel} level.

Lesson ${lessonNumber}: ${objective}

Please provide:
1. Clear explanations with examples
2. Step-by-step breakdowns
3. Practical applications
4. Real-world connections relevant to Botswana context
5. Interactive elements

Make the content engaging and appropriate for ${course.gradeLevel} students. Include plenty of examples and ensure the lesson is well-structured with clear sections.`;

      const { data, error } = await supabase.functions.invoke('ai-study-chat', {
        body: {
          message: prompt,
          systemPrompt: 'You are an expert teacher creating engaging lesson content for Botswana students. Make lessons comprehensive, clear, and interactive with plenty of examples.'
        }
      });

      if (error) throw error;
      
      setLessonContent(data.content);
    } catch (error) {
      console.error('Error generating lesson:', error);
      toast.error('Failed to generate lesson content');
      setLessonContent(`# Lesson ${lessonNumber}: ${course.objectives[lessonNumber - 1]}

Welcome to this lesson! This content is being generated to provide you with comprehensive learning materials.

## Introduction
This lesson will cover the fundamental concepts and help you understand the key principles.

## Key Concepts
- Important concept 1
- Important concept 2  
- Important concept 3

## Examples
Here we'll explore practical examples to reinforce your understanding.

## Summary
In this lesson, you've learned about the core concepts and how to apply them.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextPart = () => {
    if (currentPart < totalParts) {
      setCurrentPart(currentPart + 1);
    } else {
      setShowQuiz(true);
    }
  };

  const handlePrevPart = () => {
    if (currentPart > 1) {
      setCurrentPart(currentPart - 1);
    }
  };

  const handleQuizComplete = (passed: boolean) => {
    if (passed) {
      setShowQuiz(false);
      if (lessonNumber < course.totalLessons) {
        onNextLesson(lessonNumber + 1);
      } else {
        onBack();
        toast.success('Congratulations! You have completed the entire course!');
      }
    } else {
      setShowQuiz(false);
      toast.error('Please review the lesson and try the quiz again.');
    }
  };

  if (showQuiz) {
    return (
      <QuizPage 
        course={course}
        lessonNumber={lessonNumber}
        onComplete={handleQuizComplete}
        onBack={() => setShowQuiz(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Course
        </Button>
        <Badge variant="secondary" className="px-4 py-2">
          Lesson {lessonNumber} of {course.totalLessons}
        </Badge>
      </div>

      {/* Lesson Header */}
      <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl text-green-800 dark:text-green-300">
            <BookOpen className="w-6 h-6" />
            {course.objectives[lessonNumber - 1]}
          </CardTitle>
          <div className="flex items-center gap-4 text-sm text-green-600 dark:text-green-400">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Part {currentPart} of {totalParts}
            </div>
            <div className="flex items-center gap-1">
              <Brain className="w-4 h-4" />
              AI-Generated Content
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Lesson Content */}
      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500">Generating lesson content...</p>
              </div>
            </div>
          ) : (
            <div className="prose max-w-none dark:prose-invert">
              <div className="whitespace-pre-wrap leading-relaxed">
                {lessonContent}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={handlePrevPart}
          disabled={currentPart === 1}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous Part
        </Button>

        <div className="flex gap-2">
          {Array.from({ length: totalParts }, (_, i) => (
            <div 
              key={i}
              className={`w-3 h-3 rounded-full ${
                i + 1 === currentPart ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <Button onClick={handleNextPart}>
          {currentPart === totalParts ? (
            <>
              Take Short Quiz
              <Brain className="w-4 h-4 ml-2" />
            </>
          ) : (
            <>
              Next Part
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default LessonViewer;
