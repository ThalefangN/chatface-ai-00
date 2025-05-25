import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import LearningContent from "@/components/LearningContent";
import DocumentUpload from "@/components/DocumentUpload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, Upload, Send, Bot, User, HelpCircle, Brain } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  content: string;
  isAI: boolean;
  timestamp: Date;
  hasFollowUpButtons?: boolean;
}

const LearningSession = () => {
  const { subject } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI study assistant for this learning session. I can help you understand concepts, solve problems, and create practice materials. What would you like to work on today?",
      isAI: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const subjectMap = {
    'foundation': {
      title: 'Mathematical Foundations',
      description: 'Build strong mathematical foundations with comprehensive theory and core concepts'
    },
    'practice': {
      title: 'Interactive Problem Solving',
      description: 'Practice with guided exercises and real-time feedback to reinforce learning'
    },
    'review': {
      title: 'Knowledge Review',
      description: 'Strengthen retention through spaced repetition and systematic review'
    },
    'assessment': {
      title: 'Knowledge Assessment',
      description: 'Evaluate your understanding with comprehensive gap analysis'
    },
    'mastery': {
      title: 'Advanced Mastery',
      description: 'Achieve deep learning through advanced concepts and challenging problems'
    }
  };

  const currentSubject = subjectMap[subject as keyof typeof subjectMap] || {
    title: 'StudyBuddy Learning Session',
    description: 'Personalized learning experience'
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessageToAI = async (messageContent: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-study-chat', {
        body: { 
          message: messageContent,
          systemPrompt: `You are a helpful AI study assistant for ${currentSubject.title}. Focus on educational content and provide clear step-by-step solutions. When solving problems, offer to provide additional explanation or create practice questions. Keep responses concise but comprehensive.`
        }
      });

      if (error) throw error;

      return {
        content: data.content,
        hasFollowUpButtons: data.hasFollowUpButtons
      };
    } catch (error) {
      console.error('Error calling AI chat function:', error);
      return {
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const isAssessmentPage = subject === 'assessment';

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1 min-w-0">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-2 sm:px-4">
            <SidebarTrigger className="-ml-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h1 className="text-xs sm:text-sm md:text-lg font-semibold truncate">
                {currentSubject.title}
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block truncate">
                {currentSubject.description}
              </p>
            </div>
          </header>
          
          <div className="flex-1 p-1 sm:p-2 md:p-4 lg:p-6 overflow-auto w-full max-w-full">
            <div className="w-full max-w-full space-y-6">
              <Tabs defaultValue="content" className="w-full">
                <TabsList className={`grid w-full ${isAssessmentPage ? 'grid-cols-2' : 'grid-cols-3'}`}>
                  <TabsTrigger value="content" className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Learning Content
                  </TabsTrigger>
                  {!isAssessmentPage && (
                    <TabsTrigger value="chat" className="flex items-center gap-2">
                      <Bot className="w-4 h-4" />
                      AI Assistant
                    </TabsTrigger>
                  )}
                  <TabsTrigger value="documents" className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Document Analysis
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="content" className="mt-6">
                  <LearningContent subject={currentSubject.title} />
                </TabsContent>

                {!isAssessmentPage && (
                  <TabsContent value="chat" className="mt-6">
                    <Card className="h-[600px] flex flex-col">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Bot className="w-5 h-5" />
                          AI Study Assistant
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Get help with your {currentSubject.title.toLowerCase()} studies
                        </p>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col p-0">
                        {/* Messages Area */}
                        <ScrollArea className="flex-1 p-4">
                          <div className="space-y-3">
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
                                        {message.content}
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

                        {/* Input Area */}
                        <div className="p-4 border-t bg-white dark:bg-gray-900">
                          <div className="flex gap-2">
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
                      </CardContent>
                    </Card>
                  </TabsContent>
                )}
                
                <TabsContent value="documents" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Document Upload & Analysis
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Upload your study materials, notes, or documents to analyze and extract key insights for better learning.
                      </p>
                    </CardHeader>
                    <CardContent>
                      <DocumentUpload />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default LearningSession;
