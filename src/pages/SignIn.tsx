
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AnimatedForm } from '@/components/ui/modern-animated-sign-in';

const SignIn = () => {
  const navigate = useNavigate();
  const { user, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      if (!error) {
        navigate('/dashboard');
      } else {
        console.error('Sign in error:', error);
      }
    } catch (error) {
      console.error('Error during sign in:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const goToSignUp = () => {
    navigate('/sign-up');
  };

  const goToForgotPassword = () => {
    navigate('/forgot-password');
  };

  const formFields = {
    header: 'Welcome Back, Student',
    subHeader: 'Sign in to continue your learning journey with StudyBuddy',
    fields: [
      {
        label: 'email',
        required: true,
        type: 'email' as const,
        placeholder: 'Enter any email (test@example.com)',
        onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
          setEmail(event.target.value),
      },
      {
        label: 'password',
        required: true,
        type: 'password' as const,
        placeholder: 'Enter any password (testing123)',
        onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
          setPassword(event.target.value),
      },
    ],
    submitButton: 'Sign In',
    textVariantButton: 'Forgot password?',
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-6">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Link>
      </div>
      
      <main className="flex-1 flex justify-center items-center">
        <div className='w-full max-w-md px-4'>
          <AnimatedForm
            {...formFields}
            fieldPerRow={1}
            onSubmit={handleSubmit}
            goTo={goToForgotPassword}
            isLoading={isLoading}
            googleLogin='Sign in with Google'
          />
          
          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Don't have an account?{' '}
              <button onClick={goToSignUp} className="text-blue-500 hover:underline">
                Sign up
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignIn;
