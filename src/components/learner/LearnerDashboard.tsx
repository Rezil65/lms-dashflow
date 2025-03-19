
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Award, Clock, Calendar } from "lucide-react";
import { getCurrentUser } from "@/utils/authService";

const LearnerDashboard = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check auth status (would use a hook in real implementation)
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== "learner") {
      // For demo, allow staying on page
      console.log("User is not a learner, but allowing for demo");
    }
  }, [navigate]);
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Your Learning Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <BookOpen className="mr-2 h-4 w-4 text-blue-500" />
              Enrolled Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">4</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Award className="mr-2 h-4 w-4 text-green-500" />
              Completed Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="mr-2 h-4 w-4 text-purple-500" />
              Learning Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">26.5</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Current Learning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">Introduction to Machine Learning</h3>
                  <p className="text-sm text-muted-foreground">Instructor: Dr. Jane Smith</p>
                </div>
                <Badge>In Progress</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "65%" }}></div>
                </div>
              </div>
              <div className="mt-4">
                <Button variant="outline" size="sm" onClick={() => navigate("/course/1/content")}>
                  Continue Learning
                </Button>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">Web Development Fundamentals</h3>
                  <p className="text-sm text-muted-foreground">Instructor: John Doe</p>
                </div>
                <Badge>In Progress</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>42%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "42%" }}></div>
                </div>
              </div>
              <div className="mt-4">
                <Button variant="outline" size="sm" onClick={() => navigate("/course/2/content")}>
                  Continue Learning
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 p-2 rounded-md border">
              <div className="bg-amber-100 p-2 rounded-full">
                <Calendar className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Final Project Submission</p>
                <p className="text-sm text-muted-foreground">
                  Introduction to Machine Learning - Due: June 15, 2023
                </p>
              </div>
              <Button variant="outline" size="sm">View</Button>
            </li>
            <li className="flex items-start gap-3 p-2 rounded-md border">
              <div className="bg-amber-100 p-2 rounded-full">
                <Calendar className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Weekly Quiz</p>
                <p className="text-sm text-muted-foreground">
                  Web Development Fundamentals - Due: June 10, 2023
                </p>
              </div>
              <Button variant="outline" size="sm">Start</Button>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearnerDashboard;
