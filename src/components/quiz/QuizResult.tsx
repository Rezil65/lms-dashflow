
import React from "react";
import { Button } from "@/components/ui/button";
import { Quiz } from "../QuizManager";
import ScoreDisplay from "./ScoreDisplay";
import AnswerReview from "./AnswerReview";

interface QuizResultProps {
  quiz: Quiz;
  score: number;
  selectedAnswers: string[];
  onTryAgain: () => void;
}

const QuizResult = ({ quiz, score, selectedAnswers, onTryAgain }: QuizResultProps) => {
  return (
    <div className="space-y-6">
      <ScoreDisplay score={score} />
      <AnswerReview quiz={quiz} selectedAnswers={selectedAnswers} />
      <div className="flex justify-end">
        <Button onClick={onTryAgain}>Try Again</Button>
      </div>
    </div>
  );
};

export default QuizResult;
