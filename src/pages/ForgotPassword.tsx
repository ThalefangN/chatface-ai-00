
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import { ArrowLeft, Mail, CheckCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedContainer from '@/components/AnimatedContainer';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await resetPassword(email);
      setSubmitted(true);
    } catch (error) {
      console.error('Error during password reset:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-6">
        <Link to="/sign-in" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to sign in
        </Link>
      </div>
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in">
          <div className="text-center mb-8">
            <Logo className="mx-auto mb-6" size="lg" />
            <h1 className="text-2xl font-bold mb-2">Reset Your Password</h1>
            <p className="text-muted-foreground">We'll send you instructions to reset your password</p>
          </div>
          
          <AnimatedContainer className="bg-card p-6">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Email Address
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
                
                <Button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      Sending...
                    </span>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Reset Instructions
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Check Your Email</h3>
                <p className="text-muted-foreground mb-4">
                  We've sent instructions to:
                  <span className="block font-medium text-foreground mt-1">{email}</span>
                </p>
                
                <div className="space-y-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setSubmitted(false)}
                    className="w-full"
                  >
                    Try a different email
                  </Button>
                  
                  <p className="text-sm text-muted-foreground">
                    Didn't receive the email? Check your spam folder or{' '}
                    <button 
                      onClick={handleSubmit}
                      className="text-green-500 hover:underline"
                      disabled={isLoading}
                    >
                      click here to resend
                    </button>
                  </p>
                </div>
              </div>
            )}
            
            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                Remember your password?{' '}
                <Link to="/sign-in" className="text-green-500 hover:underline">
                  Back to sign in
                </Link>
              </p>
            </div>
          </AnimatedContainer>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
