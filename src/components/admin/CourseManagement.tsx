import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { 
  Plus, MoreHorizontal, Pencil, Trash, Eye, 
  ArrowUpDown, Search, Calendar, Tag, Book
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { getCourses, deleteCourse, Course } from "@/utils/courseUtils";

const CourseManagement = () => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast({
          title: "Error",
          description: "Could not load courses. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);
  
  const handleSelectAllChange = (checked: boolean) => {
    if (checked) {
      const allIds = courses.map(course => course.id);
      setSelectedCourses(allIds);
    } else {
      setSelectedCourses([]);
    }
  };
  
  const handleSelectCourse = (courseId: string, checked: boolean) => {
    if (checked) {
      setSelectedCourses(prev => [...prev, courseId]);
    } else {
      setSelectedCourses(prev => prev.filter(id => id !== courseId));
    }
  };
  
  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;
    
    try {
      const success = await deleteCourse(courseToDelete.id);
      
      if (success) {
        setCourses(prev => prev.filter(course => course.id !== courseToDelete.id));
        setSelectedCourses(prev => prev.filter(id => id !== courseToDelete.id));
        setDeleteDialogOpen(false);
        setCourseToDelete(null);
        
        toast({
          title: "Course deleted",
          description: `"${courseToDelete.title}" has been permanently deleted.`
        });
      } else {
        throw new Error("Failed to delete course");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      toast({
        title: "Error",
        description: "Could not delete the course. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Filter courses based on search query
  const filteredCourses = searchQuery
    ? courses.filter(course => 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : courses;
    
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Course Management</h2>
        <Button asChild>
          <Link to="/admin/courses/new">
            <Plus className="mr-2 h-4 w-4" /> Add New Course
          </Link>
        </Button>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <ArrowUpDown className="mr-2 h-4 w-4" /> Sort
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" /> Filter
          </Button>
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectedCourses.length === courses.length && courses.length > 0}
                  onCheckedChange={handleSelectAllChange}
                />
              </TableHead>
              <TableHead>Course</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="hidden md:table-cell">Created</TableHead>
              <TableHead className="w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading courses...
                </TableCell>
              </TableRow>
            ) : filteredCourses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No courses found. {searchQuery ? "Try a different search term." : ""}
                </TableCell>
              </TableRow>
            ) : (
              filteredCourses.map(course => (
                <TableRow key={course.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedCourses.includes(course.id)}
                      onCheckedChange={(checked) => 
                        handleSelectCourse(course.id, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded overflow-hidden bg-muted flex items-center justify-center">
                        {course.thumbnail ? (
                          <img 
                            src={course.thumbnail} 
                            alt={course.title}
                            className="h-full w-full object-cover" 
                          />
                        ) : (
                          <Book className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{course.title}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {course.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {course.category ? (
                      <Badge variant="outline" className="capitalize">
                        <Tag className="mr-1 h-3 w-3" />
                        {course.category}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">Uncategorized</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      Published
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="text-sm text-muted-foreground">
                      {course.createdAt ? new Date(course.createdAt).toLocaleDateString() : '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/course/${course.id}`}>
                            <Eye className="mr-2 h-4 w-4" /> View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/admin/courses/edit/${course.id}`}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => {
                            setCourseToDelete(course);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete "{courseToDelete?.title}"?</p>
            <p className="text-sm text-muted-foreground mt-2">
              This action cannot be undone. All associated modules, lessons, and resources will be permanently deleted.
            </p>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setDeleteDialogOpen(false);
                setCourseToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteCourse}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseManagement;
