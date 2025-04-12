
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Video, FileText, File, Maximize, Minimize, ExternalLink } from "lucide-react";
import { Module, Lesson } from "./ModuleEditor";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

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
  } | null>(null);
  const { hasRole } = useAuth();
  
  const isInstructor = hasRole(["admin", "instructor"]);

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "text":
        return <FileText className="h-4 w-4" />;
      case "html":
      case "iframe":
        return <FileText className="h-4 w-4" />;
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
      });
    }
  };

  return (
    <Card className="mb-6 card-3d neon-border-hover">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="neon-text-primary">{module.title}</CardTitle>
          {onEdit && isInstructor && (
            <button 
              className="text-xs bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full transition-colors"
              onClick={onEdit}
            >
              Edit Module
            </button>
          )}
        </div>
        <p className="text-muted-foreground">{module.description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {module.lessons.length > 0 ? (
            <Accordion
              type="single"
              collapsible
              value={openLesson || undefined}
              onValueChange={(value) => setOpenLesson(value)}
              className="border rounded-md bg-white/5 backdrop-blur-sm"
            >
              {module.lessons.map((lesson) => (
                <AccordionItem key={lesson.id} value={lesson.id} className="border-b">
                  <AccordionTrigger className="px-4 py-2 hover:bg-muted/50">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 rounded-full p-1">
                          {getLessonIcon(lesson.type)}
                        </div>
                        <span>{lesson.title}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs bg-muted px-2 py-0.5 rounded">
                          {lesson.duration}
                        </span>
                        <Badge variant="outline" className="ml-2 capitalize text-xs">
                          {lesson.type}
                        </Badge>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-2">
                    {lesson.type === "text" && (
                      <div className="fullscreen-container">
                        <button 
                          onClick={() => toggleFullscreen(lesson)}
                          className="fullscreen-toggle"
                          aria-label="Toggle fullscreen"
                        >
                          <Maximize size={16} />
                        </button>
                        <div
                          className="prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: lesson.content }}
                        />
                      </div>
                    )}
                    
                    {lesson.embedData && (
                      <div className="relative rounded border overflow-hidden">
                        <button 
                          onClick={() => toggleFullscreen(lesson)}
                          className="fullscreen-toggle"
                          aria-label="Toggle fullscreen"
                        >
                          <Maximize size={16} />
                        </button>
                        
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
        <div className="fullscreen-content">
          <button 
            onClick={() => setFullscreenContent(null)} 
            className="absolute top-4 right-4 text-white hover:text-primary"
            aria-label="Close fullscreen"
          >
            <Minimize size={24} />
          </button>
          
          <div className="w-full max-w-5xl">
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
          </div>
        </div>
      )}
    </Card>
  );
};

export default ModuleDisplay;
