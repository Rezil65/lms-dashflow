
import { useState, useEffect } from "react";
import { getCourses, Course } from "@/utils/courseUtils";
import { useProgress } from "@/hooks/use-progress";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, BookOpen, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RecommendedCoursesProps {
  limit?: number;
}

const RecommendedCourses = ({ limit = 4 }: RecommendedCoursesProps) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { getUserProgress } = useProgress();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      
      try {
        // Get all courses
        const allCourses = await getCourses();
        
        // If user is logged in, filter based on progress
        if (user?.id) {
          const userProgress = await getUserProgress(user.id);
          const courseIds = userProgress.map(p => p.courseId);
          
          // Filter out courses the user has already started
          const notStartedCourses = allCourses.filter(course => !courseIds.includes(course.id));
          
          // Take most recent courses up to the limit
          const sortedCourses = [...notStartedCourses].sort((a, b) => {
            return new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime();
          });
          
          setCourses(sortedCourses.slice(0, limit));
        } else {
          // For not logged in users, just take the most recent courses
          const sortedCourses = [...allCourses].sort((a, b) => {
            return new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime();
          });
          setCourses(sortedCourses.slice(0, limit));
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, [user, limit]);

  const handleViewCourse = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recommended For You</h2>
        <Button variant="ghost" size="sm" onClick={() => navigate('/courses')}>
          View All <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      
      {loading ? (
        <p>Loading recommended courses...</p>
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {courses.map((course) => (
            <Card key={course.id} className="h-full overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative aspect-video bg-muted">
                {course.thumbnail_url ? (
                  <img 
                    src={course.thumbnail_url} 
                    alt={course.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="h-10 w-10 text-muted-foreground/40" />
                  </div>
                )}
                {course.is_featured && (
                  <Badge className="absolute top-2 right-2 bg-primary">Featured</Badge>
                )}
              </div>
              <CardContent className="p-4 space-y-3">
                <div className="flex flex-wrap gap-2 mb-1">
                  {course.level && (
                    <Badge variant="outline" className="capitalize">{course.level}</Badge>
                  )}
                  {course.category && (
                    <Badge variant="outline">{course.category}</Badge>
                  )}
                </div>
                
                <h3 className="font-semibold line-clamp-2">{course.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {course.description || "No description available"}
                </p>
                
                <div className="flex flex-wrap justify-between text-sm text-muted-foreground pt-2">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration || "Unknown"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>123 students</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-3" 
                  onClick={() => handleViewCourse(course.id)}
                >
                  View Course
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p>No recommended courses found.</p>
      )}
    </div>
  );
};

export default RecommendedCourses;
