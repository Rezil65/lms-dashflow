
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, FilterX, Download } from "lucide-react";

// Sample data for analytics charts
const enrollmentData = [
  { month: 'Jan', enrollments: 65 },
  { month: 'Feb', enrollments: 59 },
  { month: 'Mar', enrollments: 80 },
  { month: 'Apr', enrollments: 81 },
  { month: 'May', enrollments: 56 },
  { month: 'Jun', enrollments: 55 },
  { month: 'Jul', enrollments: 40 },
  { month: 'Aug', enrollments: 70 },
  { month: 'Sep', enrollments: 90 },
  { month: 'Oct', enrollments: 110 },
  { month: 'Nov', enrollments: 105 },
  { month: 'Dec', enrollments: 120 },
];

const courseCompletionData = [
  { name: 'Web Development', completion: 85 },
  { name: 'Data Science', completion: 75 },
  { name: 'UX Design', completion: 90 },
  { name: 'Digital Marketing', completion: 65 },
  { name: 'AI Fundamentals', completion: 60 },
];

const userRoleData = [
  { name: 'Students', value: 1250 },
  { name: 'Instructors', value: 120 },
  { name: 'Admins', value: 25 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Analytics & Reporting</h2>
        
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1">
            <Calendar className="h-4 w-4" />
            Date Range
          </Button>
          <Button variant="outline" className="gap-1">
            <FilterX className="h-4 w-4" />
            Filter
          </Button>
          <Button className="gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="user">User Analytics</TabsTrigger>
          <TabsTrigger value="course">Course Analytics</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">2,541</p>
                <p className="text-xs text-green-600">↑ 12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">68%</p>
                <p className="text-xs text-green-600">↑ 5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Time on Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">42 min</p>
                <p className="text-xs text-red-600">↓ 3% from last month</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Monthly Enrollments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={enrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="enrollments" stroke="#4f46e5" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Completion Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={courseCompletionData}
                      margin={{ top: 20, right: 20, bottom: 20, left: 70 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip formatter={(value) => [`${value}%`, 'Completion Rate']} />
                      <Bar dataKey="completion" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={userRoleData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {userRoleData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, 'Users']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="user">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">User Analytics Content</h3>
              <p className="text-muted-foreground">
                Detailed user analytics will be displayed here, including user engagement metrics,
                learning patterns, and progress tracking.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="course">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Course Analytics Content</h3>
              <p className="text-muted-foreground">
                Detailed course analytics will be displayed here, including completion rates,
                popular modules, and assessment performance.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="revenue">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Revenue Analytics Content</h3>
              <p className="text-muted-foreground">
                Detailed revenue analytics will be displayed here, including sales trends,
                course profitability, and subscription metrics.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
