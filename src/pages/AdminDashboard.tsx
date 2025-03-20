
import { useState } from "react";
import Header from "@/components/Header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DashboardOverview from "@/components/admin/DashboardOverview";
import UserManagement from "@/components/admin/UserManagement";
import CourseManagement from "@/components/admin/CourseManagement";
import ContentLibrary from "@/components/admin/ContentLibrary";
import Analytics from "@/components/admin/Analytics";
import Communication from "@/components/admin/Communication";
import PaymentManagement from "@/components/admin/PaymentManagement";
import Settings from "@/components/admin/Settings";
import RoleAccess from "@/components/admin/RoleAccess";
import HelpSupport from "@/components/admin/HelpSupport";
import UserGroups from "@/components/admin/UserGroups";
import { useAuth } from "@/context/AuthContext";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { hasPermission } = useAuth();

  const tabs = [
    { id: "overview", label: "Dashboard", component: <DashboardOverview />, permission: "view_dashboard" },
    { id: "users", label: "Users", component: <UserManagement />, permission: "manage_users" },
    { id: "groups", label: "User Groups", component: <UserGroups />, permission: "manage_groups" },
    { id: "courses", label: "Courses", component: <CourseManagement />, permission: "manage_courses" },
    { id: "content", label: "Content Library", component: <ContentLibrary />, permission: "manage_content" },
    { id: "analytics", label: "Analytics", component: <Analytics />, permission: "view_analytics" },
    { id: "communication", label: "Communication", component: <Communication />, permission: "send_communications" },
    { id: "payments", label: "Payments", component: <PaymentManagement />, permission: "manage_payments" },
    { id: "settings", label: "Settings", component: <Settings />, permission: "manage_settings" },
    { id: "roles", label: "Access Control", component: <RoleAccess />, permission: "manage_roles" },
    { id: "help", label: "Help & Support", component: <HelpSupport />, permission: null },
  ];

  // Filter tabs based on permissions
  const authorizedTabs = tabs.filter(tab => 
    tab.permission === null || hasPermission(tab.permission)
  );

  // If current active tab is not authorized, default to the first authorized tab
  if (authorizedTabs.length > 0 && !authorizedTabs.some(tab => tab.id === activeTab)) {
    setActiveTab(authorizedTabs[0].id);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
        
        {authorizedTabs.length === 0 ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You don't have permission to access any admin features. Please contact your system administrator.
            </AlertDescription>
          </Alert>
        ) : (
          <Tabs 
            defaultValue={authorizedTabs[0]?.id || "overview"} 
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <div className="bg-white rounded-lg border shadow-sm p-1">
              <TabsList className="w-full flex justify-start overflow-x-auto">
                {authorizedTabs.map(tab => (
                  <TabsTrigger key={tab.id} value={tab.id}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            {authorizedTabs.map(tab => (
              <TabsContent key={tab.id} value={tab.id}>
                {tab.component}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
