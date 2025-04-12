
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const Chat = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your StudyBuddy AI tutor. I'm trained on the BGCSE, JCE, and PSLE Botswana syllabus. How can I help you with your studies today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      // Generate a simple response
      let response = "I understand you're asking about ";
      
      if (input.toLowerCase().includes('math')) {
        response += "mathematics. The BGCSE mathematics curriculum covers algebra, geometry, statistics, and calculus. Which specific topic would you like help with?";
      } else if (input.toLowerCase().includes('science')) {
        response += "science. The BGCSE science curriculum includes biology, chemistry, and physics. Which subject would you like to focus on?";
      } else if (input.toLowerCase().includes('english')) {
        response += "English. The BGCSE English curriculum covers comprehension, summary writing, essay writing, and literature. What aspect would you like assistance with?";
      } else {
        response += "your studies. I can help with any subject in the BGCSE, JCE, or PSLE Botswana syllabus. Could you please specify which subject you're studying?";
      }
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="p-4 flex items-center border-b">
        <button 
          onClick={() => navigate('/home')}
          className="p-2 rounded-full hover:bg-blue-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center ml-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Avatar>
              <AvatarImage src="/lovable-uploads/8b5ecfe5-c0f1-425e-bde4-2f47ed8b1fe6.png" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
          </div>
          <div className="ml-3">
            <h2 className="font-medium">StudyBuddy AI</h2>
            <p className="text-xs text-muted-foreground">
              {isLoading ? 'Typing...' : 'Online'}
            </p>
          </div>
        </div>
      </header>
      
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.isUser ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] p-3 rounded-lg",
                message.isUser
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-100 text-gray-800 rounded-bl-none"
              )}
            >
              {message.content}
              <div
                className={cn(
                  "text-xs mt-1",
                  message.isUser ? "text-blue-100" : "text-gray-500"
                )}
              >
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSend();
              }
            }}
            className="flex-1"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={cn(
              "p-3 rounded-full",
              input.trim() && !isLoading
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            )}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
