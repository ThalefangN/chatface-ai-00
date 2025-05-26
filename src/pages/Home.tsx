
import React, { useState, useEffect, useRef } from 'react';
import { Mic, X, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTheme } from '@/contexts/ThemeContext';
import { getReliableAIResponse } from '@/utils/aiHelper';

const Home = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [aiMessage, setAiMessage] = useState("");
  const [displayedMessage, setDisplayedMessage] = useState("");
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [isAIResponding, setIsAIResponding] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Full welcome message
  const fullWelcomeMessage = "Hello! I'm your StudyBuddy AI. I'm trained on the BGCSE, JCE, and PSLE Botswana syllabus. How can I help with your studies today?";
  
  // Initialize speech synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      audioRef.current = new Audio();
    }
  }, []);
  
  // Auto display welcome message with typing effect
  useEffect(() => {
    // Delay before starting to type
    const initialDelay = setTimeout(() => {
      setAiMessage(fullWelcomeMessage);
      setIsTyping(true);
      setShowWelcomeMessage(false);
      
      // Speak the welcome message
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(fullWelcomeMessage);
        window.speechSynthesis.speak(utterance);
      }
    }, 1000);
    
    return () => clearTimeout(initialDelay);
  }, []);
  
  // Text typing animation effect
  useEffect(() => {
    if (!isTyping || !aiMessage) return;
    
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < aiMessage.length) {
        setDisplayedMessage(aiMessage.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, 30); // typing speed
    
    return () => clearInterval(typingInterval);
  }, [isTyping, aiMessage]);

  // Enhanced AI response function
  const getAIResponse = async (message: string) => {
    setIsAIResponding(true);
    try {
      console.log('Getting AI response for home page');
      const response = await getReliableAIResponse(
        message,
        'You are StudyBuddy, a friendly AI assistant for students in Botswana. You help with BGCSE, JCE, and PSLE studies. Always be encouraging and provide helpful study guidance.'
      );
      return response.content;
    } catch (error) {
      console.error('Error getting AI response:', error);
      // Always return a helpful response
      return "I'm here to help you succeed in your studies! While I work on reconnecting perfectly, I can still assist you with math, science, English, and other subjects. What specific topic would you like to explore together?";
    } finally {
      setIsAIResponding(false);
    }
  };
  
  const handleToggleListen = async () => {
    if (isListening) {
      setIsListening(false);
      toast.info("Stopped listening");
      setUserMessage("");
      return;
    }

    setIsListening(true);
    toast.success("Listening...");
    
    // Simulate user input and AI response
    setTimeout(async () => {
      const simulatedQuestion = "Can you help me with my BGCSE Mathematics revision?";
      setUserMessage(simulatedQuestion);
      
      // Get AI response
      setTimeout(async () => {
        const aiResponse = await getAIResponse(simulatedQuestion);
        setAiMessage(aiResponse);
        setIsTyping(true);
        
        // Speak the response
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(aiResponse);
          window.speechSynthesis.speak(utterance);
        }
        
        setIsListening(false);
      }, 1500);
    }, 2000);
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };
  
  const handleChatClick = () => {
    navigate('/chat');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-foreground flex flex-col">
      {/* Header */}
      <header className="px-4 py-5 flex items-center justify-between">
        <div></div>
        
        <div className="flex items-center gap-4">
          {/* User Avatar */}
          <div 
            className="w-10 h-10 bg-blue-100 rounded-full overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
            onClick={handleProfileClick}
          >
            <Avatar>
              <AvatarImage 
                src={(user?.user_metadata?.avatar_url || "/lovable-uploads/4f570823-6f09-4aea-a965-7a2405cf6a14.png")} 
                alt="User avatar" 
              />
              <AvatarFallback>
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-between px-4 pb-24 pt-12">
        <div className="text-center w-full">
          {isListening ? (
            <p className="text-xl mb-12 font-medium animate-pulse text-blue-600">I'm listening...</p>
          ) : isAIResponding ? (
            <p className="text-xl mb-12 font-medium animate-pulse text-green-600">AI is thinking...</p>
          ) : (
            showWelcomeMessage && <p className="text-xl mb-12 font-medium text-gray-700">How can I help you today?</p>
          )}
          
          {/* Animated orb */}
          <div className="relative w-52 h-52 mx-auto mb-12">
            <div className={`absolute inset-0 rounded-full opacity-80 blur-sm ${
              isListening ? 'bg-gradient-to-r from-green-300 via-green-400 to-green-500 animate-pulse' :
              isAIResponding ? 'bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 animate-pulse' :
              'bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 animate-pulse'
            }`}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-48 h-48 rounded-full opacity-90 animate-pulse-soft ${
                isListening ? 'bg-gradient-to-br from-green-300 via-green-400 to-green-500' :
                isAIResponding ? 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500' :
                'bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500'
              }`}>
                <div className={`w-full h-full rounded-full opacity-90 flex items-center justify-center animate-float overflow-hidden relative ${
                  isListening ? 'bg-gradient-to-tl from-green-200 via-green-300 to-green-400' :
                  isAIResponding ? 'bg-gradient-to-tl from-yellow-200 via-yellow-300 to-yellow-400' :
                  'bg-gradient-to-tl from-blue-200 via-blue-300 to-blue-400'
                }`}>
                  {/* Inner light effect */}
                  <div className={`absolute inset-0 mix-blend-overlay opacity-80 ${
                    isListening ? 'bg-gradient-to-r from-green-300 via-green-400 to-green-500' :
                    isAIResponding ? 'bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500' :
                    'bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500'
                  }`}></div>
                  <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.8)_0%,_transparent_70%)]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* AI message with typing effect */}
          {displayedMessage && (
            <div className="max-w-sm mx-auto text-center mb-6 bg-white/80 border border-blue-100 shadow-md p-4 rounded-lg">
              <p className="text-md text-gray-700">
                {displayedMessage}{isTyping && <span className="animate-pulse">|</span>}
              </p>
            </div>
          )}
          
          {/* User message */}
          {userMessage && (
            <div className="max-w-sm mx-auto text-center">
              <p className="text-md bg-blue-50 border border-blue-200 p-3 rounded-lg">
                {userMessage}
              </p>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="w-full max-w-md mb-4 flex items-center justify-center">
          <div className="flex items-center justify-between w-full">
            <button 
              onClick={handleChatClick}
              className="w-14 h-14 flex items-center justify-center rounded-full transition-all bg-white shadow-md hover:bg-blue-50"
            >
              <MessageSquare size={24} className="text-blue-500" />
            </button>
            
            <button 
              onClick={handleToggleListen} 
              disabled={isAIResponding}
              className={`relative w-20 h-20 flex items-center justify-center rounded-full transition-all ${
                isListening 
                  ? "bg-green-500" 
                  : isAIResponding
                  ? "bg-yellow-500"
                  : "bg-white shadow-lg"
              } ${isAIResponding ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
            >
              {/* Pulse rings when listening */}
              {(isListening || isAIResponding) && (
                <>
                  <div className={`absolute inset-0 w-full h-full rounded-full opacity-20 animate-ping ${
                    isListening ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                  <div className={`absolute inset-0 w-full h-full rounded-full border-4 animate-pulse ${
                    isListening ? 'border-green-400/30' : 'border-yellow-400/30'
                  }`}></div>
                </>
              )}
              <Mic size={30} className={`${
                isListening || isAIResponding ? 'text-white' : 'text-blue-500'
              }`} />
            </button>
            
            <button 
              className="w-14 h-14 flex items-center justify-center rounded-full transition-all bg-white shadow-md hover:bg-red-50"
            >
              <X size={24} className="text-red-500" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
