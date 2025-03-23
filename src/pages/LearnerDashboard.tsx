
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ChevronRight, Clock, GraduationCap, Book, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import NavTabs from "@/components/NavTabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCourses, Course } from "@/utils/courseStorage";
import { motion } from "framer-motion";

const LearnerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("enrolled");
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Get courses from storage
    const allCourses = getCourses();
    setCourses(allCourses);
  }, []);

  const getAverageProgress = () => {
    const total = courses.length;
    if (total === 0) return 0;
    
    // For demo purposes, calculate using random progress values
    const progressValues = courses.map(() => Math.floor(Math.random() * 100));
    const sum = progressValues.reduce((acc, val) => acc + val, 0);
    return Math.floor(sum / total);
  };

  const getCoursesInProgress = () => {
    return courses.length;
  };

  const handleCourseClick = (courseId: string) => {
    navigate(`/course/${courseId}/content`);
  };

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const statsVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      } 
    }
  };

  const statItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const courseVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.5
      } 
    }
  };

  const courseItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-white flex">
      <NavTabs />
      
      <main className="flex-1 pl-64">
        <div className="max-w-6xl mx-auto px-8 py-8">
          <motion.div 
            variants={headerVariants}
            initial="hidden"
            animate="visible"
            className="mb-10"
          >
            <h1 className="text-3xl font-semibold">Welcome back, {user?.name?.split(' ')[0] || 'John'}</h1>
            <p className="text-gray-500 mt-1">Continue your learning journey</p>
          </motion.div>

          <motion.div 
            variants={statsVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <motion.div variants={statItemVariants} className="bg-white border rounded-lg p-6">
              <h2 className="text-gray-500 text-sm font-medium mb-2">Overall Progress</h2>
              <div className="flex flex-col">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">{getAverageProgress()}%</span>
                  <span className="ml-2 text-gray-500 text-sm">completed</span>
                </div>
                <Progress value={getAverageProgress()} className="h-2 mt-4 mb-2" />
                <div className="flex justify-between mt-1">
                  <Button variant="link" className="p-0 h-auto text-sm text-gray-500 hover:text-black" onClick={() => navigate('/courses')}>
                    View details
                  </Button>
                  <span className="text-sm text-gray-500">{getCoursesInProgress()} courses in progress</span>
                </div>
              </div>
            </motion.div>

            <motion.div variants={statItemVariants} className="bg-white border rounded-lg p-6">
              <h2 className="text-gray-500 text-sm font-medium mb-2">Learning Streak</h2>
              <div className="flex flex-col">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">7</span>
                  <span className="ml-2 text-gray-500 text-sm">days</span>
                </div>
                <p className="text-gray-500 text-sm mt-4">Keep going! You're on a roll.</p>
                <div className="flex gap-1 mt-4">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                      <Check className="w-4 h-4 text-blue-500" />
                    </div>
                  ))}
                </div>
                <p className="text-right text-xs text-gray-500 mt-2">Last active today</p>
              </div>
            </motion.div>

            <motion.div variants={statItemVariants} className="bg-white border rounded-lg p-6">
              <h2 className="text-gray-500 text-sm font-medium mb-2">Certificates</h2>
              <div className="flex flex-col">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">0</span>
                  <span className="ml-2 text-gray-500 text-sm">earned</span>
                </div>
                <p className="text-gray-500 text-sm mt-4">Complete courses to earn certificates.</p>
                <div className="mt-4">
                  <Button variant="outline" className="w-full flex items-center justify-center" onClick={() => navigate('/certificates')}>
                    <GraduationCap className="w-4 h-4 mr-2" />
                    View certificates
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Continue Learning</h2>
              <Button variant="ghost" className="text-gray-500 flex items-center hover:text-black">
                View all <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            <div className="relative mb-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input 
                type="text"
                placeholder="Search courses..."
                className="pl-10 h-11 bg-gray-50 border-gray-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex border-b mb-6">
              <button
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "enrolled"
                    ? "border-b-2 border-black text-black"
                    : "text-gray-500 hover:text-black"
                }`}
                onClick={() => setActiveTab("enrolled")}
              >
                Enrolled Courses
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "available"
                    ? "border-b-2 border-black text-black"
                    : "text-gray-500 hover:text-black"
                }`}
                onClick={() => setActiveTab("available")}
              >
                Available Courses
              </button>
            </div>

            <motion.div 
              variants={courseVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {filteredCourses.map((course, index) => {
                // Generate random progress for demo purposes
                const progress = Math.floor(Math.random() * 100);
                const duration = course.duration || `${Math.floor(Math.random() * 10) + 2}h ${Math.floor(Math.random() * 59)}m`;
                const modules = Math.floor(Math.random() * 20) + 5;
                
                return (
                  <motion.div
                    key={course.id}
                    variants={courseItemVariants}
                    className="border rounded-lg overflow-hidden flex flex-col hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleCourseClick(course.id)}
                  >
                    <div className="aspect-video bg-gray-100 relative overflow-hidden">
                      {course.thumbnail ? (
                        <img 
                          src={course.thumbnail} 
                          alt={course.title} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-800">
                          <Book className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                        {course.description.replace(/<[^>]*>/g, '').slice(0, 100)}...
                      </p>
                      
                      <div className="mt-auto space-y-3">
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Progress</span>
                          <span>{progress}% complete</span>
                        </div>
                        <Progress value={progress} className="h-1.5" />
                        
                        <div className="flex items-center gap-5 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Book className="w-4 h-4 mr-1" />
                            <span>{modules} modules</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{duration}</span>
                          </div>
                        </div>
                        
                        <Button className="w-full" variant="outline">
                          Continue Learning
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default LearnerDashboard;
