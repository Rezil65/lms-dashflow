
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, GripVertical, FileText } from "lucide-react";
import { Module } from "@/utils/courseUtils";

interface ModuleManagerProps {
  courseId: string;
  modules: Module[];
  onAddModule: (moduleData: { title: string; description: string }) => Promise<void>;
}

const ModuleManager = ({ courseId, modules, onAddModule }: ModuleManagerProps) => {
  const [newModule, setNewModule] = useState({ title: "", description: "" });
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  const handleAddModule = async () => {
    if (!newModule.title) return;
    await onAddModule(newModule);
    setNewModule({ title: "", description: "" });
    setIsAddModuleOpen(false);
  };

  const handleEditModule = (module: Module) => {
    setSelectedModule(module);
    // Typically you would handle module editing here
    // and then update the module via an API call
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Course Modules</h2>
        <Dialog open={isAddModuleOpen} onOpenChange={setIsAddModuleOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Module
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Module</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="module-title" className="text-sm font-medium">
                  Module Title
                </label>
                <Input
                  id="module-title"
                  value={newModule.title}
                  onChange={(e) =>
                    setNewModule({ ...newModule, title: e.target.value })
                  }
                  placeholder="Enter module title"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="module-description"
                  className="text-sm font-medium"
                >
                  Module Description
                </label>
                <Textarea
                  id="module-description"
                  value={newModule.description}
                  onChange={(e) =>
                    setNewModule({ ...newModule, description: e.target.value })
                  }
                  placeholder="Enter module description"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddModuleOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddModule}>Save Module</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {modules.length > 0 ? (
        <div className="space-y-4">
          {modules.map((module, index) => (
            <Card key={module.id} className="relative">
              <div className="absolute left-0 top-0 bottom-0 px-2 py-4 flex items-center cursor-move">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardHeader className="pb-2 pl-10">
                <CardTitle className="text-base flex items-center gap-2">
                  <span>Module {index + 1}:</span> {module.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pl-10">
                <p className="text-sm text-muted-foreground mb-4">
                  {module.description || "No description provided."}
                </p>

                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <div className="bg-muted/50 px-3 py-1 rounded-md text-xs">
                    {module.lessons?.length || 0} Lessons
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7"
                    onClick={() => handleEditModule(module)}
                  >
                    <Pencil className="h-3.5 w-3.5 mr-1" /> Edit Module
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                  </Button>
                </div>

                {module.lessons && module.lessons.length > 0 ? (
                  <div className="ml-4 border-l pl-4 space-y-2">
                    {module.lessons.map((lesson, i) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between py-1"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {i + 1}. {lesson.title}
                          </span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-7">
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="ml-4 border-l pl-4 py-2">
                    <Button variant="ghost" size="sm">
                      <Plus className="h-3.5 w-3.5 mr-1" /> Add Lesson
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="rounded-full bg-muted p-3">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-medium">No modules yet</h3>
            <p className="mt-2 text-center text-muted-foreground max-w-xs">
              Start by adding modules to organize your course content
            </p>
            <Button className="mt-4" onClick={() => setIsAddModuleOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add First Module
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ModuleManager;
