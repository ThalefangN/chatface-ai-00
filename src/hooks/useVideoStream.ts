
import { useState, useEffect, useRef } from 'react';

interface UseVideoStreamOptions {
  enabled?: boolean;
  audioEnabled?: boolean;
}

export function useVideoStream({ enabled = true, audioEnabled = true }: UseVideoStreamOptions = {}) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const startStream = async () => {
    if (!enabled) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: audioEnabled
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError(err instanceof Error ? err : new Error('Failed to access camera'));
    } finally {
      setIsLoading(false);
    }
  };

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  useEffect(() => {
    if (enabled) {
      startStream();
    }
    
    return () => {
      stopStream();
    };
  }, [enabled, audioEnabled]);

  const setVideoRef = (el: HTMLVideoElement | null) => {
    videoRef.current = el;
    
    if (el && stream) {
      el.srcObject = stream;
    }
  };

  return {
    stream,
    error,
    isLoading,
    videoRef: setVideoRef,
    startStream,
    stopStream
  };
}
