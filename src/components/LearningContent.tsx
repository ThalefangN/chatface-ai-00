
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, FileText, Mic, Volume2, BookOpen, FileEdit, Map, Share, Settings as SettingsIcon, ChevronDown, Maximize, Minimize, X, ChevronRight, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface MindMapNode {
  id: string;
  title: string;
  x: number;
  y: number;
  expanded: boolean;
  children: MindMapNode[];
  parent?: string;
}

const LearningContent = ({ subject = "Mathematics for Machine Learning: Week 1 Examples" }) => {
  const [chatInput, setChatInput] = useState('');
  const [showMindMap, setShowMindMap] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mindMapNodes, setMindMapNodes] = useState<MindMapNode[]>([
    {
      id: 'root',
      title: 'Mathematics for Machine Learning',
      x: 50,
      y: 50,
      expanded: true,
      children: [
        {
          id: 'linear-algebra',
          title: 'Linear Algebra',
          x: 25,
          y: 25,
          expanded: false,
          children: [
            { id: 'vectors', title: 'Vectors & Vector Spaces', x: 15, y: 15, expanded: false, children: [] },
            { id: 'matrices', title: 'Matrices & Operations', x: 15, y: 35, expanded: false, children: [] }
          ]
        },
        {
          id: 'calculus',
          title: 'Calculus',
          x: 75,
          y: 25,
          expanded: false,
          children: [
            { id: 'derivatives', title: 'Derivatives & Gradients', x: 85, y: 15, expanded: false, children: [] },
            { id: 'optimization', title: 'Optimization', x: 85, y: 35, expanded: false, children: [] }
          ]
        },
        {
          id: 'probability',
          title: 'Probability & Statistics',
          x: 25,
          y: 75,
          expanded: false,
          children: [
            { id: 'distributions', title: 'Probability Distributions', x: 15, y: 85, expanded: false, children: [] },
            { id: 'bayes', title: 'Bayesian Inference', x: 35, y: 85, expanded: false, children: [] }
          ]
        },
        {
          id: 'applications',
          title: 'ML Applications',
          x: 75,
          y: 75,
          expanded: false,
          children: [
            { id: 'regression', title: 'Linear Regression', x: 85, y: 85, expanded: false, children: [] },
            { id: 'classification', title: 'Classification', x: 85, y: 65, expanded: false, children: [] }
          ]
        }
      ]
    }
  ]);
  
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

  const handleCloseMindMap = () => {
    setShowMindMap(false);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.3));
  };

  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1200;
    canvas.height = 800;
    
    if (ctx) {
      // Set white background
      ctx.fillStyle = '#f9fafb';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Simple text rendering for mind map nodes
      ctx.fillStyle = '#1f2937';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      
      visibleNodes.forEach(node => {
        const x = (node.x / 100) * canvas.width;
        const y = (node.y / 100) * canvas.height;
        
        // Draw node background
        ctx.fillStyle = node.id === 'root' ? '#3b82f6' : '#ffffff';
        ctx.beginPath();
        ctx.roundRect(x - 60, y - 15, 120, 30, 8);
        ctx.fill();
        
        // Draw node border
        ctx.strokeStyle = node.id === 'root' ? '#1d4ed8' : '#d1d5db';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw text
        ctx.fillStyle = node.id === 'root' ? '#ffffff' : '#1f2937';
        ctx.fillText(node.title, x, y + 5);
      });
      
      // Download the image
      const link = document.createElement('a');
      link.download = 'mind-map.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const toggleNodeExpansion = (nodeId: string) => {
    const updateNodes = (nodes: MindMapNode[]): MindMapNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, expanded: !node.expanded };
        }
        if (node.children.length > 0) {
          return { ...node, children: updateNodes(node.children) };
        }
        return node;
      });
    };
    setMindMapNodes(updateNodes(mindMapNodes));
  };

  const getAllVisibleNodes = (nodes: MindMapNode[]): MindMapNode[] => {
    let visibleNodes: MindMapNode[] = [];
    
    const traverse = (nodeList: MindMapNode[], parentExpanded = true) => {
      nodeList.forEach(node => {
        if (parentExpanded) {
          visibleNodes.push(node);
          if (node.expanded && node.children.length > 0) {
            traverse(node.children, true);
          }
        }
      });
    };
    
    traverse(nodes);
    return visibleNodes;
  };

  const getConnections = (nodes: MindMapNode[]) => {
    let connections: { from: MindMapNode; to: MindMapNode }[] = [];
    
    const traverse = (nodeList: MindMapNode[], parent?: MindMapNode) => {
      nodeList.forEach(node => {
        if (parent) {
          connections.push({ from: parent, to: node });
        }
        if (node.expanded && node.children.length > 0) {
          traverse(node.children, node);
        }
      });
    };
    
    traverse(nodes);
    return connections;
  };

  const visibleNodes = getAllVisibleNodes(mindMapNodes);
  const connections = getConnections(mindMapNodes);

  const generateCurvePath = (from: MindMapNode, to: MindMapNode) => {
    const x1 = from.x;
    const y1 = from.y;
    const x2 = to.x;
    const y2 = to.y;
    
    const controlX1 = x1 + (x2 - x1) * 0.3;
    const controlY1 = y1;
    const controlX2 = x2 - (x2 - x1) * 0.3;
    const controlY2 = y2;
    
    return `M ${x1} ${y1} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${x2} ${y2}`;
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

      {/* Mind Map Dialog - Fullscreen */}
      <Dialog open={showMindMap} onOpenChange={setShowMindMap}>
        <DialogContent className="w-screen h-screen max-w-none max-h-none m-0 rounded-none p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white flex-shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-medium">Mathematics for Machine Learning: Interactive Mind Map</DialogTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Based on 6 sources</span>
                <Button variant="ghost" size="sm" onClick={handleDownload}>
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleCloseMindMap}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 bg-gray-50 relative overflow-hidden">
            {/* Mind Map Content with Zoom */}
            <div 
              className="w-full h-full relative overflow-auto"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center center',
                transition: 'transform 0.2s ease'
              }}
            >
              <div className="min-w-[200vw] min-h-[200vh] relative">
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Curved connection lines */}
                  {connections.map((connection, index) => (
                    <path
                      key={index}
                      d={generateCurvePath(connection.from, connection.to)}
                      stroke="#3b82f6"
                      strokeWidth="0.2"
                      fill="none"
                      opacity="0.6"
                    />
                  ))}
                </svg>
                
                {/* Mind Map Nodes */}
                {visibleNodes.map((node) => (
                  <motion.div
                    key={node.id}
                    className={`absolute cursor-pointer group ${node.id === 'root' ? 'z-20' : 'z-10'}`}
                    style={{
                      left: `${node.x}%`,
                      top: `${node.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => toggleNodeExpansion(node.id)}
                  >
                    <div className={`
                      relative rounded-lg px-4 py-2 shadow-md border transition-all duration-200
                      ${node.id === 'root' 
                        ? 'bg-blue-500 text-white border-blue-600 text-base font-semibold' 
                        : 'bg-white text-gray-800 border-gray-200 text-sm hover:shadow-lg hover:scale-105'
                      }
                      ${node.children.length > 0 ? 'pr-8' : ''}
                    `}>
                      {node.title}
                      
                      {/* Expand/Collapse Icon */}
                      {node.children.length > 0 && (
                        <div className={`
                          absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs
                          ${node.expanded ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}
                          transition-all duration-200 hover:scale-110
                        `}>
                          <ChevronRight 
                            className={`w-3 h-3 transition-transform duration-200 ${node.expanded ? 'rotate-90' : ''}`} 
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Zoom Controls */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
              <Button size="sm" className="w-10 h-10 p-0 bg-blue-500 hover:bg-blue-600 rounded-full" onClick={handleZoomIn}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button size="sm" className="w-10 h-10 p-0 bg-blue-500 hover:bg-blue-600 rounded-full" onClick={handleZoomOut}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <div className="text-xs text-center text-gray-600 mt-1">
                {Math.round(zoomLevel * 100)}%
              </div>
            </div>
            
            {/* Instructions */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-sm text-gray-600">
              <p className="font-medium mb-1">Interactive Mind Map</p>
              <p>Click nodes with arrows to expand • Use zoom controls to navigate</p>
            </div>
            
            {/* Feedback Buttons */}
            <div className="absolute bottom-4 left-4 flex gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2 bg-white/90 backdrop-blur-sm">
                <span className="text-green-600">👍</span>
                Helpful
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2 bg-white/90 backdrop-blur-sm">
                <span className="text-red-600">👎</span>
                Not helpful
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LearningContent;
