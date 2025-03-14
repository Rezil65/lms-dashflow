
import { Code, Database, Server } from "lucide-react";
import { useEffect, useState } from "react";

interface CourseProps {
  id: string;
  title: string;
  progress: number;
  category: string;
  duration: string;
  icon: React.ReactNode;
  delay: number;
}

const courses = [
  {
    id: "course-1",
    title: "Advanced React Development",
    progress: 65,
    category: "Web Development",
    duration: "12 hours",
    icon: <Code className="w-4 h-4 text-lms-blue" />,
    delay: 100,
  },
  {
    id: "course-2",
    title: "Data Science Fundamentals",
    progress: 30,
    category: "Computer Science",
    duration: "15 hours",
    icon: <Database className="w-4 h-4 text-lms-purple" />,
    delay: 200,
  },
  {
    id: "course-3",
    title: "Cloud Architecture on AWS",
    progress: 45,
    category: "Cloud Computing",
    duration: "18 hours",
    icon: <Server className="w-4 h-4 text-lms-teal" />,
    delay: 300,
  },
];

const CourseItem = ({ title, progress, category, duration, icon, delay }: CourseProps) => {
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowProgress(true);
    }, delay + 500);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className="animate-fade-in" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center gap-3 mb-1">
        <div className="w-7 h-7 rounded-full bg-muted/50 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-sm">{title}</h3>
          <p className="text-xs text-muted-foreground">{category} • {duration}</p>
        </div>
      </div>
      <div className="progress-bar mt-2 ml-10">
        {showProgress && (
          <div 
            className="progress-bar-fill bg-lms-blue" 
            style={{ 
              "--progress-width": `${progress}%` 
            } as React.CSSProperties}
          ></div>
        )}
      </div>
      <p className="text-xs text-right mt-1 text-muted-foreground">{progress}%</p>
    </div>
  );
};

const CourseProgress = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Current Progress</h2>
      <div className="space-y-5">
        {courses.map((course) => (
          <CourseItem key={course.id} {...course} />
        ))}
      </div>
    </div>
  );
};

export default CourseProgress;
