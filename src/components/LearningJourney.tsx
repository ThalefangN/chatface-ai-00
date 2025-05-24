
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Target, Users, RotateCcw, Trophy } from 'lucide-react';

const LearningJourney = () => {
  const learningSteps = [
    {
      id: 1,
      title: 'Assessment',
      description: 'Evaluate your current knowledge and identify learning gaps',
      icon: Target,
      color: 'bg-blue-500',
      progress: 100
    },
    {
      id: 2,
      title: 'Foundation',
      description: 'Build strong fundamentals with core concepts and principles',
      icon: BookOpen,
      color: 'bg-green-500',
      progress: 75
    },
    {
      id: 3,
      title: 'Practice',
      description: 'Apply your knowledge through interactive exercises and problems',
      icon: Users,
      color: 'bg-yellow-500',
      progress: 50
    },
    {
      id: 4,
      title: 'Review',
      description: 'Reinforce learning through spaced repetition and feedback',
      icon: RotateCcw,
      color: 'bg-orange-500',
      progress: 25
    },
    {
      id: 5,
      title: 'Mastery',
      description: 'Achieve deep understanding and advanced problem-solving skills',
      icon: Trophy,
      color: 'bg-purple-500',
      progress: 10
    }
  ];

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 p-6 rounded-2xl">
      <div className="max-w-6xl mx-auto h-full flex flex-col">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Your Learning Journey
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Experience a structured learning path designed to maximize your academic success with AI-powered guidance
          </p>
        </motion.div>

        {/* Learning Steps */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {learningSteps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700"
            >
              {/* Icon */}
              <div className={`${step.color} w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto`}>
                <step.icon className="w-8 h-8 text-white" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-800 dark:text-white text-center mb-3">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4 leading-relaxed">
                {step.description}
              </p>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${step.progress}%` }}
                  transition={{ duration: 1, delay: index * 0.2 + 0.5 }}
                  className={`h-2 rounded-full ${step.color}`}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                {step.progress}% Complete
              </p>

              {/* Step Number */}
              <div className="absolute top-2 right-2 w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                  {step.id}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-wrap justify-center gap-4 mt-8"
        >
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Start Learning
          </button>
          <button className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
            View Progress
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default LearningJourney;
