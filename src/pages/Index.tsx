
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import NavTabs from "@/components/NavTabs";
import Stats from "@/components/Stats";
import CourseProgress from "@/components/CourseProgress";
import RecommendedCourses from "@/components/RecommendedCourses";
import LearningPaths from "@/components/LearningPaths";
import { Button } from "@/components/ui/button";
import LearnerDashboard from "@/components/learner/LearnerDashboard";
import { getCurrentUser, logout } from "@/utils/authService";
import { Shield, LogOut } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  
  useEffect(() => {
    // Update current user on component mount
    setCurrentUser(getCurrentUser());
  }, []);
  
  const goToAdminDashboard = () => {
    navigate('/admin');
  };
  
  const goToInstructorDashboard = () => {
    navigate('/instructor-dashboard');
  };
  
  const handleLogin = () => {
    navigate('/login');
  };
  
  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <NavTabs />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold">Learning Management System</h1>
          <div className="flex gap-2">
            {!currentUser ? (
              <Button onClick={handleLogin}>
                <Shield className="mr-2 h-4 w-4" />
                Login
              </Button>
            ) : (
              <>
                {currentUser.role === "admin" && (
                  <Button onClick={goToAdminDashboard}>Go to Admin Dashboard</Button>
                )}
                {currentUser.role === "instructor" && (
                  <Button onClick={goToInstructorDashboard}>Go to Instructor Dashboard</Button>
                )}
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
        
        {/* Display learner dashboard for authenticated learners */}
        {currentUser && currentUser.role === "learner" ? (
          <LearnerDashboard />
        ) : (
          <>
            <div className="mb-8">
              <Stats />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
                <CourseProgress />
              </div>
              
              <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
                <RecommendedCourses />
              </div>
            </div>
            
            <div>
              <LearningPaths />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
