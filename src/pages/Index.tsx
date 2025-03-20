
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import { ArrowRight, MicIcon, Users, Presentation, Award } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Logo size="lg" />
        <div className="space-x-4">
          <Link 
            to="/sign-in" 
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Sign In
          </Link>
          <Link 
            to="/sign-up" 
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-12 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          <div className="space-y-6 max-w-xl">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-primary/10 text-primary">
              <span className="animate-pulse-soft mr-1">●</span> 
              AI-Powered Interview Practice
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Perfect Your Speaking Skills with AI Feedback
            </h1>
            
            <p className="text-lg text-muted-foreground">
              Practice presentations, interviews, and public speaking with our AI coach. 
              Get real-time feedback and improve your communication skills.
            </p>
            
            <div className="pt-4">
              <Link 
                to="/sign-up" 
                className="group inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            
            <div className="flex items-center space-x-4 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <div className="mr-1.5 h-4 w-4 text-primary">
                  <MicIcon className="h-4 w-4" />
                </div>
                Speech Analysis
              </div>
              <div className="flex items-center">
                <div className="mr-1.5 h-4 w-4 text-primary">
                  <Presentation className="h-4 w-4" />
                </div>
                Video Recording
              </div>
              <div className="flex items-center">
                <div className="mr-1.5 h-4 w-4 text-primary">
                  <Award className="h-4 w-4" />
                </div>
                AI Coaching
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-primary/40 rounded-2xl blur-xl animate-pulse-soft opacity-70"></div>
            <div className="relative bg-card rounded-2xl overflow-hidden border border-border shadow-xl">
              <div className="aspect-video bg-muted p-8 flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Video Interview</h3>
                <p className="text-center text-muted-foreground">
                  Practice with our AI interviewer and receive detailed feedback on your performance
                </p>
                <div className="mt-6 grid grid-cols-3 gap-3 w-full max-w-xs">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div 
                      key={n} 
                      className={`h-1 rounded-full ${n % 2 === 0 ? 'bg-primary' : 'bg-muted-foreground/20'}`}
                    ></div>
                  ))}
                </div>
              </div>
              <div className="p-6 bg-gradient-to-b from-card to-muted/30">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                      AI
                    </div>
                    <div className="flex-1 p-3 rounded-xl bg-muted/50">
                      <p className="text-sm">Tell me about a time when you had to give an important presentation.</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 justify-end">
                    <div className="flex-1 p-3 rounded-xl bg-primary/10">
                      <p className="text-sm">I once gave a presentation to our executive team about...</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <Users className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold mb-12">How SpeakAI Helps You Improve</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-xl border border-border">
              <div className="w-12 h-12 mb-4 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <MicIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Speech Analysis</h3>
              <p className="text-muted-foreground">Get feedback on your pace, clarity, filler words, and overall delivery</p>
            </div>
            
            <div className="bg-card p-6 rounded-xl border border-border">
              <div className="w-12 h-12 mb-4 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Presentation className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Practice Scenarios</h3>
              <p className="text-muted-foreground">Choose from various practice scenarios from job interviews to public speeches</p>
            </div>
            
            <div className="bg-card p-6 rounded-xl border border-border">
              <div className="w-12 h-12 mb-4 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized Coaching</h3>
              <p className="text-muted-foreground">Receive customized tips and strategies to improve your speaking skills</p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Logo size="sm" />
            <p className="text-sm text-muted-foreground mt-4 md:mt-0">
              © {new Date().getFullYear()} SpeakAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
