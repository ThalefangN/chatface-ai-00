import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Target, 
  Trophy, 
  Clock, 
  Brain, 
  CheckCircle,
  PlayCircle,
  FileText,
  Users,
  Star
} from 'lucide-react';
import TutorSection from './TutorSection';
import AssessmentQuiz from './AssessmentQuiz';

interface LearningContentProps {
  subject: string;
}

const LearningContent: React.FC<LearningContentProps> = ({ subject }) => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [lastScore, setLastScore] = useState<{ score: number; total: number } | null>(null);

  const subjectMap = {
    'Mathematics Fundamentals: Core Concepts': {
      description: 'Explore the foundational principles of mathematics.',
      image: '/images/math-fundamentals.jpg',
      topics: ['Arithmetic', 'Algebra', 'Geometry', 'Calculus']
    },
    'Interactive Problem Solving: Practice Session': {
      description: 'Sharpen your problem-solving skills with interactive exercises.',
      image: '/images/problem-solving.jpg',
      topics: ['Logic Puzzles', 'Coding Challenges', 'Math Problems', 'Real-world Scenarios']
    },
    'Knowledge Review: Spaced Repetition': {
      description: 'Reinforce your knowledge through spaced repetition techniques.',
      image: '/images/spaced-repetition.jpg',
      topics: ['Flashcards', 'Quizzes', 'Review Questions', 'Memory Techniques']
    },
    'Knowledge Assessment: Gap Analysis': {
      description: 'Identify gaps in your knowledge with comprehensive assessments.',
      image: '/images/gap-analysis.jpg',
      topics: ['Diagnostic Tests', 'Performance Analysis', 'Personalized Feedback', 'Improvement Plans']
    },
    'Advanced Mastery: Deep Learning': {
      description: 'Achieve advanced mastery through deep learning strategies.',
      image: '/images/deep-learning.jpg',
      topics: ['Advanced Concepts', 'Expert Techniques', 'Research Papers', 'Case Studies']
    }
  };

  const contentData = subjectMap[subject as keyof typeof subjectMap] || {
    description: 'General learning session content.',
    image: '/images/default-learning.jpg',
    topics: ['Introduction', 'Basic Concepts', 'Examples', 'Practice Questions']
  };

  const handleStartAssessment = () => {
    setShowQuiz(true);
    setQuizCompleted(false);
  };

  const handleQuizComplete = (score: number, total: number) => {
    setLastScore({ score, total });
    setQuizCompleted(true);
  };

  const handleBackToAssessment = () => {
    setShowQuiz(false);
  };

  if (showQuiz) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <AssessmentQuiz
          subject={subject}
          onComplete={handleQuizComplete}
          onBack={handleBackToAssessment}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto">
      {/* Subject Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          <Brain className="w-4 h-4" />
          <span>AI-Powered Learning</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          {subject}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Enhance your knowledge with personalized learning experiences and AI-driven assessments
        </p>
      </motion.div>

      {/* Learning Journey Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-3">
              <Target className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-xl">Ready to Continue Learning?</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Choose how you'd like to proceed with your educational journey
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button 
                onClick={handleStartAssessment}
                className="flex flex-col items-center gap-2 h-auto p-4 bg-green-600 hover:bg-green-700"
              >
                <PlayCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Start Assessment</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center gap-2 h-auto p-4">
                <Trophy className="w-5 h-5" />
                <span className="text-sm font-medium">View Progress</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center gap-2 h-auto p-4">
                <FileText className="w-5 h-5" />
                <span className="text-sm font-medium">Study Materials</span>
              </Button>
            </div>

            {/* Show last quiz score if available */}
            {lastScore && quizCompleted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 p-3 bg-green-100 border border-green-200 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Last Assessment: {lastScore.score}/{lastScore.total} ({((lastScore.score / lastScore.total) * 100).toFixed(1)}%)
                  </span>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Tutor Section */}
      <TutorSection />
    </div>
  );
};

export default LearningContent;
