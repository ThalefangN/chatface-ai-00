import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, ArrowLeft, ArrowRight, BookOpen, Target, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  type: 'multiple-choice' | 'true-false' | 'theory';
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

interface TheoryEvaluation {
  isCorrect: boolean;
  feedback: string;
  score: number; // 0-100
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
  const [theoryEvaluations, setTheoryEvaluations] = useState<{ [key: number]: TheoryEvaluation }>({});
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showSubjectInput, setShowSubjectInput] = useState(true);
  const [customSubject, setCustomSubject] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const generateQuestions = async (subjectInput: string, topicInput: string) => {
    try {
      setIsLoading(true);
      
      console.log('Generating questions for:', { subjectInput, topicInput });
      
      const questionCount = Math.floor(Math.random() * 11) + 20; // 20-30 questions
      const theoryQuestionCount = Math.floor(questionCount * 0.2); // 20% theory questions
      const mcAndTfCount = questionCount - theoryQuestionCount;
      
      const prompt = `Create ${questionCount} educational assessment questions for "${subjectInput}" focusing on "${topicInput}".

Requirements:
- ${mcAndTfCount} multiple-choice and true/false questions
- ${theoryQuestionCount} theory questions requiring written responses
- Return ONLY a valid JSON array with no additional text
- Each question must have: id, question, type, correctAnswer, explanation
- Multiple-choice questions need an "options" array with 4 choices
- Theory questions should have detailed sample answers in correctAnswer

Example format:
[
  {
    "id": 1,
    "question": "What is the capital of Botswana?",
    "type": "multiple-choice",
    "options": ["Gaborone", "Francistown", "Maun", "Kasane"],
    "correctAnswer": "Gaborone",
    "explanation": "Gaborone is the capital and largest city of Botswana."
  },
  {
    "id": 2,
    "question": "Setswana is the national language of Botswana.",
    "type": "true-false",
    "correctAnswer": "true",
    "explanation": "Setswana is indeed the national language of Botswana alongside English."
  },
  {
    "id": 3,
    "question": "Explain the importance of traditional greetings in Setswana culture.",
    "type": "theory",
    "correctAnswer": "Traditional greetings in Setswana culture are essential for showing respect and maintaining social harmony. They demonstrate cultural values, build relationships, and preserve heritage. Common greetings like 'Dumela' show politeness and acknowledgment of others' presence.",
    "explanation": "This tests understanding of cultural significance and social norms."
  }
]

Return ONLY the JSON array starting with [ and ending with ].`;

      const { data, error } = await supabase.functions.invoke('ai-study-chat', {
        body: {
          message: prompt,
          systemPrompt: 'You are an expert assessment creator. Generate educational questions and return ONLY a valid JSON array. No markdown, no explanations, just the JSON array starting with [ and ending with ].'
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`API Error: ${error.message}`);
      }

      console.log('Raw AI response:', data);
      
      if (!data || !data.content) {
        throw new Error('No content received from AI');
      }

      let content = data.content.trim();
      
      // Clean up the response - remove any markdown formatting
      content = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      
      // Find the JSON array more robustly
      let jsonStart = content.indexOf('[');
      let jsonEnd = content.lastIndexOf(']');
      
      if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
        console.error('No valid JSON array found in response:', content);
        throw new Error('Invalid response format - no JSON array found');
      }
      
      // Extract just the JSON array
      const jsonContent = content.substring(jsonStart, jsonEnd + 1);
      console.log('Extracted JSON content:', jsonContent);
      
      let generatedQuestions;
      try {
        generatedQuestions = JSON.parse(jsonContent);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Content that failed to parse:', jsonContent);
        
        // Try to fix common JSON issues
        let fixedContent = jsonContent
          .replace(/'/g, '"') // Replace single quotes with double quotes
          .replace(/([{,]\s*)(\w+):/g, '$1"$2":') // Add quotes around keys
          .replace(/:\s*([^",\[\]{}]+)([,}])/g, ':"$1"$2'); // Add quotes around unquoted string values;
        
        try {
          generatedQuestions = JSON.parse(fixedContent);
          console.log('Successfully parsed with fixes');
        } catch (secondParseError) {
          console.error('Second parse attempt failed:', secondParseError);
          throw new Error(`JSON parsing failed: ${parseError.message}`);
        }
      }
      
      if (!Array.isArray(generatedQuestions) || generatedQuestions.length === 0) {
        throw new Error('AI response is not a valid question array');
      }
      
      // Validate and clean up questions
      const validQuestions: Question[] = generatedQuestions
        .filter(q => q && q.question && q.type && q.correctAnswer && q.explanation)
        .slice(0, questionCount)
        .map((q: any, index: number) => {
          const questionType = ['multiple-choice', 'true-false', 'theory'].includes(q.type) 
            ? q.type 
            : 'multiple-choice';
            
          return {
            id: index + 1,
            question: String(q.question).trim(),
            type: questionType,
            options: questionType === 'multiple-choice' ? (q.options || []) : undefined,
            correctAnswer: String(q.correctAnswer).trim(),
            explanation: String(q.explanation).trim()
          };
        });
      
      if (validQuestions.length === 0) {
        throw new Error('No valid questions were generated');
      }
      
      console.log('Successfully generated questions:', validQuestions.length);
      setQuestions(validQuestions);
      toast.success(`Generated ${validQuestions.length} questions successfully!`);
      
    } catch (error) {
      console.error('Error generating questions:', error);
      toast.error(`Failed to generate questions: ${error.message || 'Unknown error'}`);
      setQuestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const evaluateTheoryAnswer = async (question: Question, userAnswer: string): Promise<TheoryEvaluation> => {
    try {
      const evaluationPrompt = `
Evaluate this student's answer to a theory question:

Question: ${question.question}
Student Answer: "${userAnswer}"
Expected Answer: "${question.correctAnswer}"

Please evaluate if the student's answer is correct or demonstrates understanding of the concept. Consider:
1. Is the answer relevant to the question?
2. Does it show understanding of the key concepts?
3. Is it a meaningful attempt (not random letters, "I don't know", etc.)?
4. How well does it align with the expected answer?

Respond with ONLY a JSON object in this exact format:
{
  "isCorrect": true/false,
  "feedback": "Brief explanation of why the answer is correct/incorrect",
  "score": 0-100
}

Be strict in evaluation - random letters, "I don't know", or completely irrelevant answers should score 0.
Partially correct answers should score 30-70 depending on accuracy.
Fully correct answers should score 80-100.`;

      const { data, error } = await supabase.functions.invoke('ai-study-chat', {
        body: {
          message: evaluationPrompt,
          systemPrompt: 'You are an expert educational evaluator. Respond ONLY with valid JSON. Be strict and fair in your evaluation.'
        }
      });

      if (error) throw error;

      // Clean and parse the AI response
      let content = data.content.trim();
      content = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      
      // Find JSON object
      let jsonStart = content.indexOf('{');
      let jsonEnd = content.lastIndexOf('}');
      
      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error('No valid JSON found in response');
      }
      
      const jsonContent = content.substring(jsonStart, jsonEnd + 1);
      const evaluation = JSON.parse(jsonContent);
      
      // Validate the response structure
      if (typeof evaluation.isCorrect !== 'boolean' || 
          typeof evaluation.feedback !== 'string' || 
          typeof evaluation.score !== 'number') {
        throw new Error('Invalid evaluation response structure');
      }
      
      return {
        isCorrect: evaluation.isCorrect,
        feedback: evaluation.feedback,
        score: Math.max(0, Math.min(100, evaluation.score)) // Ensure score is 0-100
      };
      
    } catch (error) {
      console.error('Error evaluating theory answer:', error);
      
      // Fallback evaluation for very obvious cases
      const trimmedAnswer = userAnswer.trim().toLowerCase();
      
      // Check for obviously wrong answers
      if (trimmedAnswer.length < 5 || 
          trimmedAnswer === "i don't know" || 
          trimmedAnswer === "idk" ||
          /^[^a-zA-Z]*$/.test(trimmedAnswer) || // Only special characters/numbers
          /^(.)\1{4,}/.test(trimmedAnswer)) { // Repeated characters like "aaaaa"
        return {
          isCorrect: false,
          feedback: "Answer appears to be incomplete or not a genuine attempt. Please provide a meaningful response that addresses the question.",
          score: 0
        };
      }
      
      // If we can't evaluate properly, give partial credit for a genuine attempt
      return {
        isCorrect: false,
        feedback: "Unable to fully evaluate answer. Please review the expected answer for comparison.",
        score: 30
      };
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
    
    if (!currentAnswer || currentAnswer.trim() === '') {
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

  const finishAssessment = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    const currentAnswer = userAnswers[currentQuestion.id];
    
    if (!currentAnswer || currentAnswer.trim() === '') {
      toast.error('Please answer the current question before finishing the assessment.');
      return;
    }
    
    setIsEvaluating(true);
    
    try {
      // Evaluate all theory questions
      const evaluations: { [key: number]: TheoryEvaluation } = {};
      
      for (const question of questions) {
        if (question.type === 'theory') {
          const userAnswer = userAnswers[question.id];
          if (userAnswer) {
            console.log(`Evaluating theory question ${question.id}:`, userAnswer);
            const evaluation = await evaluateTheoryAnswer(question, userAnswer);
            evaluations[question.id] = evaluation;
            console.log(`Evaluation result:`, evaluation);
          }
        }
      }
      
      setTheoryEvaluations(evaluations);
      setShowSuccessDialog(true);
      
    } catch (error) {
      console.error('Error during assessment evaluation:', error);
      toast.error('Error evaluating assessment. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    setShowResults(true);
  };

  const calculateResults = () => {
    let correctAnswers = 0;
    let totalPoints = 0;
    let earnedPoints = 0;
    
    questions.forEach(q => {
      const userAnswer = userAnswers[q.id];
      totalPoints += 100; // Each question worth 100 points
      
      if (q.type === 'theory') {
        const evaluation = theoryEvaluations[q.id];
        if (evaluation) {
          earnedPoints += evaluation.score;
          if (evaluation.isCorrect) {
            correctAnswers++;
          }
        }
      } else {
        // Multiple choice and true/false
        if (userAnswer === q.correctAnswer) {
          correctAnswers++;
          earnedPoints += 100;
        }
      }
    });
    
    const percentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    
    return {
      correct: correctAnswers,
      total: questions.length,
      percentage,
      earnedPoints,
      totalPoints
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

  const handleSubjectSubmit = () => {
    if (customSubject.trim() && customTopic.trim()) {
      setShowSubjectInput(false);
      generateQuestions(customSubject, customTopic);
    } else {
      toast.error('Please enter both subject and topic');
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
                  placeholder="e.g., Mathematics, Science, History, Setswana"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="e.g., Algebra, Physics, World War II, Setswana Language"
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
          <p className="mt-4 text-lg font-medium">Generating assessment questions for {customSubject} - {customTopic}...</p>
          <p className="text-sm text-muted-foreground mt-2">This will include 20-30 questions with theory questions</p>
          <p className="text-xs text-muted-foreground mt-1">Please wait while we create your personalized assessment</p>
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
              {customSubject} - {customTopic} ({questions.length} questions)
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
              <div className="text-xl text-muted-foreground mb-2">
                Score: {results.percentage}%
              </div>
              <div className="text-sm text-muted-foreground mb-4">
                Points: {results.earnedPoints}/{results.totalPoints}
              </div>
              <div className={`text-lg ${gradeInfo.color} font-medium mb-4`}>
                {gradeInfo.message}
              </div>
              <Progress value={results.percentage} className="w-full max-w-md mx-auto" />
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {questions.map((question) => {
                const userAnswer = userAnswers[question.id];
                let isCorrect = false;
                let feedback = '';
                
                if (question.type === 'theory') {
                  const evaluation = theoryEvaluations[question.id];
                  isCorrect = evaluation?.isCorrect || false;
                  feedback = evaluation?.feedback || '';
                } else {
                  isCorrect = userAnswer === question.correctAnswer;
                }
                
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
                          <p className="font-medium mb-2">
                            Q{question.id}: {question.question}
                            {question.type === 'theory' && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Theory</span>}
                          </p>
                          <p className="text-sm text-muted-foreground mb-1">
                            Your answer: {userAnswer || 'Not answered'}
                          </p>
                          
                          {question.type === 'theory' ? (
                            <>
                              {feedback && (
                                <p className={`text-sm mb-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                  AI Feedback: {feedback}
                                </p>
                              )}
                              <p className="text-sm text-blue-600 mb-2">
                                Sample answer: {question.correctAnswer}
                              </p>
                              {theoryEvaluations[question.id] && (
                                <p className="text-sm text-gray-600">
                                  Score: {theoryEvaluations[question.id].score}/100
                                </p>
                              )}
                            </>
                          ) : (
                            <p className="text-sm text-green-600 mb-2">
                              Correct answer: {question.correctAnswer}
                            </p>
                          )}
                          
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

  if (questions.length === 0 && !isLoading && !showSubjectInput) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="w-5 h-5" />
              Failed to Generate Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We couldn't generate questions for {customSubject} - {customTopic}. This might be due to:
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>Connection issues</li>
              <li>Invalid subject/topic combination</li>
              <li>Temporary AI service issues</li>
            </ul>
            <div className="flex gap-2">
              <Button 
                onClick={() => generateQuestions(customSubject, customTopic)}
                className="flex-1"
              >
                <Target className="w-4 h-4 mr-2" />
                Retry Generation
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowSubjectInput(true)}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Change Topic
              </Button>
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
              <p className="text-sm text-muted-foreground">{customTopic} ({questions.length} questions)</p>
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
            <CardTitle className="flex items-center gap-2">
              Question {currentQuestionIndex + 1}
              {currentQuestion.type === 'theory' && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Theory Question</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-lg">{currentQuestion.question}</p>
              
              {currentQuestion.type === 'theory' ? (
                <div className="space-y-2">
                  <Label htmlFor="theory-answer">Your Answer:</Label>
                  <Textarea
                    id="theory-answer"
                    placeholder="Type your detailed answer here..."
                    value={currentAnswer || ''}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    className="min-h-[120px]"
                    rows={5}
                  />
                  <p className="text-xs text-muted-foreground">
                    Provide a detailed explanation for this theory question.
                  </p>
                </div>
              ) : (
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
              )}
              
              {(!currentAnswer || currentAnswer.trim() === '') && (
                <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                  Please provide an answer to proceed to the next question.
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
              disabled={(!currentAnswer || currentAnswer.trim() === '') || isEvaluating}
              className={(!currentAnswer || currentAnswer.trim() === '') ? 'opacity-50' : ''}
            >
              {isEvaluating ? 'Evaluating...' : 'Finish Assessment'}
            </Button>
          ) : (
            <Button 
              onClick={goToNextQuestion}
              className={(!currentAnswer || currentAnswer.trim() === '') ? 'opacity-50' : ''}
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
                {isEvaluating ? ' We are still evaluating your theory answers...' : ' Click below to view your results and detailed feedback.'}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              className="w-full bg-[#2563eb] hover:bg-[#2563eb]/90"
              onClick={handleSuccessDialogClose}
              disabled={isEvaluating}
            >
              {isEvaluating ? 'Evaluating...' : 'View Results'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AssessmentExam;
