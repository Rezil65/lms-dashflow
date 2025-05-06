
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getCourseById, Course } from "@/utils/courseUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Clock, BookOpen, Users, Star } from "lucide-react";
import CourseModules from "@/components/CourseModules";
import CourseInfoCard from "@/components/CourseInfoCard";

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      setLoading(true);
      
      try {
        const courseData = await getCourseById(id);
        if (courseData) {
          setCourse(courseData);
        }
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourse();
  }, [id]);
  
  if (loading) {
    return (
      <div className="container py-8">
        <div className="mb-6">
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-10 w-3/4 mb-2" />
          <Skeleton className="h-6 w-2/3" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </div>
          <div>
            <Skeleton className="h-[300px] w-full rounded-lg" />
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
      <Button variant="ghost" className="mb-6" asChild>
        <Link to="/courses">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
        </Link>
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-3">
              {course.category && (
                <Badge variant="outline">{course.category}</Badge>
              )}
              {course.level && (
                <Badge variant="outline" className="capitalize">{course.level}</Badge>
              )}
            </div>
            
            <h1 className="text-3xl font-bold mb-3">{course.title}</h1>
            <p className="text-lg text-muted-foreground">{course.description}</p>
            
            <div className="flex flex-wrap gap-6 mt-6">
              {course.duration && (
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>{course.duration}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <span>{course.modules?.length || 0} modules</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span>153 students</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span>4.8/5 (72 reviews)</span>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="content">Course Content</TabsTrigger>
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="py-6">
              <Card>
                <CardHeader>
                  <CardTitle>About this course</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <p>{course.description}</p>
                  
                  <h3>What you'll learn</h3>
                  <ul>
                    <li>Build professional websites using HTML, CSS, and JavaScript</li>
                    <li>Understand core web development concepts</li>
                    <li>Create responsive designs that work across devices</li>
                    <li>Implement modern UI patterns and best practices</li>
                  </ul>
                  
                  <h3>Requirements</h3>
                  <ul>
                    <li>Basic computer skills</li>
                    <li>No prior programming experience needed</li>
                    <li>A computer with internet access</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="content" className="py-6">
              <CourseModules isPreview={true} courseId={id} />
            </TabsContent>
            
            <TabsContent value="instructor" className="py-6">
              {/* Instructor information here */}
            </TabsContent>
            
            <TabsContent value="reviews" className="py-6">
              {/* Reviews here */}
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <CourseInfoCard 
            course={course}
            showEnroll={true}
            showPrice={true}
          />
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Share this course</CardTitle>
              <CardDescription>Help others learn these skills</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Social sharing buttons here */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
