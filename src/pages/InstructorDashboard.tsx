
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BarChart3, BookOpen, Calendar, Clock, FileText, Pencil, Plus, RefreshCw, Shield, Upload, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for courses
const mockCourses = [
  {
    id: 1,
    title: "Introduction to Web Development",
    status: "Published",
    students: 45,
    rating: 4.5,
    lastUpdated: "2023-05-10"
  },
  {
    id: 2,
    title: "Advanced JavaScript Concepts",
    status: "Draft",
    students: 0,
    rating: 0,
    lastUpdated: "2023-05-15"
  },
  {
    id: 3,
    title: "React Framework Deep Dive",
    status: "Published",
    students: 32,
    rating: 4.8,
    lastUpdated: "2023-04-28"
  },
];

// Mock data for assignments
const mockAssignments = [
  {
    id: 1,
    title: "Build a Personal Website",
    course: "Introduction to Web Development",
    due: "2023-05-25",
    submissions: 38,
    graded: 25
  },
  {
    id: 2,
    title: "JavaScript Functions Exercise",
    course: "Introduction to Web Development",
    due: "2023-05-20",
    submissions: 42,
    graded: 42
  },
  {
    id: 3,
    title: "React Components Challenge",
    course: "React Framework Deep Dive",
    due: "2023-06-01",
    submissions: 18,
    graded: 10
  },
];

