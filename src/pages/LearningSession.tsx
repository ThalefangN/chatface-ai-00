
import React from "react";
import { useParams } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import LearningContent from "@/components/LearningContent";
import DocumentUpload from "@/components/DocumentUpload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, Upload } from "lucide-react";

const LearningSession = () => {
  const { subject } = useParams();

  const subjectMap = {
    'foundation': {
      title: 'Mathematical Foundations',
      description: 'Build strong mathematical foundations with comprehensive theory and core concepts'
    },
    'practice': {
      title: 'Interactive Problem Solving',
      description: 'Practice with guided exercises and real-time feedback to reinforce learning'
    },
    'review': {
      title: 'Knowledge Review',
      description: 'Strengthen retention through spaced repetition and systematic review'
    },
    'assessment': {
      title: 'Knowledge Assessment',
      description: 'Evaluate your understanding with comprehensive gap analysis'
    },
    'mastery': {
      title: 'Advanced Mastery',
      description: 'Achieve deep learning through advanced concepts and challenging problems'
    }
  };

  const currentSubject = subjectMap[subject as keyof typeof subjectMap] || {
    title: 'StudyBuddy Learning Session',
    description: 'Personalized learning experience'
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1 min-w-0">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-2 sm:px-4">
            <SidebarTrigger className="-ml-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h1 className="text-xs sm:text-sm md:text-lg font-semibold truncate">
                {currentSubject.title}
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block truncate">
                {currentSubject.description}
              </p>
            </div>
          </header>
          
          <div className="flex-1 p-1 sm:p-2 md:p-4 lg:p-6 overflow-auto w-full max-w-full">
            <div className="w-full max-w-full space-y-6">
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="content" className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Learning Content
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Document Analysis
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="content" className="mt-6">
                  <LearningContent subject={currentSubject.title} />
                </TabsContent>
                
                <TabsContent value="documents" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Document Upload & Analysis
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Upload your study materials, notes, or documents to analyze and extract key insights for better learning.
                      </p>
                    </CardHeader>
                    <CardContent>
                      <DocumentUpload />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default LearningSession;
