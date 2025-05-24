
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/animated-sidebar";
import { LayoutDashboard, UserCog, Settings, LogOut, BookOpen, MessageSquare, Play, Pause, Volume2, SkipBack, SkipForward } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";

const AudioOverview = () => {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(45);
  const [duration] = useState(120);
  const [volume, setVolume] = useState([75]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
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
      href: "/settings",
      icon: (
        <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const episodes = [
    {
      title: "Introduction to Calculus",
      duration: "15:30",
      description: "Learn the fundamental concepts of calculus including limits and derivatives.",
      date: "2024-01-15"
    },
    {
      title: "Linear Algebra Basics",
      duration: "22:45",
      description: "Understanding vectors, matrices, and linear transformations.",
      date: "2024-01-12"
    },
    {
      title: "Statistics Fundamentals",
      duration: "18:20",
      description: "Exploring probability distributions and statistical inference.",
      date: "2024-01-10"
    }
  ];

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
        <div className="p-2 md:p-6 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-6 flex-1 w-full h-full overflow-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Play className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">StudyBuddy Podcast</h1>
          </div>

          {/* Current Episode Player */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Video/Thumbnail */}
                <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <div className="text-white text-center">
                    <Play className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-lg font-semibold">Mathematics Fundamentals</p>
                    <p className="text-sm opacity-90">Episode 1: Getting Started</p>
                  </div>
                </div>

                {/* Episode Info and Controls */}
                <div className="flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Introduction to Calculus</h2>
                    <p className="text-muted-foreground mb-4">
                      In this episode, we dive deep into the fundamental concepts of calculus, 
                      exploring limits, derivatives, and their real-world applications.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                      <span>Duration: 15:30</span>
                      <span>•</span>
                      <span>Published: Jan 15, 2024</span>
                    </div>
                  </div>

                  {/* Player Controls */}
                  <div className="space-y-4">
                    <Progress value={(currentTime / duration) * 100} className="w-full" />
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>

                    <div className="flex items-center justify-center gap-4">
                      <Button variant="ghost" size="sm">
                        <SkipBack className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="lg" 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="rounded-full w-12 h-12"
                      >
                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <SkipForward className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Volume Control */}
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4" />
                      <Slider
                        value={volume}
                        onValueChange={setVolume}
                        max={100}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-sm text-muted-foreground w-8">{volume[0]}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Episodes List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Episodes</CardTitle>
              <CardDescription>
                Catch up on the latest StudyBuddy podcast episodes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {episodes.map((episode, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{episode.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{episode.description}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span>{episode.duration}</span>
                        <span>•</span>
                        <span>{episode.date}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export const Logo = () => {
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

export default AudioOverview;
