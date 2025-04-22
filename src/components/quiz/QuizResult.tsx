
import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Award, AlertCircle, CheckCircle2, X } from "lucide-react";
import { Quiz } from "../QuizManager";

interface QuizResultProps {
  quiz: Quiz;
  score: number;
  selectedAnswers: string[];
  onTryAgain: () => void;
}

const QuizResult = ({ quiz, score, selectedAnswers, onTryAgain }: QuizResultProps) => {
  return (
    <div className="space-y-6">
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

      <div className="space-y-2">
        <h4 className="font-medium">Review Answers</h4>
        <div className="space-y-2 bg-white p-4 rounded-md">
          {quiz.options.map((option) => (
            <div
              key={option.id}
              className={`p-3 rounded-md flex items-center ${
                option.isCorrect
                  ? 'bg-green-50 border border-green-100'
                  : selectedAnswers.includes(option.id)
                  ? 'bg-red-50 border border-red-100'
                  : 'border'
              }`}
            >
              {option.isCorrect ? (
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
              ) : (
                selectedAnswers.includes(option.id) && (
                  <X className="h-4 w-4 mr-2 text-red-600" />
                )
              )}
              <span>{option.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={onTryAgain}>Try Again</Button>
      </div>
    </div>
  );
};

export default QuizResult;
