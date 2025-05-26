
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Logo from '@/components/Logo';
import { ArrowLeft, Mail, CheckCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedContainer from '@/components/AnimatedContainer';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const OTPConfirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
      return;
    }
    
    // Start 60 second countdown for resend
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  const verifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter a complete 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    
    try {
      // Call the verify-otp edge function
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { email, otp }
      });

      if (error || !data?.valid) {
        toast.error('Invalid or expired OTP. Please try again.');
        return;
      }

      toast.success('OTP verified successfully!');
      navigate(`/reset-password?email=${encodeURIComponent(email)}&token=${data.token}`);
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error('An error occurred while verifying OTP');
    } finally {
      setIsVerifying(false);
    }
  };

  const resendOTP = async () => {
    setIsResending(true);
    
    try {
      const { error } = await supabase.functions.invoke('send-reset-otp', {
        body: { email }
      });

      if (error) throw error;

      toast.success('New OTP sent to your email!');
      setOtp('');
      setCountdown(60);
      
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Error resending OTP:', error);
      toast.error('Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-6">
        <Link to="/forgot-password" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to password reset
        </Link>
      </div>
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in">
          <div className="text-center mb-8">
            <Logo className="mx-auto mb-6" size="lg" />
            <h1 className="text-2xl font-bold mb-2">Enter OTP Code</h1>
            <p className="text-muted-foreground">We've sent a 6-digit code to your email</p>
            <p className="text-sm font-medium text-foreground mt-1">{email}</p>
          </div>
          
          <AnimatedContainer className="bg-card p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center justify-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Enter 6-digit OTP
                </label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>
              
              <Button
                onClick={verifyOTP}
                className="w-full bg-green-500 hover:bg-green-600"
                disabled={isVerifying || otp.length !== 6}
              >
                {isVerifying ? (
                  <span className="flex items-center">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Verifying...
                  </span>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Verify OTP
                  </>
                )}
              </Button>

              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the code?
                </p>
                
                {countdown > 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Resend available in {countdown} seconds
                  </p>
                ) : (
                  <Button
                    variant="outline"
                    onClick={resendOTP}
                    disabled={isResending}
                    className="w-full"
                  >
                    {isResending ? (
                      <span className="flex items-center">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></span>
                        Sending...
                      </span>
                    ) : (
                      <>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Resend OTP
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </AnimatedContainer>
        </div>
      </main>
    </div>
  );
};

export default OTPConfirmation;
