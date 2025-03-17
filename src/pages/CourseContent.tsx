import { useState, useEffect } from "react";
import { ArrowLeft, ChevronDown, ChevronRight, BookOpen, Video, FileText, Image, File, Upload, Plus, ExternalLink } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Header from "@/components/Header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import FileUploader from "@/components/FileUploader";
import { toast } from "@/components/ui/use-toast";
import { getCourseById } from "@/utils/courseStorage";
import ResourceUploader, { Resource } from "@/components/ResourceUploader";
import EditableModule from "@/components/EditableModule";

const courseLessons = [
  {
    id: 1,
    title: "Module 1: Introduction to the Course",
    description: "An overview of what you'll learn and how to use this platform.",
    completion: 100,
    lessons: [
      {
        id: "1-1",
        title: "Welcome to the Course",
        duration: "5 min",
        type: "video",
        completed: true,
        description: "Get to know your instructor and understand what you'll learn in this course."
      },
      {
        id: "1-2",
        title: "How to Use the Learning Platform",
        duration: "8 min",
        type: "video",
        completed: true,
        description: "Learn how to navigate through the course materials efficiently."
      },
      {
        id: "1-3",
        title: "Course Outline & Resources",
        duration: "3 min",
        type: "text",
        completed: true,
        description: "Overview of all modules and supplementary resources available to you."
      }
    ]
  },
  {
    id: 2,
    title: "Module 2: Core Concepts",
    description: "Master the fundamental ideas that will form the foundation of your learning.",
    completion: 75,
    lessons: [
      {
        id: "2-1",
        title: "Understanding the Basics",
        duration: "12 min",
        type: "video",
        completed: true,
        description: "Explore the fundamental concepts that form the basis of this subject."
      },
      {
        id: "2-2",
        title: "Key Terminology",
        duration: "10 min",
        type: "text",
        completed: true,
        description: "Learn essential terms and definitions you'll encounter throughout the course."
      },
      {
        id: "2-3",
        title: "Interactive Example",
        duration: "15 min",
        type: "exercise",
        completed: true,
        description: "Apply what you've learned in a hands-on exercise."
      },
      {
        id: "2-4",
        title: "Advanced Techniques",
        duration: "18 min",
        type: "video",
        completed: false,
        description: "Discover more sophisticated approaches to problem-solving in this field."
      }
    ]
  },
  {
    id: 3,
    title: "Module 3: Practical Applications",
    description: "Apply your knowledge to real-world scenarios and projects.",
    completion: 33,
    lessons: [
      {
        id: "3-1",
        title: "Case Study: Success Story",
        duration: "14 min",
        type: "video",
        completed: true,
        description: "Analyze a real-world success story and extract valuable insights."
      },
      {
        id: "3-2",
        title: "Project Documentation",
        duration: "N/A",
        type: "pdf",
        completed: false,
        description: "Detailed guidelines for completing your project work."
      },
      {
        id: "3-3",
        title: "Guided Project",
        duration: "45 min",
        type: "exercise",
        completed: false,
        description: "Follow step-by-step instructions to complete a comprehensive project."
      }
    ]
  },
  {
    id: 4,
    title: "Module 4: Advanced Topics",
    description: "Dive deeper into specialized areas and cutting-edge developments.",
    completion: 0,
    lessons: [
      {
        id: "4-1",
        title: "Latest Research Findings",
        duration: "20 min",
        type: "video",
        completed: false,
        description: "Explore recent discoveries and their implications for the field."
      },
      {
        id: "4-2",
        title: "Expert Interview",
        duration: "25 min",
        type: "video",
        completed: false,
        description: "Learn from an industry expert about current trends and future directions."
      },
      {
        id: "4-3",
        title: "Final Assessment",
        duration: "30 min",
        type: "exercise",
        completed: false,
        description: "Demonstrate your mastery of the course material through a comprehensive assessment."
      }
    ]
  }
];

