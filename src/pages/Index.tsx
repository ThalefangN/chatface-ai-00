import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import { FeatureSteps } from '@/components/ui/feature-steps';
import { BentoGrid } from '@/components/ui/bento-grid';
import RadialOrbitalTimeline from '@/components/ui/radial-orbital-timeline';
import { PricingSection } from '@/components/ui/pricing-section';
import { ArrowRight, MicIcon, Users, BookOpen, Award, CheckCircle, TrendingUp, Video, Globe, Calendar, Code, FileText, User, Clock, Upload, Brain, Search, Shield, Lightbulb, FileCheck, MessageSquare, Target, Zap, GraduationCap, ChalkboardTeacher } from 'lucide-react';

const features = [
  { 
    step: 'Step 1', 
    title: 'Voice Interaction',
    content: 'Start by speaking naturally with your AI tutor about any subject you need help with.', 
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop' 
  },
  { 
    step: 'Step 2',
    title: 'Get Explanations',
    content: 'Receive clear, detailed explanations tailored to your learning level and pace.',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=2070&auto=format&fit=crop'
  },
  { 
    step: 'Step 3',
    title: 'Practice & Improve',
    content: 'Practice with interactive exercises and track your progress as you master new concepts.',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop'
  },
];

// How StudyBuddy Works Features - Updated layout to match Advanced Learning Features
const studyBuddyWorksFeatures = [
  {
    title: "Voice Interaction",
    meta: "Natural AI conversations",
    description: "Start by speaking naturally with your AI tutor about any subject you need help with",
    icon: <MicIcon className="w-4 h-4 text-blue-500" />,
    status: "Live",
    tags: ["Voice", "AI", "Tutor"],
    colSpan: 2,
    hasPersistentHover: true,
  },
  {
    title: "Get Explanations",
    meta: "Tailored learning",
    description: "Receive clear, detailed explanations tailored to your learning level and pace",
    icon: <MessageSquare className="w-4 h-4 text-emerald-500" />,
    status: "Active",
    tags: ["Explanations", "Personalized"],
    colSpan: 1,
  },
  {
    title: "Practice & Improve",
    meta: "Interactive exercises",
    description: "Practice with interactive exercises and track your progress as you master new concepts",
    icon: <Target className="w-4 h-4 text-purple-500" />,
    status: "Enhanced",
    tags: ["Practice", "Progress"],
    colSpan: 2,
  },
  {
    title: "Learning Progress Timeline",
    meta: "Structured path",
    description: "Experience a structured learning path designed to maximize your academic success with AI-powered guidance",
    icon: <Calendar className="w-4 h-4 text-orange-500" />,
    status: "Active",
    tags: ["Timeline", "Progress"],
    colSpan: 1,
  },
];

// How StudyBuddy Helps You Learn Features
const studyBuddyHelpsFeatures = [
  {
    title: "Voice Interaction",
    meta: "AI conversations",
    description: "Natural conversations with an AI tutor that explains concepts clearly",
    icon: <MicIcon className="w-4 h-4 text-blue-500" />,
    status: "Live",
    tags: ["Voice", "Tutor"],
    colSpan: 1,
  },
  {
    title: "Subject Expertise", 
    meta: "All subjects covered",
    description: "Get help with any subject from math and science to languages and humanities",
    icon: <BookOpen className="w-4 h-4 text-emerald-500" />,
    status: "Active",
    tags: ["Math", "Science", "Languages"],
    colSpan: 1,
  },
  {
    title: "Personal Learning",
    meta: "Adaptive sessions",
    description: "Customized study sessions that adapt to your learning style and pace",
    icon: <Zap className="w-4 h-4 text-purple-500" />,
    status: "Enhanced",
    tags: ["Personalized", "Adaptive"],
    colSpan: 1,
  },
];

