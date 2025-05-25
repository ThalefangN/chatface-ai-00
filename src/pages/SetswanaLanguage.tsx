
import React from 'react';
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import CourseContent from "@/components/CourseContent";

const SetswanaLanguage = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-lg font-semibold">Setswana Language Course</h1>
          </header>
          <div className="p-4">
            <CourseContent
              title="Setswana Language"
              instructor="Mme Mpho Kebonang"
              rating={4.5}
              students={187}
              level="PSLE"
              subject="Setswana"
            />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default SetswanaLanguage;
