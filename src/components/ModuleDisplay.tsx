
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Video, FileText, File, Pencil } from "lucide-react";
import { Module, Lesson } from "./ModuleEditor";
import { Badge } from "@/components/ui/badge";

interface ModuleDisplayProps {
  module: Module;
  onEdit: () => void;
}

const ModuleDisplay = ({ module, onEdit }: ModuleDisplayProps) => {
  const [openLesson, setOpenLesson] = useState<string | null>(null);

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

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>{module.title}</CardTitle>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Pencil className="h-3.5 w-3.5 mr-1" />
            Edit Module
          </Button>
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
              className="border rounded-md"
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
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: lesson.content }}
                      />
                    )}
                    {lesson.embedData && (
                      <div className="relative rounded border overflow-hidden">
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
                        {(lesson.type === "html" || lesson.type === "file") && (
                          <div>
                            {lesson.embedData.url && (
                              <iframe
                                src={lesson.embedData.url}
                                width={lesson.embedData.width || "100%"}
                                height={lesson.embedData.height || "400px"}
                                frameBorder="0"
                              ></iframe>
                            )}
                          </div>
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
    </Card>
  );
};

export default ModuleDisplay;
