
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import MobileNavigation from '@/components/MobileNavigation';
import VideoContainer from '@/components/VideoContainer';
import InterviewSelector, { InterviewType } from '@/components/InterviewSelector';
import AnimatedContainer from '@/components/AnimatedContainer';
import { useVideoStream } from '@/hooks/useVideoStream';
import { ArrowLeft, MicIcon, Play, Video, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const AiChat = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState<InterviewType | null>(null);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [aiMessages, setAiMessages] = useState<{text: string, isAi: boolean}[]>([
    {text: "Hello! I'm your AI interview coach. I'll be guiding you through this session.", isAi: true},
    {text: "Let's begin with a simple question: Could you introduce yourself and tell me about your background?", isAi: true}
  ]);
  const [practiceHistory, setPracticeHistory] = useState<any[]>([]);
  
  const { videoRef, error, isLoading, startStream, stopStream } = useVideoStream({
    enabled: isInterviewStarted,
    audioEnabled,
  });
  
  // Fetch practice history from database
  useEffect(() => {
    if (user) {
      const fetchPracticeHistory = async () => {
        try {
          // This is a placeholder - in a real app, we would fetch from Supabase
          // Example: const { data, error } = await supabase.from('practice_sessions').select('*').eq('user_id', user.id);
          // For now, we'll use the simulated data
          console.log('Would fetch practice history for user:', user.id);
          
          // Simulated data - in a real implementation, this would come from the database
          setPracticeHistory([
            {
              id: 1,
              type: 'presentation',
              title: 'Product Demo',
              date: '3 days ago',
              duration: '15 min',
            },
            {
              id: 2,
              type: 'interview',
              title: 'Technical Interview',
              date: '5 days ago',
              duration: '25 min',
            },
            {
              id: 3,
              type: 'public-speaking',
              title: 'Conference Talk',
              date: '1 week ago',
              duration: '10 min',
            }
          ]);
        } catch (error) {
          console.error('Error fetching practice history:', error);
        }
      };
      
      fetchPracticeHistory();
    }
  }, [user]);
  
  const handleSelectType = (type: InterviewType) => {
    setSelectedType(type);
  };
  
  const handleStartInterview = () => {
    setIsInterviewStarted(true);
    startStream();
    
    // In a real implementation, we would create a new practice session in the database
    // Example: await supabase.from('practice_sessions').insert({user_id: user.id, type: selectedType});
    console.log('Starting practice session:', selectedType);
  };
  
  const handleEndInterview = () => {
    setIsInterviewStarted(false);
    stopStream();
    
    // In a real implementation, we would update the practice session in the database
    console.log('Ending practice session');
  };
  
  const handleToggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };
  
  const handleToggleVideo = () => {
    setVideoEnabled(!videoEnabled);
  };
  
  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    setAiMessages(prev => [...prev, { text, isAi: false }]);
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      const responses = [
        "Could you tell me more about that?",
        "That's interesting. How did you handle that situation?",
        "Great point. Let's explore that further.",
        "I see. How does that relate to your goals?",
        "Thank you for sharing. Let's move on to the next question."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setAiMessages(prev => [...prev, { text: randomResponse, isAi: true }]);
    }, 1000);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-6 pb-24 md:pb-6">
        <div className="mb-6 flex items-center">
          <button 
            onClick={() => navigate('/home')} 
            className="mr-4 p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold">AI Practice Session</h1>
        </div>
        
        {!isInterviewStarted ? (
          <div className="max-w-3xl mx-auto animate-fade-in">
            <InterviewSelector 
              selectedType={selectedType} 
              onSelect={handleSelectType} 
            />
            
            {selectedType && (
              <div className="mt-8 text-center">
                <p className="mb-6 text-muted-foreground">
                  You've selected <span className="font-medium text-foreground">{selectedType}</span>. 
                  Ready to start your practice session?
                </p>
                <button
                  onClick={handleStartInterview}
                  className="inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start Practice Session
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 animate-fade-in">
            <VideoContainer
              videoRef={videoRef}
              isUser={true}
              isLoading={isLoading}
              error={error}
              audioEnabled={audioEnabled}
              videoEnabled={videoEnabled}
              onToggleAudio={handleToggleAudio}
              onToggleVideo={handleToggleVideo}
            />
            
            <AnimatedContainer className="h-full flex flex-col bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <div className="flex items-center justify-between mb-4 p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                    <MicIcon className="h-5 w-5 text-blue-500 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-medium">AI Coach</h3>
                    <p className="text-xs text-muted-foreground">Listening and analyzing...</p>
                  </div>
                </div>
                <button
                  onClick={handleEndInterview}
                  className="p-2 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto mb-4 space-y-4 px-4">
                {aiMessages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg ${message.isAi 
                      ? 'bg-blue-500/10 animate-fade-in-left' 
                      : 'bg-green-500/10 animate-fade-in-right self-end ml-auto'}`}
                    style={{ 
                      animationDelay: `${index * 0.1}s`,
                      maxWidth: '80%' 
                    }}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center gap-2 mt-auto pt-4 px-4 pb-4 border-t border-border">
                <input
                  type="text"
                  placeholder="Type your response..."
                  className="flex-1 px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <button 
                  className="p-2 rounded-full bg-blue-500 text-primary-foreground hover:bg-blue-600 transition-colors"
                  onClick={() => {
                    const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                    if (input) {
                      handleSendMessage(input.value);
                      input.value = '';
                    }
                  }}
                >
                  <MicIcon className="h-5 w-5" />
                </button>
                <button className="p-2 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">
                  <Video className="h-5 w-5" />
                </button>
              </div>
            </AnimatedContainer>
          </div>
        )}
      </main>
      
      <MobileNavigation />
    </div>
  );
};

export default AiChat;
