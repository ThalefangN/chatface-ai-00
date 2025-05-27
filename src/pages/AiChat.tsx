
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

  const getAIResponse = async (messageContent: string): Promise<string> => {
    console.log('🚀 Starting AI response generation for:', messageContent.substring(0, 50));
    
    // Enhanced fallback responses
    const contextualFallbacks = {
      math: "I'd love to help you with mathematics! Let's work through this step by step. Could you share the specific math problem you're working on? I can help with algebra, geometry, calculus, or any other math topic.",
      science: "Science is fascinating! I'm here to help you understand scientific concepts. Whether it's biology, chemistry, physics, or earth science, I can explain complex topics in simple terms. What science question do you have?",
      english: "I'm excited to help with English! Whether you need help with grammar, writing essays, analyzing literature, or improving your vocabulary, I'm here for you. What specific English topic would you like to work on?",
      study: "Great that you're thinking about effective studying! I can help you create study schedules, learn memory techniques, and develop better study habits. What subject are you preparing for or what study challenge are you facing?",
      general: "I'm your AI study assistant and I'm here to help you succeed! I can assist with homework, explain difficult concepts, create study materials, and provide learning strategies. What would you like to learn about today?"
    };

    const getContextualResponse = (msg: string): string => {
      const lower = msg.toLowerCase();
      if (lower.includes('math') || lower.includes('calculate') || lower.includes('solve') || lower.includes('equation')) {
        return contextualFallbacks.math;
      }
      if (lower.includes('science') || lower.includes('biology') || lower.includes('chemistry') || lower.includes('physics')) {
        return contextualFallbacks.science;
      }
      if (lower.includes('english') || lower.includes('writing') || lower.includes('essay') || lower.includes('grammar')) {
        return contextualFallbacks.english;
      }
      if (lower.includes('study') || lower.includes('exam') || lower.includes('test') || lower.includes('learn')) {
        return contextualFallbacks.study;
      }
      return contextualFallbacks.general;
    };

    // Try multiple AI endpoints
    const endpoints = ['ai-study-chat', 'ai-coach'];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`🤖 Trying ${endpoint} endpoint...`);
        
        const { data, error } = await supabase.functions.invoke(endpoint, {
          body: {
            message: messageContent,
            systemPrompt: 'You are a helpful AI study assistant for students. Provide clear, encouraging, and educational responses. Always be supportive and patient in your explanations.'
          }
        });

        console.log(`📡 ${endpoint} response:`, { data, error });

        if (error) {
          console.warn(`❌ ${endpoint} failed:`, error);
          continue;
        }

        if (data?.content) {
          console.log(`✅ ${endpoint} success!`);
          return data.content;
        }

        console.warn(`⚠️ ${endpoint} returned no content`);
      } catch (err) {
        console.error(`💥 ${endpoint} threw error:`, err);
        continue;
      }
    }

    console.log('🔄 All AI endpoints failed, using contextual fallback');
    return getContextualResponse(messageContent);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    console.log('📤 Sending message:', inputMessage);

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
      const aiResponse = await getAIResponse(currentMessage);
      console.log('📨 AI response received:', aiResponse.substring(0, 100));
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        isAI: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      console.log('✅ Message exchange completed successfully');
      
    } catch (error) {
      console.error('💥 Error in handleSendMessage:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm here to help you study! There was a small hiccup, but I'm still your dedicated study assistant. Please try asking your question again - I'm ready to help with any subject!",
        isAI: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = async (promptText: string) => {
    console.log('⚡ Quick prompt triggered:', promptText);
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
      const aiResponse = await getAIResponse(promptText);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        isAI: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      console.log('✅ Quick prompt completed successfully');
      
    } catch (error) {
      console.error('💥 Error in handleQuickPrompt:', error);
      
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm here and ready to help with your studies! Please feel free to ask me any question about your learning, and I'll do my best to provide helpful guidance.",
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
