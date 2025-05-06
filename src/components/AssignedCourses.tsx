
import { useEffect, useState } from "react";
import { Book, Clock, Eye, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Card, CardContent } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  thumbnail_url?: string;
  duration?: string;
  lessonCount?: number;
  isFeatured?: boolean;
  price?: number;
  embedContent?: any[];
}

const CourseItem = ({ course }: { course: Course }) => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // In a real implementation, fetch actual progress for this course
    setProgress(Math.floor(Math.random() * 100));
  }, [course.id]);
  
  const handleCourseClick = () => {
    navigate(`/course/${course.id}/content`);
  };
  
  // Get the first 50 words of description
  const shortDescription = course.description
    ? course.description
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .split(' ')
        .slice(0, 50)
        .join(' ') + 
        (course.description.split(' ').length > 50 ? '...' : '')
    : "No description available";
  
  return (
    <Card className="hover:shadow-md transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-32 h-24 rounded bg-muted/50 flex items-center justify-center overflow-hidden">
            {(course.thumbnail || course.thumbnail_url) ? (
              <img 
                src={course.thumbnail || course.thumbnail_url} 
                alt={course.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <Book className="w-8 h-8 text-primary/60" />
            )}
          </div>
          
          <div className="flex-1 space-y-2">
            <h3 className="font-medium">{course.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{shortDescription}</p>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <div className="text-xs text-muted-foreground flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1" />
                {course.duration || "0 hours"}
              </div>
              
              <div className="space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>{course.title}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-2">
                      <div className="aspect-video bg-muted/50 rounded-md overflow-hidden flex items-center justify-center">
                        {(course.thumbnail || course.thumbnail_url) ? (
                          <img 
                            src={course.thumbnail || course.thumbnail_url} 
                            alt={course.title} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <Book className="w-12 h-12 text-primary/60" />
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{course.duration || "Unknown duration"}</span>
                        </div>
                        {course.lessonCount && (
                          <div className="flex items-center gap-1">
                            <Book className="h-4 w-4 text-muted-foreground" />
                            <span>{course.lessonCount} lessons</span>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-1">Description:</h3>
                        <div 
                          className="prose prose-sm max-w-none text-muted-foreground" 
                          dangerouslySetInnerHTML={{ __html: course.description || "No description available" }}
                        />
                      </div>
                      
                      {course.embedContent && course.embedContent.length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium mb-2">Additional Content:</h3>
                          <div className="space-y-4">
                            {course.embedContent.map((embed, index) => (
                              <div key={index} className="border rounded-lg p-4">
                                <h3 className="font-medium mb-2">{embed.title}</h3>
                                {embed.type === 'video' && (
                                  <div className="aspect-video">
                                    <iframe
                                      src={embed.url}
                                      title={embed.title}
                                      width={embed.width || "100%"}
                                      height={embed.height || "315"}
                                      frameBorder="0"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                      className="w-full h-full"
                                    ></iframe>
                                  </div>
                                )}
                                {embed.type === 'iframe' && (
                                  <iframe
                                    src={embed.url}
                                    title={embed.title}
                                    width={embed.width || "100%"}
                                    height={embed.height || "400"}
                                    frameBorder="0"
                                    className="w-full"
                                  ></iframe>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-4 flex justify-end">
                        <Button onClick={handleCourseClick}>
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Start Learning
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button size="sm" onClick={handleCourseClick}>
                  <PlayCircle className="h-3.5 w-3.5 mr-1" />
                  Start
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AssignedCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    loadCourses();
    
    // Set up a subscription for real-time updates
    const channel = supabase
      .channel('courses-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'courses' },
        () => {
          // Reload courses when there's a change
          loadCourses();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
  
  const loadCourses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Assigned Courses</h2>
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : courses.length > 0 ? (
          courses.map((course) => (
            <CourseItem key={course.id} course={course} />
          ))
        ) : (
          <p className="text-sm text-muted-foreground py-4">
            You don't have any assigned courses yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default AssignedCourses;
