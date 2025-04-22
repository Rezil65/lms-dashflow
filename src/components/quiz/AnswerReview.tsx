
import React from "react";
import { CheckCircle2, X } from "lucide-react";
import { Quiz } from "../QuizManager";

interface AnswerReviewProps {
  quiz: Quiz;
  selectedAnswers: string[];
}

const AnswerReview = ({ quiz, selectedAnswers }: AnswerReviewProps) => {
  return (
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
  );
};

export default AnswerReview;
