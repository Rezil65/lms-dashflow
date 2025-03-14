
import { useEffect, useState } from "react";

interface PathCardProps {
  title: string;
  skills: string[];
  months: number;
  bgClass: string;
  chipClass: string;
  delay: number;
}

const paths = [
  {
    title: "Full Stack Developer",
    skills: ["React", "Node.js", "MongoDB"],
    months: 3,
    bgClass: "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200",
    chipClass: "bg-blue-100 text-blue-800",
    delay: 100,
  },
  {
    title: "Data Scientist",
    skills: ["Python", "Machine Learning", "Big Data"],
    months: 4,
    bgClass: "bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200",
    chipClass: "bg-purple-100 text-purple-800",
    delay: 200,
  },
  {
    title: "Cloud Architect",
    skills: ["AWS", "DevOps", "Microservices"],
    months: 5,
    bgClass: "bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-200",
    chipClass: "bg-indigo-100 text-indigo-800",
    delay: 300,
  },
];

const PathCard = ({ title, skills, months, bgClass, chipClass, delay }: PathCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <div 
      className={`rounded-xl p-5 border ${bgClass} opacity-0 transform translate-y-4 transition-all duration-500 ease-out ${isVisible ? "opacity-100 translate-y-0" : ""}`}
    >
      <div className="space-y-5">
        <div>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${chipClass}`}>
            {months} months
          </span>
          <h3 className="text-lg font-semibold mt-3">{title}</h3>
        </div>
        
        <div className="space-y-2">
          {skills.map((skill, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-white border border-blue-200 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              </div>
              <span className="text-sm">{skill}</span>
            </div>
          ))}
        </div>
        
        <button className="w-full py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium shadow-sm hover:shadow-md transition-all">
          Start Path
        </button>
      </div>
    </div>
  );
};

const LearningPaths = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Learning Paths</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {paths.map((path, index) => (
          <PathCard key={index} {...path} />
        ))}
      </div>
    </div>
  );
};

export default LearningPaths;
