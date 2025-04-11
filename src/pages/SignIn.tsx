
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import { ArrowLeft, LogIn, Mail, Lock, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedContainer from '@/components/AnimatedContainer';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import SubscriptionNotification from '@/components/SubscriptionNotification';

const SignIn = () => {
  const navigate = useNavigate();
  const { signIn, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  
  useEffect(() => {
    // Redirect if user is already logged in
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      setShowSubscription(true);
    } catch (error) {
      console.error('Error during sign in:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubscriptionClose = () => {
    setShowSubscription(false);
    navigate('/home');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="container mx-auto px-4 py-6">
        <Link to="/" className="inline-flex items-center text-sm text-blue-500 hover:text-blue-700">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Link>
      </div>
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in">
          <div className="text-center mb-8">
            <Logo className="mx-auto mb-6" size="lg" />
            <h1 className="text-2xl font-bold mb-2 text-blue-900">Welcome Back to StudyBuddy</h1>
            <p className="text-blue-700">Sign in to continue your learning journey</p>
          </div>
          
          <AnimatedContainer className="bg-white p-6 border border-blue-100 rounded-xl shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium flex items-center gap-2 text-blue-900">
                  <Mail className="h-4 w-4 text-blue-500" />
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium flex items-center gap-2 text-blue-900">
                    <Lock className="h-4 w-4 text-blue-500" />
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Signing in...
                  </span>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm">
              <p className="text-blue-700">
                Don't have an account?{' '}
                <Link to="/sign-up" className="text-blue-500 hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </AnimatedContainer>
        </div>
      </main>
      
      <SubscriptionNotification 
        open={showSubscription} 
        onClose={handleSubscriptionClose} 
      />
    </div>
  );
};

export default SignIn;
