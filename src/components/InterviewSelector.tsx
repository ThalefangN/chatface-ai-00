
import React from 'react';
import { cn } from "@/lib/utils";
import { Presentation, Mic, Users, LightbulbIcon, Briefcase } from 'lucide-react';

export type InterviewType = 'presentation' | 'public-speaking' | 'interview' | 'pitch' | 'custom';

interface InterviewOption {
  id: InterviewType;
  label: string;
  icon: React.FC<{ className?: string }>;
  description: string;
}

const interviewOptions: InterviewOption[] = [
  {
    id: 'presentation',
    label: 'Presentation Skills',
    icon: Presentation,
    description: 'Practice delivering clear, engaging presentations with confidence'
  },
  {
    id: 'public-speaking',
    label: 'Public Speaking',
    icon: Mic,
    description: 'Improve your public speaking abilities with targeted feedback'
  },
  {
    id: 'interview',
    label: 'Job Interview',
    icon: Users,
    description: 'Prepare for job interviews with realistic practice scenarios'
  },
  {
    id: 'pitch',
    label: 'Pitch Practice',
    icon: LightbulbIcon,
    description: 'Refine your startup or business pitch with expert guidance'
  },
  {
    id: 'custom',
    label: 'Custom Session',
    icon: Briefcase,
    description: 'Create a customized practice session for your specific needs'
  }
];

interface InterviewSelectorProps {
  selectedType: InterviewType | null;
  onSelect: (type: InterviewType) => void;
  className?: string;
}

const InterviewSelector: React.FC<InterviewSelectorProps> = ({ 
  selectedType, 
  onSelect,
  className
}) => {
  return (
    <div className={cn("space-y-4", className)}>
      <h2 className="text-xl font-semibold mb-4">What would you like to practice?</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {interviewOptions.map((option) => {
          const isSelected = selectedType === option.id;
          const Icon = option.icon;
          
          return (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              className={cn(
                "flex flex-col items-center text-center p-4 rounded-xl transition-all duration-200",
                "border border-border hover:border-primary/50",
                "hover:shadow-md",
                isSelected ? "bg-primary/5 border-primary shadow-sm" : "bg-card"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center mb-3",
                "transition-colors duration-200",
                isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                <Icon className={cn("h-6 w-6", isSelected ? "animate-pulse-soft" : "")} />
              </div>
              
              <h3 className="font-medium">{option.label}</h3>
              <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default InterviewSelector;
