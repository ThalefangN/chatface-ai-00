
import React, { useState, useRef, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, BookOpen, Calculator, Lightbulb, History } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ScrollArea } from '@/components/ui/scroll-area';

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

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isAI: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "I understand you're asking about this topic. Let me help you break it down step by step. This is a great question that many students have!",
        isAI: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
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
    { icon: History, text: "Review my previous work", color: "bg-purple-500" }
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
              <div className="space-y-4 max-w-4xl mx-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.isAI ? 'justify-start' : 'justify-end'}`}
                  >
                    {message.isAI && (
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback className="bg-blue-500 text-white">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <Card className={`max-w-[85%] sm:max-w-[70%] ${
                      message.isAI 
                        ? 'bg-gray-50 dark:bg-gray-800' 
                        : 'bg-blue-500 text-white ml-auto'
                    }`}>
                      <CardContent className="p-3">
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                        <p className={`text-xs mt-2 ${
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
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarImage src={user?.user_metadata?.avatar_url} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback className="bg-blue-500 text-white">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <Card className="bg-gray-50 dark:bg-gray-800">
                      <CardContent className="p-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
                        className="justify-start text-left h-auto p-3"
                        onClick={() => setInputMessage(prompt.text)}
                      >
                        <div className={`w-6 h-6 rounded ${prompt.color} flex items-center justify-center mr-2 flex-shrink-0`}>
                          <prompt.icon className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-sm truncate">{prompt.text}</span>
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
                  className="min-h-[44px] max-h-32 resize-none flex-1"
                  rows={1}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  size="icon"
                  className="h-[44px] w-[44px] flex-shrink-0"
                >
                  <Send className="h-4 w-4" />
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
