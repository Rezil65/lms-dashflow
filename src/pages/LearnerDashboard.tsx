
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
import StylizedVideoPlayer from "@/components/StylizedVideoPlayer";
import MaterialsViewer from "@/components/MaterialsViewer";

const LearnerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Sample materials for the materials viewer
  const sampleMaterials = [
    {
      id: "material1",
      title: "Introduction to the Course",
      type: "video",
      content: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
      thumbnail: "/placeholder-video.jpg"
    },
    {
      id: "material2",
      title: "Course Syllabus",
      type: "pdf",
      content: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    },
    {
      id: "material3",
      title: "Key Concepts Diagram",
      type: "image",
      content: "/lovable-uploads/b4b49a49-4415-4608-919d-8c583dd41903.png"
    },
    {
      id: "material4",
      title: "Interactive Exercise",
      type: "html",
      content: "data:text/html,<html><body style='font-family: Arial; padding: 20px;'><h1>Interactive Exercise</h1><p>This is a sample interactive exercise embedded as HTML content.</p><div style='margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px;'><h3>Question 1:</h3><p>What is the primary purpose of this course?</p><label><input type='radio' name='q1'> To learn programming basics</label><br><label><input type='radio' name='q1'> To master advanced concepts</label><br><button style='margin-top: 15px; padding: 8px 16px; background: #4C6EF5; color: white; border: none; border-radius: 4px;'>Submit Answer</button></div></body></html>"
    }
  ];
  
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
            
            <div className="mb-8">
              <MaterialsViewer materials={sampleMaterials} />
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
        {activeTab === "courses-content" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Course Content</h1>
            <MaterialsViewer materials={sampleMaterials} />
            <CourseModules />
          </div>
        )}
        {activeTab === "learning-paths" && <CourseFeeds />}
        {activeTab === "analytics" && <AnalyticsTab />}
      </main>
    </div>
  );
};

export default LearnerDashboard;
