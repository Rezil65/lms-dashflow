
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Quiz } from "@/hooks/use-quiz";
import { useAuth } from "@/context/AuthContext";
import { useQuiz } from "@/hooks/use-quiz";

interface QuizTakerProps {
  quiz: Quiz;
  onComplete?: (score: number, total: number) => void;
}

const QuizTaker = ({ quiz, onComplete }: QuizTakerProps) => {
  const { user } = useAuth();
  const { saveQuizResult } = useQuiz();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const isSingleChoice = currentQuestion?.options.filter(o => o.isCorrect).length <= 1;
  
  const handleOptionChange = (questionId: string, optionId: string, isChecked: boolean) => {
    setSelectedOptions(prev => {
      const updated = { ...prev };
      
      if (isSingleChoice) {
        // For single choice, replace any previous selection
        updated[questionId] = [optionId];
      } else {
        // For multiple choice, add or remove from the array
        const existing = updated[questionId] || [];
        if (isChecked) {
          // Add option if checked
          updated[questionId] = [...existing, optionId];
        } else {
          // Remove option if unchecked
          updated[questionId] = existing.filter(id => id !== optionId);
        }
      }
      
      return updated;
    });
  };
  
  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  const calculateScore = () => {
    let correctAnswers = 0;
    let totalQuestions = quiz.questions.length;
    
    quiz.questions.forEach(question => {
      const selected = selectedOptions[question.id] || [];
      const correctOptionIds = question.options.filter(o => o.isCorrect).map(o => o.id);
      
      // For single choice questions
      if (correctOptionIds.length <= 1) {
        if (selected.length === 1 && correctOptionIds.includes(selected[0])) {
          correctAnswers += 1;
        }
      } else {
        // For multiple choice, all correct options must be selected and no incorrect ones
        const allCorrectSelected = correctOptionIds.every(id => selected.includes(id));
        const noIncorrectSelected = selected.every(id => correctOptionIds.includes(id));
        
        if (allCorrectSelected && noIncorrectSelected) {
          correctAnswers += 1;
        }
      }
    });
    
    return Math.round((correctAnswers / totalQuestions) * 100);
  };
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const calculatedScore = calculateScore();
      setScore(calculatedScore);
      
      if (user?.id && quiz.id) {
        await saveQuizResult(quiz.id, calculatedScore, selectedOptions);
      }
      
      setShowResults(true);
      
      if (onComplete) {
        onComplete(calculatedScore, quiz.questions.length);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!currentQuestion) {
    return <div>No questions available</div>;
  }
  
  if (showResults) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-2xl font-bold">Quiz Complete!</h3>
          <p className="text-lg">Your score: {score}%</p>
        </div>
        
        <div className="space-y-4">
          {quiz.questions.map((question, index) => {
            const selected = selectedOptions[question.id] || [];
            
            return (
              <Card key={question.id} className={`border ${
                selected.some(id => question.options.find(o => o.id === id)?.isCorrect) 
                ? 'border-green-500' : 'border-red-500'
              }`}>
                <CardContent className="pt-4">
                  <div className="mb-2">
                    <span className="font-medium">Question {index + 1}:</span> {question.question}
                  </div>
                  <div className="space-y-2">
                    {question.options.map(option => {
                      const isSelected = selected.includes(option.id);
                      const isCorrect = option.isCorrect;
                      let className = "flex items-center gap-2 p-2 rounded";
                      
                      if (isSelected && isCorrect) {
                        className += " bg-green-100";
                      } else if (isSelected && !isCorrect) {
                        className += " bg-red-100";
                      } else if (!isSelected && isCorrect) {
                        className += " bg-yellow-50";
                      }
                      
                      return (
                        <div key={option.id} className={className}>
                          <div className={`h-4 w-4 rounded-full ${isSelected ? 'bg-primary' : 'bg-muted'}`} />
                          <span>{option.text}</span>
                          {isCorrect && <span className="ml-auto text-green-600 text-sm">(Correct)</span>}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="flex justify-center">
          <Button onClick={() => window.location.reload()}>Take Another Quiz</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground">
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </span>
        <span className="text-sm font-medium">
          {isSingleChoice ? "Single Choice" : "Multiple Choice"}
        </span>
      </div>
      
      <h3 className="text-lg font-medium">{currentQuestion.question}</h3>
      
      <div className="space-y-2">
        {isSingleChoice ? (
          <RadioGroup 
            value={selectedOptions[currentQuestion.id]?.[0] || ""} 
            onValueChange={(value) => handleOptionChange(currentQuestion.id, value, true)}
          >
            {currentQuestion.options.map(option => (
              <div key={option.id} className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        ) : (
          <div className="space-y-2">
            {currentQuestion.options.map(option => {
              const selected = selectedOptions[currentQuestion.id] || [];
              const isSelected = selected.includes(option.id);
              
              return (
                <div key={option.id} className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50">
                  <Checkbox 
                    id={option.id} 
                    checked={isSelected}
                    onCheckedChange={(checked) => 
                      handleOptionChange(currentQuestion.id, option.id, !!checked)
                    }
                  />
                  <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <div className="pt-4 flex justify-end">
        <Button 
          onClick={handleNext}
          disabled={
            isSubmitting || 
            !selectedOptions[currentQuestion.id] || 
            selectedOptions[currentQuestion.id].length === 0
          }
        >
          {isLastQuestion ? "Submit" : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default QuizTaker;
