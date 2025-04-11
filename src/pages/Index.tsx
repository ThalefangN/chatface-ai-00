
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import { ArrowRight, MicIcon, BookOpen, Brain, Sparkles } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-blue-900">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Logo size="lg" />
        <div className="space-x-4">
          <Link 
            to="/sign-in" 
            className="inline-flex items-center justify-center px-6 py-2 border-2 border-blue-500 text-blue-500 font-medium rounded-lg hover:bg-blue-50 transition-colors"
          >
            Sign In
          </Link>
          <Link 
            to="/sign-up" 
            className="inline-flex items-center justify-center px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-12 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          <div className="space-y-6 max-w-xl">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-blue-100 text-blue-600">
              <span className="animate-pulse-soft mr-1">●</span> 
              AI-Powered Study Assistant
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Study Better with Your AI Learning Companion
            </h1>
            
            <p className="text-lg text-blue-700">
              Practice, learn, and master any subject with StudyBuddy. Get real-time voice feedback and improve your understanding with AI-powered conversations.
            </p>
            
            <div className="pt-4">
              <Link 
                to="/sign-up" 
                className="group inline-flex items-center justify-center rounded-lg bg-blue-500 px-6 py-3 text-white font-medium hover:bg-blue-600 transition-colors"
              >
                Start Learning Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            
            <div className="flex items-center space-x-4 pt-4 text-sm text-blue-700">
              <div className="flex items-center">
                <div className="mr-1.5 h-4 w-4 text-blue-500">
                  <MicIcon className="h-4 w-4" />
                </div>
                Voice Chat
              </div>
              <div className="flex items-center">
                <div className="mr-1.5 h-4 w-4 text-blue-500">
                  <BookOpen className="h-4 w-4" />
                </div>
                Study Help
              </div>
              <div className="flex items-center">
                <div className="mr-1.5 h-4 w-4 text-blue-500">
                  <Sparkles className="h-4 w-4" />
                </div>
                AI Tutoring
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-300 to-blue-500 rounded-2xl blur-xl animate-pulse-soft opacity-70"></div>
            <div className="relative bg-white rounded-2xl overflow-hidden border border-blue-100 shadow-xl">
              <div className="aspect-video bg-blue-50 p-8 flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Brain className="h-7 w-7 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Study Session</h3>
                <p className="text-center text-blue-700">
                  Talk with your StudyBuddy AI to master any subject through conversation
                </p>
                <div className="mt-6 grid grid-cols-3 gap-3 w-full max-w-xs">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div 
                      key={n} 
                      className={`h-1 rounded-full ${n % 2 === 0 ? 'bg-blue-500' : 'bg-blue-200'}`}
                    ></div>
                  ))}
                </div>
              </div>
              <div className="p-6 bg-gradient-to-b from-white to-blue-50">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                      AI
                    </div>
                    <div className="flex-1 p-3 rounded-xl bg-blue-100">
                      <p className="text-sm">What topic would you like to study today?</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 justify-end">
                    <div className="flex-1 p-3 rounded-xl bg-blue-500/10">
                      <p className="text-sm">I need help understanding photosynthesis...</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <MicIcon className="h-4 w-4 text-blue-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold mb-12 text-blue-900">How StudyBuddy Helps You Learn</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm">
              <div className="w-12 h-12 mb-4 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
                <MicIcon className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-blue-900">Voice Conversations</h3>
              <p className="text-blue-700">Talk naturally with your AI tutor to explain concepts and ask questions</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm">
              <div className="w-12 h-12 mb-4 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-blue-900">Subject Expertise</h3>
              <p className="text-blue-700">Get help with any subject from math and science to language and literature</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm">
              <div className="w-12 h-12 mb-4 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
                <Brain className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-blue-900">Personalized Learning</h3>
              <p className="text-blue-700">Receive customized explanations based on your learning style and pace</p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t border-blue-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Logo size="sm" />
            <p className="text-sm text-blue-700 mt-4 md:mt-0">
              © {new Date().getFullYear()} StudyBuddy. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
