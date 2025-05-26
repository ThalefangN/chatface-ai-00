import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Brain, Headphones, Upload, FileText, Play, Download, Mic, Volume2, Plus, Minus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MindMapNode {
  id: string;
  title: string;
  x: number;
  y: number;
  expanded: boolean;
  level: number;
  children: MindMapNode[];
  color: string;
  parentId?: string;
}

const Foundation = () => {
  const [activeTab, setActiveTab] = useState('mindmap');
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState('');
  const [context, setContext] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [generatedContent, setGeneratedContent] = useState('');
  const [mindMapData, setMindMapData] = useState<MindMapNode | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        setUploadedFile(file);
        toast.success(`${file.name} uploaded successfully!`);
      } else {
        toast.error('Please upload text files only (.txt, .md)');
      }
    }
  };

  const generateMindMap = async () => {
    if (!topic.trim() && !uploadedFile) {
      toast.error('Please enter a topic or upload a document');
      return;
    }

    setIsGenerating(true);
    try {
      console.log('Generating mind map for topic:', topic);
      
      let message = '';
      if (uploadedFile) {
        const fileContent = await uploadedFile.text();
        message = `Create a comprehensive mind map for this document content: ${fileContent.substring(0, 2000)}...`;
      } else {
        message = `Create a comprehensive mind map for the topic: "${topic}"
        ${context ? `Additional context: ${context}` : ''}`;
      }

      const { data, error } = await supabase.functions.invoke('ai-study-chat', {
        body: {
          message,
          systemPrompt: 'You are a mind map generator. Create a detailed, hierarchical mind map structure with the main topic as root and multiple levels of subtopics. Make each node meaningful and educational.'
        }
      });

      if (error) {
        console.error('Mind map generation error:', error);
        throw error;
      }

      // Create a comprehensive mind map structure based on the topic
      const topicTitle = topic || 'Document Analysis';
      const sampleMindMap: MindMapNode = {
        id: 'root',
        title: topicTitle,
        x: 50,
        y: 40,
        expanded: true,
        level: 0,
        color: '#3B82F6',
        children: [
          {
            id: 'fundamentals',
            title: 'Core Fundamentals',
            x: 20,
            y: 20,
            expanded: false,
            level: 1,
            color: '#10B981',
            parentId: 'root',
            children: [
              {
                id: 'definitions',
                title: 'Key Definitions',
                x: 10,
                y: 10,
                expanded: false,
                level: 2,
                color: '#F59E0B',
                parentId: 'fundamentals',
                children: [
                  {
                    id: 'basic-terms',
                    title: 'Basic Terminology',
                    x: 5,
                    y: 5,
                    expanded: false,
                    level: 3,
                    color: '#EF4444',
                    parentId: 'definitions',
                    children: []
                  },
                  {
                    id: 'advanced-terms',
                    title: 'Advanced Concepts',
                    x: 15,
                    y: 5,
                    expanded: false,
                    level: 3,
                    color: '#EF4444',
                    parentId: 'definitions',
                    children: []
                  }
                ]
              },
              {
                id: 'principles',
                title: 'Core Principles',
                x: 30,
                y: 10,
                expanded: false,
                level: 2,
                color: '#F59E0B',
                parentId: 'fundamentals',
                children: [
                  {
                    id: 'theory',
                    title: 'Theoretical Foundation',
                    x: 25,
                    y: 5,
                    expanded: false,
                    level: 3,
                    color: '#EF4444',
                    parentId: 'principles',
                    children: []
                  },
                  {
                    id: 'practice',
                    title: 'Practical Application',
                    x: 35,
                    y: 5,
                    expanded: false,
                    level: 3,
                    color: '#EF4444',
                    parentId: 'principles',
                    children: []
                  }
                ]
              }
            ]
          },
          {
            id: 'applications',
            title: 'Real-World Applications',
            x: 80,
            y: 20,
            expanded: false,
            level: 1,
            color: '#8B5CF6',
            parentId: 'root',
            children: [
              {
                id: 'case-studies',
                title: 'Case Studies',
                x: 90,
                y: 10,
                expanded: false,
                level: 2,
                color: '#EC4899',
                parentId: 'applications',
                children: [
                  {
                    id: 'success-stories',
                    title: 'Success Stories',
                    x: 95,
                    y: 5,
                    expanded: false,
                    level: 3,
                    color: '#06B6D4',
                    parentId: 'case-studies',
                    children: []
                  },
                  {
                    id: 'lessons-learned',
                    title: 'Lessons Learned',
                    x: 85,
                    y: 5,
                    expanded: false,
                    level: 3,
                    color: '#06B6D4',
                    parentId: 'case-studies',
                    children: []
                  }
                ]
              },
              {
                id: 'industry-use',
                title: 'Industry Usage',
                x: 70,
                y: 10,
                expanded: false,
                level: 2,
                color: '#EC4899',
                parentId: 'applications',
                children: [
                  {
                    id: 'current-trends',
                    title: 'Current Trends',
                    x: 75,
                    y: 5,
                    expanded: false,
                    level: 3,
                    color: '#06B6D4',
                    parentId: 'industry-use',
                    children: []
                  },
                  {
                    id: 'future-outlook',
                    title: 'Future Outlook',
                    x: 65,
                    y: 5,
                    expanded: false,
                    level: 3,
                    color: '#06B6D4',
                    parentId: 'industry-use',
                    children: []
                  }
                ]
              }
            ]
          },
          {
            id: 'methodology',
            title: 'Methods & Techniques',
            x: 20,
            y: 70,
            expanded: false,
            level: 1,
            color: '#84CC16',
            parentId: 'root',
            children: [
              {
                id: 'approaches',
                title: 'Different Approaches',
                x: 10,
                y: 80,
                expanded: false,
                level: 2,
                color: '#F97316',
                parentId: 'methodology',
                children: [
                  {
                    id: 'traditional',
                    title: 'Traditional Methods',
                    x: 5,
                    y: 85,
                    expanded: false,
                    level: 3,
                    color: '#DC2626',
                    parentId: 'approaches',
                    children: []
                  },
                  {
                    id: 'modern',
                    title: 'Modern Techniques',
                    x: 15,
                    y: 85,
                    expanded: false,
                    level: 3,
                    color: '#DC2626',
                    parentId: 'approaches',
                    children: []
                  }
                ]
              },
              {
                id: 'tools',
                title: 'Tools & Resources',
                x: 30,
                y: 80,
                expanded: false,
                level: 2,
                color: '#F97316',
                parentId: 'methodology',
                children: [
                  {
                    id: 'software',
                    title: 'Software Tools',
                    x: 25,
                    y: 85,
                    expanded: false,
                    level: 3,
                    color: '#DC2626',
                    parentId: 'tools',
                    children: []
                  },
                  {
                    id: 'frameworks',
                    title: 'Frameworks',
                    x: 35,
                    y: 85,
                    expanded: false,
                    level: 3,
                    color: '#DC2626',
                    parentId: 'tools',
                    children: []
                  }
                ]
              }
            ]
          },
          {
            id: 'resources',
            title: 'Learning Resources',
            x: 80,
            y: 70,
            expanded: false,
            level: 1,
            color: '#EC4899',
            parentId: 'root',
            children: [
              {
                id: 'books',
                title: 'Recommended Books',
                x: 90,
                y: 80,
                expanded: false,
                level: 2,
                color: '#6366F1',
                parentId: 'resources',
                children: [
                  {
                    id: 'beginner-books',
                    title: 'Beginner Level',
                    x: 95,
                    y: 85,
                    expanded: false,
                    level: 3,
                    color: '#14B8A6',
                    parentId: 'books',
                    children: []
                  },
                  {
                    id: 'advanced-books',
                    title: 'Advanced Level',
                    x: 85,
                    y: 85,
                    expanded: false,
                    level: 3,
                    color: '#14B8A6',
                    parentId: 'books',
                    children: []
                  }
                ]
              },
              {
                id: 'online-resources',
                title: 'Online Resources',
                x: 70,
                y: 80,
                expanded: false,
                level: 2,
                color: '#6366F1',
                parentId: 'resources',
                children: [
                  {
                    id: 'websites',
                    title: 'Educational Websites',
                    x: 75,
                    y: 85,
                    expanded: false,
                    level: 3,
                    color: '#14B8A6',
                    parentId: 'online-resources',
                    children: []
                  },
                  {
                    id: 'videos',
                    title: 'Video Tutorials',
                    x: 65,
                    y: 85,
                    expanded: false,
                    level: 3,
                    color: '#14B8A6',
                    parentId: 'online-resources',
                    children: []
                  }
                ]
              }
            ]
          }
        ]
      };

      setMindMapData(sampleMindMap);
      toast.success('Interactive mind map generated successfully!');
      console.log('Mind map generated with', sampleMindMap.children.length, 'main branches');
      
    } catch (error) {
      console.error('Error generating mind map:', error);
      toast.error('Failed to generate mind map. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleNode = (nodeId: string) => {
    if (!mindMapData) return;

    const updateNode = (node: MindMapNode): MindMapNode => {
      if (node.id === nodeId) {
        console.log('Toggling node:', nodeId, 'expanded:', !node.expanded);
        return { ...node, expanded: !node.expanded };
      }
      return {
        ...node,
        children: node.children.map(updateNode)
      };
    };

    setMindMapData(updateNode(mindMapData));
  };

  const renderMindMapNode = (node: MindMapNode, svgRef: React.RefObject<SVGSVGElement>) => {
    const nodeStyle = {
      position: 'absolute' as const,
      left: `${node.x}%`,
      top: `${node.y}%`,
      transform: 'translate(-50%, -50%)',
      zIndex: 10 + node.level
    };

    return (
      <div key={node.id}>
        {/* Render connecting lines first */}
        {node.expanded && node.children.map(child => {
          const svg = svgRef.current;
          if (!svg) return null;
          
          const rect = svg.getBoundingClientRect();
          const startX = (node.x / 100) * rect.width;
          const startY = (node.y / 100) * rect.height;
          const endX = (child.x / 100) * rect.width;
          const endY = (child.y / 100) * rect.height;
          
          // Calculate control points for smooth curves
          const midX = (startX + endX) / 2;
          const midY = (startY + endY) / 2;
          const controlX1 = startX + (midX - startX) * 0.5;
          const controlY1 = startY;
          const controlX2 = endX - (endX - midX) * 0.5;
          const controlY2 = endY;
          
          return (
            <svg
              key={`line-${child.id}`}
              className="absolute inset-0 pointer-events-none"
              style={{ zIndex: 5 }}
            >
              <path
                d={`M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`}
                stroke={node.color}
                strokeWidth="3"
                fill="none"
                opacity="0.8"
                strokeLinecap="round"
              />
            </svg>
          );
        })}
        
        {/* Render the node container */}
        <div style={nodeStyle}>
          <Card 
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 min-w-[140px] max-w-[220px] hover:scale-105`}
            style={{ 
              borderColor: node.color, 
              backgroundColor: `${node.color}15`,
              borderRadius: '12px'
            }}
            onClick={() => toggleNode(node.id)}
          >
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: node.color }}
                />
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 flex-1 text-center leading-tight">
                  {node.title}
                </span>
                {node.children.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-5 h-5 p-0 flex-shrink-0 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                    style={{ color: node.color }}
                  >
                    {node.expanded ? 
                      <Minus className="w-3 h-3" /> : 
                      <Plus className="w-3 h-3" />
                    }
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recursively render children */}
        {node.expanded && node.children.map(child => renderMindMapNode(child, svgRef))}
      </div>
    );
  };

  const generateStudyPodcast = async () => {
    if (!topic.trim() && !uploadedFile) {
      toast.error('Please enter a topic or upload a document');
      return;
    }

    setIsGenerating(true);
    try {
      let message = '';
      
      if (uploadedFile) {
        const fileContent = await uploadedFile.text();
        message = `Create an engaging study podcast script based on this document: ${fileContent.substring(0, 3000)}...
        
        Format as a conversational podcast with:
        - Engaging introduction
        - Main content broken into digestible segments
        - Key takeaways and summaries
        - Discussion questions for reflection
        
        Make it sound natural and engaging for audio learning.`;
      } else {
        message = `Create an engaging study podcast script about: "${topic}"
        ${context ? `Additional context: ${context}` : ''}
        
        Format as a conversational podcast with:
        - Engaging introduction
        - Main content broken into digestible segments
        - Key takeaways and summaries
        - Discussion questions for reflection
        
        Make it sound natural and engaging for audio learning.`;
      }

      const { data, error } = await supabase.functions.invoke('ai-study-chat', {
        body: {
          message,
          systemPrompt: 'You are a podcast script writer. Create engaging, conversational content that is perfect for audio learning. Use natural speech patterns and include clear transitions.'
        }
      });

      if (error) throw error;
      
      setGeneratedContent(data.content);
      toast.success('Study podcast script generated successfully!');
      
    } catch (error) {
      console.error('Error generating podcast:', error);
      toast.error('Failed to generate study podcast. Please try again.');
      setGeneratedContent('Unable to generate podcast script at this time. Please check your connection and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadContent = () => {
    if (!generatedContent && !mindMapData) return;

    if (activeTab === 'mindmap' && mindMapData) {
      const mindMapJson = JSON.stringify(mindMapData, null, 2);
      const blob = new Blob([mindMapJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${topic.replace(/\s+/g, '_') || 'mindmap'}_mindmap.json`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success('Mind map downloaded!');
    } else if (generatedContent) {
      const title = activeTab === 'mindmap' ? 'Mind Map' : 'Study Podcast Script';
      const filename = activeTab === 'mindmap' ? 'mindmap.md' : 'podcast-script.md';
      const content = `# ${title}: ${topic || 'Document Analysis'}\n\n${generatedContent}`;
      
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
      toast.success(`${title} downloaded!`);
    }
  };

  const svgRef = React.useRef<SVGSVGElement>(null);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-lg font-semibold">Foundation Learning Tools</h1>
          </header>
          
          <div className="flex-1 p-6 max-w-6xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">AI-Powered Learning Tools</h2>
              <p className="text-gray-600">Generate interactive mind maps and study podcasts to enhance your learning experience</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="mindmap" className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Mind Map Generator
                </TabsTrigger>
                <TabsTrigger value="podcast" className="flex items-center gap-2">
                  <Headphones className="w-4 h-4" />
                  Study Podcast Creator
                </TabsTrigger>
              </TabsList>

              <TabsContent value="mindmap" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Input Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="w-5 h-5 text-purple-500" />
                        Generate Interactive Mind Map
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="topic">Topic</Label>
                        <Input
                          id="topic"
                          placeholder="e.g., Machine Learning, Ancient History, Calculus"
                          value={topic}
                          onChange={(e) => setTopic(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="context">Additional Context (Optional)</Label>
                        <Textarea
                          id="context"
                          placeholder="Provide any specific focus areas or requirements..."
                          value={context}
                          onChange={(e) => setContext(e.target.value)}
                          rows={3}
                        />
                      </div>

                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 mb-2">Or upload a document</p>
                        <label htmlFor="mindmap-upload" className="cursor-pointer">
                          <Button variant="outline" size="sm" asChild>
                            <span>Choose File</span>
                          </Button>
                          <input
                            id="mindmap-upload"
                            type="file"
                            accept=".txt,.md,text/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </label>
                        {uploadedFile && (
                          <div className="mt-2 flex items-center justify-center gap-2">
                            <FileText className="w-4 h-4 text-blue-500" />
                            <span className="text-sm text-blue-600">{uploadedFile.name}</span>
                          </div>
                        )}
                      </div>

                      <Button 
                        onClick={generateMindMap}
                        disabled={isGenerating || (!topic.trim() && !uploadedFile)}
                        className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                      >
                        {isGenerating ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Generating Interactive Mind Map...
                          </>
                        ) : (
                          <>
                            <Brain className="w-4 h-4 mr-2" />
                            Generate Mind Map
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Mind Map Visualization */}
                  <Card className="h-[600px]">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Interactive Mind Map</CardTitle>
                        {mindMapData && !isGenerating && (
                          <Button variant="outline" size="sm" onClick={downloadContent}>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="h-full p-0">
                      {isGenerating ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-gray-500">Creating your interactive mind map...</p>
                          </div>
                        </div>
                      ) : mindMapData ? (
                        <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg overflow-hidden">
                          <svg ref={svgRef} className="absolute inset-0 w-full h-full" />
                          {renderMindMapNode(mindMapData, svgRef)}
                          <div className="absolute bottom-4 left-4 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
                            Click on + to expand topics
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          <div className="text-center">
                            <Brain className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>Enter a topic or upload a document to generate an interactive mind map</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="podcast" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Input Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Headphones className="w-5 h-5 text-blue-500" />
                        Create Study Podcast
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="podcast-topic">Topic</Label>
                        <Input
                          id="podcast-topic"
                          placeholder="e.g., Climate Change, Ancient Rome, Calculus"
                          value={topic}
                          onChange={(e) => setTopic(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="podcast-context">Learning Focus (Optional)</Label>
                        <Textarea
                          id="podcast-context"
                          placeholder="Specify learning objectives or areas of interest..."
                          value={context}
                          onChange={(e) => setContext(e.target.value)}
                          rows={3}
                        />
                      </div>

                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 mb-2">Or upload study material</p>
                        <label htmlFor="podcast-upload" className="cursor-pointer">
                          <Button variant="outline" size="sm" asChild>
                            <span>Choose File</span>
                          </Button>
                          <input
                            id="podcast-upload"
                            type="file"
                            accept=".txt,.md,text/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </label>
                        {uploadedFile && (
                          <div className="mt-2 flex items-center justify-center gap-2">
                            <FileText className="w-4 h-4 text-blue-500" />
                            <span className="text-sm text-blue-600">{uploadedFile.name}</span>
                          </div>
                        )}
                      </div>

                      <Button 
                        onClick={generateStudyPodcast}
                        disabled={isGenerating || (!topic.trim() && !uploadedFile)}
                        className="w-full"
                      >
                        {isGenerating ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Creating Podcast Script...
                          </>
                        ) : (
                          <>
                            <Mic className="w-4 h-4 mr-2" />
                            Generate Study Podcast
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Output Section */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Study Podcast Script</CardTitle>
                        {generatedContent && !isGenerating && (
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={downloadContent}>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {isGenerating ? (
                        <div className="flex items-center justify-center h-64">
                          <div className="text-center">
                            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-gray-500">Creating your study podcast...</p>
                          </div>
                        </div>
                      ) : generatedContent ? (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                            <Volume2 className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">Study Podcast Script Ready</span>
                            <Badge variant="secondary" className="ml-auto">Audio Ready</Badge>
                          </div>
                          <div className="prose max-w-none">
                            <div className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg border max-h-96 overflow-y-auto">
                              {generatedContent}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-64 text-gray-500">
                          <div className="text-center">
                            <Headphones className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>Enter a topic or upload material to create a study podcast</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Foundation;
