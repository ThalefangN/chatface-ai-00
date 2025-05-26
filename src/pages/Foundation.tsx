
import React, { useState, useRef } from 'react';
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Headphones, Upload, FileText, Download, Mic, Play, Pause, Volume2, Video, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { generateStudyContent } from '@/utils/aiHelper';

const Foundation = () => {
  const [activeTab, setActiveTab] = useState('mindmap');
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState('');
  const [context, setContext] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [generatedContent, setGeneratedContent] = useState('');
  const [podcastFormat, setPodcastFormat] = useState<'audio' | 'video'>('audio');
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const ELEVENLABS_API_KEY = 'sk_41fe04dabe3cec32f4ae370fd8f94ccd2332e19e05fc4aa6';
  const VOICE_ID = '9BWtsMINqrJLrRacOk9x'; // Aria voice

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

  const generateWithAI = async (message: string): Promise<string> => {
    try {
      console.log('Generating content with AI');
      
      const { data, error } = await supabase.functions.invoke('ai-study-chat', {
        body: {
          message,
          systemPrompt: 'You are a helpful AI study assistant. Provide clear, comprehensive content based on the user request. Format your response in a readable way with proper structure.'
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }
      
      if (data && data.content) {
        console.log('Content generated successfully');
        return data.content;
      } else {
        throw new Error('No content received from AI');
      }
    } catch (error) {
      console.error('Error generating content:', error);
      throw error;
    }
  };

  const generateElevenLabsAudio = async (text: string): Promise<string> => {
    try {
      setIsGeneratingAudio(true);
      console.log('Generating audio with ElevenLabs...');

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0.0,
            use_speaker_boost: true
          }
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      console.log('Audio generated successfully');
      return audioUrl;
    } catch (error) {
      console.error('Error generating audio:', error);
      throw error;
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const generateMindMap = async () => {
    if (!topic.trim() && !uploadedFile) {
      toast.error('Please enter a topic or upload a document');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateStudyContent(
        topic || 'Document Analysis',
        'mindmap',
        uploadedFile ? await uploadedFile.text() : context
      );
      
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
      const result = await generateStudyContent(
        topic || 'Document Analysis',
        'podcast',
        uploadedFile ? await uploadedFile.text() : context
      );
      
      setGeneratedContent(result);
      
      // Generate actual audio using ElevenLabs
      if (podcastFormat === 'audio') {
        try {
          const audioUrl = await generateElevenLabsAudio(result);
          setGeneratedAudioUrl(audioUrl);
          setGeneratedVideoUrl(null);
          toast.success('Study audio podcast generated successfully!');
        } catch (audioError) {
          console.error('Audio generation failed:', audioError);
          toast.error('Script generated but audio generation failed. You can still read the script.');
        }
      } else {
        // For video, we'll simulate for now (would need video generation API)
        const simulatedVideoUrl = URL.createObjectURL(new Blob([result], { type: 'text/plain' }));
        setGeneratedVideoUrl(simulatedVideoUrl);
        setGeneratedAudioUrl(null);
        toast.success('Study video script generated successfully!');
      }
      
    } catch (error) {
      console.error('Error generating podcast:', error);
      toast.error(`Failed to generate study ${podcastFormat}. Please try again.`);
      setGeneratedContent(`Unable to generate ${podcastFormat} script at this time. Please check your connection and try again.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlayback = () => {
    if (podcastFormat === 'audio' && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else if (podcastFormat === 'video' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const downloadContent = () => {
    if (!generatedContent) return;

    const title = activeTab === 'mindmap' ? 'Mind Map' : `Study ${podcastFormat.charAt(0).toUpperCase() + podcastFormat.slice(1)} Script`;
    const filename = activeTab === 'mindmap' ? 'mindmap.md' : `podcast-script.md`;
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
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
                            <Loader2 className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
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
                        <Label htmlFor="podcast-format">Format</Label>
                        <Select value={podcastFormat} onValueChange={(value: 'audio' | 'video') => setPodcastFormat(value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="audio">
                              <div className="flex items-center gap-2">
                                <Volume2 className="w-4 h-4" />
                                Audio Podcast
                              </div>
                            </SelectItem>
                            <SelectItem value="video">
                              <div className="flex items-center gap-2">
                                <Video className="w-4 h-4" />
                                Video Podcast (Script Only)
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

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
                        disabled={isGenerating || isGeneratingAudio || (!topic.trim() && !uploadedFile)}
                        className="w-full"
                      >
                        {isGenerating || isGeneratingAudio ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {isGeneratingAudio ? 'Generating Audio...' : `Creating ${podcastFormat}...`}
                          </>
                        ) : (
                          <>
                            <Mic className="w-4 h-4 mr-2" />
                            Generate Study {podcastFormat.charAt(0).toUpperCase() + podcastFormat.slice(1)}
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Output Section */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Study {podcastFormat.charAt(0).toUpperCase() + podcastFormat.slice(1)}</CardTitle>
                        {generatedContent && !isGenerating && (
                          <Button variant="outline" size="sm" onClick={downloadContent}>
                            <Download className="w-4 h-4 mr-2" />
                            Download Script
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {isGenerating || isGeneratingAudio ? (
                        <div className="flex items-center justify-center h-64">
                          <div className="text-center">
                            <Loader2 className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
                            <p className="text-gray-500">
                              {isGeneratingAudio ? 'Converting to audio...' : `Creating your study ${podcastFormat}...`}
                            </p>
                          </div>
                        </div>
                      ) : generatedContent ? (
                        <div className="space-y-4">
                          {/* Media Player */}
                          {generatedAudioUrl && podcastFormat === 'audio' && (
                            <div className="bg-gray-50 p-4 rounded-lg border">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                  <Volume2 className="w-4 h-4" />
                                  Audio Player (ElevenLabs AI)
                                </h4>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={togglePlayback}
                                  className="flex items-center gap-2"
                                >
                                  {isPlaying ? (
                                    <>
                                      <Pause className="w-4 h-4" />
                                      Pause
                                    </>
                                  ) : (
                                    <>
                                      <Play className="w-4 h-4" />
                                      Play
                                    </>
                                  )}
                                </Button>
                              </div>
                              
                              <audio
                                ref={audioRef}
                                controls
                                className="w-full"
                                src={generatedAudioUrl}
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                                onEnded={() => setIsPlaying(false)}
                              >
                                Your browser does not support the audio element.
                              </audio>
                            </div>
                          )}

                          {generatedVideoUrl && podcastFormat === 'video' && (
                            <div className="bg-gray-50 p-4 rounded-lg border">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                  <Video className="w-4 h-4" />
                                  Video Script
                                </h4>
                              </div>
                              <div className="text-center py-8 text-gray-500">
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                  <Video className="w-8 h-8 text-gray-400" />
                                </div>
                                <p>Video generation coming soon!</p>
                                <p className="text-xs text-gray-400 mt-1">
                                  Currently showing the script. Video generation would require additional video API integration.
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Script Content */}
                          <div className="prose max-w-none">
                            <h4 className="font-medium text-gray-900 mb-2">Generated Script:</h4>
                            <div className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg border max-h-64 overflow-y-auto">
                              {generatedContent}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-64 text-gray-500">
                          <div className="text-center">
                            <Headphones className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>Enter a topic or upload material to create a study {podcastFormat}</p>
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
