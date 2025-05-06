
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  // If user is not authenticated, show a simple welcome page with login button
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/80">
        <div className="text-center max-w-3xl px-4 space-y-6">
          <h1 className="text-4xl font-bold tracking-tight">Welcome to the Learning Management System</h1>
          <p className="text-xl text-muted-foreground">
            Please log in to access your dashboard and courses.
          </p>
          <Button 
            onClick={() => navigate('/login')}
            size="lg" 
            className="mt-6 hover:scale-105 transition-transform button-3d"
          >
            Log In
          </Button>
        </div>
      </div>
    );
  }
  
  // If authenticated, the useEffect will redirect to dashboard
  return null;
};

export default Index;
