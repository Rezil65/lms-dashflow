
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import NavTabs from "@/components/NavTabs";
import Stats from "@/components/Stats";
import CourseProgress from "@/components/CourseProgress";
import AssignedCourses from "@/components/AssignedCourses";
import LearningPaths from "@/components/LearningPaths";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle, Clock, FileText, RefreshCw, Video } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import UpcomingDeadlines from "@/components/dashboard/UpcomingDeadlines";
import UpcomingSessions from "@/components/dashboard/UpcomingSessions";
import RecentAchievements from "@/components/dashboard/RecentAchievements";
import LearningActivities from "@/components/dashboard/LearningActivities";

const LearnerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
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
          <motion.div variants={item} className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold bg-gradient-to-r from-lms-yellow via-lms-red to-lms-blue bg-clip-text text-transparent">
                Learner Dashboard
              </h1>
              <p className="text-muted-foreground">Welcome back, {user?.name || user?.email}!</p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="relative overflow-hidden group"
            >
              <span className="relative z-10">Logout</span>
              <span className="absolute inset-0 bg-gradient-to-r from-lms-red to-lms-blue opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
            </Button>
          </motion.div>
          
          <motion.div variants={item}>
            <Stats />
          </motion.div>
          
          <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <UpcomingDeadlines />
            <UpcomingSessions />
            <RecentAchievements />
          </motion.div>
          
          <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card rounded-xl border border-border/50 p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <CourseProgress />
            </div>
            
            <div className="glass-card rounded-xl border border-border/50 p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <AssignedCourses />
            </div>
          </motion.div>
          
          <LearningActivities />
          
          <motion.div variants={item}>
            <LearningPaths />
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default LearnerDashboard;
