
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, BookOpen, Calendar, FileText, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AddNoteDialog from '@/components/AddNoteDialog';

interface Note {
  id: string;
  title: string;
  content: string;
  subject: string;
  createdAt: string;
  tags: string[];
}

const Notes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Calculus Fundamentals',
      content: 'Key concepts in differential calculus including limits, derivatives, and their applications.',
      subject: 'Mathematics',
      createdAt: '2024-01-15',
      tags: ['calculus', 'derivatives', 'limits']
    },
    {
      id: '2',
      title: 'Physics: Newton\'s Laws',
      content: 'Understanding the three fundamental laws of motion and their real-world applications.',
      subject: 'Physics',
      createdAt: '2024-01-10',
      tags: ['mechanics', 'forces', 'motion']
    }
  ]);

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNote = (newNote: { title: string; content: string }) => {
    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      subject: 'General',
      createdAt: new Date().toISOString().split('T')[0],
      tags: []
    };
    setNotes([note, ...notes]);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-2 sm:px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-sm sm:text-lg font-semibold">Study Materials</h1>
          </header>
          
          <div className="flex-1 p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6 overflow-auto">
            {/* Search and Actions */}
            <div className="flex flex-col gap-3 sm:gap-4 items-start justify-between">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 w-full">
                <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <AddNoteDialog onSave={handleAddNote} />
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">{notes.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Subjects</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">
                    {new Set(notes.map(note => note.subject)).size}
                  </div>
                </CardContent>
              </Card>

              <Card className="sm:col-span-2 lg:col-span-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">Today</div>
                </CardContent>
              </Card>
            </div>

            {/* Notes Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
              {filteredNotes.map((note) => (
                <Card key={note.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg line-clamp-2">{note.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 text-sm">
                      <Badge variant="secondary" className="text-xs">{note.subject}</Badge>
                      <span className="text-xs">{note.createdAt}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                      {note.content}
                    </p>
                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {note.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredNotes.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <FileText className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No notes found</h3>
                <p className="text-sm text-gray-500 mb-4 px-4">
                  {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first note.'}
                </p>
                {!searchTerm && <AddNoteDialog onSave={handleAddNote} />}
              </div>
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Notes;
