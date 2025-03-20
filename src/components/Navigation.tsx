
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Menu, Home, Plus, Bell, User, ChevronDown, LogOut } from 'lucide-react';
import Logo from './Logo';

const Navigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navItems = [
    { 
      path: '/home', 
      label: 'Home', 
      icon: Home 
    },
    { 
      path: '/ai-chat', 
      label: 'AI Chat', 
      icon: Plus
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

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/70 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/home" className="flex items-center gap-2">
            <Logo />
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden relative">
          <button
            onClick={toggleMenu}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </button>
          
          {/* Mobile Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 py-2 bg-card rounded-lg shadow-lg border border-border animate-fade-in">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 text-sm",
                      isActive 
                        ? "text-primary bg-primary/5" 
                        : "text-foreground hover:bg-muted"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
              
              <div className="border-t border-border my-1"></div>
              
              <Link
                to="/sign-in"
                className="flex items-center gap-3 px-4 py-2 text-sm text-destructive hover:bg-muted"
                onClick={() => setIsMenuOpen(false)}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Link>
            </div>
          )}
        </div>
        
        {/* Desktop User Menu */}
        <div className="hidden md:flex items-center gap-4">
          <div className="relative">
            <button
              onClick={toggleMenu}
              className="flex items-center gap-2 text-sm font-medium hover:text-foreground"
            >
              <span>User</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 py-2 bg-card rounded-lg shadow-lg border border-border animate-fade-in">
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                
                <div className="border-t border-border my-1"></div>
                
                <Link
                  to="/sign-in"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-destructive hover:bg-muted"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
