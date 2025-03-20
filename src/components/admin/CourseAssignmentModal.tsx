
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Course {
  id: number;
  title: string;
  description?: string;
  category?: string;
}

interface CourseAssignmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  target: {
    type: "user" | "group";
    id: number;
    name: string;
  };
  onAssignCourses: (courseIds: number[]) => void;
  assignedCourseIds?: number[];
}

// Sample course data
const availableCourses: Course[] = [
  { id: 1, title: "Introduction to Web Development", category: "Development" },
  { id: 2, title: "Advanced JavaScript", category: "Development" },
  { id: 3, title: "React Fundamentals", category: "Development" },
  { id: 4, title: "UX Design Principles", category: "Design" },
  { id: 5, title: "Business Communication", category: "Business" },
  { id: 6, title: "Data Analysis with Python", category: "Data Science" },
  { id: 7, title: "Digital Marketing Essentials", category: "Marketing" },
  { id: 8, title: "Project Management", category: "Business" },
];

const CourseAssignmentModal = ({
  open,
  onOpenChange,
  target,
  onAssignCourses,
  assignedCourseIds = [],
}: CourseAssignmentModalProps) => {
  const [selectedCourseIds, setSelectedCourseIds] = useState<number[]>(assignedCourseIds);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter courses based on search query
  const filteredCourses = searchQuery
    ? availableCourses.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (course.category &&
            course.category.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : availableCourses;

  const handleSubmit = () => {
    onAssignCourses(selectedCourseIds);
    toast.success(
      `Courses ${selectedCourseIds.length > 0 ? "assigned to" : "removed from"} ${
        target.type === "user" ? "user" : "group"
      } successfully`
    );
    onOpenChange(false);
  };

  const toggleCourse = (courseId: number) => {
    setSelectedCourseIds((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            Assign Courses to {target.type === "user" ? "User" : "Group"}
          </DialogTitle>
          <DialogDescription>
            Select courses to assign to{" "}
            <span className="font-medium">{target.name}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <ScrollArea className="h-72">
          <div className="space-y-2">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  id={`course-${course.id}`}
                  checked={selectedCourseIds.includes(course.id)}
                  onCheckedChange={() => toggleCourse(course.id)}
                />
                <label
                  htmlFor={`course-${course.id}`}
                  className="flex-1 cursor-pointer text-sm"
                >
                  <div className="font-medium">{course.title}</div>
                  {course.category && (
                    <div className="text-xs text-muted-foreground">
                      {course.category}
                    </div>
                  )}
                </label>
              </div>
            ))}

            {filteredCourses.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No courses found matching your search.
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="mt-2 text-sm text-muted-foreground">
          {selectedCourseIds.length} course(s) selected
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Assign Courses</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CourseAssignmentModal;
