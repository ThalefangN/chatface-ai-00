
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import { ArrowLeft, Mail, CheckCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedContainer from '@/components/AnimatedContainer';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Check if user exists
      const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
      const userExists = userData?.users?.some(user => user.email === email);
      
      if (!userExists) {
        toast.error('No account found with this email address');
        return;
      }

      // Send OTP via edge function
      const { error } = await supabase.functions.invoke('send-reset-otp', {
        body: { email }
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('OTP sent successfully! Check your email.');
      navigate(`/otp-confirmation?email=${encodeURIComponent(email)}`);
    } catch (error: any) {
      console.error('Error during password reset:', error);
      toast.error('Failed to send reset instructions. Please try again.');
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
            <p className="text-muted-foreground">We'll send you an OTP code to reset your password</p>
          </div>
          
          <AnimatedContainer className="bg-card p-6">
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
