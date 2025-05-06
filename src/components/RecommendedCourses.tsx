import { useState, useEffect } from "react";
import { getCourses, Course } from "@/utils/courseUtils";
import { useProgress } from "@/hooks/use-progress";
import { useAuth } from "@/context/AuthContext";
import CourseCard from "./CourseCard";

interface RecommendedCoursesProps {
  limit?: number;
}

const RecommendedCourses = ({ limit = 4 }: RecommendedCoursesProps) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { getUserProgress } = useProgress();
  
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      
      try {
        // Get all courses
        const allCourses = await getCourses();
        
        // If user is logged in, filter based on progress
        if (user?.id) {
          const userProgress = await getUserProgress(user.id);
          const courseIds = userProgress.map(p => p.courseId);
          
          // Filter out courses the user has already started
          const notStartedCourses = allCourses.filter(course => !courseIds.includes(course.id));
          
          // Take most recent courses up to the limit
          const sortedCourses = [...notStartedCourses].sort((a, b) => {
            return new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime();
          });
          
          setCourses(sortedCourses.slice(0, limit));
        } else {
          // For not logged in users, just take the most recent courses
          const sortedCourses = [...allCourses].sort((a, b) => {
            return new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime();
          });
          setCourses(sortedCourses.slice(0, limit));
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, [user, limit]);
  
  return (
    <div>
      {loading ? (
        <p>Loading recommended courses...</p>
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <p>No recommended courses found.</p>
      )}
    </div>
  );
};

export default RecommendedCourses;
