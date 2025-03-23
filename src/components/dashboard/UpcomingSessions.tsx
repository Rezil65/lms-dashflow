
import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const UpcomingSessions = () => {
  const sessions = [
    {
      title: "Advanced CSS Techniques",
      schedule: "Tomorrow, 10 AM"
    },
    {
      title: "React State Management",
      schedule: "May 25, 2 PM"
    },
    {
      title: "DevOps Introduction",
      schedule: "May 28, 11 AM"
    }
  ];

  return (
    <Card className="border shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          Upcoming Sessions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {sessions.map((session, index) => (
            <motion.li 
              key={index}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="text-sm flex justify-between border-b border-gray-100 pb-2 last:border-0"
            >
              <span>{session.title}</span>
              <span className="text-gray-500">{session.schedule}</span>
            </motion.li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default UpcomingSessions;
