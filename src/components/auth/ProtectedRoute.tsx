import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { checkAuth, checkRole, getCurrentUser } from "@/utils/authService";
import { useToast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "admin" | "instructor" | "learner";
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { toast } = useToast();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  
  useEffect(() => {
    // First check if user is authenticated
    const isAuthenticated = checkAuth();
    
    if (!isAuthenticated) {
      setIsAuthorized(false);
      toast({
        title: "Authentication required",
        description: "Please login to access this page",
        variant: "destructive"
      });
      return;
    }
    
    // If no specific role is required, just being authenticated is enough
    if (!requiredRole) {
      setIsAuthorized(true);
      return;
    }
    
    // Check if user has the required role
    const hasRequiredRole = checkRole(requiredRole);
    
    if (!hasRequiredRole) {
      setIsAuthorized(false);
      toast({
        title: "Access denied",
        description: `You need ${requiredRole} privileges to access this page`,
        variant: "destructive"
      });
      return;
    }
    
    setIsAuthorized(true);
  }, [location.pathname, requiredRole, toast]);
  
  // Show loading state while checking authorization
  if (isAuthorized === null) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  // Redirect to login if not authorized
  if (!isAuthorized) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  
  // Otherwise, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
