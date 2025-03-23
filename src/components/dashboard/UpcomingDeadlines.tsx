
import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const UpcomingDeadlines = () => {
  const deadlines = [
    {
      title: "JavaScript Final Project",
      timeLeft: "2 days left"
    },
    {
      title: "React Quiz",
      timeLeft: "5 days left"
    },
    {
      title: "Database Assignment",
      timeLeft: "1 week left"
    }
  ];

  return (
    <Card className="hover:shadow-md transition-all duration-300 group">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Clock className="h-4 w-4 text-lms-red group-hover:text-lms-red/80 transition-colors" />
          Upcoming Deadlines
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {deadlines.map((deadline, index) => (
            <motion.li 
              key={index}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="text-sm flex justify-between border-b border-border/40 pb-2 last:border-0"
            >
              <span>{deadline.title}</span>
              <span className="text-muted-foreground">{deadline.timeLeft}</span>
            </motion.li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default UpcomingDeadlines;
