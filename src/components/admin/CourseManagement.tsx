
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Edit, Trash2, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import CreateCourseButton from "../CreateCourseButton";
import { getCourses, deleteCourse } from "@/utils/courseUtils";
import { QuizManager } from "../Quiz";

const CourseManagement = () => {
  const [activeTab, setActiveTab] = useState("courses");
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    loadCourses();
  }, []);
  
  const loadCourses = async () => {
    const coursesData = await getCourses();
    setCourses(coursesData);
  };
  
  const handleSaveQuizzes = (quizzes) => {
    console.log("Saved quizzes:", quizzes);
    toast({
      title: "Quizzes Saved",
      description: `${quizzes.length} quizzes have been saved successfully.`
    });
    // In a real app, you would save these to your backend
  };
  
  const handleEditCourse = (course) => {
    navigate(`/course/${course.id}/content`);
  };
  
  const handleViewCourse = (course) => {
    navigate(`/course/${course.id}`);
  };
  
  const handleDeleteCourse = (course) => {
    setSelectedCourse(course);
    setDeleteDialogOpen(true);
  };
  
  const confirmDeleteCourse = async () => {
    if (selectedCourse) {
      const success = await deleteCourse(selectedCourse.id);
      if (success) {
        await loadCourses();
        setDeleteDialogOpen(false);
        toast({
          title: "Course Deleted",
          description: `"${selectedCourse.title}" has been deleted.`
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete course.",
          variant: "destructive"
        });
      }
    }
  };
  
  const filteredCourses = searchTerm 
    ? courses.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : courses;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Course Management</h2>
        <CreateCourseButton />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-6">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>All Courses</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {filteredCourses.length === 0 ? (
                <div className="text-center py-6">
                  {searchTerm ? (
                    <p className="text-muted-foreground">No courses match your search.</p>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-muted-foreground">No courses available.</p>
                      <CreateCourseButton />
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Featured</TableHead>
                        <TableHead className="w-[120px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCourses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium">{course.title}</TableCell>
                          <TableCell>{course.category || "Uncategorized"}</TableCell>
                          <TableCell className="capitalize">{course.level || "All Levels"}</TableCell>
                          <TableCell>${course.price?.toFixed(2) || "0.00"}</TableCell>
                          <TableCell>
                            {course.isFeatured ? (
                              <Badge variant="default">Featured</Badge>
                            ) : (
                              <Badge variant="outline">No</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => handleViewCourse(course)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => handleEditCourse(course)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-destructive"
                                onClick={() => handleDeleteCourse(course)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center py-6 text-muted-foreground">Categories management interface will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="quizzes">
          <QuizManager courseId="default" onSaveQuizzes={handleSaveQuizzes} />
        </TabsContent>
        
        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <CardTitle>Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center py-6 text-muted-foreground">Assignment management interface will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedCourse?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteCourse}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseManagement;
