
import React from "react";
import { useParams } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import LearningContent from "@/components/LearningContent";

const LearningSession = () => {
  const { subject } = useParams();

  const subjectMap = {
    'foundation': 'Mathematics Fundamentals: Core Concepts',
    'practice': 'Interactive Problem Solving: Practice Session',
    'review': 'Knowledge Review: Spaced Repetition',
    'assessment': 'Knowledge Assessment: Gap Analysis',
    'mastery': 'Advanced Mastery: Deep Learning'
  };

  const currentSubject = subjectMap[subject as keyof typeof subjectMap] || 'StudyBuddy Learning Session';

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-2 sm:px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-sm sm:text-lg font-semibold truncate">{currentSubject}</h1>
          </header>
          <div className="flex-1 p-2 sm:p-4 md:p-6 overflow-auto">
            <LearningContent subject={currentSubject} />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default LearningSession;
