import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Trash2, MoveUp, MoveDown, FileText, Video, FileImage, File, RefreshCw, Link as LinkIcon } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { EmbedData } from "@/components/ContentEmbedder";
import ContentEmbedder from "@/components/ContentEmbedder";
import { useToast } from "@/hooks/use-toast";
import QuizManager, { Quiz } from "./QuizManager";

export interface Lesson {
  id: string;
  title: string;
  content: string;
  type: string;
  duration: string;
  embedData?: EmbedData;
  quizId?: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

interface ModuleEditorProps {
  initialModule?: Module;
  onSave: (module: Module) => void;
  courseId: string;
}

const ModuleEditor = ({ initialModule, onSave, courseId }: ModuleEditorProps) => {
  const [module, setModule] = useState<Module>(initialModule || {
    id: Date.now().toString(),
    title: "New Module",
    description: "",
    lessons: [],
  });
  
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [quizDialogOpen, setQuizDialogOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [availableQuizzes, setAvailableQuizzes] = useState<Quiz[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const mockQuizzes: Quiz[] = [
      {
        id: "quiz1",
        title: "HTML Basics Quiz",
        description: "Test your knowledge of HTML fundamentals",
        type: "multiple-choice",
        options: [
          { id: "opt1", text: "Option 1", isCorrect: false },
          { id: "opt2", text: "Option 2", isCorrect: true },
        ],
        courseId: courseId
      },
      {
        id: "quiz2",
        title: "CSS Properties Quiz",
        description: "Test your understanding of CSS properties and values",
        type: "single-choice",
        options: [
          { id: "opt1", text: "Option 1", isCorrect: true },
          { id: "opt2", text: "Option 2", isCorrect: false },
        ],
        courseId: courseId
      }
    ];

    setAvailableQuizzes(mockQuizzes);
  }, [courseId]);

  const handleAddLesson = () => {
    setCurrentLesson({
      id: Date.now().toString(),
      title: "",
      content: "",
      type: "text",
      duration: "5 mins"
    });
    setEditingIndex(null);
    setLessonDialogOpen(true);
  };

  const handleEditLesson = (lesson: Lesson, index: number) => {
    setCurrentLesson({ ...lesson });
    setEditingIndex(index);
    setLessonDialogOpen(true);
  };

  const handleSaveLesson = () => {
    if (!currentLesson || !currentLesson.title) return;

    const updatedLessons = [...module.lessons];
    
    if (editingIndex !== null) {
      updatedLessons[editingIndex] = currentLesson;
    } else {
      updatedLessons.push(currentLesson);
    }
    
    setModule({ ...module, lessons: updatedLessons });
    setLessonDialogOpen(false);
    
    toast({
      title: `Lesson ${editingIndex !== null ? "Updated" : "Added"}`,
      description: currentLesson.title,
    });
  };

  const handleSaveQuizzes = (quizzes: Quiz[]) => {
    setAvailableQuizzes(quizzes);
    setQuizDialogOpen(false);
    
    toast({
      title: "Quizzes Saved",
      description: `${quizzes.length} quizzes available for this course.`
    });
  };

  const handleDeleteLesson = (index: number) => {
    const updatedLessons = [...module.lessons];
    updatedLessons.splice(index, 1);
    setModule({ ...module, lessons: updatedLessons });
    
    toast({
      title: "Lesson Deleted",
      description: "The lesson has been removed from this module.",
    });
  };

  const handleMoveLesson = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) || 
      (direction === "down" && index === module.lessons.length - 1)
    ) {
      return;
    }
    
    const updatedLessons = [...module.lessons];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    const lesson = updatedLessons[index];
    
    updatedLessons.splice(index, 1);
    updatedLessons.splice(newIndex, 0, lesson);
    
    setModule({ ...module, lessons: updatedLessons });
  };

  const handleSaveModule = () => {
    if (!module.title) {
      toast({
        title: "Module Title Required",
        description: "Please provide a title for this module.",
        variant: "destructive"
      });
      return;
    }
    
    onSave(module);
    
    toast({
      title: "Module Saved",
      description: "Module and all lessons have been saved successfully.",
    });
  };
  
  const handleAddLessonWithQuiz = (quizId: string) => {
    const quiz = availableQuizzes.find(q => q.id === quizId);
    if (!quiz) return;
    
    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: `Quiz: ${quiz.title}`,
      content: quiz.description,
      type: "quiz",
      duration: "15 mins",
      quizId: quiz.id
    };
    
    setModule({ ...module, lessons: [...module.lessons, newLesson] });
    
    toast({
      title: "Quiz Added as Lesson",
      description: `Quiz "${quiz.title}" has been added to this module.`
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="module-title">Module Title</Label>
          <Input
            id="module-title"
            value={module.title}
            onChange={(e) => setModule({ ...module, title: e.target.value })}
            placeholder="Enter module title"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="module-description">Description</Label>
          <Textarea
            id="module-description"
            value={module.description}
            onChange={(e) => setModule({ ...module, description: e.target.value })}
            placeholder="A short description of this module"
            className="mt-1"
            rows={3}
          />
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <CardTitle className="text-md">Lessons ({module.lessons.length})</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setQuizDialogOpen(true)}>
              Manage Quizzes
            </Button>
            <Button size="sm" onClick={handleAddLesson}>
              <Plus className="h-4 w-4 mr-1" /> Add Lesson
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {module.lessons.length === 0 ? (
            <div className="text-center py-8 border rounded-md bg-muted/20">
              <p className="text-muted-foreground">No lessons have been added to this module yet.</p>
              <Button variant="outline" className="mt-4" onClick={handleAddLesson}>
                <Plus className="h-4 w-4 mr-1" /> Add Your First Lesson
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Accordion type="multiple" className="w-full">
                {module.lessons.map((lesson, index) => (
                  <AccordionItem key={lesson.id} value={lesson.id} className="border rounded-md mb-2">
                    <div className="flex items-center px-4 py-2">
                      <div className="w-6 flex justify-center">
                        {lesson.type === "text" && <FileText className="h-4 w-4 text-muted-foreground" />}
                        {lesson.type === "video" && <Video className="h-4 w-4 text-muted-foreground" />}
                        {lesson.type === "image" && <FileImage className="h-4 w-4 text-muted-foreground" />}
                        {(lesson.type === "file" || lesson.type === "html") && <File className="h-4 w-4 text-muted-foreground" />}
                        {lesson.type === "iframe" && <LinkIcon className="h-4 w-4 text-muted-foreground" />}
                        {lesson.type === "quiz" && <RefreshCw className="h-4 w-4 text-muted-foreground" />}
                      </div>

                      <AccordionTrigger className="flex-1 py-0">
                        <span className="text-left">{lesson.title || "Untitled Lesson"}</span>
                      </AccordionTrigger>

                      <div className="text-xs text-muted-foreground pr-2">
                        {lesson.duration}
                      </div>
                      
                      <div className="flex gap-1 ml-4">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveLesson(index, "up");
                          }}
                          disabled={index === 0}
                        >
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveLesson(index, "down");
                          }}
                          disabled={index === module.lessons.length - 1}
                        >
                          <MoveDown className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditLesson(lesson, index);
                          }}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteLesson(index);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <AccordionContent className="px-4 pt-0 pb-3">
                      {lesson.type === "quiz" ? (
                        <div className="text-sm">
                          <p className="text-muted-foreground mb-2">{lesson.content}</p>
                          <div className="bg-muted/20 p-2 rounded text-xs">
                            Quiz ID: {lesson.quizId}
                          </div>
                        </div>
                      ) : lesson.type === "text" ? (
                        <div className="text-sm" dangerouslySetInnerHTML={{ __html: lesson.content }} />
                      ) : (
                        <div className="text-sm">
                          {lesson.embedData?.url && (
                            <div className="bg-muted/20 p-2 rounded text-xs">
                              URL: {lesson.embedData.url}
                            </div>
                          )}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}

          {availableQuizzes.length > 0 && (
            <div className="mt-6 border-t pt-4">
              <h3 className="text-sm font-medium mb-2">Add Quiz to Module</h3>
              <div className="flex gap-2 flex-wrap">
                {availableQuizzes.map(quiz => (
                  <Button 
                    key={quiz.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddLessonWithQuiz(quiz.id)}
                  >
                    {quiz.title}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveModule}>Save Module</Button>
      </div>

      <Dialog open={lessonDialogOpen} onOpenChange={setLessonDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingIndex !== null ? "Edit Lesson" : "Add New Lesson"}</DialogTitle>
            <DialogDescription>
              Fill in the details for this lesson
            </DialogDescription>
          </DialogHeader>
          
          {currentLesson && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="lesson-title">Lesson Title</Label>
                  <Input
                    id="lesson-title"
                    value={currentLesson.title}
                    onChange={(e) => setCurrentLesson({...currentLesson, title: e.target.value})}
                    placeholder="Enter lesson title"
                    className="mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lesson-type">Lesson Type</Label>
                    <Select
                      value={currentLesson.type}
                      onValueChange={(value) => 
                        setCurrentLesson({...currentLesson, type: value, content: value === 'text' ? currentLesson.content : ''})
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text Content</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="file">File/Document</SelectItem>
                        <SelectItem value="iframe">External Website</SelectItem>
                        <SelectItem value="html">HTML Content</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="lesson-duration">Duration</Label>
                    <Input
                      id="lesson-duration"
                      value={currentLesson.duration}
                      onChange={(e) => setCurrentLesson({...currentLesson, duration: e.target.value})}
                      placeholder="e.g. 10 mins, 1h 30m"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                {currentLesson.type === 'text' && (
                  <div>
                    <Label htmlFor="lesson-content">Content</Label>
                    <Textarea
                      id="lesson-content"
                      value={currentLesson.content}
                      onChange={(e) => setCurrentLesson({...currentLesson, content: e.target.value})}
                      placeholder="Lesson content or description"
                      className="mt-1"
                      rows={6}
                    />
                  </div>
                )}
                
                {currentLesson.type !== 'text' && (
                  <ContentEmbedder
                    onEmbed={(embedData) => 
                      setCurrentLesson({...currentLesson, embedData})
                    }
                  />
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setLessonDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveLesson}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={quizDialogOpen} onOpenChange={setQuizDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Quizzes</DialogTitle>
            <DialogDescription>
              Create and edit quizzes for this course
            </DialogDescription>
          </DialogHeader>
          
          <QuizManager 
            courseId={courseId}
            onSaveQuizzes={handleSaveQuizzes}
            initialQuizzes={availableQuizzes}
          />
          
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModuleEditor;
