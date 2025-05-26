import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Clock, BookOpen, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AssessmentExamProps {
  subject: string;
  topic?: string;
  onBack: () => void;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const AssessmentExam: React.FC<AssessmentExamProps> = ({ subject, topic, onBack }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: number}>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    generateQuestions();
  }, [subject, topic]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0 && !isSubmitted) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft, isSubmitted]);

  const generateQuestions = async () => {
    setLoading(true);
    try {
      const assessmentPrompt = topic 
        ? `Generate 10 comprehensive assessment questions for ${subject} focusing on ${topic}. Include multiple choice questions with 4 options each, covering different difficulty levels (basic, intermediate, advanced). Format the response as a JSON array with objects containing: question, options (array of 4 strings), correctAnswer (0-3 index), and explanation.`
        : `Generate 10 comprehensive assessment questions for ${subject}. Include multiple choice questions with 4 options each, covering different difficulty levels (basic, intermediate, advanced). Format the response as a JSON array with objects containing: question, options (array of 4 strings), correctAnswer (0-3 index), and explanation.`;

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 45000)
      );
      
      const invokePromise = supabase.functions.invoke('ai-study-chat', {
        body: {
          message: assessmentPrompt,
          systemPrompt: 'You are an educational assessment expert. Generate comprehensive, fair, and educationally sound assessment questions. Always respond with valid JSON format.'
        }
      });

      const { data, error } = await Promise.race([invokePromise, timeoutPromise]) as any;

      if (error) throw error;

      if (data && data.content) {
        try {
          const parsedQuestions = JSON.parse(data.content);
          if (Array.isArray(parsedQuestions) && parsedQuestions.length > 0) {
            const formattedQuestions = parsedQuestions.map((q, index) => ({
              id: `q_${index}`,
              question: q.question,
              options: q.options,
              correctAnswer: q.correctAnswer,
              explanation: q.explanation
            }));
            setQuestions(formattedQuestions);
            setIsTimerActive(true);
          } else {
            throw new Error('Invalid question format');
          }
        } catch (parseError) {
          console.error('Error parsing questions:', parseError);
          generateFallbackQuestions();
        }
      } else {
        generateFallbackQuestions();
      }
    } catch (error) {
      console.error('Error generating assessment:', error);
      generateFallbackQuestions();
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackQuestions = () => {
    const fallbackQuestions = [
      {
        id: 'fallback_1',
        question: `What is a fundamental concept in ${subject}?`,
        options: [
          'Basic principles and foundations',
          'Advanced theoretical frameworks',
          'Historical development only',
          'Modern applications only'
        ],
        correctAnswer: 0,
        explanation: 'Understanding fundamental concepts is essential for building knowledge in any subject.'
      },
      {
        id: 'fallback_2',
        question: `Which approach is most effective for learning ${subject}?`,
        options: [
          'Memorization only',
          'Understanding concepts and practice',
          'Reading textbooks only',
          'Watching videos only'
        ],
        correctAnswer: 1,
        explanation: 'Combining conceptual understanding with practice is the most effective learning approach.'
      }
    ];
    setQuestions(fallbackQuestions);
    setIsTimerActive(true);
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    if (!isSubmitted) {
      setSelectedAnswers(prev => ({
        ...prev,
        [questionIndex]: answerIndex
      }));
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setIsTimerActive(false);
    const correctCount = questions.reduce((count, question, index) => {
      return selectedAnswers[index] === question.correctAnswer ? count + 1 : count;
    }, 0);
    
    toast.success(`Assessment completed! You scored ${correctCount}/${questions.length}`);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getScoreColor = () => {
    const correctCount = questions.reduce((count, question, index) => {
      return selectedAnswers[index] === question.correctAnswer ? count + 1 : count;
    }, 0);
    const percentage = (correctCount / questions.length) * 100;
    
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="text-gray-600">Generating your personalized assessment...</p>
        <p className="text-sm text-gray-400">This may take up to 45 seconds</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Unable to generate assessment questions.</p>
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Learning
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="outline" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4" />
            <span className={timeLeft < 300 ? 'text-red-600 font-semibold' : 'text-gray-600'}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <BookOpen className="w-4 h-4" />
            <span className="text-gray-600">{subject} Assessment</span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">
              Question {currentQuestion + 1} of {questions.length}
            </CardTitle>
            <Progress value={((currentQuestion + 1) / questions.length) * 100} className="w-32" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-lg font-medium">
            {questions[currentQuestion]?.question}
          </div>
          
          <RadioGroup
            value={selectedAnswers[currentQuestion]?.toString() || ''}
            onValueChange={(value) => handleAnswerSelect(currentQuestion, parseInt(value))}
            disabled={isSubmitted}
          >
            {questions[currentQuestion]?.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label 
                  htmlFor={`option-${index}`} 
                  className="flex-1 cursor-pointer"
                >
                  {option}
                </Label>
                {isSubmitted && (
                  <div className="ml-2">
                    {index === questions[currentQuestion].correctAnswer ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : selectedAnswers[currentQuestion] === index ? (
                      <XCircle className="w-5 h-5 text-red-600" />
                    ) : null}
                  </div>
                )}
              </div>
            ))}
          </RadioGroup>

          {isSubmitted && questions[currentQuestion]?.explanation && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-800 mb-2">Explanation:</p>
              <p className="text-sm text-blue-700">{questions[currentQuestion].explanation}</p>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              variant="outline"
            >
              Previous
            </Button>
            
            {currentQuestion === questions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitted || Object.keys(selectedAnswers).length !== questions.length}
                className="bg-green-600 hover:bg-green-700"
              >
                Submit Assessment
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
                disabled={currentQuestion === questions.length - 1}
              >
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {isSubmitted && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Assessment Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className={`text-4xl font-bold ${getScoreColor()}`}>
                {questions.reduce((count, question, index) => {
                  return selectedAnswers[index] === question.correctAnswer ? count + 1 : count;
                }, 0)} / {questions.length}
              </div>
              <div className="text-lg text-gray-600">
                {Math.round((questions.reduce((count, question, index) => {
                  return selectedAnswers[index] === question.correctAnswer ? count + 1 : count;
                }, 0) / questions.length) * 100)}% Correct
              </div>
              <Button onClick={onBack} className="mt-4">
                Continue Learning
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AssessmentExam;
