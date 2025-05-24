
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, FileText, Mic, Volume2, BookOpen, FileEdit, Map, Share, Settings as SettingsIcon, ChevronDown, Maximize, Minimize, X, ChevronRight, Download, ZoomIn, ZoomOut, Calculator, Target, RefreshCw, Trophy, Clock, CheckCircle, BarChart3, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MindMapNode {
  id: string;
  title: string;
  x: number;
  y: number;
  expanded: boolean;
  children: MindMapNode[];
  parent?: string;
}

interface SubjectContent {
  title: string;
  icon: React.ReactNode;
  description: string;
  sources: string[];
  mindMapNodes: MindMapNode[];
  actions: Array<{
    label: string;
    icon: React.ReactNode;
    variant?: 'default' | 'outline';
  }>;
  studioCards: Array<{
    title: string;
    icon: React.ReactNode;
    content: React.ReactNode;
    color: string;
  }>;
}

const LearningContent = ({ subject = "Mathematics for Machine Learning: Week 1 Examples" }) => {
  const [chatInput, setChatInput] = useState('');
  const [showMindMap, setShowMindMap] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Extract subject type from the subject string
  const getSubjectType = () => {
    if (subject.includes('Practice')) return 'practice';
    if (subject.includes('Review')) return 'review';
    if (subject.includes('Assessment')) return 'assessment';
    if (subject.includes('Mastery')) return 'mastery';
    return 'foundation';
  };

  const subjectType = getSubjectType();

  const subjectConfigs: Record<string, SubjectContent> = {
    foundation: {
      title: "Mathematics Fundamentals: Core Concepts",
      icon: <BookOpen className="w-5 h-5 text-white" />,
      description: "Build strong mathematical foundations with comprehensive theory and examples",
      sources: [
        'mathematicsofmachinelearning.pdf',
        'mathofml.pdf',
        'mathofml2.pdf',
        'mathofml3.pdf',
        'mathofml4.pdf',
        'mlmath.pdf'
      ],
      mindMapNodes: [
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
            }
          ]
        }
      ],
      actions: [
        { label: "Add note", icon: <FileEdit className="w-4 h-4" />, variant: "outline" },
        { label: "Audio Overview", icon: <Volume2 className="w-4 h-4" />, variant: "outline" },
        { label: "Mind Map", icon: <Map className="w-4 h-4" />, variant: "outline" }
      ],
      studioCards: [
        {
          title: "Audio Overview",
          icon: <Volume2 className="w-5 h-5 text-blue-600" />,
          color: "from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20",
          content: (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/50">
                <div className="flex items-center gap-3 mb-3">
                  <Mic className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    Create an Audio Overview in more languages!
                  </span>
                </div>
                <Button variant="link" className="text-blue-600 p-0 h-auto text-sm font-medium hover:text-blue-700">
                  Learn more
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center shadow-sm">
                    <BookOpen className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      Foundation Overview
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Comprehensive explanation
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="flex-1 shadow-sm hover:shadow-md transition-all duration-200">
                    Customize
                  </Button>
                  <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200">
                    Generate
                  </Button>
                </div>
              </div>
            </div>
          )
        }
      ]
    },
    practice: {
      title: "Interactive Problem Solving: Practice Session",
      icon: <Calculator className="w-5 h-5 text-white" />,
      description: "Hands-on practice with step-by-step problem solving and immediate feedback",
      sources: [
        'practice-problems-set1.pdf',
        'worked-examples-calculus.pdf',
        'linear-algebra-exercises.pdf',
        'probability-practice.pdf',
        'optimization-problems.pdf',
        'ml-math-drills.pdf'
      ],
      mindMapNodes: [
        {
          id: 'root',
          title: 'Practice Problem Categories',
          x: 50,
          y: 50,
          expanded: true,
          children: [
            {
              id: 'basic-problems',
              title: 'Basic Problems',
              x: 25,
              y: 25,
              expanded: false,
              children: [
                { id: 'algebra', title: 'Algebraic Manipulation', x: 15, y: 15, expanded: false, children: [] },
                { id: 'calculus-basic', title: 'Basic Derivatives', x: 15, y: 35, expanded: false, children: [] }
              ]
            },
            {
              id: 'advanced-problems',
              title: 'Advanced Problems',
              x: 75,
              y: 25,
              expanded: false,
              children: [
                { id: 'optimization-advanced', title: 'Complex Optimization', x: 85, y: 15, expanded: false, children: [] },
                { id: 'ml-applications', title: 'ML Applications', x: 85, y: 35, expanded: false, children: [] }
              ]
            }
          ]
        }
      ],
      actions: [
        { label: "Start Practice", icon: <Calculator className="w-4 h-4" />, variant: "default" },
        { label: "Problem Hints", icon: <Lightbulb className="w-4 h-4" />, variant: "outline" },
        { label: "Solution Guide", icon: <Map className="w-4 h-4" />, variant: "outline" }
      ],
      studioCards: [
        {
          title: "Practice Generator",
          icon: <Calculator className="w-5 h-5 text-green-600" />,
          color: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
          content: (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800/50">
                <div className="flex items-center gap-3 mb-3">
                  <Target className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                    Generate personalized practice problems!
                  </span>
                </div>
                <Button variant="link" className="text-green-600 p-0 h-auto text-sm font-medium hover:text-green-700">
                  Start practicing
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-700 dark:to-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
                    <Calculator className="w-5 h-5 text-green-600 dark:text-green-300" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      Adaptive Practice Set
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Difficulty adjusts to your level
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="flex-1 shadow-sm hover:shadow-md transition-all duration-200">
                    Configure
                  </Button>
                  <Button size="sm" className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all duration-200">
                    Generate
                  </Button>
                </div>
              </div>
            </div>
          )
        }
      ]
    },
    review: {
      title: "Knowledge Review: Spaced Repetition",
      icon: <RefreshCw className="w-5 h-5 text-white" />,
      description: "Reinforce your learning with spaced repetition and knowledge consolidation",
      sources: [
        'review-summaries.pdf',
        'key-concepts-recap.pdf',
        'formula-reference.pdf',
        'common-mistakes.pdf',
        'review-flashcards.pdf',
        'concept-connections.pdf'
      ],
      mindMapNodes: [
        {
          id: 'root',
          title: 'Knowledge Review System',
          x: 50,
          y: 50,
          expanded: true,
          children: [
            {
              id: 'recent-topics',
              title: 'Recent Topics',
              x: 25,
              y: 25,
              expanded: false,
              children: [
                { id: 'last-week', title: 'Last Week Learning', x: 15, y: 15, expanded: false, children: [] },
                { id: 'key-formulas', title: 'Key Formulas', x: 15, y: 35, expanded: false, children: [] }
              ]
            },
            {
              id: 'weak-areas',
              title: 'Areas for Improvement',
              x: 75,
              y: 25,
              expanded: false,
              children: [
                { id: 'low-confidence', title: 'Low Confidence Topics', x: 85, y: 15, expanded: false, children: [] },
                { id: 'common-errors', title: 'Common Errors', x: 85, y: 35, expanded: false, children: [] }
              ]
            }
          ]
        }
      ],
      actions: [
        { label: "Quick Review", icon: <Clock className="w-4 h-4" />, variant: "default" },
        { label: "Flashcards", icon: <RefreshCw className="w-4 h-4" />, variant: "outline" },
        { label: "Progress Map", icon: <Map className="w-4 h-4" />, variant: "outline" }
      ],
      studioCards: [
        {
          title: "Review Schedule",
          icon: <Clock className="w-5 h-5 text-purple-600" />,
          color: "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
          content: (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800/50">
                <div className="flex items-center gap-3 mb-3">
                  <RefreshCw className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                    Personalized spaced repetition schedule!
                  </span>
                </div>
                <Button variant="link" className="text-purple-600 p-0 h-auto text-sm font-medium hover:text-purple-700">
                  View schedule
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-200 dark:from-purple-700 dark:to-pink-600 rounded-xl flex items-center justify-center shadow-sm">
                    <Clock className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      Smart Review Session
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Based on forgetting curve
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="flex-1 shadow-sm hover:shadow-md transition-all duration-200">
                    Schedule
                  </Button>
                  <Button size="sm" className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-md hover:shadow-lg transition-all duration-200">
                    Start Review
                  </Button>
                </div>
              </div>
            </div>
          )
        }
      ]
    },
    assessment: {
      title: "Knowledge Assessment: Gap Analysis",
      icon: <BarChart3 className="w-5 h-5 text-white" />,
      description: "Comprehensive assessment to identify knowledge gaps and track progress",
      sources: [
        'assessment-framework.pdf',
        'diagnostic-tests.pdf',
        'competency-matrix.pdf',
        'benchmark-problems.pdf',
        'progress-tracking.pdf',
        'gap-analysis-guide.pdf'
      ],
      mindMapNodes: [
        {
          id: 'root',
          title: 'Assessment Framework',
          x: 50,
          y: 50,
          expanded: true,
          children: [
            {
              id: 'diagnostic',
              title: 'Diagnostic Assessment',
              x: 25,
              y: 25,
              expanded: false,
              children: [
                { id: 'skill-check', title: 'Skill Level Check', x: 15, y: 15, expanded: false, children: [] },
                { id: 'knowledge-gaps', title: 'Knowledge Gaps', x: 15, y: 35, expanded: false, children: [] }
              ]
            },
            {
              id: 'progress',
              title: 'Progress Tracking',
              x: 75,
              y: 25,
              expanded: false,
              children: [
                { id: 'competency-map', title: 'Competency Mapping', x: 85, y: 15, expanded: false, children: [] },
                { id: 'improvement-plan', title: 'Improvement Plan', x: 85, y: 35, expanded: false, children: [] }
              ]
            }
          ]
        }
      ],
      actions: [
        { label: "Start Assessment", icon: <Target className="w-4 h-4" />, variant: "default" },
        { label: "View Progress", icon: <BarChart3 className="w-4 h-4" />, variant: "outline" },
        { label: "Gap Analysis", icon: <Map className="w-4 h-4" />, variant: "outline" }
      ],
      studioCards: [
        {
          title: "Assessment Tools",
          icon: <Target className="w-5 h-5 text-red-600" />,
          color: "from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20",
          content: (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800/50">
                <div className="flex items-center gap-3 mb-3">
                  <BarChart3 className="w-5 h-5 text-red-600" />
                  <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                    Comprehensive knowledge assessment!
                  </span>
                </div>
                <Button variant="link" className="text-red-600 p-0 h-auto text-sm font-medium hover:text-red-700">
                  Learn more
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-orange-200 dark:from-red-700 dark:to-orange-600 rounded-xl flex items-center justify-center shadow-sm">
                    <Target className="w-5 h-5 text-red-600 dark:text-red-300" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      Adaptive Assessment
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Identifies knowledge gaps
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="flex-1 shadow-sm hover:shadow-md transition-all duration-200">
                    Configure
                  </Button>
                  <Button size="sm" className="flex-1 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 shadow-md hover:shadow-lg transition-all duration-200">
                    Begin Test
                  </Button>
                </div>
              </div>
            </div>
          )
        }
      ]
    },
    mastery: {
      title: "Advanced Mastery: Deep Learning",
      icon: <Trophy className="w-5 h-5 text-white" />,
      description: "Advanced concepts and real-world applications for true mastery",
      sources: [
        'advanced-topics.pdf',
        'research-papers.pdf',
        'case-studies.pdf',
        'industry-applications.pdf',
        'cutting-edge-methods.pdf',
        'mastery-challenges.pdf'
      ],
      mindMapNodes: [
        {
          id: 'root',
          title: 'Mastery Learning Path',
          x: 50,
          y: 50,
          expanded: true,
          children: [
            {
              id: 'advanced-concepts',
              title: 'Advanced Concepts',
              x: 25,
              y: 25,
              expanded: false,
              children: [
                { id: 'research-topics', title: 'Current Research', x: 15, y: 15, expanded: false, children: [] },
                { id: 'cutting-edge', title: 'Cutting-edge Methods', x: 15, y: 35, expanded: false, children: [] }
              ]
            },
            {
              id: 'applications',
              title: 'Real-world Applications',
              x: 75,
              y: 25,
              expanded: false,
              children: [
                { id: 'industry-cases', title: 'Industry Case Studies', x: 85, y: 15, expanded: false, children: [] },
                { id: 'project-work', title: 'Capstone Projects', x: 85, y: 35, expanded: false, children: [] }
              ]
            }
          ]
        }
      ],
      actions: [
        { label: "Master Challenge", icon: <Trophy className="w-4 h-4" />, variant: "default" },
        { label: "Research Deep Dive", icon: <BookOpen className="w-4 h-4" />, variant: "outline" },
        { label: "Mastery Map", icon: <Map className="w-4 h-4" />, variant: "outline" }
      ],
      studioCards: [
        {
          title: "Mastery Challenges",
          icon: <Trophy className="w-5 h-5 text-yellow-600" />,
          color: "from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20",
          content: (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 p-4 rounded-xl border border-yellow-100 dark:border-yellow-800/50">
                <div className="flex items-center gap-3 mb-3">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                    Advanced mastery challenges await!
                  </span>
                </div>
                <Button variant="link" className="text-yellow-600 p-0 h-auto text-sm font-medium hover:text-yellow-700">
                  Explore challenges
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-100 to-amber-200 dark:from-yellow-700 dark:to-amber-600 rounded-xl flex items-center justify-center shadow-sm">
                    <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-300" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      Expert Level Projects
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Real-world applications
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="flex-1 shadow-sm hover:shadow-md transition-all duration-200">
                    Explore
                  </Button>
                  <Button size="sm" className="flex-1 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 shadow-md hover:shadow-lg transition-all duration-200">
                    Start Challenge
                  </Button>
                </div>
              </div>
            </div>
          )
        }
      ]
    }
  };

  const currentConfig = subjectConfigs[subjectType] || subjectConfigs.foundation;
  const [mindMapNodes, setMindMapNodes] = useState<MindMapNode[]>(currentConfig.mindMapNodes);

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
      ctx.fillStyle = '#f9fafb';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#1f2937';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      
      visibleNodes.forEach(node => {
        const x = (node.x / 100) * canvas.width;
        const y = (node.y / 100) * canvas.height;
        
        ctx.fillStyle = node.id === 'root' ? '#3b82f6' : '#ffffff';
        ctx.beginPath();
        ctx.roundRect(x - 60, y - 15, 120, 30, 8);
        ctx.fill();
        
        ctx.strokeStyle = node.id === 'root' ? '#1d4ed8' : '#d1d5db';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.fillStyle = node.id === 'root' ? '#ffffff' : '#1f2937';
        ctx.fillText(node.title, x, y + 5);
      });
      
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
    <div className="w-full h-full bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200/60 dark:border-gray-700/60 p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              {currentConfig.icon}
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {currentConfig.title}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {currentConfig.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="shadow-sm hover:shadow-md transition-all duration-200">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="shadow-sm hover:shadow-md transition-all duration-200">
              <SettingsIcon className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Three Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Sources */}
        <div className="w-80 border-r border-gray-200/60 dark:border-gray-700/60 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex flex-col">
          <div className="p-6 border-b border-gray-200/60 dark:border-gray-700/60">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Sources</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs shadow-sm hover:shadow-md transition-all duration-200">
                  <Plus className="w-3 h-3 mr-1" />
                  Add
                </Button>
                <Button variant="outline" size="sm" className="text-xs shadow-sm hover:shadow-md transition-all duration-200">
                  <Search className="w-3 h-3 mr-1" />
                  Discover
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <input type="checkbox" className="rounded shadow-sm" />
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Select all sources</span>
            </div>
          </div>
          
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-3">
              {currentConfig.sources.map((source, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-center gap-4 p-3 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-200 cursor-pointer group"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <input type="checkbox" defaultChecked className="rounded shadow-sm" />
                  <FileText className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-medium group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
                    {source}
                  </span>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Center Panel - Chat */}
        <div className="flex-1 flex flex-col bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
          <div className="p-6 border-b border-gray-200/60 dark:border-gray-700/60">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Chat</h2>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <motion.div 
              className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50 rounded-2xl flex items-center justify-center mb-8 shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">🤖</span>
              </div>
            </motion.div>
            
            <motion.h3 
              className="text-3xl font-bold text-gray-900 dark:text-white mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {currentConfig.title}
            </motion.h3>
            <motion.p 
              className="text-gray-600 dark:text-gray-400 mb-10 text-center font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {currentConfig.sources.length} sources
            </motion.p>
            
            <motion.div 
              className="flex gap-4 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {currentConfig.actions.map((action, index) => (
                <Button 
                  key={index}
                  variant={action.variant || "outline"} 
                  className="flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                  onClick={action.label === "Mind Map" ? handleMindMapClick : undefined}
                >
                  {action.icon}
                  {action.label}
                </Button>
              ))}
            </motion.div>
            
            <motion.div 
              className="w-full max-w-2xl relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Input
                placeholder="Start typing..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="pr-14 py-4 rounded-2xl border-2 shadow-lg focus:shadow-xl transition-all duration-200 text-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
              />
              <Button 
                size="sm" 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 rounded-xl w-10 h-10 p-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <ChevronDown className="w-5 h-5 rotate-[-90deg]" />
              </Button>
            </motion.div>
            
            <motion.p 
              className="text-xs text-gray-500 dark:text-gray-400 mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              StudyBuddy AI can be inaccurate; please double check its responses.
            </motion.p>
          </div>
        </div>

        {/* Right Panel - Studio */}
        <div className="w-80 border-l border-gray-200/60 dark:border-gray-700/60 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex flex-col">
          <div className="p-6 border-b border-gray-200/60 dark:border-gray-700/60">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Studio</h2>
          </div>
          
          <ScrollArea className="flex-1 p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {currentConfig.studioCards.map((card, index) => (
                <Card key={index} className="mb-6 shadow-lg hover:shadow-xl transition-all duration-200 border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-700/50">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                        {card.title}
                      </CardTitle>
                      <Button variant="ghost" size="sm" className="w-8 h-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <SettingsIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {card.content}
                  </CardContent>
                </Card>
              ))}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="shadow-lg hover:shadow-xl transition-all duration-200 border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-700/50">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"></div>
                      Notes
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">⋮</Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  <Button variant="outline" className="w-full mb-4 justify-start shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                    <Plus className="w-4 h-4 mr-2" />
                    Add note
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" size="sm" className="justify-start shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105">
                      <BookOpen className="w-3 h-3 mr-2" />
                      Study guide
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105">
                      <FileText className="w-3 h-3 mr-2" />
                      Briefing doc
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105">
                      <FileEdit className="w-3 h-3 mr-2" />
                      FAQ
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105">
                      <Map className="w-3 h-3 mr-2" />
                      Timeline
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </ScrollArea>
        </div>
      </div>

      {/* Mind Map Dialog - Fullscreen */}
      <Dialog open={showMindMap} onOpenChange={setShowMindMap}>
        <DialogContent className="w-screen h-screen max-w-none max-h-none m-0 rounded-none p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white flex-shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-medium">{currentConfig.title}: Interactive Mind Map</DialogTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Based on {currentConfig.sources.length} sources</span>
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
