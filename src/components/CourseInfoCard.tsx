
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, Calendar, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Course } from "@/utils/courseUtils";
import { useAuth } from "@/context/AuthContext";

interface CourseInfoCardProps {
  course: Course;
  showEnroll?: boolean;
  showPrice?: boolean;
}

const CourseInfoCard = ({ course, showEnroll = false, showPrice = false }: CourseInfoCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleEnrollClick = () => {
    if (!user) {
      // Redirect to login if not logged in
      navigate("/login?redirect=/course/" + course.id);
      return;
    }
    // Enroll and redirect to course content
    navigate(`/course/${course.id}/content`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Course Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showPrice && (
          <div className="text-center py-3 border-b">
            <div className="text-3xl font-bold">
              {course.price ? `$${course.price}` : "Free"}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span>Duration</span>
            </div>
            <span className="font-medium">{course.duration || "Unknown"}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              <span>Level</span>
            </div>
            <span className="font-medium capitalize">{course.level || "All Levels"}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span>Last Updated</span>
            </div>
            <span className="font-medium">
              {course.updatedAt ? new Date(course.updatedAt).toLocaleDateString() : "N/A"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span>Students</span>
            </div>
            <span className="font-medium">152 enrolled</span>
          </div>
        </div>

        {showEnroll && (
          <Button className="w-full mt-4" size="lg" onClick={handleEnrollClick}>
            {user ? "Enroll in Course" : "Login to Enroll"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseInfoCard;
