import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, FileText, Mic, Volume2, BookOpen, FileEdit, Map, Share, Settings as SettingsIcon, ChevronDown, Maximize, Minimize, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const LearningContent = ({ subject = "Mathematics for Machine Learning: Week 1 Examples" }) => {
  const [chatInput, setChatInput] = useState('');
  const [showMindMap, setShowMindMap] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const sources = [
    'mathematicsofmachinelearning.pdf',
    'mathofml.pdf',
    'mathofml2.pdf',
    'mathofml3.pdf',
    'mathofml4.pdf',
    'mlmath.pdf'
  ];

  const handleMindMapClick = () => {
    setShowMindMap(true);
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleCloseMindMap = () => {
    setShowMindMap(false);
    setIsFullscreen(false);
  };

  return (
    <div className="w-full h-full bg-white dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-medium text-gray-900 dark:text-white">
              {subject}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <SettingsIcon className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Three Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Sources */}
        <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Sources</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs">
                  <Plus className="w-3 h-3 mr-1" />
                  Add
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  <Search className="w-3 h-3 mr-1" />
                  Discover
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              <input type="checkbox" className="rounded" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Select all sources</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            <div className="space-y-2">
              {sources.map((source, index) => (
                <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <FileText className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{source}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Panel - Chat */}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Chat</h2>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-6">
              <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">🤖</span>
              </div>
            </div>
            
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              {subject}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
              {sources.length} sources
            </p>
            
            <div className="flex gap-3 mb-8">
              <Button variant="outline" className="flex items-center gap-2">
                <FileEdit className="w-4 h-4" />
                Add note
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                Audio Overview
              </Button>
              <Button variant="outline" className="flex items-center gap-2" onClick={handleMindMapClick}>
                <Map className="w-4 h-4" />
                Mind Map
              </Button>
            </div>
            
            <div className="w-full max-w-2xl relative">
              <Input
                placeholder="Start typing..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="pr-12 py-3 rounded-full border-2"
              />
              <Button 
                size="sm" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full w-8 h-8 p-0"
              >
                <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
              </Button>
            </div>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              StudyBuddy AI can be inaccurate; please double check its responses.
            </p>
          </div>
        </div>

        {/* Right Panel - Studio */}
        <div className="w-80 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Studio</h2>
          </div>
          
          <div className="p-4">
            <Card className="mb-4">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Audio Overview</CardTitle>
                  <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
                    <SettingsIcon className="w-3 h-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Mic className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-600 dark:text-blue-400">
                      Create an Audio Overview in more languages!
                    </span>
                  </div>
                  <Button variant="link" className="text-blue-600 p-0 h-auto text-sm">
                    Learn more
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Deep Dive conversation
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Two hosts
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Customize
                    </Button>
                    <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                      Generate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Notes</CardTitle>
                  <Button variant="ghost" size="sm">⋮</Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Button variant="outline" className="w-full mb-4 justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  Add note
                </Button>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="justify-start">
                    <BookOpen className="w-3 h-3 mr-2" />
                    Study guide
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start">
                    <FileText className="w-3 h-3 mr-2" />
                    Briefing doc
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start">
                    <FileEdit className="w-3 h-3 mr-2" />
                    FAQ
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start">
                    <Map className="w-3 h-3 mr-2" />
                    Timeline
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Mind Map Dialog */}
      <Dialog open={showMindMap} onOpenChange={setShowMindMap}>
        <DialogContent className={`${isFullscreen ? 'w-screen h-screen max-w-none max-h-none m-0 rounded-none' : 'max-w-4xl w-full h-[80vh]'} p-0 overflow-hidden`}>
          <DialogHeader className="p-4 border-b bg-white">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-medium">MATLAB Basics: Arrays, Operations, and Programming</DialogTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Based on 6 sources</span>
                <Button variant="ghost" size="sm" onClick={handleFullscreenToggle}>
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={handleCloseMindMap}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 bg-gray-50 relative overflow-hidden">
            {/* Mind Map Content */}
            <div className="w-full h-full flex items-center justify-center relative">
              {/* Central Node */}
              <div className="absolute bg-blue-200 rounded-lg px-4 py-2 text-blue-900 font-medium text-sm shadow-md">
                Mathematics for Machine Learning
              </div>
              
              {/* Connected Nodes */}
              <div className="absolute top-20 right-20 bg-blue-100 rounded-lg px-3 py-2 text-blue-800 text-sm shadow-md">
                Chapter 2: Creating Arrays
                <div className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  &gt;
                </div>
              </div>
              
              <div className="absolute top-40 right-10 bg-blue-100 rounded-lg px-3 py-2 text-blue-800 text-sm shadow-md">
                Chapter 3: Mathematical Operations
              </div>
              
              <div className="absolute bottom-32 right-16 bg-blue-100 rounded-lg px-3 py-2 text-blue-800 text-sm shadow-md">
                Chapter 6: Programming in MATLAB
              </div>
              
              <div className="absolute bottom-20 left-20 bg-blue-100 rounded-lg px-3 py-2 text-blue-800 text-sm shadow-md">
                Examples
                <div className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  &gt;
                </div>
              </div>
              
              {/* Connecting Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line x1="50%" y1="50%" x2="70%" y2="25%" stroke="#93c5fd" strokeWidth="2" opacity="0.6" />
                <line x1="50%" y1="50%" x2="75%" y2="45%" stroke="#93c5fd" strokeWidth="2" opacity="0.6" />
                <line x1="50%" y1="50%" x2="70%" y2="70%" stroke="#93c5fd" strokeWidth="2" opacity="0.6" />
                <line x1="50%" y1="50%" x2="30%" y2="80%" stroke="#93c5fd" strokeWidth="2" opacity="0.6" />
              </svg>
            </div>
            
            {/* Controls */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
              <Button size="sm" className="w-8 h-8 p-0 bg-blue-500 hover:bg-blue-600">
                <Plus className="w-4 h-4" />
              </Button>
              <Button size="sm" className="w-8 h-8 p-0 bg-blue-500 hover:bg-blue-600">
                <span className="text-xs">−</span>
              </Button>
            </div>
            
            {/* Feedback Buttons */}
            <div className="absolute bottom-4 left-4 flex gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <span className="text-green-600">👍</span>
                Good content
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <span className="text-red-600">👎</span>
                Bad content
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LearningContent;
