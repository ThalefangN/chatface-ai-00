
import React from 'react';
import { BookOpen } from 'lucide-react';
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-sm"></div>
        <div className="relative bg-blue-500 text-white p-2 rounded-full">
          <BookOpen className={cn("animate-pulse-soft", sizeClasses[size])} />
        </div>
      </div>
      <span className={cn("font-bold tracking-tight", sizeClasses[size])}>
        StudyBuddy
      </span>
    </div>
  );
};

export default Logo;
