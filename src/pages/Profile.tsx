
import React from 'react';
import Navigation from '@/components/Navigation';
import MobileNavigation from '@/components/MobileNavigation';
import { User, Settings, LogOut, Award, Calendar, Clock, BarChart3, Mic, Users, Presentation } from 'lucide-react';

const Profile = () => {
  const recentSessions = [
    {
      id: 1,
      type: 'presentation',
      title: 'Product Demo',
      date: '3 days ago',
      duration: '15 min',
      icon: Presentation
    },
    {
      id: 2,
      type: 'interview',
      title: 'Technical Interview',
      date: '5 days ago',
      duration: '25 min',
      icon: Users
    },
    {
      id: 3,
      type: 'public-speaking',
      title: 'Conference Talk',
      date: '1 week ago',
      duration: '10 min',
      icon: Mic
    }
  ];
  
  const skills = [
    { name: 'Clarity', value: 70 },
    { name: 'Confidence', value: 85 },
    { name: 'Pacing', value: 60 },
    { name: 'Structure', value: 75 }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-6 pb-24 md:pb-6">
        <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-semibold">
              U
            </div>
            <div>
              <h1 className="text-2xl font-bold">User Profile</h1>
              <p className="text-muted-foreground">user@example.com</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex items-center bg-card border border-border px-4 py-2 rounded-lg text-sm hover:bg-muted transition-colors">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </button>
            <button className="inline-flex items-center bg-card border border-border px-4 py-2 rounded-lg text-sm hover:bg-destructive/10 text-destructive transition-colors">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Skills Overview</h3>
              <Award className="h-5 w-5 text-primary" />
            </div>
            
            <div className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">{skill.name}</span>
                    <span className="text-sm font-medium">{skill.value}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${skill.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Practice Stats</h3>
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="text-sm">Total Sessions</span>
                </div>
                <span className="font-medium">12</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="text-sm">Practice Time</span>
                </div>
                <span className="font-medium">6.5 hours</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Presentation className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="text-sm">Presentations</span>
                </div>
                <span className="font-medium">5</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="text-sm">Interviews</span>
                </div>
                <span className="font-medium">4</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Mic className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="text-sm">Public Speaking</span>
                </div>
                <span className="font-medium">3</span>
              </div>
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm md:col-span-2 lg:col-span-1">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Account Info</h3>
              <User className="h-5 w-5 text-primary" />
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">User Name</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">user@example.com</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium">October 2023</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Subscription</p>
                <p className="font-medium">Pro Plan</p>
              </div>
            </div>
          </div>
        </div>
        
        <section>
          <h2 className="text-xl font-semibold mb-4">Recent Practice Sessions</h2>
          
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="p-6">
              {recentSessions.map((session) => {
                const IconComponent = session.icon;
                
                return (
                  <div key={session.id} className="flex items-center justify-between py-3 border-b last:border-b-0 border-border">
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-primary/10 mr-3">
                        <IconComponent className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{session.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {session.date} • {session.duration}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-xs bg-card border border-border px-3 py-1 rounded hover:bg-muted transition-colors">
                        View
                      </button>
                      <button className="text-xs bg-primary/10 text-primary px-3 py-1 rounded hover:bg-primary/20 transition-colors">
                        Replay
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="bg-muted/30 p-4 text-center">
              <button className="text-sm text-primary hover:underline">
                View all practice sessions
              </button>
            </div>
          </div>
        </section>
      </main>
      
      <MobileNavigation />
    </div>
  );
};

export default Profile;
