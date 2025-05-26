
import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  parentId?: string;
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
          message: `Generate a comprehensive mind map for the topic: "${topic}". Create a hierarchical structure with the main topic at the center and 4-6 main branches, each with 2-4 sub-branches. Format the response as a JSON object with this structure: {"id": "root", "title": "${topic}", "x": 400, "y": 300, "expanded": true, "level": 0, "color": "#3B82F6", "children": [{"id": "branch1", "title": "Main Branch 1", "x": 200, "y": 150, "expanded": false, "level": 1, "color": "#10B981", "children": [{"id": "sub1", "title": "Sub Topic 1", "x": 100, "y": 100, "expanded": false, "level": 2, "color": "#F59E0B", "children": []}]}]}`,
          systemPrompt: 'You are a mind map generator. Always respond with valid JSON only. No additional text or formatting. Create a well-structured mind map with proper positioning for visual clarity.'
        }
      });

      if (error) throw error;
      
      let mindMapJson;
      try {
        mindMapJson = JSON.parse(data.content);
      } catch (parseError) {
        // Fallback mind map structure if parsing fails
        mindMapJson = {
          id: "root",
          title: topic,
          x: 400,
          y: 300,
          expanded: true,
          level: 0,
          color: "#3B82F6",
          children: [
            {
              id: "branch1",
              title: "Key Concept 1",
              x: 200,
              y: 200,
              expanded: false,
              level: 1,
              color: "#10B981",
              children: [
                { id: "sub1", title: "Detail A", x: 100, y: 150, expanded: false, level: 2, color: "#F59E0B", children: [] },
                { id: "sub2", title: "Detail B", x: 100, y: 250, expanded: false, level: 2, color: "#F59E0B", children: [] }
              ]
            },
            {
              id: "branch2",
              title: "Key Concept 2",
              x: 600,
              y: 200,
              expanded: false,
              level: 1,
              color: "#8B5CF6",
              children: [
                { id: "sub3", title: "Detail C", x: 700, y: 150, expanded: false, level: 2, color: "#EF4444", children: [] },
                { id: "sub4", title: "Detail D", x: 700, y: 250, expanded: false, level: 2, color: "#EF4444", children: [] }
              ]
            }
          ]
        };
      }
      
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

  const renderConnectingLine = (fromNode: MindMapNode, toNode: MindMapNode) => {
    const fromX = fromNode.x * zoomLevel;
    const fromY = fromNode.y * zoomLevel;
    const toX = toNode.x * zoomLevel;
    const toY = toNode.y * zoomLevel;

    // Calculate control points for curved line
    const controlPointOffset = Math.abs(toX - fromX) * 0.5;
    const controlX1 = fromX + (fromX < toX ? controlPointOffset : -controlPointOffset);
    const controlX2 = toX + (fromX < toX ? -controlPointOffset : controlPointOffset);

    const pathData = `M ${fromX} ${fromY} C ${controlX1} ${fromY}, ${controlX2} ${toY}, ${toX} ${toY}`;

    return (
      <path
        key={`line-${fromNode.id}-${toNode.id}`}
        d={pathData}
        stroke={fromNode.color}
        strokeWidth="2"
        fill="none"
        opacity="0.7"
        className="pointer-events-none"
      />
    );
  };

  const renderNode = (node: MindMapNode): JSX.Element[] => {
    const elements: JSX.Element[] = [];
    
    const nodeStyle = {
      left: `${node.x * zoomLevel}px`,
      top: `${node.y * zoomLevel}px`,
      transform: 'translate(-50%, -50%)',
      zIndex: 10
    };

    // Main node container
    elements.push(
      <div
        key={node.id}
        className="absolute"
        style={nodeStyle}
      >
        <div
          className={`
            relative bg-white border-2 rounded-lg shadow-lg cursor-pointer
            transition-all duration-200 hover:shadow-xl hover:scale-105
            min-w-[120px] max-w-[200px] p-3
          `}
          style={{ borderColor: node.color }}
          onClick={() => node.children.length > 0 && toggleNode(node.id)}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-gray-800 flex-1 break-words">
              {node.title}
            </span>
            {node.children.length > 0 && (
              <button
                className={`
                  w-6 h-6 rounded-full flex items-center justify-center
                  text-white text-xs font-bold transition-colors
                `}
                style={{ backgroundColor: node.color }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNode(node.id);
                }}
              >
                {node.expanded ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
              </button>
            )}
          </div>
          
          {/* Level indicator */}
          <div 
            className="absolute -top-1 -left-1 w-3 h-3 rounded-full"
            style={{ backgroundColor: node.color }}
          />
        </div>
      </div>
    );

    // Render children if expanded
    if (node.expanded && node.children.length > 0) {
      node.children.forEach(child => {
        elements.push(...renderNode(child));
      });
    }

    return elements;
  };

  const renderAllConnections = (node: MindMapNode): JSX.Element[] => {
    const connections: JSX.Element[] = [];
    
    if (node.expanded && node.children.length > 0) {
      node.children.forEach(child => {
        connections.push(renderConnectingLine(node, child));
        connections.push(...renderAllConnections(child));
      });
    }
    
    return connections;
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
              <Button variant="outline" size="sm" onClick={() => setZoomLevel(prev => Math.max(0.3, prev - 0.1))}>
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

        <div className="flex-1 border rounded-lg overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
          {mindMapData ? (
            <div className="relative w-full h-full overflow-auto">
              {/* SVG for connecting lines */}
              <svg 
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ zIndex: 5 }}
              >
                {renderAllConnections(mindMapData)}
              </svg>
              
              {/* Render all nodes */}
              {renderNode(mindMapData)}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="w-8 h-8 bg-blue-500 rounded"></div>
                </div>
                <p>Enter a topic and click Generate to create your mind map</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MindMapDialog;
