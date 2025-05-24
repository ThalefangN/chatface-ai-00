
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
        <SidebarInset className="flex-1 min-w-0">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-2 sm:px-4">
            <SidebarTrigger className="-ml-1 flex-shrink-0" />
            <h1 className="text-xs sm:text-sm md:text-lg font-semibold truncate min-w-0 flex-1">
              {currentSubject}
            </h1>
          </header>
          <div className="flex-1 p-1 sm:p-2 md:p-4 lg:p-6 overflow-auto w-full max-w-full">
            <div className="w-full max-w-full">
              <LearningContent subject={currentSubject} />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default LearningSession;
