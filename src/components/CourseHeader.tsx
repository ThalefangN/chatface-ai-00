
import React from 'react';
import { Star, Users, BookOpen } from 'lucide-react';
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
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription className="text-lg mt-2">
              Taught by {instructor}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-sm">
            {level}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{rating}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{students} students</span>
          </div>
          <div className="flex items-center space-x-1">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{subject}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseHeader;
