
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AnimatedForm } from '@/components/ui/modern-animated-sign-in';
import { toast } from 'sonner';

const TeacherSignIn = () => {
  const navigate = useNavigate();
  const { user, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (user) {
      navigate('/teacher-dashboard');
    }
  }, [user, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      if (!error) {
        toast.success('Sign in successful! Welcome back.');
        navigate('/teacher-dashboard');
      } else {
        if (error.includes('Invalid login credentials')) {
          toast.error('Invalid email or password. Please try again.');
        } else if (error.includes('Email not confirmed')) {
          toast.error('Please check your email and confirm your account before signing in.');
        } else {
          toast.error(error);
        }
      }
    } catch (error) {
      console.error('Error during teacher sign in:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const goToTeacherSignUp = () => {
    navigate('/teacher-sign-up');
  };

  const formFields = {
    header: 'Teacher Sign In',
    subHeader: 'Sign in to your teacher account to manage courses',
    fields: [
      {
        label: 'email',
        required: true,
        type: 'email' as const,
        placeholder: 'Enter your email',
        onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
          setEmail(event.target.value),
      },
      {
        label: 'password',
        required: true,
        type: 'password' as const,
        placeholder: 'Enter your password',
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
            goTo={goToTeacherSignUp}
            isLoading={isLoading}
            googleLogin='Sign in with Google'
          />
          
          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Don't have a teacher account?{' '}
              <button onClick={goToTeacherSignUp} className="text-blue-500 hover:underline">
                Sign up as teacher
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherSignIn;