const mediaTypeIcon = (type: string) => {
  switch (type) {
    case 'video':
      return <Video className="h-4 w-4" />;
    case 'text':
      return <FileText className="h-4 w-4" />;
    case 'pdf':
      return <File className="h-4 w-4" />;
    case 'image':
      return <Image className="h-4 w-4" />;
    case 'exercise':
      return <BookOpen className="h-4 w-4" />;
    default:
      return <File className="h-4 w-4" />;
  }
};

const CourseContent = () => {
  const { id } = useParams();
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [modules, setModules] = useState(courseLessons);
  
  const courseId = parseInt(id || "0");
  const courseData = getCourseById(courseId);
  
  const courseTitle = courseData?.title || "Advanced React Development";
  const courseDescription = courseData?.description || 
    "Master modern React practices including hooks, context API, and advanced state management techniques.";
  
  useEffect(() => {
    const storageKey = `course-${courseId}-resources`;
    const savedResources = JSON.parse(localStorage.getItem(storageKey) || "[]");
    setResources(savedResources);
    
    const modulesKey = `course-${courseId}-modules`;
    const savedModules = JSON.parse(localStorage.getItem(modulesKey) || "null");
    if (savedModules) {
      setModules(savedModules);
    }
  }, [courseId]);
  
  const toggleModule = (moduleId: number) => {
    if (activeModule === moduleId) {
      setActiveModule(null);
    } else {
      setActiveModule(moduleId);
    }
  };
  
  const handleFileUploaded = (file: File) => {
    setCurrentFile(file);
  };
  
  const handleUploadComplete = () => {
    setUploading(true);
    
    setTimeout(() => {
      setUploading(false);
      setCurrentFile(null);
      
      toast({
        title: "File Uploaded",
        description: "Your file has been uploaded successfully.",
      });
    }, 1500);
  };
  
  const handleResourceAdded = (newResource: Resource) => {
    setResources([...resources, newResource]);
  };
  
  const handleModuleUpdate = (updatedModule: any) => {
    const updatedModules = modules.map(module => 
      module.id === updatedModule.id ? updatedModule : module
    );
    
    setModules(updatedModules);
    
    const modulesKey = `course-${courseId}-modules`;
    localStorage.setItem(modulesKey, JSON.stringify(updatedModules));
  };
  
  const openResource = (resource: Resource) => {
    window.open(resource.url, '_blank');
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
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-2xl font-display font-semibold mb-2">{courseTitle}</h1>
                    <p className="text-muted-foreground mb-4">{courseDescription}</p>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        <span>Upload Content</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Upload Course Material</DialogTitle>
                        <DialogDescription>
                          Upload videos, documents, or other resources for your course.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="py-4">
                        <FileUploader onFileUploaded={handleFileUploaded} />
                      </div>
                      
                      <DialogFooter>
                        <Button
                          type="submit"
                          onClick={handleUploadComplete}
                          disabled={!currentFile || uploading}
                        >
                          {uploading ? "Uploading..." : "Upload to Course"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <Tabs defaultValue="content" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="content">Course Content</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                    <TabsTrigger value="notes">My Notes</TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="space-y-4">
                    {modules.map((module) => (
                      <EditableModule 
                        key={module.id}
                        module={module}
                        onModuleUpdate={handleModuleUpdate}
                        resources={resources}
                      />
                    ))}
                  </TabsContent>

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
                              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md border"
                            >
                              <div className="flex items-center gap-2">
                                <File className="h-4 w-4 text-muted-foreground" />
                                <span 
                                  className="text-blue-600 hover:underline cursor-pointer"
                                  onClick={() => openResource(resource)}
                                >
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
                                  onClick={() => openResource(resource)}
                                >
                                  <ExternalLink className="h-3 w-3" />
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

                  <TabsContent value="notes">
                    <div className="border rounded-lg p-6 text-center">
                      <h3 className="text-lg font-medium mb-2">My Notes</h3>
                      <p className="text-muted-foreground mb-4">You haven't created any notes for this course yet.</p>
                      <Button variant="outline">Create Note</Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-xl border border-border overflow-hidden sticky top-4">
              <div className="p-6">
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
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseContent;
