
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Quiz } from "@/hooks/use-quiz";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock, ArrowRight, RotateCcw } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface QuizTakerProps {
  quiz: Quiz;
  onComplete: (score: number, total: number) => void;
  darkMode?: boolean;
}

const QuizTaker = ({ quiz, onComplete, darkMode = false }: QuizTakerProps) => {
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [remainingTime, setRemainingTime] = useState(quiz.questions.length * 30);
  const [timerActive, setTimerActive] = useState(false);

  // Initialize selectedAnswers with empty arrays for each question
  useEffect(() => {
    const initialAnswers: Record<string, string[]> = {};
    quiz.questions.forEach(question => {
      initialAnswers[question.id] = [];
    });
    setSelectedAnswers(initialAnswers);
    setQuizSubmitted(false);
    setCurrentQuestionIndex(0);
    setRemainingTime(quiz.questions.length * 30);
    setTimerActive(false);
  }, [quiz]);

  // Timer effect
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

  const handleAnswerChange = (questionId: string, optionId: string, isSingleChoice: boolean) => {
    if (!timerActive) setTimerActive(true);
    
    setSelectedAnswers(prev => {
      const updated = { ...prev };

      if (isSingleChoice) {
        // For single choice questions, replace the selected answer
        updated[questionId] = [optionId];
      } else {
        // For multiple choice, toggle the selection
        if (updated[questionId].includes(optionId)) {
          updated[questionId] = updated[questionId].filter(id => id !== optionId);
        } else {
          updated[questionId] = [...updated[questionId], optionId];
        }
      }

      return updated;
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  const handleSubmitQuiz = () => {
    setTimerActive(false);
    
    let correctCount = 0;
    let totalPossiblePoints = 0;
    
    quiz.questions.forEach(question => {
      const correctOptionIds = question.options
        .filter(option => option.isCorrect)
        .map(option => option.id);
      
      const userSelectedIds = selectedAnswers[question.id] || [];
      
      // Count as correct only if user selected all correct options and no incorrect ones
      const allCorrectSelected = correctOptionIds.every(id => userSelectedIds.includes(id));
      const noIncorrectSelected = userSelectedIds.every(id => correctOptionIds.includes(id));
      
      if (allCorrectSelected && noIncorrectSelected) {
        correctCount++;
      }
      
      totalPossiblePoints++;
    });
    
    const calculatedScore = Math.round((correctCount / totalPossiblePoints) * 100);
    setScore(calculatedScore);
    setQuizSubmitted(true);
    
    onComplete(calculatedScore, totalPossiblePoints);
  };

  const handleTryAgain = () => {
    setQuizSubmitted(false);
    // Reset selected answers
    const resetAnswers: Record<string, string[]> = {};
    quiz.questions.forEach(question => {
      resetAnswers[question.id] = [];
    });
    setSelectedAnswers(resetAnswers);
    setCurrentQuestionIndex(0);
    setRemainingTime(quiz.questions.length * 30);
    setTimerActive(false);
  };

  // Format remaining time as minutes:seconds
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Current question
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isSingleChoice = quiz.type === 'single-choice' || 
    (currentQuestion.options.filter(o => o.isCorrect).length === 1);

  // Results view
  if (quizSubmitted) {
    return (
      <div className={`space-y-6 ${darkMode ? 'text-white' : ''}`}>
        <Card>
          <CardHeader>
            <CardTitle>Quiz Results</CardTitle>
            <CardDescription>
              You scored {score}% ({Math.round(score * quiz.questions.length / 100)} out of {quiz.questions.length} correct)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={score} className="h-2" />
            
            <div className="space-y-4 mt-4">
              {quiz.questions.map((question, index) => {
                const userSelectedIds = selectedAnswers[question.id] || [];
                const correctOptionIds = question.options
                  .filter(option => option.isCorrect)
                  .map(option => option.id);
                
                const allCorrectSelected = correctOptionIds.every(id => userSelectedIds.includes(id));
                const noIncorrectSelected = userSelectedIds.every(id => correctOptionIds.includes(id));
                const isCorrect = allCorrectSelected && noIncorrectSelected;
                
                return (
                  <div key={question.id} className={`p-4 border rounded-md ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className="flex items-start gap-2">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      )}
                      <div>
                        <p className="font-medium mb-2">{index + 1}. {question.question}</p>
                        <div className="space-y-2">
                          {question.options.map(option => {
                            const isSelected = userSelectedIds.includes(option.id);
                            const isCorrectOption = option.isCorrect;
                            
                            return (
                              <div 
                                key={option.id}
                                className={`flex items-center p-2 rounded ${
                                  isSelected && isCorrectOption ? 'bg-green-100' :
                                  isSelected && !isCorrectOption ? 'bg-red-100' :
                                  !isSelected && isCorrectOption ? 'bg-green-50' : ''
                                }`}
                              >
                                <div className="mr-2">
                                  {isSelected && isCorrectOption && <CheckCircle className="h-4 w-4 text-green-600" />}
                                  {isSelected && !isCorrectOption && <XCircle className="h-4 w-4 text-red-600" />}
                                  {!isSelected && isCorrectOption && <CheckCircle className="h-4 w-4 text-green-600 opacity-50" />}
                                </div>
                                <span>{option.text}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <Button onClick={handleTryAgain} className="w-full mt-4">
              <RotateCcw className="h-4 w-4 mr-2" /> Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quiz taking view
  return (
    <div className={`space-y-6 ${darkMode ? 'text-white' : ''}`}>
      <div className="flex justify-between items-center">
        <div className="text-sm">
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{formatTime(remainingTime)}</span>
        </div>
      </div>
      
      <Progress value={(currentQuestionIndex / quiz.questions.length) * 100} className="h-1.5" />
      
      <div className="py-4">
        <h3 className="text-xl font-medium mb-4">{currentQuestion.question}</h3>
        
        <div className="space-y-3 mt-6">
          {isSingleChoice ? (
            <RadioGroup 
              value={selectedAnswers[currentQuestion.id]?.[0] || ""}
              onValueChange={(value) => handleAnswerChange(currentQuestion.id, value, true)}
              className="space-y-3"
            >
              {currentQuestion.options.map(option => (
                <div key={option.id} className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted/50">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="flex-1 cursor-pointer">{option.text}</Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <div className="space-y-3">
              {currentQuestion.options.map(option => {
                const isSelected = selectedAnswers[currentQuestion.id]?.includes(option.id) || false;
                return (
                  <div 
                    key={option.id} 
                    className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted/50"
                    onClick={() => handleAnswerChange(currentQuestion.id, option.id, false)}
                  >
                    <Checkbox 
                      id={option.id}
                      checked={isSelected}
                      onCheckedChange={() => handleAnswerChange(currentQuestion.id, option.id, false)}
                    />
                    <Label htmlFor={option.id} className="flex-1 cursor-pointer">{option.text}</Label>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        
        {currentQuestionIndex < quiz.questions.length - 1 ? (
          <Button onClick={handleNextQuestion}>
            Next <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmitQuiz}>
            Submit Quiz
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizTaker;
