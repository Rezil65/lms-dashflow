
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Plus, Trash, Video, FileText, File, Pencil, Save, X } from "lucide-react";
import RichTextEditor from "./RichTextEditor";
import ContentEmbedder, { EmbedData } from "./ContentEmbedder";
import { Textarea } from "@/components/ui/textarea";

export interface Lesson {
  id: string;
  title: string;
  type: string;
  content: string;
  duration?: string;
  embedData?: EmbedData;
}

export interface Module {
  id: number;
  title: string;
  description: string;
  lessons: Lesson[];
}

interface ModuleEditorProps {
  module: Module;
  onSave: (updatedModule: Module) => void;
  onCancel: () => void;
}

const ModuleEditor = ({ module, onSave, onCancel }: ModuleEditorProps) => {
  const [editedModule, setEditedModule] = useState<Module>({ ...module });
  const [addingLesson, setAddingLesson] = useState(false);
  const [lessonType, setLessonType] = useState<"text" | "embed">("text");
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [lessonDuration, setLessonDuration] = useState("");
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const handleModuleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedModule({ ...editedModule, title: e.target.value });
  };

  const handleModuleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedModule({ ...editedModule, description: e.target.value });
  };

  const handleAddLesson = () => {
    setAddingLesson(true);
    setLessonTitle("");
    setLessonContent("");
    setLessonDuration("");
    setLessonType("text");
  };

  const handleSaveLesson = () => {
    if (!lessonTitle.trim()) {
      alert("Please enter a lesson title");
      return;
    }

    if (lessonType === "text" && !lessonContent.trim()) {
      alert("Please enter lesson content");
      return;
    }

    const newLesson: Lesson = {
      id: `${module.id}-${Date.now()}`,
      title: lessonTitle,
      type: lessonType,
      content: lessonContent,
      duration: lessonDuration || "N/A",
    };

    setEditedModule({
      ...editedModule,
      lessons: [...editedModule.lessons, newLesson],
    });

    setAddingLesson(false);
  };

  const handleRemoveLesson = (lessonId: string) => {
    setEditedModule({
      ...editedModule,
      lessons: editedModule.lessons.filter((lesson) => lesson.id !== lessonId),
    });
  };

  const handleEmbedContent = (embedData: EmbedData) => {
    const newLesson: Lesson = {
      id: `${module.id}-${Date.now()}`,
      title: embedData.title,
      type: embedData.type,
      content: embedData.type === "video" ? "Video content" : "Embedded content",
      duration: lessonDuration || "N/A",
      embedData,
    };

    setEditedModule({
      ...editedModule,
      lessons: [...editedModule.lessons, newLesson],
    });

    setAddingLesson(false);
  };

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
          <Input
            value={editedModule.title}
            onChange={handleModuleTitleChange}
            className="text-xl font-semibold"
            placeholder="Module Title"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={editedModule.description}
          onChange={handleModuleDescriptionChange}
          placeholder="Module description"
          className="min-h-20"
        />

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold">Lessons</h3>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => handleAddLesson()}>
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add Lesson
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Add New Lesson</DialogTitle>
                    <DialogDescription>
                      Create a new lesson for this module
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <label htmlFor="lesson-title" className="text-sm font-medium">
                        Lesson Title
                      </label>
                      <Input
                        id="lesson-title"
                        value={lessonTitle}
                        onChange={(e) => setLessonTitle(e.target.value)}
                        placeholder="Enter lesson title"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="lesson-duration" className="text-sm font-medium">
                        Duration (e.g. "5 min", "PDF", etc.)
                      </label>
                      <Input
                        id="lesson-duration"
                        value={lessonDuration}
                        onChange={(e) => setLessonDuration(e.target.value)}
                        placeholder="Enter duration"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Content Type</label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={lessonType === "text" ? "default" : "outline"}
                          onClick={() => setLessonType("text")}
                          className="flex-1"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Text Content
                        </Button>
                        <Button
                          type="button"
                          variant={lessonType === "embed" ? "default" : "outline"}
                          onClick={() => setLessonType("embed")}
                          className="flex-1"
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Embed Content
                        </Button>
                      </div>
                    </div>

                    {lessonType === "text" ? (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Content</label>
                        <RichTextEditor
                          initialValue={lessonContent}
                          onChange={setLessonContent}
                          placeholder="Enter lesson content here..."
                        />
                      </div>
                    ) : (
                      <ContentEmbedder onEmbed={handleEmbedContent} />
                    )}
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setAddingLesson(false)}
                    >
                      Cancel
                    </Button>
                    {lessonType === "text" && (
                      <Button type="button" onClick={handleSaveLesson}>
                        Add Lesson
                      </Button>
                    )}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {editedModule.lessons.length > 0 ? (
            <Accordion
              type="single"
              collapsible
              value={openAccordion || undefined}
              onValueChange={(value) => setOpenAccordion(value)}
              className="border rounded-md"
            >
              {editedModule.lessons.map((lesson, index) => (
                <AccordionItem key={lesson.id} value={lesson.id} className="border-b">
                  <AccordionTrigger className="px-4 py-2 hover:bg-muted/50 group">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 rounded-full p-1">
                          {getLessonIcon(lesson.type)}
                        </div>
                        <span>{lesson.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-muted px-2 py-0.5 rounded">
                          {lesson.duration}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 focus:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveLesson(lesson.id);
                          }}
                        >
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
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
                            width={lesson.embedData.width}
                            height={lesson.embedData.height}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        )}
                        {lesson.type === "iframe" && (
                          <iframe
                            src={lesson.embedData.url}
                            width={lesson.embedData.width}
                            height={lesson.embedData.height}
                            frameBorder="0"
                          ></iframe>
                        )}
                        {(lesson.type === "html" || lesson.type === "file") && (
                          <div className="p-4 bg-muted/20 flex items-center justify-center min-h-40">
                            <div className="text-center">
                              <File className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">
                                {lesson.type === "html"
                                  ? "HTML Content (preview not available)"
                                  : "File Content (preview not available)"}
                              </p>
                            </div>
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
              <p className="text-muted-foreground">No lessons yet. Add your first lesson.</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={() => onSave(editedModule)}>
            <Save className="h-4 w-4 mr-2" />
            Save Module
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModuleEditor;
