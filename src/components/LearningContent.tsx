
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Target, Trophy, Play, FileText, Volume2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AddNoteDialog from '@/components/AddNoteDialog';

interface LearningContentProps {
  subject: string;
}

const LearningContent: React.FC<LearningContentProps> = ({ subject }) => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Array<{ title: string; content: string; id: string }>>([]);

  const handleSaveNote = (note: { title: string; content: string }) => {
    const newNote = {
      ...note,
      id: Date.now().toString()
    };
    setNotes(prev => [...prev, newNote]);
  };

  const handleAudioOverview = () => {
    navigate('/audio-overview');
  };

  const progressValue = 35;

  return (
    <div className="w-full h-full bg-white dark:bg-gray-900 flex flex-col overflow-hidden">
      {/* Header Section - Mobile Responsive */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white break-words">
              {subject}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Master the fundamentals with interactive lessons and practice
            </p>
          </div>
        </div>

        {/* Progress Section - Mobile Responsive */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Course Progress
                </span>
                <span className="text-sm text-gray-500">{progressValue}%</span>
              </div>
              <Progress value={progressValue} className="h-2" />
            </div>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="text-gray-600 dark:text-gray-400">2.5 hrs left</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4 text-green-500" />
                <span className="text-gray-600 dark:text-gray-400">7/12 topics</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Mobile Responsive */}
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Action Buttons - Mobile Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <AddNoteDialog onSave={handleSaveNote}>
              <Button className="h-auto p-4 flex flex-col items-center gap-2 bg-green-600 hover:bg-green-700 text-white w-full">
                <Plus className="h-5 w-5" />
                <span className="text-sm font-medium">Add Note</span>
              </Button>
            </AddNoteDialog>

            <Button 
              onClick={handleAudioOverview}
              className="h-auto p-4 flex flex-col items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Volume2 className="h-5 w-5" />
              <span className="text-sm font-medium">Audio Overview</span>
            </Button>

            <Button className="h-auto p-4 flex flex-col items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
              <Play className="h-5 w-5" />
              <span className="text-sm font-medium">Start Lesson</span>
            </Button>

            <Button className="h-auto p-4 flex flex-col items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white">
              <Trophy className="h-5 w-5" />
              <span className="text-sm font-medium">Take Quiz</span>
            </Button>
          </div>

          {/* Learning Modules - Mobile Responsive */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <Card className="border border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Current Module</CardTitle>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    In Progress
                  </Badge>
                </div>
                <CardDescription>
                  Introduction to Algebraic Expressions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>30 minutes remaining</span>
                </div>
                <Progress value={65} className="h-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Learn the basics of variables, coefficients, and terms in algebraic expressions.
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Continue Learning
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Next Up</CardTitle>
                <CardDescription>
                  Solving Linear Equations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>45 minutes</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Master the techniques for solving equations with one variable.
                </p>
                <Button variant="outline" className="w-full">
                  Preview Module
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Notes - Mobile Responsive */}
          {notes.length > 0 && (
            <Card className="border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Recent Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notes.slice(-3).map((note) => (
                    <div key={note.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                        {note.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {note.content}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Study Tips - Mobile Responsive */}
          <Card className="border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg">Study Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      Set Clear Goals
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Break down complex topics into manageable chunks for better understanding.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      Practice Regularly
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Consistent practice helps reinforce learning and build confidence.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LearningContent;
