
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Card,
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen,
  Users,
  BarChart,
  MessageSquare,
  Plus,
  Search,
  FileText,
  ListChecks,
  Calendar,
  UserCog
} from "lucide-react";

// Sample instructor data
const instructorData = {
  name: "Dr. Jane Smith",
  coursesCreated: 12,
  studentsEnrolled: 387,
  averageRating: 4.8,
  earnings: "$9,450",
  recentCourses: [
    { id: 1, title: "Advanced Machine Learning", students: 45, rating: 4.9, completed: "75%" },
    { id: 2, title: "Data Visualization Techniques", students: 32, rating: 4.7, completed: "100%" },
    { id: 3, title: "Python for Data Science", students: 64, rating: 4.8, completed: "90%" }
  ],
  upcomingDeadlines: [
    { id: 1, task: "Submit final quiz for ML course", due: "2023-06-15" },
    { id: 2, task: "Review student assignments", due: "2023-06-10" },
    { id: 3, task: "Create new course materials", due: "2023-06-20" }
  ]
};

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  
  useEffect(() => {
    // Check auth status (would use a hook in real implementation)
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "instructor") {
      // For demo, allow staying on page
      console.log("User is not an instructor, but allowing for demo");
    }
  }, [navigate]);
  
  const goToCreateCourse = () => {
    navigate("/create-course");
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Instructor Dashboard</h1>
          <div className="text-sm text-muted-foreground">
            Welcome back, {instructorData.name}
          </div>
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
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="communication">Communication</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <BookOpen className="mr-2 h-4 w-4 text-blue-500" />
                    Courses Created
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{instructorData.coursesCreated}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Users className="mr-2 h-4 w-4 text-green-500" />
                    Students Enrolled
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{instructorData.studentsEnrolled}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <BarChart className="mr-2 h-4 w-4 text-purple-500" />
                    Average Rating
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{instructorData.averageRating}/5.0</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Courses</CardTitle>
                  <CardDescription>Your recently created or updated courses</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Students</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {instructorData.recentCourses.map(course => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium">{course.title}</TableCell>
                          <TableCell>{course.students}</TableCell>
                          <TableCell>{course.rating}/5.0</TableCell>
                          <TableCell>
                            <Badge variant={course.completed === "100%" ? "default" : "secondary"}>
                              {course.completed}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="mt-4">
                    <Button onClick={goToCreateCourse} className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Course
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
                  <CardDescription>Tasks that require your attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {instructorData.upcomingDeadlines.map(deadline => (
                      <li key={deadline.id} className="flex items-start gap-3 p-2 rounded-md border">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{deadline.task}</p>
                          <p className="text-sm text-muted-foreground">
                            Due: {new Date(deadline.due).toLocaleDateString()}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">Complete</Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="courses">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">My Courses</h2>
                <div className="flex gap-2">
                  <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search courses..." className="pl-8" />
                  </div>
                  <Button onClick={goToCreateCourse}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Course
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {instructorData.recentCourses.map(course => (
                  <Card key={course.id}>
                    <CardHeader className="pb-2">
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription>
                        {course.students} students enrolled
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center mb-4">
                        <Badge variant={course.completed === "100%" ? "default" : "secondary"}>
                          {course.completed} Complete
                        </Badge>
                        <div className="text-sm">Rating: {course.rating}/5.0</div>
                      </div>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full">View Course</Button>
                        <Button variant="outline" className="w-full">Edit Content</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="students">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Students</h2>
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search students..." className="pl-8" />
                </div>
              </div>
              
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Alex Johnson</TableCell>
                        <TableCell>Advanced Machine Learning</TableCell>
                        <TableCell>75%</TableCell>
                        <TableCell>2 days ago</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Message</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Sarah Miller</TableCell>
                        <TableCell>Data Visualization</TableCell>
                        <TableCell>92%</TableCell>
                        <TableCell>1 day ago</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Message</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">David Chen</TableCell>
                        <TableCell>Python for Data Science</TableCell>
                        <TableCell>45%</TableCell>
                        <TableCell>5 days ago</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Message</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="assignments">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Assignments</h2>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Assignment
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Pending Reviews</CardTitle>
                    <CardDescription>Assignments awaiting your review</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3 p-2 rounded-md border">
                        <div className="bg-yellow-100 p-2 rounded-full">
                          <FileText className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Final Project Submissions</p>
                          <p className="text-sm text-muted-foreground">
                            Data Visualization (12 submissions)
                          </p>
                        </div>
                        <Button variant="outline" size="sm">Review</Button>
                      </li>
                      <li className="flex items-start gap-3 p-2 rounded-md border">
                        <div className="bg-yellow-100 p-2 rounded-full">
                          <FileText className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Weekly Quiz Results</p>
                          <p className="text-sm text-muted-foreground">
                            Machine Learning (28 submissions)
                          </p>
                        </div>
                        <Button variant="outline" size="sm">Review</Button>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Upcoming Assignments</CardTitle>
                    <CardDescription>Assignments scheduled to be released</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3 p-2 rounded-md border">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Mid-term Assessment</p>
                          <p className="text-sm text-muted-foreground">
                            Releasing: June 15, 2023
                          </p>
                        </div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </li>
                      <li className="flex items-start gap-3 p-2 rounded-md border">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Practical Exercise #4</p>
                          <p className="text-sm text-muted-foreground">
                            Releasing: June 20, 2023
                          </p>
                        </div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Course Analytics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">78%</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Engagement Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">4.2 hrs/week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Quiz Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">82%</p>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Student Engagement Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full flex items-center justify-center bg-gray-100 rounded-md">
                    <p className="text-muted-foreground">Engagement graph would display here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="communication" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Communication</h2>
              <Button>
                <MessageSquare className="mr-2 h-4 w-4" />
                New Message
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Announcements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Input placeholder="Announcement title" />
                    <Textarea placeholder="Announcement details..." />
                  </div>
                  <div className="flex justify-end">
                    <Button>Post Announcement</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3 p-2 rounded-md border">
                      <div className="bg-gray-100 p-2 rounded-full">
                        <MessageSquare className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Question about final project</p>
                        <p className="text-sm text-muted-foreground">
                          From: Alex Johnson - 2 hours ago
                        </p>
                      </div>
                      <Button variant="outline" size="sm">Reply</Button>
                    </li>
                    <li className="flex items-start gap-3 p-2 rounded-md border">
                      <div className="bg-gray-100 p-2 rounded-full">
                        <MessageSquare className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Extension request</p>
                        <p className="text-sm text-muted-foreground">
                          From: Sarah Miller - 1 day ago
                        </p>
                      </div>
                      <Button variant="outline" size="sm">Reply</Button>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="schedule">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Schedule</h2>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Event
                </Button>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full flex items-center justify-center bg-gray-100 rounded-md">
                    <p className="text-muted-foreground">Calendar would display here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="profile">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Profile Settings</h2>
                <Button variant="outline" onClick={() => navigate("/mfa-setup")}>
                  <Shield className="mr-2 h-4 w-4" />
                  Configure MFA
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue="Dr. Jane Smith" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="jane.smith@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio" 
                        defaultValue="Professor of Data Science with 10+ years of experience in machine learning and statistical analysis."
                        rows={4}
                      />
                    </div>
                    <Button>Save Changes</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    <Button>Update Password</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default InstructorDashboard;
