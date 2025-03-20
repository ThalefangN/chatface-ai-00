
import React from 'react';
import Navigation from '@/components/Navigation';
import MobileNavigation from '@/components/MobileNavigation';
import { Bell, Calendar, Clock, Info, CheckCircle, AlertTriangle } from 'lucide-react';

const Alerts = () => {
  const alerts = [
    {
      id: 1,
      type: 'reminder',
      title: 'Practice session scheduled',
      message: 'You have a Job Interview practice session scheduled for tomorrow at 10:00 AM.',
      time: '2 hours ago',
      icon: Calendar,
      read: false
    },
    {
      id: 2,
      type: 'info',
      title: 'New feature available',
      message: 'We\'ve added new interview scenarios. Try them out in your next practice session!',
      time: '1 day ago',
      icon: Info,
      read: false
    },
    {
      id: 3,
      type: 'success',
      title: 'Session completed',
      message: 'Your presentation practice has been analyzed. View your feedback report.',
      time: '3 days ago',
      icon: CheckCircle,
      read: true
    },
    {
      id: 4,
      type: 'warning',
      title: 'Missing practice',
      message: 'You haven\'t practiced public speaking this week. Consider scheduling a session.',
      time: '5 days ago',
      icon: AlertTriangle,
      read: true
    }
  ];
  
  const getIconStyles = (type: string, read: boolean) => {
    const baseClasses = "h-5 w-5";
    
    if (read) return `${baseClasses} text-muted-foreground`;
    
    switch (type) {
      case 'reminder': return `${baseClasses} text-blue-500`;
      case 'info': return `${baseClasses} text-primary`;
      case 'success': return `${baseClasses} text-green-500`;
      case 'warning': return `${baseClasses} text-amber-500`;
      default: return `${baseClasses} text-muted-foreground`;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-6 pb-24 md:pb-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Notifications</h1>
          </div>
          
          <button className="text-sm text-primary hover:underline">
            Mark all as read
          </button>
        </div>
        
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          {alerts.map((alert) => {
            const IconComponent = alert.icon;
            
            return (
              <div 
                key={alert.id}
                className={`flex gap-4 p-4 border-b last:border-b-0 border-border transition-colors ${
                  alert.read ? 'bg-card' : 'bg-primary/5'
                }`}
              >
                <div className={`p-2 rounded-full ${
                  alert.read ? 'bg-muted' : 'bg-primary/10'
                }`}>
                  <IconComponent className={getIconStyles(alert.type, alert.read)} />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className={`font-medium ${alert.read ? 'text-foreground' : 'text-foreground'}`}>
                      {alert.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {alert.time}
                      </span>
                      
                      {!alert.read && (
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                      )}
                    </div>
                  </div>
                  
                  <p className={`text-sm mt-1 ${
                    alert.read ? 'text-muted-foreground' : 'text-foreground'
                  }`}>
                    {alert.message}
                  </p>
                </div>
              </div>
            );
          })}
          
          <div className="bg-muted/30 p-4 text-center text-sm text-muted-foreground">
            No more notifications
          </div>
        </div>
      </main>
      
      <MobileNavigation />
    </div>
  );
};

export default Alerts;
