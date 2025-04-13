
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CheckCircle2, X, Award, Clock, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Quiz } from "./QuizManager";
import { toast } from "@/components/ui/use-toast";

interface QuizTakerProps {
  quiz: Quiz;
  onComplete: (score: number, total: number) => void;
  darkMode?: boolean;
}

const QuizTaker = ({ quiz, onComplete, darkMode = false }: QuizTakerProps) => {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [remainingTime, setRemainingTime] = useState(quiz.options.length * 30); // 30 seconds per question
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    
    if (timerActive && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime(prev => prev - 1);
      }, 1000);
    } else if (remainingTime === 0 && timerActive) {
      handleSubmitQuiz();
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [remainingTime, timerActive]);

  useEffect(() => {
    // Reset state when quiz changes
    setSelectedAnswers([]);
    setQuizSubmitted(false);
    setScore(0);
    setCurrentQuestion(0);
    setRemainingTime(quiz.options.length * 30);
    setTimerActive(false);
  }, [quiz]);

  const handleAnswerChange = (optionId: string) => {
    if (!timerActive) setTimerActive(true);
    
    if (quiz.type === 'single-choice') {
      setSelectedAnswers([optionId]);
    } else {
      // For multiple choice
      if (selectedAnswers.includes(optionId)) {
        setSelectedAnswers(selectedAnswers.filter(id => id !== optionId));
      } else {
        setSelectedAnswers([...selectedAnswers, optionId]);
      }
    }
  };
  
  const handleSubmitQuiz = () => {
    setTimerActive(false);
    
    // Calculate score
    let correctAnswers = 0;
    let totalCorrectOptions = 0;
    
    quiz.options.forEach(option => {
      if (option.isCorrect) {
        totalCorrectOptions++;
        if (selectedAnswers.includes(option.id)) {
          correctAnswers++;
        }
      } else if (selectedAnswers.includes(option.id)) {
        // Penalty for wrong answers in multiple choice
        correctAnswers--;
      }
    });
    
    // Ensure score isn't negative
    correctAnswers = Math.max(0, correctAnswers);
    
    const calculatedScore = Math.round((correctAnswers / totalCorrectOptions) * 100);
    setScore(calculatedScore);
    setQuizSubmitted(true);
    
    toast({
      title: "Quiz Submitted",
      description: `You scored ${calculatedScore}%`,
    });
    
    onComplete(calculatedScore, 100);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className={`space-y-6 ${darkMode ? 'text-white' : ''}`}>
      {!quizSubmitted ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-muted-foreground">Question {currentQuestion + 1} of {quiz.options.length}</span>
              <Progress 
                value={((currentQuestion + 1) / quiz.options.length) * 100} 
                className="h-1 mt-1 w-24" 
              />
            </div>
            {timerActive && (
              <div className={`flex items-center gap-1 ${remainingTime < 30 ? 'text-red-500' : ''}`}>
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">{formatTime(remainingTime)}</span>
              </div>
            )}
          </div>

          <div className={`p-4 rounded-md ${darkMode ? 'bg-white/10' : 'bg-white/5 border'}`}>
            <h3 className="font-medium mb-4">{quiz.title || "Select the correct answer(s):"}</h3>
            <p className="mb-4 text-sm">{quiz.description}</p>
            
            {quiz.type === 'single-choice' ? (
              <RadioGroup 
                value={selectedAnswers[0]} 
                onValueChange={(value) => handleAnswerChange(value)}
                className="space-y-2"
              >
                {quiz.options.map((option) => (
                  <div 
                    key={option.id} 
                    className={`flex items-center space-x-2 p-3 rounded-md ${darkMode ? 'hover:bg-white/10' : 'hover:bg-muted/20'} transition-all cursor-pointer`}
                  >
                    <RadioGroupItem 
                      value={option.id} 
                      id={option.id} 
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
              </RadioGroup>
            ) : (
              <div className="space-y-2">
                {quiz.options.map((option) => (
                  <div 
                    key={option.id} 
                    className={`flex items-center space-x-2 p-3 rounded-md ${darkMode ? 'hover:bg-white/10' : 'hover:bg-slate-50'} transition-all cursor-pointer`}
                    onClick={() => handleAnswerChange(option.id)}
                  >
                    <Checkbox 
                      id={option.id} 
                      checked={selectedAnswers.includes(option.id)} 
                      onCheckedChange={() => handleAnswerChange(option.id)}
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
              onClick={handleSubmitQuiz} 
              disabled={selectedAnswers.length === 0}
              className="bg-primary hover:bg-primary/90"
            >
              Submit Answer
            </Button>
          </div>
        </div>
      ) : (
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
                    option.isCorrect ? 'bg-green-50 border border-green-100' : 
                    selectedAnswers.includes(option.id) ? 'bg-red-50 border border-red-100' : 'border'
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
            <Button onClick={() => {
              setQuizSubmitted(false);
              setSelectedAnswers([]);
              setTimerActive(false);
              setRemainingTime(quiz.options.length * 30);
            }}>
              Try Again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizTaker;
