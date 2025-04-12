
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface Module {
  id: string;
  title: string;
  description: string;
  lessonsCount: number;
  completedLessons: number;
  duration: string;
}

interface CourseModulesProps {
  isPreview?: boolean;
  courseId?: string;
}

const CourseModules = ({ isPreview = false, courseId }: CourseModulesProps) => {
  const navigate = useNavigate();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API call to fetch modules
    const fetchModules = async () => {
      setLoading(true);
      
      // Mock data
      const mockModules: Module[] = [
        {
          id: "mod1",
          title: "Introduction to Web Development",
          description: "Learn the basics of HTML, CSS, and JavaScript",
          lessonsCount: 5,
          completedLessons: 3,
          duration: "2h 30m"
        },
        {
          id: "mod2",
          title: "React Fundamentals",
          description: "Core concepts of React.js framework",
          lessonsCount: 8,
          completedLessons: 4,
          duration: "3h 45m"
        },
        {
          id: "mod3",
          title: "State Management",
          description: "Managing state in React applications",
          lessonsCount: 6,
          completedLessons: 1,
          duration: "2h 15m"
        }
      ];
      
      setTimeout(() => {
        setModules(isPreview ? mockModules.slice(0, 2) : mockModules);
        setLoading(false);
      }, 500);
    };
    
    fetchModules();
  }, [isPreview]);

  const handleViewModule = (moduleId: string) => {
    navigate(`/course/${courseId || 'default'}/content?module=${moduleId}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Course Modules</h3>
        {isPreview && (
          <Button variant="ghost" size="sm" className="text-sm" onClick={() => navigate(`/course/${courseId || 'default'}/content`)}>
            View All <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
      
      {loading ? (
        <div className="space-y-4">
          <div className="h-24 rounded-md bg-gray-100 animate-pulse"></div>
          <div className="h-24 rounded-md bg-gray-100 animate-pulse"></div>
        </div>
      ) : modules.length > 0 ? (
        <div className="space-y-3">
          {modules.map((module) => (
            <Card key={module.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-md">{module.title}</h4>
                      <Badge variant="outline" className="ml-auto">
                        {module.duration}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                      {module.description}
                    </p>
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span>{Math.round((module.completedLessons / module.lessonsCount) * 100)}%</span>
                      </div>
                      <Progress value={(module.completedLessons / module.lessonsCount) * 100} className="h-1.5" />
                      <div className="flex items-center mt-2 justify-between">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <BookOpen className="h-3 w-3 mr-1" />
                          {module.completedLessons} / {module.lessonsCount} lessons
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 text-xs"
                          onClick={() => handleViewModule(module.id)}
                        >
                          Continue
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border rounded-md bg-gray-50">
          <p className="text-muted-foreground">No modules available</p>
        </div>
      )}
    </div>
  );
};

export default CourseModules;