const studyFeatures = [
  {
    title: "Progress Tracking",
    meta: "Real-time",
    description: "Monitor your learning journey with detailed analytics and performance insights",
    icon: <TrendingUp className="w-4 h-4 text-blue-500" />,
    status: "Live",
    tags: ["Analytics", "Progress", "AI"],
    colSpan: 2,
    hasPersistentHover: true,
  },
  {
    title: "Interactive Exercises",
    meta: "500+ exercises",
    description: "Practice with quizzes, flashcards and hands-on activities tailored to your level",
    icon: <CheckCircle className="w-4 h-4 text-emerald-500" />,
    status: "Active",
    tags: ["Practice", "Quizzes"],
  },
  {
    title: "24/7 Availability",
    meta: "Always online",
    description: "Get help anytime, anywhere you need it with your AI study companion",
    icon: <Globe className="w-4 h-4 text-purple-500" />,
    tags: ["Support", "AI"],
    colSpan: 2,
  },
  {
    title: "Multi-Modal Learning",
    meta: "Text + Voice",
    description: "Learn through text, voice conversations and visual content for better retention",
    icon: <Video className="w-4 h-4 text-sky-500" />,
    status: "Enhanced",
    tags: ["Voice", "Visual"],
  },
];

// Document Intelligence Features
const documentFeatures = [
  {
    title: "Document Upload",
    meta: "PDFs, Docs & More",
    description: "Upload your study materials, textbooks, and notes for AI-powered analysis and assistance",
    icon: <Upload className="w-4 h-4 text-blue-500" />,
    status: "Live",
    tags: ["PDF", "Upload", "AI"],
    colSpan: 1,
  },
  {
    title: "Smart Summaries",
    meta: "Auto-generated",
    description: "Get instant summaries, chapter overviews, and topic breakdowns from your documents",
    icon: <Brain className="w-4 h-4 text-blue-500" />,
    status: "Active",
    tags: ["Summary", "Overview"],
    colSpan: 2,
    hasPersistentHover: true,
  },
  {
    title: "Document Q&A",
    meta: "Ask anything",
    description: "Ask questions about specific chapters, topics, or concepts from your uploaded materials",
    icon: <Search className="w-4 h-4 text-blue-500" />,
    tags: ["Questions", "Search"],
    colSpan: 2,
  },
  {
    title: "Study Materials",
    meta: "Auto-created",
    description: "Generate flashcards, bullet points, timelines, and structured notes from your documents",
    icon: <Lightbulb className="w-4 h-4 text-blue-500" />,
    status: "Enhanced",
    tags: ["Flashcards", "Notes"],
    colSpan: 1,
  },
  {
    title: "Source Tracking",
    meta: "Always accurate",
    description: "Every answer references the specific document and page where information was found",
    icon: <FileCheck className="w-4 h-4 text-blue-500" />,
    tags: ["References", "Accuracy"],
    colSpan: 1,
  },
  {
    title: "Privacy Focused",
    meta: "Your data only",
    description: "AI responses are grounded strictly in your documents - no internet hallucinations",
    icon: <Shield className="w-4 h-4 text-blue-500" />,
    status: "Secure",
    tags: ["Privacy", "Secure"],
    colSpan: 2,
  },
];

// StudyBuddy learning progression timeline data
const studyProgressionData = [
  {
    id: 1,
    title: "Assessment",
    date: "Week 1",
    content: "AI evaluates your current knowledge level and learning style preferences to create a personalized study plan.",
    category: "Evaluation",
    icon: Calendar,
    relatedIds: [2],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "Foundation",
    date: "Week 2-3",
    content: "Build strong fundamentals with voice-guided lessons tailored to your syllabus requirements.",
    category: "Learning",
    icon: BookOpen,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 85,
  },
  {
    id: 3,
    title: "Practice",
    date: "Week 4-6",
    content: "Interactive exercises and quizzes with real-time AI feedback to reinforce your understanding.",
    category: "Application",
    icon: Code,
    relatedIds: [2, 4],
    status: "in-progress" as const,
    energy: 70,
  },
  {
    id: 4,
    title: "Review",
    date: "Week 7",
    content: "Comprehensive revision sessions focusing on areas that need improvement based on your progress.",
    category: "Revision",
    icon: FileText,
    relatedIds: [3, 5],
    status: "pending" as const,
    energy: 45,
  },
  {
    id: 5,
    title: "Mastery",
    date: "Week 8",
    content: "Final assessment and certification of your learning achievement with performance analytics.",
    category: "Achievement",
    icon: Award,
    relatedIds: [4],
    status: "pending" as const,
    energy: 20,
  },
];

