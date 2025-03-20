
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import SubscriptionNotification from './SubscriptionNotification';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const [showSubscription, setShowSubscription] = useState(false);
  
  // Check if this is the first time the user is logging in
  useEffect(() => {
    if (user && !loading) {
      // Check if we've already shown the subscription dialog
      const hasShownSubscription = localStorage.getItem('hasShownSubscription');
      if (!hasShownSubscription) {
        setShowSubscription(true);
        localStorage.setItem('hasShownSubscription', 'true');
      }
    }
  }, [user, loading]);
  
  const handleSubscriptionClose = () => {
    setShowSubscription(false);
  };
  
  if (loading) {
    // You could return a loading spinner here
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/sign-in" />;
  }
  
  return (
    <>
      {children}
      {user && (
        <SubscriptionNotification 
          open={showSubscription} 
          onClose={handleSubscriptionClose} 
        />
      )}
    </>
  );
};

export default ProtectedRoute;
