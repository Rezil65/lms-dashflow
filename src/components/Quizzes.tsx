
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, CheckCircle2, Clock, Award, X } from "lucide-react";
import { Quiz } from "./QuizManager";
import { useNavigate } from "react-router-dom";
import { Progress } from "./ui/progress";
import { 
  Dialog, 
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface QuizzesProps {
  isPreview?: boolean;
  courseId?: string;
}

const Quizzes = ({ isPreview = false, courseId }: QuizzesProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [quizDialogOpen, setQuizDialogOpen] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>([]);
  
  useEffect(() => {
    // Simulating API call to fetch quizzes
    const fetchQuizzes = async () => {
      setLoading(true);
      
      // Check localStorage first for any quizzes
      const storedQuizzes = localStorage.getItem('quizzes');
      let availableQuizzes: Quiz[] = [];
      
      if (storedQuizzes) {
        const parsedQuizzes = JSON.parse(storedQuizzes);
        // Filter by courseId if provided
        availableQuizzes = courseId 
          ? parsedQuizzes.filter((q: Quiz) => q.courseId === courseId)
          : parsedQuizzes;
      }
      
      // If no stored quizzes, use mock data
      if (availableQuizzes.length === 0) {
        // Mock data
        availableQuizzes = [
          {
            id: "quiz1",
            title: "HTML Basics Quiz",
            description: "Test your knowledge of HTML fundamentals",
            type: "multiple-choice",
            options: [
              { id: "opt1", text: "HTML stands for HyperText Markup Language", isCorrect: true },
              { id: "opt2", text: "HTML is a programming language", isCorrect: false },
              { id: "opt3", text: "HTML can only be used with JavaScript", isCorrect: false },
            ],
            courseId: "course1"
          },
          {
            id: "quiz2",
            title: "CSS Properties Quiz",
            description: "Test your understanding of CSS properties and values",
            type: "single-choice",
            options: [
              { id: "opt1", text: "CSS stands for Cascading Style Sheets", isCorrect: true },
              { id: "opt2", text: "CSS is only used for animations", isCorrect: false },
              { id: "opt3", text: "CSS files must have a .style extension", isCorrect: false },
            ],
            courseId: "course1"
          },
          {
            id: "quiz3",
            title: "JavaScript Functions",
            description: "Test your knowledge of JavaScript functions and scope",
            type: "multiple-choice",
            options: [
              { id: "opt1", text: "Functions can be passed as arguments to other functions", isCorrect: true },
              { id: "opt2", text: "Functions always need a return statement", isCorrect: false },
              { id: "opt3", text: "Arrow functions have their own 'this' binding", isCorrect: false },
              { id: "opt4", text: "Functions are first-class citizens in JavaScript", isCorrect: true },
            ],
            courseId: "course2"
          }
        ];
      }
      
      // Get completed quizzes from localStorage
      const storedCompletedQuizzes = localStorage.getItem('completedQuizzes');
      if (storedCompletedQuizzes) {
        setCompletedQuizzes(JSON.parse(storedCompletedQuizzes));
      }
      
      setTimeout(() => {
        setQuizzes(isPreview ? availableQuizzes.slice(0, 2) : availableQuizzes);
        setLoading(false);
      }, 500);
    };
    
    fetchQuizzes();
  }, [isPreview, courseId]);

  const handleTakeQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setSelectedAnswers([]);
    setQuizSubmitted(false);
    setScore(0);
    setQuizDialogOpen(true);
  };
  
  const handleAnswerChange = (optionId: string) => {
    if (activeQuiz?.type === 'single-choice') {
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
    if (!activeQuiz) return;
    
    // Calculate score
    let correctAnswers = 0;
    let totalCorrectOptions = 0;
    
    activeQuiz.options.forEach(option => {
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
    
    // Save to completed quizzes if passing score
    if (calculatedScore >= 70 && activeQuiz.id) {
      const updatedCompletedQuizzes = [...completedQuizzes, activeQuiz.id];
      setCompletedQuizzes(updatedCompletedQuizzes);
      localStorage.setItem('completedQuizzes', JSON.stringify(updatedCompletedQuizzes));
      
      toast({
        title: "Quiz Completed!",
        description: `You scored ${calculatedScore}%. ${calculatedScore >= 70 ? "Great job!" : "Try again to improve your score."}`
      });
    }
  };

  const isQuizCompleted = (quizId: string) => completedQuizzes.includes(quizId);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Available Quizzes</h3>
        {isPreview && (
          <Button variant="ghost" size="sm" className="text-sm" onClick={() => navigate('/learner?tab=quizzes')}>
            View All <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
      
      {loading ? (
        <div className="space-y-4">
          <div className="h-24 rounded-md bg-gray-100 animate-pulse"></div>
          <div className="h-24 rounded-md bg-gray-100 animate-pulse"></div>
        </div>
      ) : quizzes.length > 0 ? (
        <div className="space-y-3">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className={`hover:shadow-md transition-shadow ${isQuizCompleted(quiz.id) ? 'border-green-200' : ''}`}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-md">{quiz.title}</h4>
                      <Badge variant="outline" className="ml-auto capitalize">
                        {quiz.type === 'multiple-choice' ? 'Multiple Choice' : 'Single Choice'}
                      </Badge>
                      {isQuizCompleted(quiz.id) && (
                        <Badge variant="default" className="bg-green-500">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Completed
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {quiz.description}
                    </p>
                    <div className="flex items-center mt-3 justify-between">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {quiz.options.length} questions
                      </div>
                      <Button 
                        variant={isQuizCompleted(quiz.id) ? "outline" : "default"}
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => handleTakeQuiz(quiz)}
                      >
                        {isQuizCompleted(quiz.id) ? 'Retake Quiz' : 'Take Quiz'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border rounded-md bg-gray-50">
          <p className="text-muted-foreground">No quizzes available</p>
        </div>
      )}
      
      <Dialog open={quizDialogOpen} onOpenChange={setQuizDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{activeQuiz?.title}</DialogTitle>
            <DialogDescription>
              {activeQuiz?.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {!quizSubmitted ? (
              <div className="space-y-4">
                {activeQuiz?.type === 'single-choice' ? (
                  <RadioGroup 
                    value={selectedAnswers[0]} 
                    onValueChange={(value) => setSelectedAnswers([value])}
                  >
                    {activeQuiz?.options.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-slate-50">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                          {option.text}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="space-y-2">
                    {activeQuiz?.options.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-slate-50">
                        <Checkbox 
                          id={option.id} 
                          checked={selectedAnswers.includes(option.id)} 
                          onCheckedChange={() => handleAnswerChange(option.id)}
                        />
                        <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                          {option.text}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="mb-2">Your score</div>
                  <div className="text-3xl font-bold">{score}%</div>
                  <div className="mt-3">
                    {score >= 70 ? (
                      <div className="flex items-center justify-center text-green-600">
                        <Award className="h-5 w-5 mr-2" />
                        <span>Congratulations! You passed the quiz.</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center text-amber-600">
                        <X className="h-5 w-5 mr-2" />
                        <span>Try again to improve your score.</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Review Answers</h4>
                  {activeQuiz?.options.map((option) => (
                    <div 
                      key={option.id} 
                      className={`p-2 rounded-md flex items-center ${
                        option.isCorrect ? 'bg-green-50 text-green-800' : 
                        selectedAnswers.includes(option.id) ? 'bg-red-50 text-red-800' : ''
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
            )}
          </div>
          
          <DialogFooter>
            {!quizSubmitted ? (
              <Button 
                onClick={handleSubmitQuiz} 
                disabled={selectedAnswers.length === 0}
              >
                Submit Answers
              </Button>
            ) : (
              <Button onClick={() => setQuizDialogOpen(false)}>Close</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Quizzes;
