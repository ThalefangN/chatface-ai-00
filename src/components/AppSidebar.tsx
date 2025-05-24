
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, UserCog, Settings, LogOut, BookOpen, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';

const AppSidebar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const menuItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Study Materials",
      url: "/notes",
      icon: BookOpen,
    },
    {
      title: "Study Chat",
      url: "/ai-chat",
      icon: MessageSquare,
    },
    {
      title: "Profile",
      url: "/profile",
      icon: UserCog,
    },
    {
      title: "Settings",
      url: "/profile",
      icon: Settings,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link
          to="/dashboard"
          className="font-normal flex space-x-2 items-center text-sm text-black py-1"
        >
          <div className="h-5 w-6 bg-blue-500 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
          <span className="font-medium text-black dark:text-white whitespace-pre">
            StudyBuddy
          </span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/profile" className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage 
                    src={user?.user_metadata?.avatar_url || "/lovable-uploads/4f570823-6f09-4aea-a965-7a2405cf6a14.png"} 
                    alt="User avatar" 
                  />
                  <AvatarFallback>
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{user?.email || "User"}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut} className="text-red-600 hover:text-red-700">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
