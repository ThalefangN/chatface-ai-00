
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight, BookOpen, Brain, Clock, Send, MessageSquare, X } from 'lucide-react';
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
    loadLessonParts();
  }, [lessonNumber, course.id]);

  const loadLessonParts = async () => {
    try {
      // First, try to load existing lesson parts from database
      const { data: existingParts, error } = await supabase
        .from('ai_lesson_parts')
        .select('*')
        .eq('course_id', course.id)
        .eq('lesson_number', lessonNumber)
        .order('part_number');

      if (error) throw error;

      if (existingParts && existingParts.length > 0) {
        // Load existing parts
        const parts = new Array(totalParts).fill('');
        existingParts.forEach(part => {
          if (part.part_number <= totalParts) {
            parts[part.part_number - 1] = `# ${part.title}\n\n${part.content}`;
          }
        });
        setLessonParts(parts);
        
        // If we don't have the first part, generate it
        if (!parts[0]) {
          generateLessonPart(1);
        }
      } else {
        // No existing parts, generate the first one
        generateLessonPart(1);
      }
    } catch (error) {
      console.error('Error loading lesson parts:', error);
      generateLessonPart(1);
    }
  };

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

FORMATTING RULES:
- Use ## for main subtopics only (these will be bolded)
- Use normal text for all explanations and content
- Add proper line spacing between sections
- Keep language simple and student-friendly
- Address students as "you" and use an encouraging tone`;
          break;
        case 2:
          partTitle = 'Core Principles and Theory';
          partPrompt = `Create Part 2 of 5: Core Principles and Theory for "${objective}".

This should cover:
- Main theoretical concepts explained simply
- Step-by-step breakdown of key principles  
- Important rules or formulas (if applicable)
- Clear explanations with simple language
- 2-3 solved mathematical examples with complete working steps

FORMATTING RULES:
- Use ## for subtopics only (like "Number Systems", "Basic Operations")
- Use normal text for all explanations
- For math problems: Show step-by-step solutions clearly
- Include at least 2 complete mathematical examples with working
- Add proper spacing between different concepts
- Make calculations easy to follow

Focus on understanding rather than memorization. Show complete mathematical working for examples.`;
          break;
        case 3:
          partTitle = 'Practical Examples from Botswana';
          partPrompt = `Create Part 3 of 5: Practical Examples for "${objective}".

This should include:
- 3-4 practical examples using Botswana context (markets, Pula currency, local situations)
- Complete step-by-step mathematical solutions showing all working
- Real-world scenarios students can relate to
- Clear mathematical calculations with proper formatting
- Tips for solving similar problems

FORMATTING RULES:
- Use ## for subtopics only (like "Market Calculations", "Currency Problems")
- Use normal text for explanations and problem descriptions
- Show complete mathematical working: Problem → Given → Find → Solution → Answer
- Use proper spacing between different examples
- Make each calculation step clear and easy to follow

Make examples relevant to student life in Botswana with complete mathematical solutions.`;
          break;
        case 4:
          partTitle = 'Practice Exercises';
          partPrompt = `Create Part 4 of 5: Practice Exercises for "${objective}".

This should contain:
- 4-5 practice problems for students to try
- Progressive difficulty (start easy, build up)
- Clear instructions for each exercise
- Sample solutions with step-by-step working for 2 problems
- Hints or guidance for approaching the problems

FORMATTING RULES:
- Use ## for subtopics only (like "Basic Practice", "Challenge Problems")
- Use normal text for problem statements and instructions
- Show complete solutions for sample problems with all mathematical steps
- Use proper spacing between problems
- Make instructions clear and encouraging

Focus on building confidence through practice with clear mathematical examples.`;
          break;
        case 5:
          partTitle = 'Summary and Next Steps';
          partPrompt = `Create Part 5 of 5: Summary and Next Steps for "${objective}".

This should include:
- Summary of key points learned
- Important mathematical formulas or concepts to remember
- How this connects to future lessons
- Quick review problem with solution
- Encouragement and motivation
- Study tips for retaining the information

FORMATTING RULES:
- Use ## for subtopics only (like "Key Takeaways", "Important Formulas")
- Use normal text for all content and explanations
- Include one worked example as a summary
- Add proper spacing throughout
- End on a positive, encouraging note

Keep content focused and encouraging while reinforcing the mathematical concepts learned.`;
          break;
      }

      const { data, error } = await supabase.functions.invoke('ai-study-chat', {
        body: {
          message: partPrompt,
          systemPrompt: `You are an experienced mathematics teacher speaking directly to ${course.gradeLevel} students in Botswana. 

CRITICAL FORMATTING INSTRUCTIONS:
- Use ## ONLY for main subtopics (these will appear bold)
- Use normal text for ALL explanations, descriptions, and content
- For mathematical problems, show complete step-by-step solutions
- Include proper spacing with double line breaks between sections
- Address students as "you" and maintain an encouraging tone
- When showing math calculations, format them clearly:
  Problem: [state the problem]
  Given: [what we know]
  Solution: [step by step working]
  Answer: [final result]

