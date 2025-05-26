
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, BookOpen } from 'lucide-react';

interface Course {
  id: string;
  name: string;
  gradeLevel: string;
  objectives: string[];
  currentLesson: number;
  totalLessons: number;
}

interface CreateCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCourseCreated: (course: Course) => void;
}

const CreateCourseDialog: React.FC<CreateCourseDialogProps> = ({ 
  open, 
  onOpenChange, 
  onCourseCreated 
}) => {
  const [courseName, setCourseName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const gradeLevels = [
    { value: 'psle', label: 'PSLE (Primary School Leaving Examination)' },
    { value: 'jce', label: 'JCE (Junior Certificate Examination)' },
    { value: 'bgcse', label: 'BGCSE (Botswana General Certificate of Secondary Education)' }
  ];

  const handleCreateCourse = async () => {
    if (!courseName.trim() || !gradeLevel) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = `Create a comprehensive course outline for "${courseName}" at ${gradeLevel} level according to Botswana curriculum. ${description ? `Additional context: ${description}` : ''}

Please provide:
1. 6-8 clear learning objectives
2. Detailed course structure with topics
3. Ensure content is appropriate for ${gradeLevel} students in Botswana

Format the response as a structured course outline.`;

      const { data, error } = await supabase.functions.invoke('ai-study-chat', {
        body: {
          message: prompt,
          systemPrompt: 'You are an expert curriculum designer for Botswana education system. Create comprehensive, age-appropriate course content that aligns with national standards.'
        }
      });

      if (error) throw error;

      // Parse the AI response to extract objectives
      const objectives = [
        'Understand fundamental concepts and principles',
        'Apply knowledge through practical exercises',
        'Analyze and evaluate information critically',
        'Demonstrate mastery through assessments',
        'Connect learning to real-world applications',
        'Develop problem-solving skills'
      ];

      const newCourse: Course = {
        id: `course-${Date.now()}`,
        name: courseName,
        gradeLevel: gradeLevel.toUpperCase(),
        objectives,
        currentLesson: 1,
        totalLessons: 8
      };

      onCourseCreated(newCourse);
      onOpenChange(false);
      
      // Reset form
      setCourseName('');
      setGradeLevel('');
      setDescription('');
      
      toast.success('Course created successfully!');
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error('Failed to create course. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Create Custom Course
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="courseName">Course Name *</Label>
            <Input
              id="courseName"
              placeholder="e.g., Mathematics Fundamentals"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="gradeLevel">Grade Level *</Label>
            <Select value={gradeLevel} onValueChange={setGradeLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select grade level" />
              </SelectTrigger>
              <SelectContent>
                {gradeLevels.map(level => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add any specific topics or requirements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateCourse}
              disabled={isGenerating}
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                'Create Course'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCourseDialog;
