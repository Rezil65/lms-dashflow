
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, BookOpen, ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Course, getCourseById } from "@/utils/courseStorage";
import { Module } from "@/components/ModuleEditor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";

interface CourseModulesProps {
  isPreview?: boolean;
  courseId?: string;
}

const CourseModules = ({ isPreview = false, courseId = "1" }: CourseModulesProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [modules, setModules] = useState<Module[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [moduleDialogOpen, setModuleDialogOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({});
  const [showProgress, setShowProgress] = useState(true);

  useEffect(() => {
    // Fetch modules from the course
    const fetchCourseData = async () => {
      setLoading(true);
      
      // Try to get the course from storage using the courseId
      try {
        const parsedCourseId = parseInt(courseId);
        const foundCourse = getCourseById(parsedCourseId);
        
        if (foundCourse) {
          setCourse(foundCourse);
          if (foundCourse.modules && foundCourse.modules.length > 0) {
            setModules(isPreview && foundCourse.modules.length > 2 
              ? foundCourse.modules.slice(0, 2) 
              : foundCourse.modules);
          } else {
            // If no modules, create mock modules
            const mockModules = createMockModules();
            setModules(isPreview ? mockModules.slice(0, 2) : mockModules);
          }
        } else {
          // If course not found, use mock modules
          setModules(isPreview ? createMockModules().slice(0, 2) : createMockModules());
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        // Fallback to mock modules
        setModules(isPreview ? createMockModules().slice(0, 2) : createMockModules());
      }
      
      // Load completed lessons from localStorage
      const storedCompletedLessons = localStorage.getItem('completedLessons');
      if (storedCompletedLessons) {
        setCompletedLessons(JSON.parse(storedCompletedLessons));
      }
      
      setLoading(false);
    };
    
    fetchCourseData();
  }, [courseId, isPreview]);

  const createMockModules = (): Module[] => {
    return [
      {
        id: "mod1",
        title: "Introduction to Web Development",
        description: "Learn the basics of HTML, CSS, and JavaScript",
        lessons: [
          {
            id: "lesson1",
            title: "HTML Fundamentals",
            content: "<p>HTML is the standard markup language for web pages. It defines the structure of web content.</p>",
            type: "text",
            duration: "20 minutes"
          },
          {
            id: "lesson2",
            title: "CSS Styling",
            content: "<p>CSS is the language used to style web pages. It describes how HTML elements should be displayed.</p>",
            type: "text",
            duration: "25 minutes"
          },
          {
            id: "lesson3",
            title: "JavaScript Basics",
            content: "<p>JavaScript is the programming language that powers interactive websites.</p>",
            type: "text",
            duration: "30 minutes"
          }
        ]
      },
      {
        id: "mod2",
        title: "React Fundamentals",
        description: "Core concepts of React.js framework",
        lessons: [
          {
            id: "lesson4",
            title: "Introduction to React",
            content: "<p>React is a JavaScript library for building user interfaces.</p>",
            type: "text",
            duration: "25 minutes"
          },
          {
            id: "lesson5",
            title: "Components and Props",
            content: "<p>Components are the building blocks of React applications.</p>",
            type: "text",
            duration: "30 minutes"
          }
        ]
      },
      {
        id: "mod3",
        title: "State Management",
        description: "Managing state in React applications",
        lessons: [
          {
            id: "lesson6",
            title: "useState Hook",
            content: "<p>The useState hook allows you to add state to functional components.</p>",
            type: "text",
            duration: "20 minutes"
          },
          {
            id: "lesson7",
            title: "Context API",
            content: "<p>Context provides a way to pass data through the component tree without passing props down manually at every level.</p>",
            type: "text",
            duration: "25 minutes"
          }
        ]
      }
    ];
  };

  const handleViewAllModules = () => {
    navigate(`/course/${courseId}/content`);
  };

  const handleViewModule = (module: Module) => {
    setSelectedModule(module);
    setModuleDialogOpen(true);
  };

  const getModuleProgress = (module: Module): number => {
    if (!module.lessons || module.lessons.length === 0) return 0;
    
    const totalCompleted = module.lessons.reduce((count, lesson) => {
      return completedLessons[lesson.id] ? count + 1 : count;
    }, 0);
    
    return Math.round((totalCompleted / module.lessons.length) * 100);
  };

  const toggleLessonCompletion = (lessonId: string) => {
    const updatedCompletedLessons = {...completedLessons};
    
    // Toggle the completion status
    updatedCompletedLessons[lessonId] = !updatedCompletedLessons[lessonId];
    
    setCompletedLessons(updatedCompletedLessons);
    localStorage.setItem('completedLessons', JSON.stringify(updatedCompletedLessons));
    
    const message = updatedCompletedLessons[lessonId] ? "Lesson marked as completed" : "Lesson marked as incomplete";
    toast({
      title: message,
      duration: 2000
    });
  };

  const toggleProgressVisibility = () => {
    setShowProgress(!showProgress);
  };

  const renderLessonContent = (lesson: any) => {
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
      default:
        return (
          <div className="text-sm text-muted-foreground mt-2">
            {lesson.content || "No content available"}
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Course Modules</h3>
        <div className="flex gap-2">
          {!isPreview && (
            <Button variant="outline" size="sm" onClick={toggleProgressVisibility}>
              {showProgress ? "Hide Progress" : "Show Progress"}
            </Button>
          )}
          {isPreview && (
            <Button variant="ghost" size="sm" className="text-sm" onClick={handleViewAllModules}>
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {loading ? (
        <div className="space-y-4">
          <div className="h-24 rounded-md bg-gray-100 animate-pulse"></div>
          <div className="h-24 rounded-md bg-gray-100 animate-pulse"></div>
        </div>
      ) : modules.length > 0 ? (
        <div className="space-y-3">
          {modules.map((module) => (
            <Card key={module.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-md">{module.title}</h4>
                      <Badge variant="outline" className="ml-auto">
                        {module.lessons?.length || 0} lessons
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {module.description}
                    </p>
                    
                    {showProgress && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Progress</span>
                          <span>{getModuleProgress(module)}%</span>
                        </div>
                        <Progress value={getModuleProgress(module)} className="h-1.5" />
                      </div>
                    )}
                    
                    <div className="flex items-center mt-3 justify-between">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <BookOpen className="h-3 w-3 mr-1" />
                        {module.lessons?.filter(lesson => completedLessons[lesson.id]).length || 0}/
                        {module.lessons?.length || 0} lessons completed
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-xs"
                        onClick={() => handleViewModule(module)}
                      >
                        View Module <ArrowRight className="ml-1 h-3 w-3" />
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
          <p className="text-muted-foreground">No modules available</p>
        </div>
      )}
      
      <Dialog open={moduleDialogOpen} onOpenChange={setModuleDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedModule?.title}</DialogTitle>
            <DialogDescription>
              {selectedModule?.description}
            </DialogDescription>
          </DialogHeader>
          
          {selectedModule && selectedModule.lessons && selectedModule.lessons.length > 0 ? (
            <Accordion type="single" collapsible className="w-full mt-2">
              {selectedModule.lessons.map((lesson) => (
                <AccordionItem key={lesson.id} value={lesson.id}>
                  <AccordionTrigger className="hover:no-underline p-3 rounded-md bg-secondary/20 hover:bg-secondary/30 transition-colors">
                    <div className="flex items-center gap-2 text-left">
                      {completedLessons[lesson.id] ? (
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <div className="h-4 w-4 border-2 rounded-full border-muted-foreground flex-shrink-0" />
                      )}
                      <div>
                        <div className="font-medium">{lesson.title}</div>
                        <div className="text-xs text-muted-foreground">{lesson.duration}</div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-2 px-2">
                    {renderLessonContent(lesson)}
                    <div className="mt-4 flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => toggleLessonCompletion(lesson.id)}
                      >
                        {completedLessons[lesson.id] ? "Mark as Incomplete" : "Mark as Complete"}
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="py-6 text-center text-muted-foreground">
              No lessons available for this module.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseModules;
