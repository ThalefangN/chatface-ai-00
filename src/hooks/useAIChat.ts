
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

export const useAIChat = (sessionId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  // Initialize SpeechRecognition API
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  // Fetch messages for the current session
  const initializeChat = useCallback(async () => {
    if (!sessionId) return;
    
    try {
      console.log('Fetching messages for session:', sessionId);
      const { data, error } = await supabase
        .from('session_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });
        
      if (error) {
        console.error('Error fetching messages:', error);
        toast.error('Failed to load messages');
        return;
      }
      
      if (data) {
        setMessages(data);
        console.log(`Successfully loaded ${data.length} messages`);
      }
      
    } catch (error) {
      console.error('Error in initializeChat:', error);
      toast.error('Failed to load messages');
    }
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
      console.log('Sending message:', message.substring(0, 50) + '...');
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
      
      if (error) {
        throw error;
      }
      
      console.log('AI response received successfully');
      
      // If there's a speech response, play it
      if (data?.audioResponse) {
        playAudioResponse(data.audioResponse);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
      
      // Add error message to chat
      const errorMessage: Message = {
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        is_ai: true
      };
      setMessages(prev => [...prev, errorMessage]);
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
      console.log('Sending audio message');
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
          
          console.log('Audio message processed successfully');
          
          // If there's a speech response, play it
          if (data?.audioResponse) {
            playAudioResponse(data.audioResponse);
          }
          
        } catch (error) {
          console.error('Error processing audio:', error);
          toast.error('Failed to process audio message. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };
      
    } catch (error) {
      console.error('Error sending audio message:', error);
      setIsLoading(false);
      toast.error('Failed to send audio message. Please try again.');
    }
  };
  
  // Play audio response from the AI
  const playAudioResponse = (base64Audio: string) => {
    try {
      console.log('Playing AI audio response');
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
          console.log('AI audio started playing');
          setIsSpeaking(true);
        };
        
        audioElementRef.current.onended = () => {
          console.log('AI audio finished playing');
          setIsSpeaking(false);
          URL.revokeObjectURL(url);
        };
        
        audioElementRef.current.play()
          .catch(e => {
            console.error('Failed to play audio:', e);
            setIsSpeaking(false);
            URL.revokeObjectURL(url);
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
      console.log('Starting voice recognition');
      
      if (!SpeechRecognition) {
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
        console.log('Audio recording stopped, processing...');
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        sendAudioMessage(audioBlob);
        audioChunksRef.current = [];
      };
      
      mediaRecorderRef.current.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        toast.error('Recording error occurred');
        setIsListening(false);
      };
      
      mediaRecorderRef.current.start();
      setIsListening(true);
      console.log('Voice recognition started successfully');
      
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      toast.error('Failed to start voice recognition. Please check microphone permissions.');
      setIsListening(false);
    }
  };
  
  // Stop voice recognition
  const stopListening = () => {
    console.log('Stopping voice recognition');
    setIsListening(false);
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => {
          track.stop();
          console.log('Audio track stopped');
        });
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
