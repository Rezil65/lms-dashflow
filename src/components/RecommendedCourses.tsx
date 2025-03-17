
import { useEffect, useState } from "react";
import { Book, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCourses } from "@/utils/courseStorage";

interface Course {
  id: number;
  title: string;
  description: string;
  category?: string;
  duration?: number;
  createdAt: string;
}

const CourseItem = ({ course }: { course: Course }) => {
  const navigate = useNavigate();
  
  const handleCourseClick = () => {
    navigate(`/course/${course.id}/content`);
  };
  
  return (
    <div 
      className="flex items-center gap-3 animate-fade-in cursor-pointer hover:bg-muted/30 p-2 rounded-md transition-colors"
      onClick={handleCourseClick}
    >
      <div className="w-9 h-9 rounded-full bg-muted/50 flex items-center justify-center">
        <Book className="w-4 h-4 text-lms-blue" />
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-sm">{course.title}</h3>
        <p className="text-xs text-muted-foreground">
          {course.category || "Uncategorized"} • {course.duration || 0} hours
        </p>
      </div>
      <div className="text-xs text-muted-foreground flex items-center">
        <Clock className="w-3 h-3 mr-1" />
        {new Date(course.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

const RecommendedCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  
  useEffect(() => {
    // Load courses when component mounts
    loadCourses();
    
    // Listen for course added event
    window.addEventListener('courseAdded', loadCourses);
    
    return () => {
      window.removeEventListener('courseAdded', loadCourses);
    };
  }, []);
  
  const loadCourses = () => {
    const allCourses = getCourses();
    // Sort by creation date (newest first) and take the 3 most recent
    const sortedCourses = allCourses
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
    
    setCourses(sortedCourses);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Courses Created</h2>
      <div className="space-y-3">
        {courses.length > 0 ? (
          courses.map((course) => (
            <CourseItem key={course.id} course={course} />
          ))
        ) : (
          <p className="text-sm text-muted-foreground py-4">
            You haven't created any courses yet. Create a course to see it here.
          </p>
        )}
      </div>
    </div>
  );
};

export default RecommendedCourses;
