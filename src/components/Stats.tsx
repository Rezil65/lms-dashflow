
import { BookOpen, Folders, Award, Code } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTotalCourseCount } from "@/utils/courseStorage";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  delay: number;
  navigateTo?: string;
}

const StatCard = ({ title, value, icon, color, delay, navigateTo }: StatCardProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      let start = 0;
      const duration = 1500;
      const increment = Math.ceil(value / (duration / 16));
      
      const timer = setInterval(() => {
        start += increment;
        if (start > value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(start);
        }
      }, 16);
      
      return () => clearInterval(timer);
    }, delay);
    
    return () => clearTimeout(timeout);
  }, [value, delay]);
  
  const handleClick = () => {
    if (navigateTo) {
      navigate(navigateTo);
    }
  };
  
  return (
    <div 
      className={`stat-card bg-white rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in ${navigateTo ? 'cursor-pointer hover:bg-gray-50' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
      onClick={handleClick}
    >
      <div className="flex justify-between items-start">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-display font-semibold mt-2">{displayValue}</p>
    </div>
  );
};

const Stats = () => {
  const [courseCount, setCourseCount] = useState(0);
  
  useEffect(() => {
    // Get the course count from localStorage
    setCourseCount(getTotalCourseCount());
    
    // Listen for storage events to update the count if it changes
    const handleStorageChange = () => {
      setCourseCount(getTotalCourseCount());
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for when a course is added
    window.addEventListener('courseAdded', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('courseAdded', handleStorageChange);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Courses"
        value={courseCount}
        icon={<Folders className="w-5 h-5 text-white" />}
        color="bg-lms-blue"
        delay={100}
        navigateTo="/create-course"
      />
      <StatCard
        title="Hours Learned"
        value={156}
        icon={<BookOpen className="w-5 h-5 text-white" />}
        color="bg-lms-purple"
        delay={200}
      />
      <StatCard
        title="Certificates"
        value={5}
        icon={<Award className="w-5 h-5 text-white" />}
        color="bg-lms-pink"
        delay={300}
      />
      <StatCard
        title="Projects"
        value={12}
        icon={<Code className="w-5 h-5 text-white" />}
        color="bg-lms-teal"
        delay={400}
      />
    </div>
  );
};

export default Stats;
