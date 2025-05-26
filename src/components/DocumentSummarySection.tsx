
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Upload, FileText, X, Download, Send, Bot } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface UploadedFile {
  id: string;
  name: string;
  content: string;
  summary?: string;
}

const DocumentSummarySection: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [topicQuery, setTopicQuery] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('text/') && !file.name.endsWith('.txt') && !file.name.endsWith('.md')) {
      toast.error('Please upload text files only (.txt, .md)');
      return;
    }

    setIsUploading(true);
    try {
      const content = await file.text();
      const newFile: UploadedFile = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        content: content
      };

      setUploadedFiles(prev => [...prev, newFile]);
      setSelectedFile(newFile);
      toast.success(`${file.name} uploaded successfully!`);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const generateSummaryWithRetry = async (message: string, attempt = 0): Promise<string> => {
    const maxRetries = 3;
    
    try {
      console.log(`Attempting to generate summary (attempt ${attempt + 1})`);
      
      // Add timeout using Promise.race
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 45000)
      );
      
      const invokePromise = supabase.functions.invoke('ai-study-chat', {
        body: {
          message,
          systemPrompt: 'You are a helpful AI study assistant. Provide clear, comprehensive summaries and explanations. Format your response in a readable way with proper paragraphs and bullet points where appropriate.'
        }
      });

      const { data, error } = await Promise.race([invokePromise, timeoutPromise]) as any;

      if (error) throw error;
      
      if (data && data.content) {
        console.log('Summary generated successfully');
        return data.content;
      } else {
        throw new Error('No content received from AI');
      }
    } catch (error) {
      console.error(`Error generating summary (attempt ${attempt + 1}):`, error);
      
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        console.log(`Retrying summary generation in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return generateSummaryWithRetry(message, attempt + 1);
      }
      
      console.error('Max retries reached for summary generation');
      throw error;
    }
  };

  const generateSummary = async () => {
    if (!selectedFile && !topicQuery.trim()) {
      toast.error('Please upload a document or enter a topic');
      return;
    }

    setIsGeneratingSummary(true);
    try {
      let message = '';
      if (selectedFile && topicQuery.trim()) {
        message = `Please provide a comprehensive summary about "${topicQuery}" based on this document content: ${selectedFile.content.substring(0, 3000)}...`;
      } else if (selectedFile) {
        message = `Please provide a comprehensive summary of this document: ${selectedFile.content.substring(0, 3000)}...`;
      } else {
        message = `Please provide a comprehensive summary/explanation about: ${topicQuery}`;
      }

      const summary = await generateSummaryWithRetry(message);
      setAiSummary(summary);
      toast.success('Summary generated successfully!');
      
    } catch (error) {
      console.error('Error generating summary:', error);
      toast.error('Failed to generate summary. Please try again.');
      
      // Provide a helpful fallback response
      setAiSummary('I apologize, but I encountered an issue generating the summary. This could be due to a temporary connection issue or high server load. Please try again in a moment, or check your internet connection.');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const downloadSummary = () => {
    if (!aiSummary) return;

    const title = selectedFile ? selectedFile.name : topicQuery || 'AI Summary';
    const content = `# AI Summary: ${title}\n\n${aiSummary}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/\s+/g, '_')}_summary.md`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Summary downloaded!');
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    if (selectedFile?.id === fileId) {
      setSelectedFile(null);
    }
    toast.success('File removed');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 h-full">
      {/* Document Upload Panel */}
      <div className="w-full lg:w-1/2 flex flex-col order-1">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="w-5 h-5" />
              Document Upload
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-full space-y-4">
            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center">
              <Upload className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                Upload your document
              </h3>
              <p className="text-gray-500 mb-3 sm:mb-4 text-sm">
                Drag and drop or click to browse
              </p>
              <label htmlFor="document-upload" className="cursor-pointer">
                <Button disabled={isUploading} size="sm">
                  {isUploading ? 'Uploading...' : 'Choose File'}
                </Button>
                <input
                  id="document-upload"
                  type="file"
                  accept=".txt,.md,text/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Topic Input */}
            <div>
              <div className="flex gap-2">
                <Input
                  placeholder="Or enter a topic to get summary..."
                  value={topicQuery}
                  onChange={(e) => setTopicQuery(e.target.value)}
                  className="flex-1 text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && !isGeneratingSummary && generateSummary()}
                  disabled={isGeneratingSummary}
                />
                <Button 
                  onClick={generateSummary} 
                  disabled={isGeneratingSummary || (!selectedFile && !topicQuery.trim())} 
                  size="sm" 
                  className="flex-shrink-0"
                >
                  {isGeneratingSummary ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Uploaded Files */}
            <ScrollArea className="flex-1 min-h-0">
              <div className="space-y-2">
                {uploadedFiles.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedFile?.id === file.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedFile(file)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span className="text-sm font-medium truncate">{file.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(file.id);
                        }}
                        className="w-6 h-6 p-0 flex-shrink-0"
                        disabled={isGeneratingSummary}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* AI Summary Panel */}
      <div className="w-full lg:w-1/2 flex flex-col order-2">
        <Card className="flex-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bot className="w-5 h-5 text-blue-500" />
                AI Summary
              </CardTitle>
              {aiSummary && !isGeneratingSummary && (
                <Button variant="outline" size="sm" onClick={downloadSummary}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <ScrollArea className="h-full min-h-[300px] lg:min-h-[400px]">
              {isGeneratingSummary ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-500 text-sm">Generating summary...</p>
                    <p className="text-xs text-gray-400 mt-2">This may take up to 45 seconds</p>
                  </div>
                </div>
              ) : aiSummary ? (
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                    {aiSummary}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <Bot className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-sm font-medium mb-2">Ready to generate summaries</p>
                    <p className="text-xs">Upload a document or enter a topic to get started</p>
                  </div>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DocumentSummarySection;
