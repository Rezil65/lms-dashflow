
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  // If user is not authenticated, show a welcoming landing page
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/80">
      <div className="text-center max-w-3xl px-4 space-y-8 animate-fade-in">
        <h1 className="text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
          Acorn Learning Platform
        </h1>
        <p className="text-xl text-muted-foreground">
          Expand your baking knowledge with our comprehensive courses, interactive quizzes, and personalized learning paths.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Button 
            onClick={() => navigate('/login')}
            size="lg" 
            className="px-8 hover:scale-105 transition-transform button-3d"
          >
            Log In
          </Button>
          <Button 
            onClick={() => navigate('/login')}
            variant="outline" 
            size="lg" 
            className="px-8 hover:scale-105 transition-transform button-3d"
          >
            Sign Up
          </Button>
        </div>
        <div className="pt-12">
          <img 
            src="/public/lovable-uploads/79b57a48-41b3-47a6-aba3-8cf20a45a438.png" 
            alt="Baking course preview" 
            className="mx-auto rounded-lg shadow-xl w-full max-w-2xl hover:scale-[1.02] transition-all duration-300" 
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
