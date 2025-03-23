
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import NavTabs from "@/components/NavTabs";
import Stats from "@/components/Stats";
import CourseProgress from "@/components/CourseProgress";
import AssignedCourses from "@/components/AssignedCourses";
import LearningPaths from "@/components/LearningPaths";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();
  
  const goToAdminDashboard = () => {
    navigate('/admin');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50">
      <Header />
      <NavTabs />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/740837a1-2c35-47c6-96c8-f108524cf541.png" 
              alt="Kyureeus Logo" 
              className="h-10 w-auto"
            />
            <h1 className="text-xl font-semibold bg-gradient-to-r from-lms-yellow via-lms-red to-lms-blue bg-clip-text text-transparent">
              Learning Management System
            </h1>
          </div>
          <Button onClick={goToAdminDashboard} className="relative overflow-hidden group">
            <span className="relative z-10">Go to Admin Dashboard</span>
            <span className="absolute inset-0 bg-gradient-to-r from-lms-red to-lms-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </Button>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8"
        >
          <Stats />
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="glass-card rounded-xl border border-border/50 p-6 shadow-sm"
          >
            <CourseProgress />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="glass-card rounded-xl border border-border/50 p-6 shadow-sm"
          >
            <AssignedCourses />
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <LearningPaths />
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
