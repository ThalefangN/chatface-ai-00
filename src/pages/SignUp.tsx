
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
            <h1 className="text-2xl font-bold mb-2 text-blue-900">Join StudyBuddy</h1>
            <p className="text-blue-700">Create your account to start learning with AI</p>
          </div>
          
          <AnimatedContainer className="bg-white p-6 border border-blue-100 rounded-xl shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="first-name" className="text-sm font-medium flex items-center gap-2 text-blue-900">
                    <User className="h-4 w-4 text-blue-500" />
                    First Name
                  </label>
                  <Input
                    id="first-name"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    required
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="last-name" className="text-sm font-medium flex items-center gap-2 text-blue-900">
                    <User className="h-4 w-4 text-blue-500" />
                    Last Name
                  </label>
                  <Input
                    id="last-name"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    required
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              
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
                <label htmlFor="password" className="text-sm font-medium flex items-center gap-2 text-blue-900">
                  <Lock className="h-4 w-4 text-blue-500" />
                  Password
                </label>
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
              
              <div className="flex items-center space-x-2">
                <input
                  id="terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="h-4 w-4 rounded border-blue-300 text-blue-500 focus:ring-blue-500"
                  required
                />
                <label htmlFor="terms" className="text-sm text-blue-700 flex items-center gap-1">
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
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
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
              <p className="text-blue-700">
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
