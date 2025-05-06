
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Book, Clock, DollarSign, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

// Add isPreview prop to component type definition
interface CoursesTabProps {
  isPreview?: boolean;
}

const CoursesTab = ({ isPreview = false }: CoursesTabProps) => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  useEffect(() => {
    fetchCourses();
    
    // Set up a subscription for real-time updates
    const channel = supabase
      .channel('courses-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'courses' },
        (payload) => {
          // Reload courses when there's a change
          fetchCourses();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  const fetchCourses = async () => {
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
  
  const handleViewCourse = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };
  
  // If preview mode, show only 3 courses maximum
  const displayCourses = isPreview ? courses.slice(0, 3) : courses;
  
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }
  
  if (displayCourses.length === 0) {
    return (
      <div className="text-center py-6">
        <h2 className="text-xl font-semibold mb-2 neon-text-primary">Courses</h2>
        <p className="text-muted-foreground mb-4">No courses assigned yet.</p>
        {isAuthenticated && user?.role === 'instructor' && (
          <Button onClick={() => navigate('/create-course')}>Create Course</Button>
        )}
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold neon-text-primary">Assigned Courses</h2>
        {isPreview && courses.length > 3 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/learner?tab=courses')}
            className="glow-effect"
          >
            View All
          </Button>
        )}
      </div>
      
      <div className={`grid grid-cols-1 ${isPreview ? 'gap-3' : 'md:grid-cols-2 lg:grid-cols-3 gap-4'}`}>
        {displayCourses.map((course) => (
          <Card key={course.id} className="overflow-hidden card-3d neon-border-hover">
            <div className="relative h-40 bg-muted">
              {course.thumbnail_url ? (
                <img 
                  src={course.thumbnail_url} 
                  alt={course.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20">
                  <Book className="h-12 w-12 text-blue-300 dark:text-blue-500" />
                </div>
              )}
              {course.is_featured && (
                <Badge className="absolute top-2 right-2 bg-primary/80">Featured</Badge>
              )}
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-semibold line-clamp-2 mb-1">{course.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {course.description}
              </p>
              
              <div className="flex justify-between items-center mb-3 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" /> {course.duration || "1 hour"}
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-3 w-3 mr-1" /> {course.price || 0}
                </div>
              </div>
              
              <Button 
                className="w-full glow-effect" 
                size="sm"
                onClick={() => handleViewCourse(course.id)}
                variant="default"
              >
                View Course <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CoursesTab;
