
import { CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const RecentAchievements = () => {
  const achievements = [
    {
      title: "HTML & CSS Certification",
      status: "Completed"
    },
    {
      title: "JavaScript Basics",
      status: "95% Score"
    },
    {
      title: "Git Fundamentals",
      status: "Completed"
    }
  ];

  return (
    <Card className="hover:shadow-md transition-all duration-300 group">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-lms-yellow group-hover:text-lms-yellow/80 transition-colors" />
          Recent Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {achievements.map((achievement, index) => (
            <motion.li 
              key={index}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="text-sm flex justify-between border-b border-border/40 pb-2 last:border-0"
            >
              <span>{achievement.title}</span>
              <span className="text-muted-foreground">{achievement.status}</span>
            </motion.li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default RecentAchievements;
