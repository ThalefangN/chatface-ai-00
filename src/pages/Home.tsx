
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import MobileNavigation from '@/components/MobileNavigation';
import AnimatedContainer from '@/components/AnimatedContainer';
import RecordingIndicator from '@/components/RecordingIndicator';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, ArrowRight, Brain, PenTool, History, Users, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/20 dark:to-background">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8 pb-24 md:pb-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.user_metadata?.name || "Student"}</h1>
            <p className="text-muted-foreground mt-1">Your AI study companion is ready to help you learn</p>
          </div>
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-medium shadow-lg">
            {user?.user_metadata?.name?.[0] || "S"}
          </div>
        </div>
        
        <AnimatedContainer className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-8 rounded-2xl mb-10 shadow-xl">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">StudyBuddy Assistant</h2>
              <p className="text-blue-100 mb-6">
                Start a study session and speak directly with your AI study assistant. 
                Get help with any subject, practice for exams, or learn new concepts through natural conversation.
              </p>
              
              {!sessionActive ? (
                <Button 
                  onClick={handleStartSession}
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 shadow-md"
                >
                  <BookOpen className="mr-2" />
                  Start Study Session
                </Button>
              ) : (
                <Button 
                  onClick={handleEndSession}
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-blue-700"
                >
                  End Current Session
                </Button>
              )}
            </div>
            <div className="w-32 h-32 bg-blue-500/30 rounded-full flex items-center justify-center">
              <Users className="h-16 w-16 text-blue-100" />
            </div>
          </div>
        </AnimatedContainer>
        
        {sessionActive && (
          <section className="mb-12">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-blue-50/50 dark:from-card dark:to-blue-900/10 p-0 overflow-hidden">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2">
                  <div className="p-8 flex flex-col items-center justify-center text-center border-r border-border">
                    <div className="w-28 h-28 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
                      <Sparkles className="h-12 w-12 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">AI Study Assistant</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-4">
                      Your AI companion is analyzing your questions and providing intelligent responses
                    </p>
                    
                    <div className="flex space-x-2 mt-2">
                      <div className="h-2.5 w-2.5 bg-blue-500 rounded-full animate-wave-1"></div>
                      <div className="h-2.5 w-2.5 bg-blue-500 rounded-full animate-wave-2"></div>
                      <div className="h-2.5 w-2.5 bg-blue-500 rounded-full animate-wave-3"></div>
                      <div className="h-2.5 w-2.5 bg-blue-500 rounded-full animate-wave-4"></div>
                      <div className="h-2.5 w-2.5 bg-blue-500 rounded-full animate-wave-5"></div>
                    </div>
                  </div>
                  
                  <div className="p-8 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/10 dark:to-transparent">
                    <h3 className="text-xl font-semibold mb-5">Your Voice Input</h3>
                    <p className="text-muted-foreground mb-8 text-center">
                      Click the microphone to start talking to your AI study buddy
                    </p>
                    
                    <RecordingIndicator 
                      isRecording={isRecording}
                      onClick={handleToggleRecording}
                      className="transform hover:scale-105 transition-all duration-300 w-24 h-24 mb-4"
                    />
                    
                    <p className="text-sm text-muted-foreground mt-4">
                      {isRecording 
                        ? "Listening to your voice... Click again to stop." 
                        : "Click to start speaking"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}
        
        <h2 className="text-2xl font-semibold mb-5">Study Resources</h2>
        
        <div className="grid gap-5 md:grid-cols-3 mb-12">
          <Link 
            to="/ai-chat"
            className="group relative overflow-hidden rounded-xl border shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-600/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative p-6 h-full flex flex-col">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-blue-500/10 mr-3 group-hover:bg-blue-500/20 transition-colors">
                  <Brain className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="font-medium">AI Assistant</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4 flex-grow">Get help with any subject and ask questions about complex topics.</p>
              <div className="flex justify-end">
                <div className="p-2 rounded-full bg-muted group-hover:bg-blue-500/10 transition-colors">
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                </div>
              </div>
            </div>
          </Link>
          
          <Link 
            to="/ai-chat"
            className="group relative overflow-hidden rounded-xl border shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-600/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative p-6 h-full flex flex-col">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-blue-500/10 mr-3 group-hover:bg-blue-500/20 transition-colors">
                  <PenTool className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="font-medium">Practice Sessions</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4 flex-grow">Test your knowledge with interactive questions and improve your understanding.</p>
              <div className="flex justify-end">
                <div className="p-2 rounded-full bg-muted group-hover:bg-blue-500/10 transition-colors">
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                </div>
              </div>
            </div>
          </Link>
          
          <Link 
            to="/notes"
            className="group relative overflow-hidden rounded-xl border shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-600/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative p-6 h-full flex flex-col">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-blue-500/10 mr-3 group-hover:bg-blue-500/20 transition-colors">
                  <History className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="font-medium">Study History</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4 flex-grow">View your past study sessions and access your saved notes.</p>
              <div className="flex justify-end">
                <div className="p-2 rounded-full bg-muted group-hover:bg-blue-500/10 transition-colors">
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </main>
      
      <MobileNavigation />
    </div>
  );
};

export default Home;
