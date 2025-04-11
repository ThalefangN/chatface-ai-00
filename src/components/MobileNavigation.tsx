
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Home, Mic, Bell, User, FileText } from 'lucide-react';

const MobileNavigation = () => {
  const location = useLocation();
  
  const navItems = [
    { 
      path: '/home', 
      label: 'Home', 
      icon: Home 
    },
    { 
      path: '/ai-chat', 
      label: 'Study', 
      icon: Mic,
      isPrimary: true
    },
    { 
      path: '/notes', 
      label: 'Notes', 
      icon: FileText 
    },
    { 
      path: '/alerts', 
      label: 'Alerts', 
      icon: Bell 
    },
    { 
      path: '/profile', 
      label: 'Profile', 
      icon: User 
    }
  ];
  
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex items-center justify-around px-2 py-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          if (item.isPrimary) {
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative flex flex-col items-center"
              >
                <div className="absolute -top-8 bg-blue-500 text-white p-4 rounded-full shadow-lg transform hover:scale-110 hover:bg-blue-600 transition-all duration-300">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold mt-7 text-muted-foreground">
                  {item.label}
                </span>
              </Link>
            );
          }
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-300",
                isActive 
                  ? "text-blue-500 scale-110 font-bold" 
                  : "text-muted-foreground hover:text-foreground hover:scale-105"
              )}
            >
              <Icon className={cn(
                "h-6 w-6", 
                isActive && "animate-pulse-soft"
              )} />
              <span className={cn(
                "text-xs font-bold", 
                isActive && "animate-pulse-soft"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavigation;
