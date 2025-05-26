
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
  const [lessonParts, setLessonParts] = useState<string[]>([]);
  const [currentPart, setCurrentPart] = useState(1);
  const [totalParts] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [question, setQuestion] = useState('');
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);

  useEffect(() => {
    if (lessonParts.length === 0) {
      generateLessonPart(1);
    }
  }, [lessonNumber]);

  const generateLessonPart = async (partNumber: number) => {
    setIsLoading(true);
    try {
      const objective = course.objectives[lessonNumber - 1] || 'Core concepts and fundamentals';
      
      let partTitle = '';
      let partPrompt = '';
      
      switch (partNumber) {
        case 1:
          partTitle = 'Introduction and Basic Concepts';
          partPrompt = `Create Part 1 of 5: Introduction and Basic Concepts for "${objective}".

This should be a warm welcome to students with:
- A friendly greeting addressing students directly
- Clear learning goals for this lesson (3-4 goals)
- Introduction to the main topic
- Why this topic is important in daily life in Botswana
- Basic definitions and key terms (2-3 main concepts)

Keep it engaging but concise. Address students as "you" and use an encouraging tone.`;
          break;
        case 2:
          partTitle = 'Core Principles and Theory';
          partPrompt = `Create Part 2 of 5: Core Principles and Theory for "${objective}".

This should cover:
- Main theoretical concepts explained simply
- Step-by-step breakdown of key principles
- Important rules or formulas (if applicable)
- Clear explanations with simple language
- 1-2 basic examples to illustrate concepts

Focus on understanding rather than memorization. Keep explanations clear and student-friendly.`;
          break;
        case 3:
          partTitle = 'Practical Examples from Botswana';
          partPrompt = `Create Part 3 of 5: Practical Examples for "${objective}".

This should include:
- 2-3 practical examples using Botswana context (markets, Pula currency, local situations)
- Step-by-step solutions showing how to apply the concepts
- Real-world scenarios students can relate to
- Clear working and explanations for each example
- Tips for solving similar problems

Make examples relevant to student life in Botswana.`;
          break;
        case 4:
          partTitle = 'Practice Exercises';
          partPrompt = `Create Part 4 of 5: Practice Exercises for "${objective}".

This should contain:
- 3-4 practice problems for students to try
- Progressive difficulty (start easy, build up)
- Clear instructions for each exercise
- Hints or guidance for approaching the problems
- Encourage students to work through them step by step

Focus on building confidence through practice.`;
          break;
        case 5:
          partTitle = 'Summary and Next Steps';
          partPrompt = `Create Part 5 of 5: Summary and Next Steps for "${objective}".

This should include:
- Summary of key points learned
- Important takeaways to remember
- How this connects to future lessons
- Encouragement and motivation
- Study tips for retaining the information
- Preview of what comes next

End on a positive, encouraging note that builds confidence.`;
          break;
      }

      const { data, error } = await supabase.functions.invoke('ai-study-chat', {
        body: {
          message: partPrompt,
          systemPrompt: `You are an experienced teacher speaking directly to ${course.gradeLevel} students in Botswana. Create engaging, well-structured lesson content with clear headings and formatting. Use **bold** for important topics and concepts. Address students as "you" and maintain an encouraging, supportive tone. Keep content focused and not too lengthy - this is part ${partNumber} of 5 parts.`
        }
      });

      if (error) throw error;
      
      let content = '';
      if (data && data.content) {
        content = `# ${partTitle}\n\n${data.content}`;
      } else {
        // Fallback content
        content = generateFallbackContent(partNumber, partTitle, objective);
      }

      setLessonParts(prev => {
        const newParts = [...prev];
        newParts[partNumber - 1] = content;
        return newParts;
      });
    } catch (error) {
      console.error('Error generating lesson part:', error);
      toast.error('Failed to generate lesson content');
      
      // Generate fallback content
      const fallbackContent = generateFallbackContent(partNumber, getPartTitle(partNumber), objective);
      setLessonParts(prev => {
        const newParts = [...prev];
        newParts[partNumber - 1] = fallbackContent;
        return newParts;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPartTitle = (partNumber: number) => {
    switch (partNumber) {
      case 1: return 'Introduction and Basic Concepts';
      case 2: return 'Core Principles and Theory';
      case 3: return 'Practical Examples from Botswana';
      case 4: return 'Practice Exercises';
      case 5: return 'Summary and Next Steps';
      default: return 'Lesson Content';
    }
  };

  const generateFallbackContent = (partNumber: number, partTitle: string, objective: string) => {
    const content = `# ${partTitle}

**Welcome to Part ${partNumber} of your lesson!**

Hello students! Let's continue exploring **${objective.toLowerCase()}** together.

## Key Learning Points

**Important:** This section focuses on building your understanding step by step.

### Main Concepts
- **Fundamental principles** that guide our understanding
- **Practical applications** in everyday life
- **Problem-solving strategies** you can use

### Examples from Botswana Context
Let's look at how these concepts apply in our daily lives:

**Example:** If you're at a local market and need to calculate costs in Pula, you'll use these mathematical principles.

## Practice Activity
Try to think of situations where you might use these concepts in your own life.

**Remember:** Every expert was once a beginner. Take your time and don't be afraid to ask questions!

Keep up the excellent work!`;

    return content;
  };

  const handleNextPart = () => {
    if (currentPart < totalParts) {
      const nextPart = currentPart + 1;
      setCurrentPart(nextPart);
      
      // Generate next part if it doesn't exist
      if (!lessonParts[nextPart - 1]) {
        generateLessonPart(nextPart);
      }
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
          message: `Student question about Lesson ${lessonNumber}, Part ${currentPart} (${course.objectives[lessonNumber - 1]}): ${question}`,
          systemPrompt: `You are a helpful teacher responding to a student's question about their current lesson part. The lesson is about "${course.objectives[lessonNumber - 1]}" at ${course.gradeLevel} level. Provide a clear, encouraging response that helps the student understand the concept. Keep your response concise but thorough.`
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
      .replace(/#{1}\s/g, '<h1 class="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-4 mt-6">') // Main headings
      .replace(/#{2}\s/g, '<h2 class="text-xl font-semibold text-green-700 dark:text-green-400 mb-3 mt-5">') // Subheadings
      .replace(/#{3}\s/g, '<h3 class="text-lg font-medium text-purple-600 dark:text-purple-400 mb-2 mt-4">') // Sub-subheadings
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900 dark:text-gray-100">$1</strong>') // Bold text
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
  const currentContent = lessonParts[currentPart - 1] || '';

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
                <p className="text-gray-500 mb-2">
                  {currentPart === 1 ? 'Your teacher is preparing the lesson...' : 'Continuation lesson loading...'}
                </p>
                <p className="text-sm text-gray-400">Creating personalized content just for you</p>
              </div>
            </div>
          ) : (
            <div className="prose max-w-none dark:prose-invert">
              <div 
                className="whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-200"
                dangerouslySetInnerHTML={{ 
                  __html: `<p class="mb-3 leading-relaxed">${formatLessonContent(currentContent)}</p>`
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
            Have a question about this part of the lesson? I'm here to help you understand better!
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Textarea
              placeholder="Type your question about this lesson part here... For example: 'Can you explain this concept with another example?' or 'I don't understand this step'"
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
