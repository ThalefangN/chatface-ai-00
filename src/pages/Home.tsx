
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import MobileNavigation from '@/components/MobileNavigation';
import AnimatedContainer from '@/components/AnimatedContainer';
import RecordingIndicator from '@/components/RecordingIndicator';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { BookOpen, ArrowRight, Brain, PenTool, History } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  
  const handleToggleRecording = () => {
    if (!sessionActive) {
      toast.error("Please start a study session first");
      return;
    }
    
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast.success("Listening to your voice...");
    } else {
      toast.info("Stopped recording");
    }
  };
  
  const handleStartSession = () => {
    setSessionActive(true);
    toast.success("Session started! Click the microphone to start talking to your AI study buddy.");
  };
  
  const handleEndSession = () => {
    setSessionActive(false);
    setIsRecording(false);
    toast.info("Study session ended");
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-6 pb-24 md:pb-6">
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Hello, {user?.user_metadata?.name || "Student"}</h1>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white font-medium">
              {user?.user_metadata?.name?.[0] || "S"}
            </div>
          </div>
          
          <AnimatedContainer className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl mb-6">
            <h2 className="text-xl font-semibold mb-4">Your StudyBuddy Assistant</h2>
            <p className="text-muted-foreground mb-6">
              Start a study session and speak directly with your AI study assistant. 
              Get help with any subject, practice for exams, or learn new concepts.
            </p>
            
            {!sessionActive ? (
              <Button 
                onClick={handleStartSession}
                size="lg"
                className="bg-blue-500 hover:bg-blue-600"
              >
                <BookOpen className="mr-2" />
                Start Study Session
              </Button>
            ) : (
              <Button 
                onClick={handleEndSession}
                variant="outline"
                size="lg"
              >
                End Current Session
              </Button>
            )}
          </AnimatedContainer>
        </section>
        
        {sessionActive && (
          <section className="mb-12">
            <AnimatedContainer className="bg-card p-8 rounded-xl text-center relative">
              <h2 className="text-xl font-semibold mb-2">Session Active</h2>
              <p className="text-muted-foreground mb-6">
                Click the microphone to start talking to your AI study buddy
              </p>
              
              <div className="flex flex-col items-center gap-8">
                <div className="bg-blue-500/10 p-6 rounded-full">
                  <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/20">
                    <div className="absolute inset-0 rounded-full border-2 border-blue-500 animate-pulse"></div>
                    <BookOpen className="h-8 w-8 text-blue-500" />
                  </div>
                </div>
                
                <RecordingIndicator 
                  isRecording={isRecording}
                  onClick={handleToggleRecording}
                  className="transform hover:scale-105 transition-all duration-300"
                />
                
                <p className="text-sm text-muted-foreground">
                  {isRecording 
                    ? "Listening to your voice... Click again to stop." 
                    : "Click to start speaking"}
                </p>
              </div>
            </AnimatedContainer>
          </section>
        )}
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Study Options</h2>
          
          <div className="grid gap-4 md:grid-cols-3">
            <Link 
              to="/ai-chat"
              className="group bg-card hover:bg-card/80 p-6 rounded-xl border border-border shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-blue-500/10 mr-3 group-hover:bg-blue-500/20 transition-colors">
                  <Brain className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="font-medium">Study Assistant</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Get help with any subject and ask questions.</p>
              <div className="flex justify-end">
                <div className="p-2 rounded-full bg-muted group-hover:bg-blue-500/10 transition-colors">
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                </div>
              </div>
            </Link>
            
            <Link 
              to="/ai-chat"
              className="group bg-card hover:bg-card/80 p-6 rounded-xl border border-border shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-blue-500/10 mr-3 group-hover:bg-blue-500/20 transition-colors">
                  <PenTool className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="font-medium">Practice Sessions</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Test your knowledge with interactive questions.</p>
              <div className="flex justify-end">
                <div className="p-2 rounded-full bg-muted group-hover:bg-blue-500/10 transition-colors">
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                </div>
              </div>
            </Link>
            
            <Link 
              to="/notes"
              className="group bg-card hover:bg-card/80 p-6 rounded-xl border border-border shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-blue-500/10 mr-3 group-hover:bg-blue-500/20 transition-colors">
                  <History className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="font-medium">Past Sessions</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">View your study history and notes.</p>
              <div className="flex justify-end">
                <div className="p-2 rounded-full bg-muted group-hover:bg-blue-500/10 transition-colors">
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                </div>
              </div>
            </Link>
          </div>
        </section>
      </main>
      
      <MobileNavigation />
    </div>
  );
};

export default Home;
