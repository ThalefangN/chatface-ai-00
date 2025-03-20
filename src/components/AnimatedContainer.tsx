
import React from 'react';
import { cn } from "@/lib/utils";

interface AnimatedContainerProps {
  className?: string;
  children: React.ReactNode;
}

const AnimatedContainer: React.FC<AnimatedContainerProps> = ({ className, children }) => {
  return (
    <div className={cn(
      "ai-container relative rounded-2xl p-6 overflow-hidden",
      "border border-primary/10",
      "shadow-lg",
      className
    )}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-12 bg-primary/40 rounded-full animate-wave-1"></div>
        <div className="absolute top-1/3 left-1/3 w-1 h-16 bg-primary/40 rounded-full animate-wave-2"></div>
        <div className="absolute top-1/2 left-1/2 w-1 h-20 bg-primary/40 rounded-full animate-wave-3"></div>
        <div className="absolute top-2/3 left-2/3 w-1 h-16 bg-primary/40 rounded-full animate-wave-2"></div>
        <div className="absolute top-3/4 left-3/4 w-1 h-12 bg-primary/40 rounded-full animate-wave-1"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AnimatedContainer;