// Mock data for students
const mockStudents = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    coursesEnrolled: 2,
    lastActive: "2023-05-17"
  },
  {
    id: 2,
    name: "Maria Garcia",
    email: "maria@example.com",
    coursesEnrolled: 1,
    lastActive: "2023-05-16"
  },
  {
    id: 3,
    name: "David Lee",
    email: "david@example.com",
    coursesEnrolled: 3,
    lastActive: "2023-05-18"
  },
];

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    category: "",
  });
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const handleCreateCourse = () => {
    console.log("Creating new course:", newCourse);
    setIsCreateCourseOpen(false);
    setNewCourse({ title: "", description: "", category: "" });
    // In a real app, you would send this data to your API
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Instructor Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.email}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
        
        <Tabs 
          defaultValue="overview" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <div className="bg-white rounded-lg border shadow-sm p-1">
            <TabsList className="w-full flex justify-start overflow-x-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="courses">My Courses</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    Total Courses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-xs text-muted-foreground">2 published, 1 draft</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    Active Students
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">77</p>
                  <p className="text-xs text-muted-foreground">↑ 12% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    Average Rating
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">4.7</p>
                  <p className="text-xs text-muted-foreground">Based on 56 reviews</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-md font-medium">Recent Courses</CardTitle>
                  <Button variant="outline" size="sm" className="gap-1" onClick={() => setActiveTab("courses")}>
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Students</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockCourses.slice(0, 3).map(course => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium">{course.title}</TableCell>
                          <TableCell>
                            <span 
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                course.status === "Published" 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {course.status}
                            </span>
                          </TableCell>
                          <TableCell>{course.students}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-md font-medium">Upcoming Deadlines</CardTitle>
                  <Button variant="outline" size="sm" className="gap-1" onClick={() => setActiveTab("assignments")}>
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Assignment</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Due Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockAssignments.slice(0, 3).map(assignment => (
                        <TableRow key={assignment.id}>
                          <TableCell className="font-medium">{assignment.title}</TableCell>
                          <TableCell className="truncate max-w-[150px]">{assignment.course}</TableCell>
                          <TableCell>{assignment.due}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-md font-medium">Schedule for Today</CardTitle>
                <Button variant="outline" size="sm" className="gap-1" onClick={() => setActiveTab("schedule")}>
                  Full Schedule
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-2 rounded">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Office Hours: Web Development</h3>
                      <p className="text-sm text-muted-foreground">10:00 AM - 11:30 AM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-2 rounded">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Live Session: JavaScript Debugging</h3>
                      <p className="text-sm text-muted-foreground">2:00 PM - 3:30 PM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-2 rounded">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Assignment Due: React Components</h3>
                      <p className="text-sm text-muted-foreground">11:59 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="courses">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">My Courses</h2>
              <Button className="gap-1" onClick={() => setIsCreateCourseOpen(true)}>
                <Plus className="h-4 w-4" />
                Create Course
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockCourses.map(course => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">{course.title}</TableCell>
                        <TableCell>
                          <span 
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              course.status === "Published" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {course.status}
                          </span>
                        </TableCell>
                        <TableCell>{course.students}</TableCell>
                        <TableCell>{course.rating > 0 ? course.rating : "N/A"}</TableCell>
                        <TableCell>{course.lastUpdated}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="assignments">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Assignments</h2>
              <Button className="gap-1">
                <Plus className="h-4 w-4" />
                Create Assignment
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Submissions</TableHead>
                      <TableHead>Graded</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockAssignments.map(assignment => (
                      <TableRow key={assignment.id}>
                        <TableCell className="font-medium">{assignment.title}</TableCell>
                        <TableCell>{assignment.course}</TableCell>
                        <TableCell>{assignment.due}</TableCell>
                        <TableCell>{assignment.submissions}</TableCell>
                        <TableCell>{assignment.graded}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="students">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Students</h2>
              <div className="flex gap-2">
                <div className="relative w-64">
                  <Input placeholder="Search students..." className="pl-8" />
                  <RefreshCw className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
                <Button variant="outline" className="gap-1">
                  <Upload className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Courses Enrolled</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockStudents.map(student => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.coursesEnrolled}</TableCell>
                        <TableCell>{student.lastActive}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="schedule">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Schedule</h2>
              <Button className="gap-1">
                <Plus className="h-4 w-4" />
                Add Event
              </Button>
            </div>
            
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-md font-medium">
                  <Calendar className="h-4 w-4" />
                  This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2 border-l-2 border-primary pl-4 py-2">
                    <div className="text-sm font-medium">Monday, May 22</div>
                    <div className="space-y-3">
                      <div className="bg-primary/5 p-3 rounded-md">
                        <div className="font-medium">Web Development Office Hours</div>
                        <div className="text-sm text-muted-foreground">10:00 AM - 11:30 AM</div>
                      </div>
                      <div className="bg-primary/5 p-3 rounded-md">
                        <div className="font-medium">JavaScript Debugging Session</div>
                        <div className="text-sm text-muted-foreground">2:00 PM - 3:30 PM</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 border-l-2 border-gray-200 pl-4 py-2">
                    <div className="text-sm font-medium">Tuesday, May 23</div>
                    <div className="space-y-3">
                      <div className="bg-primary/5 p-3 rounded-md">
                        <div className="font-medium">React Framework Workshop</div>
                        <div className="text-sm text-muted-foreground">1:00 PM - 3:00 PM</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 border-l-2 border-gray-200 pl-4 py-2">
                    <div className="text-sm font-medium">Wednesday, May 24</div>
                    <div className="space-y-3">
                      <div className="bg-primary/5 p-3 rounded-md">
                        <div className="font-medium">Guest Speaker: Industry Trends</div>
                        <div className="text-sm text-muted-foreground">11:00 AM - 12:00 PM</div>
                      </div>
                      <div className="bg-primary/5 p-3 rounded-md">
                        <div className="font-medium">Student Project Reviews</div>
                        <div className="text-sm text-muted-foreground">2:00 PM - 4:00 PM</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-md font-medium">
                  <Calendar className="h-4 w-4" />
                  Next Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2 border-l-2 border-gray-200 pl-4 py-2">
                    <div className="text-sm font-medium">Monday, May 29</div>
                    <div className="space-y-3">
                      <div className="bg-gray-100 p-3 rounded-md">
                        <div className="font-medium">Holiday - No Classes</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 border-l-2 border-gray-200 pl-4 py-2">
                    <div className="text-sm font-medium">Tuesday, May 30</div>
                    <div className="space-y-3">
                      <div className="bg-gray-100 p-3 rounded-md">
                        <div className="font-medium">Database Design Workshop</div>
                        <div className="text-sm text-muted-foreground">10:00 AM - 12:00 PM</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Course Analytics</h2>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-1">
                  <Upload className="h-4 w-4" />
                  Export Data
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md font-medium">Student Engagement</CardTitle>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center">
                  <BarChart3 className="h-40 w-40 text-muted-foreground" />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md font-medium">Completion Rates</CardTitle>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center">
                  <BarChart3 className="h-40 w-40 text-muted-foreground" />
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium">Course Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Enrollment</TableHead>
                      <TableHead>Completion Rate</TableHead>
                      <TableHead>Avg. Time Spent</TableHead>
                      <TableHead>Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Introduction to Web Development</TableCell>
                      <TableCell>45 students</TableCell>
                      <TableCell>78%</TableCell>
                      <TableCell>12.5 hours</TableCell>
                      <TableCell>4.5/5</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">React Framework Deep Dive</TableCell>
                      <TableCell>32 students</TableCell>
                      <TableCell>65%</TableCell>
                      <TableCell>18.2 hours</TableCell>
                      <TableCell>4.8/5</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Dialog open={isCreateCourseOpen} onOpenChange={setIsCreateCourseOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Course</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new course. You can edit more details later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title</Label>
              <Input 
                id="title" 
                placeholder="e.g. Advanced React Development" 
                value={newCourse.title}
                onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input 
                id="category" 
                placeholder="e.g. Web Development" 
                value={newCourse.category}
                onChange={(e) => setNewCourse({...newCourse, category: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Brief description of the course..."
                className="min-h-[100px]"
                value={newCourse.description}
                onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateCourseOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateCourse}>Create Course</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InstructorDashboard;
