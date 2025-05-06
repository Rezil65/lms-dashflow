
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, FileText, Play, Clock, CheckCircle, ChevronRight, ChevronLeft, Download, Maximize, Volume2, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LearningHubHeader from "@/components/LearningHubHeader";
import VideoPlayer from "@/components/VideoPlayer";
import ResourceItem from "@/components/ResourceItem";

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
  const { toast } = useToast();
  
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

  // Handle navigation between chapters
  const handlePrevious = () => {
    toast({
      title: "Navigation",
      description: "Moving to previous chapter",
    });
  };

  const handleNext = () => {
    toast({
      title: "Navigation",
      description: "Moving to next chapter",
    });
  };

  const handleMarkComplete = () => {
    toast({
      title: "Progress updated",
      description: "Chapter marked as complete",
    });
  };

  const handleDownloadResource = (resourceName: string) => {
    toast({
      title: "Download started",
      description: `Downloading ${resourceName}...`,
    });
  };

  const handleChapterClick = (chapterId: string) => {
    toast({
      title: "Changing chapter",
      description: `Navigating to ${chapterId}`,
    });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)]">
        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          <LearningHubHeader 
            title={course.title}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onMarkComplete={handleMarkComplete}
          />
          
          <div className="relative h-full">
            {/* Video Player */}
            <VideoPlayer 
              thumbnailUrl="/public/lovable-uploads/fafbd30f-cf32-4df0-b591-c13cfc422278.png"
            />
            
            {/* Content Details */}
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2 hover:text-primary transition-colors">Carrot Cake Gingerbread</h2>
              
              <p className="text-muted-foreground mb-6">
                Toffee croissant icing toffee. Sweet roll chupa chups marshmallow muffin liquorice chupa chups soufflé bonbon. Liquorice gummi bears cake donut chocolate lollipop gummi bears. Cake jujubes soufflé.
              </p>
              
              {/* Resources */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Resources</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <ResourceItem 
                    title="nice_recipe.doc"
                    size="521 KB"
                    onDownload={() => handleDownloadResource("nice_recipe.doc")}
                  />
                  
                  <ResourceItem 
                    title="bread_making.doc"
                    size="521 KB"
                    onDownload={() => handleDownloadResource("bread_making.doc")}
                  />
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
                      className={`
                        w-full justify-start py-2 pl-8 pr-2 h-auto text-left 
                        ${chapter.isCompleted ? 'text-muted-foreground' : ''}
                        transition-all duration-200 hover:bg-primary/10
                        ${chapter.current ? 'shadow-inner shadow-primary/20' : ''}
                      `}
                      onClick={() => handleChapterClick(chapter.id)}
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
