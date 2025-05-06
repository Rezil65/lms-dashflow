
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCourses, Course } from "@/utils/courseUtils";
import CourseCard from "./CourseCard";

const RecommendedCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      try {
        const allCourses = await getCourses();
        // Just take a few courses for recommendations
        const recommended = allCourses.slice(0, 4);
        setCourses(recommended);
      } catch (error) {
        console.error("Error loading recommended courses:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCourses();
  }, []);
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">Loading recommended courses...</p>
        </CardContent>
      </Card>
    );
  }
  
  if (courses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">No recommended courses available at this time.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Courses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendedCourses;
