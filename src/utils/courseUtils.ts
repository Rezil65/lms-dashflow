
import { toast } from "@/hooks/use-toast";
import { 
  Course, 
  Module, 
  Lesson, 
  getCourses, 
  getCourseById, 
  getTotalCourseCount as getStorageCourseCount,
  addCourse as createCourse,
  updateCourse,
  deleteCourse,
  addModuleToCourse,
  updateCourseModule,
  deleteCourseModule,
  addLessonToModule,
  updateLesson,
  deleteLesson
} from "@/utils/courseStorage";

// Re-export the types and functions
export { 
  Course, 
  Module, 
  Lesson, 
  getCourses, 
  getCourseById, 
  createCourse,
  updateCourse,
  deleteCourse,
  addModuleToCourse,
  updateCourseModule,
  deleteCourseModule,
  addLessonToModule,
  updateLesson,
  deleteLesson
};

// Mock function to get course count - in a real app this would connect to an API/database
export const getCoursesCount = async (): Promise<number> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock data
  return 18;
};

export const getTotalCourseCount = async (): Promise<number> => {
  try {
    // Try to get the actual count from storage first
    return await getStorageCourseCount();
  } catch (error) {
    console.error("Error fetching course count:", error);
    toast({
      title: "Failed to load course data",
      description: "Please try again later",
      variant: "destructive",
    });
    return 0;
  }
};

// Mock function to enroll in a course
export const enrollInCourse = async (courseId: string): Promise<boolean> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Enrolled successfully",
      description: "You have been enrolled in the course",
    });
    
    return true;
  } catch (error) {
    console.error("Error enrolling in course:", error);
    toast({
      title: "Enrollment failed",
      description: "There was an error enrolling you in this course",
      variant: "destructive",
    });
    return false;
  }
};

export const getCourseProgress = async (courseId: string): Promise<number> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return random progress for demo purposes
  return Math.floor(Math.random() * 100);
};
