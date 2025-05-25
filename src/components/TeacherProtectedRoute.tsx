
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useTeacherAuth } from '@/contexts/TeacherAuthContext';

interface TeacherProtectedRouteProps {
  children: React.ReactNode;
}

const TeacherProtectedRoute: React.FC<TeacherProtectedRouteProps> = ({ children }) => {
  const { user, teacherProfile, loading } = useTeacherAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  if (!user || !teacherProfile) {
    return <Navigate to="/teacher-sign-in" />;
  }
  
  return <>{children}</>;
};

export default TeacherProtectedRoute;
