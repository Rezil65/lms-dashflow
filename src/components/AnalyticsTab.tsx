
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { BadgeCheck, Clock, FileBox, GraduationCap, LineChart as LineChartIcon, PieChart as PieChartIcon } from "lucide-react";

// Sample data
const weeklyActivity = [
  { day: 'Mon', hours: 2.5 },
  { day: 'Tue', hours: 1.7 },
  { day: 'Wed', hours: 3.2 },
  { day: 'Thu', hours: 0.8 },
  { day: 'Fri', hours: 2.1 },
  { day: 'Sat', hours: 4.5 },
  { day: 'Sun', hours: 1.3 },
];

const categoryDistribution = [
  { name: 'Web Development', value: 45 },
  { name: 'Data Science', value: 30 },
  { name: 'Cloud Computing', value: 15 },
  { name: 'Design', value: 10 },
];

const monthlyProgress = [
  { month: 'Jan', completion: 10 },
  { month: 'Feb', completion: 25 },
  { month: 'Mar', completion: 28 },
  { month: 'Apr', completion: 45 },
  { month: 'May', completion: 60 },
  { month: 'Jun', completion: 75 },
  { month: 'Jul', completion: 85 },
  { month: 'Aug', completion: 85 },
  { month: 'Sep', completion: 85 },
  { month: 'Oct', completion: 90 },
  { month: 'Nov', completion: 90 },
  { month: 'Dec', completion: 90 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const StatCard = ({ 
  title, 
  value, 
  description, 
  icon, 
  change,
}: { 
  title: string; 
  value: string | number; 
  description?: string; 
  icon: React.ReactNode;
  change?: { value: number; positive: boolean };
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {(description || change) && (
        <div className="flex justify-between items-center">
          {description && <CardDescription>{description}</CardDescription>}
          {change && (
            <p className={`text-xs font-medium ${change.positive ? 'text-green-500' : 'text-red-500'}`}>
              {change.positive ? '+' : '-'}{change.value}%
            </p>
          )}
        </div>
      )}
    </CardContent>
  </Card>
);

const AnalyticsTab = () => {
  const [timeframe, setTimeframe] = useState("week");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-1">Learning Analytics</h2>
        <p className="text-muted-foreground">Track your progress and learning patterns</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Learning Hours" 
          value="42.5"
          description="This month" 
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          change={{ value: 12, positive: true }}
        />
        <StatCard 
          title="Courses Completed" 
          value="7"
          description="Out of 15 enrolled" 
          icon={<BadgeCheck className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard 
          title="Avg. Daily Activity" 
          value="2.3 hrs"
          description="Last 7 days" 
          icon={<LineChartIcon className="h-4 w-4 text-muted-foreground" />}
          change={{ value: 5, positive: true }}
        />
        <StatCard 
          title="Resources Downloaded" 
          value="24"
          description="PDFs, codes, etc." 
          icon={<FileBox className="h-4 w-4 text-muted-foreground" />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Weekly Activity</CardTitle>
            <CardDescription>Hours spent learning per day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyActivity} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} hours`, 'Time Spent']} />
                  <Bar dataKey="hours" fill="#4361EE" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Learning Distribution</CardTitle>
            <CardDescription>Time spent by course category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg">Learning Progress</CardTitle>
              <CardDescription>Course completion over time</CardDescription>
            </div>
            <Tabs value={timeframe} onValueChange={setTimeframe} className="w-[240px]">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="year">Year</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyProgress} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Completion Rate']} />
                <Line type="monotone" dataKey="completion" stroke="#7209B7" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-center">
        <Card className="w-full max-w-lg bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="flex-shrink-0">
              <GraduationCap className="w-12 h-12 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Want a detailed learning report?</h3>
              <p className="text-muted-foreground mb-4">
                Get a comprehensive analysis of your learning habits, strengths, and areas for improvement.
              </p>
              <button className="text-primary font-medium hover:underline">Generate Report →</button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsTab;
