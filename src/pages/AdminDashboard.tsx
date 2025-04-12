
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
import CourseFeedEditor from "@/components/admin/CourseFeedEditor";
import { useAuth } from "@/context/AuthContext";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FeedPost } from "@/components/CourseFeeds";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { hasPermission } = useAuth();

  const tabs = [
    { id: "overview", label: "Dashboard", component: <DashboardOverview />, permission: "view_dashboard" },
    { id: "users", label: "Users", component: <UserManagement />, permission: "manage_users" },
    { id: "groups", label: "User Groups", component: <UserGroups />, permission: "manage_groups" },
    { id: "courses", label: "Courses", component: <CourseManagement />, permission: "manage_courses" },
    { id: "content", label: "Content Library", component: <ContentLibrary />, permission: "manage_content" },
    { id: "feeds", label: "Course Feeds", component: <CourseFeedManager />, permission: "manage_feeds" },
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
              <TabsContent key={tab.id} value={tab.id} className="tab-transition">
                {tab.component}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </main>
    </div>
  );
};

// Course Feed Manager Component
const CourseFeedManager = () => {
  const [feeds, setFeeds] = useState<FeedPost[]>([]);
  const [editingFeed, setEditingFeed] = useState<FeedPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // Mock data for initial feeds
  const mockFeeds: FeedPost[] = [
    {
      id: "feed1",
      title: "Introduction to React Hooks",
      content: "Today we'll be diving into React Hooks and how they can simplify your component logic. Make sure to check out the example repository to follow along!",
      author: {
        name: "Sarah Johnson",
        avatar: "",
      },
      timestamp: "2 hours ago",
      tags: ["react", "javascript", "frontend"],
      likes: 24,
      comments: 5
    },
    {
      id: "feed2",
      title: "Understanding TypeScript Generics",
      content: "Generics are one of the most powerful features of TypeScript. In this post, we'll explore how to use them effectively in your applications.",
      author: {
        name: "Michael Chen",
        avatar: "",
      },
      timestamp: "Yesterday",
      tags: ["typescript", "javascript", "programming"],
      likes: 42,
      comments: 8
    },
    {
      id: "feed3",
      title: "CSS Grid vs Flexbox: When to Use Each",
      content: "A comparison of CSS Grid and Flexbox layout techniques with practical examples for different UI scenarios.",
      author: {
        name: "Emma Rodriguez",
        avatar: "",
      },
      timestamp: "3 days ago",
      tags: ["css", "web-design", "frontend"],
      likes: 36,
      comments: 12
    }
  ];

  useEffect(() => {
    // In a real app, fetch feeds from an API
    setFeeds(mockFeeds);
  }, []);

  const handleSaveFeed = (feed: FeedPost) => {
    if (editingFeed) {
      // Update existing feed
      setFeeds(feeds.map(f => f.id === feed.id ? feed : f));
      setEditingFeed(null);
    } else {
      // Add new feed
      setFeeds([feed, ...feeds]);
      setIsCreating(false);
    }
  };

  const handleEditFeed = (feed: FeedPost) => {
    setEditingFeed(feed);
    setIsCreating(false);
  };

  const handleDeleteFeed = (feedId: string) => {
    setFeeds(feeds.filter(f => f.id !== feedId));
  };

  const handleCreateFeed = () => {
    setEditingFeed(null);
    setIsCreating(true);
  };

  const handleCancel = () => {
    setEditingFeed(null);
    setIsCreating(false);
  };

  if (isCreating || editingFeed) {
    return (
      <CourseFeedEditor 
        initialFeed={editingFeed || undefined} 
        onSave={handleSaveFeed}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Course Feed Management</h2>
        <Button onClick={handleCreateFeed}>Create New Feed Post</Button>
      </div>

      {feeds.length === 0 ? (
        <div className="text-center py-10 border rounded-lg bg-muted/10">
          <p className="text-muted-foreground mb-4">No feed posts available.</p>
          <Button onClick={handleCreateFeed}>Create First Post</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {feeds.map(feed => (
            <div key={feed.id} className="bg-white p-4 rounded-lg border shadow-sm feed-post">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{feed.title}</h3>
                <div className="text-xs text-muted-foreground">{feed.timestamp}</div>
              </div>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{feed.content}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {feed.tags.map(tag => (
                  <div key={tag} className="text-xs bg-secondary/50 px-2 py-0.5 rounded-full">
                    #{tag}
                  </div>
                ))}
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEditFeed(feed)}>
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDeleteFeed(feed.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
