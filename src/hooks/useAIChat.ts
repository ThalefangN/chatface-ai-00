
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Message {
  id?: string;
  content: string;
  is_ai: boolean;
  created_at?: string;
}

export const useAIChat = (sessionId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { user } = useAuth();
  
  // Speech recognition
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isListening, setIsListening] = useState(false);

  // Initialize speech recognition
  useEffect(() => {
    // Check if the browser supports the Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          sendMessage(transcript);
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error('Speech recognition error. Please try again.');
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
    
    // Initialize audio context for playing responses
    audioContextRef.current = new (window.AudioContext)();
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Start voice recognition
  const startListening = () => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition is not supported in your browser');
      return;
    }
    
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setIsListening(false);
      toast.error('Failed to start speech recognition');
    }
  };

  // Stop voice recognition
  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Play audio from base64 string
  const playAudio = async (base64Audio: string) => {
    if (!base64Audio || !audioContextRef.current) return;
    
    try {
      setIsSpeaking(true);
      
      // Convert base64 to ArrayBuffer
      const binaryString = atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Decode audio data and play it
      const audioBuffer = await audioContextRef.current.decodeAudioData(bytes.buffer);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      
      source.onended = () => {
        setIsSpeaking(false);
      };
      
      source.start(0);
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsSpeaking(false);
      // Fall back to text-to-speech API if available
      if ('speechSynthesis' in window) {
        const lastAIMessage = messages.filter(m => m.is_ai).pop();
        if (lastAIMessage) {
          const utterance = new SpeechSynthesisUtterance(lastAIMessage.content);
          utterance.onend = () => setIsSpeaking(false);
          speechSynthesis.speak(utterance);
        }
      }
    }
  };

  // Initialize chat with greeting messages
  const initializeChat = async () => {
    if (!sessionId || !user) return;
    
    try {
      // Check if we already have messages for this session
      const { data, error } = await supabase
        .from('session_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Use existing messages
        setMessages(data);
      } else {
        // Create initial messages if this is a new session
        const initialMessages: Omit<Message, 'id' | 'created_at'>[] = [
          {
            content: "Hello! I'm your AI interview coach. I'll be guiding you through this session.",
            is_ai: true
          },
          {
            content: "Let's begin with a simple question: Could you introduce yourself and tell me about your background?",
            is_ai: true
          }
        ];
        
        // Save initial messages to database
        const promises = initialMessages.map(msg => 
          supabase.from('session_messages').insert({
            session_id: sessionId,
            content: msg.content,
            is_ai: msg.is_ai
          })
        );
        
        await Promise.all(promises);
        
        // Fetch the inserted messages to get their IDs
        const { data: updatedData } = await supabase
          .from('session_messages')
          .select('*')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: true });
          
        if (updatedData) {
          setMessages(updatedData);
          
          // Use built-in browser TTS for the welcome message
          if ('speechSynthesis' in window) {
            setIsSpeaking(true);
            const utterance = new SpeechSynthesisUtterance(initialMessages[0].content + ' ' + initialMessages[1].content);
            utterance.onend = () => setIsSpeaking(false);
            speechSynthesis.speak(utterance);
          }
        }
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
      toast.error('Failed to load conversation');
    }
  };

  // Send audio data to the server
  const sendAudio = async (audioData: string) => {
    if (!audioData || !sessionId || !user) return;
    
    try {
      setIsLoading(true);
      
      // Call the edge function with audio data
      const { data: functionData, error: functionError } = await supabase.functions.invoke('ai-coach', {
        body: {
          sessionId,
          userId: user.id,
          audioData
        }
      });
      
      if (functionError) throw functionError;
      
      // If there's audio in the response, play it
      if (functionData.audioResponse) {
        playAudio(functionData.audioResponse);
      } else if ('speechSynthesis' in window) {
        // Fall back to browser's text-to-speech
        setIsSpeaking(true);
        const utterance = new SpeechSynthesisUtterance(functionData.message);
        utterance.onend = () => setIsSpeaking(false);
        speechSynthesis.speak(utterance);
      }
      
    } catch (error) {
      console.error('Error sending audio:', error);
      toast.error('Failed to process speech');
    } finally {
      setIsLoading(false);
    }
  };

  // Send text message to the server
  const sendMessage = async (content: string) => {
    if (!content.trim() || !sessionId || !user) return;
    
    try {
      setIsLoading(true);
      
      // Add user message to UI immediately for better UX
      const tempUserMessage: Message = {
        content,
        is_ai: false,
        created_at: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, tempUserMessage]);
      
      // Call the edge function with text
      const { data: functionData, error: functionError } = await supabase.functions.invoke('ai-coach', {
        body: {
          message: content,
          sessionId,
          userId: user.id
        }
      });
      
      if (functionError) throw functionError;
      
      // Update messages from the database to get the correct IDs
      const { data: updatedData } = await supabase
        .from('session_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });
        
      if (updatedData) {
        setMessages(updatedData);
      }
      
      // If there's audio in the response, play it
      if (functionData.audioResponse) {
        playAudio(functionData.audioResponse);
      } else if ('speechSynthesis' in window) {
        // Fall back to browser's text-to-speech
        setIsSpeaking(true);
        const utterance = new SpeechSynthesisUtterance(functionData.message);
        utterance.onend = () => setIsSpeaking(false);
        speechSynthesis.speak(utterance);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
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
