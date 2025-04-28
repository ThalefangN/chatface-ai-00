
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
    <div className={cn("flex items-center gap-2", className)}>
      <img 
        src="/lovable-uploads/e918ace7-e0d8-4b3e-a420-01a719aad5ff.png" 
        alt="StudyBuddy Logo" 
        className={cn(
          "h-8 w-8 object-contain",
          size === 'sm' && "h-6 w-6",
          size === 'lg' && "h-10 w-10"
        )}
      />
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