Keep content focused and not too lengthy - this is part ${partNumber} of 5 parts. Make mathematical examples clear and easy to follow with complete working shown.`
        }
      });

      if (error) throw error;
      
      let content = '';
      if (data && data.content) {
        content = data.content;
        
        // Save to database
        await supabase.from('ai_lesson_parts').insert({
          course_id: course.id,
          lesson_number: lessonNumber,
          part_number: partNumber,
          title: partTitle,
          content: content
        });
      } else {
        // Fallback content
        content = generateFallbackContent(partNumber, partTitle, objective);
      }

      const fullContent = `# ${partTitle}\n\n${content}`;
      setLessonParts(prev => {
        const newParts = [...prev];
        newParts[partNumber - 1] = fullContent;
        return newParts;
      });
    } catch (error) {
      console.error('Error generating lesson part:', error);
      toast.error('Failed to generate lesson content');
      
      // Generate fallback content
      const objective = course.objectives[lessonNumber - 1] || 'Core concepts and fundamentals';
      const fallbackContent = generateFallbackContent(partNumber, getPartTitle(partNumber), objective);
      const fullContent = `# ${getPartTitle(partNumber)}\n\n${fallbackContent}`;
      setLessonParts(prev => {
        const newParts = [...prev];
        newParts[partNumber - 1] = fullContent;
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
    const content = `Welcome to Part ${partNumber} of your lesson!

Hello students! Let's continue exploring ${objective.toLowerCase()} together.

## Key Learning Points

This section focuses on building your understanding step by step.

### Main Concepts
Here are the fundamental principles that guide our understanding:

- Basic mathematical operations and their properties
- Problem-solving strategies you can use in daily life
- Real-world applications in Botswana context

### Sample Mathematical Problem
Let's work through a practical example:

Problem: If you buy 3 exercise books at 15 Pula each and 2 pens at 8 Pula each, what is the total cost?

Given: 
- 3 exercise books at 15 Pula each
- 2 pens at 8 Pula each

Solution:
Step 1: Calculate cost of exercise books = 3 × 15 = 45 Pula
Step 2: Calculate cost of pens = 2 × 8 = 16 Pula  
Step 3: Add total costs = 45 + 16 = 61 Pula

Answer: The total cost is 61 Pula.

## Practice Activity
Try to think of situations where you might use these mathematical concepts in your own life in Botswana.

Remember: Every expert was once a beginner. Take your time and don't be afraid to ask questions!

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

  const handleQuizComplete = async (passed: boolean) => {
    if (passed) {
      setShowQuiz(false);
      
      // Update current lesson in database
      if (lessonNumber < course.totalLessons) {
        try {
          await supabase
            .from('ai_courses')
            .update({ current_lesson: lessonNumber + 1 })
            .eq('id', course.id);
        } catch (error) {
          console.error('Error updating lesson progress:', error);
        }
        
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
          systemPrompt: `You are a helpful mathematics teacher responding to a student's question about their current lesson part. The lesson is about "${course.objectives[lessonNumber - 1]}" at ${course.gradeLevel} level. 

FORMATTING INSTRUCTIONS:
- Use clear, simple language
- If explaining math, show step-by-step solutions
- Use proper spacing between steps
- Be encouraging and supportive
- Keep your response concise but thorough

Provide a clear, encouraging response that helps the student understand the concept.`
        }
      });

      if (error) throw error;
      
      const toastId = toast.success('Great question! Here\'s my response:', {
        description: data?.content || 'I received your question and will help you understand this concept better.',
        duration: 10000,
        action: {
          label: <X className="w-4 h-4" />,
          onClick: () => toast.dismiss(toastId),
        },
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
      // Format main headers (# )
      .replace(/^#\s(.+)$/gm, '<h1 class="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-4 mt-6">$1</h1>')
      // Format subtopics (## ) - these will be bolded
      .replace(/^##\s(.+)$/gm, '<h2 class="text-xl font-bold text-green-700 dark:text-green-400 mb-3 mt-5">$1</h2>') 
      // Format sub-subtopics (### ) - these will be medium weight
      .replace(/^###\s(.+)$/gm, '<h3 class="text-lg font-medium text-purple-600 dark:text-purple-400 mb-2 mt-4">$1</h3>') 
      // Remove any remaining bold formatting from explanatory text
      .replace(/\*\*(.*?)\*\*/g, '$1') 
      // Keep italic formatting
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700 dark:text-gray-300">$1</em>') 
      // Add proper paragraph spacing
      .replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed text-gray-800 dark:text-gray-200">') 
      // Handle single line breaks
      .replace(/\n/g, '<br/>'); 
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
                  __html: `<p class="mb-4 leading-relaxed text-gray-800 dark:text-gray-200">${formatLessonContent(currentContent)}</p>`
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
