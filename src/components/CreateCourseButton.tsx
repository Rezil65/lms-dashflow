
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const CreateCourseButton = () => {
  const isMobile = useIsMobile();
  
  return (
    <Link to="/create-course">
      <Button size={isMobile ? "sm" : "default"} className="rounded-full">
        <Plus className="h-4 w-4 mr-2" />
        {isMobile ? "New" : "Create Course"}
      </Button>
    </Link>
  );
};

export default CreateCourseButton;
