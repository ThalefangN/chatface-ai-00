
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import MobileNavigation from '@/components/MobileNavigation';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card } from "@/components/ui/card";
import { ArrowLeft, Mic, X, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [userMessage, setUserMessage] = useState<string | null>(null);
  const [pulseSize, setPulseSize] = useState(1);
  
  // Animate the pulse effect
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setPulseSize(size => (size === 1 ? 1.2 : 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRecording]);
  
  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast.success("I'm listening...");
      // Simulate user typing a message after a delay
      setTimeout(() => {
        setUserMessage("I'm having anxiety about my career, can you help me dealing with it?");
      }, 2000);
    } else {
      setUserMessage(null);
      toast.info("Stopped recording");
    }
  };
  
  const handleStartSession = () => {
    setSessionActive(true);
    toast.success("Session started! Click the microphone to start talking.");
  };
  
  const handleEndSession = () => {
    setSessionActive(false);
    setIsRecording(false);
    setUserMessage(null);
    toast.info("Study session ended");
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0c15] text-white">
      <div className="px-4 py-6 flex items-center">
        <Link to="/home" className="flex items-center text-gray-300 hover:text-white">
          <ArrowLeft className="mr-2" />
          <span className="font-medium">StudyBuddy AI</span>
        </Link>
        <div className="ml-auto w-8 h-8 rounded-full bg-gray-800 overflow-hidden">
          {user?.user_metadata?.avatar_url ? (
            <img 
              src={user.user_metadata.avatar_url}
              alt={user?.user_metadata?.name || "User"} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-purple-700 text-white">
              {user?.user_metadata?.name?.[0] || "S"}
            </div>
          )}
        </div>
      </div>
      
      <main className="flex-1 flex flex-col items-center px-4 pb-24">
        {!sessionActive ? (
          <div className="w-full max-w-md mt-12 text-center">
            <h1 className="text-2xl font-bold mb-6">Welcome to StudyBuddy AI</h1>
            <p className="text-gray-400 mb-8">Your AI study companion is ready to help you learn through voice conversations</p>
            <Button 
              onClick={handleStartSession}
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white w-full py-6"
            >
              Start Voice Study Session
            </Button>
          </div>
        ) : (
          <>
            <div className="text-center my-8">
              {isRecording ? (
                <p className="text-xl">I'm listening</p>
              ) : (
                <p className="text-gray-400">Tap the microphone to start speaking</p>
              )}
            </div>
            
            {/* AI Visualization Sphere */}
            <div className="relative w-48 h-48 md:w-64 md:h-64 mb-12">
              <div className="absolute inset-0 rounded-full bg-purple-600/10 animate-pulse"></div>
              <div 
                className="absolute inset-0 rounded-full overflow-hidden border border-purple-500/30 transition-all duration-500"
                style={{ transform: isRecording ? `scale(${pulseSize})` : 'scale(1)' }}
              >
                <div className="w-full h-full bg-gradient-to-br from-purple-600/40 via-blue-500/30 to-cyan-400/50 animate-rotate-gradient"></div>
              </div>
              
              {/* Animated overlay effects */}
              <div className="absolute inset-0 rounded-full overflow-hidden bg-black/10 backdrop-blur-sm">
                <div className="w-full h-full bg-gradient-to-br from-purple-600/20 via-blue-500/20 to-indigo-500/20 mix-blend-overlay"></div>
              </div>
            </div>
            
            {/* User message */}
            {userMessage && (
              <div className="w-full max-w-md bg-gray-800/60 rounded-xl p-4 mb-8 animate-fade-in">
                <p className="text-center text-gray-300">{userMessage}</p>
              </div>
            )}
            
            {/* Microphone Button */}
            <div className="fixed bottom-24 md:bottom-16 left-1/2 transform -translate-x-1/2">
              <div className="relative">
                {/* Ripple effects */}
                {isRecording && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-purple-500/10 animate-ping"></div>
                    <div className="absolute inset-0 rounded-full bg-purple-500/5 animate-pulse"></div>
                    <div className="absolute -inset-4 rounded-full border border-purple-500/20 animate-pulse"></div>
                    <div className="absolute -inset-8 rounded-full border border-purple-500/10 animate-pulse"></div>
                  </>
                )}
                
                {/* Main microphone button */}
                <button
                  onClick={handleToggleRecording}
                  className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  <Mic className="h-6 w-6 text-white" />
                </button>
              </div>
            </div>
            
            {/* Control buttons */}
            <div className="fixed bottom-24 md:bottom-16 left-0 right-0 flex justify-between px-12 md:px-24">
              <button className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-gray-400" />
              </button>
              
              <button 
                onClick={handleEndSession}
                className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </>
        )}
      </main>
      
      {!sessionActive && <MobileNavigation />}
    </div>
  );
};

export default Home;
