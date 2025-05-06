
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings, User, Mail, Calendar, Clock, BookOpen, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading user data 
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleNavigateToDashboard = () => {
    // Navigate to dashboard instead of /learner
    navigate("/dashboard");
  };

  // Mock data
  const enrolledCourses = 5;
  const completedCourses = 3;
  const totalHours = 27;
  const lastActive = "Today";
  const joinDate = "Jan 15, 2023";
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row gap-4 md:gap-8">
        <div className="w-full md:w-1/3">
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              {loading ? (
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-24 h-24 rounded-full bg-muted animate-pulse"></div>
                  <div className="h-6 w-32 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-48 bg-muted animate-pulse rounded"></div>
                </div>
              ) : (
                <>
                  <div className="w-24 h-24 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
                    <User className="h-12 w-12 text-primary" />
                  </div>
                  <h2 className="mt-4 text-xl font-bold">{user?.name || "User"}</h2>
                  <p className="text-muted-foreground">{user?.email}</p>
                </>
              )}
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <Button onClick={() => navigate("/settings")} variant="outline" className="w-full button-3d">
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </Button>
                <Button onClick={handleNavigateToDashboard} className="w-full button-3d">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Account Information</h3>
              
              {loading ? (
                <div className="space-y-4">
                  {Array.from({length: 4}).map((_, i) => (
                    <div key={i} className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-muted animate-pulse mr-3"></div>
                      <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p>{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Member Since</p>
                      <p>{joinDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Last Active</p>
                      <p>{lastActive}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full md:w-2/3">
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Learning Statistics</h3>
              
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Array.from({length: 3}).map((_, i) => (
                    <div key={i} className="h-24 bg-muted animate-pulse rounded-lg"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-primary/10 p-4 rounded-lg hover:bg-primary/15 transition-colors">
                    <BookOpen className="h-6 w-6 mb-2 text-primary" />
                    <p className="text-lg font-bold">{enrolledCourses}</p>
                    <p className="text-sm text-muted-foreground">Enrolled Courses</p>
                  </div>
                  
                  <div className="bg-green-100 p-4 rounded-lg hover:bg-green-200 transition-colors">
                    <CheckCircle2 className="h-6 w-6 mb-2 text-green-600" />
                    <p className="text-lg font-bold">{completedCourses}</p>
                    <p className="text-sm text-muted-foreground">Completed Courses</p>
                  </div>
                  
                  <div className="bg-violet-100 p-4 rounded-lg hover:bg-violet-200 transition-colors">
                    <Clock className="h-6 w-6 mb-2 text-violet-600" />
                    <p className="text-lg font-bold">{totalHours}</p>
                    <p className="text-sm text-muted-foreground">Learning Hours</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">My Achievements</h3>
              
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({length: 6}).map((_, i) => (
                    <div key={i} className="h-32 bg-muted animate-pulse rounded-lg"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({length: 6}).map((_, i) => (
                    <div key={i} className="border rounded-lg p-4 text-center hover:bg-muted/30 transition-colors hover-scale">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 mx-auto flex items-center justify-center mb-3">
                        <BookOpen className="h-6 w-6 text-white" />
                      </div>
                      <p className="font-medium">Achievement {i + 1}</p>
                      <p className="text-xs text-muted-foreground mt-1">Earned on May {10 + i}, 2023</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
