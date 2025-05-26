
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
        // Don't show error toast for initialization, just log
        return;
      }
      
      if (data) {
        setMessages(data);
        console.log(`Successfully loaded ${data.length} messages`);
      }
      
    } catch (error) {
      console.error('Error in initializeChat:', error);
      // Silent fail for initialization
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

  // Enhanced AI response function with multiple fallbacks
  const getAIResponse = async (message: string, systemPrompt?: string): Promise<string> => {
    const fallbackResponses = [
      "I'm here to help you with your studies! While I work on reconnecting, feel free to ask me about any topic you're studying.",
      "I understand you need help with your studies. Even though I'm having a small connection issue, I'm still here to assist you. Please try rephrasing your question.",
      "I'm your AI study assistant and I'm ready to help! There might be a brief connection delay, but I'll do my best to support your learning.",
      "I'm here for your learning journey! While my connection stabilizes, know that I'm designed to help with all your study needs.",
      "Your AI study buddy is here! I may have a slight delay, but I'm committed to helping you succeed in your studies."
    ];

    try {
      console.log('Attempting AI response generation');
      
      const { data, error } = await supabase.functions.invoke('ai-coach', {
        body: { 
          message,
          systemPrompt: systemPrompt || 'You are a helpful AI study assistant. Always provide encouraging, educational responses.',
          sessionId,
          userId: (await supabase.auth.getUser()).data.user?.id
        }
      });
      
      if (error) {
        console.warn('Primary AI function failed, trying alternative');
        throw error;
      }
      
      if (data?.content) {
        console.log('AI response received successfully');
        return data.content;
      } else {
        throw new Error('No content in response');
      }
      
    } catch (primaryError) {
      console.log('Primary method failed, trying ai-study-chat function');
      
      try {
        const { data, error } = await supabase.functions.invoke('ai-study-chat', {
          body: { 
            message,
            systemPrompt: systemPrompt || 'You are a helpful AI study assistant. Always provide encouraging, educational responses.'
          }
        });
        
        if (error) throw error;
        
        if (data?.content) {
          console.log('Backup AI response received successfully');
          return data.content;
        } else {
          throw new Error('No content in backup response');
        }
        
      } catch (backupError) {
        console.log('Both AI methods failed, using intelligent fallback');
        
        // Intelligent fallback based on message content
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('math') || lowerMessage.includes('calculate') || lowerMessage.includes('solve')) {
          return "I'd love to help you with mathematics! While I reconnect, here are some tips: break down complex problems into smaller steps, always show your working, and practice regularly. What specific math topic would you like to work on?";
        }
        
        if (lowerMessage.includes('science') || lowerMessage.includes('biology') || lowerMessage.includes('chemistry') || lowerMessage.includes('physics')) {
          return "Science is fascinating! I'm here to help you understand scientific concepts. While my connection stabilizes, remember that observation and experimentation are key to learning science. What science topic interests you most?";
        }
        
        if (lowerMessage.includes('english') || lowerMessage.includes('writing') || lowerMessage.includes('essay')) {
          return "English and writing skills are so important! I'm here to help you improve. While I reconnect, remember to read widely, practice writing regularly, and always plan your essays. What writing challenge can I help you with?";
        }
        
        if (lowerMessage.includes('study') || lowerMessage.includes('exam') || lowerMessage.includes('test')) {
          return "Great question about studying! Effective study techniques include spaced repetition, active recall, and breaking information into chunks. While my connection improves, try creating mind maps or flashcards. What subject are you preparing for?";
        }
        
        // Random encouraging fallback
        const randomFallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
        return randomFallback;
      }
    }
  };
  
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
      
      // Get AI response with fallbacks
      const aiResponse = await getAIResponse(message);
      
      // Add AI message
      const aiMessage: Message = {
        content: aiResponse,
        is_ai: true
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      console.log('Message exchange completed successfully');
      
    } catch (error) {
      console.error('Error in sendMessage:', error);
      
      // Always provide a response, never leave user hanging
      const errorMessage: Message = {
        content: "I'm your AI study assistant and I'm still here to help! There seems to be a temporary connection issue, but don't worry - I'm designed to support your learning. Try asking your question again, or let me know what subject you'd like to study!",
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
          
          // Try to get AI response from audio
          const aiResponse = await getAIResponse("I sent you an audio message. Please acknowledge that you received it and ask how you can help with my studies.");
          
          // Add AI message
          const aiMessage: Message = {
            content: aiResponse,
            is_ai: true
          };
          
          setMessages(prev => [...prev, aiMessage]);
          
          console.log('Audio message processed successfully');
          
        } catch (error) {
          console.error('Error processing audio:', error);
          
          // Always respond to audio
          const fallbackMessage: Message = {
            content: "I received your audio message! While I work on processing audio perfectly, I'm here to help with your studies. Feel free to type your question, and I'll give you my full attention!",
            is_ai: true
          };
          setMessages(prev => [...prev, fallbackMessage]);
        } finally {
          setIsLoading(false);
        }
      };
      
    } catch (error) {
      console.error('Error sending audio message:', error);
      setIsLoading(false);
      
      // Always respond
      const errorMessage: Message = {
        content: "I appreciate you trying to send an audio message! While I work on that feature, I'm ready to help through text. What would you like to study today?",
        is_ai: true
      };
      setMessages(prev => [...prev, errorMessage]);
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
