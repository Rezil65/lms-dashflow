import React from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, FileText, Play, Clock, CheckCircle, ChevronRight, ChevronLeft, Download, Maximize, Volume2, Brain } from "lucide-react";

// Define types for our chapter items
type VideoChapter = {
  id: string;
  title: string;
  type: "video";
  duration: string;
  isCompleted: boolean;
  current?: boolean;
};

type DocumentChapter = {
  id: string;
  title: string;
  type: "document";
  isCompleted: boolean;
  current?: boolean;
};

type QuizChapter = {
  id: string;
  title: string;
  type: "quiz";
  questions: number;
  isCompleted: boolean;
  current?: boolean;
};

type Chapter = VideoChapter | DocumentChapter | QuizChapter;

interface CourseModule {
  id: string;
  title: string;
  chapters: Chapter[];
}

interface Course {
  id: string;
  title: string;
  modules: CourseModule[];
}

const LearningHub = () => {
  const { courseId, contentId } = useParams();
  
  // Mock course data
  const course: Course = {
    id: courseId || "course1",
    title: "Bread Making Techniques",
    modules: [
      {
        id: "module1",
        title: "Introduction to Bread Making",
        chapters: [
          {
            id: "chapter1",
            title: "1. Candy cake gummi bears",
            type: "video",
            duration: "4:35",
            isCompleted: true
          },
          {
            id: "chapter2",
            title: "2. Brownie candy biscuit chupa chups",
            type: "video",
            duration: "8:20",
            isCompleted: true
          },
          {
            id: "chapter3",
            title: "3. Cotton candy caramels icing",
            type: "video",
            duration: "5:15",
            isCompleted: false,
            current: true
          },
          {
            id: "chapter4",
            title: "4. Brownie candy biscuit chupa chups",
            type: "document",
            isCompleted: false
          }
        ]
      },
      {
        id: "module2",
        title: "Molding Techniques",
        chapters: [
          {
            id: "chapter5",
            title: "5. Marshmallow liquorice cake liquorice",
            type: "video",
            duration: "7:45",
            isCompleted: false
          },
          {
            id: "chapter6",
            title: "6. Pudding pastry icing",
            type: "video",
            duration: "3:30",
            isCompleted: false
          }
        ]
      },
      {
        id: "module3",
        title: "Baking the Right Way",
        chapters: [
          {
            id: "chapter7",
            title: "7. Biscuit halvah muffin dragée",
            type: "quiz",
            questions: 10,
            isCompleted: false
          },
          {
            id: "chapter8",
            title: "8. Halvah cheesecake tootsie",
            type: "document",
            isCompleted: false
          }
        ]
      }
    ]
  };
  
  // Find the currently active chapter
  const currentModule = course.modules.find(module => 
    module.chapters.some(chapter => chapter.current)
  );
  
  const currentChapter = currentModule?.chapters.find(chapter => 
    chapter.current
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)]">
        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 bg-background border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <div className="hidden md:block">|</div>
                <Button variant="ghost" size="sm">
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <h1 className="text-lg font-medium hidden md:block">{course.title}</h1>
              <Button variant="outline" size="sm" className="ml-auto md:ml-0">
                Mark Complete
              </Button>
            </div>
          </div>
          
          <div className="relative h-full">
            {/* Video Player */}
            <div className="relative aspect-video bg-black max-h-[70vh]">
              <img 
                src="/public/lovable-uploads/fafbd30f-cf32-4df0-b591-c13cfc422278.png" 
                alt="Course content" 
                className="w-full h-full object-cover"
              />
              
              {/* Video Controls Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Button size="icon" className="h-16 w-16 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm">
                  <Play className="h-8 w-8 text-white" fill="white" />
                </Button>
              </div>
              
              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex flex-col space-y-2">
                  <Progress value={45} className="h-1" />
                  
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-3">
                      <Button variant="ghost" size="icon" className="text-white hover:text-white hover:bg-white/10">
                        <Play className="h-4 w-4" />
                      </Button>
                      
                      <span className="text-xs">03:01 / 07:12</span>
                      
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="icon" className="text-white hover:text-white hover:bg-white/10">
                          <Volume2 className="h-4 w-4" />
                        </Button>
                        <Progress value={75} className="h-1 w-16" />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="icon" className="text-white hover:text-white hover:bg-white/10">
                        <Maximize className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Content Details */}
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2">Carrot Cake Gingerbread</h2>
              
              <p className="text-muted-foreground mb-6">
                Toffee croissant icing toffee. Sweet roll chupa chups marshmallow muffin liquorice chupa chups soufflé bonbon. Liquorice gummi bears cake donut chocolate lollipop gummi bears. Cake jujubes soufflé.
              </p>
              
              {/* Resources */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Resources</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Card>
                    <CardContent className="p-4 flex items-center">
                      <div className="p-2 rounded-md bg-pink-100">
                        <FileText className="h-5 w-5 text-pink-600" />
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">nice_recipe.doc</span>
                          <span className="text-xs text-muted-foreground">521 KB</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 flex items-center">
                      <div className="p-2 rounded-md bg-pink-100">
                        <FileText className="h-5 w-5 text-pink-600" />
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">bread_making.doc</span>
                          <span className="text-xs text-muted-foreground">521 KB</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Chapter List */}
        <div className="w-full lg:w-80 xl:w-96 border-t lg:border-t-0 lg:border-l overflow-auto h-80 lg:h-auto shrink-0">
          <div className="p-4 border-b bg-muted/20">
            <h3 className="font-semibold">Course Content</h3>
          </div>
          
          <div className="divide-y">
            {course.modules.map((module, index) => (
              <div key={module.id} className="p-0">
                <div className="flex items-center gap-2 p-4 bg-muted/10">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs">
                    {index + 1}
                  </div>
                  <h4 className="font-medium">{module.title}</h4>
                </div>
                
                <div className="pl-4">
                  {module.chapters.map(chapter => (
                    <Button 
                      key={chapter.id}
                      variant={chapter.current ? "secondary" : "ghost"} 
                      className={`w-full justify-start py-2 pl-8 pr-2 h-auto text-left ${chapter.isCompleted ? 'text-muted-foreground' : ''}`}
                    >
                      <div className="flex items-start gap-2 w-full">
                        <div className={`mt-1 ${chapter.current ? 'text-primary' : (chapter.isCompleted ? 'text-green-500' : 'text-muted-foreground')}`}>
                          {chapter.isCompleted ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : chapter.type === 'video' ? (
                            <Play className="h-4 w-4" />
                          ) : chapter.type === 'document' ? (
                            <FileText className="h-4 w-4" />
                          ) : (
                            <FileText className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <span className={`text-sm ${chapter.current ? 'font-medium' : ''}`}>
                            {chapter.title}
                          </span>
                          <div className="flex items-center mt-1">
                            {chapter.type === 'video' && (
                              <span className="text-xs text-muted-foreground flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {(chapter as VideoChapter).duration}
                              </span>
                            )}
                            {chapter.type === 'quiz' && (
                              <span className="text-xs text-muted-foreground flex items-center">
                                <Brain className="h-3 w-3 mr-1" />
                                {(chapter as QuizChapter).questions} questions
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LearningHub;
