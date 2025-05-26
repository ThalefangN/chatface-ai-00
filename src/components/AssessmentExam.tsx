
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, ArrowLeft, RotateCcw, Brain } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

interface AssessmentExamProps {
  onBack: () => void;
}

const AssessmentExam: React.FC<AssessmentExamProps> = ({ onBack }) => {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const generateQuestionsWithRetry = async (prompt: string, attempt = 0): Promise<Question[]> => {
    const maxRetries = 3;
    
    try {
      console.log(`Attempting to generate questions (attempt ${attempt + 1})`);
      
      // Add timeout using Promise.race
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 60000)
      );
      
      const invokePromise = supabase.functions.invoke('ai-study-chat', {
        body: {
          message: prompt,
          systemPrompt: 'You are a helpful AI that generates valid JSON assessment questions. Always respond with properly formatted JSON arrays containing question objects. Ensure all JSON is valid and complete. Do not truncate responses.'
        }
      });

      const { data, error } = await Promise.race([invokePromise, timeoutPromise]) as any;

      if (error) throw error;
      
      if (!data || !data.content) {
        throw new Error('No content received from AI');
      }

      console.log('Raw AI response:', data.content.substring(0, 200));
      
      // Parse the JSON response
      const parsedQuestions = JSON.parse(data.content);
      
      if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
        throw new Error('Invalid questions format received');
      }

      // Validate question structure
      const validQuestions = parsedQuestions.filter(q => 
        q.question && 
        Array.isArray(q.options) && 
        q.options.length >= 2 && 
        typeof q.correct_answer === 'number' &&
        q.correct_answer >= 0 &&
        q.correct_answer < q.options.length
      );

      if (validQuestions.length === 0) {
        throw new Error('No valid questions found in response');
      }

      console.log(`Successfully generated ${validQuestions.length} questions`);
      return validQuestions.map((q, index) => ({ ...q, id: index + 1 }));
      
    } catch (error) {
      console.error(`Error generating questions (attempt ${attempt + 1}):`, error);
      
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        console.log(`Retrying question generation in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return generateQuestionsWithRetry(prompt, attempt + 1);
      }
      
      console.error('Max retries reached for question generation');
      throw error;
    }
  };

  const startAssessment = async () => {
    if (!subject.trim() || !topic.trim()) {
      toast.error('Please enter both subject and topic');
      return;
    }

    setIsGeneratingQuestions(true);
    setHasStarted(true);

    try {
      const prompt = `Generate exactly 10 multiple choice questions for the subject "${subject}" on the topic "${topic}". Return a valid JSON array where each question object has this exact structure:
{
  "question": "The question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct_answer": 0,
  "explanation": "Explanation of why this answer is correct"
}

The correct_answer should be the index (0-3) of the correct option. Make sure all questions are educational and appropriate for the subject level. Ensure the JSON is properly formatted and complete.`;

      const generatedQuestions = await generateQuestionsWithRetry(prompt);
      setQuestions(generatedQuestions);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setShowResults(false);
      toast.success(`Generated ${generatedQuestions.length} questions successfully!`);
      
    } catch (error) {
      console.error('Error generating assessment:', error);
      toast.error('Failed to generate questions. Please try again with a different topic.');
      setHasStarted(false);
      
      // Provide fallback questions for common subjects
      if (subject.toLowerCase().includes('math')) {
        setQuestions([
          {
            id: 1,
            question: "What is 2 + 2?",
            options: ["3", "4", "5", "6"],
            correct_answer: 1,
            explanation: "2 + 2 equals 4. This is basic addition."
          }
        ]);
        toast.info('Using sample question. Please try again for custom questions.');
      }
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const finishAssessment = () => {
    setShowResults(true);
  };

  const resetAssessment = () => {
    setSubject('');
    setTopic('');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setHasStarted(false);
  };

  const calculateScore = () => {
    const correctAnswers = questions.filter(
      question => selectedAnswers[question.id] === question.correct_answer
    ).length;
    return (correctAnswers / questions.length) * 100;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  if (!hasStarted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-500" />
              Start Your Assessment
            </CardTitle>
          </div>
          <p className="text-gray-600">
            Enter the subject and topic you want to be assessed on:
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="e.g., Mathematics, Science, History, Setswana"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={isGeneratingQuestions}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              placeholder="e.g., Algebra, Physics, World War II, Setswana Language"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isGeneratingQuestions && startAssessment()}
              disabled={isGeneratingQuestions}
            />
          </div>
          <Button 
            onClick={startAssessment} 
            className="w-full" 
            disabled={!subject.trim() || !topic.trim() || isGeneratingQuestions}
          >
            {isGeneratingQuestions ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Generating Questions...
              </>
            ) : (
              'Start Assessment'
            )}
          </Button>
          {isGeneratingQuestions && (
            <p className="text-xs text-gray-500 text-center">
              This may take up to 60 seconds to generate custom questions...
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const correctCount = questions.filter(
      question => selectedAnswers[question.id] === question.correct_answer
    ).length;

    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-500" />
              Assessment Results
            </CardTitle>
            <Button variant="outline" onClick={resetAssessment}>
              <RotateCcw className="w-4 h-4 mr-2" />
              New Assessment
            </Button>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-blue-600">
              {score.toFixed(1)}%
            </div>
            <p className="text-gray-600">
              You got {correctCount} out of {questions.length} questions correct
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {questions.map((question, index) => {
              const userAnswer = selectedAnswers[question.id];
              const isCorrect = userAnswer === question.correct_answer;
              
              return (
                <Card key={question.id} className={`border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium mb-2">
                          Question {index + 1}: {question.question}
                        </h4>
                        <div className="space-y-1 mb-3">
                          {question.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className={`p-2 rounded text-sm ${
                                optionIndex === question.correct_answer
                                  ? 'bg-green-100 text-green-800 border border-green-300'
                                  : optionIndex === userAnswer && !isCorrect
                                  ? 'bg-red-100 text-red-800 border border-red-300'
                                  : 'bg-gray-50'
                              }`}
                            >
                              {option}
                              {optionIndex === question.correct_answer && (
                                <span className="ml-2 text-green-600 font-medium">✓ Correct</span>
                              )}
                              {optionIndex === userAnswer && !isCorrect && (
                                <span className="ml-2 text-red-600 font-medium">✗ Your answer</span>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="bg-blue-50 p-3 rounded border-l-4 border-l-blue-400">
                          <p className="text-sm text-blue-800">
                            <strong>Explanation:</strong> {question.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-500" />
            Assessment: {subject} - {topic}
          </CardTitle>
          <div className="text-sm text-gray-500">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>
        <Progress value={progress} className="w-full" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">
            {currentQuestion.question}
          </h3>
          <RadioGroup
            value={selectedAnswers[currentQuestion.id]?.toString() || ''}
            onValueChange={(value) => handleAnswerSelect(currentQuestion.id, parseInt(value))}
          >
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 rounded border hover:bg-gray-50">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={previousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          
          <div className="flex gap-2">
            {currentQuestionIndex === questions.length - 1 ? (
              <Button
                onClick={finishAssessment}
                disabled={!selectedAnswers[currentQuestion.id] && selectedAnswers[currentQuestion.id] !== 0}
              >
                Finish Assessment
              </Button>
            ) : (
              <Button
                onClick={nextQuestion}
                disabled={!selectedAnswers[currentQuestion.id] && selectedAnswers[currentQuestion.id] !== 0}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssessmentExam;
