
import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import MobileNavigation from '@/components/MobileNavigation';
import AnimatedContainer from '@/components/AnimatedContainer';
import { Presentation, Users, Mic, Gauge, ArrowRight, Play, History, Award, FileText, Book, Zap, BarChart } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-6 pb-24 md:pb-6">
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Dumela, Morutwana</h1>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-medium">
              M
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            <AnimatedContainer className="bg-card p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Gauge className="h-5 w-5 text-primary" />
                </div>
                <span className="text-4xl font-bold animate-pulse-soft">4</span>
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">Dithuto tsa beke e (Sessions this week)</h3>
            </AnimatedContainer>
            
            <AnimatedContainer className="bg-card p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <History className="h-5 w-5 text-primary" />
                </div>
                <span className="text-4xl font-bold animate-pulse-soft">1.5</span>
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">Diura tsa go ithuta (Hours of practice)</h3>
            </AnimatedContainer>
            
            <AnimatedContainer className="bg-card p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <span className="text-4xl font-bold animate-pulse-soft">2</span>
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">Bokgoni jo bo tokafetseng (Skills improved)</h3>
            </AnimatedContainer>
          </div>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Simolola thuto e ntsha (Start a new session)</h2>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link 
              to="/ai-chat"
              className="group bg-card hover:bg-card/80 p-6 rounded-xl border border-border shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-primary/10 mr-3 group-hover:bg-primary/20 transition-colors">
                  <Presentation className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium">Tlhagiso (Presentation)</h3>
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
              className="group bg-card hover:bg-card/80 p-6 rounded-xl border border-border shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-primary/10 mr-3 group-hover:bg-primary/20 transition-colors">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium">Potsolotso (Interview)</h3>
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
              className="group bg-card hover:bg-card/80 p-6 rounded-xl border border-border shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-primary/10 mr-3 group-hover:bg-primary/20 transition-colors">
                  <Mic className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium">Puo ya Botlhe (Public Speaking)</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Improve your public speaking with targeted feedback.</p>
              <div className="flex justify-end">
                <div className="p-2 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            </Link>
            
            <Link 
              to="/notes"
              className="group bg-card hover:bg-card/80 p-6 rounded-xl border border-border shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-primary/10 mr-3 group-hover:bg-primary/20 transition-colors">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium">Dintlha (Notes)</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Create and summarize your study notes.</p>
              <div className="flex justify-end">
                <div className="p-2 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            </Link>
          </div>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4">Dithuto tsa bosheng (Recent sessions)</h2>
          
          <AnimatedContainer className="bg-card overflow-hidden">
            <div className="p-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between py-3 border-b last:border-b-0 border-border hover:bg-muted/20 rounded-lg px-2 transition-colors">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-primary/10 mr-3">
                      {item === 1 && <Presentation className="h-4 w-4 text-primary" />}
                      {item === 2 && <Users className="h-4 w-4 text-primary" />}
                      {item === 3 && <Mic className="h-4 w-4 text-primary" />}
                    </div>
                    <div>
                      <h4 className="font-medium">
                        {item === 1 && "Tlhagiso ya Kgwebo (Product Presentation)"}
                        {item === 2 && "Potsolotso ya IT (Software Engineer Interview)"}
                        {item === 3 && "Puo ya Kopano (Conference Speech)"}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {item === 1 && "Malatsi a 3 a a fetileng • 15 min"}
                        {item === 2 && "Malatsi a 5 a a fetileng • 25 min"}
                        {item === 3 && "Beke e e fetileng • 10 min"}
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
              <Link to="/profile" className="text-sm text-primary hover:underline font-medium">
                Bona dithuto tsotlhe (View all sessions)
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
