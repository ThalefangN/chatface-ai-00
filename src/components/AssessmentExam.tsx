
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, ArrowLeft, ArrowRight, BookOpen, Target } from 'lucide-react';
import { Input } from '@/components/ui/input';

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
  const [isLoading, setIsLoading] = useState(false);
  const [showSubjectInput, setShowSubjectInput] = useState(true);
  const [customSubject, setCustomSubject] = useState('');
  const [customTopic, setCustomTopic] = useState('');

  // OpenAI API Key - directly embedded
  const OPENAI_API_KEY = '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';

  const generateQuestions = async (subjectInput: string, topicInput: string) => {
    try {
      setIsLoading(true);
      const prompt = `Generate exactly 30 assessment questions for the subject "${subjectInput}" and topic "${topicInput}". 
      
      Mix multiple-choice (4 options) and true/false questions. 
      
      Return ONLY a valid JSON array with this exact structure (no markdown formatting, no backticks):
      [
        {
          "id": 1,
          "question": "What is the question text?",
          "type": "multiple-choice",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": "Option A",
          "explanation": "Explanation of why this is correct"
        },
        {
          "id": 2,
          "question": "True or false statement?",
          "type": "true-false",
          "correctAnswer": "true",
          "explanation": "Explanation of the answer"
        }
      ]
      
      Make sure:
      - Questions are educational and appropriate
      - Each multiple-choice has exactly 4 options
      - True/false questions have correctAnswer as "true" or "false"
      - All questions have clear explanations
      - Return exactly 30 questions`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an expert assessment creator. Return only valid JSON without any markdown formatting or code blocks.'
            },
            {
              role: 'user',
              content: prompt
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
      let content = data.choices[0].message.content.trim();
      
      // Clean up any markdown formatting
      content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      console.log('Raw API response:', content);
      
      const generatedQuestions = JSON.parse(content);
      
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
      generateFallbackQuestions(subjectInput, topicInput);
    }
  };

  const generateFallbackQuestions = (subjectInput: string, topicInput: string) => {
    const fallbackQuestions: Question[] = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      question: i % 2 === 0 
        ? `Multiple choice question ${i + 1} about ${topicInput} in ${subjectInput}?`
        : `True or False: Statement ${i + 1} about ${topicInput} in ${subjectInput}.`,
      type: i % 2 === 0 ? 'multiple-choice' : 'true-false',
      options: i % 2 === 0 ? ['Option A', 'Option B', 'Option C', 'Option D'] : undefined,
      correctAnswer: i % 2 === 0 ? 'Option A' : 'true',
      explanation: `This is the explanation for question ${i + 1} about ${topicInput}.`
    }));
    setQuestions(fallbackQuestions);
    setIsLoading(false);
  };

  const handleSubjectSubmit = () => {
    if (customSubject.trim() && customTopic.trim()) {
      setShowSubjectInput(false);
      generateQuestions(customSubject, customTopic);
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

  const getGradeLevel = (percentage: number) => {
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-600', message: 'Excellent! Outstanding performance!' };
    if (percentage >= 80) return { grade: 'A', color: 'text-green-500', message: 'Great job! Well done!' };
    if (percentage >= 70) return { grade: 'B', color: 'text-blue-500', message: 'Good work! Keep it up!' };
    if (percentage >= 60) return { grade: 'C', color: 'text-yellow-500', message: 'Fair performance. Room for improvement.' };
    if (percentage >= 50) return { grade: 'D', color: 'text-orange-500', message: 'Below average. Consider reviewing the material.' };
    return { grade: 'F', color: 'text-red-500', message: 'Poor performance. Please review and try again.' };
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Generating assessment questions for {customSubject} - {customTopic}...</p>
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
              <div className="text-6xl font-bold mb-2 ${gradeInfo.color}">
                {gradeInfo.grade}
              </div>
              <div className="text-2xl font-semibold mb-2">
                {results.correct}/{results.total} Correct
              </div>
              <div className="text-xl text-muted-foreground mb-4">
                Score: {results.percentage}%
              </div>
              <div className="text-lg ${gradeInfo.color} font-medium mb-4">
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

  return (
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
