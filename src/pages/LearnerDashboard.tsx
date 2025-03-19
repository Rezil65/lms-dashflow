
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import NavTabs from "@/components/NavTabs";
import Stats from "@/components/Stats";
import CourseProgress from "@/components/CourseProgress";
import RecommendedCourses from "@/components/RecommendedCourses";
import LearningPaths from "@/components/LearningPaths";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle, Clock, FileText, RefreshCw, Video } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const LearnerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <NavTabs />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold">Learner Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.email}!</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
        
        <div className="mb-8">
          <Stats />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="text-sm flex justify-between">
                  <span>JavaScript Final Project</span>
                  <span className="text-muted-foreground">2 days left</span>
                </li>
                <li className="text-sm flex justify-between">
                  <span>React Quiz</span>
                  <span className="text-muted-foreground">5 days left</span>
                </li>
                <li className="text-sm flex justify-between">
                  <span>Database Assignment</span>
                  <span className="text-muted-foreground">1 week left</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Upcoming Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="text-sm flex justify-between">
                  <span>Advanced CSS Techniques</span>
                  <span className="text-muted-foreground">Tomorrow, 10 AM</span>
                </li>
                <li className="text-sm flex justify-between">
                  <span>React State Management</span>
                  <span className="text-muted-foreground">May 25, 2 PM</span>
                </li>
                <li className="text-sm flex justify-between">
                  <span>DevOps Introduction</span>
                  <span className="text-muted-foreground">May 28, 11 AM</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="text-sm flex justify-between">
                  <span>HTML & CSS Certification</span>
                  <span className="text-muted-foreground">Completed</span>
                </li>
                <li className="text-sm flex justify-between">
                  <span>JavaScript Basics</span>
                  <span className="text-muted-foreground">95% Score</span>
                </li>
                <li className="text-sm flex justify-between">
                  <span>Git Fundamentals</span>
                  <span className="text-muted-foreground">Completed</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <CourseProgress />
          </div>
          
          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <RecommendedCourses />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">My Learning Activities</h2>
            <Button variant="outline" size="sm" className="gap-1">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-2 rounded">
                    <Video className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">Introduction to TypeScript</h3>
                    <p className="text-sm text-muted-foreground">
                      Continue watching - 45 min left
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: "65%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-2 rounded">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">React Router Documentation</h3>
                    <p className="text-sm text-muted-foreground">
                      Continue reading - 3 pages left
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: "78%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-2 rounded">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">Database Design Assignment</h3>
                    <p className="text-sm text-muted-foreground">
                      Due in 5 days
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: "25%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div>
          <LearningPaths />
        </div>
      </main>
    </div>
  );
};

export default LearnerDashboard;
