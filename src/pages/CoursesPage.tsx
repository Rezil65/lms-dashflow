
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, BookOpen, Clock, ChevronRight, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Course {
  id: string;
  title: string;
  imageUrl: string;
  instructor: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  rating: number;
  enrolled: number;
  price?: number;
  category: string;
}

const CoursesPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  
  // Mock courses data
  const courses: Course[] = [
    {
      id: "course1",
      title: "Introduction to Bread Making",
      imageUrl: "/public/lovable-uploads/fafbd30f-cf32-4df0-b591-c13cfc422278.png",
      instructor: "Chef Michael",
      duration: "8h 30m",
      level: "Beginner",
      rating: 4.7,
      enrolled: 1245,
      category: "Baking"
    },
    {
      id: "course2",
      title: "Advanced Pastry Techniques",
      imageUrl: "/public/lovable-uploads/79b57a48-41b3-47a6-aba3-8cf20a45a438.png",
      instructor: "Chef Lisa",
      duration: "12h 15m",
      level: "Advanced",
      rating: 4.9,
      enrolled: 872,
      category: "Pastry"
    },
    {
      id: "course3",
      title: "Cake Decorating Fundamentals",
      imageUrl: "/public/lovable-uploads/79b57a48-41b3-47a6-aba3-8cf20a45a438.png",
      instructor: "Chef David",
      duration: "6h 45m",
      level: "Intermediate",
      rating: 4.5,
      enrolled: 1563,
      category: "Decorating"
    },
    {
      id: "course4",
      title: "Artisanal Sourdough Bread",
      imageUrl: "/public/lovable-uploads/fafbd30f-cf32-4df0-b591-c13cfc422278.png",
      instructor: "Chef Sarah",
      duration: "9h 20m",
      level: "Intermediate",
      rating: 4.8,
      enrolled: 943,
      category: "Baking"
    },
    {
      id: "course5",
      title: "French Patisserie Masterclass",
      imageUrl: "/public/lovable-uploads/79b57a48-41b3-47a6-aba3-8cf20a45a438.png",
      instructor: "Chef Pierre",
      duration: "15h 30m",
      level: "Advanced",
      rating: 4.9,
      enrolled: 734,
      category: "Pastry"
    },
    {
      id: "course6",
      title: "Gluten-Free Baking Essentials",
      imageUrl: "/public/lovable-uploads/fafbd30f-cf32-4df0-b591-c13cfc422278.png",
      instructor: "Chef Emma",
      duration: "7h 15m",
      level: "Beginner",
      rating: 4.6,
      enrolled: 1023,
      category: "Baking"
    }
  ];

  const categories = ["All", "Baking", "Pastry", "Decorating"];
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    let result = courses;
    
    // Filter by search query
    if (searchQuery) {
      result = result.filter(course => 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by category
    if (activeCategory !== "All") {
      result = result.filter(course => course.category === activeCategory);
    }
    
    setFilteredCourses(result);
  }, [searchQuery, activeCategory]);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
  };

  const handleCourseClick = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };
  
  const getLevelColor = (level: "Beginner" | "Intermediate" | "Advanced") => {
    switch(level) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-blue-100 text-blue-800";
      case "Advanced": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Courses</h1>
            <p className="text-muted-foreground">Browse our extensive library of courses</p>
          </div>
          
          <div className="flex items-center mt-4 md:mt-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search courses..." 
                className="w-full md:w-[300px] pl-10 button-3d"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button variant="outline" className="ml-2 button-3d">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
        
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(category => (
            <Badge 
              key={category} 
              variant={activeCategory === category ? "default" : "outline"}
              className={`
                py-2 px-4 cursor-pointer hover:scale-105 transition-transform
                ${activeCategory === category ? 'bg-primary text-white' : 'hover:bg-primary/10'}
              `}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
        
        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <Card key={course.id} className="overflow-hidden hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 transform-gpu hover:-translate-y-1 cursor-pointer">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={course.imageUrl}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                />
              </div>
              
              <CardContent className="p-4" onClick={() => handleCourseClick(course.id)}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary transition-colors">{course.title}</h3>
                  <Badge className={getLevelColor(course.level)}>{course.level}</Badge>
                </div>
                
                <p className="text-muted-foreground text-sm mb-2">By {course.instructor}</p>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.duration}
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {course.enrolled} students
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" fill="currentColor" />
                    {course.rating}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <Button variant="outline" className="w-full button-3d" onClick={() => handleCourseClick(course.id)}>
                  View Course <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No courses found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CoursesPage;
