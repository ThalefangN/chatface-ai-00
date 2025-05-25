import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { 
  BookOpen, BarChart3, FileText, Target, Play, TrendingUp, Users, Clock, Star, 
  CheckCircle, Award, Zap, Brain, BookOpenCheck, FileEdit, Volume2, Mic,
  Calculator, Lightbulb, RefreshCw, Trophy, Share, Settings as SettingsIcon,
  Plus, Search, ChevronDown, Download, X, ZoomIn, ZoomOut, MapPin
} from "lucide-react";
import TutorSection from "./TutorSection";
import AssessmentExam from "./AssessmentExam";
import MindMapDialog from "./MindMapDialog";
import DocumentSummarySection from "./DocumentSummarySection";

interface LearningContentProps {
  subject: string;
}

interface MindMapNode {
  id: string;
  title: string;
  x: number;
  y: number;
  expanded: boolean;
  level: number;
  children: MindMapNode[];
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
    variant?: "default" | "outline";
  }>;
  studioCards: Array<{
    title: string;
    icon: React.ReactNode;
    color: string;
    content: React.ReactNode;
  }>;
}

const LearningContent: React.FC<LearningContentProps> = ({ subject }) => {
  const [showAssessment, setShowAssessment] = useState(false);
  const [showMindMap, setShowMindMap] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [chatInput, setChatInput] = useState("");
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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
          y: 20,
          expanded: true,
          level: 0,
          children: [
            {
              id: 'linear-algebra',
              title: 'Linear Algebra',
              x: 20,
              y: 45,
              expanded: false,
              level: 1,
              children: [
                { id: 'vectors', title: 'Vectors & Vector Spaces', x: 5, y: 65, expanded: false, level: 2, children: [] },
                { id: 'matrices', title: 'Matrices & Operations', x: 20, y: 70, expanded: false, level: 2, children: [] },
                { id: 'eigenvalues', title: 'Eigenvalues & Eigenvectors', x: 35, y: 75, expanded: false, level: 2, children: [] }
              ]
            },
            {
              id: 'calculus',
              title: 'Calculus',
              x: 80,
              y: 45,
              expanded: false,
              level: 1,
              children: [
                { id: 'derivatives', title: 'Derivatives & Gradients', x: 95, y: 65, expanded: false, level: 2, children: [] },
                { id: 'optimization', title: 'Optimization', x: 80, y: 70, expanded: false, level: 2, children: [] },
                { id: 'chain-rule', title: 'Chain Rule', x: 65, y: 75, expanded: false, level: 2, children: [] }
              ]
            },
            {
              id: 'probability',
              title: 'Probability & Statistics',
              x: 50,
              y: 80,
              expanded: false,
              level: 1,
              children: [
                { id: 'distributions', title: 'Probability Distributions', x: 30, y: 95, expanded: false, level: 2, children: [] },
                { id: 'bayes', title: 'Bayes Theorem', x: 70, y: 95, expanded: false, level: 2, children: [] }
              ]
            }
          ]
        }
      ],
      actions: [
        { label: "Add note", icon: <FileEdit className="w-4 h-4" />, variant: "outline" },
        { label: "Audio Overview", icon: <Volume2 className="w-4 h-4" />, variant: "outline" },
        { label: "Mind Map", icon: <MapPin className="w-4 h-4" />, variant: "outline" }
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
    mastery: {
      title: "Document Mastery: Upload & Analyze",
      icon: <FileText className="w-5 h-5 text-white" />,
      description: "Upload documents and get AI-powered summaries and insights",
      sources: [],
      mindMapNodes: [],
      actions: [
        { label: "Upload Document", icon: <FileEdit className="w-4 h-4" />, variant: "default" }
      ],
      studioCards: []
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
          y: 20,
          expanded: true,
          level: 0,
          children: [
            {
              id: 'diagnostic',
              title: 'Diagnostic Assessment',
              x: 25,
              y: 45,
              expanded: false,
              level: 1,
              children: [
                { id: 'skill-check', title: 'Skill Level Check', x: 15, y: 70, expanded: false, level: 2, children: [] },
                { id: 'knowledge-gaps', title: 'Knowledge Gaps', x: 35, y: 75, expanded: false, level: 2, children: [] }
              ]
            },
            {
              id: 'progress',
              title: 'Progress Tracking',
              x: 75,
              y: 45,
              expanded: false,
              level: 1,
              children: [
                { id: 'competency-map', title: 'Competency Mapping', x: 85, y: 70, expanded: false, level: 2, children: [] },
                { id: 'improvement-plan', title: 'Improvement Plan', x: 65, y: 75, expanded: false, level: 2, children: [] }
              ]
            }
          ]
        }
      ],
      actions: [
        { label: "Start Assessment", icon: <Target className="w-4 h-4" />, variant: "default" },
        { label: "View Progress", icon: <BarChart3 className="w-4 h-4" />, variant: "outline" },
        { label: "Gap Analysis", icon: <MapPin className="w-4 h-4" />, variant: "outline" }
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
                  <Button 
                    size="sm" 
                    className="flex-1 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 shadow-md hover:shadow-lg transition-all duration-200"
                    onClick={() => setShowAssessment(true)}
                  >
                    Begin Test
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

  if (showAssessment) {
    return (
      <AssessmentExam 
        subject={subject} 
        onBack={() => setShowAssessment(false)} 
      />
    );
  }

  // Special layout for mastery page
  if (subjectType === 'mastery') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200/60 dark:border-gray-700/60 p-4 lg:p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 lg:gap-4 min-w-0 flex-1">
              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                {currentConfig.icon}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg lg:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent truncate">
                  {currentConfig.title}
                </h1>
                <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mt-1 hidden sm:block">
                  {currentConfig.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
              <Button variant="outline" size="sm" className="shadow-sm hover:shadow-md transition-all duration-200 hidden sm:flex">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="shadow-sm hover:shadow-md transition-all duration-200">
                <SettingsIcon className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Document Summary Section */}
        <div className="flex-1 p-4 lg:p-6">
          <DocumentSummarySection />
        </div>
      </div>
    );
  }

  const handleMindMapClick = () => {
    setShowMindMap(true);
  };

  const handleCloseMindMap = () => {
    setShowMindMap(false);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200/60 dark:border-gray-700/60 p-4 lg:p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 lg:gap-4 min-w-0 flex-1">
            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              {currentConfig.icon}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg lg:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent truncate">
                {currentConfig.title}
              </h1>
              <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mt-1 hidden sm:block">
                {currentConfig.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
            <Button variant="outline" size="sm" className="shadow-sm hover:shadow-md transition-all duration-200 hidden sm:flex">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="shadow-sm hover:shadow-md transition-all duration-200">
              <SettingsIcon className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Settings</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Three Panel Layout - Responsive */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel - Sources */}
        <div className="w-full lg:w-80 border-b lg:border-r lg:border-b-0 border-gray-200/60 dark:border-gray-700/60 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex flex-col max-h-64 lg:max-h-none">
          {/* ... keep existing code (sources panel) the same ... */}
          <div className="p-4 lg:p-6 border-b border-gray-200/60 dark:border-gray-700/60">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <h2 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white">Sources</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs shadow-sm hover:shadow-md transition-all duration-200">
                  <Plus className="w-3 h-3 mr-1" />
                  Add
                </Button>
                <Button variant="outline" size="sm" className="text-xs shadow-sm hover:shadow-md transition-all duration-200 hidden sm:flex">
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
          
          <ScrollArea className="flex-1 p-4 lg:p-6">
            <div className="space-y-2 lg:space-y-3">
              {currentConfig.sources.map((source, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-center gap-3 lg:gap-4 p-2 lg:p-3 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-200 cursor-pointer group"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <input type="checkbox" defaultChecked className="rounded shadow-sm flex-shrink-0" />
                  <FileText className="w-4 lg:w-5 h-4 lg:h-5 text-red-500 group-hover:scale-110 transition-transform duration-200 flex-shrink-0" />
                  <span className="text-xs lg:text-sm text-gray-700 dark:text-gray-300 font-medium group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200 truncate">
                    {source}
                  </span>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Center Panel - Chat */}
        <div className="flex-1 flex flex-col bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
          {/* ... keep existing code (center panel) the same ... */}
          <div className="p-4 lg:p-6 border-b border-gray-200/60 dark:border-gray-700/60">
            <h2 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white">Chat</h2>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-8">
            <motion.div 
              className="w-16 lg:w-20 h-16 lg:h-20 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50 rounded-2xl flex items-center justify-center mb-6 lg:mb-8 shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
            >
              <div className="w-8 lg:w-10 h-8 lg:h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-base lg:text-lg">🤖</span>
              </div>
            </motion.div>
            
            <motion.h3 
              className="text-xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2 lg:mb-3 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {currentConfig.title}
            </motion.h3>
            <motion.p 
              className="text-gray-600 dark:text-gray-400 mb-6 lg:mb-10 text-center font-medium text-sm lg:text-base"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {currentConfig.sources.length} sources
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-2 lg:gap-4 mb-6 lg:mb-10 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {currentConfig.actions.map((action, index) => (
                <Button 
                  key={index}
                  variant={action.variant || "outline"} 
                  size={isMobile ? "sm" : "default"}
                  className="flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                  onClick={action.label === "Start Assessment" ? () => setShowAssessment(true) : 
                           action.label === "Mind Map" ? handleMindMapClick : undefined}
                >
                  {action.icon}
                  <span className="hidden sm:inline">{action.label}</span>
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
                className="pr-14 py-3 lg:py-4 rounded-2xl border-2 shadow-lg focus:shadow-xl transition-all duration-200 text-base lg:text-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
              />
              <Button 
                size="sm" 
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 rounded-xl w-8 lg:w-10 h-8 lg:h-10 p-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200`}
              >
                <ChevronDown className="w-4 lg:w-5 h-4 lg:h-5 rotate-[-90deg]" />
              </Button>
            </motion.div>
            
            <motion.p 
              className="text-xs text-gray-500 dark:text-gray-400 mt-4 lg:mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              StudyBuddy AI can be inaccurate; please double check its responses.
            </motion.p>
          </div>
        </div>

        {/* Right Panel - Studio */}
        <div className="w-full lg:w-80 border-t lg:border-l lg:border-t-0 border-gray-200/60 dark:border-gray-700/60 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex flex-col max-h-96 lg:max-h-none">
          {/* ... keep existing code (studio panel) the same ... */}
          <div className="p-4 lg:p-6 border-b border-gray-200/60 dark:border-gray-700/60">
            <h2 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white">Studio</h2>
          </div>
          
          <ScrollArea className="flex-1 p-4 lg:p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {currentConfig.studioCards.map((card, index) => (
                <Card key={index} className="mb-4 lg:mb-6 shadow-lg hover:shadow-xl transition-all duration-200 border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-700/50">
                  <CardHeader className="pb-3 lg:pb-4">
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
                <CardHeader className="pb-3 lg:pb-4">
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
                  
                  <div className="grid grid-cols-2 gap-2 lg:gap-3">
                    <Button variant="outline" size="sm" className="justify-start shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 text-xs">
                      <BookOpen className="w-3 h-3 mr-1 lg:mr-2" />
                      <span className="hidden sm:inline">Study guide</span>
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 text-xs">
                      <FileText className="w-3 h-3 mr-1 lg:mr-2" />
                      <span className="hidden sm:inline">Briefing doc</span>
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 text-xs">
                      <FileEdit className="w-3 h-3 mr-1 lg:mr-2" />
                      <span className="hidden sm:inline">FAQ</span>
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 text-xs">
                      <MapPin className="w-3 h-3 mr-1 lg:mr-2" />
                      <span className="hidden sm:inline">Timeline</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </ScrollArea>
        </div>
      </div>

      {/* Mind Map Dialog */}
      <MindMapDialog 
        open={showMindMap} 
        onOpenChange={setShowMindMap}
      />
    </div>
  );
};

export default LearningContent;
