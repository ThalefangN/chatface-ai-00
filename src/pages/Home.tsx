
import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import MobileNavigation from '@/components/MobileNavigation';
import AnimatedContainer from '@/components/AnimatedContainer';
import { BookOpen, Users, Mic, Gauge, ArrowRight, Play, History, Award, FileText, Book, Zap, BarChart } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-6 pb-24 md:pb-6">
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Hello, Student</h1>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white font-medium">
              S
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            <AnimatedContainer className="bg-card p-6 from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 bg-gradient-to-br">
              <div className="flex justify-between items-center mb-4">
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <Gauge className="h-5 w-5 text-blue-500" />
                </div>
                <span className="text-4xl font-bold animate-pulse-soft">4</span>
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">Study sessions this week</h3>
            </AnimatedContainer>
            
            <AnimatedContainer className="bg-card p-6 from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 bg-gradient-to-br">
              <div className="flex justify-between items-center mb-4">
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <History className="h-5 w-5 text-blue-500" />
                </div>
                <span className="text-4xl font-bold animate-pulse-soft">1.5</span>
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">Hours of learning</h3>
            </AnimatedContainer>
            
            <AnimatedContainer className="bg-card p-6 from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 bg-gradient-to-br">
              <div className="flex justify-between items-center mb-4">
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <Award className="h-5 w-5 text-blue-500" />
                </div>
                <span className="text-4xl font-bold animate-pulse-soft">2</span>
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">Subjects mastered</h3>
            </AnimatedContainer>
          </div>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Start a new study session</h2>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link 
              to="/ai-chat"
              className="group bg-card hover:bg-card/80 p-6 rounded-xl border border-border shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-blue-500/10 mr-3 group-hover:bg-blue-500/20 transition-colors">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="font-medium">General Study</h3>
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
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="font-medium">Tutoring</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Get step-by-step guidance on difficult topics.</p>
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
                  <Mic className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="font-medium">Quiz Practice</h3>
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
                  <FileText className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="font-medium">Notes</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Create and organize your study notes.</p>
              <div className="flex justify-end">
                <div className="p-2 rounded-full bg-muted group-hover:bg-blue-500/10 transition-colors">
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                </div>
              </div>
            </Link>
          </div>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4">Recent study sessions</h2>
          
          <AnimatedContainer className="bg-card overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <div className="p-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between py-3 border-b last:border-b-0 border-border hover:bg-muted/20 rounded-lg px-2 transition-colors">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-primary/10 mr-3">
                      {item === 1 && <BookOpen className="h-4 w-4 text-blue-500" />}
                      {item === 2 && <Users className="h-4 w-4 text-blue-500" />}
                      {item === 3 && <Mic className="h-4 w-4 text-blue-500" />}
                    </div>
                    <div>
                      <h4 className="font-medium">
                        {item === 1 && "Biology Fundamentals"}
                        {item === 2 && "Algebra Tutoring"}
                        {item === 3 && "History Quiz Practice"}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {item === 1 && "3 days ago • 15 min"}
                        {item === 2 && "5 days ago • 25 min"}
                        {item === 3 && "1 week ago • 10 min"}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 rounded-lg hover:bg-primary/10 transition-colors group">
                    <Play className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="bg-muted/30 p-4 text-center">
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
