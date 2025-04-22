
import React from "react";
import { Clock } from "lucide-react";

interface QuizTimerProps {
  remainingTime: number;
  isActive: boolean;
}

const QuizTimer = ({ remainingTime, isActive }: QuizTimerProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!isActive) return null;

  return (
    <div className={`flex items-center gap-1 ${remainingTime < 30 ? 'text-red-500' : ''}`}>
      <Clock className="h-4 w-4" />
      <span className="text-sm font-medium">{formatTime(remainingTime)}</span>
    </div>
  );
};

export default QuizTimer;
