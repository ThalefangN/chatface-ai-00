
import React, { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import MobileNavigation from '@/components/MobileNavigation';
import { Bell, Info, CheckCircle, AlertTriangle, Calendar, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { format, formatDistanceToNow } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface UserAlert {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  icon?: string;
}

const Alerts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<UserAlert[]>([]);

  useEffect(() => {
    if (user) {
      fetchUserAlerts();
      
      // Set up real-time subscription for alerts
      const alertsChannel = supabase
        .channel('alerts_changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'user_alerts',
            filter: `user_id=eq.${user.id}`
          }, 
          (payload) => {
            console.log('Alert changed:', payload);
            fetchUserAlerts();
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(alertsChannel);
      };
    }
  }, [user]);
  
  const fetchUserAlerts = async () => {
    try {
      setLoading(true);
      
      // Create a sample alert if none exist
      const { count, error: countError } = await supabase
        .from('user_alerts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);
        
      if (countError) throw countError;
      
      if (count === 0) {
        // Insert sample alerts for new users
        const sampleAlerts = [
          {
            user_id: user?.id,
            type: 'reminder',
            title: 'Practice session scheduled',
            message: 'You have a Job Interview practice session scheduled for tomorrow at 10:00 AM.',
            icon: 'Calendar',
            is_read: false
          },
          {
            user_id: user?.id,
            type: 'info',
            title: 'New feature available',
            message: 'We\'ve added new interview scenarios. Try them out in your next practice session!',
            icon: 'Info',
            is_read: false
          },
          {
            user_id: user?.id,
            type: 'success',
            title: 'Session completed',
            message: 'Your presentation practice has been analyzed. View your feedback report.',
            icon: 'CheckCircle',
            is_read: true
          },
          {
            user_id: user?.id,
            type: 'warning',
            title: 'Missing practice',
            message: 'You haven\'t practiced public speaking this week. Consider scheduling a session.',
            icon: 'AlertTriangle',
            is_read: true
          }
        ];
        
        await supabase.from('user_alerts').insert(sampleAlerts);
      }
      
      // Fetch all alerts
      const { data, error } = await supabase
        .from('user_alerts')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (data) {
        setAlerts(data);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast({
        title: "Failed to load alerts",
        description: "Could not retrieve your notification alerts.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const markAsRead = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('user_alerts')
        .update({ is_read: true })
        .eq('id', alertId);
        
      if (error) throw error;
      
      // Update local state
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? { ...alert, is_read: true } : alert
      ));
      
      toast({
        title: "Alert marked as read",
        description: "The notification has been marked as read."
      });
    } catch (error) {
      console.error('Error marking alert as read:', error);
      toast({
        title: "Action failed",
        description: "Could not mark notification as read.",
        variant: "destructive"
      });
    }
  };
  
  const deleteAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('user_alerts')
        .delete()
        .eq('id', alertId);
        
      if (error) throw error;
      
      // Update local state
      setAlerts(alerts.filter(alert => alert.id !== alertId));
      
      toast({
        title: "Alert deleted",
        description: "The notification has been removed."
      });
    } catch (error) {
      console.error('Error deleting alert:', error);
      toast({
        title: "Action failed",
        description: "Could not delete notification.",
        variant: "destructive"
      });
    }
  };
  
  const getAlertIcon = (type: string, iconName?: string) => {
    switch (iconName || type) {
      case 'Calendar':
        return <Calendar className="h-4 w-4" />;
      case 'Info':
        return <Info className="h-4 w-4" />;
      case 'CheckCircle':
        return <CheckCircle className="h-4 w-4" />;
      case 'AlertTriangle':
        return <AlertTriangle className="h-4 w-4" />;
      case 'MessageSquare':
        return <MessageSquare className="h-4 w-4" />;
      case 'reminder':
        return <Calendar className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };
  
  const getAlertColorClass = (type: string) => {
    switch (type) {
      case 'reminder':
        return 'bg-blue-500/10 text-blue-500';
      case 'info':
        return 'bg-purple-500/10 text-purple-500';
      case 'success':
        return 'bg-green-500/10 text-green-500';
      case 'warning':
        return 'bg-orange-500/10 text-orange-500';
      default:
        return 'bg-primary/10 text-primary';
    }
  };
  
  if (loading && alerts.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 container mx-auto px-4 py-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </main>
        <MobileNavigation />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-6 pb-24 md:pb-6">
        <div className="flex items-center mb-6">
          <Bell className="mr-2 h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>
        
        {alerts.length > 0 ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-muted-foreground">
                {alerts.filter(a => !a.is_read).length} unread notifications
              </div>
              <button 
                className="text-sm text-primary hover:underline"
                onClick={() => {
                  // Mark all as read
                  Promise.all(
                    alerts
                      .filter(a => !a.is_read)
                      .map(a => markAsRead(a.id))
                  );
                }}
              >
                Mark all as read
              </button>
            </div>
            
            {alerts.map((alert) => (
              <div 
                key={alert.id}
                className={`p-4 rounded-lg border ${alert.is_read ? 'bg-card border-border' : 'bg-primary/5 border-primary/20'} transition-colors animate-fade-in`}
              >
                <div className="flex items-start">
                  <div className={`p-2 rounded-full mr-3 ${getAlertColorClass(alert.type)}`}>
                    {getAlertIcon(alert.type, alert.icon)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{alert.title}</h3>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    
                    <p className="mt-1 text-sm text-muted-foreground">
                      {alert.message}
                    </p>
                    
                    <div className="mt-3 flex justify-end space-x-2">
                      {!alert.is_read && (
                        <button 
                          onClick={() => markAsRead(alert.id)}
                          className="text-xs bg-card border border-border px-3 py-1 rounded hover:bg-muted transition-colors"
                        >
                          Mark as read
                        </button>
                      )}
                      <button 
                        onClick={() => deleteAlert(alert.id)}
                        className="text-xs text-destructive bg-destructive/10 px-3 py-1 rounded hover:bg-destructive/20 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Alert>
            <AlertTitle>No notifications</AlertTitle>
            <AlertDescription>
              You don't have any notifications at the moment. We'll notify you when there's something important.
            </AlertDescription>
          </Alert>
        )}
      </main>
      
      <MobileNavigation />
    </div>
  );
};

export default Alerts;
