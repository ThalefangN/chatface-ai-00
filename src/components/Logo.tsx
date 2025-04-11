
import React from 'react';
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'purple' | 'blue' | 'default';
}

const Logo: React.FC<LogoProps> = ({ className, size = 'md', color = 'default' }) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };
  
  const colorVariants = {
    default: 'bg-blue-500 text-white',
    blue: 'bg-blue-500 text-white',
    purple: 'bg-purple-600 text-white',
  };
  
  const glowColors = {
    default: 'bg-blue-500/20',
    blue: 'bg-blue-500/20',
    purple: 'bg-purple-600/20',
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <div className={cn("absolute inset-0 rounded-full blur-sm", glowColors[color])}></div>
        <div className={cn("relative p-2 rounded-full", colorVariants[color])}>
          {/* Custom SVG for the purple star logo */}
          <svg 
            className={cn("animate-pulse-soft", sizeClasses[size])}
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
      <span className={cn("font-bold tracking-tight", sizeClasses[size])}>
        StudyBuddy
      </span>
    </div>
  );
};

export default Logo;
