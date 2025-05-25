
import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Plus, Minus, ZoomIn, ZoomOut, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MindMapNode {
  id: string;
  title: string;
  x: number;
  y: number;
  expanded: boolean;
  level: number;
  children: MindMapNode[];
  color: string;
}

interface MindMapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MindMapDialog: React.FC<MindMapDialogProps> = ({ open, onOpenChange }) => {
  const [topic, setTopic] = useState('');
  const [mindMapData, setMindMapData] = useState<MindMapNode | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const generateMindMap = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-study-chat', {
        body: {
          message: `Generate a comprehensive mind map for the topic: "${topic}". Create a hierarchical structure with the main topic at the center and 4-6 main branches, each with 2-4 sub-branches. Format the response as a JSON object with this structure: {"id": "root", "title": "${topic}", "x": 50, "y": 50, "expanded": true, "level": 0, "color": "#3B82F6", "children": [{"id": "branch1", "title": "Main Branch 1", "x": 20, "y": 30, "expanded": false, "level": 1, "color": "#10B981", "children": [{"id": "sub1", "title": "Sub Topic 1", "x": 10, "y": 20, "expanded": false, "level": 2, "color": "#F59E0B", "children": []}]}]}`,
          systemPrompt: 'You are a mind map generator. Always respond with valid JSON only. No additional text or formatting.'
        }
      });

      if (error) throw error;
      
      const mindMapJson = JSON.parse(data.content);
      setMindMapData(mindMapJson);
      toast.success('Mind map generated successfully!');
    } catch (error) {
      console.error('Error generating mind map:', error);
      toast.error('Failed to generate mind map. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleNode = useCallback((nodeId: string) => {
    if (!mindMapData) return;

    const updateNode = (node: MindMapNode): MindMapNode => {
      if (node.id === nodeId) {
        return { ...node, expanded: !node.expanded };
      }
      return {
        ...node,
        children: node.children.map(updateNode)
      };
    };

    setMindMapData(updateNode(mindMapData));
  }, [mindMapData]);

  const renderNode = (node: MindMapNode) => {
    const nodeStyle = {
      position: 'absolute' as const,
      left: `${node.x * zoomLevel}%`,
      top: `${node.y * zoomLevel}%`,
      transform: 'translate(-50%, -50%)',
      zIndex: 10
    };

    return (
      <div key={node.id}>
        <div style={nodeStyle}>
          <Card 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2`}
            style={{ borderColor: node.color }}
            onClick={() => toggleNode(node.id)}
          >
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: node.color }}
                />
                <span className="text-sm font-medium">{node.title}</span>
                {node.children.length > 0 && (
                  <Button variant="ghost" size="sm" className="w-4 h-4 p-0">
                    {node.expanded ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {node.expanded && node.children.map(child => renderNode(child))}
        
        {node.expanded && node.children.map(child => (
          <svg 
            key={`line-${child.id}`}
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 5 }}
          >
            <line
              x1={`${node.x * zoomLevel}%`}
              y1={`${node.y * zoomLevel}%`}
              x2={`${child.x * zoomLevel}%`}
              y2={`${child.y * zoomLevel}%`}
              stroke={node.color}
              strokeWidth="2"
              opacity="0.6"
            />
          </svg>
        ))}
      </div>
    );
  };

  const downloadMindMap = () => {
    if (!mindMapData) return;
    
    const dataStr = JSON.stringify(mindMapData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${topic.replace(/\s+/g, '_')}_mindmap.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Mind map downloaded!');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Mind Map Generator</DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-4 mb-4">
          <Input
            placeholder="Enter topic for mind map..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="flex-1"
          />
          <Button onClick={generateMindMap} disabled={isGenerating}>
            {isGenerating ? 'Generating...' : 'Generate'}
          </Button>
        </div>

        {mindMapData && (
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.1))}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm flex items-center px-2">
                {Math.round(zoomLevel * 100)}%
              </span>
              <Button variant="outline" size="sm" onClick={() => setZoomLevel(prev => Math.min(2, prev + 0.1))}>
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={downloadMindMap}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        )}

        <div className="flex-1 border rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
          {mindMapData ? (
            <div className="relative w-full h-full overflow-auto">
              {renderNode(mindMapData)}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Enter a topic and click Generate to create your mind map
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MindMapDialog;
