
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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

Please provide detailed content with:
1. Clear introduction and learning goals
2. Step-by-step explanations with examples
3. Practical applications relevant to Botswana context
4. Real-world scenarios and problems
5. Interactive elements and exercises

Structure the lesson with clear sections:
- Introduction
- Key Concepts
- Examples and Applications
- Practice Exercises
- Summary

Make the content engaging, educational, and appropriate for ${course.gradeLevel} students. Include plenty of examples and ensure comprehensive coverage of the topic.`;

      const { data, error } = await supabase.functions.invoke('ai-study-chat', {
        body: {
          message: prompt,
          systemPrompt: `You are an expert teacher creating comprehensive lesson content for Botswana students at ${course.gradeLevel} level. Create detailed, well-structured lessons with clear explanations, relevant examples, and practical applications. Use markdown formatting for better readability.`
        }
      });

      if (error) throw error;
      
      if (data && data.content) {
        setLessonContent(data.content);
      } else {
        throw new Error('No content received from AI');
      }
    } catch (error) {
      console.error('Error generating lesson:', error);
      toast.error('Failed to generate lesson content');
      
      // Fallback content
      const objective = course.objectives[lessonNumber - 1];
      setLessonContent(`# Lesson ${lessonNumber}: ${objective}

## Introduction
Welcome to this important lesson on ${objective.toLowerCase()}. This lesson will help you understand the fundamental concepts and how to apply them effectively.

## Key Concepts
Understanding ${objective.toLowerCase()} is essential for your academic success. Here are the main points we'll cover:

### 1. Basic Principles
- Definition and importance
- Core components and elements
- How it relates to your studies

### 2. Practical Applications
- Real-world examples from Botswana
- Step-by-step problem-solving approaches
- Common scenarios you might encounter

### 3. Examples and Practice
Let's work through some examples to reinforce your understanding:

**Example 1:** 
This example demonstrates the basic principles in action.

**Example 2:**
Here we see how to apply the concepts in different situations.

## Summary
In this lesson, you've learned about ${objective.toLowerCase()}. The key takeaways are:
- Understanding the fundamental principles
- Applying knowledge to real situations
- Building confidence through practice

## Next Steps
Complete the quiz to test your understanding before moving to the next lesson.`);
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
        toast.success('Great job! Moving to the next lesson.');
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

  const progress = (currentPart / totalParts) * 100;

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
          <div className="mt-3">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Lesson Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
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
                <p className="text-gray-500 mb-2">Generating lesson content...</p>
                <p className="text-sm text-gray-400">Creating personalized content for your learning</p>
              </div>
            </div>
          ) : (
            <div className="prose max-w-none dark:prose-invert">
              <div 
                className="whitespace-pre-wrap leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: lessonContent.replace(/\n/g, '<br/>').replace(/#{1,6}\s/g, match => {
                    const level = match.trim().length;
                    return `<h${level} class="font-bold text-lg mt-4 mb-2">`;
                  }).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={handlePrevPart}
          disabled={currentPart === 1 || isLoading}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous Part
        </Button>

        <div className="flex gap-2">
          {Array.from({ length: totalParts }, (_, i) => (
            <div 
              key={i}
              className={`w-3 h-3 rounded-full transition-colors ${
                i + 1 === currentPart ? 'bg-blue-500' : i + 1 < currentPart ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <Button onClick={handleNextPart} disabled={isLoading}>
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
