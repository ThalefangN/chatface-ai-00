
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import SubscriptionNotification from '@/components/SubscriptionNotification';
import { AnimatedForm, Ripple, TechOrbitDisplay } from '@/components/ui/modern-animated-sign-in';
import { BookOpen, Award, Users, MicIcon, FileText, Brain } from 'lucide-react';

const SignIn = () => {
  const navigate = useNavigate();
  const { signIn, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  
  useEffect(() => {
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
        placeholder: 'Enter your email address',
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

  const iconsArray = [
    {
      component: () => <BookOpen className="h-6 w-6 text-blue-500" />,
      className: 'size-[30px] border-none bg-transparent',
      duration: 20,
      delay: 20,
      radius: 100,
      path: false,
      reverse: false,
    },
    {
      component: () => <MicIcon className="h-6 w-6 text-green-500" />,
      className: 'size-[30px] border-none bg-transparent',
      duration: 20,
      delay: 10,
      radius: 100,
      path: false,
      reverse: false,
    },
    {
      component: () => <Award className="h-8 w-8 text-yellow-500" />,
      className: 'size-[50px] border-none bg-transparent',
      radius: 210,
      duration: 20,
      path: false,
      reverse: false,
    },
    {
      component: () => <Users className="h-8 w-8 text-purple-500" />,
      className: 'size-[50px] border-none bg-transparent',
      radius: 210,
      duration: 20,
      delay: 20,
      path: false,
      reverse: false,
    },
    {
      component: () => <FileText className="h-6 w-6 text-indigo-500" />,
      className: 'size-[30px] border-none bg-transparent',
      duration: 20,
      delay: 20,
      radius: 150,
      path: false,
      reverse: true,
    },
    {
      component: () => <Brain className="h-6 w-6 text-pink-500" />,
      className: 'size-[30px] border-none bg-transparent',
      duration: 20,
      delay: 10,
      radius: 150,
      path: false,
      reverse: true,
    },
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-6">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Link>
      </div>
      
      <main className="flex-1 flex max-lg:justify-center">
        {/* Left Side - Animation */}
        <div className='flex flex-col justify-center w-1/2 max-lg:hidden relative'>
          <Ripple mainCircleSize={100} />
          <TechOrbitDisplay iconsArray={iconsArray} text="StudyBuddy" />
        </div>

        {/* Right Side - Form */}
        <div className='w-1/2 h-[100dvh] flex flex-col justify-center items-center max-lg:w-full max-lg:px-[10%]'>
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
      
      <SubscriptionNotification 
        open={showSubscription} 
        onClose={handleSubscriptionClose} 
      />
    </div>
  );
};

export default SignIn;
