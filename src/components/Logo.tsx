
import React from 'react';
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
    <div className={cn("flex items-center", className)}>
      <span className={cn(
        "font-bold tracking-tight", 
        sizeClasses[size],
        darkMode ? "text-white" : "text-black"
      )}>
        StudyBuddy
      </span>
    </div>
  );
};

export default Logo;
