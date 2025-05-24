
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';

interface AddNoteDialogProps {
  onSave: (note: { title: string; content: string }) => void;
  children: React.ReactNode;
}

const AddNoteDialog: React.FC<AddNoteDialogProps> = ({ onSave, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSave = () => {
    if (title.trim() && content.trim()) {
      onSave({ title: title.trim(), content: content.trim() });
      setTitle('');
      setContent('');
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setContent('');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Note</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="note-title">Note Title</Label>
            <Input
              id="note-title"
              placeholder="Enter note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="note-content">Note Content</Label>
            <Textarea
              id="note-content"
              placeholder="Enter your note content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full resize-none"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-end">
            <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!title.trim() || !content.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Note
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddNoteDialog;
