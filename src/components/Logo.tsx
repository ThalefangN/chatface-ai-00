
import React from 'react';
import { Mic } from 'lucide-react';
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
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm"></div>
        <div className="relative bg-primary text-primary-foreground p-2 rounded-full">
          <Mic className={cn("animate-pulse-soft", sizeClasses[size])} />
        </div>
      </div>
      <span className={cn("font-bold tracking-tight", sizeClasses[size])}>
        SpeakAI
      </span>
    </div>
  );
};

export default Logo;
