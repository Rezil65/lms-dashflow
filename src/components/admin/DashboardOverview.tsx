
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Clock, DollarSign, Bell } from "lucide-react";
import { getCoursesCount } from "@/utils/courseUtils";

// Sample data for the charts
const userRegistrationData = [
  { name: 'Mon', users: 12 },
  { name: 'Tue', users: 19 },
  { name: 'Wed', users: 15 },
  { name: 'Thu', users: 25 },
  { name: 'Fri', users: 38 },
  { name: 'Sat', users: 27 },
  { name: 'Sun', users: 9 },
];

const StatCard = ({ title, value, icon, color }: { title: string; value: string | number; icon: React.ReactNode; color: string }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

const DashboardOverview = () => {
  const [courseCount, setCourseCount] = useState<number>(0);
  const [courseStatusData, setCourseStatusData] = useState<{ name: string; count: number; }[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const count = await getCoursesCount();
      setCourseCount(count);
      
      // Update course status data with real count
      setCourseStatusData([
        { name: 'Published', count: count },
        { name: 'Draft', count: 3 },
        { name: 'Archived', count: 2 },
      ]);
    };
    
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Users" 
          value="1,542" 
          icon={<Users className="h-6 w-6 text-white" />} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Active Courses" 
          value={courseCount || 18} 
          icon={<BookOpen className="h-6 w-6 text-white" />} 
          color="bg-green-500" 
        />
        <StatCard 
          title="Hours of Content" 
          value="256" 
          icon={<Clock className="h-6 w-6 text-white" />} 
          color="bg-purple-500" 
        />
        <StatCard 
          title="Revenue" 
          value="$12,489" 
          icon={<DollarSign className="h-6 w-6 text-white" />} 
          color="bg-amber-500" 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Registrations (Last 7 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userRegistrationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Course Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseStatusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" /> System Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-medium">3 New Courses Pending Approval</h3>
              <p className="text-sm text-muted-foreground">Submitted on {new Date().toLocaleDateString()}</p>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-medium">Storage Usage: 68% (85GB of 125GB)</h3>
              <p className="text-sm text-muted-foreground">Upgrade storage or clean up unused files</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
