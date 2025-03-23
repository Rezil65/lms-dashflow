
import { Video, FileText, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const ActivityCard = ({ icon: Icon, title, description, progress }: {
  icon: any;
  title: string;
  description: string;
  progress: number;
}) => {
  return (
    <Card className="hover:shadow-md transition-all duration-300 group">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <div className="bg-primary/10 p-2 rounded group-hover:bg-primary/15 transition-colors">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1 flex-1">
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-primary h-1.5 rounded-full"
              ></motion.div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const LearningActivities = () => {
  const activities = [
    {
      icon: Video,
      title: "Introduction to TypeScript",
      description: "Continue watching - 45 min left",
      progress: 65
    },
    {
      icon: FileText,
      title: "React Router Documentation",
      description: "Continue reading - 3 pages left",
      progress: 78
    },
    {
      icon: FileText,
      title: "Database Design Assignment",
      description: "Due in 5 days",
      progress: 25
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">My Learning Activities</h2>
        <Button variant="outline" size="sm" className="gap-1 group">
          <RefreshCw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index + 0.3 }}
          >
            <ActivityCard {...activity} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default LearningActivities;
