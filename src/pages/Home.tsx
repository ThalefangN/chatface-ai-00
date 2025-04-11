
import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import MobileNavigation from '@/components/MobileNavigation';
import AnimatedContainer from '@/components/AnimatedContainer';
import { BookOpen, Mic, Gauge, ArrowRight, Play, History, Award, FileText, Brain, Sparkles, GraduationCap } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-6 pb-24 md:pb-6">
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-blue-900">Welcome to StudyBuddy</h1>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white font-medium">
              S
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            <AnimatedContainer className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="flex justify-between items-center mb-4">
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <Gauge className="h-5 w-5 text-blue-500" />
                </div>
                <span className="text-4xl font-bold text-blue-900 animate-pulse-soft">4</span>
              </div>
              <h3 className="text-sm font-medium text-blue-700">Study sessions this week</h3>
            </AnimatedContainer>
            
            <AnimatedContainer className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="flex justify-between items-center mb-4">
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <History className="h-5 w-5 text-blue-500" />
                </div>
                <span className="text-4xl font-bold text-blue-900 animate-pulse-soft">1.5</span>
              </div>
              <h3 className="text-sm font-medium text-blue-700">Hours of learning</h3>
            </AnimatedContainer>
            
            <AnimatedContainer className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="flex justify-between items-center mb-4">
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <Award className="h-5 w-5 text-blue-500" />
                </div>
                <span className="text-4xl font-bold text-blue-900 animate-pulse-soft">2</span>
              </div>
              <h3 className="text-sm font-medium text-blue-700">Topics mastered</h3>
            </AnimatedContainer>
          </div>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">Start a study session</h2>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link 
              to="/ai-chat"
              className="group bg-white hover:bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-blue-100 mr-3 group-hover:bg-blue-200 transition-colors">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="font-medium text-blue-900">Subject Tutoring</h3>
              </div>
              <p className="text-sm text-blue-700 mb-4">Get help with specific subjects and homework questions.</p>
              <div className="flex justify-end">
                <div className="p-2 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors">
                  <ArrowRight className="h-4 w-4 text-blue-500" />
                </div>
              </div>
            </Link>
            
            <Link 
              to="/ai-chat"
              className="group bg-white hover:bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-blue-100 mr-3 group-hover:bg-blue-200 transition-colors">
                  <Brain className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="font-medium text-blue-900">Concept Review</h3>
              </div>
              <p className="text-sm text-blue-700 mb-4">Review and master challenging academic concepts.</p>
              <div className="flex justify-end">
                <div className="p-2 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors">
                  <ArrowRight className="h-4 w-4 text-blue-500" />
                </div>
              </div>
            </Link>
            
            <Link 
              to="/ai-chat"
              className="group bg-white hover:bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-blue-100 mr-3 group-hover:bg-blue-200 transition-colors">
                  <Mic className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="font-medium text-blue-900">Voice Learning</h3>
              </div>
              <p className="text-sm text-blue-700 mb-4">Learn through natural voice conversations with your AI tutor.</p>
              <div className="flex justify-end">
                <div className="p-2 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors">
                  <ArrowRight className="h-4 w-4 text-blue-500" />
                </div>
              </div>
            </Link>
            
            <Link 
              to="/notes"
              className="group bg-white hover:bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-blue-100 mr-3 group-hover:bg-blue-200 transition-colors">
                  <FileText className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="font-medium text-blue-900">Study Notes</h3>
              </div>
              <p className="text-sm text-blue-700 mb-4">Create and organize your study notes with AI assistance.</p>
              <div className="flex justify-end">
                <div className="p-2 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors">
                  <ArrowRight className="h-4 w-4 text-blue-500" />
                </div>
              </div>
            </Link>
          </div>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-blue-900">Recent study sessions</h2>
          
          <AnimatedContainer className="bg-white overflow-hidden rounded-xl border border-blue-100 shadow-sm">
            <div className="p-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between py-3 border-b last:border-b-0 border-blue-100 hover:bg-blue-50 rounded-lg px-2 transition-colors">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-blue-100 mr-3">
                      {item === 1 && <BookOpen className="h-4 w-4 text-blue-500" />}
                      {item === 2 && <GraduationCap className="h-4 w-4 text-blue-500" />}
                      {item === 3 && <Sparkles className="h-4 w-4 text-blue-500" />}
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-900">
                        {item === 1 && "Biology Concepts"}
                        {item === 2 && "Math Problem Solving"}
                        {item === 3 && "History Review"}
                      </h4>
                      <p className="text-xs text-blue-600">
                        {item === 1 && "3 days ago • 15 min"}
                        {item === 2 && "5 days ago • 25 min"}
                        {item === 3 && "1 week ago • 10 min"}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 rounded-lg hover:bg-blue-100 transition-colors group">
                    <Play className="h-4 w-4 text-blue-500" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="bg-blue-50 p-4 text-center">
              <Link to="/profile" className="text-sm text-blue-500 hover:underline font-medium">
                View all study sessions
              </Link>
            </div>
          </AnimatedContainer>
        </section>
      </main>
      
      <MobileNavigation />
    </div>
  );
};

export default Home;
