
import React from 'react';
import { cn } from "@/lib/utils";
import { Mic } from 'lucide-react';

interface RecordingIndicatorProps {
  isRecording: boolean;
  onClick?: () => void;
  className?: string;
}

const RecordingIndicator: React.FC<RecordingIndicatorProps> = ({ 
  isRecording, 
  onClick,
  className 
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center justify-center rounded-full transition-all duration-300",
        isRecording ? "scale-110" : "scale-100",
        className
      )}
    >
      <div className={cn(
        "absolute inset-0 rounded-full",
        isRecording 
          ? "bg-red-500/20 animate-pulse" 
          : "bg-blue-500/20"
      )}></div>
      
      <div className={cn(
        "absolute inset-0 rounded-full border-2",
        isRecording 
          ? "border-red-500 animate-ping opacity-75" 
          : "border-blue-500"
      )}></div>
      
      <div className={cn(
        "relative flex items-center justify-center w-16 h-16 rounded-full",
        isRecording 
          ? "bg-red-500 text-white" 
          : "bg-blue-500 text-white hover:bg-blue-600"
      )}>
        <Mic className={cn(
          "h-6 w-6",
          isRecording && "animate-pulse"
        )} />
      </div>
    </button>
  );
};

export default RecordingIndicator;
