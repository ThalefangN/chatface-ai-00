
import React from 'react';
import { cn } from "@/lib/utils";
import { Camera, CameraOff, MicOff, Mic } from 'lucide-react';

interface VideoContainerProps {
  videoRef?: React.Ref<HTMLVideoElement>;
  className?: string;
  isUser?: boolean;
  isLoading?: boolean;
  error?: Error | null;
  audioEnabled?: boolean;
  videoEnabled?: boolean;
  onToggleVideo?: () => void;
  onToggleAudio?: () => void;
  children?: React.ReactNode;
}

const VideoContainer: React.FC<VideoContainerProps> = ({
  videoRef,
  className,
  isUser = false,
  isLoading = false,
  error = null,
  audioEnabled = true,
  videoEnabled = true,
  onToggleVideo,
  onToggleAudio,
  children
}) => {
  return (
    <div className={cn(
      "video-container relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300",
      isUser ? "bg-black" : "ai-container bg-muted",
      className
    )}>
      {isUser && videoEnabled && (
        <video
          ref={videoRef as React.Ref<HTMLVideoElement>}
          autoPlay
          playsInline
          muted={!audioEnabled}
          className="w-full h-full object-cover"
        />
      )}
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
              <Camera className="h-6 w-6 text-primary animate-pulse" />
            </div>
            <p className="mt-2 text-sm font-medium">Loading camera...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
          <div className="text-center p-4">
            <CameraOff className="h-10 w-10 mx-auto text-destructive mb-2" />
            <p className="text-sm font-medium text-destructive">Camera access denied</p>
            <p className="text-xs text-muted-foreground mt-1">Please check your camera permissions</p>
          </div>
        </div>
      )}
      
      {!isUser && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {children}
        </div>
      )}
      
      {isUser && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {onToggleVideo && (
            <button 
              onClick={onToggleVideo}
              className={cn(
                "p-2 rounded-full transition-colors",
                videoEnabled 
                  ? "bg-muted/80 text-foreground hover:bg-muted" 
                  : "bg-destructive/80 text-destructive-foreground hover:bg-destructive"
              )}
            >
              {videoEnabled ? <Camera size={18} /> : <CameraOff size={18} />}
            </button>
          )}
          
          {onToggleAudio && (
            <button 
              onClick={onToggleAudio}
              className={cn(
                "p-2 rounded-full transition-colors",
                audioEnabled 
                  ? "bg-muted/80 text-foreground hover:bg-muted" 
                  : "bg-destructive/80 text-destructive-foreground hover:bg-destructive"
              )}
            >
              {audioEnabled ? <Mic size={18} /> : <MicOff size={18} />}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoContainer;
