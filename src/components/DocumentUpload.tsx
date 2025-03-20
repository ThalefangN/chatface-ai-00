
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, FilePdf, FileImage, FileAudio, FileVideo, Upload, X, Check } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface FileWithPreview extends File {
  id: string;
  preview?: string;
  icon: React.ReactNode;
}

const DocumentUpload = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const getFileIcon = (file: File) => {
    const fileType = file.type;
    
    if (fileType.includes('pdf')) {
      return <FilePdf className="h-10 w-10 text-red-500" />;
    } else if (fileType.includes('image')) {
      return <FileImage className="h-10 w-10 text-blue-500" />;
    } else if (fileType.includes('audio')) {
      return <FileAudio className="h-10 w-10 text-yellow-500" />;
    } else if (fileType.includes('video')) {
      return <FileVideo className="h-10 w-10 text-purple-500" />;
    } else {
      return <FileText className="h-10 w-10 text-green-500" />;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const newFiles = Array.from(selectedFiles).map(file => ({
      ...file,
      id: Math.random().toString(36).substring(2),
      icon: getFileIcon(file),
    }));

    setFiles(prev => [...prev, ...newFiles]);
    toast({
      title: "Files added",
      description: `Added ${newFiles.length} file(s) successfully`,
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (!droppedFiles.length) return;

    const newFiles = Array.from(droppedFiles).map(file => ({
      ...file,
      id: Math.random().toString(36).substring(2),
      icon: getFileIcon(file),
    }));

    setFiles(prev => [...prev, ...newFiles]);
    toast({
      title: "Files added",
      description: `Added ${newFiles.length} file(s) successfully`,
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeFile = (id: string) => {
    setFiles(files.filter(file => file.id !== id));
  };

  const handleUpload = () => {
    if (files.length === 0) {
      toast({
        title: "No files to upload",
        description: "Please add files first",
        variant: "destructive",
      });
      return;
    }

    // In a real app, you would upload the files to a server here
    toast({
      title: "Upload successful",
      description: `Uploaded ${files.length} file(s)`,
    });
    
    // Reset files after upload
    setFiles([]);
  };

  return (
    <div className="space-y-4">
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          isDragging ? 'border-primary bg-primary/5' : 'border-border'
        } transition-colors`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <FileText className="h-8 w-8 text-green-500" />
            <FilePdf className="h-8 w-8 text-red-500" />
            <FileImage className="h-8 w-8 text-blue-500" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">
              Drag & drop files or <span className="text-primary">browse</span>
            </h3>
            <p className="text-sm text-muted-foreground">
              Upload documents (PDF, DOCX), images, or any other files
            </p>
          </div>
          
          <div>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              multiple
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload">
              <Button 
                type="button" 
                variant="outline" 
                className="cursor-pointer"
              >
                <Upload className="mr-2 h-4 w-4" />
                Browse Files
              </Button>
            </label>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-md font-medium">Selected Files</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {files.map((file) => (
              <div 
                key={file.id} 
                className="bg-card border rounded-md p-3 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  {file.icon}
                  <div className="truncate">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={() => removeFile(file.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleUpload} className="bg-green-500 hover:bg-green-600">
              <Check className="mr-2 h-4 w-4" />
              Upload {files.length} {files.length === 1 ? 'File' : 'Files'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
