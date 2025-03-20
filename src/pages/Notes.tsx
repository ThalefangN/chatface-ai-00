
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import MobileNavigation from '@/components/MobileNavigation';
import { Button } from '@/components/ui/button';
import AnimatedContainer from '@/components/AnimatedContainer';
import { FileText, PenTool, Trash2, Copy, Check, ArrowRight, Upload } from 'lucide-react';
import DocumentUpload from '@/components/DocumentUpload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Notes = () => {
  const [noteText, setNoteText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSummarize = () => {
    if (!noteText.trim()) return;
    
    setLoading(true);
    // Simulate API call to summarize text
    setTimeout(() => {
      // This is a mock summary - in a real app, this would use an AI API
      const mockSummary = noteText.split('.').filter(s => s.trim()).slice(0, 2).join('. ') + '.';
      setSummary(mockSummary);
      setLoading(false);
    }, 1500);
  };

  const handleClear = () => {
    setNoteText('');
    setSummary('');
  };

  const handleCopy = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-6 pb-24 md:pb-6">
        <h1 className="text-2xl font-bold mb-6">My Notes</h1>
        
        <Tabs defaultValue="write" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="write" className="flex items-center gap-2">
              <PenTool className="h-4 w-4" />
              Write Notes
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Documents
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="write" className="animate-fade-in">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <PenTool className="h-5 w-5 text-primary" />
                  Take Notes
                </h2>
                
                <div className="bg-card rounded-xl border border-border shadow-sm p-4">
                  <textarea
                    className="w-full h-64 p-4 rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    placeholder="Enter your notes here..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                  ></textarea>
                  
                  <div className="flex gap-2 mt-4">
                    <Button 
                      onClick={handleSummarize} 
                      disabled={!noteText.trim() || loading}
                      className="flex-1 bg-green-500 hover:bg-green-600"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Summarize <ArrowRight className="h-4 w-4" />
                        </span>
                      )}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={handleClear}
                      disabled={!noteText.trim() && !summary}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Summary
                </h2>
                
                <AnimatedContainer className="bg-card p-4 h-64 flex flex-col">
                  {summary ? (
                    <>
                      <div className="flex-1 p-4 bg-background rounded-lg mb-4 overflow-auto">
                        <p>{summary}</p>
                      </div>
                      
                      <Button 
                        variant="secondary" 
                        onClick={handleCopy}
                        className="self-end"
                      >
                        {copied ? (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Summary
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground">
                      <p className="text-center">
                        Your summary will appear here after you summarize your notes.
                      </p>
                    </div>
                  )}
                </AnimatedContainer>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="upload" className="animate-fade-in">
            <AnimatedContainer className="bg-card rounded-xl border border-border shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Upload Documents
              </h2>
              
              <DocumentUpload />
            </AnimatedContainer>
          </TabsContent>
        </Tabs>
      </main>
      
      <MobileNavigation />
    </div>
  );
};

export default Notes;
