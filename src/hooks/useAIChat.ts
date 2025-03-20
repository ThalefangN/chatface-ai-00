
import { useState } from 'react';
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
  const { user } = useAuth();

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
        }
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
      toast.error('Failed to load conversation');
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || !sessionId || !user) return;
    
    try {
      setIsLoading(true);
      
      // Add user message
      const userMessage: Omit<Message, 'id' | 'created_at'> = {
        content,
        is_ai: false
      };
      
      // Save user message to database
      const { data: userData, error: userError } = await supabase
        .from('session_messages')
        .insert({
          session_id: sessionId,
          content: userMessage.content,
          is_ai: userMessage.is_ai
        })
        .select()
        .single();
      
      if (userError) throw userError;
      
      // Calculate AI response based on user's message
      // In a real implementation, this would call an AI API like OpenAI
      setTimeout(async () => {
        try {
          // Generate a contextually relevant response
          let aiResponse = "I'm processing your input...";
          
          if (content.toLowerCase().includes("introduce") || content.toLowerCase().includes("background")) {
            aiResponse = "Thanks for sharing about yourself! Could you tell me about a challenging work situation you've faced and how you handled it?";
          } else if (content.toLowerCase().includes("challenge") || content.toLowerCase().includes("difficult")) {
            aiResponse = "That's a good example of problem-solving. What would you say are your greatest strengths?";
          } else if (content.toLowerCase().includes("strength") || content.toLowerCase().includes("good at")) {
            aiResponse = "Those are valuable skills! Now, could you share what you consider to be areas for improvement?";
          } else if (content.toLowerCase().includes("weakness") || content.toLowerCase().includes("improve")) {
            aiResponse = "Self-awareness is important. How do you plan to address these areas?";
          } else {
            // More generic responses
            const responses = [
              "Could you elaborate more on that point?",
              "That's interesting. How does that relate to your career goals?",
              "Great point. Let's explore that further. Can you give a specific example?",
              "I understand. What steps have you taken to improve in this area?",
              "Thanks for sharing. Let's shift focus - where do you see yourself in five years?"
            ];
            aiResponse = responses[Math.floor(Math.random() * responses.length)];
          }
          
          // Save AI response to database
          const { data: aiData, error: aiError } = await supabase
            .from('session_messages')
            .insert({
              session_id: sessionId,
              content: aiResponse,
              is_ai: true
            })
            .select()
            .single();
            
          if (aiError) throw aiError;
          
        } catch (error) {
          console.error('Error generating AI response:', error);
          toast.error('Failed to generate AI response');
        } finally {
          setIsLoading(false);
        }
      }, 1000);
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage,
    initializeChat
  };
};
