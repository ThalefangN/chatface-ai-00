
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/animated-sidebar";
import { LayoutDashboard, UserCog, Settings, LogOut, BookOpen, MessageSquare, Play, Pause, Volume2, VolumeX, Mic, MicOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import VideoContainer from "@/components/VideoContainer";
import { useVideoStream } from "@/hooks/useVideoStream";

const AudioOverview = () => {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioOnly, setIsAudioOnly] = useState(false);
  const [isVoiceChatMode, setIsVoiceChatMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const { videoRef, isLoading, error } = useVideoStream({ 
    enabled: isVoiceChatMode,
    audioEnabled: !isMuted 
  });

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleAudioOnly = () => {
    setIsAudioOnly(!isAudioOnly);
  };

  const toggleVoiceChat = () => {
    setIsVoiceChatMode(!isVoiceChatMode);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Study Materials",
      href: "/notes",
      icon: (
        <BookOpen className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Chat",
      href: "/chat",
      icon: (
        <MessageSquare className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "/profile",
      icon: (
        <UserCog className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "/profile",
      icon: (
        <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  const Logo = () => {
    return (
      <Link
        to="/dashboard"
        className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
      >
        <div className="h-5 w-6 bg-blue-500 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-medium text-black dark:text-white whitespace-pre"
        >
          StudyBuddy
        </motion.span>
      </Link>
    );
  };

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Logo />
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <SidebarLink
              link={{
                label: user?.email || "User",
                href: "/profile",
                icon: (
                  <Avatar className="h-7 w-7 flex-shrink-0">
                    <AvatarImage 
                      src={user?.user_metadata?.avatar_url || "/lovable-uploads/4f570823-6f09-4aea-a965-7a2405cf6a14.png"} 
                      alt="User avatar" 
                    />
                    <AvatarFallback>
                      {user?.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                ),
              }}
            />
            <button
              onClick={handleSignOut}
              className="flex items-center justify-start gap-2 group/sidebar py-2 text-red-600 hover:text-red-700"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              <motion.span
                animate={{
                  display: open ? "inline-block" : "none",
                  opacity: open ? 1 : 0,
                }}
                className="text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
              >
                Logout
              </motion.span>
            </button>
          </div>
        </SidebarBody>
      </Sidebar>

      <div className="flex flex-1">
        <div className="p-2 md:p-6 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full overflow-hidden">
          <div className="w-full h-full bg-white dark:bg-gray-900 flex flex-col">
            {/* Header Section */}
            <div className="border-b border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Volume2 className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Audio Overview - Podcast Learning
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Watch video lessons, listen to audio content, or have voice conversations with AI
              </p>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-auto">
              <div className="max-w-6xl mx-auto space-y-6">
                {/* Video/Audio Container */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="aspect-video bg-black rounded-lg mb-4 relative overflow-hidden">
                    {isVoiceChatMode ? (
                      <VideoContainer
                        videoRef={videoRef}
                        isUser={true}
                        isLoading={isLoading}
                        error={error}
                        audioEnabled={!isMuted}
                        videoEnabled={!isAudioOnly}
                        className="w-full h-full"
                      >
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-600">
                          <div className="text-center text-white">
                            <Mic className="h-12 w-12 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Voice AI Conversation</h3>
                            <p className="text-sm opacity-80">Speak naturally with your AI tutor</p>
                          </div>
                        </div>
                      </VideoContainer>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                        {isAudioOnly ? (
                          <div className="text-center text-white">
                            <Volume2 className="h-16 w-16 mx-auto mb-4" />
                            <h3 className="text-2xl font-semibold mb-2">Audio Mode</h3>
                            <p className="text-lg opacity-80">Mathematics Fundamentals Podcast</p>
                          </div>
                        ) : (
                          <div className="text-center text-white">
                            <Play className="h-16 w-16 mx-auto mb-4" />
                            <h3 className="text-2xl font-semibold mb-2">Video Lesson</h3>
                            <p className="text-lg opacity-80">Mathematics Fundamentals</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="flex flex-wrap gap-3 justify-center">
                    <Button
                      onClick={togglePlayPause}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={isVoiceChatMode}
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      {isPlaying ? 'Pause' : 'Play'}
                    </Button>

                    <Button
                      onClick={toggleAudioOnly}
                      variant={isAudioOnly ? "default" : "outline"}
                      className="flex items-center gap-2"
                      disabled={isVoiceChatMode}
                    >
                      <Volume2 className="h-4 w-4" />
                      Audio Only
                    </Button>

                    <Button
                      onClick={toggleVoiceChat}
                      variant={isVoiceChatMode ? "default" : "outline"}
                      className="flex items-center gap-2"
                    >
                      {isVoiceChatMode ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      {isVoiceChatMode ? 'End Voice Chat' : 'Voice Chat'}
                    </Button>

                    <Button
                      onClick={toggleMute}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      {isMuted ? 'Unmute' : 'Mute'}
                    </Button>
                  </div>
                </div>

                {/* Episode Information */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Current Episode</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Title:</strong> Introduction to Algebra
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Duration:</strong> 25 minutes
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Topics:</strong> Variables, Equations, Basic Operations
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Learning Options</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Play className="h-4 w-4" />
                        Watch interactive video lessons
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Volume2 className="h-4 w-4" />
                        Listen to audio-only podcasts
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Mic className="h-4 w-4" />
                        Voice conversation with AI tutor
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioOverview;
