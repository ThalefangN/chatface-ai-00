
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { TeacherAuthProvider } from "./contexts/TeacherAuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import OTPConfirmation from "./pages/OTPConfirmation";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import LearningSession from "./pages/LearningSession";
import AiChat from "./pages/AiChat";
import Chat from "./pages/Chat";
import Notes from "./pages/Notes";
import Alerts from "./pages/Alerts";
import Profile from "./pages/Profile";
import AudioOverview from "./pages/AudioOverview";
import Courses from "./pages/Courses";
import EnglishLiterature from "./pages/EnglishLiterature";
import SetswanaLanguage from "./pages/SetswanaLanguage";
import SocialStudies from "./pages/SocialStudies";
import TeacherSignUp from "./pages/TeacherSignUp";
import TeacherSignIn from "./pages/TeacherSignIn";
import TeacherDashboard from "./pages/TeacherDashboard";
import CreateCourse from "./pages/CreateCourse";
import ManageCourse from "./pages/ManageCourse";
import AddContent from "./pages/AddContent";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import TeacherProtectedRoute from "./components/TeacherProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <TeacherAuthProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/otp-confirmation" element={<OTPConfirmation />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/teacher-sign-up" element={<TeacherSignUp />} />
                <Route path="/teacher-sign-in" element={<TeacherSignIn />} />
                <Route path="/teacher-dashboard" element={<TeacherProtectedRoute><TeacherDashboard /></TeacherProtectedRoute>} />
                <Route path="/teacher/create-course" element={<TeacherProtectedRoute><CreateCourse /></TeacherProtectedRoute>} />
                <Route path="/teacher/manage-course/:courseId" element={<TeacherProtectedRoute><ManageCourse /></TeacherProtectedRoute>} />
                <Route path="/teacher/add-content/:courseId" element={<TeacherProtectedRoute><AddContent /></TeacherProtectedRoute>} />
                <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/learning/:subject" element={<ProtectedRoute><LearningSession /></ProtectedRoute>} />
                <Route path="/ai-chat" element={<ProtectedRoute><AiChat /></ProtectedRoute>} />
                <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
                <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
                <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/audio-overview" element={<ProtectedRoute><AudioOverview /></ProtectedRoute>} />
                <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
                <Route path="/courses/english-literature" element={<ProtectedRoute><EnglishLiterature /></ProtectedRoute>} />
                <Route path="/courses/setswana-language" element={<ProtectedRoute><SetswanaLanguage /></ProtectedRoute>} />
                <Route path="/courses/social-studies" element={<ProtectedRoute><SocialStudies /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TeacherAuthProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
