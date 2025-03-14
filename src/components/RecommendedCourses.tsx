
import { Code, Database, Server } from "lucide-react";

interface RecommendedCourseProps {
  title: string;
  category: string;
  duration: string;
  icon: React.ReactNode;
  delay: number;
}

const recommendedCourses = [
  {
    title: "Advanced React Development",
    category: "Web Development",
    duration: "12 hours",
    icon: <Code className="w-4 h-4 text-lms-blue" />,
    delay: 100,
  },
  {
    title: "Data Science Fundamentals",
    category: "Computer Science",
    duration: "15 hours",
    icon: <Database className="w-4 h-4 text-lms-purple" />,
    delay: 200,
  },
  {
    title: "Cloud Architecture on AWS",
    category: "Cloud Architecture",
    duration: "18 hours",
    icon: <Server className="w-4 h-4 text-lms-teal" />,
    delay: 300,
  },
];

const RecommendedCourseItem = ({ title, category, duration, icon, delay }: RecommendedCourseProps) => {
  return (
    <div className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${delay}ms` }}>
      <div className="w-9 h-9 rounded-full bg-muted/50 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-sm">{title}</h3>
        <p className="text-xs text-muted-foreground">{category} • {duration}</p>
      </div>
    </div>
  );
};

const RecommendedCourses = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Recommended For You</h2>
      <div className="space-y-5">
        {recommendedCourses.map((course, index) => (
          <RecommendedCourseItem key={index} {...course} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedCourses;
