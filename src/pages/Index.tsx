
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import NavTabs from "@/components/NavTabs";
import Stats from "@/components/Stats";
import CourseProgress from "@/components/CourseProgress";
import AssignedCourses from "@/components/AssignedCourses";
import LearningPaths from "@/components/LearningPaths";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  
  const goToAdminDashboard = () => {
    navigate('/admin');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <NavTabs />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold">Learning Management System</h1>
          <Button onClick={goToAdminDashboard}>Go to Admin Dashboard</Button>
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
