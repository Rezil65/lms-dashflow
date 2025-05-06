
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Check } from "lucide-react";
import { useQuiz } from '@/hooks/use-quiz';
import { useAuth } from '@/context/AuthContext';

export interface QuizQuestion {
  id: string;
  question: string;
  type?: 'single-choice' | 'multiple-choice';
  options: {
    id?: string;
    text: string;
    isCorrect: boolean;
  }[];
}

interface QuizTakerProps {
  quiz: {
    id?: string;
    title?: string;
    questions: QuizQuestion[];
  };
  onComplete?: (score: number, total: number) => void;
}

const QuizTaker = ({ quiz, onComplete }: QuizTakerProps) => {
  const { user } = useAuth();
  const { submitQuizResult } = useQuiz();

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [score, setScore] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const currentQuestion = quiz.questions[currentStep];
  const isLastQuestion = currentStep === quiz.questions.length - 1;
  const progress = ((currentStep + 1) / quiz.questions.length) * 100;

  const handleSingleAnswer = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: [value]
    });
  };

  const handleMultipleAnswer = (value: string) => {
    const currentAnswers = answers[currentQuestion.id] || [];
    const updated = currentAnswers.includes(value)
      ? currentAnswers.filter(v => v !== value)
      : [...currentAnswers, value];
    
    setAnswers({
      ...answers,
      [currentQuestion.id]: updated
    });
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  const isAnswered = () => {
    return !!(answers[currentQuestion?.id]?.length > 0);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Calculate score
    let correctAnswers = 0;
    quiz.questions.forEach(question => {
      const userAnswers = answers[question.id] || [];
      const correctOptions = question.options
        .filter(o => o.isCorrect)
        .map(o => o.id || o.text);

      if (question.type === 'multiple-choice') {
        // For multiple choice, check that user selected all correct options and no incorrect ones
        const correct = correctOptions.every(opt => userAnswers.includes(opt)) &&
                        userAnswers.every(ans => correctOptions.includes(ans));
        if (correct) correctAnswers++;
      } else {
        // For single choice, check if the selected option is correct
        if (userAnswers.length === 1 && correctOptions.includes(userAnswers[0])) {
          correctAnswers++;
        }
      }
    });

    setScore(correctAnswers);
    setSubmitted(true);

    // If quiz has an ID and user is logged in, submit results
    if (quiz.id && user) {
      try {
        await submitQuizResult({
          quizId: quiz.id,
          score: correctAnswers,
          totalQuestions: quiz.questions.length,
          selectedOptions: answers,
        });
      } catch (error) {
        console.error("Error submitting quiz result:", error);
      }
    }

    // Call onComplete callback if provided
    if (onComplete) {
      onComplete(correctAnswers, quiz.questions.length);
    }

    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="h-6 w-6 text-green-500" /> Quiz Completed
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6 space-y-4">
          <div className="text-4xl font-bold">
            {score} / {quiz.questions.length}
          </div>
          <Progress value={(score! / quiz.questions.length) * 100} className="h-2 w-48 mx-auto" />
          <p className="text-muted-foreground">
            You answered {score} out of {quiz.questions.length} questions correctly.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => {
            setSubmitted(false);
            setCurrentStep(0);
            setAnswers({});
            setScore(null);
          }}>
            Try Again
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {quiz.title || "Quiz"}
        </h3>
        <div className="text-sm text-muted-foreground">
          Question {currentStep + 1} of {quiz.questions.length}
        </div>
      </div>
      
      <Progress value={progress} className="h-2" />
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent>
          {(currentQuestion.type === 'multiple-choice' || 
            currentQuestion.options.filter(o => o.isCorrect).length > 1) ? (
            <div className="space-y-3">
              {currentQuestion.options.map((option, i) => (
                <div key={option.id || i} className="flex items-center space-x-2">
                  <Checkbox
                    id={`option-${i}`}
                    checked={(answers[currentQuestion.id] || []).includes(option.id || option.text)}
                    onCheckedChange={() => handleMultipleAnswer(option.id || option.text)}
                  />
                  <Label htmlFor={`option-${i}`} className="cursor-pointer flex-1">
                    {option.text}
                  </Label>
                </div>
              ))}
            </div>
          ) : (
            <RadioGroup
              value={(answers[currentQuestion.id] || [])[0]}
              onValueChange={handleSingleAnswer}
              className="space-y-3"
            >
              {currentQuestion.options.map((option, i) => (
                <div key={option.id || i} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id || option.text} id={`option-${i}`} />
                  <Label htmlFor={`option-${i}`} className="cursor-pointer flex-1">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          <Button 
            onClick={handleNext}
            disabled={!isAnswered() || isSubmitting}
          >
            {isLastQuestion ? 'Submit' : 'Next'} 
            {!isLastQuestion && <ArrowRight className="ml-1 h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizTaker;
