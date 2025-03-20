
import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import MobileNavigation from '@/components/MobileNavigation';
import { Presentation, Users, Mic, Gauge, ArrowRight, Play, History, Award } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-6 pb-24 md:pb-6">
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Welcome back, User</h1>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-medium">
              U
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Gauge className="h-5 w-5 text-primary" />
                </div>
                <span className="text-4xl font-bold">4</span>
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">Practice sessions this week</h3>
            </div>
            
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <History className="h-5 w-5 text-primary" />
                </div>
                <span className="text-4xl font-bold">1.5</span>
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">Hours of practice</h3>
            </div>
            
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <span className="text-4xl font-bold">2</span>
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">Skills improved</h3>
            </div>
          </div>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Start a new practice session</h2>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link 
              to="/ai-chat"
              className="group bg-card hover:bg-card/80 p-6 rounded-xl border border-border shadow-sm transition-colors"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-primary/10 mr-3">
                  <Presentation className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium">Presentation</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Practice delivering clear, engaging presentations.</p>
              <div className="flex justify-end">
                <div className="p-2 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            </Link>
            
            <Link 
              to="/ai-chat"
              className="group bg-card hover:bg-card/80 p-6 rounded-xl border border-border shadow-sm transition-colors"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-primary/10 mr-3">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium">Job Interview</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Prepare for job interviews with realistic scenarios.</p>
              <div className="flex justify-end">
                <div className="p-2 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            </Link>
            
            <Link 
              to="/ai-chat"
              className="group bg-card hover:bg-card/80 p-6 rounded-xl border border-border shadow-sm transition-colors"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-primary/10 mr-3">
                  <Mic className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium">Public Speaking</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Improve your public speaking with targeted feedback.</p>
              <div className="flex justify-end">
                <div className="p-2 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            </Link>
            
            <Link 
              to="/ai-chat"
              className="group bg-card hover:bg-card/80 p-6 rounded-xl border border-border shadow-sm transition-colors"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-primary/10 mr-3">
                  <Play className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium">Custom Session</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Create a customized practice session.</p>
              <div className="flex justify-end">
                <div className="p-2 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            </Link>
          </div>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4">Recent practice sessions</h2>
          
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="p-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between py-3 border-b last:border-b-0 border-border">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-primary/10 mr-3">
                      {item === 1 && <Presentation className="h-4 w-4 text-primary" />}
                      {item === 2 && <Users className="h-4 w-4 text-primary" />}
                      {item === 3 && <Mic className="h-4 w-4 text-primary" />}
                    </div>
                    <div>
                      <h4 className="font-medium">
                        {item === 1 && "Product Presentation"}
                        {item === 2 && "Software Engineer Interview"}
                        {item === 3 && "Conference Speech"}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {item === 1 && "3 days ago • 15 min"}
                        {item === 2 && "5 days ago • 25 min"}
                        {item === 3 && "1 week ago • 10 min"}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                    <Play className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="bg-muted/30 p-4 text-center">
              <Link to="/profile" className="text-sm text-primary hover:underline">
                View all practice sessions
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <MobileNavigation />
    </div>
  );
};

export default Home;
