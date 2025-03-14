
import { BookOpen, Certificate, Folders } from "lucide-react";
import { useEffect, useState } from "react";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  delay: number;
}

const StatCard = ({ title, value, icon, color, delay }: StatCardProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  
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
  
  return (
    <div className="stat-card animate-fade-in" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex justify-between items-start">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className={`w-8 h-8 rounded-md flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-display font-semibold mt-1">{displayValue}</p>
    </div>
  );
};

const Stats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Courses"
        value={24}
        icon={<Folders className="w-4 h-4 text-white" />}
        color="bg-lms-blue"
        delay={100}
      />
      <StatCard
        title="Hours Learned"
        value={156}
        icon={<BookOpen className="w-4 h-4 text-white" />}
        color="bg-lms-purple"
        delay={200}
      />
      <StatCard
        title="Certificates"
        value={5}
        icon={<Certificate className="w-4 h-4 text-white" />}
        color="bg-lms-pink"
        delay={300}
      />
      <StatCard
        title="Projects"
        value={12}
        icon={<Folders className="w-4 h-4 text-white" />}
        color="bg-lms-teal"
        delay={400}
      />
    </div>
  );
};

export default Stats;
