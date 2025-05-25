import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, ArrowLeft, ArrowRight, BookOpen, Target, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Question {
  id: number;
  question: string;
  type: 'multiple-choice' | 'true-false';
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

interface AssessmentExamProps {
  subject: string;
  onBack: () => void;
}

const PencilLoadingAnimation = () => {
  return (
    <div className="flex items-center justify-center">
      <style dangerouslySetInnerHTML={{
        __html: `
          .pencil {
            display: block;
            width: 10em;
            height: 10em;
          }

          .pencil__body1,
          .pencil__body2,
          .pencil__body3,
          .pencil__eraser,
          .pencil__eraser-skew,
          .pencil__point,
          .pencil__rotate,
          .pencil__stroke {
            animation-duration: 3s;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
          }

          .pencil__body1,
          .pencil__body2,
          .pencil__body3 {
            transform: rotate(-90deg);
          }

          .pencil__body1 {
            animation-name: pencilBody1;
          }

          .pencil__body2 {
            animation-name: pencilBody2;
          }

          .pencil__body3 {
            animation-name: pencilBody3;
          }

          .pencil__eraser {
            animation-name: pencilEraser;
            transform: rotate(-90deg) translate(49px,0);
          }

          .pencil__eraser-skew {
            animation-name: pencilEraserSkew;
            animation-timing-function: ease-in-out;
          }

          .pencil__point {
            animation-name: pencilPoint;
            transform: rotate(-90deg) translate(49px,-30px);
          }

          .pencil__rotate {
            animation-name: pencilRotate;
          }

          .pencil__stroke {
            animation-name: pencilStroke;
            transform: translate(100px,100px) rotate(-113deg);
          }

          @keyframes pencilBody1 {
            from,
            to {
              stroke-dashoffset: 351.86;
              transform: rotate(-90deg);
            }

            50% {
              stroke-dashoffset: 150.8;
              transform: rotate(-225deg);
            }
          }

          @keyframes pencilBody2 {
            from,
            to {
              stroke-dashoffset: 406.84;
              transform: rotate(-90deg);
            }

            50% {
              stroke-dashoffset: 174.36;
              transform: rotate(-225deg);
            }
          }

          @keyframes pencilBody3 {
            from,
            to {
              stroke-dashoffset: 296.88;
              transform: rotate(-90deg);
            }

            50% {
              stroke-dashoffset: 127.23;
              transform: rotate(-225deg);
            }
          }

          @keyframes pencilEraser {
            from,
            to {
              transform: rotate(-45deg) translate(49px,0);
            }

            50% {
              transform: rotate(0deg) translate(49px,0);
            }
          }

          @keyframes pencilEraserSkew {
            from,
            32.5%,
            67.5%,
            to {
              transform: skewX(0);
            }

            35%,
            65% {
              transform: skewX(-4deg);
            }

            37.5%, 
            62.5% {
              transform: skewX(8deg);
            }

            40%,
            45%,
            50%,
            55%,
            60% {
              transform: skewX(-15deg);
            }

            42.5%,
            47.5%,
            52.5%,
            57.5% {
              transform: skewX(15deg);
            }
          }

          @keyframes pencilPoint {
            from,
            to {
              transform: rotate(-90deg) translate(49px,-30px);
            }

            50% {
              transform: rotate(-225deg) translate(49px,-30px);
            }
          }

          @keyframes pencilRotate {
            from {
              transform: translate(100px,100px) rotate(0);
            }

            to {
              transform: translate(100px,100px) rotate(720deg);
            }
          }

          @keyframes pencilStroke {
            from {
              stroke-dashoffset: 439.82;
              transform: translate(100px,100px) rotate(-113deg);
            }

            50% {
              stroke-dashoffset: 164.93;
              transform: translate(100px,100px) rotate(-113deg);
            }

            75%,
            to {
              stroke-dashoffset: 439.82;
              transform: translate(100px,100px) rotate(112deg);
            }
          }
        `
      }} />
      <svg xmlns="http://www.w3.org/2000/svg" height="200px" width="200px" viewBox="0 0 200 200" className="pencil">
        <defs>
          <clipPath id="pencil-eraser">
            <rect height="30" width="30" ry="5" rx="5"></rect>
          </clipPath>
        </defs>
        <circle transform="rotate(-113,100,100)" strokeLinecap="round" strokeDashoffset="439.82" strokeDasharray="439.82 439.82" strokeWidth="2" stroke="currentColor" fill="none" r="70" className="pencil__stroke"></circle>
        <g transform="translate(100,100)" className="pencil__rotate">
          <g fill="none">
            <circle transform="rotate(-90)" strokeDashoffset="402" strokeDasharray="402.12 402.12" strokeWidth="30" stroke="hsl(223,90%,50%)" r="64" className="pencil__body1"></circle>
            <circle transform="rotate(-90)" strokeDashoffset="465" strokeDasharray="464.96 464.96" strokeWidth="10" stroke="hsl(223,90%,60%)" r="74" className="pencil__body2"></circle>
            <circle transform="rotate(-90)" strokeDashoffset="339" strokeDasharray="339.29 339.29" strokeWidth="10" stroke="hsl(223,90%,40%)" r="54" className="pencil__body3"></circle>
          </g>
          <g transform="rotate(-90) translate(49,0)" className="pencil__eraser">
            <g className="pencil__eraser-skew">
              <rect height="30" width="30" ry="5" rx="5" fill="hsl(223,90%,70%)"></rect>
              <rect clipPath="url(#pencil-eraser)" height="30" width="5" fill="hsl(223,90%,60%)"></rect>
              <rect height="20" width="30" fill="hsl(223,10%,90%)"></rect>
              <rect height="20" width="15" fill="hsl(223,10%,70%)"></rect>
              <rect height="20" width="5" fill="hsl(223,10%,80%)"></rect>
              <rect height="2" width="30" y="6" fill="hsla(223,10%,10%,0.2)"></rect>
              <rect height="2" width="30" y="13" fill="hsla(223,10%,10%,0.2)"></rect>
            </g>
          </g>
          <g transform="rotate(-90) translate(49,-30)" className="pencil__point">
            <polygon points="15 0,30 30,0 30" fill="hsl(33,90%,70%)"></polygon>
            <polygon points="15 0,6 30,0 30" fill="hsl(33,90%,50%)"></polygon>
            <polygon points="15 0,20 10,10 10" fill="hsl(223,10%,10%)"></polygon>
          </g>
        </g>
      </svg>
    </div>
  );
};

const AssessmentExam: React.FC<AssessmentExamProps> = ({ subject, onBack }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSubjectInput, setShowSubjectInput] = useState(true);
  const [customSubject, setCustomSubject] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const generateQuestions = async (subjectInput: string, topicInput: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('ai-study-chat', {
        body: {
          message: `Generate exactly 30 assessment questions for the subject "${subjectInput}" and topic "${topicInput}". 
          
          Create a mix of multiple-choice (4 options each) and true/false questions about ${topicInput} in ${subjectInput}.
          
          Return ONLY a valid JSON array with this exact structure (no markdown formatting, no backticks, no explanation):
          [
            {
              "id": 1,
              "question": "What is 2 + 2?",
              "type": "multiple-choice",
              "options": ["3", "4", "5", "6"],
              "correctAnswer": "4",
              "explanation": "2 + 2 equals 4 because addition combines quantities."
            },
            {
              "id": 2,
              "question": "The sum of two even numbers is always even.",
              "type": "true-false",
              "correctAnswer": "true",
              "explanation": "When you add two even numbers, the result is always even."
            }
          ]
          
          Requirements:
          - Exactly 30 questions total
          - Mix of multiple-choice and true/false
          - Each multiple-choice has exactly 4 options
          - True/false questions have correctAnswer as "true" or "false"
          - All questions have clear, educational explanations
          - Questions should be appropriate difficulty level
          - Return ONLY the JSON array, no other text`,
          systemPrompt: 'You are an expert assessment creator. You must return ONLY valid JSON without any markdown formatting, code blocks, or additional text. The response should start with [ and end with ].'
        }
      });

      if (error) throw error;

      let content = data.content.trim();
      
      // Clean up any markdown formatting that might slip through
      content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      // Remove any text before the JSON array
      const jsonStart = content.indexOf('[');
      const jsonEnd = content.lastIndexOf(']') + 1;
      
      if (jsonStart !== -1 && jsonEnd !== -1) {
        content = content.substring(jsonStart, jsonEnd);
      }
      
      console.log('Cleaned AI response:', content);
      
      try {
        const generatedQuestions = JSON.parse(content);
        
        if (!Array.isArray(generatedQuestions) || generatedQuestions.length === 0) {
          throw new Error('Invalid questions format');
        }
        
        // Ensure we have exactly 30 questions and proper formatting
        const questions30 = generatedQuestions.slice(0, 30).map((q: any, index: number) => ({
          id: index + 1,
          question: q.question || `Question ${index + 1}`,
          type: q.type || (index % 2 === 0 ? 'multiple-choice' : 'true-false'),
          options: q.type === 'multiple-choice' ? (q.options || ['Option A', 'Option B', 'Option C', 'Option D']) : undefined,
          correctAnswer: q.correctAnswer || (q.type === 'true-false' ? 'true' : 'Option A'),
          explanation: q.explanation || `This is the explanation for question ${index + 1}.`
        }));
        
        if (questions30.length < 30) {
          // Fill remaining questions if needed
          while (questions30.length < 30) {
            const index = questions30.length;
            questions30.push({
              id: index + 1,
              question: `Additional ${subjectInput} question about ${topicInput}?`,
              type: index % 2 === 0 ? 'multiple-choice' : 'true-false',
              options: index % 2 === 0 ? [
                `Basic concept of ${topicInput}`,
                `Advanced theory in ${topicInput}`,
                `Application of ${topicInput}`,
                `None of the above`
              ] : undefined,
              correctAnswer: index % 2 === 0 ? `Basic concept of ${topicInput}` : 'true',
              explanation: `This covers important concepts in ${topicInput}.`
            });
          }
        }
        
        setQuestions(questions30);
        toast.success(`Generated ${questions30.length} questions successfully!`);
        
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        throw new Error('Failed to parse AI response');
      }
      
    } catch (error) {
      console.error('Error generating questions:', error);
      toast.error('Failed to generate questions. Creating sample questions instead.');
      // Generate fallback questions
      generateFallbackQuestions(subjectInput, topicInput);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questions[currentQuestionIndex].id]: answer
    }));
  };

  const goToNextQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const currentAnswer = userAnswers[currentQuestion.id];
    
    if (!currentAnswer) {
      toast.error('Please answer the current question before proceeding to the next one.');
      return;
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const finishAssessment = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const currentAnswer = userAnswers[currentQuestion.id];
    
    if (!currentAnswer) {
      toast.error('Please answer the current question before finishing the assessment.');
      return;
    }
    
    // Show success dialog first
    setShowSuccessDialog(true);
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    // Then show results
    setShowResults(true);
  };

  const calculateResults = () => {
    const correctAnswers = questions.filter(q => 
      userAnswers[q.id] === q.correctAnswer
    ).length;
    return {
      correct: correctAnswers,
      total: questions.length,
      percentage: Math.round((correctAnswers / questions.length) * 100)
    };
  };

  const getGradeLevel = (percentage: number) => {
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-600', message: 'Excellent! Outstanding performance!' };
    if (percentage >= 80) return { grade: 'A', color: 'text-green-500', message: 'Great job! Well done!' };
    if (percentage >= 70) return { grade: 'B', color: 'text-blue-500', message: 'Good work! Keep it up!' };
    if (percentage >= 60) return { grade: 'C', color: 'text-yellow-500', message: 'Fair performance. Room for improvement.' };
    if (percentage >= 50) return { grade: 'D', color: 'text-orange-500', message: 'Below average. Consider reviewing the material.' };
    return { grade: 'F', color: 'text-red-500', message: 'Poor performance. Please review and try again.' };
  };

  const generateFallbackQuestions = (subjectInput: string, topicInput: string) => {
    const fallbackQuestions: Question[] = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      question: i % 2 === 0 
        ? `What is an important concept in ${topicInput} within ${subjectInput}?`
        : `${topicInput} is a fundamental part of ${subjectInput}.`,
      type: i % 2 === 0 ? 'multiple-choice' : 'true-false',
      options: i % 2 === 0 ? [
        `Basic concept of ${topicInput}`,
        `Advanced theory in ${topicInput}`,
        `Application of ${topicInput}`,
        `None of the above`
      ] : undefined,
      correctAnswer: i % 2 === 0 ? `Basic concept of ${topicInput}` : 'true',
      explanation: `This question tests your understanding of ${topicInput} in ${subjectInput}.`
    }));
    setQuestions(fallbackQuestions);
    toast.success('Sample questions created for demonstration.');
  };

  const handleSubjectSubmit = () => {
    if (customSubject.trim() && customTopic.trim()) {
      setShowSubjectInput(false);
      generateQuestions(customSubject, customTopic);
    }
  };

  if (showSubjectInput) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Start Your Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enter the subject and topic you want to be assessed on:
            </p>
            <div className="space-y-3">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="e.g., Mathematics, Science, History"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="e.g., Algebra, Physics, World War II"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleSubjectSubmit} 
                disabled={!customSubject.trim() || !customTopic.trim()}
                className="flex-1"
              >
                <Target className="w-4 h-4 mr-2" />
                Start Assessment
              </Button>
              <Button variant="outline" onClick={onBack}>
                Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <PencilLoadingAnimation />
          <p className="mt-4">Generating assessment questions for {customSubject} - {customTopic}...</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    const results = calculateResults();
    const gradeInfo = getGradeLevel(results.percentage);
    
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Assessment Results</CardTitle>
            <div className="text-center text-sm text-muted-foreground">
              {customSubject} - {customTopic}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className={`text-6xl font-bold mb-2 ${gradeInfo.color}`}>
                {gradeInfo.grade}
              </div>
              <div className="text-2xl font-semibold mb-2">
                {results.correct}/{results.total} Correct
              </div>
              <div className="text-xl text-muted-foreground mb-4">
                Score: {results.percentage}%
              </div>
              <div className={`text-lg ${gradeInfo.color} font-medium mb-4`}>
                {gradeInfo.message}
              </div>
              <Progress value={results.percentage} className="w-full max-w-md mx-auto" />
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {questions.map((question) => {
                const userAnswer = userAnswers[question.id];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <Card key={question.id} className={`border ${isCorrect ? 'border-green-200' : 'border-red-200'}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium mb-2">Q{question.id}: {question.question}</p>
                          <p className="text-sm text-muted-foreground mb-1">
                            Your answer: {userAnswer || 'Not answered'}
                          </p>
                          <p className="text-sm text-green-600 mb-2">
                            Correct answer: {question.correctAnswer}
                          </p>
                          <p className="text-sm text-gray-600">
                            {question.explanation}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="text-center mt-6 space-y-3">
              <Button onClick={onBack} size="lg">
                Back to Learning
              </Button>
              <div className="text-sm text-muted-foreground">
                Great work on completing the assessment!
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const currentAnswer = userAnswers[currentQuestion?.id];

  return (
    <>
      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">{customSubject} Assessment</h1>
              <p className="text-sm text-muted-foreground">{customTopic}</p>
            </div>
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-medium">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <Progress value={progress} className="flex-1" />
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Question {currentQuestionIndex + 1}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-lg">{currentQuestion.question}</p>
              
              <RadioGroup
                value={currentAnswer || ''}
                onValueChange={handleAnswerChange}
              >
                {currentQuestion.type === 'multiple-choice' ? (
                  currentQuestion.options?.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="true" />
                      <Label htmlFor="true" className="cursor-pointer">True</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="false" />
                      <Label htmlFor="false" className="cursor-pointer">False</Label>
                    </div>
                  </>
                )}
              </RadioGroup>
              
              {!currentAnswer && (
                <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                  Please select an answer to proceed to the next question.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {currentQuestionIndex === questions.length - 1 ? (
            <Button 
              onClick={finishAssessment}
              className={!currentAnswer ? 'opacity-50' : ''}
            >
              Finish Assessment
            </Button>
          ) : (
            <Button 
              onClick={goToNextQuestion}
              className={!currentAnswer ? 'opacity-50' : ''}
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="max-w-[360px]">
          <AlertDialogHeader>
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-green-50">
              <CheckCircle2 className="size-6 text-green-600" />
            </div>
            <AlertDialogTitle className="text-center">
              Assessment Completed!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              <span>
                Congratulations! You have successfully completed your {customSubject} assessment on {customTopic}. 
                Click below to view your results and detailed feedback.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              className="w-full bg-[#2563eb] hover:bg-[#2563eb]/90"
              onClick={handleSuccessDialogClose}
            >
              View Results
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AssessmentExam;
