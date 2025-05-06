
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getCourseById, createCourse, updateCourse, addModuleToCourse, Course } from "@/utils/courseUtils";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Save } from "lucide-react";
import CourseForm from "@/components/admin/CourseForm";
import ModuleManager from "@/components/admin/ModuleManager";
import QuizManager from "@/components/Quiz/QuizManager";
import ResourceManager from "@/components/admin/ResourceManager";

const CourseCreation = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<Course>({
    id: "",
    title: "",
    description: "",
    category: "",
    level: "",
    price: 0,
    duration: "",
    thumbnail: "",
    modules: [],
    createdAt: new Date().toISOString()
  });
  
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState("details");

  useEffect(() => {
    if (isEditing && id) {
      const fetchCourse = async () => {
        setLoading(true);
        try {
          const courseData = await getCourseById(id);
          if (courseData) {
            setCourse(courseData);
          } else {
            toast({
              title: "Course not found",
              description: "The requested course could not be found.",
              variant: "destructive",
            });
            navigate("/admin/courses");
          }
        } catch (error) {
          console.error("Error fetching course:", error);
          toast({
            title: "Error",
            description: "Failed to fetch course details.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      };
      
      fetchCourse();
    }
  }, [id, isEditing, navigate]);

  const handleSaveCourse = async (courseData: Course) => {
    setLoading(true);
    try {
      let savedCourse;
      
      if (isEditing && course.id) {
        // Update existing course
        savedCourse = await updateCourse(course.id, courseData);
      } else {
        // Create new course
        savedCourse = await createCourse(courseData);
      }
      
      if (savedCourse) {
        setCourse(savedCourse);
        toast({
          title: "Success",
          description: `Course ${isEditing ? "updated" : "created"} successfully.`,
        });

        // If we just created a new course, navigate to edit mode
        if (!isEditing && savedCourse.id) {
          navigate(`/admin/courses/edit/${savedCourse.id}`);
        }
      }
    } catch (error) {
      console.error("Error saving course:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} course.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddModule = async (moduleData: { title: string; description: string }) => {
    if (!course.id) {
      toast({
        title: "Save course first",
        description: "Please save the course details before adding modules.",
        variant: "destructive",
      });
      setCurrentTab("details");
      return;
    }

    setLoading(true);
    try {
      const newModule = await addModuleToCourse(course.id, moduleData);
      if (newModule) {
        // Update the local course state with the new module
        setCourse(prev => ({
          ...prev,
          modules: [...(prev.modules || []), newModule]
        }));
        
        toast({
          title: "Module added",
          description: `Module "${moduleData.title}" has been added successfully.`
        });
      }
    } catch (error) {
      console.error("Error adding module:", error);
      toast({
        title: "Error",
        description: "Failed to add module.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/admin/courses")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
          </Button>
          <h1 className="text-2xl font-bold">
            {isEditing ? `Edit Course: ${course.title}` : "Create New Course"}
          </h1>
        </div>
        
        {isEditing && (
          <Button onClick={() => handleSaveCourse(course)}>
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        )}
      </div>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="mb-6 grid w-full grid-cols-4">
          <TabsTrigger value="details">Course Details</TabsTrigger>
          <TabsTrigger value="modules" disabled={!isEditing}>Content & Modules</TabsTrigger>
          <TabsTrigger value="quizzes" disabled={!isEditing}>Quizzes</TabsTrigger>
          <TabsTrigger value="resources" disabled={!isEditing}>Resources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <CourseForm 
            initialCourse={course}
            onSave={handleSaveCourse}
            isLoading={loading}
            isEditing={isEditing}
          />
        </TabsContent>
        
        <TabsContent value="modules">
          {isEditing && course.id ? (
            <ModuleManager 
              courseId={course.id}
              modules={course.modules || []}
              onAddModule={handleAddModule}
            />
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">Save Course Details First</h2>
              <p className="text-muted-foreground mb-4">
                Please save the course details before managing modules.
              </p>
              <Button onClick={() => setCurrentTab("details")}>
                Go to Course Details
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="quizzes">
          {isEditing && course.id ? (
            <QuizManager courseId={course.id} />
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">Save Course Details First</h2>
              <p className="text-muted-foreground mb-4">
                Please save the course details before managing quizzes.
              </p>
              <Button onClick={() => setCurrentTab("details")}>
                Go to Course Details
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="resources">
          {isEditing && course.id ? (
            <ResourceManager courseId={course.id} />
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">Save Course Details First</h2>
              <p className="text-muted-foreground mb-4">
                Please save the course details before managing resources.
              </p>
              <Button onClick={() => setCurrentTab("details")}>
                Go to Course Details
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseCreation;
