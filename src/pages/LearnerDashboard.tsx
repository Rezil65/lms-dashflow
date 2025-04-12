
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
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

const LearnerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const { theme, setTheme } = useTheme();
  
  // Parse tab from URL query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam && ['dashboard', 'courses', 'my-learnings', 'learning-paths', 'analytics'].includes(tabParam)) {
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
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <Header />
      <NavTabs activeTab={activeTab} onTabChange={handleTabChange} />
      
      <main className="container mx-auto px-4 py-8">
        {activeTab === "dashboard" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-semibold neon-text-primary">Learner Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, {user?.name || user?.email}!</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={toggleTheme}
                  className="theme-toggle-switch"
                  aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                >
                  {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                </Button>
                <Button variant="outline" onClick={handleLogout}>Logout</Button>
              </div>
            </div>
            
            <div className="mb-8">
              <Stats />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="p-6 col-span-1 card-3d neon-border-hover">
                <CourseProgress />
              </Card>
              
              <Card className="p-6 col-span-2 card-3d neon-border-hover">
                <CoursesTab isPreview={true} />
              </Card>
            </div>
            
            <div>
              <CourseFeeds isPreview={true} />
            </div>
          </>
        )}
        
        {activeTab === "courses" && <CoursesTab />}
        {activeTab === "my-learnings" && <MyLearningsTab />}
        {activeTab === "learning-paths" && <CourseFeeds />}
        {activeTab === "analytics" && <AnalyticsTab />}
      </main>
    </div>
  );
};

export default LearnerDashboard;
