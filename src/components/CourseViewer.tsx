
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight, ArrowLeft, Play, CheckCircle } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import LessonViewer from '@/components/LessonViewer';

interface Course {
  id: string;
  name: string;
  gradeLevel: string;
  objectives: string[];
  currentLesson: number;
  totalLessons: number;
}

interface CourseViewerProps {
  course: Course;
  onBack: () => void;
}

const CourseViewer: React.FC<CourseViewerProps> = ({ course, onBack }) => {
  const [expandedObjectives, setExpandedObjectives] = useState<number[]>([]);
  const [showLesson, setShowLesson] = useState(false);
  const [currentLessonNum, setCurrentLessonNum] = useState(1);

  const toggleObjective = (index: number) => {
    setExpandedObjectives(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const objectiveTopics = [
    ['Basic concepts and definitions', 'Historical context', 'Key principles'],
    ['Practical applications', 'Hands-on exercises', 'Real-world examples'],
    ['Critical thinking skills', 'Analysis techniques', 'Evaluation methods'],
    ['Assessment strategies', 'Performance indicators', 'Success metrics'],
    ['Real-world connections', 'Industry applications', 'Career relevance'],
    ['Problem identification', 'Solution strategies', 'Implementation techniques']
  ];

  const handleStartCourse = () => {
    setCurrentLessonNum(1);
    setShowLesson(true);
  };

  const handleStartLesson = (lessonNum: number) => {
    setCurrentLessonNum(lessonNum);
    setShowLesson(true);
  };

  if (showLesson) {
    return (
      <LessonViewer 
        course={course}
        lessonNumber={currentLessonNum}
        onBack={() => setShowLesson(false)}
        onNextLesson={(nextLesson) => setCurrentLessonNum(nextLesson)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Study Sessions
        </Button>
      </div>

      {/* Course Info */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-blue-800 dark:text-blue-300">
                {course.name}
              </CardTitle>
              <p className="text-blue-600 dark:text-blue-400 mt-2">
                {course.gradeLevel} Level Course
              </p>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Lesson {course.currentLesson} of {course.totalLessons}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button onClick={handleStartCourse} size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Play className="w-5 h-5 mr-2" />
              Start Course
            </Button>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              AI-generated content • Interactive lessons • Quizzes included
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Objectives */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Course Objectives
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400">
            Click on each objective to see the topics that will be covered
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {course.objectives.map((objective, index) => (
            <Collapsible key={index}>
              <CollapsibleTrigger 
                className="w-full"
                onClick={() => toggleObjective(index)}
              >
                <Card className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="shrink-0">
                          {index + 1}
                        </Badge>
                        <span className="text-left font-medium">{objective}</span>
                      </div>
                      {expandedObjectives.includes(index) ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Card className="ml-4 mt-2 bg-gray-50 dark:bg-gray-800">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2 text-green-700 dark:text-green-400">
                      Topics to be covered:
                    </h4>
                    <ul className="space-y-1">
                      {objectiveTopics[index]?.map((topic, topicIndex) => (
                        <li key={topicIndex} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartLesson(index + 1);
                      }}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start This Lesson
                    </Button>
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseViewer;
