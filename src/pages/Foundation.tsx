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
  const [selectedVoice, setSelectedVoice] = useState('alloy');
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // OpenAI TTS voices
  const openAIVoices = [
    { id: 'alloy', name: 'Alloy - Neutral' },
    { id: 'echo', name: 'Echo - Male' },
    { id: 'fable', name: 'Fable - British Male' },
    { id: 'onyx', name: 'Onyx - Deep Male' },
    { id: 'nova', name: 'Nova - Female' },
    { id: 'shimmer', name: 'Shimmer - Soft Female' },
    { id: 'coral', name: 'Coral - Warm Female' },
    { id: 'sage', name: 'Sage - Wise' },
    { id: 'ballad', name: 'Ballad - Storytelling' },
    { id: 'ash', name: 'Ash - Clear' }
  ];

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
    setGeneratedAudioUrl(null);
    setGeneratedVideoUrl(null);
    
    try {
      console.log('Starting podcast generation...');
      
      // First generate the script
      const result = await generateStudyContent(
        topic || 'Document Analysis',
        'podcast',
        uploadedFile ? await uploadedFile.text() : context
      );
      
      console.log('Script generated successfully, length:', result.length);
      setGeneratedContent(result);
      
      // Then generate audio if requested
      if (podcastFormat === 'audio') {
        console.log('Generating audio with voice:', selectedVoice);
        
        try {
          // Clean the script for better TTS but keep the full content
          const cleanedScript = result
            .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting
            .replace(/#{1,6}\s*/g, '') // Remove headers
            .replace(/\[(.*?)\]/g, '') // Remove brackets
            .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newlines
            .trim();
          
          console.log('Full script will be converted to audio, length:', cleanedScript.length);
          
          // Split the script into chunks if it's very long (OpenAI has a 4096 character limit)
          const maxChunkSize = 4000;
          const chunks = [];
          
          if (cleanedScript.length > maxChunkSize) {
            // Split by sentences to maintain natural flow
            const sentences = cleanedScript.split(/(?<=[.!?])\s+/);
            let currentChunk = '';
            
            for (const sentence of sentences) {
              if ((currentChunk + sentence).length > maxChunkSize && currentChunk.length > 0) {
                chunks.push(currentChunk.trim());
                currentChunk = sentence;
              } else {
                currentChunk += (currentChunk ? ' ' : '') + sentence;
              }
            }
            
            if (currentChunk.trim()) {
              chunks.push(currentChunk.trim());
            }
          } else {
            chunks.push(cleanedScript);
          }
          
          console.log(`Script split into ${chunks.length} chunks for audio generation`);
          
          // Generate audio for all chunks
          const audioChunks = [];
          
          for (let i = 0; i < chunks.length; i++) {
            console.log(`Generating audio for chunk ${i + 1}/${chunks.length}, length: ${chunks[i].length}`);
            
            const { data, error } = await supabase.functions.invoke('ai-study-chat', {
              body: {
                message: chunks[i],
                systemPrompt: 'Convert this text to natural speech',
                voice: selectedVoice,
                generateAudio: true
              }
            });

            if (error) {
              console.error(`TTS generation error for chunk ${i + 1}:`, error);
              throw new Error(`Audio generation failed for chunk ${i + 1}: ${error.message || 'Unknown error'}`);
            }

            if (data?.audioUrl) {
              console.log(`Audio chunk ${i + 1} generated successfully`);
              audioChunks.push(data.audioUrl);
            } else {
              console.error(`No audio URL in response for chunk ${i + 1}:`, data);
              throw new Error(`Audio generation completed but no audio file was returned for chunk ${i + 1}`);
            }
          }
          
          // For now, we'll use the first chunk as the audio URL
          // In a full implementation, you would concatenate all audio chunks
          setGeneratedAudioUrl(audioChunks[0]);
          
          if (chunks.length > 1) {
            toast.success(`Study audio podcast generated successfully! Note: Full script audio generation with ${chunks.length} parts completed. Playing first part.`);
          } else {
            toast.success('Study audio podcast generated successfully!');
          }
          
        } catch (audioError) {
          console.error('Audio generation failed:', audioError);
          toast.error(`Script generated successfully! However, audio generation failed: ${audioError.message}. You can still read the script below.`);
        }
      } else {
        // For video, we'll simulate for now (would need video generation API)
        const simulatedVideoUrl = URL.createObjectURL(new Blob([result], { type: 'text/plain' }));
        setGeneratedVideoUrl(simulatedVideoUrl);
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

                      {podcastFormat === 'audio' && (
                        <div className="space-y-2">
                          <Label htmlFor="voice-select">AI Voice</Label>
                          <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose voice" />
                            </SelectTrigger>
                            <SelectContent>
                              {openAIVoices.map((voice) => (
                                <SelectItem key={voice.id} value={voice.id}>
                                  {voice.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

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
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Creating {podcastFormat}...
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
                      {isGenerating ? (
                        <div className="flex items-center justify-center h-64">
                          <div className="text-center">
                            <Loader2 className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
                            <p className="text-gray-500">Creating your study {podcastFormat}...</p>
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
                                  Audio Player (OpenAI TTS - {selectedVoice})
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
