
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, BookOpen } from "lucide-react";
import { Course } from "@/utils/courseUtils";
import { useNavigate } from "react-router-dom";

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-video bg-muted">
        {course.thumbnail_url ? (
          <img 
            src={course.thumbnail_url} 
            alt={course.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="h-10 w-10 text-muted-foreground/40" />
          </div>
        )}
        {course.is_featured && (
          <Badge className="absolute top-2 right-2 bg-primary">Featured</Badge>
        )}
      </div>
      <CardContent className="p-4 space-y-3">
        <div className="flex flex-wrap gap-2 mb-1">
          {course.level && (
            <Badge variant="outline" className="capitalize">{course.level}</Badge>
          )}
          {course.category && (
            <Badge variant="outline">{course.category}</Badge>
          )}
        </div>
        
        <h3 className="font-semibold line-clamp-2">{course.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {course.description || "No description available"}
        </p>
        
        <div className="flex flex-wrap justify-between text-sm text-muted-foreground pt-2">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{course.duration || "Unknown"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>123 students</span>
          </div>
        </div>
        
        <Button 
          className="w-full mt-3" 
          onClick={() => navigate(`/course/${course.id}`)}
        >
          View Course
        </Button>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
