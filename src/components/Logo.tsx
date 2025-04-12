
import React from 'react';
import { BookOpen } from 'lucide-react';
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  darkMode?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className, size = 'md', darkMode = false }) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <div className={cn(
          "absolute inset-0 rounded-full blur-sm",
          darkMode ? "bg-blue-400/30" : "bg-blue-500/20" 
        )}></div>
        <div className={cn(
          "relative p-2 rounded-full",
          darkMode ? "bg-blue-400 text-black" : "bg-blue-500 text-white"
        )}>
          <BookOpen className={cn("animate-pulse-soft", sizeClasses[size])} />
        </div>
      </div>
      <span className={cn(
        "font-bold tracking-tight", 
        sizeClasses[size],
        darkMode && "text-white"
      )}>
        StudyBuddy
      </span>
    </div>
  );
};

export default Logo;
