
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import NavTabs from "@/components/NavTabs";
import Stats from "@/components/Stats";
import CourseProgress from "@/components/CourseProgress";
import CoursesTab from "@/components/CoursesTab";
import MyLearningsTab from "@/components/MyLearningsTab";
import AnalyticsTab from "@/components/AnalyticsTab";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import CourseFeeds from "@/components/CourseFeeds";
import CourseModules from "@/components/CourseModules";
import Quizzes from "@/components/Quizzes";

const LearnerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Parse tab from URL query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam && ['dashboard', 'courses', 'my-learnings', 'learning-paths', 'analytics', 'courses-content'].includes(tabParam)) {
      setActiveTab(tabParam);
    } else if (!searchParams.has('tab')) {
      // Set default tab if no tab parameter exists
      setActiveTab('dashboard');
    }
  }, [location.search]);
  
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    
    // Update URL without page reload
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('tab', tabId);
    navigate({
      pathname: location.pathname,
      search: searchParams.toString()
    }, { replace: true });
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <Header />
      <NavTabs 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        tabs={[
          { id: "dashboard", label: "Dashboard" },
          { id: "courses", label: "Courses" },
          { id: "my-learnings", label: "My Learnings" },
          { id: "courses-content", label: "Course Content" },
          { id: "learning-paths", label: "Learning Paths" },
          { id: "analytics", label: "Analytics" }
        ]}
      />
      
      <main className="container mx-auto px-4 py-8">
        {activeTab === "dashboard" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-semibold">Learner Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, {user?.name || user?.email}!</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleLogout}>Logout</Button>
              </div>
            </div>
            
            <div className="mb-8">
              <Stats />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="p-6 col-span-1 card-3d">
                <CourseProgress />
              </Card>
              
              <Card className="p-6 col-span-2 card-3d">
                <CoursesTab isPreview={true} />
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
              <Card className="p-6 card-3d">
                <CourseModules isPreview={true} />
              </Card>
              
              <Card className="p-6 card-3d">
                <Quizzes isPreview={true} />
              </Card>
            </div>
            
            <div>
              <CourseFeeds isPreview={true} />
            </div>
          </>
        )}
        
        {activeTab === "courses" && <CoursesTab />}
        {activeTab === "my-learnings" && <MyLearningsTab />}
        {activeTab === "courses-content" && <CourseModules />}
        {activeTab === "learning-paths" && <CourseFeeds />}
        {activeTab === "analytics" && <AnalyticsTab />}
      </main>
    </div>
  );
};

export default LearnerDashboard;