// Pricing tiers for StudyBuddy
const PAYMENT_FREQUENCIES = ["monthly", "yearly"];

const TIERS = [
  {
    id: "free",
    name: "Free Starter",
    price: {
      monthly: "Free",
      yearly: "Free",
    },
    description: "Perfect for getting started",
    features: [
      "5 AI chat sessions per day",
      "Basic study materials",
      "Voice interaction (30 min/day)",
      "Document upload (3 docs)",
      "Email support",
    ],
    cta: "Get Started Free",
  },
  {
    id: "student",
    name: "Student",
    price: {
      monthly: 9,
      yearly: 7,
    },
    description: "Great for individual students",
    features: [
      "Unlimited AI chat sessions",
      "Advanced study materials",
      "Unlimited voice interaction",
      "Document upload (50 docs)",
      "Progress tracking",
      "Priority support",
    ],
    cta: "Start Learning",
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: {
      monthly: 19,
      yearly: 15,
    },
    description: "For serious learners",
    features: [
      "Everything in Student",
      "Personalized learning paths",
      "Advanced analytics",
      "Unlimited document storage",
      "Custom study schedules",
      "1-on-1 tutoring sessions",
    ],
    cta: "Go Premium",
    highlighted: true,
  },
  {
    id: "institution",
    name: "Institution",
    price: {
      monthly: "Custom",
      yearly: "Custom",
    },
    description: "For schools and organizations",
    features: [
      "Everything in Premium",
      "Multi-user management",
      "Custom integrations",
      "Advanced reporting",
      "Dedicated support",
      "API access",
    ],
    cta: "Contact Sales",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Logo size="lg" />
        </div>
        <div className="flex space-x-2">
          <Link 
            to="/sign-in" 
            className="text-xs sm:text-sm font-medium px-2 py-1.5 sm:px-4 sm:py-2 rounded-md border border-blue-500 text-blue-500 hover:bg-blue-50 transition-colors whitespace-nowrap"
          >
            Sign In
          </Link>
          <Link 
            to="/sign-up" 
            className="text-xs sm:text-sm font-medium px-2 py-1.5 sm:px-4 sm:py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors whitespace-nowrap"
          >
            Sign Up
          </Link>
        </div>
      </header>
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div className="space-y-6 max-w-xl">
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-blue-500/10 text-blue-500">
                <span className="animate-pulse-soft mr-1">●</span> 
                AI-Powered Study Assistant
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Study Smarter with Your AI Smart Companion
              </h1>
              
              <p className="text-lg text-muted-foreground">
                Practice, learn, and improve with StudyBuddy. Get real-time feedback, explanations, and study help through natural voice conversations.
              </p>
              
              <div className="pt-4 space-y-4">
                <Link 
                  to="/sign-up" 
                  className="group inline-flex items-center justify-center rounded-md bg-blue-500 px-6 py-3 text-white font-medium hover:bg-blue-600 transition-colors"
                >
                  Start Learning
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                {/* Become a Tutor Section */}
                <div className="border-t pt-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Users className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-green-600">Become a Tutor</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Share your knowledge and earn by creating courses for students worldwide.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Link 
                      to="/teacher-sign-up" 
                      className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm text-white font-medium hover:bg-green-700 transition-colors"
                    >
                      <GraduationCap className="mr-2 h-4 w-4" />
                      Become a Teacher
                    </Link>
                    <Link 
                      to="/teacher-sign-in" 
                      className="inline-flex items-center justify-center rounded-md border border-green-600 px-4 py-2 text-sm text-green-600 font-medium hover:bg-green-50 transition-colors"
                    >
                      Teacher Sign In
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 pt-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <div className="mr-1.5 h-4 w-4 text-blue-500">
                    <MicIcon className="h-4 w-4" />
                  </div>
                  Voice Assistant
                </div>
                <div className="flex items-center">
                  <div className="mr-1.5 h-4 w-4 text-blue-500">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  Study Materials
                </div>
                <div className="flex items-center">
                  <div className="mr-1.5 h-4 w-4 text-blue-500">
                    <Award className="h-4 w-4" />
                  </div>
                  Learning Coach
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-blue-500/40 rounded-2xl blur-xl animate-pulse-soft opacity-70"></div>
              <div className="relative bg-card rounded-2xl overflow-hidden border border-border shadow-xl">
                <div className="aspect-video bg-muted p-8 flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                    <Users className="h-7 w-7 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">AI Study Session</h3>
                  <p className="text-center text-muted-foreground">
                    Have natural voice conversations with your AI study assistant to learn any subject
                  </p>
                  <div className="mt-6 grid grid-cols-3 gap-3 w-full max-w-xs">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <div 
                        key={n} 
                        className={`h-1 rounded-full ${n % 2 === 0 ? 'bg-blue-500' : 'bg-muted-foreground/20'}`}
                      ></div>
                    ))}
                  </div>
                </div>
                <div className="p-6 bg-gradient-to-b from-card to-muted/30">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                        AI
                      </div>
                      <div className="flex-1 p-3 rounded-xl bg-muted/50">
                        <p className="text-sm">Can you explain the water cycle to me?</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 justify-end">
                      <div className="flex-1 p-3 rounded-xl bg-blue-500/10">
                        <p className="text-sm">The water cycle describes how water evaporates from the Earth's surface...</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                        <Users className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Study Progression Timeline Section */}
        <div className="w-full px-0">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Your Learning Journey</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Experience a structured learning path designed to maximize your academic success with AI-powered guidance
              </p>
            </div>
          </div>
          
          <div className="relative h-screen w-full rounded-2xl overflow-hidden bg-blue-50">
            <RadialOrbitalTimeline timelineData={studyProgressionData} />
          </div>
        </div>
        
        {/* Feature Steps Section */}
        <div className="container mx-auto px-4">
          <FeatureSteps 
            features={features}
            title="How StudyBuddy Works"
            autoPlayInterval={4000}
            className="mt-24"
          />
          
          {/* How StudyBuddy Works Section - Updated layout to match Advanced Learning Features */}
          <div className="mt-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How StudyBuddy Works</h2>
            </div>
            
            <BentoGrid items={studyBuddyWorksFeatures} />
          </div>

          {/* How StudyBuddy Helps You Learn Section */}
          <div className="mt-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How StudyBuddy Helps You Learn</h2>
            </div>
            
            <BentoGrid items={studyBuddyHelpsFeatures} />
          </div>

          {/* Document Intelligence Section */}
          <div className="mt-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">AI Document Intelligence</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Upload your study materials and let StudyBuddy's AI become your personal tutor, grounded in your own content
              </p>
            </div>
            
            <BentoGrid items={documentFeatures} />
          </div>

          {/* Advanced Learning Features Section */}
          <div className="mt-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Advanced Learning Features</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover powerful tools designed to enhance your study experience and accelerate your learning journey
              </p>
            </div>
            
            <BentoGrid items={studyFeatures} />
          </div>

          {/* Pricing Section */}
          <div className="mt-24">
            <PricingSection
              title="Choose Your Learning Plan"
              subtitle="Start your learning journey with the plan that fits your needs"
              frequencies={PAYMENT_FREQUENCIES}
              tiers={TIERS}
            />
          </div>
        </div>
      </main>
      
      <footer className="border-t border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Logo size="sm" />
            <p className="text-sm text-muted-foreground mt-4 md:mt-0">
              © {new Date().getFullYear()} StudyBuddy. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
