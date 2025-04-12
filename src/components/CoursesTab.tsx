
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Book, Clock, DollarSign, ExternalLink } from "lucide-react";

// Add isPreview prop to component type definition
interface CoursesTabProps {
  isPreview?: boolean;
}

const CoursesTab = ({ isPreview = false }: CoursesTabProps) => {
  const [courses, setCourses] = useState<any[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    // In a real app, fetch courses from an API
    // For now, use mock data stored in localStorage
    const storedCourses = localStorage.getItem("courses");
    const parsedCourses = storedCourses ? JSON.parse(storedCourses) : [];
    
    // Sort courses by date (newest first)
    const sortedCourses = [...parsedCourses].sort((a, b) => 
      new Date(b.createdAt || Date.now()).getTime() - 
      new Date(a.createdAt || Date.now()).getTime()
    );
    
    setCourses(sortedCourses);
    
    // Listen for course added event
    const handleCourseAdded = () => {
      const updatedCourses = localStorage.getItem("courses");
      const parsedUpdatedCourses = updatedCourses ? JSON.parse(updatedCourses) : [];
      setCourses(parsedUpdatedCourses);
    };
    
    window.addEventListener('courseAdded', handleCourseAdded);
    
    return () => {
      window.removeEventListener('courseAdded', handleCourseAdded);
    };
  }, []);
  
  const handleViewCourse = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };
  
  // If preview mode, show only 3 courses maximum
  const displayCourses = isPreview ? courses.slice(0, 3) : courses;
  
  if (displayCourses.length === 0) {
    return (
      <div className="text-center py-6">
        <h2 className="text-xl font-semibold mb-2">Courses</h2>
        <p className="text-muted-foreground mb-4">No courses assigned yet.</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Assigned Courses</h2>
        {isPreview && courses.length > 3 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/learner?tab=courses')}
          >
            View All
          </Button>
        )}
      </div>
      
      <div className={`grid grid-cols-1 ${isPreview ? 'gap-3' : 'md:grid-cols-2 lg:grid-cols-3 gap-4'}`}>
        {displayCourses.map((course) => (
          <Card key={course.id} className="overflow-hidden">
            <div className="relative h-40 bg-muted">
              {course.thumbnail ? (
                <img 
                  src={course.thumbnail} 
                  alt={course.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-blue-100">
                  <Book className="h-12 w-12 text-blue-300" />
                </div>
              )}
              {course.isFeatured && (
                <Badge className="absolute top-2 right-2">Featured</Badge>
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
                className="w-full" 
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
