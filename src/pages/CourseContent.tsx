import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Upload, Video, FileText } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Header from "@/components/Header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { getCourse } from "@/utils/courseStorage";
import ResourceUploader, { Resource } from "@/components/ResourceUploader";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/RichTextEditor";
import ModuleEditor, { Module } from "@/components/ModuleEditor";
import ModuleDisplay from "@/components/ModuleDisplay";
import ContentEmbedder, { EmbedData } from "@/components/ContentEmbedder";
import { Card, CardContent } from "@/components/ui/card";

const defaultModules: Module[] = [
  {
    id: 1,
    title: "Module 1: Introduction to the Course",
    description: "An overview of what you'll learn and how to use this platform.",
    lessons: [
      {
        id: "1-1",
        title: "Welcome to the Course",
        type: "video",
        content: "Get to know your instructor and understand what you'll learn in this course.",
        duration: "5 min",
      },
      {
        id: "1-2",
        title: "How to Use the Learning Platform",
        type: "text",
        content: "Learn how to navigate through the course materials efficiently.",
        duration: "8 min",
      }
    ]
  },
  {
    id: 2,
    title: "Module 2: Core Concepts",
    description: "Master the fundamental ideas that will form the foundation of your learning.",
    lessons: [
      {
        id: "2-1",
        title: "Understanding the Basics",
        type: "video",
        content: "Explore the fundamental concepts that form the basis of this subject.",
        duration: "12 min",
      },
      {
        id: "2-2",
        title: "Key Terminology",
        type: "text",
        content: "Learn essential terms and definitions you'll encounter throughout the course.",
        duration: "10 min",
      }
    ]
  }
];

