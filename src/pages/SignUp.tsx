
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import { ArrowLeft, UserPlus, User, Mail, Lock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedContainer from '@/components/AnimatedContainer';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import SubscriptionNotification from '@/components/SubscriptionNotification';

const SignUp = () => {
  const navigate = useNavigate();
  const { signUp, user } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
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
      await signUp(email, password, firstName, lastName);
      setShowSubscription(true);
    } catch (error) {
      console.error('Error during sign up:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubscriptionClose = () => {
    setShowSubscription(false);
    navigate('/home');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-6">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Link>
      </div>
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in">
          <div className="text-center mb-8">
            <Logo className="mx-auto mb-6" size="lg" />
            <h1 className="text-2xl font-bold mb-2">Join StudyBuddy</h1>
            <p className="text-muted-foreground">Create your account and start learning today</p>
          </div>
          
          <AnimatedContainer className="bg-card p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="first-name" className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    First Name
                  </label>
                  <Input
                    id="first-name"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="last-name" className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Last Name
                  </label>
                  <Input
                    id="last-name"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  id="terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-blue-500 focus:ring-blue-500/30"
                  required
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  I agree to the{' '}
                  <a href="#" className="text-blue-500 hover:underline">
                    terms
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-blue-500 hover:underline">
                    privacy policy
                  </a>
                </label>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600"
                disabled={isLoading || !termsAccepted}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Creating account...
                  </span>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Account
                  </>
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                Already have an account?{' '}
                <Link to="/sign-in" className="text-blue-500 hover:underline">
                  Sign in
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

export default SignUp;
