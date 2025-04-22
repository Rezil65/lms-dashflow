
import React, { useState, useEffect } from "react";
import { Quiz } from "./QuizManager";
import { toast } from "@/components/ui/use-toast";
import QuizQuestion from "./quiz/QuizQuestion";
import QuizResult from "./quiz/QuizResult";
import QuizTimer from "./quiz/QuizTimer";

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
  const [remainingTime, setRemainingTime] = useState(quiz.options.length * 30);
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
      setSelectedAnswers(prev => 
        prev.includes(optionId) 
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    }
  };
  
  const handleSubmitQuiz = () => {
    setTimerActive(false);
    
    let correctAnswers = 0;
    let totalCorrectOptions = 0;
    
    quiz.options.forEach(option => {
      if (option.isCorrect) {
        totalCorrectOptions++;
        if (selectedAnswers.includes(option.id)) {
          correctAnswers++;
        }
      } else if (selectedAnswers.includes(option.id)) {
        correctAnswers--;
      }
    });
    
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

  const handleTryAgain = () => {
    setQuizSubmitted(false);
    setSelectedAnswers([]);
    setTimerActive(false);
    setRemainingTime(quiz.options.length * 30);
  };

  return (
    <div className={`space-y-6 ${darkMode ? 'text-white' : ''}`}>
      {!quizSubmitted ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <QuizTimer remainingTime={remainingTime} isActive={timerActive} />
          </div>
          
          <QuizQuestion
            quiz={quiz}
            selectedAnswers={selectedAnswers}
            onAnswerChange={handleAnswerChange}
            onSubmit={handleSubmitQuiz}
            currentQuestion={currentQuestion}
          />
        </div>
      ) : (
        <QuizResult
          quiz={quiz}
          score={score}
          selectedAnswers={selectedAnswers}
          onTryAgain={handleTryAgain}
        />
      )}
    </div>
  );
};

export default QuizTaker;
