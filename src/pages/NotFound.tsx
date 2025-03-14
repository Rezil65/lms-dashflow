
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ChevronLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-4">
        <h1 className="text-6xl font-display font-bold text-lms-blue mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">The page you're looking for doesn't exist or has been moved.</p>
        <Link 
          to="/" 
          className="inline-flex items-center text-lms-blue hover:text-lms-blue/80 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
