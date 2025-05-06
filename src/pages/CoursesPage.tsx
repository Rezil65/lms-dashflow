
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CoursesPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  // Mock course data
  const courses = [
    {
      id: "course1",
      title: "Introduction to Bread Making",
      description: "Learn the fundamentals of bread making, from mixing to baking perfect loaves.",
      category: "bread",
      level: "beginner",
      imageUrl: "/public/lovable-uploads/fafbd30f-cf32-4df0-b591-c13cfc422278.png",
      enrolled: true,
      progress: 65
    },
    {
      id: "course2",
      title: "Advanced Pastry Techniques",
      description: "Master complex pastry techniques used by professional pastry chefs.",
      category: "pastry",
      level: "advanced",
      imageUrl: "/public/lovable-uploads/79b57a48-41b3-47a6-aba3-8cf20a45a438.png",
      enrolled: true,
      progress: 32
    },
    {
      id: "course3",
      title: "Cake Decorating Fundamentals",
      description: "Explore essential cake decorating techniques to create beautiful desserts.",
      category: "cakes",
      level: "intermediate",
      imageUrl: "/public/lovable-uploads/79b57a48-41b3-47a6-aba3-8cf20a45a438.png",
      enrolled: true,
      progress: 90
    },
    {
      id: "course4",
      title: "Artisanal Sourdough Bread",
      description: "Create and maintain your own sourdough starter and bake artisanal loaves.",
      category: "bread",
      level: "intermediate",
      imageUrl: "/public/lovable-uploads/fafbd30f-cf32-4df0-b591-c13cfc422278.png",
      enrolled: false,
      progress: 0
    },
    {
      id: "course5",
      title: "French Pastry Mastery",
      description: "Learn to make classic French pastries like croissants, éclairs, and more.",
      category: "pastry",
      level: "advanced",
      imageUrl: "/public/lovable-uploads/79b57a48-41b3-47a6-aba3-8cf20a45a438.png",
      enrolled: false,
      progress: 0
    },
    {
      id: "course6",
      title: "Wedding Cake Design",
      description: "Design and create stunning multi-tier wedding cakes with professional finishes.",
      category: "cakes",
      level: "advanced",
      imageUrl: "/public/lovable-uploads/79b57a48-41b3-47a6-aba3-8cf20a45a438.png",
      enrolled: false,
      progress: 0
    }
  ];

  // Filter courses based on search query, category, and tab
  const filteredCourses = courses.filter(course => {
    // Filter by search
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by category
    const matchesCategory = categoryFilter === "all" || course.category === categoryFilter;
    
    // Filter by tab (enrollment status)
    const matchesTab = activeTab === "all" || 
                      (activeTab === "enrolled" && course.enrolled) || 
                      (activeTab === "available" && !course.enrolled);
    
    return matchesSearch && matchesCategory && matchesTab;
  });

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="text-muted-foreground mt-1">Browse our comprehensive baking courses</p>
        </header>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <Input
            placeholder="Search courses..."
            className="max-w-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          <div className="flex gap-4">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="bread">Bread</SelectItem>
                <SelectItem value="pastry">Pastry</SelectItem>
                <SelectItem value="cakes">Cakes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="ml-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All Courses</TabsTrigger>
                <TabsTrigger value="enrolled">My Courses</TabsTrigger>
                <TabsTrigger value="available">Available Courses</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.length > 0 ? (
            filteredCourses.map(course => (
              <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow card-hover">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={course.imageUrl} 
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105" 
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-lg">{course.title}</h3>
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                      {course.level}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  {course.enrolled ? (
                    <Button 
                      className="w-full button-3d"
                      onClick={() => navigate(`/course/${course.id}/learn`)}
                    >
                      Continue Learning
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full button-3d"
                      onClick={() => navigate(`/course/${course.id}`)}
                    >
                      View Course
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-muted-foreground">No courses found matching your criteria.</p>
              <Button 
                variant="link" 
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("all");
                  setActiveTab("all");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CoursesPage;
