
import React from "react";
import DashboardLayout from "./DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpen, GraduationCap, BrainCircuit, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const navigate = useNavigate();
  
  // Mock data for the enrolled courses
  const enrolledCourses = [
    {
      id: "course1",
      title: "Introduction to Bread Making",
      progress: 65,
      imageUrl: "/public/lovable-uploads/fafbd30f-cf32-4df0-b591-c13cfc422278.png"
    },
    {
      id: "course2",
      title: "Advanced Pastry Techniques",
      progress: 32,
      imageUrl: "/public/lovable-uploads/79b57a48-41b3-47a6-aba3-8cf20a45a438.png"
    },
    {
      id: "course3",
      title: "Cake Decorating Fundamentals",
      progress: 90,
      imageUrl: "/public/lovable-uploads/79b57a48-41b3-47a6-aba3-8cf20a45a438.png"
    }
  ];

  // Mock data for the statistics
  const stats = [
    { title: "Courses", value: 12, icon: BookOpen },
    { title: "Hours Spent", value: 48, icon: Clock },
    { title: "Quizzes Completed", value: 24, icon: BrainCircuit },
    { title: "Certificates", value: 5, icon: GraduationCap }
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-semibold">Welcome back, Lisa</h1>
        <p className="text-muted-foreground">Continue your learning journey</p>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{stat.title}</p>
                  <p className="text-3xl font-semibold">{stat.value}</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Continue Learning */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Continue Learning</h2>
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrolledCourses.map(course => (
              <Card key={course.id} className="overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={course.imageUrl} 
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105" 
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2 line-clamp-1">{course.title}</h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                    <span>{course.progress}% complete</span>
                  </div>
                  <Progress value={course.progress} className="h-1.5" />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-3"
                    onClick={() => navigate(`/course/${course.id}/learn`)}
                  >
                    Continue
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recommended Quizzes */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recommended Quizzes</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/quiz')}>
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg">Bread Making Fundamentals</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-muted-foreground text-sm mb-4">Test your knowledge on basic bread making techniques</p>
                <div className="flex justify-between text-sm mb-4">
                  <span className="flex items-center">
                    <BrainCircuit className="mr-1 h-4 w-4" /> 10 questions
                  </span>
                  <span className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" /> 15 min
                  </span>
                </div>
                <Button size="sm" className="w-full" onClick={() => navigate('/quiz/quiz1')}>
                  Start Quiz
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg">Cake Decorating Tools</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-muted-foreground text-sm mb-4">Identify tools used in professional cake decorating</p>
                <div className="flex justify-between text-sm mb-4">
                  <span className="flex items-center">
                    <BrainCircuit className="mr-1 h-4 w-4" /> 15 questions
                  </span>
                  <span className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" /> 20 min
                  </span>
                </div>
                <Button size="sm" className="w-full" onClick={() => navigate('/quiz/quiz2')}>
                  Start Quiz
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg">Pastry Techniques</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-muted-foreground text-sm mb-4">Test your knowledge of advanced pastry techniques</p>
                <div className="flex justify-between text-sm mb-4">
                  <span className="flex items-center">
                    <BrainCircuit className="mr-1 h-4 w-4" /> 12 questions
                  </span>
                  <span className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" /> 18 min
                  </span>
                </div>
                <Button size="sm" className="w-full" onClick={() => navigate('/quiz/quiz3')}>
                  Start Quiz
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
