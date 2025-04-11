
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Message {
  id?: string;
  content: string;
  is_ai: boolean;
  created_at?: string;
}

interface UseAIChatProps {
  sessionId: string | null;
}

// TypeScript declaration for the SpeechRecognition API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface Window {
  SpeechRecognition?: new () => SpeechRecognition;
  webkitSpeechRecognition?: new () => SpeechRecognition;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: Event) => void;
  onend: () => void;
  onstart: () => void;
}

export const useAIChat = (sessionId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  // Initialize SpeechRecognition API
  const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  // Fetch messages for the current session
  const initializeChat = useCallback(async () => {
    if (!sessionId) return;
    
    try {
      const { data, error } = await supabase
        .from('session_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      if (data) setMessages(data);
      
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    }
  }, [sessionId]);
  
  // Set up real-time subscription for new messages
  useEffect(() => {
    if (!sessionId) return;
    
    const subscription = supabase
      .channel(`session_messages:${sessionId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'session_messages',
          filter: `session_id=eq.${sessionId}`
        }, 
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [sessionId]);
  
  // Initialize audio element for playing AI responses
  useEffect(() => {
    audioElementRef.current = new Audio();
    audioElementRef.current.addEventListener('ended', () => {
      setIsSpeaking(false);
    });
    
    audioElementRef.current.addEventListener('error', (e) => {
      console.error('Audio playback error:', e);
      setIsSpeaking(false);
    });
    
    return () => {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current = null;
      }
    };
  }, []);
  
  // Send message to the AI
  const sendMessage = async (message: string) => {
    if (!sessionId) {
      toast.error('No active session');
      return;
    }
    
    if (!message.trim()) return;
    
    try {
      setIsLoading(true);
      
      // Add user message to the UI immediately
      const userMessage: Message = {
        content: message,
        is_ai: false
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Send message to the Edge Function
      const { data, error } = await supabase.functions.invoke('ai-coach', {
        body: { 
          message,
          sessionId,
          userId: (await supabase.auth.getUser()).data.user?.id
        }
      });
      
      if (error) throw error;
      
      // If there's a speech response, play it
      if (data.audioResponse) {
        playAudioResponse(data.audioResponse);
      }
      
      // The message will be added through the realtime subscription
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Process and send audio to the AI
  const sendAudioMessage = async (audioBlob: Blob) => {
    if (!sessionId) {
      toast.error('No active session');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        try {
          // Extract base64 data (remove data URL prefix)
          const base64data = reader.result?.toString().split(',')[1];
          
          if (!base64data) {
            throw new Error('Failed to convert audio to base64');
          }
          
          // Send audio to the Edge Function
          const { data, error } = await supabase.functions.invoke('ai-coach', {
            body: { 
              audioData: base64data,
              sessionId,
              userId: (await supabase.auth.getUser()).data.user?.id
            }
          });
          
          if (error) throw error;
          
          // If there's a speech response, play it
          if (data.audioResponse) {
            playAudioResponse(data.audioResponse);
          }
          
          // The message will be added through the realtime subscription
          
        } catch (error) {
          console.error('Error processing audio:', error);
          toast.error('Failed to process audio');
        } finally {
          setIsLoading(false);
        }
      };
      
    } catch (error) {
      console.error('Error sending audio message:', error);
      toast.error('Failed to send audio message');
      setIsLoading(false);
    }
  };
  
  // Play audio response from the AI
  const playAudioResponse = (base64Audio: string) => {
    try {
      // Convert base64 to blob
      const byteCharacters = atob(base64Audio);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'audio/mp3' });
      
      // Create URL and play audio
      const url = URL.createObjectURL(blob);
      
      if (audioElementRef.current) {
        audioElementRef.current.src = url;
        
        audioElementRef.current.onplay = () => {
          setIsSpeaking(true);
          toast.info('StudyBuddy is speaking...', { duration: 2000 });
        };
        
        audioElementRef.current.play()
          .catch(e => {
            console.error('Failed to play audio:', e);
            setIsSpeaking(false);
          });
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsSpeaking(false);
    }
  };
  
  // Start voice recognition
  const startListening = async () => {
    try {
      if (!SpeechRecognitionAPI) {
        toast.error('Speech recognition is not supported in your browser');
        return;
      }
      
      // Start recording audio for sending to Whisper API
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        sendAudioMessage(audioBlob);
        audioChunksRef.current = [];
      };
      
      mediaRecorderRef.current.start();
      
      // Also start browser's speech recognition for interim results (optional)
      if (SpeechRecognitionAPI) {
        recognitionRef.current = new SpeechRecognitionAPI();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onstart = () => {
          toast.success('Listening...', { duration: 2000 });
        };
        
        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          // This is just for showing interim results, we'll send the final audio to Whisper
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
            
          console.log('Interim transcript:', transcript);
        };
        
        recognitionRef.current.onerror = (event: Event) => {
          console.error('Recognition error:', event);
        };
        
        recognitionRef.current.start();
      }
      
      setIsListening(true);
      
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      toast.error('Failed to start voice recognition');
    }
  };
  
  // Stop voice recognition
  const stopListening = () => {
    setIsListening(false);
    toast.info('Processing your voice input...', { duration: 2000 });
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    }
  };
  
  return {
    messages,
    isLoading,
    sendMessage,
    initializeChat,
    startListening,
    stopListening,
    isListening,
    isSpeaking
  };
};
