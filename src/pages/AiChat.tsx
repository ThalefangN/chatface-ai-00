
import React, { useState, useRef, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, BookOpen, Calculator, Lightbulb, Brain, HelpCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  content: string;
  isAI: boolean;
  timestamp: Date;
}

const AiChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI study assistant. I can help you with math problems, explain concepts, provide study tips, and answer questions about your learning materials. What would you like to study today?",
      isAI: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessageToAI = async (messageContent: string) => {
    try {
      console.log('🤖 Sending message to AI:', messageContent.substring(0, 50) + '...');
      
      // Try ai-study-chat first
      const { data: studyData, error: studyError } = await supabase.functions.invoke('ai-study-chat', {
        body: {
          message: messageContent,
          systemPrompt: 'You are a helpful AI study assistant. Provide clear, educational responses with step-by-step explanations when needed. Focus on helping students understand concepts thoroughly.'
        }
      });

      if (studyError) {
        console.warn('❌ ai-study-chat failed:', studyError);
        throw studyError;
      }

      if (studyData?.content) {
        console.log('✅ ai-study-chat response received');
        return {
          content: studyData.content,
          hasFollowUpButtons: studyData.hasFollowUpButtons || false
        };
      }

      throw new Error('No content in ai-study-chat response');
      
    } catch (primaryError) {
      console.warn('🔄 Trying ai-coach as fallback...');
      
      try {
        const { data: coachData, error: coachError } = await supabase.functions.invoke('ai-coach', {
          body: {
            message: messageContent,
            systemPrompt: 'You are a helpful AI study assistant. Provide clear, educational responses with step-by-step explanations when needed. Focus on helping students understand concepts thoroughly.'
          }
        });

        if (coachError) {
          console.warn('❌ ai-coach also failed:', coachError);
          throw coachError;
        }

        if (coachData?.content) {
          console.log('✅ ai-coach response received');
          return {
            content: coachData.content,
            hasFollowUpButtons: coachData.hasFollowUpButtons || false
          };
        }

        throw new Error('No content in ai-coach response');
        
      } catch (backupError) {
        console.error('❌ Both AI services failed:', { primaryError, backupError });
        
        // Show specific error info to user via toast
        const errorMsg = primaryError?.message || backupError?.message || 'Unknown error';
        console.error('Detailed error for debugging:', errorMsg);
        
        // Provide contextual fallback
        const lowerMessage = messageContent.toLowerCase();
        
        if (lowerMessage.includes('math') || lowerMessage.includes('calculate')) {
          return {
            content: "I'd love to help you with mathematics! While I work on reconnecting, here are some tips: break down complex problems into smaller steps, always show your working, and practice regularly. What specific math topic would you like to work on?",
            hasFollowUpButtons: false
          };
        }
        
        if (lowerMessage.includes('science')) {
          return {
            content: "Science is fascinating! I'm here to help you understand scientific concepts. While my connection stabilizes, remember that observation and experimentation are key to learning science. What science topic interests you most?",
            hasFollowUpButtons: false
          };
        }
        
        if (lowerMessage.includes('study') || lowerMessage.includes('exam')) {
          return {
            content: "Great question about studying! Effective study techniques include spaced repetition, active recall, and breaking information into chunks. While my connection improves, try creating mind maps or flashcards. What subject are you preparing for?",
            hasFollowUpButtons: false
          };
        }
        
        return {
          content: "I'm here and ready to help with your studies! There seems to be a temporary connection issue, but I'm committed to supporting your learning. Please feel free to ask me about:\n\n• Math problems and solutions\n• Study techniques and tips\n• Explaining difficult concepts\n• Creating practice questions\n• Subject-specific guidance\n\nWhat would you like to work on?",
          hasFollowUpButtons: false
        };
      }
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isAI: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      const aiResponse = await sendMessageToAI(currentMessage);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.content,
        isAI: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm your AI study assistant and I'm here to help! While I work on the connection, I can still support your learning journey. Try asking your question again or let me know what subject you'd like to explore!",
        isAI: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = async (promptText: string) => {
    setInputMessage(promptText);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: promptText,
      isAI: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const aiResponse = await sendMessageToAI(promptText);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.content,
        isAI: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error in handleQuickPrompt:', error);
      
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'd love to help you with that! I'm having a small connection hiccup, but I'm still your dedicated study assistant. Please try your request again, and I'll do my best to provide helpful guidance!",
        isAI: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = [
    { icon: Calculator, text: "Help me solve this math problem", color: "bg-blue-500" },
    { icon: BookOpen, text: "Explain this concept", color: "bg-green-500" },
    { icon: Lightbulb, text: "Give me study tips", color: "bg-yellow-500" },
    { icon: Brain, text: "Create a practice quiz", color: "bg-purple-500" }
  ];
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-lg font-semibold">Study Chat</h1>
            <Badge variant="secondary" className="ml-auto">
              <Bot className="h-3 w-3 mr-1" />
              AI Assistant
            </Badge>
          </header>
          
          <div className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3 max-w-4xl mx-auto">
                {messages.map((message) => (
                  <div key={message.id} className={`flex gap-3 ${message.isAI ? 'justify-start' : 'justify-end'}`}>
                    {message.isAI && (
                      <Avatar className="h-7 w-7 mt-1 flex-shrink-0">
                        <AvatarFallback className="bg-blue-500 text-white text-xs">
                          <Bot className="h-3 w-3" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <Card className={`max-w-[85%] sm:max-w-[75%] ${
                      message.isAI 
                        ? 'bg-gray-50 dark:bg-gray-800' 
                        : 'bg-blue-500 text-white ml-auto'
                    }`}>
                      <CardContent className="p-2.5">
                        <div className={`text-sm whitespace-pre-wrap break-words leading-relaxed ${
                          message.isAI ? 'text-gray-800 dark:text-gray-200' : 'text-white'
                        }`}>
                          {message.content.split('\n').map((line, index) => (
                            <div key={index} className={line.startsWith('•') ? 'ml-2 flex items-start gap-1' : ''}>
                              {line.startsWith('•') ? (
                                <>
                                  <HelpCircle className="h-3 w-3 mt-0.5 text-blue-500 flex-shrink-0" />
                                  <span>{line.substring(1).trim()}</span>
                                </>
                              ) : (
                                line
                              )}
                            </div>
                          ))}
                        </div>
                        <p className={`text-xs mt-1.5 ${
                          message.isAI 
                            ? 'text-gray-500' 
                            : 'text-blue-100'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </CardContent>
                    </Card>
                    
                    {!message.isAI && (
                      <Avatar className="h-7 w-7 mt-1 flex-shrink-0">
                        <AvatarImage src={user?.user_metadata?.avatar_url} />
                        <AvatarFallback className="text-xs">
                          <User className="h-3 w-3" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <Avatar className="h-7 w-7 mt-1">
                      <AvatarFallback className="bg-blue-500 text-white text-xs">
                        <Bot className="h-3 w-3" />
                      </AvatarFallback>
                    </Avatar>
                    <Card className="bg-gray-50 dark:bg-gray-800">
                      <CardContent className="p-2.5">
                        <div className="flex space-x-1">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">AI is thinking...</p>
                      </CardContent>
                    </Card>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Quick Prompts */}
            {messages.length <= 1 && (
              <div className="p-4 border-t bg-gray-50 dark:bg-gray-800">
                <div className="max-w-4xl mx-auto">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Quick prompts to get started:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {quickPrompts.map((prompt, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="justify-start text-left h-auto p-2.5"
                        onClick={() => handleQuickPrompt(prompt.text)}
                        disabled={isLoading}
                      >
                        <div className={`w-5 h-5 rounded ${prompt.color} flex items-center justify-center mr-2 flex-shrink-0`}>
                          <prompt.icon className="h-2.5 w-2.5 text-white" />
                        </div>
                        <span className="text-xs truncate">{prompt.text}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t bg-white dark:bg-gray-900">
              <div className="max-w-4xl mx-auto flex gap-2">
                <Textarea
                  placeholder="Ask me anything about your studies..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="min-h-[40px] max-h-28 resize-none flex-1 text-sm"
                  rows={1}
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  size="icon"
                  className="h-[40px] w-[40px] flex-shrink-0"
                >
                  <Send className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AiChat;
