import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, BookOpen, ArrowRight, CheckCircle, Video, BookOpenCheck, FileText, ChevronDown, File, ExternalLink, Minimize, X, Maximize } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Course, getCourseById } from "@/utils/courseStorage";
import { Module } from "@/components/ModuleEditor";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import QuizTaker from "./QuizTaker";

interface CourseModulesProps {
  isPreview?: boolean;
  courseId?: string;
}

const CourseModules = ({ isPreview = false, courseId = "1" }: CourseModulesProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { hasRole } = useAuth();
  const [modules, setModules] = useState<Module[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [moduleDialogOpen, setModuleDialogOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({});
  const [showProgress, setShowProgress] = useState(true);
  const [fullscreenContent, setFullscreenContent] = useState<{
    isActive: boolean;
    contentType: string;
    url?: string;
    html?: string;
    quiz?: any;
    title?: string;
    lessonId?: string;
  } | null>(null);
  const [activeModuleTab, setActiveModuleTab] = useState<string>("outline");
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      
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
            const mockModules = createMockModules();
            setModules(isPreview ? mockModules.slice(0, 2) : mockModules);
          }
        } else {
          setModules(isPreview ? createMockModules().slice(0, 2) : createMockModules());
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        setModules(isPreview ? createMockModules().slice(0, 2) : createMockModules());
      }
      
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
            duration: "30 minutes",
            quiz: {
              id: "quiz1",
              title: "JavaScript Quiz",
              description: "Test your knowledge of JavaScript basics",
              type: "multiple-choice",
              options: [
                { id: "opt1", text: "JavaScript is a server-side language", isCorrect: false },
                { id: "opt2", text: "JavaScript can manipulate HTML elements", isCorrect: true },
                { id: "opt3", text: "JavaScript is statically typed", isCorrect: false },
              ],
              courseId: "1"
            }
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
            duration: "30 minutes",
            embedData: {
              url: "https://www.youtube.com/watch?v=Rh3tobg7hEo",
              type: "video"
            }
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

  const handleQuizComplete = (lessonId: string, score: number, total: number) => {
    const updatedCompletedLessons = { ...completedLessons, [lessonId]: true };
    setCompletedLessons(updatedCompletedLessons);
    localStorage.setItem('completedLessons', JSON.stringify(updatedCompletedLessons));
    
    toast({
      title: "Quiz Completed",
      description: `You scored ${score} out of ${total}`,
    });
    
    if (fullscreenContent && fullscreenContent.lessonId === lessonId) {
      setFullscreenContent(null);
    }
  };

  const toggleFullscreen = (lesson: any) => {
    if (fullscreenContent) {
      setFullscreenContent(null);
    } else {
      setFullscreenContent({
        isActive: true,
        contentType: lesson.type,
        url: lesson.embedData?.url,
        html: lesson.content,
        quiz: lesson.quiz,
        title: lesson.title,
        lessonId: lesson.id
      });
    }
  };

  const renderVideoPlayer = (url: string, title: string) => {
    let embedUrl = url;
    
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('v=') 
        ? new URLSearchParams(url.split('?')[1]).get('v')
        : url.split('/').pop()?.split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('vimeo.com')) {
      const videoId = url.split('/').pop()?.split('?')[0];
      embedUrl = `https://player.vimeo.com/video/${videoId}`;
    }
    
    return (
      <div className="aspect-video bg-black rounded-md overflow-hidden">
        <iframe
          src={embedUrl}
          title={title}
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
    );
  };

  const renderIframeViewer = (url: string, title: string) => {
    return (
      <div className="h-[600px] bg-white border rounded-md overflow-hidden">
        <iframe
          src={url}
          title={title}
          className="w-full h-full"
          allowFullScreen
        />
      </div>
    );
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "quiz":
        return <BookOpenCheck className="h-4 w-4" />;
      case "document":
        return <File className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handleAccordionChange = (value: string) => {
    setOpenItemId(value === openItemId ? null : value);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{isPreview ? "Course Modules" : course?.title || "Course Content"}</h3>
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
        isPreview ? (
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
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Course Overview</CardTitle>
                  {showProgress && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Overall Progress</span>
                      <Progress 
                        value={
                          modules.reduce((total, module) => total + getModuleProgress(module), 0) / 
                          (modules.length || 1)
                        } 
                        className="w-24 h-2" 
                      />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="outline" value={activeModuleTab} onValueChange={setActiveModuleTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="outline">Course Outline</TabsTrigger>
                    <TabsTrigger value="modules">Modules</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                  </TabsList>
                
                  <TabsContent value="outline" className="space-y-4">
                    <div className="border rounded-md p-4 bg-white">
                      <h2 className="font-medium mb-2">Course Structure</h2>
                      <div className="space-y-3">
                        {modules.map((module, index) => (
                          <div key={module.id} className="flex items-center gap-2">
                            <div className="rounded-full bg-primary/10 h-6 w-6 flex items-center justify-center text-xs font-medium">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium">{module.title}</div>
                              <div className="text-xs text-muted-foreground">
                                {module.lessons?.length || 0} lessons
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border rounded-md p-4 bg-white">
                      <h2 className="font-medium mb-2">Learning Path</h2>
                      <div className="relative pl-6 border-l-2 border-dashed border-primary/30 space-y-6">
                        {modules.map((module, index) => (
                          <div key={module.id} className="relative">
                            <div className="absolute -left-[25px] rounded-full bg-primary/20 p-1 border-4 border-white">
                              <div className="h-4 w-4 rounded-full bg-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium">{module.title}</h3>
                              <p className="text-sm text-muted-foreground">{module.description}</p>
                              <div className="mt-2 flex items-center gap-1 text-xs">
                                {getModuleProgress(module) > 0 ? (
                                  <>
                                    <Progress value={getModuleProgress(module)} className="w-16 h-1.5" />
                                    <span className="text-muted-foreground">{getModuleProgress(module)}% complete</span>
                                  </>
                                ) : (
                                  <span className="text-muted-foreground">Not started</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="modules" className="space-y-4">
                    <Accordion
                      type="single"
                      collapsible
                      value={openItemId || undefined}
                      onValueChange={handleAccordionChange}
                      className="w-full"
                    >
                      {modules.map((module) => (
                        <AccordionItem
                          key={module.id}
                          value={module.id}
                          className="border rounded-md mb-2 overflow-hidden bg-white"
                        >
                          <AccordionTrigger className="px-4 py-3 hover:bg-muted/30 transition-colors">
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-3">
                                <div className={`rounded-full p-2 bg-primary/10`}>
                                  <BookOpen className="h-4 w-4" />
                                </div>
                                <div>
                                  <span className="font-medium">{module.title}</span>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <Badge variant="outline" className="text-xs bg-secondary/10 font-normal">
                                      {module.lessons?.length || 0} lessons
                                    </Badge>
                                    {showProgress && (
                                      <span className="text-xs flex items-center text-muted-foreground">
                                        <Progress 
                                          value={getModuleProgress(module)} 
                                          className="w-16 h-1.5 mr-1" 
                                        />
                                        {getModuleProgress(module)}%
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="border-t">
                            {module.lessons?.map((lesson) => (
                              <div 
                                key={lesson.id} 
                                className="px-4 py-3 border-b last:border-b-0 hover:bg-muted/10 transition-colors"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className={`rounded-full p-1 ${completedLessons[lesson.id] ? 'bg-green-100' : 'bg-primary/10'}`}>
                                      {completedLessons[lesson.id] ? 
                                        <CheckCircle className="h-3 w-3 text-green-600" /> : 
                                        getLessonIcon(lesson.type)}
                                    </div>
                                    <div>
                                      <div className="font-medium">{lesson.title}</div>
                                      <div className="text-xs text-muted-foreground">{lesson.duration}</div>
                                    </div>
                                  </div>
                                  <Button
                                    size="sm" 
                                    variant="ghost"
                                    className="h-8 px-2"
                                    onClick={() => toggleFullscreen(lesson)}
                                  >
                                    View
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </TabsContent>

                  <TabsContent value="resources" className="space-y-4">
                    <div className="border rounded-md p-4 bg-white">
                      <h2 className="font-medium mb-4">Course Resources</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {modules.flatMap(module => 
                          module.lessons
                            ?.filter(lesson => ["document", "link"].includes(lesson.type) && lesson.embedData?.url)
                            .map((lesson) => (
                              <div 
                                key={`${module.id}-${lesson.id}`} 
                                className="p-3 border rounded-md hover:bg-muted/10 flex items-center justify-between"
                              >
                                <div className="flex items-center gap-2">
                                  {getLessonIcon(lesson.type)}
                                  <div>
                                    <div className="font-medium">{lesson.title}</div>
                                    <div className="text-xs text-muted-foreground">{module.title}</div>
                                  </div>
                                </div>
                                <Button 
                                  as="a"
                                  href={lesson.embedData?.url}
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  size="sm"
                                  variant="outline"
                                >
                                  <ExternalLink className="h-3 w-3 mr-1" /> Open
                                </Button>
                              </div>
                            ))
                        )}

                        {modules.flatMap(module => module.lessons?.filter(lesson => 
                          ["document", "link"].includes(lesson.type) && lesson.embedData?.url
                        )).length === 0 && (
                          <div className="col-span-2 text-center py-8 border rounded-md">
                            <p className="text-muted-foreground">No resources available for this course</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )
      ) : (
        <div className="text-center py-8 border rounded-md bg-gray-50">
          <p className="text-muted-foreground">No modules available</p>
        </div>
      )}
      
      <Dialog open={moduleDialogOpen} onOpenChange={setModuleDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedModule?.title}</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="content">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content">
              {selectedModule && selectedModule.lessons && selectedModule.lessons.length > 0 ? (
                <Accordion type="single" collapsible className="w-full mt-2">
                  {selectedModule.lessons.map((lesson) => (
                    <AccordionItem key={lesson.id} value={lesson.id}>
                      <AccordionTrigger className="hover:no-underline p-3 rounded-md bg-secondary/20 hover:bg-secondary/30 transition-colors">
                        <div className="flex items-center gap-2 text-left">
                          {completedLessons[lesson.id] ? (
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          ) : (
                            <div className="h-4 w-4 border-2 rounded-full border-muted-foreground flex-shrink-0">
                              {getLessonIcon(lesson.type)}
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{lesson.title}</div>
                            <div className="text-xs text-muted-foreground">{lesson.duration}</div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-4 pb-2 px-2">
                        {lesson.type === "text" && (
                          <div className="relative">
                            <div
                              className="prose prose-sm max-w-none bg-white p-4 rounded-md border"
                              dangerouslySetInnerHTML={{ __html: lesson.content }}
                            />
                            <div className="mt-4 flex justify-between">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => toggleLessonCompletion(lesson.id)}
                              >
                                {completedLessons[lesson.id] ? "Mark as Incomplete" : "Mark as Complete"}
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => toggleFullscreen(lesson)}
                              >
                                <Maximize className="h-3 w-3 mr-1" /> Fullscreen
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        {lesson.type === "quiz" && lesson.quiz && (
                          <div className="bg-white p-4 rounded-md border">
                            <QuizTaker 
                              quiz={lesson.quiz} 
                              onComplete={(score, total) => handleQuizComplete(lesson.id, score, total)} 
                            />
                          </div>
                        )}
                        
                        {lesson.type === "video" && lesson.embedData?.url && (
                          <div>
                            {renderVideoPlayer(lesson.embedData.url, lesson.title)}
                            <div className="mt-4 flex justify-between">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => toggleLessonCompletion(lesson.id)}
                              >
                                {completedLessons[lesson.id] ? "Mark as Incomplete" : "Mark as Complete"}
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => toggleFullscreen(lesson)}
                              >
                                <Maximize className="h-3 w-3 mr-1" /> Fullscreen
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        {((lesson.type === "document" || lesson.type === "link" || lesson.type === "iframe") && lesson.embedData?.url) && (
                          <div>
                            {renderIframeViewer(lesson.embedData.url, lesson.title)}
                            <div className="mt-4 flex justify-between">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => toggleLessonCompletion(lesson.id)}
                              >
                                {completedLessons[lesson.id] ? "Mark as Incomplete" : "Mark as Complete"}
                              </Button>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(lesson.embedData?.url, '_blank', 'noopener,noreferrer')}
                                >
                                  <ExternalLink className="h-3 w-3 mr-1" /> Open in New Tab
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => toggleFullscreen(lesson)}
                                >
                                  <Maximize className="h-3 w-3 mr-1" /> Fullscreen
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="py-6 text-center text-muted-foreground">
                  No lessons available for this module.
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="resources">
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-4">Module Resources</h3>
                {selectedModule?.lessons?.filter(lesson => 
                  ["document", "link", "image"].includes(lesson.type) && lesson.embedData?.url
                ).length > 0 ? (
                  <div className="space-y-2">
                    {selectedModule?.lessons
                      .filter(lesson => ["document", "link", "image"].includes(lesson.type) && lesson.embedData?.url)
                      .map((lesson) => (
                        <div key={lesson.id} className="p-3 border rounded-md hover:bg-muted/10 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getLessonIcon(lesson.type)}
                            <div>
                              <div className="font-medium">{lesson.title}</div>
                              <div className="text-xs text-muted-foreground">{lesson.type}</div>
                            </div>
                          </div>
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(lesson.embedData?.url, '_blank', 'noopener,noreferrer')}
                          >
                            Download
                          </Button>
                        </div>
                      ))
                    }
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">No resources available for this module.</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="progress">
              <div className="border rounded-md p-4">
                <div className="mb-6">
                  <h3 className="font-medium">Your Progress</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Progress 
                      value={selectedModule ? getModuleProgress(selectedModule) : 0} 
                      className="h-2 flex-1" 
                    />
                    <span className="text-sm font-medium">
                      {selectedModule ? getModuleProgress(selectedModule) : 0}%
                    </span>
                  </div>
                </div>
                
                <h4 className="font-medium text-sm mb-2">Lesson Status:</h4>
                <div className="space-y-1">
                  {selectedModule?.lessons?.map((lesson) => (
                    <div key={lesson.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div className="flex items-center gap-2">
                        {completedLessons[lesson.id] ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <div className="h-4 w-4 border rounded-full" />
                        )}
                        <span className={`text-sm ${completedLessons[lesson.id] ? 'text-muted-foreground line-through' : ''}`}>
                          {lesson.title}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2"
                        onClick={() => toggleLessonCompletion(lesson.id)}
                      >
                        {completedLessons[lesson.id] ? "Mark Incomplete" : "Mark Complete"}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      
      {fullscreenContent && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center overflow-auto p-4 animate-fade-in">
          <div className="absolute top-4 right-4 flex space-x-2">
            <Button 
              onClick={() => setFullscreenContent(null)} 
              className="text-white bg-black/30 p-2 rounded-full"
              aria-label="Close fullscreen"
              variant="ghost"
              size="icon"
            >
              <X size={20} />
            </Button>
          </div>
          
          <div className="w-full max-w-5xl">
            {fullscreenContent.title && (
              <h2 className="text-white text-xl font-semibold mb-4">{fullscreenContent.title}</h2>
            )}
            
            {fullscreenContent.contentType === "text" && (
              <div 
                className="prose prose-sm max-w-none bg-white/10 p-6 rounded-lg backdrop-blur-sm text-white"
                dangerouslySetInnerHTML={{ __html: fullscreenContent.html || "" }}
              />
            )}
            
            {fullscreenContent.contentType === "video" && fullscreenContent.url && (
              <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
                {renderVideoPlayer(fullscreenContent.url, fullscreenContent.title || "")}
              </div>
            )}
            
            {(fullscreenContent.contentType === "iframe" || 
              fullscreenContent.contentType === "document" || 
              fullscreenContent.contentType === "link" ||
              fullscreenContent.contentType === "file") && 
              fullscreenContent.url && (
              <div className="aspect-video w-full h-[80vh] bg-white rounded-lg overflow-hidden">
                <iframe
                  src={fullscreenContent.url}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            )}
            
            {fullscreenContent.contentType === "quiz" && fullscreenContent.quiz && (
              <div className="max-w-3xl mx-auto bg-white rounded-lg p-6">
                <QuizTaker 
                  quiz={fullscreenContent.quiz} 
                  onComplete={(score, total) => {
                    handleQuizComplete(fullscreenContent.lessonId || "", score, total);
                  }} 
                />
              </div>
            )}
            
            {fullscreenContent.contentType === "image" && fullscreenContent.url && (
              <div className="flex justify-center">
                <img
                  src={fullscreenContent.url}
                  alt={fullscreenContent.title || "Image content"}
                  className="max-h-[80vh] max-w-full object-contain"
                />
              </div>
            )}

            {fullscreenContent.lessonId && (
              <div className="mt-4 flex justify-center">
                <Button
                  variant="outline"
                  className="bg-white/10 text-white hover:bg-white/20"
                  onClick={() => toggleLessonCompletion(fullscreenContent.lessonId || "")}
                >
                  {completedLessons[fullscreenContent.lessonId] ? "Mark as Incomplete" : "Mark as Complete"}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseModules;
