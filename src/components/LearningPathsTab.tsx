
import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight, Clock, Code, Database, GraduationCap, Server, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface PathItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  courseCount: number;
  progress: number;
  skills: string[];
  icon: React.ReactNode;
  bgClass: string;
  category: string;
}

const paths: PathItem[] = [
  {
    id: "path-1",
    title: "Full Stack Developer",
    description: "Master both frontend and backend development with the MERN stack (MongoDB, Express, React, Node.js).",
    duration: "3 months",
    courseCount: 8,
    progress: 65,
    skills: ["JavaScript", "React", "Node.js", "MongoDB", "Express", "REST APIs"],
    icon: <Code className="w-5 h-5" />,
    bgClass: "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200",
    category: "Web Development"
  },
  {
    id: "path-2",
    title: "Data Scientist",
    description: "Learn to analyze complex data, build predictive models, and extract insights using Python and various ML frameworks.",
    duration: "4 months",
    courseCount: 10,
    progress: 30,
    skills: ["Python", "Machine Learning", "Data Analysis", "Statistics", "Pandas", "NumPy"],
    icon: <Database className="w-5 h-5" />,
    bgClass: "bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200",
    category: "Data Science"
  },
  {
    id: "path-3",
    title: "Cloud Architect",
    description: "Design and implement cloud infrastructure solutions using AWS, containerization, and DevOps practices.",
    duration: "5 months",
    courseCount: 12,
    progress: 45,
    skills: ["AWS", "DevOps", "Microservices", "Docker", "Kubernetes", "CI/CD"],
    icon: <Server className="w-5 h-5" />,
    bgClass: "bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-200",
    category: "Cloud Computing"
  },
  {
    id: "path-4",
    title: "UX/UI Designer",
    description: "Learn to create intuitive, accessible, and visually appealing user interfaces and experiences.",
    duration: "3 months",
    courseCount: 7,
    progress: 0,
    skills: ["UI Design", "UX Research", "Wireframing", "Figma", "Prototyping", "User Testing"],
    icon: <Users className="w-5 h-5" />,
    bgClass: "bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200",
    category: "Design"
  },
];

const PathCard = ({ path }: { path: PathItem }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100 + paths.indexOf(path) * 100);
    return () => clearTimeout(timer);
  }, [path]);
  
  return (
    <Card 
      className={`border overflow-hidden transition-all duration-500 ease-out ${
        path.bgClass
      } ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="bg-white/60">
            {path.category}
          </Badge>
          
          <div className="flex items-center text-sm text-muted-foreground gap-1">
            <Clock className="w-4 h-4" />
            {path.duration}
          </div>
        </div>
        
        <div className="flex items-center gap-3 mt-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border">
            {path.icon}
          </div>
          <h3 className="text-xl font-semibold">{path.title}</h3>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {path.description}
        </p>
        
        <div className="space-y-1 mb-4">
          <div className="flex justify-between text-xs">
            <span>{path.progress > 0 ? `${path.progress}% complete` : "Not started"}</span>
            <span>{path.courseCount} courses</span>
          </div>
          <Progress value={path.progress} className="h-1.5" />
        </div>
        
        <div className="space-y-1">
          <h4 className="text-xs font-medium mb-2">Skills you'll gain:</h4>
          <div className="flex flex-wrap gap-1">
            {path.skills.slice(0, 4).map((skill, index) => (
              <Badge key={index} variant="secondary" className="bg-white/60 text-xs font-normal">
                {skill}
              </Badge>
            ))}
            {path.skills.length > 4 && (
              <Badge variant="secondary" className="bg-white/60 text-xs font-normal">
                +{path.skills.length - 4} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button variant="default" className="w-full">
          {path.progress > 0 ? (
            <>
              <Check className="w-4 h-4 mr-1" />
              Continue Path
            </>
          ) : (
            <>
              <ChevronRight className="w-4 h-4 mr-1" />
              Start Path
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

const LearningPathsTab = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-1">Learning Paths</h2>
        <p className="text-muted-foreground">Structured learning journeys to help you achieve your career goals</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paths.map((path) => (
          <PathCard key={path.id} path={path} />
        ))}
      </div>
      
      <div className="flex justify-center">
        <Card className="w-full max-w-lg bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <GraduationCap className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Need personalized guidance?</h3>
            <p className="text-muted-foreground mb-4">
              Talk to a learning advisor to get recommendations tailored to your career goals and current skill level.
            </p>
            <Button variant="outline" className="bg-white/80">Schedule a Consultation</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LearningPathsTab;
