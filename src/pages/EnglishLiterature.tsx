
import React from 'react';
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import CourseContent from "@/components/CourseContent";

const EnglishLiterature = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-lg font-semibold">English Literature Course</h1>
          </header>
          <div className="p-4">
            <CourseContent
              courseTitle="English Literature"
              instructor="Ms. Bontle Ramotswe"
              rating={4.6}
              students={203}
              level="BGCSE"
              subject="English"
            />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default EnglishLiterature;
