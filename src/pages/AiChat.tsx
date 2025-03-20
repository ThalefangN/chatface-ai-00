
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
import { toast } from 'sonner';

interface Message {
  id?: string;
  content: string;
  is_ai: boolean;
  created_at?: string;
}

interface PracticeSession {
  id: string;
  type: string;
  title: string;
  duration: number | null;
  created_at: string;
  updated_at?: string;
}

const AiChat = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState<InterviewType | null>(null);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [aiMessages, setAiMessages] = useState<Message[]>([
    {content: "Hello! I'm your AI interview coach. I'll be guiding you through this session.", is_ai: true},
    {content: "Let's begin with a simple question: Could you introduce yourself and tell me about your background?", is_ai: true}
  ]);
  const [practiceHistory, setPracticeHistory] = useState<PracticeSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  
  const { videoRef, error, isLoading, startStream, stopStream } = useVideoStream({
    enabled: isInterviewStarted,
    audioEnabled,
  });
  
  // Fetch practice history from database
  useEffect(() => {
    if (user) {
      const fetchPracticeHistory = async () => {
        try {
          const { data, error } = await supabase
            .from('practice_sessions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
            
          if (error) throw error;
          if (data) setPracticeHistory(data);
        } catch (error) {
          console.error('Error fetching practice history:', error);
          toast.error('Failed to load practice history');
        }
      };
      
      fetchPracticeHistory();
      
      // Set up real-time subscription for practice sessions
      const practiceChannel = supabase
        .channel('practice_changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'practice_sessions',
            filter: `user_id=eq.${user.id}`
          }, 
          (payload) => {
            console.log('Practice session changed:', payload);
            fetchPracticeHistory();
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(practiceChannel);
      };
    }
  }, [user]);
  
  // Subscribe to messages for the current session
  useEffect(() => {
    if (currentSessionId) {
      const fetchSessionMessages = async () => {
        try {
          const { data, error } = await supabase
            .from('session_messages')
            .select('*')
            .eq('session_id', currentSessionId)
            .order('created_at', { ascending: true });
            
          if (error) throw error;
          if (data) {
            // Only replace messages if we got data from the database
            if (data.length > 0) {
              setAiMessages(data.map(msg => ({
                id: msg.id,
                content: msg.content,
                is_ai: msg.is_ai,
                created_at: msg.created_at
              })));
            }
          }
        } catch (error) {
          console.error('Error fetching session messages:', error);
        }
      };
      
      fetchSessionMessages();
      
      // Set up real-time subscription for session messages
      const messagesChannel = supabase
        .channel('messages_changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'session_messages',
            filter: `session_id=eq.${currentSessionId}`
          }, 
          (payload) => {
            console.log('Message changed:', payload);
            fetchSessionMessages();
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(messagesChannel);
      };
    }
  }, [currentSessionId]);
  
  const handleSelectType = (type: InterviewType) => {
    setSelectedType(type);
  };
  
  const handleStartInterview = async () => {
    if (!user || !selectedType) return;
    
    try {
      // Create a new practice session in the database
      const { data, error } = await supabase
        .from('practice_sessions')
        .insert({
          user_id: user.id,
          type: selectedType,
          title: `${selectedType} Practice`,
          duration: 0
        })
        .select()
        .single();
        
      if (error) throw error;
      
      if (data) {
        setCurrentSessionId(data.id);
        // Add initial AI messages to the database
        const initialMessages = [
          {
            session_id: data.id,
            content: "Hello! I'm your AI interview coach. I'll be guiding you through this session.",
            is_ai: true
          },
          {
            session_id: data.id,
            content: "Let's begin with a simple question: Could you introduce yourself and tell me about your background?",
            is_ai: true
          }
        ];
        
        await supabase.from('session_messages').insert(initialMessages);
      }
      
      setIsInterviewStarted(true);
      startStream();
      
      toast.success('Practice session started!');
    } catch (error) {
      console.error('Error starting practice session:', error);
      toast.error('Failed to start practice session');
    }
  };
  
  const handleEndInterview = async () => {
    if (currentSessionId) {
      try {
        // Update the duration of the practice session
        await supabase
          .from('practice_sessions')
          .update({
            updated_at: new Date().toISOString(),
            // Calculate duration based on creation time
            duration: practiceHistory.find(p => p.id === currentSessionId)?.duration || 0
          })
          .eq('id', currentSessionId);
          
        toast.success('Practice session saved!');
      } catch (error) {
        console.error('Error updating practice session:', error);
        toast.error('Failed to save practice session');
      }
    }
    
    setIsInterviewStarted(false);
    stopStream();
    setCurrentSessionId(null);
  };
  
  const handleToggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };
  
  const handleToggleVideo = () => {
    setVideoEnabled(!videoEnabled);
  };
  
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !currentSessionId) return;
    
    try {
      // Add user message to the database
      const { data: userData, error: userError } = await supabase
        .from('session_messages')
        .insert({
          session_id: currentSessionId,
          content: text,
          is_ai: false
        })
        .select()
        .single();
        
      if (userError) throw userError;
      
      setMessageInput('');
      
      // Simulate AI response after a short delay
      setTimeout(async () => {
        const responses = [
          "Could you tell me more about that?",
          "That's interesting. How did you handle that situation?",
          "Great point. Let's explore that further.",
          "I see. How does that relate to your goals?",
          "Thank you for sharing. Let's move on to the next question."
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        // Add AI response to the database
        const { error: aiError } = await supabase
          .from('session_messages')
          .insert({
            session_id: currentSessionId,
            content: randomResponse,
            is_ai: true
          });
          
        if (aiError) throw aiError;
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
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
            
            {practiceHistory.length > 0 && (
              <div className="mt-12">
                <h2 className="text-xl font-semibold mb-4">Your Recent Practice Sessions</h2>
                <AnimatedContainer className="bg-card overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                  <div className="p-6">
                    {practiceHistory.slice(0, 3).map((session) => (
                      <div 
                        key={session.id}
                        className="flex items-center justify-between py-3 border-b last:border-b-0 border-border hover:bg-muted/20 rounded-lg px-2 transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="p-2 rounded-lg bg-primary/10 mr-3">
                            {session.type === 'presentation' && <Play className="h-4 w-4 text-orange-500" />}
                            {session.type === 'interview' && <Play className="h-4 w-4 text-blue-500" />}
                            {session.type === 'public-speaking' && <Play className="h-4 w-4 text-green-500" />}
                          </div>
                          <div>
                            <h4 className="font-medium">{session.title}</h4>
                            <p className="text-xs text-muted-foreground">
                              {new Date(session.created_at).toLocaleDateString()} • {session.duration ? `${session.duration} min` : 'In progress'}
                            </p>
                          </div>
                        </div>
                        <button className="p-2 rounded-lg hover:bg-primary/10 transition-colors group">
                          <Play className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-muted/30 p-4 text-center">
                    <button 
                      onClick={() => navigate('/profile')} 
                      className="text-sm text-primary hover:underline font-medium"
                    >
                      View all sessions
                    </button>
                  </div>
                </AnimatedContainer>
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
                    key={message.id || index} 
                    className={`p-3 rounded-lg ${message.is_ai 
                      ? 'bg-blue-500/10 animate-fade-in-left' 
                      : 'bg-green-500/10 animate-fade-in-right self-end ml-auto'}`}
                    style={{ 
                      animationDelay: `${index * 0.1}s`,
                      maxWidth: '80%' 
                    }}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center gap-2 mt-auto pt-4 px-4 pb-4 border-t border-border">
                <input
                  type="text"
                  placeholder="Type your response..."
                  className="flex-1 px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage(messageInput);
                    }
                  }}
                />
                <button 
                  className="p-2 rounded-full bg-blue-500 text-primary-foreground hover:bg-blue-600 transition-colors"
                  onClick={() => handleSendMessage(messageInput)}
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
