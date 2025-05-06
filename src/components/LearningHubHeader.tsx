
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface LearningHubHeaderProps {
  title: string;
  onPrevious: () => void;
  onNext: () => void;
  onMarkComplete: () => void;
}

const LearningHubHeader = ({ title, onPrevious, onNext, onMarkComplete }: LearningHubHeaderProps) => {
  return (
    <div className="p-4 bg-background border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onPrevious} className="hover-scale">
            <ChevronLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-0.5" /> Previous
          </Button>
          <div className="hidden md:block">|</div>
          <Button variant="ghost" size="sm" onClick={onNext} className="hover-scale">
            Next <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
        <h1 className="text-lg font-medium hidden md:block">{title}</h1>
        <Button variant="outline" size="sm" onClick={onMarkComplete} className="ml-auto md:ml-0 hover-scale button-3d">
          Mark Complete
        </Button>
      </div>
    </div>
  );
};

export default LearningHubHeader;
