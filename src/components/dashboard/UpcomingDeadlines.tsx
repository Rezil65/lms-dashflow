
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
    <Card className="border shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-500" />
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
              className="text-sm flex justify-between border-b border-gray-100 pb-2 last:border-0"
            >
              <span>{deadline.title}</span>
              <span className="text-gray-500">{deadline.timeLeft}</span>
            </motion.li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default UpcomingDeadlines;
