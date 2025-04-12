
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash2, CheckSquare, CircleCheck, FileImage, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  type: 'multiple-choice' | 'single-choice' | 'image' | '3d-model';
  options: QuizOption[];
  courseId?: string;
  imageUrl?: string;
  modelUrl?: string;
}

interface QuizManagerProps {
  courseId: string;
  onSaveQuizzes: (quizzes: Quiz[]) => void;
  initialQuizzes?: Quiz[];
}

const QuizManager = ({ courseId, onSaveQuizzes, initialQuizzes = [] }: QuizManagerProps) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>(initialQuizzes);
  const [activeQuizIndex, setActiveQuizIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const getNewQuizTemplate = (): Quiz => ({
    id: Date.now().toString(),
    title: "New Quiz",
    description: "",
    type: 'multiple-choice',
    options: [
      { id: "opt1", text: "Option 1", isCorrect: false },
      { id: "opt2", text: "Option 2", isCorrect: false },
    ],
    courseId
  });

  const addNewQuiz = () => {
    const newQuiz = getNewQuizTemplate();
    setQuizzes([...quizzes, newQuiz]);
    setActiveQuizIndex(quizzes.length);
  };

  const deleteQuiz = (index: number) => {
    const updatedQuizzes = [...quizzes];
    updatedQuizzes.splice(index, 1);
    setQuizzes(updatedQuizzes);
    
    if (activeQuizIndex === index) {
      setActiveQuizIndex(null);
    } else if (activeQuizIndex !== null && activeQuizIndex > index) {
      setActiveQuizIndex(activeQuizIndex - 1);
    }
  };

  const updateQuiz = (index: number, updatedQuiz: Quiz) => {
    const updatedQuizzes = [...quizzes];
    updatedQuizzes[index] = updatedQuiz;
    setQuizzes(updatedQuizzes);
  };

  const addOption = (quizIndex: number) => {
    const quiz = quizzes[quizIndex];
    const updatedOptions = [
      ...quiz.options, 
      { 
        id: `opt${quiz.options.length + 1}_${Date.now()}`, 
        text: `Option ${quiz.options.length + 1}`, 
        isCorrect: false 
      }
    ];
    
    updateQuiz(quizIndex, { ...quiz, options: updatedOptions });
  };

  const removeOption = (quizIndex: number, optionIndex: number) => {
    const quiz = quizzes[quizIndex];
    if (quiz.options.length <= 2) {
      toast({
        title: "Cannot Remove",
        description: "A quiz must have at least two options.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedOptions = [...quiz.options];
    updatedOptions.splice(optionIndex, 1);
    updateQuiz(quizIndex, { ...quiz, options: updatedOptions });
  };

  const updateOption = (quizIndex: number, optionIndex: number, field: 'text' | 'isCorrect', value: string | boolean) => {
    const quiz = quizzes[quizIndex];
    const updatedOptions = [...quiz.options];
    
    updatedOptions[optionIndex] = {
      ...updatedOptions[optionIndex],
      [field]: value
    };
    
    updateQuiz(quizIndex, { ...quiz, options: updatedOptions });
  };

  const handleFileUpload = (quizIndex: number, type: 'image' | 'model', file: File) => {
    // In a real app, you'd upload this to storage and get a URL back
    // For now, we'll create an object URL
    const url = URL.createObjectURL(file);
    const quiz = quizzes[quizIndex];
    
    if (type === 'image') {
      updateQuiz(quizIndex, { ...quiz, imageUrl: url });
    } else {
      updateQuiz(quizIndex, { ...quiz, modelUrl: url });
    }
    
    toast({
      title: `${type === 'image' ? 'Image' : '3D Model'} Uploaded`,
      description: `The file has been attached to the quiz.`
    });
  };

  const duplicateQuiz = (index: number) => {
    const quizToDuplicate = quizzes[index];
    const duplicatedQuiz: Quiz = {
      ...quizToDuplicate,
      id: Date.now().toString(),
      title: `${quizToDuplicate.title} (Copy)`,
    };
    
    setQuizzes([...quizzes, duplicatedQuiz]);
    setActiveQuizIndex(quizzes.length);
  };

  const handleSaveQuizzes = () => {
    onSaveQuizzes(quizzes);
    toast({
      title: "Quizzes Saved",
      description: `${quizzes.length} quiz${quizzes.length === 1 ? '' : 'zes'} saved successfully.`
    });
  };

  const renderQuizForm = (quiz: Quiz, index: number) => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor={`quiz-title-${index}`}>Quiz Title</Label>
            <Input
              id={`quiz-title-${index}`}
              value={quiz.title}
              onChange={(e) => updateQuiz(index, { ...quiz, title: e.target.value })}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor={`quiz-description-${index}`}>Description</Label>
            <Textarea
              id={`quiz-description-${index}`}
              value={quiz.description}
              onChange={(e) => updateQuiz(index, { ...quiz, description: e.target.value })}
              className="mt-1"
              placeholder="Quiz instructions or additional context..."
            />
          </div>
          
          <div>
            <Label>Quiz Type</Label>
            <RadioGroup
              value={quiz.type}
              onValueChange={(value: 'multiple-choice' | 'single-choice' | 'image' | '3d-model') => {
                updateQuiz(index, { ...quiz, type: value });
              }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1"
            >
              <div className="flex items-center space-x-2 border rounded-md p-2">
                <RadioGroupItem value="multiple-choice" id={`type-multiple-${index}`} />
                <Label htmlFor={`type-multiple-${index}`} className="flex items-center">
                  <CheckSquare className="h-4 w-4 mr-2" /> Multiple Choice
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 border rounded-md p-2">
                <RadioGroupItem value="single-choice" id={`type-single-${index}`} />
                <Label htmlFor={`type-single-${index}`} className="flex items-center">
                  <CircleCheck className="h-4 w-4 mr-2" /> Single Choice
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 border rounded-md p-2">
                <RadioGroupItem value="image" id={`type-image-${index}`} />
                <Label htmlFor={`type-image-${index}`} className="flex items-center">
                  <FileImage className="h-4 w-4 mr-2" /> Image Quiz
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 border rounded-md p-2">
                <RadioGroupItem value="3d-model" id={`type-3d-${index}`} />
                <Label htmlFor={`type-3d-${index}`} className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                    <path d="M12 22L3 17V7l9-5l9 5v10l-9 5z" />
                    <path d="M12 17L3 12" />
                    <path d="M12 17l9-5" />
                    <path d="M12 7v10" />
                  </svg>
                  3D Model Quiz
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {(quiz.type === 'image' || quiz.type === '3d-model') && (
          <div className="mt-4 border rounded-md p-4">
            <Label>{quiz.type === 'image' ? 'Upload Quiz Image' : 'Upload 3D Model'}</Label>
            <div className="mt-2">
              <input
                type="file"
                accept={quiz.type === 'image' ? "image/*" : ".glb,.gltf"}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(
                      index, 
                      quiz.type === 'image' ? 'image' : 'model',
                      e.target.files[0]
                    );
                  }
                }}
                className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4 file:rounded-md
                  file:border-0 file:text-sm file:font-semibold
                  file:bg-primary file:text-primary-foreground
                  hover:file:bg-primary/90"
              />
            </div>
            
            {quiz.type === 'image' && quiz.imageUrl && (
              <div className="mt-4">
                <img 
                  src={quiz.imageUrl} 
                  alt="Quiz image" 
                  className="max-h-40 rounded-md border"
                />
              </div>
            )}
            
            {quiz.type === '3d-model' && quiz.modelUrl && (
              <div className="mt-2 text-sm text-green-600">
                3D model uploaded successfully
              </div>
            )}
          </div>
        )}

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <Label>Answer Options</Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => addOption(index)}
            >
              <PlusCircle className="h-4 w-4 mr-1" /> Add Option
            </Button>
          </div>
          
          {quiz.options.map((option, optIndex) => (
            <div key={option.id} className="flex items-center space-x-2 mt-2">
              <div className="flex-1">
                <div className="flex items-center">
                  {quiz.type === 'multiple-choice' ? (
                    <Checkbox
                      id={`option-${index}-${optIndex}`}
                      checked={option.isCorrect}
                      onCheckedChange={(checked) => {
                        updateOption(index, optIndex, 'isCorrect', !!checked);
                      }}
                      className="mr-2"
                    />
                  ) : (
                    <RadioGroup
                      value={quiz.options.findIndex(opt => opt.isCorrect).toString()}
                      onValueChange={(value) => {
                        // Set all options to not correct
                        quiz.options.forEach((_, idx) => {
                          updateOption(index, idx, 'isCorrect', idx === parseInt(value));
                        });
                      }}
                      className="flex"
                    >
                      <RadioGroupItem
                        value={optIndex.toString()}
                        id={`option-${index}-${optIndex}`}
                        className="mr-2"
                      />
                    </RadioGroup>
                  )}
                  <Input
                    value={option.text}
                    onChange={(e) => updateOption(index, optIndex, 'text', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeOption(index, optIndex)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Quiz Manager</h2>
        <div className="space-x-2">
          <Button variant="outline" onClick={addNewQuiz}>
            <PlusCircle className="h-4 w-4 mr-2" /> Add Quiz
          </Button>
          <Button onClick={handleSaveQuizzes}>
            Save Quizzes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Quizzes ({quizzes.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {quizzes.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  No quizzes yet. Click "Add Quiz" to create one.
                </div>
              ) : (
                <div className="space-y-2">
                  {quizzes.map((quiz, index) => (
                    <div 
                      key={quiz.id}
                      className={`p-3 rounded-md cursor-pointer flex justify-between items-center ${activeQuizIndex === index ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                      onClick={() => setActiveQuizIndex(index)}
                    >
                      <div>
                        <div className="font-medium">{quiz.title}</div>
                        <div className={`text-xs ${activeQuizIndex === index ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                          {quiz.type === 'multiple-choice' ? 'Multiple Choice' : 
                           quiz.type === 'single-choice' ? 'Single Choice' : 
                           quiz.type === 'image' ? 'Image Quiz' : '3D Model Quiz'}
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateQuiz(index);
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteQuiz(index);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          {activeQuizIndex !== null && quizzes[activeQuizIndex] ? (
            <Card>
              <CardHeader>
                <CardTitle>Edit Quiz</CardTitle>
              </CardHeader>
              <CardContent>
                {renderQuizForm(quizzes[activeQuizIndex], activeQuizIndex)}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-muted-foreground">
                  {quizzes.length === 0 
                    ? "Create a quiz to get started" 
                    : "Select a quiz from the list to edit"}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizManager;
