
import React from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Quiz } from "../QuizManager";
import { Progress } from "@/components/ui/progress";

interface QuizQuestionProps {
  quiz: Quiz;
  selectedAnswers: string[];
  onAnswerChange: (optionId: string) => void;
  onSubmit: () => void;
  currentQuestion: number;
}

const QuizQuestion = ({
  quiz,
  selectedAnswers,
  onAnswerChange,
  onSubmit,
  currentQuestion,
}: QuizQuestionProps) => {
  return (
    <div className="space-y-4">
      <div>
        <span className="text-sm text-muted-foreground">
          Question {currentQuestion + 1} of {quiz.options.length}
        </span>
        <Progress
          value={((currentQuestion + 1) / quiz.options.length) * 100}
          className="h-1 mt-1 w-24"
        />
      </div>

      <div className="p-4 rounded-md bg-white/5 border">
        <h3 className="font-medium mb-4">{quiz.title || "Select the correct answer(s):"}</h3>
        <p className="mb-4 text-sm">{quiz.description}</p>

        {quiz.type === 'single-choice' ? (
          <RadioGroup
            value={selectedAnswers[0]}
            onValueChange={(value) => onAnswerChange(value)}
            className="space-y-2"
          >
            {quiz.options.map((option) => (
              <div
                key={option.id}
                className="flex items-center space-x-2 p-3 rounded-md hover:bg-muted/20 transition-all cursor-pointer"
                onClick={() => onAnswerChange(option.id)}
              >
                <RadioGroupItem value={option.id} id={option.id} className="peer" />
                <Label
                  htmlFor={option.id}
                  className="flex-1 cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        ) : (
          <div className="space-y-2">
            {quiz.options.map((option) => (
              <div
                key={option.id}
                className="flex items-center space-x-2 p-3 rounded-md hover:bg-slate-50 transition-all cursor-pointer"
                onClick={() => onAnswerChange(option.id)}
              >
                <Checkbox
                  id={option.id}
                  checked={selectedAnswers.includes(option.id)}
                  onCheckedChange={() => onAnswerChange(option.id)}
                  className="peer"
                />
                <Label
                  htmlFor={option.id}
                  className="flex-1 cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option.text}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={onSubmit}
          disabled={selectedAnswers.length === 0}
          className="bg-primary hover:bg-primary/90"
        >
          Submit Answer
        </Button>
      </div>
    </div>
  );
};

export default QuizQuestion;
