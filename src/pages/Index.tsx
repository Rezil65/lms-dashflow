import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import NavTabs from "@/components/NavTabs";
import Stats from "@/components/Stats";
import CourseProgress from "@/components/CourseProgress";
import AssignedCourses from "@/components/AssignedCourses";
import LearningPaths from "@/components/LearningPaths";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  useEffect(() => {
    if (isAuthenticated && user) {
      switch (user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'instructor':
          navigate('/instructor');
          break;
        case 'learner':
          navigate('/learner');
          break;
        default:
          break;
      }
    }
  }, [isAuthenticated, user, navigate]);
  
  const goToAdminDashboard = () => {
    navigate('/admin');
  };
  
  const goToLearnerDashboard = () => {
    navigate('/learner');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <NavTabs activeTab="dashboard" onTabChange={() => {}} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold">Learning Management System</h1>
          <div className="space-x-2">
            <Button onClick={goToLearnerDashboard} className="mr-2">Go to Learner Dashboard</Button>
            <Button onClick={goToAdminDashboard}>Go to Admin Dashboard</Button>
          </div>
        </div>
        
        <div className="mb-8">
          <Stats />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <CourseProgress />
          </div>
          
          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <AssignedCourses />
          </div>
        </div>
        
        <div>
          <LearningPaths />
        </div>
      </main>
    </div>
  );
};

export default Index;
