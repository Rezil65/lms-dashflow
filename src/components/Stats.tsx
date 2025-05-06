
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, BarChart2, Calendar } from "lucide-react";
import { getTotalCourseCount } from "@/utils/courseUtils";

interface StatsProps {
  userId?: string;
}

const Stats = ({ userId }: StatsProps) => {
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [completedCourses, setCompletedCourses] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Fetch total courses
        const courseCount = await getTotalCourseCount();
        setTotalCourses(courseCount);
        
        // For now, just set a mock value for completed courses
        // In a real app, you'd fetch this from user progress data
        setCompletedCourses(userId ? Math.floor(Math.random() * 5) + 1 : 0);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [userId]);

  const stats = [
    {
      title: "Total Courses",
      value: loading ? "Loading..." : totalCourses.toString(),
      icon: <BookOpen className="h-8 w-8" />,
      description: "Available courses",
      color: "text-blue-500",
      bgColor: "bg-blue-100",
    },
    {
      title: "Completed",
      value: loading ? "Loading..." : completedCourses.toString(),
      icon: <BarChart2 className="h-8 w-8" />,
      description: "Courses completed",
      color: "text-green-500",
      bgColor: "bg-green-100",
    },
    {
      title: "In Progress",
      value: "2",
      icon: <Calendar className="h-8 w-8" />,
      description: "Active courses",
      color: "text-amber-500",
      bgColor: "bg-amber-100",
    },
    {
      title: "Enrollments",
      value: "153",
      icon: <Users className="h-8 w-8" />,
      description: "Total students",
      color: "text-purple-500",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`${stat.bgColor} ${stat.color} p-2 rounded-md`}>
              {stat.icon}
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Stats;
