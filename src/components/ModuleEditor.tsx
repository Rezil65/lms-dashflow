
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import ContentEmbedder from "@/components/ContentEmbedder";
import { useToast } from "@/hooks/use-toast";
import QuizManager, { Quiz } from "./QuizManager";

export interface EmbedData {
  url: string;
  width?: string;
  height?: string;
  title?: string;
  type?: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  type: string;
  duration: string;
  embedData?: EmbedData;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

interface ModuleEditorProps {
  courseId: string;
  initialModule?: Module;
  onSave?: (module: Module) => void;
  onCancel?: () => void;
}

const defaultModule: Module = {
  id: "",
  title: "",
  description: "",
  lessons: []
};

const ModuleEditor = ({
  courseId,
  initialModule = defaultModule,
  onSave,
  onCancel
}: ModuleEditorProps) => {
  const [module, setModule] = useState<Module>(initialModule);
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<Lesson>({
    id: "",
    title: "",
    content: "",
    type: "text",
    duration: "30 minutes"
  });
  const [isEditingLesson, setIsEditingLesson] = useState(false);
  const [currentLessonIndex, setCurrentLessonIndex] = useState<number>(-1);
  const [quizDialogOpen, setQuizDialogOpen] = useState(false);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const mockQuizzes: Quiz[] = [
      {
        id: "quiz1",
        title: "Module Quiz",
        description: "Test your knowledge of the module content",
        type: "multiple-choice",
        options: [
          { id: "opt1", text: "Option 1", isCorrect: true },
          { id: "opt2", text: "Option 2", isCorrect: false },
          { id: "opt3", text: "Option 3", isCorrect: false },
        ],
        courseId: courseId
      }
    ];
    setQuizzes(mockQuizzes);
  }, [courseId]);

  const handleSaveQuizzes = (updatedQuizzes: Quiz[]) => {
    setQuizzes(updatedQuizzes);
    toast({
      title: "Quizzes saved",
      description: "Quizzes have been saved successfully"
    });
    setQuizDialogOpen(false);
  };

  const handleAddLesson = () => {
    setCurrentLesson({
      id: Date.now().toString(),
      title: "",
      content: "",
      type: "text",
      duration: "30 minutes"
    });
    setIsEditingLesson(false);
    setLessonDialogOpen(true);
  };

  const handleEditLesson = (index: number) => {
    setCurrentLesson(module.lessons[index]);
    setCurrentLessonIndex(index);
    setIsEditingLesson(true);
    setLessonDialogOpen(true);
  };

  const handleSaveLesson = () => {
    if (!currentLesson.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a lesson title",
        variant: "destructive"
      });
      return;
    }

    const updatedLessons = [...module.lessons];
    
    if (isEditingLesson) {
      updatedLessons[currentLessonIndex] = currentLesson;
    } else {
      updatedLessons.push(currentLesson);
    }
    
    setModule({ ...module, lessons: updatedLessons });
    setLessonDialogOpen(false);
  };

  const handleDeleteLesson = (index: number) => {
    const updatedLessons = [...module.lessons];
    updatedLessons.splice(index, 1);
    
    setModule({ ...module, lessons: updatedLessons });
  };

  const handleMoveLesson = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === module.lessons.length - 1)
    ) {
      return;
    }
    
    const updatedLessons = [...module.lessons];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    [updatedLessons[index], updatedLessons[newIndex]] = [updatedLessons[newIndex], updatedLessons[index]];
    
    setModule({ ...module, lessons: updatedLessons });
  };

  const handleSaveModule = () => {
    if (!module.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a module title",
        variant: "destructive"
      });
      return;
    }
    
    const finalModule = {
      ...module,
      id: module.id || Date.now().toString()
    };
    
    onSave?.(finalModule);
  };

  const getLessonTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "image":
        return <FileImage className="h-4 w-4" />;
      case "document":
        return <File className="h-4 w-4" />;
      case "link":
        return <LinkIcon className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  const renderLessonContent = (lesson: Lesson, expanded: boolean) => {
    if (!expanded) return null;
    
    switch (lesson.type) {
      case "text":
        return (
          <div className="text-sm text-muted-foreground mt-2">
            <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
          </div>
        );
      case "video":
        return lesson.embedData?.url ? (
          <div className="mt-2">
            <iframe
              src={lesson.embedData.url}
              width={lesson.embedData.width || "100%"}
              height={lesson.embedData.height || "315"}
              title={lesson.embedData.title || lesson.title}
              allowFullScreen
              className="rounded-md"
            />
          </div>
        ) : (
          <div className="text-sm text-muted-foreground mt-2">No video URL provided</div>
        );
      case "image":
        return lesson.embedData?.url ? (
          <div className="mt-2">
            <img
              src={lesson.embedData.url}
              alt={lesson.title}
              className="max-w-full h-auto rounded-md"
            />
          </div>
        ) : (
          <div className="text-sm text-muted-foreground mt-2">No image URL provided</div>
        );
      case "document":
      case "link":
        return lesson.embedData?.url ? (
          <div className="mt-2">
            <a
              href={lesson.embedData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline flex items-center"
            >
              {getLessonTypeIcon(lesson.type)}
              <span className="ml-2">{lesson.embedData.title || lesson.embedData.url}</span>
            </a>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground mt-2">No URL provided</div>
        );
      default:
        return (
          <div className="text-sm text-muted-foreground mt-2">
            {lesson.content || "No content available"}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="module-title" className="text-sm font-medium">Module Title</label>
          <Input
            id="module-title"
            value={module.title}
            onChange={(e) => setModule({ ...module, title: e.target.value })}
            placeholder="Enter module title"
          />
        </div>
        
        <div>
          <label htmlFor="module-description" className="text-sm font-medium">Description</label>
          <Textarea
            id="module-description"
            value={module.description}
            onChange={(e) => setModule({ ...module, description: e.target.value })}
            placeholder="Enter module description"
            rows={3}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Lessons</h3>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setQuizDialogOpen(true)}
            >
              Manage Quizzes
            </Button>
            <Button 
              size="sm" 
              onClick={handleAddLesson}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Lesson
            </Button>
          </div>
        </div>
        
        {module.lessons.length === 0 ? (
          <div className="border border-dashed rounded-lg p-8 text-center">
            <p className="text-muted-foreground">No lessons added yet.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={handleAddLesson}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Your First Lesson
            </Button>
          </div>
        ) : (
          <Accordion type="multiple" className="border rounded-lg">
            {module.lessons.map((lesson, index) => (
              <AccordionItem key={lesson.id} value={lesson.id} className="border-b last:border-b-0">
                <div className="flex items-center">
                  <AccordionTrigger className="flex-1 hover:no-underline">
                    <div className="flex items-center gap-2">
                      {getLessonTypeIcon(lesson.type)}
                      <span>{lesson.title}</span>
                      <span className="text-xs text-muted-foreground ml-2">({lesson.duration})</span>
                    </div>
                  </AccordionTrigger>
                  <div className="flex items-center mr-4 gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleMoveLesson(index, 'up');
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
                        e.preventDefault();
                        e.stopPropagation();
                        handleMoveLesson(index, 'down');
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
                        e.preventDefault();
                        e.stopPropagation();
                        handleEditLesson(index);
                      }}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteLesson(index);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <AccordionContent>
                  {renderLessonContent(lesson, true)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
      
      <div className="flex justify-between">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
        )}
        <Button onClick={handleSaveModule}>Save Module</Button>
      </div>

      <Dialog open={lessonDialogOpen} onOpenChange={setLessonDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditingLesson ? 'Edit Lesson' : 'Add Lesson'}</DialogTitle>
            <DialogDescription>
              Fill in the details for your lesson content
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="lesson-title" className="text-sm font-medium">Title</label>
              <Input
                id="lesson-title"
                value={currentLesson.title}
                onChange={(e) => setCurrentLesson({...currentLesson, title: e.target.value})}
                placeholder="Enter lesson title"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="lesson-type" className="text-sm font-medium">Content Type</label>
                <Select
                  value={currentLesson.type}
                  onValueChange={(value) => setCurrentLesson({...currentLesson, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="link">Link</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="lesson-duration" className="text-sm font-medium">Duration</label>
                <Input
                  id="lesson-duration"
                  value={currentLesson.duration}
                  onChange={(e) => setCurrentLesson({...currentLesson, duration: e.target.value})}
                  placeholder="e.g. 30 minutes"
                />
              </div>
            </div>
            
            {currentLesson.type === 'text' && (
              <div>
                <label htmlFor="lesson-content" className="text-sm font-medium">Content</label>
                <Textarea
                  id="lesson-content"
                  value={currentLesson.content}
                  onChange={(e) => setCurrentLesson({...currentLesson, content: e.target.value})}
                  placeholder="Enter lesson content"
                  rows={8}
                />
              </div>
            )}
                
            {currentLesson.type !== 'text' && (
              <ContentEmbedder
                initialEmbedData={currentLesson.embedData}
                onEmbedDataChange={(embedData) => 
                  setCurrentLesson({...currentLesson, embedData})
                }
              />
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setLessonDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveLesson}>{isEditingLesson ? 'Update' : 'Add'} Lesson</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={quizDialogOpen} onOpenChange={setQuizDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Quizzes</DialogTitle>
            <DialogDescription>
              Create and edit quizzes for this module
            </DialogDescription>
          </DialogHeader>
          
          <QuizManager 
            courseId={courseId}
            onSaveQuizzes={handleSaveQuizzes}
            initialQuizzes={quizzes}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModuleEditor;
