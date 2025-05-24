
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/animated-sidebar";
import { LayoutDashboard, UserCog, Settings, LogOut, Home, BookOpen, MessageSquare } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import LearningContent from "@/components/LearningContent";

const LearningSession = () => {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { subject } = useParams();

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
      href: "/profile",
      icon: (
        <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  const subjectMap = {
    'foundation': 'Mathematics Fundamentals: Core Concepts',
    'practice': 'Interactive Problem Solving: Practice Session',
    'review': 'Knowledge Review: Spaced Repetition',
    'assessment': 'Knowledge Assessment: Gap Analysis',
    'mastery': 'Advanced Mastery: Deep Learning'
  };

  const currentSubject = subjectMap[subject as keyof typeof subjectMap] || 'StudyBuddy Learning Session';

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
          <LearningContent subject={currentSubject} />
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

export default LearningSession;
