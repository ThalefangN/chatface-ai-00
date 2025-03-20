
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import { ArrowLeft, Mail, CheckCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedContainer from '@/components/AnimatedContainer';
import { useToast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you would handle password reset request here
    toast({
      title: "Reset link sent",
      description: "Check your email for password reset instructions",
    });
    
    setSubmitted(true);
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
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-colors"
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send Reset Instructions
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
