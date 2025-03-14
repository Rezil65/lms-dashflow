
import Header from "@/components/Header";
import NavTabs from "@/components/NavTabs";
import Stats from "@/components/Stats";
import CourseProgress from "@/components/CourseProgress";
import RecommendedCourses from "@/components/RecommendedCourses";
import LearningPaths from "@/components/LearningPaths";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <NavTabs />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Stats />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <CourseProgress />
          </div>
          
          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <RecommendedCourses />
          </div>
        </div>
        
        <div>
          <LearningPaths />
        </div>
      </main>
    </div>
  );
};

export default Index;
