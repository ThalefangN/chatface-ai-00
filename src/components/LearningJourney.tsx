import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Target, Users, RotateCcw, Trophy, Brain, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const LearningJourney = () => {
  const navigate = useNavigate();
  
  const learningSteps = [
    {
      id: 1,
      title: 'Assessment',
      description: 'Evaluate your current knowledge and identify learning gaps',
      icon: Target,
      color: 'bg-blue-500',
      progress: 100,
      route: 'assessment'
    },
    {
      id: 2,
      title: 'Foundation',
      description: 'Build strong fundamentals with core concepts and principles',
      icon: BookOpen,
      color: 'bg-green-500',
      progress: 75,
      route: 'foundation'
    },
    {
      id: 3,
      title: 'AI Study Sessions',
      description: 'Create personalized courses and upload documents for AI-powered learning assistance',
      icon: Users,
      color: 'bg-yellow-500',
      progress: 50,
      route: 'practice'
    },
    {
      id: 4,
      title: 'Review',
      description: 'Reinforce learning through spaced repetition and feedback',
      icon: RotateCcw,
      color: 'bg-orange-500',
      progress: 25,
      route: 'review'
    },
    {
      id: 5,
      title: 'Notes/Topic Summary',
      description: 'Create comprehensive notes and summarize key topics for effective review',
      icon: Trophy,
      color: 'bg-purple-500',
      progress: 10,
      route: 'mastery'
    }
  ];

  const handleStartLearning = (route: string) => {
    navigate(`/learning/${route}`);
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-3 sm:p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
            Your Learning Journey
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
          Experience a structured learning path designed to maximize your academic success with AI-powered guidance
        </p>
      </div>

      {/* Main Content */}
      <div className="p-3 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Learning Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
            {learningSteps.map((step, index) => {
              // Special layout for the last row (Review and Mastery)
              const isLastRow = index >= 3;
              const gridColClass = isLastRow && index === 3 ? 'lg:col-span-2' : isLastRow && index === 4 ? 'lg:col-span-1' : '';
              
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={gridColClass}
                >
                  <Card className="h-full hover:shadow-md transition-shadow duration-200 border border-gray-200 dark:border-gray-700">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className={`${step.color} w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center`}>
                          <step.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                          Step {step.id}
                        </span>
                      </div>
                      <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                        {step.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        {step.description}
                      </p>
                      
                      {/* Progress Section */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            Progress
                          </span>
                          <span className="text-xs font-semibold text-gray-900 dark:text-white">
                            {step.progress}%
                          </span>
                        </div>
                        <Progress value={step.progress} className="h-2" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {step.progress === 100 ? 'Complete' : 'In Progress'}
                        </span>
                      </div>

                      {/* Action Button */}
                      <Button 
                        onClick={() => handleStartLearning(step.route)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        size="sm"
                      >
                        {step.progress === 100 ? 'Review' : 'Continue'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Action Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="text-center mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Ready to Continue Learning?
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Choose how you'd like to proceed with your educational journey
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button 
                onClick={() => handleStartLearning('foundation')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2.5 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
              >
                <BookOpen className="w-4 h-4" />
                Start Learning
              </button>
              <button className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 px-4 sm:px-6 py-2.5 rounded-lg font-medium transition-colors duration-200 text-sm">
                View Progress
              </button>
              <button className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 px-4 sm:px-6 py-2.5 rounded-lg font-medium transition-colors duration-200 text-sm">
                Study Materials
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LearningJourney;
