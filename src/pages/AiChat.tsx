
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
  hasFollowUpButtons?: boolean;
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
      const { data, error } = await supabase.functions.invoke('ai-study-chat', {
        body: { message: messageContent }
      });

      if (error) throw error;

      return {
        content: data.content,
        hasFollowUpButtons: data.hasFollowUpButtons
      };
    } catch (error) {
      console.error('Error calling AI chat function:', error);
      return {
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment. In the meantime, feel free to ask me about any academic subjects you need help with!",
        hasFollowUpButtons: false
      };
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
        timestamp: new Date(),
        hasFollowUpButtons: aiResponse.hasFollowUpButtons
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      toast.error('Failed to get AI response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowUpClick = async (followUpText: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: followUpText,
      isAI: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const aiResponse = await sendMessageToAI(followUpText);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.content,
        isAI: true,
        timestamp: new Date(),
        hasFollowUpButtons: aiResponse.hasFollowUpButtons
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      toast.error('Failed to get AI response. Please try again.');
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
        timestamp: new Date(),
        hasFollowUpButtons: aiResponse.hasFollowUpButtons
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      toast.error('Failed to get AI response. Please try again.');
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
                  <div key={message.id}>
                    <div className={`flex gap-3 ${message.isAI ? 'justify-start' : 'justify-end'}`}>
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

                    {/* Follow-up buttons for AI messages */}
                    {message.isAI && message.hasFollowUpButtons && (
                      <div className="flex gap-2 mt-2 ml-10">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFollowUpClick("Explain any step in more detail")}
                          disabled={isLoading}
                          className="text-xs"
                        >
                          <HelpCircle className="w-3 h-3 mr-1" />
                          Explain step in detail
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFollowUpClick("Create a practice quiz on this topic")}
                          disabled={isLoading}
                          className="text-xs"
                        >
                          <Brain className="w-3 h-3 mr-1" />
                          Create practice quiz
                        </Button>
                      </div>
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
                      </CardContent>
                    </Card>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Quick Prompts - Only show when no messages or few messages */}
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
