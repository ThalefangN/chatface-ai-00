
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import MobileNavigation from '@/components/MobileNavigation';
import VideoContainer from '@/components/VideoContainer';
import InterviewSelector, { InterviewType } from '@/components/InterviewSelector';
import AnimatedContainer from '@/components/AnimatedContainer';
import { useVideoStream } from '@/hooks/useVideoStream';
import { ArrowLeft, MicIcon, Play, Video, X } from 'lucide-react';

const AiChat = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<InterviewType | null>(null);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  
  const { videoRef, error, isLoading, startStream, stopStream } = useVideoStream({
    enabled: isInterviewStarted,
    audioEnabled,
  });
  
  const handleSelectType = (type: InterviewType) => {
    setSelectedType(type);
  };
  
  const handleStartInterview = () => {
    setIsInterviewStarted(true);
    startStream();
  };
  
  const handleEndInterview = () => {
    setIsInterviewStarted(false);
    stopStream();
    // Here you would typically save the session data
  };
  
  const handleToggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };
  
  const handleToggleVideo = () => {
    setVideoEnabled(!videoEnabled);
  };
  
  // Simulated AI messages for the demo
  const aiMessages = [
    "Hello! I'm your AI interview coach. I'll be guiding you through this session.",
    "Let's begin with a simple question: Could you introduce yourself and tell me about your background?",
    "Great! Now, could you explain a challenging situation you've faced and how you handled it?",
    "Thank you for sharing. Could you elaborate on the specific skills you used in that situation?",
    "Excellent. Now, let's focus on your presentation skills. Pretend you're pitching a new product to potential investors."
  ];
  
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
            
            <AnimatedContainer className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                    <MicIcon className="h-5 w-5 text-primary animate-pulse" />
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
              
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {aiMessages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg ${index % 2 === 0 ? 'bg-primary/5 animate-fade-in-left' : 'bg-muted/50 animate-fade-in-right self-end'}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <p className="text-sm">{message}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center gap-2 mt-auto pt-4 border-t border-border">
                <input
                  type="text"
                  placeholder="Type your response..."
                  className="flex-1 px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                />
                <button className="p-2 rounded-full bg-primary text-primary-foreground">
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
