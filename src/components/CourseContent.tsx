
import React, { useState, useEffect } from 'react';
import { FileText, Play, BookOpen, Download, Upload, Eye, Calendar, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface CourseContentItem {
  id: string;
  title: string;
  description: string | null;
  content_type: 'note' | 'video' | 'assignment';
  content_url: string | null;
  content_text: string | null;
  duration_minutes: number | null;
  order_index: number;
  is_downloadable: boolean;
  created_at: string;
  updated_at: string;
}

interface Grade {
  id: string;
  assignment_title: string;
  grade: number;
  max_grade: number;
  graded_at: string;
  feedback?: string;
}

interface CourseContentProps {
  courseId: string;
  isTeacher?: boolean;
}

const CourseContent: React.FC<CourseContentProps> = ({ courseId, isTeacher = false }) => {
  const { user } = useAuth();
  const [content, setContent] = useState<CourseContentItem[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('notes');

  // Sample content for English Literature course
  const sampleContent = {
    notes: [
      {
        id: '1',
        title: 'Introduction to African Literature',
        description: 'Comprehensive overview of African literary traditions and contemporary works',
        content_type: 'note' as const,
        content_url: 'african-literature-guide.pdf',
        content_text: 'This comprehensive guide explores the rich tradition of African literature, from oral storytelling to contemporary novels. We examine works by authors like Chinua Achebe, Wole Soyinka, and Bessie Head...',
        duration_minutes: 45,
        order_index: 1,
        is_downloadable: true,
        created_at: '2024-01-15',
        updated_at: '2024-01-15'
      },
      {
        id: '2',
        title: 'Poetry Analysis Techniques',
        description: 'Methods for analyzing poems, focusing on Setswana and English poetry',
        content_type: 'note' as const,
        content_url: 'poetry-analysis-methods.pdf',
        content_text: 'Learn essential techniques for analyzing poetry, including meter, rhyme scheme, literary devices, and thematic analysis. Special focus on comparing traditional Setswana poetry with English forms...',
        duration_minutes: 30,
        order_index: 2,
        is_downloadable: true,
        created_at: '2024-01-20',
        updated_at: '2024-01-20'
      },
      {
        id: '3',
        title: 'Character Development in Novels',
        description: 'Understanding how authors create and develop characters',
        content_type: 'note' as const,
        content_url: 'character-development.pdf',
        content_text: 'Explore the techniques authors use to create memorable characters. From direct characterization to subtle personality reveals through dialogue and action...',
        duration_minutes: 35,
        order_index: 3,
        is_downloadable: true,
        created_at: '2024-01-25',
        updated_at: '2024-01-25'
      }
    ],
    videos: [
      {
        id: '4',
        title: 'Shakespeare in African Context',
        description: 'How Shakespeare\'s works relate to African themes and experiences',
        content_type: 'video' as const,
        content_url: 'shakespeare-african-context.mp4',
        content_text: null,
        duration_minutes: 25,
        order_index: 1,
        is_downloadable: false,
        created_at: '2024-01-18',
        updated_at: '2024-01-18'
      },
      {
        id: '5',
        title: 'Oral Tradition and Modern Literature',
        description: 'The influence of oral storytelling on contemporary African writing',
        content_type: 'video' as const,
        content_url: 'oral-tradition-modern-lit.mp4',
        content_text: null,
        duration_minutes: 18,
        order_index: 2,
        is_downloadable: false,
        created_at: '2024-01-22',
        updated_at: '2024-01-22'
      },
      {
        id: '6',
        title: 'Creative Writing Workshop',
        description: 'Interactive session on developing your own creative writing skills',
        content_type: 'video' as const,
        content_url: 'creative-writing-workshop.mp4',
        content_text: null,
        duration_minutes: 40,
        order_index: 3,
        is_downloadable: false,
        created_at: '2024-01-28',
        updated_at: '2024-01-28'
      }
    ],
    assignments: [
      {
        id: '7',
        title: 'Essay: Themes in "Purple Hibiscus"',
        description: 'Write a 1000-word essay analyzing major themes in Chimamanda Ngozi Adichie\'s novel',
        content_type: 'assignment' as const,
        content_url: 'purple-hibiscus-assignment.pdf',
        content_text: 'Assignment Instructions: Choose one major theme from "Purple Hibiscus" and analyze how it develops throughout the novel. Consider the use of symbolism, character development, and narrative structure...',
        duration_minutes: null,
        order_index: 1,
        is_downloadable: true,
        created_at: '2024-02-01',
        updated_at: '2024-02-01'
      },
      {
        id: '8',
        title: 'Poetry Comparison Project',
        description: 'Compare traditional Setswana poetry with contemporary English poetry',
        content_type: 'assignment' as const,
        content_url: 'poetry-comparison-project.pdf',
        content_text: 'Select one traditional Setswana poem and one contemporary English poem. Compare their themes, structure, and cultural context. Present your findings in a 15-minute presentation...',
        duration_minutes: null,
        order_index: 2,
        is_downloadable: true,
        created_at: '2024-02-05',
        updated_at: '2024-02-05'
      },
      {
        id: '9',
        title: 'Creative Writing Portfolio',
        description: 'Create a portfolio of your original creative writing pieces',
        content_type: 'assignment' as const,
        content_url: 'creative-portfolio-guidelines.pdf',
        content_text: 'Compile a portfolio of 5 original pieces including: 1 short story, 2 poems, 1 dramatic monologue, and 1 piece of your choice. Each piece should demonstrate different literary techniques...',
        duration_minutes: null,
        order_index: 3,
        is_downloadable: true,
        created_at: '2024-02-10',
        updated_at: '2024-02-10'
      }
    ]
  };

  const sampleGrades = [
    {
      id: 'g1',
      assignment_title: 'Essay: Themes in "Purple Hibiscus"',
      grade: 85,
      max_grade: 100,
      graded_at: '2024-02-15',
      feedback: 'Excellent analysis of the theme of oppression. Your use of textual evidence was particularly strong. Consider exploring the symbolism of nature more deeply in future essays.'
    },
    {
      id: 'g2',
      assignment_title: 'Poetry Comparison Project',
      grade: 78,
      max_grade: 100,
      graded_at: '2024-02-20',
      feedback: 'Good comparison between traditional and contemporary forms. Your presentation was clear and well-organized. Work on incorporating more cultural context in your analysis.'
    },
    {
      id: 'g3',
      assignment_title: 'Mid-term Literature Exam',
      grade: 92,
      max_grade: 100,
      graded_at: '2024-02-25',
      feedback: 'Outstanding performance! Your understanding of literary devices and ability to analyze texts critically is impressive. Keep up the excellent work.'
    }
  ];

  useEffect(() => {
    // For demo purposes, we'll use sample data instead of fetching from Supabase
    setContent([...sampleContent.notes, ...sampleContent.videos, ...sampleContent.assignments]);
    setGrades(sampleGrades);
    setLoading(false);
  }, [courseId, isTeacher]);

  const notes = sampleContent.notes;
  const videos = sampleContent.videos;
  const assignments = sampleContent.assignments;

  const handleDownload = (fileName: string) => {
    toast.success(`Downloading ${fileName}...`);
    // In a real implementation, this would trigger the actual download
  };

  const handleViewOnline = (fileName: string) => {
    toast.info(`Opening ${fileName} in new tab...`);
    // In a real implementation, this would open the video in a player or new tab
  };

  const handleUploadAssignment = (assignmentTitle: string) => {
    toast.info(`Upload dialog would open for: ${assignmentTitle}`);
    // In a real implementation, this would open a file upload dialog
  };

  const renderContentItem = (item: CourseContentItem) => (
    <Card key={item.id} className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-2">
          {item.content_type === 'note' && <FileText className="h-5 w-5 text-blue-500" />}
          {item.content_type === 'video' && <Play className="h-5 w-5 text-red-500" />}
          {item.content_type === 'assignment' && <BookOpen className="h-5 w-5 text-green-500" />}
          <CardTitle className="text-lg">{item.title}</CardTitle>
        </div>
        {item.description && <CardDescription>{item.description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {item.content_text && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {item.content_text.substring(0, 150)}...
              </p>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {item.duration_minutes && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {item.duration_minutes} min
                </Badge>
              )}
              {item.content_type === 'assignment' && (
                <Badge variant="secondary">Due: Feb 28, 2024</Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {item.content_type === 'video' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewOnline(item.content_url || '')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Online
                </Button>
              )}
              
              {item.is_downloadable && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDownload(item.content_url || '')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              )}
              
              {item.content_type === 'assignment' && (
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => handleUploadAssignment(item.title)}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Work
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full space-y-6 overflow-x-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notes" className="text-xs md:text-sm">Notes ({notes.length})</TabsTrigger>
          <TabsTrigger value="videos" className="text-xs md:text-sm">Videos ({videos.length})</TabsTrigger>
          <TabsTrigger value="assignments" className="text-xs md:text-sm">Assignments ({assignments.length})</TabsTrigger>
          <TabsTrigger value="grades" className="text-xs md:text-sm">Grades ({sampleGrades.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="space-y-4 w-full">
          <div className="flex items-center justify-between">
            <h3 className="text-lg md:text-xl font-semibold">Course Notes</h3>
            <Badge variant="secondary">{notes.length} Documents Available</Badge>
          </div>
          <div className="space-y-4">
            {notes.map(renderContentItem)}
          </div>
        </TabsContent>

        <TabsContent value="videos" className="space-y-4 w-full">
          <div className="flex items-center justify-between">
            <h3 className="text-lg md:text-xl font-semibold">Course Videos</h3>
            <Badge variant="secondary">{videos.length} Videos Available</Badge>
          </div>
          <div className="space-y-4">
            {videos.map(renderContentItem)}
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4 w-full">
          <div className="flex items-center justify-between">
            <h3 className="text-lg md:text-xl font-semibold">Assignments</h3>
            <Badge variant="secondary">{assignments.length} Assignments</Badge>
          </div>
          <div className="space-y-4">
            {assignments.map(renderContentItem)}
          </div>
        </TabsContent>

        <TabsContent value="grades" className="space-y-4 w-full">
          <div className="flex items-center justify-between">
            <h3 className="text-lg md:text-xl font-semibold">Your Grades</h3>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="font-medium text-sm md:text-base">Average: 85%</span>
            </div>
          </div>
          <div className="space-y-4">
            {sampleGrades.map((grade) => (
              <Card key={grade.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-base md:text-lg flex items-center justify-between">
                    <span className="truncate">{grade.assignment_title}</span>
                    <Badge variant={grade.grade >= 90 ? "default" : grade.grade >= 75 ? "secondary" : "destructive"}>
                      {grade.grade >= 90 ? "Excellent" : grade.grade >= 75 ? "Good" : "Needs Improvement"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">
                          {grade.grade}/{grade.max_grade}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {((grade.grade / grade.max_grade) * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          Graded on {new Date(grade.graded_at).toLocaleDateString()}
                        </p>
                        <Button variant="outline" size="sm" className="mt-2">
                          <Download className="h-4 w-4 mr-2" />
                          Download Feedback
                        </Button>
                      </div>
                    </div>
                    {grade.feedback && (
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-sm font-medium mb-2 text-blue-800 dark:text-blue-300">
                          Teacher Feedback:
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-200">{grade.feedback}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseContent;
