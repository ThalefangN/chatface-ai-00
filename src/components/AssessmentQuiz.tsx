
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Clock, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  type: 'multiple-choice' | 'true-false';
}

interface AssessmentQuizProps {
  subject: string;
  onComplete: (score: number, total: number) => void;
  onBack: () => void;
}

const AssessmentQuiz: React.FC<AssessmentQuizProps> = ({ subject, onComplete, onBack }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    generateQuestions();
  }, [subject]);

  const generateQuestions = async () => {
    try {
      setIsLoading(true);
      
      // This would normally call your OpenAI API
      // For now, I'll create mock questions to demonstrate the functionality
      const mockQuestions: Question[] = [
        {
          id: 1,
          question: "What is the capital city of Botswana?",
          options: ["Gaborone", "Francistown", "Maun", "Kasane"],
          correctAnswer: 0,
          explanation: "Gaborone is the capital and largest city of Botswana.",
          type: 'multiple-choice'
        },
        {
          id: 2,
          question: "Botswana is a landlocked country.",
          options: ["True", "False"],
          correctAnswer: 0,
          explanation: "Botswana is indeed a landlocked country in Southern Africa.",
          type: 'true-false'
        },
        {
          id: 3,
          question: "What is the main language spoken in Botswana?",
          options: ["English", "Setswana", "Afrikaans", "Portuguese"],
          correctAnswer: 1,
          explanation: "Setswana is the national language of Botswana, though English is also official.",
          type: 'multiple-choice'
        }
      ];

      // Generate 30 questions by repeating and modifying the mock questions
      const generatedQuestions: Question[] = [];
      for (let i = 0; i < 30; i++) {
        const baseQuestion = mockQuestions[i % mockQuestions.length];
        generatedQuestions.push({
          ...baseQuestion,
          id: i + 1,
          question: `Question ${i + 1}: ${baseQuestion.question}`
        });
      }

      setQuestions(generatedQuestions);
      setIsLoading(false);
      
    } catch (error) {
      console.error('Error generating questions:', error);
      toast.error('Failed to generate questions');
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Calculate score
    let correctAnswers = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    setScore(correctAnswers);
    setShowResults(true);
    setIsSubmitting(false);
    onComplete(correctAnswers, questions.length);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isAnswered = currentQuestion && answers[currentQuestion.id] !== undefined;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-sm text-gray-600">Generating your assessment questions...</p>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold">Assessment Complete!</h2>
          <div className="space-y-2">
            <p className="text-lg">
              You scored <span className="font-bold text-green-600">{score}</span> out of{' '}
              <span className="font-bold">{questions.length}</span>
            </p>
            <p className="text-sm text-gray-600">
              {((score / questions.length) * 100).toFixed(1)}% correct
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Review Your Answers</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {questions.map((question, index) => {
              const userAnswer = answers[question.id];
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <Card key={question.id} className={`border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                      )}
                      <div className="flex-1 space-y-2">
                        <p className="text-sm font-medium">{question.question}</p>
                        <p className="text-xs text-gray-600">
                          Your answer: {question.options[userAnswer]} 
                          {!isCorrect && (
                            <span className="text-red-600">
                              {' '}(Correct: {question.options[question.correctAnswer]})
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-blue-600">{question.explanation}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={onBack} variant="outline" className="flex-1">
            Back to Assessment
          </Button>
          <Button onClick={() => window.location.reload()} className="flex-1">
            Take Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Assessment Quiz</h2>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      {currentQuestion && (
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={answers[currentQuestion.id]?.toString()}
                onValueChange={(value) => handleAnswerSelect(currentQuestion.id, parseInt(value))}
                className="space-y-3"
              >
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          variant="outline"
        >
          Previous
        </Button>

        <div className="flex gap-2">
          {isLastQuestion ? (
            <Button
              onClick={handleSubmit}
              disabled={!isAnswered || isSubmitting}
              className="min-w-24"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                'Submit'
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!isAnswered}
            >
              Next
            </Button>
          )}
        </div>
      </div>

      {/* Question Navigation Dots */}
      <div className="flex flex-wrap gap-2 justify-center">
        {questions.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentQuestionIndex(index)}
            className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
              index === currentQuestionIndex
                ? 'bg-primary text-primary-foreground'
                : answers[questions[index].id] !== undefined
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AssessmentQuiz;