const CourseContent = () => {
  const { id } = useParams();
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [resources, setResources] = useState<Resource[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [editingCourseInfo, setEditingCourseInfo] = useState(false);
  const [editingModuleId, setEditingModuleId] = useState<number | null>(null);
  const { hasRole } = useAuth();
  
  const courseId = parseInt(id || "0");
  const canEdit = hasRole(["admin", "instructor"]);
  const isLearner = hasRole(["learner"]);
  
  useEffect(() => {
    // Get course data
    const courseData = getCourse(courseId);
    setCourseTitle(courseData?.title || "");
    setCourseDescription(courseData?.description || "");
    
    // Get resources
    const storageKey = `course-${courseId}-resources`;
    const savedResources = JSON.parse(localStorage.getItem(storageKey) || "[]");
    setResources(savedResources);
    
    // Get modules
    const modulesKey = `course-${courseId}-modules`;
    const savedModules = JSON.parse(localStorage.getItem(modulesKey) || "null");
    if (savedModules) {
      setModules(savedModules);
    } else {
      // Use default modules if none exist
      setModules(defaultModules);
    }
  }, [courseId]);
  
  const handleUpdateCourseInfo = () => {
    // In a real app, this would save to a backend
    // For now, just update local state and show toast
    setEditingCourseInfo(false);
    toast({
      title: "Course Updated",
      description: "Course information has been updated successfully."
    });
  };
  
  const handleAddModule = () => {
    const newModule: Module = {
      id: Date.now(),
      title: `Module ${modules.length + 1}`,
      description: "Enter module description",
      lessons: []
    };
    
    setModules([...modules, newModule]);
    setEditingModuleId(newModule.id);
  };
  
  const handleSaveModule = (updatedModule: Module) => {
    const updatedModules = modules.map(module => 
      module.id === updatedModule.id ? updatedModule : module
    );
    
    setModules(updatedModules);
    setEditingModuleId(null);
    
    // Save to localStorage
    const modulesKey = `course-${courseId}-modules`;
    localStorage.setItem(modulesKey, JSON.stringify(updatedModules));
    
    toast({
      title: "Module Saved",
      description: "Module has been saved successfully."
    });
  };
  
  const handleResourceAdded = (newResource: Resource) => {
    const updatedResources = [...resources, newResource];
    setResources(updatedResources);
    
    // Save to localStorage
    const storageKey = `course-${courseId}-resources`;
    localStorage.setItem(storageKey, JSON.stringify(updatedResources));
  };
  
  const handleEmbedContent = (embedData: EmbedData) => {
    // Add embedded content to course overview
    // In a real app, this would add HTML to the course description
    console.log("Embedding content:", embedData);
    toast({
      title: "Content Embedded",
      description: `${embedData.title} has been embedded in the course.`
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Link to={`/course/${id}`} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-lg font-semibold">Course Content</h1>
          </div>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-border overflow-hidden mb-6">
              {editingCourseInfo ? (
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Course Title</label>
                    <Input 
                      value={courseTitle} 
                      onChange={(e) => setCourseTitle(e.target.value)}
                      className="text-2xl font-semibold"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Course Description</label>
                    <RichTextEditor 
                      initialValue={courseDescription} 
                      onChange={setCourseDescription}
                      placeholder="Enter course description..."
                    />
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        Embed Content
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Embed Content in Course Overview</DialogTitle>
                      </DialogHeader>
                      <ContentEmbedder onEmbed={handleEmbedContent} />
                    </DialogContent>
                  </Dialog>
                  
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setEditingCourseInfo(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateCourseInfo}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-2xl font-display font-semibold mb-2">
                        {courseTitle || "Blockchain Technology"}
                      </h1>
                      
                      <div 
                        className="prose prose-sm max-w-none text-muted-foreground mb-4"
                        dangerouslySetInnerHTML={{ __html: courseDescription || "Blockchain is the backbone of a new digital anatomy, a ledger not just for cryptocurrency enthusiasts but for anyone interested in secure, transparent, and decentralized systems." }}
                      />
                    </div>
                    
                    {canEdit && (
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setEditingCourseInfo(true)}>
                          Edit Course Info
                        </Button>
                        <Button>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Content
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <Tabs defaultValue="content" className="w-full">
                    <TabsList className="mb-4">
                      <TabsTrigger value="content">Course Content</TabsTrigger>
                      {canEdit && <TabsTrigger value="resources">Resources</TabsTrigger>}
                      <TabsTrigger value="notes">My Notes</TabsTrigger>
                    </TabsList>

                    <TabsContent value="content" className="space-y-4">
                      {canEdit && (
                        <div className="mb-4">
                          <Button onClick={handleAddModule}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Module
                          </Button>
                        </div>
                      )}
                      
                      {modules.map((module) => (
                        editingModuleId === module.id ? (
                          <ModuleEditor 
                            key={module.id}
                            module={module}
                            onSave={handleSaveModule}
                            onCancel={() => setEditingModuleId(null)}
                          />
                        ) : (
                          <ModuleDisplay 
                            key={module.id}
                            module={module}
                            onEdit={() => canEdit && setEditingModuleId(module.id)}
                          />
                        )
                      ))}
                    </TabsContent>

                    {canEdit && (
                      <TabsContent value="resources">
                        <div className="border rounded-lg p-6">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">Course Resources</h3>
                            <ResourceUploader 
                              courseId={courseId} 
                              onResourceAdded={handleResourceAdded} 
                            />
                          </div>
                          
                          {resources.length > 0 ? (
                            <ul className="space-y-3">
                              {resources.map((resource) => (
                                <li 
                                  key={resource.id} 
                                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md border"
                                >
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline">{resource.type.split('/')[0]}</Badge>
                                    <span className="text-blue-600 hover:underline cursor-pointer">
                                      {resource.name}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="text-xs text-muted-foreground mr-3">
                                      {new Date(resource.dateAdded).toLocaleDateString()}
                                    </span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => window.open(resource.url, '_blank')}
                                    >
                                      View
                                    </Button>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-muted-foreground text-center py-4">
                              No resources yet. Add resources using the button above.
                            </p>
                          )}
                        </div>
                      </TabsContent>
                    )}

                    <TabsContent value="notes">
                      <div className="border rounded-lg p-6 text-center">
                        <h3 className="text-lg font-medium mb-2">My Notes</h3>
                        <p className="text-muted-foreground mb-4">You haven't created any notes for this course yet.</p>
                        <Button variant="outline">Create Note</Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Your Progress</h2>
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Course Completion</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Continue Learning</h3>
                    <div className="border rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-blue-100 text-blue-600 rounded-full p-1">
                          <Video className="h-4 w-4" />
                        </div>
                        <span className="font-medium">Advanced Techniques</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Module 2 • 18 minutes
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Next Up</h3>
                    <div className="border rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-gray-100 text-gray-600 rounded-full p-1">
                          <FileText className="h-4 w-4" />
                        </div>
                        <span className="font-medium">Project Documentation</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Module 3 • PDF
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full">Resume Course</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseContent;
