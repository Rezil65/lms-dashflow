
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash, Check, X, Save, ListPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import QuizTaker from "./QuizTaker";
import { useQuiz, Quiz as QuizType, QuizQuestion } from "@/hooks/use-quiz";

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  type: "single-choice" | "multiple-choice";
  options: QuizOption[];
  courseId?: string;
  questions?: QuizQuestion[];
}

interface QuizManagerProps {
  courseId?: string;
  onSaveQuizzes?: (quizzes: any[]) => void;
}

const QuizManager = ({ courseId, onSaveQuizzes }: QuizManagerProps) => {
  const { toast } = useToast();
  const { getQuizzesByCourseId, createQuiz, deleteQuiz, loading } = useQuiz();
  const [quizzes, setQuizzes] = useState<QuizType[]>([]);
  const [activeTab, setActiveTab] = useState("existing");
  const [editingQuiz, setEditingQuiz] = useState<QuizType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null);
  const [takingQuiz, setTakingQuiz] = useState<QuizType | null>(null);
  const [newQuestion, setNewQuestion] = useState("");
  const [questionType, setQuestionType] = useState<"single-choice" | "multiple-choice">("single-choice");
  const [options, setOptions] = useState<{ text: string; isCorrect: boolean }[]>([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);
  const [newQuizTitle, setNewQuizTitle] = useState("");
  const [newQuizDescription, setNewQuizDescription] = useState("");
  const [newQuizQuestions, setNewQuizQuestions] = useState<
    { question: string; options: { text: string; isCorrect: boolean }[]; id?: string; type?: "single-choice" | "multiple-choice" }[]
  >([]);

  useEffect(() => {
    if (courseId) {
      loadQuizzes();
    }
  }, [courseId]);

  const loadQuizzes = async () => {
    if (courseId) {
      const loadedQuizzes = await getQuizzesByCourseId(courseId);
      setQuizzes(loadedQuizzes);
    }
  };

  const handleAddOption = () => {
    setOptions([...options, { text: "", isCorrect: false }]);
  };

  const handleOptionChange = (index: number, text: string) => {
    const newOptions = [...options];
    newOptions[index].text = text;
    setOptions(newOptions);
  };

  const handleOptionCorrectChange = (index: number, isCorrect: boolean) => {
    const newOptions = [...options];
    
    if (questionType === "single-choice") {
      // For single choice, only one option can be correct
      newOptions.forEach((option, i) => {
        option.isCorrect = i === index ? isCorrect : false;
      });
    } else {
      // For multiple choice, multiple options can be correct
      newOptions[index].isCorrect = isCorrect;
    }
    
    setOptions(newOptions);
  };

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) {
      toast({
        title: "Question Required",
        description: "Please enter a question.",
        variant: "destructive",
      });
      return;
    }

    // Check if at least one option is marked as correct
    const hasCorrectOption = options.some((opt) => opt.isCorrect);
    if (!hasCorrectOption) {
      toast({
        title: "Correct Answer Required",
        description: "Please mark at least one option as correct.",
        variant: "destructive",
      });
      return;
    }

    // Check if all options have text
    const emptyOptions = options.some((opt) => !opt.text.trim());
    if (emptyOptions) {
      toast({
        title: "Option Text Required",
        description: "All options must have text.",
        variant: "destructive",
      });
      return;
    }

    setNewQuizQuestions([
      ...newQuizQuestions,
      {
        id: `temp-${Date.now()}`,
        question: newQuestion,
        type: questionType,
        options: [...options],
      },
    ]);

    // Reset form for next question
    setNewQuestion("");
    setQuestionType("single-choice");
    setOptions([
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    setNewQuizQuestions(newQuizQuestions.filter((_, i) => i !== index));
  };

  const handleCreateQuiz = async () => {
    if (!newQuizTitle.trim()) {
      toast({
        title: "Quiz Title Required",
        description: "Please enter a title for the quiz.",
        variant: "destructive",
      });
      return;
    }

    if (newQuizQuestions.length === 0) {
      toast({
        title: "Questions Required",
        description: "Please add at least one question to the quiz.",
        variant: "destructive",
      });
      return;
    }

    if (!courseId) {
      toast({
        title: "Course ID Required",
        description: "No course ID provided.",
        variant: "destructive",
      });
      return;
    }

    try {
      const quiz: Omit<QuizType, 'id'> = {
        title: newQuizTitle,
        description: newQuizDescription,
        courseId: courseId,
        questions: newQuizQuestions.map(q => ({
          id: q.id || `temp-${Date.now()}`,
          question: q.question,
          type: q.type || 'single-choice',
          options: q.options.map((opt, idx) => ({
            id: `temp-opt-${idx}-${Date.now()}`,
            text: opt.text,
            isCorrect: opt.isCorrect,
          })),
        }))
      };
      
      await createQuiz(courseId, quiz);
      loadQuizzes();
      
      // Reset form
      setNewQuizTitle("");
      setNewQuizDescription("");
      setNewQuizQuestions([]);
      setActiveTab("existing");
    } catch (error: any) {
      toast({
        title: "Error Creating Quiz",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteQuiz = async () => {
    if (quizToDelete) {
      try {
        const success = await deleteQuiz(quizToDelete);
        if (success) {
          loadQuizzes();
          setQuizToDelete(null);
          setConfirmDeleteOpen(false);
        }
      } catch (error: any) {
        toast({
          title: "Error Deleting Quiz",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleQuizComplete = (score: number) => {
    setTakingQuiz(null);
    toast({
      title: "Quiz Completed",
      description: `You scored ${score}%`,
    });
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="existing">Existing Quizzes</TabsTrigger>
          <TabsTrigger value="create">Create Quiz</TabsTrigger>
        </TabsList>

        <TabsContent value="existing" className="space-y-4 mt-4">
          {loading ? (
            <div className="p-8 text-center">Loading quizzes...</div>
          ) : quizzes.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground mb-4">No quizzes available for this course</p>
              <Button variant="outline" onClick={() => setActiveTab("create")}>
                <Plus className="mr-2 h-4 w-4" /> Create Quiz
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {quizzes.map((quiz) => (
                <Card key={quiz.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{quiz.title}</CardTitle>
                        {quiz.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {quiz.description}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingQuiz(quiz);
                            setDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500"
                          onClick={() => {
                            setQuizToDelete(quiz.id);
                            setConfirmDeleteOpen(true);
                          }}
                        >
                          <Trash className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        {quiz.questions?.length || 0} questions
                      </div>
                      <Button onClick={() => setTakingQuiz(quiz)}>Take Quiz</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="create" className="space-y-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="quiz-title">Quiz Title</Label>
                <Input
                  id="quiz-title"
                  value={newQuizTitle}
                  onChange={(e) => setNewQuizTitle(e.target.value)}
                  placeholder="Enter quiz title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quiz-description">Description (Optional)</Label>
                <Textarea
                  id="quiz-description"
                  value={newQuizDescription}
                  onChange={(e) => setNewQuizDescription(e.target.value)}
                  placeholder="Enter quiz description"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {newQuizQuestions.length > 0 && (
                <div className="space-y-4 mb-8">
                  <h3 className="font-medium">Added Questions</h3>
                  {newQuizQuestions.map((q, index) => (
                    <div key={index} className="border p-4 rounded-md">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{q.question}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveQuestion(index)}
                          className="text-destructive h-8 px-2"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        <p>{q.type === "single-choice" ? "Single choice" : "Multiple choice"}</p>
                        <ul className="list-disc pl-6 mt-1">
                          {q.options.map((opt, optIndex) => (
                            <li key={optIndex} className={opt.isCorrect ? "text-green-600 font-medium" : ""}>
                              {opt.text} {opt.isCorrect && "(Correct)"}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-4 border-t pt-4">
                <h3 className="font-medium">Add New Question</h3>

                <div className="space-y-2">
                  <Label htmlFor="question-text">Question</Label>
                  <Textarea
                    id="question-text"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Enter your question"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Question Type</Label>
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroup
                        value={questionType}
                        onValueChange={(value: "single-choice" | "multiple-choice") => {
                          setQuestionType(value);
                          // Reset correct answers when changing type
                          setOptions(options.map(opt => ({ ...opt, isCorrect: false })));
                        }}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="single-choice" id="single" />
                          <Label htmlFor="single">Single Choice</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="multiple-choice" id="multiple" />
                          <Label htmlFor="multiple">Multiple Choice</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Options</Label>
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="flex-1">
                        <Input
                          value={option.text}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                        />
                      </div>
                      <div className="flex items-center space-x-2 min-w-[80px]">
                        {questionType === "single-choice" ? (
                          <RadioGroup
                            value={options.findIndex(opt => opt.isCorrect) === index ? "true" : "false"}
                            onValueChange={(value) => handleOptionCorrectChange(index, value === "true")}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem value="true" id={`correct-${index}`} />
                            <Label htmlFor={`correct-${index}`}>Correct</Label>
                          </RadioGroup>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`correct-${index}`}
                              checked={option.isCorrect}
                              onCheckedChange={(checked) => handleOptionCorrectChange(index, checked as boolean)}
                            />
                            <Label htmlFor={`correct-${index}`}>Correct</Label>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={handleAddOption} className="mt-2">
                    <Plus className="h-4 w-4 mr-2" /> Add Option
                  </Button>
                </div>

                <Button className="mt-4" onClick={handleAddQuestion} size="sm">
                  <ListPlus className="h-4 w-4 mr-2" /> Add Question to Quiz
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button onClick={handleCreateQuiz} disabled={newQuizQuestions.length === 0}>
              <Save className="h-4 w-4 mr-2" /> Save Quiz
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {takingQuiz && (
        <Dialog open={!!takingQuiz} onOpenChange={(open) => !open && setTakingQuiz(null)}>
          <DialogContent className="max-w-xl mx-auto max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{takingQuiz.title}</DialogTitle>
              {takingQuiz.description && (
                <DialogDescription>{takingQuiz.description}</DialogDescription>
              )}
            </DialogHeader>
            <QuizTaker quiz={takingQuiz} onComplete={handleQuizComplete} />
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Quiz</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this quiz? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteQuiz}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuizManager;
