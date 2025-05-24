import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, BarChart3, FileText, Target, Play, TrendingUp, Users, Clock, Star, CheckCircle, Award, Zap, Brain, BookOpenCheck } from "lucide-react";
import TutorSection from "./TutorSection";
import AssessmentExam from "./AssessmentExam";

interface LearningContentProps {
  subject: string;
}

const LearningContent: React.FC<LearningContentProps> = ({ subject }) => {
  const [showAssessment, setShowAssessment] = useState(false);

  if (showAssessment) {
    return (
      <AssessmentExam 
        subject={subject} 
        onBack={() => setShowAssessment(false)} 
      />
    );
  }

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
          y: 20,
          expanded: true,
          level: 0,
          children: [
            {
              id: 'basic-problems',
              title: 'Basic Problems',
              x: 25,
              y: 45,
              expanded: false,
              level: 1,
              children: [
                { id: 'algebra', title: 'Algebraic Manipulation', x: 15, y: 70, expanded: false, level: 2, children: [] },
                { id: 'calculus-basic', title: 'Basic Derivatives', x: 35, y: 75, expanded: false, level: 2, children: [] }
              ]
            },
            {
              id: 'advanced-problems',
              title: 'Advanced Problems',
              x: 75,
              y: 45,
              expanded: false,
              level: 1,
              children: [
                { id: 'optimization-advanced', title: 'Complex Optimization', x: 85, y: 70, expanded: false, level: 2, children: [] },
                { id: 'ml-applications', title: 'ML Applications', x: 65, y: 75, expanded: false, level: 2, children: [] }
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
          y: 20,
          expanded: true,
          level: 0,
          children: [
            {
              id: 'recent-topics',
              title: 'Recent Topics',
              x: 25,
              y: 45,
              expanded: false,
              level: 1,
              children: [
                { id: 'last-week', title: 'Last Week Learning', x: 15, y: 70, expanded: false, level: 2, children: [] },
                { id: 'key-formulas', title: 'Key Formulas', x: 35, y: 75, expanded: false, level: 2, children: [] }
              ]
            },
            {
              id: 'weak-areas',
              title: 'Areas for Improvement',
              x: 75,
              y: 45,
              expanded: false,
              level: 1,
              children: [
                { id: 'low-confidence', title: 'Low Confidence Topics', x: 85, y: 70, expanded: false, level: 2, children: [] },
                { id: 'common-errors', title: 'Common Errors', x: 65, y: 75, expanded: false, level: 2, children: [] }
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
          y: 20,
          expanded: true,
          level: 0,
          children: [
            {
              id: 'advanced-concepts',
              title: 'Advanced Concepts',
              x: 25,
              y: 45,
              expanded: false,
              level: 1,
              children: [
                { id: 'research-topics', title: 'Current Research', x: 15, y: 70, expanded: false, level: 2, children: [] },
                { id: 'cutting-edge', title: 'Cutting-edge Methods', x: 35, y: 75, expanded: false, level: 2, children: [] }
              ]
            },
            {
              id: 'applications',
              title: 'Real-world Applications',
              x: 75,
              y: 45,
              expanded: false,
              level: 1,
              children: [
                { id: 'industry-cases', title: 'Industry Case Studies', x: 85, y: 70, expanded: false, level: 2, children: [] },
                { id: 'project-work', title: 'Capstone Projects', x: 65, y: 75, expanded: false, level: 2, children: [] }
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
    setZoomLevel(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleDownload = () => {
    // Create a high-quality SVG export
    const svgContent = generateMindMapSVG();
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentConfig.title.replace(/[^a-zA-Z0-9]/g, '_')}_mindmap.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateMindMapSVG = () => {
    const visibleNodes = getAllVisibleNodes(mindMapNodes);
    const connections = getConnections(mindMapNodes);
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .node { font-family: Arial, sans-serif; font-size: 14px; }
      .root-node { font-weight: bold; fill: white; }
      .child-node { font-weight: normal; fill: #1f2937; }
      .connection { stroke: #3b82f6; stroke-width: 2; fill: none; opacity: 0.7; }
    </style>
  </defs>
  <rect width="100%" height="100%" fill="#f8fafc"/>
  
  ${connections.map(conn => {
    const path = generateCurvePath(conn.from, conn.to, 1200, 800);
    return `<path d="${path}" class="connection"/>`;
  }).join('')}
  
  ${visibleNodes.map(node => {
    const x = (node.x / 100) * 1200;
    const y = (node.y / 100) * 800;
    const isRoot = node.id === 'root';
    const bgColor = isRoot ? '#3b82f6' : '#ffffff';
    const textColor = isRoot ? '#ffffff' : '#1f2937';
    const borderColor = isRoot ? '#1d4ed8' : '#d1d5db';
    
    return `
      <g>
        <rect x="${x - 80}" y="${y - 20}" width="160" height="40" rx="8" 
              fill="${bgColor}" stroke="${borderColor}" stroke-width="2"/>
        <text x="${x}" y="${y + 5}" text-anchor="middle" class="node ${isRoot ? 'root-node' : 'child-node'}" 
              fill="${textColor}">${node.title}</text>
        ${node.children.length > 0 ? `
          <circle cx="${x + 70}" cy="${y - 10}" r="8" fill="${node.expanded ? '#3b82f6' : '#d1d5db'}"/>
          <text x="${x + 70}" y="${y - 6}" text-anchor="middle" fill="white" font-size="10">
            ${node.expanded ? '−' : '+'}
          </text>
        ` : ''}
      </g>
    `;
  }).join('')}
</svg>`;
  };

  const repositionChildren = (parentNode: MindMapNode, siblingIndex: number, totalSiblings: number) => {
    // Smart positioning algorithm for better spacing
    const baseAngle = (siblingIndex / Math.max(1, totalSiblings - 1)) * 180 - 90; // -90 to 90 degrees
    const distance = 25 + (parentNode.level * 5); // Increase distance based on level
    
    const angleRad = (baseAngle * Math.PI) / 180;
    const newX = Math.max(5, Math.min(95, parentNode.x + distance * Math.cos(angleRad)));
    const newY = Math.max(10, Math.min(90, parentNode.y + distance * Math.sin(angleRad)));
    
    return { x: newX, y: newY };
  };

  const handleNodeDrag = (nodeId: string, newX: number, newY: number) => {
    const updateNodes = (nodes: MindMapNode[]): MindMapNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, x: newX, y: newY };
        }
        if (node.children.length > 0) {
          return { ...node, children: updateNodes(node.children) };
        }
        return node;
      });
    };
    setMindMapNodes(updateNodes(mindMapNodes));
  };

  const handleMouseDown = (e: React.MouseEvent, nodeId: string, currentX: number, currentY: number) => {
    if (isMobile) return; // Disable dragging on mobile
    e.stopPropagation();
    setDraggedNode(nodeId);
    const rect = e.currentTarget.getBoundingClientRect();
    const containerRect = e.currentTarget.closest('.mind-map-container')?.getBoundingClientRect();
    if (containerRect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedNode || isMobile) return;
    
    const containerRect = e.currentTarget.getBoundingClientRect();
    const newX = ((e.clientX - containerRect.left - dragOffset.x) / containerRect.width) * 100;
    const newY = ((e.clientY - containerRect.top - dragOffset.y) / containerRect.height) * 100;
    
    // Constrain to container bounds
    const constrainedX = Math.max(10, Math.min(90, newX));
    const constrainedY = Math.max(10, Math.min(90, newY));
    
    handleNodeDrag(draggedNode, constrainedX, constrainedY);
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
    setDragOffset({ x: 0, y: 0 });
  };

  const toggleNodeExpansion = (nodeId: string) => {
    const updateNodes = (nodes: MindMapNode[]): MindMapNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          const updatedNode = { ...node, expanded: !node.expanded };
          
          // If expanding, reposition children to prevent overlaps
          if (updatedNode.expanded && updatedNode.children.length > 0) {
            const repositionedChildren = updatedNode.children.map((child, index) => {
              const newPos = repositionChildren(updatedNode, index, updatedNode.children.length);
              return { ...child, x: newPos.x, y: newPos.y };
            });
            return { ...updatedNode, children: repositionedChildren };
          }
          
          return updatedNode;
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

  const generateCurvePath = (from: MindMapNode, to: MindMapNode, width = 100, height = 100) => {
    // Convert percentages to actual coordinates
    const x1 = (from.x / 100) * width;
    const y1 = (from.y / 100) * height;
    const x2 = (to.x / 100) * width;
    const y2 = (to.y / 100) * height;
    
    // Calculate proper connection points at node edges
    const nodeWidth = isMobile ? 120 : 160;
    const nodeHeight = isMobile ? 32 : 40;
    
    // Determine connection direction
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Calculate connection points on node borders
    const fromRadius = nodeWidth / 2;
    const toRadius = nodeWidth / 2;
    
    const fromX = x1 + (dx / distance) * fromRadius;
    const fromY = y1 + (dy / distance) * fromRadius;
    const toX = x2 - (dx / distance) * toRadius;
    const toY = y2 - (dy / distance) * toRadius;
    
    // Create smooth curved path with better control points
    const controlOffset = Math.min(Math.abs(dx), Math.abs(dy)) * 0.4;
    const midX = (fromX + toX) / 2;
    const midY = (fromY + toY) / 2;
    
    const controlX1 = fromX + (dx > 0 ? controlOffset : -controlOffset);
    const controlY1 = fromY;
    const controlX2 = toX - (dx > 0 ? controlOffset : -controlOffset);
    const controlY2 = toY;
    
    return `M ${fromX} ${fromY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${toX} ${toY}`;
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
                  onClick={action.label === "Mind Map" ? handleMindMapClick : undefined}
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
                      <Map className="w-3 h-3 mr-1 lg:mr-2" />
                      <span className="hidden sm:inline">Timeline</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </ScrollArea>
        </div>
      </div>

      {/* Mind Map Dialog - Mobile Responsive */}
      <Dialog open={showMindMap} onOpenChange={setShowMindMap}>
        <DialogContent className="w-screen h-screen max-w-none max-h-none m-0 rounded-none p-0 overflow-hidden">
          {/* Header with mobile-friendly controls */}
          <DialogHeader className="p-3 lg:p-4 border-b bg-white/95 backdrop-blur-sm flex-shrink-0 z-50 relative">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-base lg:text-lg font-medium pr-4 truncate">{currentConfig.title}: Interactive Mind Map</DialogTitle>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs lg:text-sm text-gray-500 hidden sm:block">Based on {currentConfig.sources.length} sources</span>
                {!isMobile && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden lg:inline">Download SVG</span>
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={handleCloseMindMap}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
            {/* Mind Map Content with proper mobile scaling */}
            <div 
              className="mind-map-container w-full h-full relative flex items-center justify-center"
              style={{
                transform: `scale(${isMobile ? Math.min(zoomLevel, 1.2) : zoomLevel})`,
                transformOrigin: 'center center',
                transition: 'transform 0.3s ease'
              }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div className="relative w-[90vw] h-[80vh]">
                {/* Connection lines with improved mobile visibility */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ overflow: 'visible' }}>
                  {connections.map((connection, index) => (
                    <path
                      key={index}
                      d={generateCurvePath(connection.from, connection.to, 90 * window.innerWidth / 100, 80 * window.innerHeight / 100)}
                      stroke="#3b82f6"
                      strokeWidth={isMobile ? "4" : "3"}
                      fill="none"
                      opacity="0.8"
                      strokeDasharray="none"
                      markerEnd="url(#arrowhead)"
                      className="transition-all duration-300"
                    />
                  ))}
                  <defs>
                    <marker id="arrowhead" markerWidth="12" markerHeight="8" 
                      refX="11" refY="4" orient="auto">
                      <polygon points="0 0, 12 4, 0 8" fill="#3b82f6" opacity="0.8" />
                    </marker>
                  </defs>
                </svg>
                
                {/* Mind Map Nodes with mobile-optimized sizing */}
                {visibleNodes.map((node) => (
                  <motion.div
                    key={node.id}
                    className={`absolute group select-none ${node.id === 'root' ? 'z-30' : 'z-20'} ${isMobile ? 'cursor-pointer' : 'cursor-move'}`}
                    style={{
                      left: `${node.x}%`,
                      top: `${node.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
                    onMouseDown={(e) => handleMouseDown(e, node.id, node.x, node.y)}
                    whileHover={!isMobile ? { scale: 1.05 } : {}}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className={`
                      relative rounded-xl shadow-lg border-2 transition-all duration-300 user-select-none text-center
                      ${node.id === 'root' 
                        ? `bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-700 font-bold
                           ${isMobile ? 'px-4 py-2 text-sm min-w-[150px]' : 'px-6 py-3 text-lg min-w-[220px]'}` 
                        : `bg-white text-gray-800 border-gray-300 font-medium hover:shadow-xl hover:border-blue-300
                           ${isMobile ? 'px-3 py-2 text-xs min-w-[120px]' : 'px-6 py-3 text-base min-w-[180px]'}`
                      }
                      ${node.children.length > 0 ? (isMobile ? 'pr-8' : 'pr-12') : ''}
                      ${draggedNode === node.id ? 'shadow-2xl ring-4 ring-blue-300' : ''}
                    `}>
                      <span className="block leading-tight">{node.title}</span>
                      
                      {/* Expand/Collapse Icon - Mobile optimized */}
                      {node.children.length > 0 && (
                        <div 
                          className={`
                            absolute flex items-center justify-center text-sm font-bold cursor-pointer transition-all duration-300 hover:scale-110 border-2 border-white
                            ${node.expanded 
                              ? 'bg-green-500 text-white shadow-lg' 
                              : 'bg-orange-500 text-white shadow-lg'
                            }
                            ${isMobile ? '-top-1 -right-1 w-6 h-6 rounded-full text-xs' : '-top-2 -right-2 w-8 h-8 rounded-full'}
                          `}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleNodeExpansion(node.id);
                          }}
                        >
                          {node.expanded ? '−' : '+'}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Mobile-optimized controls */}
            <div className={`absolute flex gap-2 z-40 ${isMobile ? 'bottom-4 right-4 flex-col' : 'bottom-6 right-6 flex-col gap-3'}`}>
              <Button 
                size="sm" 
                className={`bg-white/90 hover:bg-white text-gray-700 border border-gray-300 rounded-full shadow-lg backdrop-blur-sm ${isMobile ? 'w-10 h-10 p-0' : 'w-12 h-12 p-0'}`}
                onClick={handleZoomIn}
                disabled={zoomLevel >= (isMobile ? 1.2 : 2)}
              >
                <ZoomIn className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />
              </Button>
              <Button 
                size="sm" 
                className={`bg-white/90 hover:bg-white text-gray-700 border border-gray-300 rounded-full shadow-lg backdrop-blur-sm ${isMobile ? 'w-10 h-10 p-0' : 'w-12 h-12 p-0'}`}
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.5}
              >
                <ZoomOut className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />
              </Button>
              <div className={`text-center text-gray-600 bg-white/90 rounded-lg shadow-sm backdrop-blur-sm ${isMobile ? 'text-xs px-2 py-1' : 'text-sm px-2 py-1'}`}>
                {Math.round(zoomLevel * 100)}%
              </div>
            </div>
            
            {/* Instructions - Mobile responsive */}
            <div className={`absolute bg-white/95 backdrop-blur-sm rounded-xl text-gray-700 shadow-lg border border-gray-200 z-40 ${isMobile ? 'top-4 left-4 right-4 p-3 text-xs' : 'top-6 left-6 p-4 text-sm max-w-xs'}`}>
              <p className="font-semibold mb-2 text-blue-600">📍 Interactive Mind Map</p>
              <p className="mb-1">• <strong>{isMobile ? 'Tap' : 'Drag'}</strong> nodes to {isMobile ? 'expand' : 'reposition them'}</p>
              <p className="mb-1">• {isMobile ? 'Tap' : 'Click'} <span className="bg-orange-100 px-1 rounded">+</span> to expand topics</p>
              <p className="mb-1">• {isMobile ? 'Tap' : 'Click'} <span className="bg-green-100 px-1 rounded">−</span> to collapse topics</p>
              <p>• Use zoom controls to navigate</p>
            </div>
            
            {/* Node count indicator */}
            <div className={`absolute bg-white/95 backdrop-blur-sm rounded-lg text-gray-600 shadow-sm border border-gray-200 z-40 ${isMobile ? 'bottom-4 left-4 px-3 py-2 text-xs' : 'bottom-6 left-6 px-4 py-2 text-sm'}`}>
              <span className="font-medium">{visibleNodes.length}</span> nodes visible • {isMobile ? 'Touch to interact' : 'Draggable'}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LearningContent;
