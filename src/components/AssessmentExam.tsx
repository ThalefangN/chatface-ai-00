
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, ArrowLeft, ArrowRight } from 'lucide-react';

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

const AssessmentExam: React.FC<AssessmentExamProps> = ({ subject, onBack }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);

  const generateQuestions = async (openaiApiKey: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Generate 30 assessment questions for ${subject}. Mix multiple-choice (4 options) and true/false questions. Return a JSON array with this exact structure: [{"id": 1, "question": "Question text", "type": "multiple-choice", "options": ["A", "B", "C", "D"], "correctAnswer": "A", "explanation": "Why this is correct"}, {"id": 2, "question": "Statement", "type": "true-false", "correctAnswer": "true", "explanation": "Explanation"}]. Make sure questions are educational and appropriate for the subject.`
            }
          ],
          temperature: 0.7,
          max_tokens: 4000,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate questions');
      }

      const data = await response.json();
      const generatedQuestions = JSON.parse(data.choices[0].message.content);
      
      // Ensure we have exactly 30 questions
      const questions30 = generatedQuestions.slice(0, 30).map((q: any, index: number) => ({
        ...q,
        id: index + 1,
      }));
      
      setQuestions(questions30);
      setIsLoading(false);
    } catch (error) {
      console.error('Error generating questions:', error);
      // Fallback to sample questions if API fails
      generateFallbackQuestions();
    }
  };

  const generateFallbackQuestions = () => {
    const fallbackQuestions: Question[] = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      question: i % 2 === 0 
        ? `Multiple choice question ${i + 1} for ${subject}?`
        : `True or False: Statement ${i + 1} about ${subject}.`,
      type: i % 2 === 0 ? 'multiple-choice' : 'true-false',
      options: i % 2 === 0 ? ['Option A', 'Option B', 'Option C', 'Option D'] : undefined,
      correctAnswer: i % 2 === 0 ? 'Option A' : 'true',
      explanation: `This is the explanation for question ${i + 1}.`
    }));
    setQuestions(fallbackQuestions);
    setIsLoading(false);
  };

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      setShowApiKeyInput(false);
      generateQuestions(apiKey);
    }
  };

  const handleAnswerChange = (answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questions[currentQuestionIndex].id]: answer
    }));
  };

  const goToNextQuestion = () => {
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

  if (showApiKeyInput) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <Card>
          <CardHeader>
            <CardTitle>OpenAI API Key Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please enter your OpenAI API key to generate assessment questions:
            </p>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your OpenAI API key"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <div className="flex gap-2">
              <Button onClick={handleApiKeySubmit} disabled={!apiKey.trim()}>
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Generating assessment questions...</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    const results = calculateResults();
    
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Assessment Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-4xl font-bold mb-2">
                {results.correct}/{results.total}
              </div>
              <div className="text-xl text-muted-foreground mb-4">
                Score: {results.percentage}%
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

            <div className="text-center mt-6">
              <Button onClick={onBack}>
                Back to Learning
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{subject} Assessment</h1>
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
              value={userAnswers[currentQuestion.id] || ''}
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
          <Button onClick={finishAssessment}>
            Finish Assessment
          </Button>
        ) : (
          <Button onClick={goToNextQuestion}>
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default AssessmentExam;
