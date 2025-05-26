
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
import { Brain, Headphones, Upload, FileText, Play, Download, Mic, Volume2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Foundation = () => {
  const [activeTab, setActiveTab] = useState('mindmap');
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState('');
  const [context, setContext] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [generatedContent, setGeneratedContent] = useState('');
  const [audioUrl, setAudioUrl] = useState('');

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
      let message = '';
      
      if (uploadedFile) {
        const fileContent = await uploadedFile.text();
        message = `Create a comprehensive mind map outline for this document content: ${fileContent.substring(0, 3000)}... 
        
        Format the mind map as a structured outline with:
        - Main topic as the center
        - Primary branches (3-5 main categories)
        - Secondary branches (2-4 sub-topics per main category)
        - Key points and details for each branch
        
        Use clear hierarchical structure with bullet points and indentation.`;
      } else {
        message = `Create a comprehensive mind map outline for the topic: "${topic}"
        ${context ? `Additional context: ${context}` : ''}
        
        Format the mind map as a structured outline with:
        - Main topic as the center
        - Primary branches (3-5 main categories)
        - Secondary branches (2-4 sub-topics per main category)
        - Key points and details for each branch
        
        Use clear hierarchical structure with bullet points and indentation.`;
      }

      const result = await generateWithRetry(message);
      setGeneratedContent(result);
      toast.success('Mind map generated successfully!');
      
    } catch (error) {
      console.error('Error generating mind map:', error);
      toast.error('Failed to generate mind map. Please try again.');
      setGeneratedContent('Unable to generate mind map at this time. Please check your connection and try again.');
    } finally {
      setIsGenerating(false);
    }
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
    if (!generatedContent) return;

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
  };

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

                  {/* Output Section */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Generated Mind Map</CardTitle>
                        {generatedContent && !isGenerating && (
                          <Button variant="outline" size="sm" onClick={downloadContent}>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {isGenerating ? (
                        <div className="flex items-center justify-center h-64">
                          <div className="text-center">
                            <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-gray-500">Creating your mind map...</p>
                          </div>
                        </div>
                      ) : generatedContent ? (
                        <div className="prose max-w-none">
                          <div className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg border">
                            {generatedContent}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-64 text-gray-500">
                          <div className="text-center">
                            <Brain className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>Enter a topic or upload a document to generate a mind map</p>
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
