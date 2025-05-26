
import React from 'react';
import { Star, Users, BookOpen, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CourseHeaderProps {
  title: string;
  instructor: string;
  rating: number;
  students: number;
  level: string;
  subject: string;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({
  title,
  instructor,
  rating,
  students,
  level,
  subject
}) => {
  // Different teacher names for different courses
  const getTeacherName = (courseTitle: string) => {
    const teachers = {
      'English Literature': 'Ms. Bontle Ramotswe',
      'Mathematics': 'Mr. Thabo Molefe', 
      'Physics': 'Dr. Keitumetse Phadi',
      'Chemistry': 'Ms. Naledi Kgosana',
      'Biology': 'Mr. Reginald Tau',
      'History': 'Ms. Mmabatho Seretse',
      'Geography': 'Mr. Kagiso Mosimanegape',
      'Setswana': 'Mme Boipelo Mogami',
      'Computer Science': 'Mr. Lesedi Mmusi',
      'Business Studies': 'Ms. Tsholofelo Dikgole'
    };
    
    return teachers[courseTitle as keyof typeof teachers] || instructor;
  };

  const teacherName = getTeacherName(title);

  return (
    <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <CardTitle className="text-3xl text-blue-800 dark:text-blue-300">{title}</CardTitle>
            <CardDescription className="text-lg text-blue-600 dark:text-blue-400">
              Taught by {teacherName}
            </CardDescription>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                {level} Level
              </Badge>
              <Badge variant="outline" className="border-purple-300 text-purple-700 dark:text-purple-300">
                <Award className="h-3 w-3 mr-1" />
                Certified Course
              </Badge>
            </div>
          </div>
          <div className="text-right space-y-2">
            <div className="flex items-center gap-1 justify-end">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-lg">{rating}</span>
            </div>
            <p className="text-sm text-muted-foreground">Based on student reviews</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="font-bold text-xl text-blue-800 dark:text-blue-300">{students}</div>
            <div className="text-sm text-muted-foreground">Students Enrolled</div>
          </div>
          <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <BookOpen className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="font-bold text-xl text-green-800 dark:text-green-300">{subject}</div>
            <div className="text-sm text-muted-foreground">Subject Area</div>
          </div>
          <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <Award className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <div className="font-bold text-xl text-purple-800 dark:text-purple-300">12 Weeks</div>
            <div className="text-sm text-muted-foreground">Course Duration</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseHeader;
