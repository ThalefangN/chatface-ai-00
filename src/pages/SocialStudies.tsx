
import React from 'react';
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import CourseContent from "@/components/CourseContent";

const SocialStudies = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-lg font-semibold">Social Studies Course</h1>
          </header>
          <div className="p-4">
            <CourseContent
              courseTitle="Social Studies"
              instructor="Mr. Gaolathe Mmolawa"
              rating={4.4}
              students={198}
              level="JCE"
              subject="Social Studies"
            />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default SocialStudies;
