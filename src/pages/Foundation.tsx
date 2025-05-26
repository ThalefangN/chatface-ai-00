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

  const generateWithRetry = async (message: string, attempt = 0): Promise<string> => {
    const maxRetries = 3;
    
    try {
      console.log(`Attempting to generate content (attempt ${attempt + 1})`);
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 45000)
      );
      
      const invokePromise = supabase.functions.invoke('ai-study-chat', {
        body: {
          message,
          systemPrompt: 'You are a helpful AI study assistant. Provide clear, comprehensive content based on the user request. Format your response in a readable way with proper structure.'
        }
      });

      const { data, error } = await Promise.race([invokePromise, timeoutPromise]) as any;

      if (error) throw error;
      
      if (data && data.content) {
        console.log('Content generated successfully');
        return data.content;
      } else {
        throw new Error('No content received from AI');
      }
    } catch (error) {
      console.error(`Error generating content (attempt ${attempt + 1}):`, error);
      
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`Retrying content generation in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return generateWithRetry(message, attempt + 1);
      }
      
      throw error;
    }
  };

  const generateMindMap = async () => {
    if (!topic.trim() && !uploadedFile) {
      toast.error('Please enter a topic or upload a document');
      return;
    }

    setIsGenerating(true);
    try {
      // Create a sample mind map structure
      const sampleMindMap: MindMapNode = {
        id: 'root',
        title: topic || 'Document Analysis',
        x: 50,
        y: 50,
        expanded: true,
        level: 0,
        color: '#3B82F6',
        children: [
          {
            id: 'branch1',
            title: 'Key Concepts',
            x: 25,
            y: 25,
            expanded: false,
            level: 1,
            color: '#10B981',
            parentId: 'root',
            children: [
              {
                id: 'sub1-1',
                title: 'Definition',
                x: 15,
                y: 15,
                expanded: false,
                level: 2,
                color: '#F59E0B',
                parentId: 'branch1',
                children: []
              },
              {
                id: 'sub1-2',
                title: 'Examples',
                x: 35,
                y: 15,
                expanded: false,
                level: 2,
                color: '#F59E0B',
                parentId: 'branch1',
                children: []
              }
            ]
          },
          {
            id: 'branch2',
            title: 'Applications',
            x: 75,
            y: 25,
            expanded: false,
            level: 1,
            color: '#8B5CF6',
            parentId: 'root',
            children: [
              {
                id: 'sub2-1',
                title: 'Real World Uses',
                x: 85,
                y: 15,
                expanded: false,
                level: 2,
                color: '#EF4444',
                parentId: 'branch2',
                children: []
              },
              {
                id: 'sub2-2',
                title: 'Case Studies',
                x: 65,
                y: 15,
                expanded: false,
                level: 2,
                color: '#EF4444',
                parentId: 'branch2',
                children: []
              }
            ]
          },
          {
            id: 'branch3',
            title: 'Related Topics',
            x: 25,
            y: 75,
            expanded: false,
            level: 1,
            color: '#EC4899',
            parentId: 'root',
            children: [
              {
                id: 'sub3-1',
                title: 'Connections',
                x: 15,
                y: 85,
                expanded: false,
                level: 2,
                color: '#06B6D4',
                parentId: 'branch3',
                children: []
              }
            ]
          },
          {
            id: 'branch4',
            title: 'Resources',
            x: 75,
            y: 75,
            expanded: false,
            level: 1,
            color: '#84CC16',
            parentId: 'root',
            children: [
              {
                id: 'sub4-1',
                title: 'Books',
                x: 85,
                y: 85,
                expanded: false,
                level: 2,
                color: '#F97316',
                parentId: 'branch4',
                children: []
              },
              {
                id: 'sub4-2',
                title: 'Online Sources',
                x: 65,
                y: 85,
                expanded: false,
                level: 2,
                color: '#F97316',
                parentId: 'branch4',
                children: []
              }
            ]
          }
        ]
      };

      setMindMapData(sampleMindMap);
      toast.success('Mind map generated successfully!');
      
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
      zIndex: 10
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
          
          const midX = (startX + endX) / 2;
          const midY = (startY + endY) / 2;
          
          const path = `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`;
          
          return (
            <svg
              key={`line-${child.id}`}
              className="absolute inset-0 pointer-events-none"
              style={{ zIndex: 5 }}
            >
              <path
                d={path}
                stroke={node.color}
                strokeWidth="2"
                fill="none"
                opacity="0.7"
              />
            </svg>
          );
        })}
        
        {/* Render the node container */}
        <div style={nodeStyle}>
          <Card 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 min-w-[120px] max-w-[200px]`}
            style={{ borderColor: node.color, backgroundColor: `${node.color}10` }}
            onClick={() => toggleNode(node.id)}
          >
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: node.color }}
                />
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 flex-1 text-center">
                  {node.title}
                </span>
                {node.children.length > 0 && (
                  <Button variant="ghost" size="sm" className="w-4 h-4 p-0 flex-shrink-0">
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

      const result = await generateWithRetry(message);
      setGeneratedContent(result);
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
              <p className="text-gray-600">Generate mind maps and study podcasts to enhance your learning experience</p>
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
                        Generate Mind Map
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="topic">Topic</Label>
                        <Input
                          id="topic"
                          placeholder="e.g., Photosynthesis, World War II, Algebra"
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
                        className="w-full"
                      >
                        {isGenerating ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Generating Mind Map...
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
