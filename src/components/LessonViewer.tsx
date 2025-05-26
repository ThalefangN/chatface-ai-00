
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight, BookOpen, Brain, Clock, Send, MessageSquare } from 'lucide-react';
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
  const [question, setQuestion] = useState('');
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);

  useEffect(() => {
    generateLessonContent();
  }, [lessonNumber]);

  const generateLessonContent = async () => {
    setIsLoading(true);
    try {
      const objective = course.objectives[lessonNumber - 1] || 'Core concepts and fundamentals';
      
      const prompt = `Create a comprehensive lesson for "${course.name}" at ${course.gradeLevel} level.

Lesson ${lessonNumber}: ${objective}

As an experienced teacher addressing students directly, create engaging lesson content with:
1. Clear introduction speaking directly to students
2. Step-by-step explanations with practical examples from Botswana
3. Interactive elements and practice exercises
4. Real-world applications relevant to Botswana context
5. Encouraging tone that motivates learning

Structure the lesson with clear sections:
- Welcome and Learning Goals (address students directly)
- Key Concepts (with clear explanations)
- Examples and Applications (use Botswana context - markets, temperatures, costs in Pula, etc.)
- Practice Exercises (engaging activities)
- Summary and Encouragement

Write as if you're speaking directly to the students. Use an encouraging, supportive tone. Include practical examples using Botswana currency (Pula), local contexts, and everyday situations students can relate to.`;

      const { data, error } = await supabase.functions.invoke('ai-study-chat', {
        body: {
          message: prompt,
          systemPrompt: `You are an experienced and caring teacher speaking directly to students at ${course.gradeLevel} level in Botswana. Create detailed, well-structured lessons with clear explanations, relevant local examples, and practical applications. Use an encouraging tone and address students directly as "you". Use proper formatting with clear headings and sections.`
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
      
      // Enhanced fallback content with better formatting
      const objective = course.objectives[lessonNumber - 1];
      setLessonContent(`# Welcome to Lesson ${lessonNumber}: ${objective}

Hello students! I'm excited to guide you through this important lesson on ${objective.toLowerCase()}. This lesson will help you build a strong foundation in mathematics that you'll use throughout your academic journey and daily life.

## What You'll Learn Today

By the end of this lesson, you will be able to:
- Understand the fundamental principles we're covering
- Apply these concepts to real-world situations in Botswana
- Solve practical problems with confidence
- Build your mathematical thinking skills

## Key Concepts

Let's start with the essential ideas you need to understand. Don't worry if these seem challenging at first - we'll work through them together step by step.

### Understanding the Basics

Mathematics is all around us in Botswana. Whether you're helping at your family's shop, planning for school expenses, or calculating travel distances, you're using mathematical thinking.

### Practical Applications

**Example from Daily Life:**
Imagine you're at a local market in your area. You want to buy vegetables for your family. If tomatoes cost P8 per kg and you need 2 kg, how much will you spend?

**Solution:** 2 kg × P8 per kg = P16 total

This is mathematics in action!

## Practice Together

Let's try some exercises together. Remember, making mistakes is part of learning!

**Exercise 1:** If you save P20 every week, how much will you have after 4 weeks?

**Exercise 2:** Your class has 30 students and you need to form groups of 5. How many groups will you have?

Take your time with these. Think through each step carefully.

## Summary

Today we've explored ${objective.toLowerCase()}. Remember:
- Mathematics helps us solve everyday problems
- Practice makes you stronger at math
- Every small step builds your confidence
- You have the ability to succeed!

## Your Next Steps

Keep practicing these concepts. Try to spot mathematical patterns in your daily activities. Remember, I'm here to help you succeed, and you can ask me questions anytime!

Keep up the excellent work!`);
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

  const handleQuestionSubmit = async () => {
    if (!question.trim() || isSubmittingQuestion) return;

    setIsSubmittingQuestion(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-study-chat', {
        body: {
          message: `Student question about Lesson ${lessonNumber} (${course.objectives[lessonNumber - 1]}): ${question}`,
          systemPrompt: `You are a helpful teacher responding to a student's question about their current lesson. The lesson is about "${course.objectives[lessonNumber - 1]}" at ${course.gradeLevel} level. Provide a clear, encouraging response that helps the student understand the concept. Keep your response concise but thorough.`
        }
      });

      if (error) throw error;
      
      toast.success('Great question! Here\'s my response:', {
        description: data?.content || 'I received your question and will help you understand this concept better.',
        duration: 8000,
      });
      
      setQuestion('');
    } catch (error) {
      console.error('Error submitting question:', error);
      toast.error('I\'m having trouble responding right now. Please try asking your question again.');
    } finally {
      setIsSubmittingQuestion(false);
    }
  };

  const formatLessonContent = (content: string) => {
    return content
      .replace(/---+/g, '') // Remove all --- symbols
      .replace(/#{1}\s/g, '<h1 class="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-4 mt-6">') // Main headings
      .replace(/#{2}\s/g, '<h2 class="text-xl font-semibold text-green-700 dark:text-green-400 mb-3 mt-5">') // Subheadings
      .replace(/#{3}\s/g, '<h3 class="text-lg font-medium text-purple-600 dark:text-purple-400 mb-2 mt-4">') // Sub-subheadings
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-800 dark:text-gray-200">$1</strong>') // Bold text
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700 dark:text-gray-300">$1</em>') // Italic text
      .replace(/\n\n/g, '</p><p class="mb-3 leading-relaxed">') // Paragraphs
      .replace(/\n/g, '<br/>'); // Line breaks
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
                <p className="text-gray-500 mb-2">Your teacher is preparing the lesson...</p>
                <p className="text-sm text-gray-400">Creating personalized content just for you</p>
              </div>
            </div>
          ) : (
            <div className="prose max-w-none dark:prose-invert">
              <div 
                className="whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-200"
                dangerouslySetInnerHTML={{ 
                  __html: `<p class="mb-3 leading-relaxed">${formatLessonContent(lessonContent)}</p>`
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Question Container */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-blue-800 dark:text-blue-300">
            <MessageSquare className="w-5 h-5" />
            Ask Your Teacher a Question
          </CardTitle>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Have a question about this lesson? I'm here to help you understand better!
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Textarea
              placeholder="Type your question about this lesson here... For example: 'Can you explain the distributive property with another example?' or 'I don't understand how to solve problem 2'"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="flex-1 min-h-[80px] resize-none"
              disabled={isSubmittingQuestion}
            />
            <Button
              onClick={handleQuestionSubmit}
              disabled={!question.trim() || isSubmittingQuestion}
              className="h-[80px] px-6 bg-blue-600 hover:bg-blue-700"
            >
              {isSubmittingQuestion ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            💡 Tip: Ask specific questions about concepts you want to understand better
          </p>
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
