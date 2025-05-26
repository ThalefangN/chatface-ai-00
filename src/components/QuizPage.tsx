
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Brain, CheckCircle, XCircle, Trophy, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Course {
  id: string;
  name: string;
  gradeLevel: string;
  objectives: string[];
  currentLesson: number;
  totalLessons: number;
}

interface QuizQuestion {
  id: number;
  type: 'multiple' | 'theory' | 'practical';
  question: string;
  options?: string[];
  correctAnswer?: string;
  points: number;
}

interface QuizPageProps {
  course: Course;
  lessonNumber: number;
  onComplete: (passed: boolean) => void;
  onBack: () => void;
}

const QuizPage: React.FC<QuizPageProps> = ({ course, lessonNumber, onComplete, onBack }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    generateQuiz();
  }, []);

  const generateQuiz = async () => {
    setIsLoading(true);
    try {
      const objective = course.objectives[lessonNumber - 1];
      
      // Generate sample quiz questions based on lesson
      const sampleQuestions: QuizQuestion[] = [
        {
          id: 1,
          type: 'multiple',
          question: `Which of the following best describes the main concept in "${objective}"?`,
          options: [
            'A fundamental principle that guides understanding',
            'An optional consideration',
            'A complex theory with no practical application',
            'A basic definition only'
          ],
          correctAnswer: 'A fundamental principle that guides understanding',
          points: 10
        },
        {
          id: 2,
          type: 'theory',
          question: `Explain how the concepts from "${objective}" can be applied in real-world situations. Provide at least two examples.`,
          points: 15
        },
        {
          id: 3,
          type: 'multiple',
          question: `What is the most important skill gained from studying "${objective}"?`,
          options: [
            'Memorization of facts',
            'Critical thinking and analysis',
            'Basic recognition',
            'None of the above'
          ],
          correctAnswer: 'Critical thinking and analysis',
          points: 10
        },
        {
          id: 4,
          type: 'practical',
          question: `Describe a step-by-step approach to solve a problem using the principles from "${objective}". Show your working.`,
          points: 15
        }
      ];

      setQuestions(sampleQuestions);
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast.error('Failed to generate quiz');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitQuiz();
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitQuiz = async () => {
    setIsLoading(true);
    
    let totalScore = 0;
    let maxScore = 0;
    
    questions.forEach(question => {
      maxScore += question.points;
      const userAnswer = answers[question.id];
      
      if (question.type === 'multiple' && userAnswer === question.correctAnswer) {
        totalScore += question.points;
      } else if (question.type === 'theory' || question.type === 'practical') {
        // For theory/practical questions, give partial credit if answered
        if (userAnswer && userAnswer.trim().length > 20) {
          totalScore += Math.floor(question.points * 0.7); // 70% for effort
        }
      }
    });

    const percentage = (totalScore / maxScore) * 100;
    const passed = percentage >= 60;

    setScore(percentage);
    
    if (passed) {
      setFeedback(`Excellent work! You scored ${percentage.toFixed(1)}% and have successfully completed this lesson. You're ready to move on to the next lesson.`);
    } else {
      setFeedback(`You scored ${percentage.toFixed(1)}%. To pass this lesson, you need at least 60%. Please review the lesson content and retake the quiz when you're ready.`);
    }

    setShowResults(true);
    setIsLoading(false);
  };

  if (isLoading && questions.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lesson
          </Button>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Generating quiz questions...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResults) {
    const passed = score >= 60;
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lesson
          </Button>
        </div>

        <Card className={`border-2 ${passed ? 'border-green-200 bg-green-50 dark:bg-green-900/20' : 'border-red-200 bg-red-50 dark:bg-red-900/20'}`}>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {passed ? (
                <Trophy className="w-16 h-16 text-yellow-500" />
              ) : (
                <AlertCircle className="w-16 h-16 text-red-500" />
              )}
            </div>
            <CardTitle className={`text-2xl ${passed ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
              {passed ? 'Congratulations!' : 'Keep Trying!'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className={`text-4xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>
              {score.toFixed(1)}%
            </div>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {feedback}
            </p>
            <div className="flex gap-4 justify-center">
              {passed ? (
                <Button onClick={() => onComplete(true)} className="bg-green-600 hover:bg-green-700">
                  Continue to Next Lesson
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={onBack}>
                    Review Lesson
                  </Button>
                  <Button onClick={() => onComplete(false)} className="bg-blue-600 hover:bg-blue-700">
                    Retake Quiz
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Lesson
        </Button>
        <Badge variant="secondary" className="px-4 py-2">
          Question {currentQuestion + 1} of {questions.length}
        </Badge>
      </div>

      {/* Progress */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Quiz Header */}
      <Card className="border-2 border-purple-200 bg-purple-50 dark:bg-purple-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-300">
            <Brain className="w-6 h-6" />
            Quiz: Lesson {lessonNumber}
          </CardTitle>
          <p className="text-purple-600 dark:text-purple-400">
            Test your understanding of the lesson concepts
          </p>
        </CardHeader>
      </Card>

      {/* Question */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge className={`${currentQ?.type === 'multiple' ? 'bg-blue-500' : currentQ?.type === 'theory' ? 'bg-green-500' : 'bg-purple-500'}`}>
              {currentQ?.type === 'multiple' ? 'Multiple Choice' : currentQ?.type === 'theory' ? 'Theory' : 'Practical'}
            </Badge>
            <Badge variant="outline">{currentQ?.points} points</Badge>
          </div>
          <CardTitle className="text-lg">{currentQ?.question}</CardTitle>
        </CardHeader>
        <CardContent>
          {currentQ?.type === 'multiple' ? (
            <RadioGroup 
              value={answers[currentQ.id] || ''} 
              onValueChange={(value) => handleAnswerChange(currentQ.id, value)}
            >
              {currentQ.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <Textarea
              placeholder="Enter your answer here..."
              value={answers[currentQ?.id] || ''}
              onChange={(e) => handleAnswerChange(currentQ?.id, e.target.value)}
              rows={6}
              className="min-h-32"
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevQuestion}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        <Button onClick={handleNextQuestion} disabled={isLoading}>
          {currentQuestion === questions.length - 1 ? 'Submit Quiz' : 'Next Question'}
        </Button>
      </div>
    </div>
  );
};

export default QuizPage;
