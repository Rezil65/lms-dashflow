
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, FileText, Video, Link as LinkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CourseResourcesProps {
  courseId: string;
}

const CourseResources = ({ courseId }: CourseResourcesProps) => {
  // Mock resources data for display purposes
  const resources = [
    {
      id: "1",
      name: "Course Syllabus.pdf",
      type: "pdf",
      size: "1.2 MB",
      downloadUrl: "#",
      category: "Document"
    },
    {
      id: "2",
      name: "React Project Starter Files",
      type: "zip",
      size: "3.5 MB",
      downloadUrl: "#",
      category: "Code"
    },
    {
      id: "3",
      name: "Supplementary Reading Material",
      type: "link",
      url: "https://reactjs.org/docs/getting-started.html",
      category: "External Link"
    },
    {
      id: "4",
      name: "Module 1 Slides",
      type: "pptx",
      size: "5.7 MB",
      downloadUrl: "#",
      category: "Presentation"
    },
    {
      id: "5",
      name: "Bonus Video: Advanced Techniques",
      type: "video",
      duration: "15:23",
      url: "https://example.com/video",
      category: "Video"
    }
  ];

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "pdf":
      case "pptx":
      case "doc":
      case "docx":
        return <FileText className="h-5 w-5" />;
      case "video":
        return <Video className="h-5 w-5" />;
      case "link":
        return <LinkIcon className="h-5 w-5" />;
      default:
        return <FileDown className="h-5 w-5" />;
    }
  };

  // Group resources by category
  const groupedResources = resources.reduce((groups, resource) => {
    const category = resource.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(resource);
    return groups;
  }, {} as Record<string, typeof resources>);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Course Resources</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(groupedResources).length > 0 ? (
            Object.entries(groupedResources).map(([category, items]) => (
              <div key={category} className="mb-6 last:mb-0">
                <h3 className="font-medium text-sm mb-3">{category}</h3>
                <div className="space-y-2">
                  {items.map((resource) => (
                    <div
                      key={resource.id}
                      className="border rounded-md p-3 flex items-center justify-between hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-md">
                          {getResourceIcon(resource.type)}
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{resource.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs font-normal">
                              {resource.type.toUpperCase()}
                            </Badge>
                            {resource.size && (
                              <span className="text-xs text-muted-foreground">
                                {resource.size}
                              </span>
                            )}
                            {resource.duration && (
                              <span className="text-xs text-muted-foreground">
                                {resource.duration}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => 
                          resource.type === "link" 
                            ? window.open(resource.url, "_blank", "noopener,noreferrer")
                            : window.open(resource.downloadUrl, "_blank", "noopener,noreferrer")
                        }
                      >
                        {resource.type === "link" ? "Visit" : "Download"}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No resources available for this course yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseResources;
