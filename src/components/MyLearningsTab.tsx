
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, BookOpen, Calendar, CheckCircle, Clock, FileText, Play, PlayCircle, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCourses, Course } from "@/utils/courseUtils";
import { useProgress } from "@/hooks/use-progress";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const MyLearningsTab = () => {
  const { user } = useAuth();
  const { getUserProgress } = useProgress();
  const [courses, setCourses] = useState<Course[]>([]);
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCoursesAndProgress = async () => {
      setLoading(true);
      
      try {
        // Fetch courses
        const loadedCourses = await getCourses();
        setCourses(loadedCourses);
        
        // Fetch user progress if user is logged in
        if (user?.id) {
          const progress = await getUserProgress(String(user.id));
          setUserProgress(progress);
        }
      } catch (error) {
        console.error("Error loading courses or progress:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCoursesAndProgress();
  }, [user]);

  const inProgressCourses = courses.slice(0, 2); // Simulating in-progress courses
  const completedCourses = courses.slice(2, 3); // Simulating completed courses

  const handleContinueLearning = (courseId: string) => {
    navigate(`/course/${courseId}/content`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-6">My Learnings</h2>
        
        <Tabs defaultValue="in-progress">
          <TabsList className="mb-4">
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
          </TabsList>
          
          <TabsContent value="in-progress" className="space-y-4">
            {inProgressCourses.length > 0 ? (
              inProgressCourses.map((course) => {
                const progress = Math.floor(Math.random() * 80) + 10; // Random progress between 10-90%
                
                return (
                  <Card key={course.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-64 h-40 md:h-auto bg-muted flex-shrink-0">
                          {course.thumbnail_url ? (
                            <img 
                              src={course.thumbnail_url} 
                              alt={course.title} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <BookOpen className="w-12 h-12 text-muted-foreground/40" />
                            </div>
                          )}
                        </div>
                        
                        <div className="p-6 flex-1 space-y-4">
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
                                {course.level || "All levels"}
                              </span>
                              <span className="text-xs text-muted-foreground flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {course.duration || "Unknown duration"}
                              </span>
                            </div>
                            
                            <h3 className="font-semibold text-lg">{course.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {course.description?.replace(/<[^>]*>/g, '') || "No description available"}
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>{progress}% complete</span>
                              <span className="text-muted-foreground">
                                {Math.ceil((100 - progress) / 10)} hours left
                              </span>
                            </div>
                            <Progress value={progress} className="h-2" />
                          </div>
                          
                          <div className="flex justify-end">
                            <Button onClick={() => handleContinueLearning(course.id)}>
                              <PlayCircle className="w-4 h-4 mr-1" />
                              Continue Learning
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">You don't have any courses in progress.</p>
                <Button variant="outline" className="mt-4" onClick={() => navigate('/learner?tab=courses')}>
                  Browse Courses
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4">
            {completedCourses.length > 0 ? (
              completedCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-64 h-40 md:h-auto bg-muted flex-shrink-0 relative">
                        {course.thumbnail_url ? (
                          <img 
                            src={course.thumbnail_url} 
                            alt={course.title} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="w-12 h-12 text-muted-foreground/40" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                      </div>
                      
                      <div className="p-6 flex-1 space-y-4">
                        <div>
                          <h3 className="font-semibold text-lg">{course.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {course.description?.replace(/<[^>]*>/g, '') || "No description available"}
                          </p>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Award className="text-yellow-500 w-5 h-5" />
                            <span className="text-sm font-medium">Completed on May 15, 2023</span>
                          </div>
                          
                          <Button variant="outline" onClick={() => navigate(`/course/${course.id}/content`)}>
                            <Play className="w-4 h-4 mr-1" />
                            Review Content
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">You haven't completed any courses yet.</p>
                <Button variant="outline" className="mt-4" onClick={() => navigate('/learner?tab=courses')}>
                  Browse Courses
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="saved" className="py-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No saved courses</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              You haven't saved any courses yet. Browse courses and click "Save" to add them to this list.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => navigate('/learner?tab=courses')}>
              Browse Courses
            </Button>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Recent Activities</h3>
        
        <div className="space-y-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-2 rounded">
                  <Video className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Yesterday</p>
                  <h4 className="font-medium">Watched "Introduction to TypeScript" lesson</h4>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>Advanced React Development</span>
                    <span className="mx-2">•</span>
                    <span>45 minutes</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-2 rounded">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">2 days ago</p>
                  <h4 className="font-medium">Completed quiz for "Data Types" module</h4>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>JavaScript Basics</span>
                    <span className="mx-2">•</span>
                    <span>Score: 85%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-2 rounded">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">1 week ago</p>
                  <h4 className="font-medium">Enrolled in "Cloud Architecture on AWS" course</h4>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>Cloud Computing</span>
                    <span className="mx-2">•</span>
                    <span>18 hours of content</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MyLearningsTab;
