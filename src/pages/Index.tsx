
import { useNavigate } from "react-router-dom";
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
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  const goToAdminDashboard = () => {
    navigate('/admin');
  };
  
  const goToLearnerDashboard = () => {
    navigate('/dashboard');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50">
      <Header />
      <NavTabs />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          <motion.div 
            variants={item}
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
            <div className="space-x-3">
              <Button onClick={goToLearnerDashboard} className="relative overflow-hidden group">
                <span className="relative z-10">Go to Learner Dashboard</span>
                <span className="absolute inset-0 bg-gradient-to-r from-lms-blue to-lms-yellow opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Button>
              
              <Button onClick={goToAdminDashboard} variant="outline" className="relative overflow-hidden group">
                <span className="relative z-10">Go to Admin Dashboard</span>
                <span className="absolute inset-0 bg-gradient-to-r from-lms-red to-lms-blue opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
              </Button>
            </div>
          </motion.div>
          
          <motion.div 
            variants={item}
            className="mb-8"
          >
            <Stats />
          </motion.div>
          
          <motion.div 
            variants={item}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8"
          >
            <div className="glass-card rounded-xl border border-border/50 p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <CourseProgress />
            </div>
            
            <div className="glass-card rounded-xl border border-border/50 p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <AssignedCourses />
            </div>
          </motion.div>
          
          <motion.div variants={item}>
            <LearningPaths />
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
