
import React, { useState } from 'react';
import { ArrowLeft, Mic, X, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MobileNavigation from '@/components/MobileNavigation';
import { toast } from 'sonner';

const Home = () => {
  const { user } = useAuth();
  const [isListening, setIsListening] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  
  const handleToggleListen = () => {
    setIsListening(!isListening);
    if (!isListening) {
      toast.success("Listening...");
      // Simulate user typing a message after 2 seconds
      setTimeout(() => {
        setUserMessage("I'm having anxiety about my career, can you help me dealing with it ?");
      }, 2000);
    } else {
      toast.info("Stopped listening");
      setUserMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="px-4 py-5 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/home" className="mr-2">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-semibold">Calm AI <span className="ml-1 text-xs border border-white/30 p-0.5 rounded">PRO</span></h1>
        </div>
        <div className="w-9 h-9 bg-gray-700 rounded-full overflow-hidden">
          <img 
            src={(user?.user_metadata?.avatar_url || "/lovable-uploads/4f570823-6f09-4aea-a965-7a2405cf6a14.png")} 
            alt="User avatar" 
            className="w-full h-full object-cover"
          />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-between px-4 pb-24 pt-12">
        <div className="text-center w-full">
          {isListening ? (
            <p className="text-xl mb-12">I'm listening</p>
          ) : (
            <p className="text-xl mb-12">How can I help you today?</p>
          )}
          
          {/* Animated orb */}
          <div className="relative w-52 h-52 mx-auto mb-12">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-blue-400 to-indigo-600 opacity-80 animate-pulse blur-sm"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600 opacity-90 animate-pulse-soft">
                <div className="w-full h-full rounded-full bg-gradient-to-tl from-blue-300 via-indigo-400 to-purple-500 opacity-90 flex items-center justify-center animate-float overflow-hidden relative">
                  {/* Inner light effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 mix-blend-overlay opacity-80"></div>
                  <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.8)_0%,_transparent_70%)]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* User message */}
          {userMessage && (
            <div className="max-w-xs mx-auto text-center">
              <p className="text-lg mb-1">{userMessage}</p>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="w-full max-w-md mb-4 flex items-center justify-center">
          <div className="flex items-center justify-between w-full">
            <button className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-800/80">
              <MessageSquare size={20} />
            </button>
            
            <button 
              onClick={handleToggleListen} 
              className={`relative w-16 h-16 flex items-center justify-center rounded-full transition-all ${isListening ? 'bg-blue-500' : 'bg-gray-700'}`}
            >
              {/* Pulse rings when listening */}
              {isListening && (
                <>
                  <div className="absolute inset-0 w-full h-full rounded-full bg-blue-500 opacity-20 animate-ping"></div>
                  <div className="absolute inset-0 w-full h-full rounded-full border-4 border-blue-400/30 animate-pulse"></div>
                </>
              )}
              <Mic size={24} />
            </button>
            
            <button className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-800/80">
              <X size={20} />
            </button>
          </div>
        </div>
      </main>

      <MobileNavigation />
    </div>
  );
};

export default Home;
