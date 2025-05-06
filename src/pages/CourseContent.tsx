
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getCourseById, Course } from "@/utils/courseUtils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, BookOpen, MessageCircle, Users, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CourseModules from "@/components/CourseModules";
import CourseForum from "@/components/CourseForum";
import CourseResources from "@/components/CourseResources";
import CourseInfoCard from "@/components/CourseInfoCard";

const CourseContent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("content");
  
  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) {
        navigate("/courses");
        return;
      }
      
      setLoading(true);
      try {
        const courseData = await getCourseById(id);
        if (courseData) {
          setCourse(courseData);
        } else {
          navigate("/courses");
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        navigate("/courses");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourse();
  }, [id, navigate]);
  
  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div>
            <Skeleton className="h-6 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-[500px] w-full rounded-md" />
          </div>
          <div>
            <Skeleton className="h-[300px] w-full rounded-md" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!course) {
    return (
      <div className="container py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
        <p className="text-muted-foreground mb-6">The course you're looking for doesn't seem to exist.</p>
        <Button asChild>
          <Link to="/courses">Browse Courses</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container py-6">
      <div className="mb-6">
        <Button variant="ghost" className="mb-2" asChild>
          <Link to="/courses">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
          </Link>
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold">{course.title}</h1>
            <p className="text-muted-foreground mt-1">{course.description}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>IN</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Instructor Name</p>
              <p className="text-xs text-muted-foreground">Professor of Computer Science</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" /> 
                <span className="hidden md:inline">Course Content</span>
                <span className="md:hidden">Content</span>
              </TabsTrigger>
              <TabsTrigger value="resources" className="flex items-center gap-2">
                <FileText className="h-4 w-4" /> 
                <span className="hidden md:inline">Course Resources</span>
                <span className="md:hidden">Resources</span>
              </TabsTrigger>
              <TabsTrigger value="forum" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" /> 
                <span className="hidden md:inline">Discussion Forum</span>
                <span className="md:hidden">Forum</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="mt-6">
              <CourseModules courseId={id || ""} />
            </TabsContent>
            
            <TabsContent value="resources" className="mt-6">
              <CourseResources courseId={id || ""} />
            </TabsContent>
            
            <TabsContent value="forum" className="mt-6">
              <CourseForum courseId={id || ""} />
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <CourseInfoCard 
            course={course}
            showEnroll
          />
          
          <div className="mt-6 border rounded-lg p-4 bg-white">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Course Members</CardTitle>
            </div>
            <CardDescription className="mb-4">12 students enrolled in this course</CardDescription>
            
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Avatar key={i}>
                  <AvatarImage src={`https://i.pravatar.cc/150?img=${i + 10}`} />
                  <AvatarFallback>U{i}</AvatarFallback>
                </Avatar>
              ))}
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                +6
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContent;
