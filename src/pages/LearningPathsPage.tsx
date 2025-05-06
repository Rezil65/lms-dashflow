
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Award, GraduationCap, FileText, ArrowRight } from "lucide-react";

const learningPaths = [
  {
    id: "path1",
    title: "Master Baker Certification",
    description: "Comprehensive path to master professional baking skills",
    progress: 35,
    level: "Intermediate",
    courses: 8,
    quizzes: 5,
    totalHours: 32,
    completedCourses: 3,
    image: "/public/lovable-uploads/79b57a48-41b3-47a6-aba3-8cf20a45a438.png"
  },
  {
    id: "path2",
    title: "Dessert Specialist",
    description: "Learn the art of creating delicious and beautiful desserts",
    progress: 65,
    level: "Advanced",
    courses: 6,
    quizzes: 4,
    totalHours: 24,
    completedCourses: 4,
    image: "/public/lovable-uploads/acddfc48-0a46-4a2e-87a1-9ea3517a6bfa.png"
  },
  {
    id: "path3",
    title: "Bread Making Fundamentals",
    description: "Everything you need to know about bread making from scratch",
    progress: 15,
    level: "Beginner",
    courses: 5,
    quizzes: 3,
    totalHours: 20,
    completedCourses: 1,
    image: "/public/lovable-uploads/690cec0c-c7d9-47e2-9bf6-8de210f5c918.png"
  }
];

const LearningPathsPage = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold">Learning Paths</h1>
          <p className="text-muted-foreground">Follow structured learning paths to master specific skills</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {learningPaths.map((path) => (
            <Card key={path.id} className="overflow-hidden">
              <div className="md:flex">
                <div className="md:w-64 h-48 md:h-auto bg-muted">
                  {path.image ? (
                    <img 
                      src={path.image} 
                      alt={path.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-primary/20 to-primary/5">
                      <GraduationCap className="h-16 w-16 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
                
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">{path.title}</h2>
                      <p className="text-muted-foreground mb-4">{path.description}</p>
                    </div>
                    <Badge className="ml-2">{path.level}</Badge>
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>{path.courses} Courses</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>{path.quizzes} Quizzes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{path.totalHours}h Total</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-amber-500" />
                      <span>Certificate Upon Completion</span>
                    </div>
                  </div>
                  
                  <Progress value={path.progress} className="h-2 mb-2" />
                  
                  <div className="flex justify-between text-sm mb-4">
                    <span className="text-muted-foreground">{path.progress}% complete</span>
                    <span className="font-medium">{path.completedCourses}/{path.courses} courses completed</span>
                  </div>
                  
                  <Button className="w-full md:w-auto">
                    Continue Path <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LearningPathsPage;
