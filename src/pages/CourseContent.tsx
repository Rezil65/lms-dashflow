
import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Upload, Video, FileText, MinusCircle, PlusCircle } from "lucide-react";
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
import NotesManager from "@/components/NotesManager";
import QuizManager, { Quiz } from "@/components/QuizManager";

const defaultModules: Module[] = [
  {
    id: "1",
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
    id: "2",
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
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [showProgressCard, setShowProgressCard] = useState(true);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const { hasRole } = useAuth();
  
  const courseId = id || "0";
  const canEdit = hasRole(["admin", "instructor"]);
  const isLearner = hasRole(["learner"]);
  
  useEffect(() => {
    const courseData = getCourse(parseInt(courseId));
    setCourseTitle(courseData?.title || "");
    setCourseDescription(courseData?.description || "");
    
    const storageKey = `course-${courseId}-resources`;
    const savedResources = JSON.parse(localStorage.getItem(storageKey) || "[]");
    setResources(savedResources);
    
    const modulesKey = `course-${courseId}-modules`;
    const savedModules = JSON.parse(localStorage.getItem(modulesKey) || "null");
    if (savedModules) {
      setModules(savedModules);
    } else {
      setModules(defaultModules);
    }

    // Load saved quizzes
    const quizzesKey = `course-${courseId}-quizzes`;
    const savedQuizzes = JSON.parse(localStorage.getItem(quizzesKey) || "[]");
    setQuizzes(savedQuizzes);
  }, [courseId]);
  
  const handleUpdateCourseInfo = () => {
    setEditingCourseInfo(false);
    toast({
      title: "Course Updated",
      description: "Course information has been updated successfully."
    });
  };
  
  const handleAddModule = () => {
    const newModule: Module = {
      id: Date.now().toString(),
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
    
    const storageKey = `course-${courseId}-resources`;
    localStorage.setItem(storageKey, JSON.stringify(updatedResources));
  };
  
  const handleEmbedContent = (embedData: EmbedData) => {
    console.log("Embedding content:", embedData);
    toast({
      title: "Content Embedded",
      description: `${embedData.title} has been embedded in the course.`
    });
  };
  
  const handleSaveQuizzes = (updatedQuizzes: Quiz[]) => {
    setQuizzes(updatedQuizzes);
    
    const quizzesKey = `course-${courseId}-quizzes`;
    localStorage.setItem(quizzesKey, JSON.stringify(updatedQuizzes));
    
    toast({
      title: "Quizzes Saved",
      description: `${updatedQuizzes.length} quiz${updatedQuizzes.length === 1 ? '' : 'zes'} saved successfully.`
    });
  };
  
  const toggleProgressCard = () => {
    setShowProgressCard(!showProgressCard);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10">
      <Header />
      
      <div className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Link to={`/course/${id}`} className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-lg font-semibold">Course Content</h1>
          </div>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden mb-6">
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
                      <h1 className="text-3xl font-display font-semibold mb-2 text-primary-900">
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
                        <Button className="bg-primary hover:bg-primary/90">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Content
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <Tabs defaultValue="content" className="w-full">
                    <TabsList className="mb-4 w-full bg-muted/50 p-1 rounded-lg">
                      <TabsTrigger value="content" className="text-sm font-medium">Course Content</TabsTrigger>
                      <TabsTrigger value="quizzes" className="text-sm font-medium">Quizzes</TabsTrigger>
                      {canEdit && <TabsTrigger value="resources" className="text-sm font-medium">Resources</TabsTrigger>}
                      <TabsTrigger value="notes" className="text-sm font-medium">My Notes</TabsTrigger>
                    </TabsList>

                    <TabsContent value="content" className="space-y-6 animate-fade-in">
                      {canEdit && (
                        <div className="mb-4">
                          <Button onClick={handleAddModule} className="bg-primary hover:bg-primary/90">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Module
                          </Button>
                        </div>
                      )}
                      
                      <div className="space-y-8">
                        {modules.map((module) => (
                          editingModuleId === module.id ? (
                            <ModuleEditor 
                              key={module.id}
                              initialModule={module}
                              onSave={handleSaveModule}
                              courseId={courseId}
                            />
                          ) : (
                            <ModuleDisplay 
                              key={module.id}
                              module={module}
                              onEdit={() => canEdit && setEditingModuleId(module.id)}
                            />
                          )
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="quizzes" className="animate-fade-in">
                      {canEdit ? (
                        <QuizManager 
                          courseId={courseId} 
                          onSaveQuizzes={handleSaveQuizzes} 
                          initialQuizzes={quizzes}
                        />
                      ) : (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 text-center">
                          <h3 className="text-lg font-medium mb-2">Interactive Learning</h3>
                          <p className="text-muted-foreground mb-4">Quizzes are now integrated within the course modules for a better learning experience.</p>
                          <p className="text-sm text-primary">Navigate to the modules above to access and take the quizzes.</p>
                        </div>
                      )}
                    </TabsContent>

                    {canEdit && (
                      <TabsContent value="resources" className="animate-fade-in">
                        <div className="border rounded-lg p-6 bg-white shadow-sm">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">Course Resources</h3>
                            <ResourceUploader 
                              courseId={parseInt(courseId)} 
                              onResourceAdded={handleResourceAdded} 
                            />
                          </div>
                          
                          {resources.length > 0 ? (
                            <ul className="space-y-3">
                              {resources.map((resource) => (
                                <li 
                                  key={resource.id} 
                                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md border transition-colors"
                                >
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="bg-blue-50">{resource.type.split('/')[0]}</Badge>
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

                    <TabsContent value="notes" className="animate-fade-in">
                      <NotesManager courseId={parseInt(courseId)} />
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-primary-900">Your Progress</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleProgressCard} 
                className="h-8 w-8 p-0 rounded-full hover:bg-primary/10"
              >
                {showProgressCard ? <MinusCircle className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
              </Button>
            </div>
            {showProgressCard && (
              <Card className="sticky top-4 shadow-md border-primary/10 overflow-hidden bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Course Completion</span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2 text-primary-900">Continue Learning</h3>
                      <div className="border rounded-lg p-3 hover:bg-primary/5 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="bg-blue-100 text-blue-600 rounded-full p-1.5">
                            <Video className="h-4 w-4" />
                          </div>
                          <span className="font-medium">Advanced Techniques</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Module 2 • 18 minutes
                        </div>
                        <div className="mt-2">
                          <Progress value={65} className="h-1.5" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2 text-primary-900">Next Up</h3>
                      <div className="border rounded-lg p-3 hover:bg-primary/5 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="bg-gray-100 text-gray-600 rounded-full p-1.5">
                            <FileText className="h-4 w-4" />
                          </div>
                          <span className="font-medium">Project Documentation</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Module 3 • PDF
                        </div>
                      </div>
                    </div>
                    
                    <Button className="w-full bg-primary hover:bg-primary/90">Resume Course</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseContent;
