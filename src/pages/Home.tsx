
import React, { useState, useEffect, useRef } from 'react';
import { Mic, X, MessageSquare, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Toggle } from "@/components/ui/toggle";
import Logo from '@/components/Logo';
import { useTheme } from '@/contexts/ThemeContext';

const Home = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [aiMessage, setAiMessage] = useState("");
  const [displayedMessage, setDisplayedMessage] = useState("");
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
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
  
  const handleToggleListen = () => {
    setIsListening(!isListening);
    if (!isListening) {
      toast.success("Listening...");
      // Simulate user typing a message after 2 seconds
      setTimeout(() => {
        setUserMessage("Can you help me with my BGCSE Mathematics revision?");
        
        // Simulate AI response with typing effect
        setTimeout(() => {
          const response = "Of course! I'd be happy to help with your BGCSE Mathematics revision. Would you like to focus on a specific topic like Algebra, Geometry, Calculus, or Probability? Or would you prefer general revision tips?";
          setAiMessage(response);
          setIsTyping(true);
          
          // Speak the response
          if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(response);
            window.speechSynthesis.speak(utterance);
          }
        }, 1500);
      }, 2000);
    } else {
      toast.info("Stopped listening");
      setUserMessage("");
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };
  
  const handleChatClick = () => {
    navigate('/ai-chat');
  };
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    toast.success(`${theme === 'dark' ? 'Light' : 'Dark'} mode activated!`);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-gradient-to-b from-blue-50 to-white'} text-foreground flex flex-col`}>
      {/* Header */}
      <header className="px-4 py-5 flex items-center justify-between">
        <div className="flex items-center">
          <Logo size="md" darkMode={theme === 'dark'} />
          <h1 className={`text-xl font-semibold ml-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            StudyBuddy <span className={`ml-1 text-xs ${theme === 'dark' ? 'border border-white/30' : 'border border-blue-500/50'} p-0.5 rounded`}>PRO</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <Toggle 
            pressed={theme === 'dark'} 
            onPressedChange={toggleTheme}
            className={`p-2 rounded-full ${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'} hover:bg-blue-200/50 transition-all duration-300`}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-yellow-300" />
            ) : (
              <Moon className="h-5 w-5 text-blue-600" />
            )}
          </Toggle>
          
          {/* User Avatar */}
          <div 
            className={`w-10 h-10 ${theme === 'dark' ? 'bg-gray-700' : 'bg-blue-100'} rounded-full overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all`}
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
            <p className={`text-xl mb-12 font-medium animate-pulse ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>I'm listening...</p>
          ) : (
            showWelcomeMessage && <p className={`text-xl mb-12 font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>How can I help you today?</p>
          )}
          
          {/* Animated orb */}
          <div className="relative w-52 h-52 mx-auto mb-12">
            <div className={`absolute inset-0 rounded-full ${theme === 'dark' 
              ? 'bg-gradient-to-r from-purple-500 via-blue-400 to-indigo-600' 
              : 'bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500'} opacity-80 animate-pulse blur-sm`}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-48 h-48 rounded-full ${theme === 'dark' 
                ? 'bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600' 
                : 'bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500'} opacity-90 animate-pulse-soft`}>
                <div className={`w-full h-full rounded-full ${theme === 'dark' 
                  ? 'bg-gradient-to-tl from-blue-300 via-indigo-400 to-purple-500' 
                  : 'bg-gradient-to-tl from-blue-200 via-blue-300 to-blue-400'} opacity-90 flex items-center justify-center animate-float overflow-hidden relative`}>
                  {/* Inner light effect */}
                  <div className={`absolute inset-0 ${theme === 'dark' 
                    ? 'bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600' 
                    : 'bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500'} mix-blend-overlay opacity-80`}></div>
                  <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.8)_0%,_transparent_70%)]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* AI message with typing effect */}
          {displayedMessage && (
            <div className={`max-w-sm mx-auto text-center mb-6 ${theme === 'dark' 
              ? 'bg-gray-900/70 border border-gray-800' 
              : 'bg-white/80 border border-blue-100 shadow-md'} p-4 rounded-lg`}>
              <p className={`text-md ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                {displayedMessage}{isTyping && <span className="animate-pulse">|</span>}
              </p>
            </div>
          )}
          
          {/* User message */}
          {userMessage && (
            <div className="max-w-sm mx-auto text-center">
              <p className={`text-md ${theme === 'dark' 
                ? 'bg-blue-900/30 border border-blue-800/50' 
                : 'bg-blue-50 border border-blue-200'} p-3 rounded-lg`}>
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
              className={`w-14 h-14 flex items-center justify-center rounded-full transition-all ${theme === 'dark' 
                ? 'bg-gray-800/80 hover:bg-gray-700' 
                : 'bg-white shadow-md hover:bg-blue-50'}`}
            >
              <MessageSquare size={24} className={theme === 'dark' ? 'text-blue-300' : 'text-blue-500'} />
            </button>
            
            <button 
              onClick={handleToggleListen} 
              className={`relative w-20 h-20 flex items-center justify-center rounded-full transition-all ${isListening 
                ? theme === 'dark' ? 'bg-blue-500' : 'bg-blue-500' 
                : theme === 'dark' ? 'bg-gray-700' : 'bg-white shadow-lg'}`}
            >
              {/* Pulse rings when listening */}
              {isListening && (
                <>
                  <div className="absolute inset-0 w-full h-full rounded-full bg-blue-500 opacity-20 animate-ping"></div>
                  <div className="absolute inset-0 w-full h-full rounded-full border-4 border-blue-400/30 animate-pulse"></div>
                </>
              )}
              <Mic size={30} className={`${isListening ? 'text-white' : theme === 'dark' ? 'text-blue-300' : 'text-blue-500'}`} />
            </button>
            
            <button 
              className={`w-14 h-14 flex items-center justify-center rounded-full transition-all ${theme === 'dark' 
                ? 'bg-gray-800/80 hover:bg-gray-700' 
                : 'bg-white shadow-md hover:bg-red-50'}`}
            >
              <X size={24} className={theme === 'dark' ? 'text-red-300' : 'text-red-500'} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
