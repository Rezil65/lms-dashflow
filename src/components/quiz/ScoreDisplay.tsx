
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Award, AlertCircle } from "lucide-react";

interface ScoreDisplayProps {
  score: number;
}

const ScoreDisplay = ({ score }: ScoreDisplayProps) => {
  return (
    <div className={`text-center p-6 rounded-lg ${score >= 70 ? 'bg-green-50' : 'bg-amber-50'}`}>
      <div className="mb-2 text-sm font-medium">Your score</div>
      <div className="text-3xl font-bold mb-2">{score}%</div>
      <Progress value={score} className="h-2 mb-4" />
      <div className="mt-3">
        {score >= 70 ? (
          <div className="flex items-center justify-center text-green-600">
            <Award className="h-5 w-5 mr-2" />
            <span>Congratulations! You passed the quiz.</span>
          </div>
        ) : (
          <div className="flex items-center justify-center text-amber-600">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>Try again to improve your score.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoreDisplay;
