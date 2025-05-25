
import React, { useState, useCallback } from 'react';
import { Upload, FileText, X, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  content?: string;
  summary?: string;
  isProcessing?: boolean;
}

const DocumentUpload = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFileWithAI = async (fileContent: string, fileName: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-document-summary', {
        body: { 
          content: fileContent,
          fileName: fileName
        }
      });

      if (error) throw error;
      return data.summary;
    } catch (error) {
      console.error('Error processing file with AI:', error);
      return 'Summary generation failed. Please try again.';
    }
  };

  const handleFileRead = async (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const handleFileUpload = async (uploadedFiles: File[]) => {
    setIsUploading(true);
    
    for (const file of uploadedFiles) {
      const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Add file to state immediately with processing flag
      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        isProcessing: true
      };
      
      setFiles(prev => [...prev, newFile]);
      
      try {
        const content = await handleFileRead(file);
        const summary = await processFileWithAI(content, file.name);
        
        // Update file with content and summary
        setFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { ...f, content, summary, isProcessing: false }
            : f
        ));
        
        toast.success(`${file.name} uploaded and processed successfully!`);
      } catch (error) {
        console.error('Error processing file:', error);
        setFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { ...f, isProcessing: false, summary: 'Processing failed' }
            : f
        ));
        toast.error(`Failed to process ${file.name}`);
      }
    }
    
    setIsUploading(false);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const textFiles = droppedFiles.filter(file => 
      file.type.startsWith('text/') || 
      file.name.endsWith('.txt') || 
      file.name.endsWith('.md')
    );
    
    if (textFiles.length > 0) {
      handleFileUpload(textFiles);
    } else {
      toast.error('Please upload text files only (.txt, .md)');
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    handleFileUpload(selectedFiles);
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    toast.success('File removed');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className={`border-2 border-dashed transition-all ${
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}>
        <CardContent className="p-8">
          <div
            className="text-center"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Upload your study documents
            </h3>
            <p className="text-gray-500 mb-4">
              Drag and drop your files here, or click to browse
            </p>
            <div className="flex justify-center">
              <label htmlFor="file-upload" className="cursor-pointer">
                <Button disabled={isUploading}>
                  {isUploading ? 'Processing...' : 'Choose Files'}
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept=".txt,.md,text/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Supported formats: .txt, .md (Text files only)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 ? (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Uploaded Documents</h4>
          {files.map((file) => (
            <Card key={file.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <FileText className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                    
                    {file.isProcessing && (
                      <Alert className="mt-3">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Processing document with AI...
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {file.summary && !file.isProcessing && (
                      <Alert className="mt-3">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>AI Summary:</strong> {file.summary}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8">
          <div className="text-center text-gray-500">
            <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h4 className="text-lg font-medium text-gray-400 mb-2">No documents uploaded yet</h4>
            <p className="text-sm">Add your first document to get started with AI-powered analysis</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default DocumentUpload;
