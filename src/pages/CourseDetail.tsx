import React, { useState, useEffect } from "react";
import { ArrowLeft, BookOpen, Calendar, Clock, Video, Edit, Pencil } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { getCourse, updateCourse, Course } from "@/utils/courseStorage";
import CourseDetailsEditor, { CourseDetails } from "@/components/CourseDetailsEditor";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  const canEditCourse = hasPermission("manage_courses") || 
                         hasPermission("manage_own_courses") || 
                         hasPermission("edit_course_modules");

  useEffect(() => {
    if (id) {
      try {
        const fetchedCourse = getCourse(parseInt(id));
        if (fetchedCourse) {
          setCourse(fetchedCourse);
        } else {
          toast({
            title: "Course not found",
            description: "The course you're looking for doesn't exist.",
            variant: "destructive"
          });
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        toast({
          title: "Error",
          description: "Failed to load course details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
  }, [id, navigate]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveDetails = (updatedDetails: CourseDetails) => {
    try {
      if (course) {
        const updatedCourse: Course = {
          ...course,
          title: updatedDetails.title,
          description: updatedDetails.description,
          category: updatedDetails.category,
          duration: updatedDetails.duration,
          lessonCount: updatedDetails.lessonCount,
          thumbnail: updatedDetails.thumbnail,
          embedContent: updatedDetails.embedContent,
          updatedAt: new Date().toISOString()
        };
        
        updateCourse(updatedCourse);
        setCourse(updatedCourse);
        setIsEditing(false);
        toast({
          title: "Course updated",
          description: "Your course details have been saved successfully."
        });
      }
    } catch (error) {
      console.error("Error updating course:", error);
      toast({
        title: "Error",
        description: "Failed to save course details",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center">Course not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link to="/" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <h1 className="text-lg font-semibold">Course Details</h1>
            </div>
            
            {canEditCourse && !isEditing && (
              <Button variant="outline" size="sm" onClick={handleEditToggle}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Details
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-8">
        {isEditing ? (
          <CourseDetailsEditor 
            courseDetails={course} 
            onSave={handleSaveDetails} 
            onCancel={() => setIsEditing(false)} 
          />
        ) : (
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="bg-gradient-to-r from-lms-blue to-lms-purple p-8 text-white">
              <div className="max-w-3xl">
                <h1 className="text-3xl font-display font-semibold mb-4">{course.title}</h1>
                <p className="text-white/90 mb-6">
                  {course.description ? (
                    <div dangerouslySetInnerHTML={{ __html: course.description.substring(0, 200) + (course.description.length > 200 ? '...' : '') }} />
                  ) : (
                    "Master modern development practices and techniques."
                  )}
                </p>
                
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 opacity-70" />
                    <span className="text-sm">{course.duration || "12 hours"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 opacity-70" />
                    <span className="text-sm">{course.lessonCount || 24} lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 opacity-70" />
                    <span className="text-sm">{course.category || "Web Development"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 opacity-70" />
                    <span className="text-sm">
                      Updated {course.updatedAt 
                        ? new Date(course.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                        : "June 2023"}
                    </span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Link to={`/course/${id}/content`}>
                    <Button className="bg-white text-blue-600 hover:bg-blue-50">
                      Start Learning
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="max-w-3xl">
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Course Description</h2>
                  <div className="prose prose-sm max-w-none">
                    {course.description ? (
                      <div dangerouslySetInnerHTML={{ __html: course.description }} />
                    ) : (
                      <p className="text-muted-foreground">No detailed description available for this course.</p>
                    )}
                  </div>
                </div>
                
                {course.embedContent && course.embedContent.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Additional Content</h2>
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
                          {(embed.type === 'html' || embed.type === 'file') && (
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
                
                <h2 className="text-xl font-semibold mb-4">Course Outline</h2>
                
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">1. Introduction</h3>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">45 min</span>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">2. Core Concepts</h3>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">1.5 hours</span>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">3. Advanced Techniques</h3>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">2 hours</span>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-muted-foreground">4. Project Implementation</h3>
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">Locked</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex">
                  <Link to={`/course/${id}/content`}>
                    <Button size="lg">
                      Go to Course Content
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CourseDetail;
