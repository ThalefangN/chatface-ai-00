
import React, { useState } from 'react';
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/animated-sidebar";
import { LayoutDashboard, UserCog, Settings, LogOut, BookOpen, MessageSquare, Upload, Share2, Users, Shield, Heart, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const StudentCommunity = () => {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [newPost, setNewPost] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Mock data for demonstration
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Sarah K.',
      avatar: '/lovable-uploads/4f570823-6f09-4aea-a965-7a2405cf6a14.png',
      content: 'Just uploaded my English Literature notes on Shakespeare! Hope it helps everyone preparing for exams 📚',
      type: 'material',
      subject: 'English Literature',
      likes: 15,
      comments: 3,
      timestamp: '2 hours ago',
      file: 'shakespeare_notes.pdf'
    },
    {
      id: 2,
      author: 'Mike T.',
      avatar: '/lovable-uploads/4f570823-6f09-4aea-a965-7a2405cf6a14.png',
      content: 'Anyone else struggling with calculus derivatives? Could use some help! 🤔',
      type: 'question',
      subject: 'Mathematics',
      likes: 8,
      comments: 12,
      timestamp: '4 hours ago'
    },
    {
      id: 3,
      author: 'Emma L.',
      avatar: '/lovable-uploads/4f570823-6f09-4aea-a965-7a2405cf6a14.png',
      content: 'Chemistry lab report template available! Covers all the essential sections needed for BGCSE.',
      type: 'material',
      subject: 'Chemistry',
      likes: 22,
      comments: 7,
      timestamp: '1 day ago',
      file: 'chemistry_lab_template.docx'
    }
  ]);

  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      author: 'John D.',
      avatar: '/lovable-uploads/4f570823-6f09-4aea-a965-7a2405cf6a14.png',
      message: 'Good morning everyone! Ready for another day of learning? 🌅',
      timestamp: '9:00 AM'
    },
    {
      id: 2,
      author: 'Lisa M.',
      avatar: '/lovable-uploads/4f570823-6f09-4aea-a965-7a2405cf6a14.png',
      message: 'Has anyone started studying for the upcoming physics exam?',
      timestamp: '9:15 AM'
    }
  ]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handlePostSubmit = () => {
    if (!newPost.trim()) return;

    const post = {
      id: posts.length + 1,
      author: user?.user_metadata?.first_name + ' ' + user?.user_metadata?.last_name || 'You',
      avatar: user?.user_metadata?.avatar_url || '/lovable-uploads/4f570823-6f09-4aea-a965-7a2405cf6a14.png',
      content: newPost,
      type: selectedFile ? 'material' : 'question',
      subject: 'General',
      likes: 0,
      comments: 0,
      timestamp: 'Just now',
      file: selectedFile?.name
    };

    setPosts([post, ...posts]);
    setNewPost('');
    setSelectedFile(null);
    toast.success('Post shared with the community!');
  };

  const handleChatSubmit = () => {
    if (!message.trim()) return;

    const chatMessage = {
      id: chatMessages.length + 1,
      author: user?.user_metadata?.first_name + ' ' + user?.user_metadata?.last_name || 'You',
      avatar: user?.user_metadata?.avatar_url || '/lovable-uploads/4f570823-6f09-4aea-a965-7a2405cf6a14.png',
      message: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages([...chatMessages, chatMessage]);
    setMessage('');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast.success('File selected for upload!');
    }
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
      label: "AI Chat",
      href: "/ai-chat",
      icon: (
        <MessageSquare className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Community",
      href: "/student-community",
      icon: (
        <Users className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "/profile",
      icon: (
        <UserCog className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
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

  const LogoIcon = () => {
    return (
      <Link
        to="/dashboard"
        className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
      >
        <div className="h-5 w-6 bg-blue-500 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      </Link>
    );
  };

  return (
    <div className={cn(
      "flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
      "h-screen"
    )}>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
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

      <div className="flex flex-1 w-full min-w-0">
        <div className="p-2 md:p-6 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full min-w-0 overflow-hidden">
          <div className="w-full h-full bg-white dark:bg-gray-900 flex flex-col min-w-0">
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-gray-700 p-6 flex-shrink-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Student Community
                </h1>
              </div>
              
              {/* Community Guidelines */}
              <Card className="mb-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200 text-lg">
                    <Shield className="w-5 h-5" />
                    Community Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-300">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      <span>Be respectful and kind to all members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Share2 className="w-4 h-4" />
                      <span>Share quality study materials only</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      <span>Keep discussions educational and appropriate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      <span>Help others and celebrate achievements</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-hidden">
              <Tabs defaultValue="posts" className="h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="posts">Study Materials & Posts</TabsTrigger>
                  <TabsTrigger value="chat">Community Chat</TabsTrigger>
                </TabsList>

                <TabsContent value="posts" className="flex-1 overflow-hidden">
                  <div className="h-full flex flex-col">
                    {/* Create Post Section */}
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle className="text-lg">Share with the Community</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <Textarea
                            placeholder="Share study materials, ask questions, or start a discussion..."
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            className="min-h-[100px]"
                          />
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <label className="flex items-center gap-2 cursor-pointer text-sm text-blue-600 hover:text-blue-700">
                                <Upload className="w-4 h-4" />
                                Upload File
                                <input
                                  type="file"
                                  className="hidden"
                                  onChange={handleFileUpload}
                                  accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
                                />
                              </label>
                              {selectedFile && (
                                <Badge variant="outline">
                                  {selectedFile.name}
                                </Badge>
                              )}
                            </div>
                            <Button onClick={handlePostSubmit} disabled={!newPost.trim()}>
                              Share Post
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Posts Feed */}
                    <div className="flex-1 overflow-auto space-y-4">
                      {posts.map((post) => (
                        <Card key={post.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={post.avatar} alt={post.author} />
                                <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-semibold">{post.author}</h4>
                                  <Badge variant={post.type === 'material' ? 'default' : 'secondary'}>
                                    {post.subject}
                                  </Badge>
                                  <span className="text-sm text-gray-500">{post.timestamp}</span>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 mb-3">{post.content}</p>
                                {post.file && (
                                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mb-3">
                                    <div className="flex items-center gap-2">
                                      <BookOpen className="w-4 h-4 text-blue-500" />
                                      <span className="text-sm font-medium">{post.file}</span>
                                      <Button size="sm" variant="outline" className="ml-auto">
                                        Download
                                      </Button>
                                    </div>
                                  </div>
                                )}
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                                    <Heart className="w-4 h-4" />
                                    {post.likes}
                                  </button>
                                  <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                                    <MessageSquare className="w-4 h-4" />
                                    {post.comments}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="chat" className="flex-1 overflow-hidden">
                  <div className="h-full flex flex-col">
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                      <div className="space-y-4">
                        {chatMessages.map((msg) => (
                          <div key={msg.id} className="flex items-start gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={msg.avatar} alt={msg.author} />
                              <AvatarFallback>{msg.author.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm">{msg.author}</span>
                                <span className="text-xs text-gray-500">{msg.timestamp}</span>
                              </div>
                              <p className="text-sm text-gray-700 dark:text-gray-300">{msg.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Chat Input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      <Button onClick={handleChatSubmit} disabled={!message.trim()}>
                        Send
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCommunity;
