
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AnimatedForm } from '@/components/ui/modern-animated-sign-in';
import { toast } from 'sonner';

const TeacherSignUp = () => {
  const navigate = useNavigate();
  const { user, signUp } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [specialization, setSpecialization] = useState('');
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
      const { error } = await signUp(email, password, firstName, lastName, 'teacher', specialization);
      if (!error) {
        toast.success('Teacher account created successfully! Please check your email to verify your account.');
      } else {
        if (error.includes('User already registered')) {
          toast.error('An account with this email already exists. Please try a different email or sign in instead.');
        } else if (error.includes('Password should be at least 6 characters')) {
          toast.error('Password should be at least 6 characters long.');
        } else if (error.includes('Invalid email')) {
          toast.error('Please enter a valid email address.');
        } else {
          toast.error(error);
        }
      }
    } catch (error) {
      console.error('Error during teacher sign up:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const goToTeacherSignIn = () => {
    navigate('/teacher-sign-in');
  };

  const formFields = {
    header: 'Join as a Teacher',
    subHeader: 'Create your teacher account and start creating courses',
    fields: [
      {
        label: 'firstName',
        required: true,
        type: 'text' as const,
        placeholder: 'Enter your first name',
        onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
          setFirstName(event.target.value),
      },
      {
        label: 'lastName',
        required: true,
        type: 'text' as const,
        placeholder: 'Enter your last name',
        onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
          setLastName(event.target.value),
      },
      {
        label: 'email',
        required: true,
        type: 'email' as const,
        placeholder: 'Enter your email',
        onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
          setEmail(event.target.value),
      },
      {
        label: 'specialization',
        required: true,
        type: 'text' as const,
        placeholder: 'e.g., Mathematics, English, Science',
        onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
          setSpecialization(event.target.value),
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
    submitButton: 'Create Teacher Account',
    textVariantButton: 'Already have a teacher account? Sign in',
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
            fieldPerRow={2}
            onSubmit={handleSubmit}
            goTo={goToTeacherSignIn}
            isLoading={isLoading}
            googleLogin='Sign up with Google'
          />
          
          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Want to join as a student?{' '}
              <Link to="/sign-up" className="text-blue-500 hover:underline">
                Student Sign Up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherSignUp;
