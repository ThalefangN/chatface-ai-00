
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/animated-sidebar";
import { LayoutDashboard, UserCog, Settings, LogOut, BookOpen, MessageSquare, Plus, Download, Play } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AddNoteDialog from "@/components/AddNoteDialog";
import { useToast } from "@/hooks/use-toast";

const Notes = () => {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleDownloadPDF = () => {
    toast({
      title: "Download Started",
      description: "Your study materials summary is being prepared for download.",
    });
    // Simulate PDF generation and download
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = '#'; // In a real app, this would be the PDF URL
      link.download = 'study-materials-summary.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1500);
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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-blue-500" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Study Materials</h1>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setIsAddNoteOpen(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Note
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/audio-overview')}
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                Audio Overview
              </Button>
            </div>
          </div>

          {/* Summary Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Summary</CardTitle>
                  <CardDescription>
                    Your summary will appear here after you summarize your notes.
                  </CardDescription>
                </div>
                <Button 
                  onClick={handleDownloadPDF}
                  variant="outline" 
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="p-6 bg-muted/50 rounded-lg text-center text-muted-foreground">
                <p>No summary available yet. Add some notes and generate a summary to see content here.</p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Notes</CardTitle>
              <CardDescription>
                Your latest study notes and materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: "Calculus Fundamentals", date: "2024-01-15", content: "Introduction to limits and derivatives..." },
                  { title: "Linear Algebra Basics", date: "2024-01-12", content: "Vectors and matrix operations..." },
                  { title: "Statistics Overview", date: "2024-01-10", content: "Probability distributions and inference..." }
                ].map((note, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{note.title}</h3>
                      <span className="text-sm text-muted-foreground">{note.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{note.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AddNoteDialog 
        isOpen={isAddNoteOpen} 
        onClose={() => setIsAddNoteOpen(false)} 
      />
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

export default Notes;
