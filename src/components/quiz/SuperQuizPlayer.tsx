
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  ArrowLeft, 
  Clock, 
  Flag,
  CheckCircle, 
  X, 
  Award,
  BarChart3,
  AlertTriangle,
  Maximize2,
  Minimize2
} from "lucide-react";

export interface QuizQuestion {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  type: 'single-choice' | 'multiple-choice' | 'true-false';
}

interface SuperQuizPlayerProps {
  title: string;
  description?: string;
  questions: QuizQuestion[];
  timeLimit?: number; // in seconds
  onComplete?: (score: number, answers: Record<string, string[]>) => void;
  preventCheating?: boolean;
}

export const SuperQuizPlayer: React.FC<SuperQuizPlayerProps> = ({
  title,
  description,
  questions,
  timeLimit = 300, // 5 minutes default
  onComplete,
  preventCheating = false
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<string[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [remainingTime, setRemainingTime] = useState(timeLimit);
  const [showReview, setShowReview] = useState(false);
  const [score, setScore] = useState({ correct: 0, incorrect: 0, total: questions.length });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  
  // Format time as mm:ss
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle timer
  useEffect(() => {
    if (!quizCompleted && !showReview) {
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleSubmitQuiz();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [quizCompleted, showReview]);

  // Handle fullscreen mode for cheating prevention
  useEffect(() => {
    if (preventCheating) {
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden' && !quizCompleted) {
          // Log potential cheating attempt
          console.log('User left the page - potential cheating attempt');
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [preventCheating, quizCompleted]);

  // Handle keyup events for keyboard navigation
  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (!quizCompleted) {
        switch (e.key) {
          case 'ArrowRight':
            if (currentQuestionIndex < questions.length - 1) {
              setCurrentQuestionIndex(currentQuestionIndex + 1);
            }
            break;
          case 'ArrowLeft':
            if (currentQuestionIndex > 0) {
              setCurrentQuestionIndex(currentQuestionIndex - 1);
            }
            break;
          case 'f':
            handleFlagQuestion();
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keyup', handleKeyUp);
    return () => window.removeEventListener('keyup', handleKeyUp);
  }, [currentQuestionIndex, questions.length, quizCompleted]);

  // Calculate quiz progress percentage
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleSingleChoiceAnswer = (optionId: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: [optionId]
    });
  };

  const handleMultipleChoiceAnswer = (optionId: string) => {
    const currentAnswers = answers[currentQuestion.id] || [];
    const updatedAnswers = currentAnswers.includes(optionId)
      ? currentAnswers.filter(id => id !== optionId)
      : [...currentAnswers, optionId];
    
    setAnswers({
      ...answers,
      [currentQuestion.id]: updatedAnswers
    });
  };

  const handleFlagQuestion = () => {
    if (flaggedQuestions.includes(currentQuestion.id)) {
      setFlaggedQuestions(flaggedQuestions.filter(id => id !== currentQuestion.id));
    } else {
      setFlaggedQuestions([...flaggedQuestions, currentQuestion.id]);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = () => {
    // Calculate score
    let correctCount = 0;
    let incorrectCount = 0;

    questions.forEach((question) => {
      const userAnswers = answers[question.id] || [];
      const correctOptions = question.options.filter(opt => opt.isCorrect).map(opt => opt.id);

      // For single choice questions
      if (question.type === 'single-choice' || question.type === 'true-false') {
        if (userAnswers.length === 1 && correctOptions.includes(userAnswers[0])) {
          correctCount++;
        } else if (userAnswers.length > 0) {
          incorrectCount++;
        }
      } 
      // For multiple choice questions
      else {
        // Check that all correct options are selected and no incorrect ones
        const allCorrectSelected = correctOptions.every(id => userAnswers.includes(id));
        const noIncorrectSelected = userAnswers.every(id => correctOptions.includes(id));
        
        if (allCorrectSelected && noIncorrectSelected && userAnswers.length > 0) {
          correctCount++;
        } else if (userAnswers.length > 0) {
          incorrectCount++;
        }
      }
    });

    setScore({
      correct: correctCount,
      incorrect: incorrectCount,
      total: questions.length
    });

    setQuizCompleted(true);
    if (onComplete) {
      onComplete(correctCount, answers);
    }
  };

  const handleReviewQuiz = () => {
    setShowReview(true);
  };

  const isQuestionAnswered = (questionId: string) => {
    return answers[questionId] && answers[questionId].length > 0;
  };

  const isQuestionFlagged = (questionId: string) => {
    return flaggedQuestions.includes(questionId);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Render different question types
  const renderQuestion = (question: QuizQuestion) => {
    const selectedAnswers = answers[question.id] || [];
    
    switch (question.type) {
      case 'single-choice':
      case 'true-false':
        return (
          <RadioGroup 
            value={selectedAnswers[0] || ""}
            onValueChange={handleSingleChoiceAnswer}
            className="space-y-3"
          >
            {question.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2 p-3 rounded-md hover:bg-muted/20 transition-all">
                <RadioGroupItem id={option.id} value={option.id} />
                <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );
      case 'multiple-choice':
        return (
          <div className="space-y-3">
            {question.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2 p-3 rounded-md hover:bg-muted/20 transition-all">
                <Checkbox 
                  id={option.id} 
                  checked={selectedAnswers.includes(option.id)}
                  onCheckedChange={() => handleMultipleChoiceAnswer(option.id)}
                />
                <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                  {option.text}
                </Label>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  // Render the quiz review
  const renderQuizReview = () => {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2 py-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-4">
            <Award className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Quiz Completed!</h1>
          <div className="text-4xl font-bold">
            {Math.round((score.correct / score.total) * 100)}%
          </div>
          <p className="text-muted-foreground">
            You answered {score.correct} out of {score.total} questions correctly.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <h2 className="text-lg font-semibold">Score Breakdown</h2>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                  <div className="text-2xl font-bold">{score.correct}</div>
                  <div className="text-sm text-muted-foreground">Correct</div>
                </div>
                <div className="flex flex-col items-center p-4 bg-red-50 rounded-lg">
                  <X className="h-8 w-8 text-red-500 mb-2" />
                  <div className="text-2xl font-bold">{score.incorrect}</div>
                  <div className="text-sm text-muted-foreground">Incorrect</div>
                </div>
                <div className="flex flex-col items-center p-4 bg-amber-50 rounded-lg">
                  <Flag className="h-8 w-8 text-amber-500 mb-2" />
                  <div className="text-2xl font-bold">{flaggedQuestions.length}</div>
                  <div className="text-sm text-muted-foreground">Flagged</div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-2">Performance</h3>
                <div className="bg-muted/30 h-8 rounded-lg overflow-hidden flex">
                  <div 
                    className="bg-green-500 h-full flex items-center justify-center text-xs text-white"
                    style={{ width: `${(score.correct / score.total) * 100}%` }}
                  >
                    {Math.round((score.correct / score.total) * 100)}%
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-2">
                <h3 className="font-medium">Time taken</h3>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{formatTime(timeLimit - remainingTime)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Take Another Quiz
            </Button>
            <Button onClick={() => window.location.href = '/quiz'}>
              Back to Quizzes
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Render question navigation for review mode
  const renderQuestionNavigation = () => {
    return (
      <div className="flex flex-wrap gap-2 mb-4">
        {questions.map((question, index) => (
          <Button
            key={question.id}
            variant={currentQuestionIndex === index ? "default" : 
                   (isQuestionAnswered(question.id) ? "outline" : "ghost")}
            size="sm"
            className={`h-9 w-9 p-0 relative ${
              isQuestionFlagged(question.id) ? 'ring-2 ring-amber-500' : ''
            }`}
            onClick={() => setCurrentQuestionIndex(index)}
          >
            {index + 1}
            {isQuestionFlagged(question.id) && (
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-amber-500"></span>
            )}
          </Button>
        ))}
      </div>
    );
  };

  // If we're in review mode, show the review UI
  if (quizCompleted) {
    return renderQuizReview();
  }

  return (
    <div className={`w-full ${isFullscreen ? 'fixed inset-0 bg-background z-50 overflow-auto p-6' : ''}`}>
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{title}</CardTitle>
              {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={remainingTime < 60 ? "destructive" : "secondary"} className="gap-1 text-sm py-1">
                <Clock className="h-3.5 w-3.5" />
                {formatTime(remainingTime)}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <Progress value={progressPercentage} className="h-1 mt-4" />
          
          <div className="flex justify-between text-sm mt-2">
            <div className="flex gap-2">
              <Badge variant="outline">{currentQuestionIndex + 1} of {questions.length}</Badge>
              <Badge variant="outline">
                {currentQuestion.type === 'single-choice' ? 'Single Choice' : 
                 currentQuestion.type === 'multiple-choice' ? 'Multiple Choice' : 'True/False'}
              </Badge>
            </div>
            <Button
              variant={isQuestionFlagged(currentQuestion.id) ? "default" : "outline"}
              size="sm"
              className={`gap-1 ${isQuestionFlagged(currentQuestion.id) ? 'bg-amber-500 hover:bg-amber-600' : ''}`}
              onClick={handleFlagQuestion}
            >
              <Flag className="h-3.5 w-3.5" />
              {isQuestionFlagged(currentQuestion.id) ? 'Flagged' : 'Flag Question'}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="p-4 rounded-md bg-muted/10 border">
            <h2 className="text-lg font-medium mb-1">Question {currentQuestionIndex + 1}</h2>
            <p className="text-base">{currentQuestion.question}</p>
          </div>
          
          <div className="space-y-2">
            {renderQuestion(currentQuestion)}
          </div>

          {showReview && renderQuestionNavigation()}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <div>
            <Button 
              variant="outline" 
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
          </div>
          
          <div className="flex gap-2">
            {!showReview && currentQuestionIndex === questions.length - 1 && (
              <Button 
                variant="outline"
                onClick={handleReviewQuiz}
                className="gap-1"
              >
                <BarChart3 className="h-4 w-4 mr-1" /> Review Answers
              </Button>
            )}
            
            {currentQuestionIndex < questions.length - 1 ? (
              <Button onClick={handleNextQuestion}>
                Next <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmitQuiz}
                className="bg-green-600 hover:bg-green-700"
              >
                Submit Quiz
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
