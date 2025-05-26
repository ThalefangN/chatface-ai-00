
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { BookOpen, CheckCircle } from 'lucide-react';

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
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStep, setGenerationStep] = useState('');

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
    setGenerationProgress(0);

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast.error('Please log in to create a course');
        return;
      }

      const gradeLabels = {
        'psle': 'Primary School (PSLE)',
        'jce': 'Junior Certificate (JCE)', 
        'bgcse': 'Senior Certificate (BGCSE)'
      };

      const objectives = [
        `Understand fundamental concepts and principles of ${courseName}`,
        `Apply theoretical knowledge through practical exercises and examples`,
        `Analyze and evaluate information critically using ${courseName} concepts`,
        `Demonstrate mastery through comprehensive assessments and problem-solving`,
        `Connect learning to real-world applications in Botswana context`,
        `Develop critical thinking and analytical skills in ${courseName}`
      ];

      // Simulate progress updates
      const progressSteps = [
        'Analyzing course requirements...',
        'Generating learning objectives...',
        'Creating lesson structure...',
        'Preparing course content...',
        'Saving to database...'
      ];

      for (let i = 0; i < progressSteps.length; i++) {
        setGenerationStep(progressSteps[i]);
        setGenerationProgress((i + 1) * 20);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Save course to database
      const { data: courseData, error: courseError } = await supabase
        .from('ai_courses')
        .insert({
          user_id: user.id,
          name: courseName,
          grade_level: gradeLabels[gradeLevel as keyof typeof gradeLabels] || gradeLevel.toUpperCase(),
          description,
          total_lessons: objectives.length,
          current_lesson: 1
        })
        .select()
        .single();

      if (courseError) throw courseError;

      // Save objectives
      const objectivesData = objectives.map((objective, index) => ({
        course_id: courseData.id,
        objective_text: objective,
        order_index: index + 1
      }));

      const { error: objectivesError } = await supabase
        .from('ai_course_objectives')
        .insert(objectivesData);

      if (objectivesError) throw objectivesError;

      setGenerationProgress(100);
      setGenerationStep('Course generation complete!');

      // Create course object for the UI
      const newCourse: Course = {
        id: courseData.id,
        name: courseData.name,
        gradeLevel: courseData.grade_level,
        objectives,
        currentLesson: courseData.current_lesson,
        totalLessons: courseData.total_lessons
      };

      setTimeout(() => {
        onCourseCreated(newCourse);
        onOpenChange(false);
        
        // Reset form
        setCourseName('');
        setGradeLevel('');
        setDescription('');
        setIsGenerating(false);
        setGenerationProgress(0);
        setGenerationStep('');
        
        toast.success('Course created and saved successfully!');
      }, 1000);

    } catch (error) {
      console.error('Error creating course:', error);
      toast.error('Failed to create course. Please try again.');
      setIsGenerating(false);
      setGenerationProgress(0);
      setGenerationStep('');
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
        
        {isGenerating ? (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-blue-600 animate-pulse" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Generating Your Course</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Creating personalized content for {courseName}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{generationStep}</span>
                <span className="text-blue-600 font-medium">
                  {Math.round(generationProgress)}%
                </span>
              </div>
              <Progress value={generationProgress} className="h-2" />
            </div>

            {generationProgress === 100 && (
              <div className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Course ready! Loading...</span>
              </div>
            )}
          </div>
        ) : (
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
                Create Course
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateCourseDialog;
