
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import { ArrowRight, MicIcon, BookOpen, Award } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-950 to-blue-900 text-white">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Logo size="lg" color="purple" />
        <div className="space-x-2 sm:space-x-4">
          <Link 
            to="/sign-in" 
            className="text-sm font-medium px-3 sm:px-4 py-2 rounded-md border border-purple-500 text-purple-400 hover:bg-purple-950 transition-colors"
          >
            Sign In
          </Link>
          <Link 
            to="/sign-up" 
            className="text-sm font-medium px-3 sm:px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-16">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          <div className="space-y-6 max-w-xl">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-purple-600/20 text-purple-400">
              <span className="animate-pulse-soft mr-1">●</span> 
              AI-Powered Study Assistant
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Study Smarter with Your AI Voice Companion
            </h1>
            
            <p className="text-lg text-gray-300">
              Practice, learn, and improve with StudyBuddy. Get real-time feedback, explanations, and study help through natural voice conversations.
            </p>
            
            <div className="pt-4">
              <Link 
                to="/sign-up" 
                className="group inline-flex items-center justify-center rounded-md bg-purple-600 px-6 py-3 text-white font-medium hover:bg-purple-700 transition-colors w-full sm:w-auto"
              >
                Start Learning
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 pt-4 text-sm text-gray-400">
              <div className="flex items-center">
                <div className="mr-1.5 h-4 w-4 text-purple-400">
                  <MicIcon className="h-4 w-4" />
                </div>
                Voice Assistant
              </div>
              <div className="flex items-center">
                <div className="mr-1.5 h-4 w-4 text-purple-400">
                  <BookOpen className="h-4 w-4" />
                </div>
                Study Materials
              </div>
              <div className="flex items-center">
                <div className="mr-1.5 h-4 w-4 text-purple-400">
                  <Award className="h-4 w-4" />
                </div>
                Learning Coach
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-purple-700/40 rounded-2xl blur-xl animate-pulse-soft opacity-70"></div>
            <div className="relative bg-blue-950/80 rounded-2xl overflow-hidden border border-purple-500/20 shadow-xl">
              <div className="aspect-video bg-blue-900/50 p-8 flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                  <MicIcon className="h-7 w-7 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Study Session</h3>
                <p className="text-center text-gray-300">
                  Have natural voice conversations with your AI study assistant to learn any subject
                </p>
                <div className="mt-6 grid grid-cols-3 gap-3 w-full max-w-xs">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div 
                      key={n} 
                      className={`h-1 rounded-full ${n % 2 === 0 ? 'bg-purple-500' : 'bg-gray-700'}`}
                    ></div>
                  ))}
                </div>
              </div>
              <div className="p-6 bg-gradient-to-b from-blue-950/80 to-blue-900/30">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center">
                      AI
                    </div>
                    <div className="flex-1 p-3 rounded-xl bg-blue-800/30">
                      <p className="text-sm">Can you explain the water cycle to me?</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 justify-end">
                    <div className="flex-1 p-3 rounded-xl bg-purple-800/20">
                      <p className="text-sm">The water cycle describes how water evaporates from the Earth's surface...</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-purple-800/30 flex items-center justify-center">
                      <MicIcon className="h-4 w-4 text-purple-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold mb-12">How StudyBuddy Helps You Learn</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-blue-950/50 p-6 rounded-xl border border-purple-500/20">
              <div className="w-12 h-12 mb-4 mx-auto rounded-full bg-purple-600/20 flex items-center justify-center">
                <MicIcon className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Voice Interaction</h3>
              <p className="text-gray-400">Natural conversations with an AI tutor that explains concepts clearly</p>
            </div>
            
            <div className="bg-blue-950/50 p-6 rounded-xl border border-purple-500/20">
              <div className="w-12 h-12 mb-4 mx-auto rounded-full bg-purple-600/20 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Subject Expertise</h3>
              <p className="text-gray-400">Get help with any subject from math and science to languages and humanities</p>
            </div>
            
            <div className="bg-blue-950/50 p-6 rounded-xl border border-purple-500/20">
              <div className="w-12 h-12 mb-4 mx-auto rounded-full bg-purple-600/20 flex items-center justify-center">
                <Award className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Personal Learning</h3>
              <p className="text-gray-400">Customized study sessions that adapt to your learning style and pace</p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t border-purple-500/20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Logo size="sm" color="purple" />
            <p className="text-sm text-gray-400 mt-4 md:mt-0">
              © {new Date().getFullYear()} StudyBuddy. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
