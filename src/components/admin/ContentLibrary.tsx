
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Upload, 
  Search, 
  Filter, 
  FileText, 
  File, 
  Image as ImageIcon, 
  Video, 
  FileSpreadsheet,
  MoreVertical
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Resource } from "@/components/ResourceUploader";

// Mock library items
const mockLibraryItems: Resource[] = [
  { id: "1", name: "Introduction to React.pdf", type: "application/pdf", size: 2500000, url: "#", dateAdded: "2023-05-01T10:30:00Z" },
  { id: "2", name: "UI Design Principles.docx", type: "application/msword", size: 1200000, url: "#", dateAdded: "2023-05-02T14:45:00Z" },
  { id: "3", name: "Course Banner.jpg", type: "image/jpeg", size: 850000, url: "#", dateAdded: "2023-05-03T09:15:00Z" },
  { id: "4", name: "Intro Video.mp4", type: "video/mp4", size: 15000000, url: "#", dateAdded: "2023-05-04T16:20:00Z" },
  { id: "5", name: "Student Data.csv", type: "text/csv", size: 500000, url: "#", dateAdded: "2023-05-05T11:10:00Z" },
];

// Get library items from localStorage for all courses
const getLibraryItems = (): Resource[] => {
  // Get all courses that might have resources
  const allItems: Resource[] = [];
  
  // Try to find resources in localStorage for any course
  for (let i = 1; i < 1000; i++) {
    const key = `course-${i}-resources`;
    const resources = localStorage.getItem(key);
    if (resources) {
      try {
        const parsedResources: Resource[] = JSON.parse(resources);
        allItems.push(...parsedResources);
      } catch (e) {
        console.error("Failed to parse resources", e);
      }
    }
  }
  
  // If no items found in localStorage, use mock data
  return allItems.length > 0 ? allItems : mockLibraryItems;
};

const getFileIcon = (type: string) => {
  if (type.includes("pdf")) return <FileText className="h-8 w-8 text-red-500" />;
  if (type.includes("word") || type.includes("doc")) return <FileText className="h-8 w-8 text-blue-500" />;
  if (type.includes("image")) return <ImageIcon className="h-8 w-8 text-purple-500" />;
  if (type.includes("video")) return <Video className="h-8 w-8 text-green-500" />;
  if (type.includes("csv") || type.includes("excel") || type.includes("spreadsheet")) 
    return <FileSpreadsheet className="h-8 w-8 text-emerald-500" />;
  return <File className="h-8 w-8 text-gray-500" />;
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
};

const ContentLibrary = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const libraryItems = getLibraryItems();
  
  // Filter resources based on search query
  const filteredItems = libraryItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Content Library</h2>
      
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex gap-2">
          <Button className="gap-1">
            <Upload className="h-4 w-4" />
            Upload Resources
          </Button>
          <Button variant="outline" className="gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search resources..." 
            className="pl-8" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Resources</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredItems.map(item => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="p-6 flex justify-center items-center bg-muted h-32">
                    {getFileIcon(item.type)}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1 truncate max-w-[80%]">
                        <h3 className="font-medium text-sm truncate" title={item.name}>
                          {item.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(item.size)}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Preview</DropdownMenuItem>
                          <DropdownMenuItem>Download</DropdownMenuItem>
                          <DropdownMenuItem>Rename</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Added on {new Date(item.dateAdded).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No resources found</h3>
              <p className="text-muted-foreground mb-4">
                Upload some resources to see them here
              </p>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload Resource
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentLibrary;
