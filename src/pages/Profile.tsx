
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, LogOut, Moon, Settings, User, Book, Bluetooth } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate('/');
    } catch (error) {
      toast.error("Failed to sign out");
      console.error("Sign out error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="px-4 py-5 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/home" className="mr-2">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-semibold">Profile</h1>
        </div>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center px-4 pt-8 pb-16">
        {/* Profile header */}
        <div className="w-full max-w-md flex flex-col items-center mb-8">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarImage 
              src={(user?.user_metadata?.avatar_url || "/lovable-uploads/4f570823-6f09-4aea-a965-7a2405cf6a14.png")} 
              alt="User avatar" 
            />
            <AvatarFallback className="text-2xl">
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          
          <h2 className="text-xl font-bold mb-1">
            {user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User"}
          </h2>
          <p className="text-gray-400 mb-4">{user?.email || "No email provided"}</p>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              Edit Profile
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              className="text-xs"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </div>
        </div>
        
        {/* Subscription info */}
        <div className="w-full max-w-md bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-lg p-4 mb-6 border border-blue-800/50">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Current Plan</h3>
            <span className="text-sm bg-blue-500 px-2 py-0.5 rounded">PRO</span>
          </div>
          <p className="text-sm text-gray-300 mt-1">Access to all advanced features and Botswana educational syllabus</p>
        </div>
        
        {/* Settings sections */}
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold mb-3">Study Mode</h3>
            <div className="bg-gray-900/70 rounded-lg border border-gray-800">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Book className="h-5 w-5 text-blue-400" />
                  <span>Botswana Educational Syllabus</span>
                </div>
                <div className="text-blue-400 text-sm">Active</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold mb-3">App Settings</h3>
            <div className="bg-gray-900/70 rounded-lg border border-gray-800 divide-y divide-gray-800">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Moon className="h-5 w-5 text-gray-400" />
                  <span>Dark Mode</span>
                </div>
                <div className="text-blue-400 text-sm">On</div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bluetooth className="h-5 w-5 text-gray-400" />
                  <span>Bluetooth</span>
                </div>
                <div className="text-gray-400 text-sm">Off</div>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <Button 
              variant="outline" 
              className="w-full border-red-900/50 hover:bg-red-900/20 hover:text-red-400 text-red-500"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
