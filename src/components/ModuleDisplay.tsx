
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Video, FileText, File, Maximize, Minimize, CheckCircle2, BookOpen, Play, Clock } from "lucide-react";
import { Module, Lesson } from "./ModuleEditor";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import QuizTaker from "./QuizTaker";
import { Quiz } from "./QuizManager";
import { toast } from "@/components/ui/use-toast";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

interface ModuleDisplayProps {
  module: Module;
  onEdit?: () => void;
}

const ModuleDisplay = ({ module, onEdit }: ModuleDisplayProps) => {
  const [openLesson, setOpenLesson] = useState<string | null>(null);
  const [fullscreenContent, setFullscreenContent] = useState<{
    isActive: boolean;
    contentType: string;
    url?: string;
    html?: string;
    quiz?: Quiz;
    title?: string;
  } | null>(null);
  const { hasRole } = useAuth();
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>(() => {
    const stored = localStorage.getItem(`module-${module.id}-completed-lessons`);
    return stored ? JSON.parse(stored) : {};
  });
  
  const isInstructor = hasRole(["admin", "instructor"]);

  // Calculate module completion percentage
  const completionPercentage = module.lessons && module.lessons.length > 0
    ? (Object.keys(completedLessons).length / module.lessons.length) * 100
    : 0;

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "text":
        return <FileText className="h-4 w-4" />;
      case "html":
      case "iframe":
        return <FileText className="h-4 w-4" />;
      case "quiz":
        return <BookOpen className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };
  
  const toggleFullscreen = (lesson: Lesson) => {
    if (fullscreenContent) {
      setFullscreenContent(null);
    } else {
      setFullscreenContent({
        isActive: true,
        contentType: lesson.type,
        url: lesson.embedData?.url,
        html: lesson.content,
        quiz: lesson.quiz,
        title: lesson.title
      });
    }
  };

  const handleQuizComplete = (lessonId: string, score: number, total: number) => {
    const updatedCompletedLessons = { ...completedLessons, [lessonId]: true };
    setCompletedLessons(updatedCompletedLessons);
    localStorage.setItem(`module-${module.id}-completed-lessons`, JSON.stringify(updatedCompletedLessons));
    
    toast({
      title: "Quiz Completed",
      description: `You scored ${score} out of ${total}`,
    });
  };

  const toggleLessonCompletion = (lessonId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    
    const updatedCompletedLessons = { 
      ...completedLessons, 
      [lessonId]: !completedLessons[lessonId] 
    };
    setCompletedLessons(updatedCompletedLessons);
    localStorage.setItem(`module-${module.id}-completed-lessons`, JSON.stringify(updatedCompletedLessons));
    
    toast({
      title: completedLessons[lessonId] ? "Lesson marked as incomplete" : "Lesson marked as complete",
      duration: 2000
    });
  };

  return (
    <Card className="mb-6 transition-all duration-300 hover:shadow-md border-primary/10 overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <CardTitle className="text-xl text-primary-900">{module.title}</CardTitle>
            <p className="text-muted-foreground text-sm">{module.description}</p>
          </div>
          <div className="flex items-center gap-3">
            {completionPercentage > 0 && (
              <div className="hidden sm:flex items-center gap-2">
                <Progress value={completionPercentage} className="w-24 h-2" />
                <span className="text-xs font-medium">{Math.round(completionPercentage)}%</span>
              </div>
            )}
            {onEdit && isInstructor && (
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs bg-primary/10 hover:bg-primary/20 transition-colors"
                onClick={onEdit}
              >
                Edit Module
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div>
          {module.lessons && module.lessons.length > 0 ? (
            <Accordion
              type="single"
              collapsible
              value={openLesson || undefined}
              onValueChange={(value) => setOpenLesson(value)}
              className="border rounded-md overflow-hidden bg-white"
            >
              {module.lessons.map((lesson) => (
                <AccordionItem key={lesson.id} value={lesson.id} className="border-b">
                  <AccordionTrigger className="px-4 py-3 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center gap-3">
                        <div className={`rounded-full p-2 ${completedLessons[lesson.id] ? 'bg-green-100' : 'bg-primary/10'}`}>
                          {completedLessons[lesson.id] ? 
                            <CheckCircle2 className="h-4 w-4 text-green-600" /> : 
                            getLessonIcon(lesson.type)}
                        </div>
                        <div>
                          <span className="font-medium">{lesson.title}</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant="outline" className="capitalize text-xs bg-secondary/10 font-normal">
                              {lesson.type}
                            </Badge>
                            <span className="text-xs flex items-center text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1 inline" />
                              {lesson.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3 bg-secondary/5">
                    {lesson.type === "text" && (
                      <div className="relative">
                        <div className="flex justify-between mb-3">
                          <Button 
                            onClick={(e) => toggleLessonCompletion(lesson.id, e)}
                            size="sm"
                            variant="outline"
                            className="text-xs bg-white hover:bg-muted/30 transition-colors"
                          >
                            {completedLessons[lesson.id] ? "Mark as Incomplete" : "Mark as Complete"}
                          </Button>
                          <Button 
                            onClick={() => toggleFullscreen(lesson)}
                            size="sm"
                            variant="outline"
                            className="text-xs bg-white hover:bg-muted/30 transition-colors"
                          >
                            <Maximize size={12} className="inline mr-1" /> View Fullscreen
                          </Button>
                        </div>
                        <div
                          className="prose prose-sm max-w-none bg-white p-4 rounded-md border"
                          dangerouslySetInnerHTML={{ __html: lesson.content }}
                        />
                      </div>
                    )}
                    
                    {lesson.type === "quiz" && lesson.quiz && (
                      <div className="relative">
                        <div className="flex justify-between mb-3">
                          <h3 className="font-medium">{lesson.quiz.title}</h3>
                          <Button 
                            onClick={() => toggleFullscreen(lesson)}
                            size="sm"
                            variant="outline"
                            className="text-xs bg-white hover:bg-muted/30 transition-colors"
                          >
                            <Maximize size={12} className="inline mr-1" /> View Fullscreen
                          </Button>
                        </div>
                        <div className="bg-white p-4 rounded-md border">
                          <QuizTaker 
                            quiz={lesson.quiz} 
                            onComplete={(score, total) => handleQuizComplete(lesson.id, score, total)} 
                          />
                        </div>
                      </div>
                    )}
                    
                    {lesson.embedData && (
                      <div className="relative">
                        <div className="flex justify-between mb-3">
                          <Button 
                            onClick={(e) => toggleLessonCompletion(lesson.id, e)}
                            size="sm"
                            variant="outline"
                            className="text-xs bg-white hover:bg-muted/30 transition-colors"
                          >
                            {completedLessons[lesson.id] ? "Mark as Incomplete" : "Mark as Complete"}
                          </Button>
                          <Button 
                            onClick={() => toggleFullscreen(lesson)}
                            size="sm"
                            variant="outline"
                            className="text-xs bg-white hover:bg-muted/30 transition-colors"
                          >
                            <Maximize size={12} className="inline mr-1" /> View Fullscreen
                          </Button>
                        </div>
                        
                        <div className="rounded-md overflow-hidden border bg-black">
                          {lesson.type === "video" && (
                            <iframe
                              src={lesson.embedData.url}
                              width={lesson.embedData.width || "100%"}
                              height={lesson.embedData.height || "400px"}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          )}
                          
                          {lesson.type === "iframe" && (
                            <iframe
                              src={lesson.embedData.url}
                              width={lesson.embedData.width || "100%"}
                              height={lesson.embedData.height || "400px"}
                              frameBorder="0"
                            ></iframe>
                          )}
                          
                          {(lesson.type === "html" || lesson.type === "file") && lesson.embedData.url && (
                            <iframe
                              src={lesson.embedData.url}
                              width={lesson.embedData.width || "100%"}
                              height={lesson.embedData.height || "400px"}
                              frameBorder="0"
                            ></iframe>
                          )}
                        </div>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-6 border rounded-md bg-muted/20">
              <p className="text-muted-foreground">No lessons in this module.</p>
            </div>
          )}
        </div>
      </CardContent>
      
      {/* Fullscreen content modal */}
      {fullscreenContent && (
        <div className="fullscreen-content fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center overflow-auto p-4 animate-fade-in">
          <div className="absolute top-4 right-4 flex space-x-2">
            <Button 
              onClick={() => setFullscreenContent(null)} 
              className="text-white hover:text-primary bg-black/30 p-2 rounded-full"
              aria-label="Close fullscreen"
              variant="ghost"
            >
              <Minimize size={24} />
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
              <div className="aspect-video w-full">
                <iframe
                  src={fullscreenContent.url}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
            
            {(fullscreenContent.contentType === "iframe" || 
              fullscreenContent.contentType === "html" || 
              fullscreenContent.contentType === "file") && 
              fullscreenContent.url && (
              <div className="aspect-video w-full">
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
                    toast({
                      title: "Quiz Completed",
                      description: `You scored ${score} out of ${total}`,
                    });
                  }} 
                  darkMode={false}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default ModuleDisplay;
