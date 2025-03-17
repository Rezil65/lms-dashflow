
import { ArrowLeft, BookOpen, Calendar, Clock, Video } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

const CourseDetail = () => {
  const { id } = useParams();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-lg font-semibold">Course Details</h1>
          </div>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="bg-gradient-to-r from-lms-blue to-lms-purple p-8 text-white">
            <div className="max-w-3xl">
              <h1 className="text-3xl font-display font-semibold mb-4">Advanced React Development</h1>
              <p className="text-white/90 mb-6">Master modern React practices including hooks, context API, and advanced state management techniques.</p>
              
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 opacity-70" />
                  <span className="text-sm">12 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 opacity-70" />
                  <span className="text-sm">24 lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 opacity-70" />
                  <span className="text-sm">Web Development</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 opacity-70" />
                  <span className="text-sm">Updated June 2023</span>
                </div>
              </div>
              
              <div className="mt-6">
                <Link to={`/course/${id}/content`}>
                  <Button className="bg-white text-blue-600 hover:bg-blue-50">
                    Start Learning
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <div className="max-w-3xl">
              <h2 className="text-xl font-semibold mb-4">Course Outline</h2>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">1. Introduction to Advanced React</h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">45 min</span>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">2. React Hooks In-Depth</h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">1.5 hours</span>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">3. Advanced State Management</h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">2 hours</span>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-muted-foreground">4. Performance Optimization</h3>
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">Locked</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex">
                <Link to={`/course/${id}/content`}>
                  <Button size="lg">
                    Go to Course Content
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseDetail;
