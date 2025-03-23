
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Book, Clock, CheckCircle, Circle } from 'lucide-react';
import { getCourses, Course } from '@/utils/courseStorage';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import NavTabs from '@/components/NavTabs';
import { motion } from 'framer-motion';

interface Module {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
}

const CourseDetails = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = React.useState<Course | null>(null);
  const [modules, setModules] = React.useState<Module[]>([]);
  const [progress, setProgress] = React.useState(0);
  const [completedModules, setCompletedModules] = React.useState(0);

  React.useEffect(() => {
    if (courseId) {
      const allCourses = getCourses();
      const foundCourse = allCourses.find(c => c.id === parseInt(courseId));
      
      if (foundCourse) {
        setCourse(foundCourse);
        
        // Generate fake modules for demo purposes
        const generatedModules = [
          { id: 1, title: 'Introduction to React', duration: '10:30', completed: true },
          { id: 2, title: 'Setting Up Your Development Environment', duration: '15:45', completed: true },
          { id: 3, title: 'JSX and React Components', duration: '20:15', completed: true },
          { id: 4, title: 'Props and State', duration: '25:30', completed: false },
          { id: 5, title: 'Handling Events', duration: '18:20', completed: false },
          { id: 6, title: 'Conditional Rendering', duration: '12:40', completed: false },
          { id: 7, title: 'Lists and Keys', duration: '14:55', completed: false },
          { id: 8, title: 'Forms and Controlled Components', duration: '22:10', completed: false },
          { id: 9, title: 'React Hooks', duration: '30:25', completed: false },
          { id: 10, title: 'Context API', duration: '28:15', completed: false },
          { id: 11, title: 'Redux Basics', duration: '35:50', completed: false },
          { id: 12, title: 'React Router', duration: '23:05', completed: false },
        ];
        
        setModules(generatedModules);
        
        // Calculate completion progress
        const completed = generatedModules.filter(module => module.completed).length;
        setCompletedModules(completed);
        setProgress(Math.round((completed / generatedModules.length) * 100));
      }
    }
  }, [courseId]);

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white flex">
      <NavTabs />
      
      <main className="flex-1 pl-64">
        <div className="max-w-6xl mx-auto px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <h1 className="text-3xl font-semibold">{course.title}</h1>
            <p className="text-gray-500 mt-1">Continue where you left off</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="aspect-video bg-black rounded-lg flex items-center justify-center mb-8 overflow-hidden">
                {course.thumbnail ? (
                  <img 
                    src={course.thumbnail} 
                    alt={course.title} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-white">
                    <div className="rounded-full bg-white/10 p-8 mb-4">
                      <Play className="w-16 h-16" />
                    </div>
                    <p className="text-lg">Module 1: Introduction to React</p>
                  </div>
                )}
              </div>

              <div className="bg-white border rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">{course.title}</h2>
                <div className="prose prose-sm max-w-none text-gray-600 mb-6" 
                  dangerouslySetInnerHTML={{ __html: course.description || "No description available" }}
                />
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration || "2h 30m total"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Book className="h-4 w-4" />
                    <span>{modules.length} modules</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-1">Your Progress</h2>
                <p className="text-gray-500 text-sm mb-4">{progress}% completed</p>
                <Progress value={progress} className="h-2 mb-6" />
                
                <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                  <span>{completedModules} of {modules.length} modules completed</span>
                  <span>{course.duration || "2h 30m total"}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="lg:col-span-1"
            >
              <div className="bg-white border rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">Course Content</h2>
                  <span className="text-sm text-gray-500">{completedModules}/{modules.length} completed</span>
                </div>
                
                <div className="space-y-4">
                  {modules.map((module) => (
                    <div key={module.id} className="flex items-start gap-3">
                      <div className="pt-1">
                        {module.completed ? (
                          <CheckCircle className="w-5 h-5 text-blue-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-300" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className={`text-sm font-medium ${module.completed ? 'text-black' : 'text-gray-700'}`}>
                            {module.title}
                          </h3>
                          <span className="text-sm text-gray-500">{module.duration}</span>
                        </div>
                        {module.id === 4 && (
                          <Button 
                            variant="default" 
                            size="sm" 
                            className="mt-2 w-full"
                            onClick={() => navigate(`/module/${module.id}`)}
                          >
                            Resume
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

// This component is missing from the imports
const Play = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

export default CourseDetails;
