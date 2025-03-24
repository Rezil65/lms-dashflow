
import { useState, useEffect } from "react";
import { getCourses, Course } from "@/utils/courseStorage";
import { Book, Clock, Eye, PlayCircle, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Card, CardContent } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";

const CourseItem = ({ course }: { course: Course }) => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // Simulate user progress
    setProgress(Math.floor(Math.random() * 100));
  }, []);
  
  const handleCourseClick = () => {
    navigate(`/course/${course.id.toString()}/content`);
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
            {course.thumbnail ? (
              <img 
                src={course.thumbnail} 
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
                        {course.thumbnail ? (
                          <img 
                            src={course.thumbnail} 
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

const CoursesTab = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    loadCourses();
    
    // Listen for course added event
    window.addEventListener('courseAdded', loadCourses);
    
    return () => {
      window.removeEventListener('courseAdded', loadCourses);
    };
  }, []);
  
  const loadCourses = () => {
    const allCourses = getCourses();
    setCourses(allCourses);
  };
  
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">My Courses</h2>
        <div className="relative max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search courses..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <CourseItem key={course.id} course={course} />
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                {searchTerm ? "No courses match your search." : "You don't have any assigned courses yet."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CoursesTab;
