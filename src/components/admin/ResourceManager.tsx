
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, X, Download, File, FileArchive, FileImage, FileVideo } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ResourceUploader, { Resource } from "@/components/ResourceUploader";

interface ResourceManagerProps {
  courseId: string;
}

const ResourceManager = ({ courseId }: ResourceManagerProps) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Mock data loading
    const loadMockResources = async () => {
      setLoading(true);
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock resources
      const mockResources: Resource[] = [
        {
          id: '1',
          name: 'Course Syllabus',
          type: 'application/pdf',
          size: 1024 * 1024 * 2.5, // 2.5MB
          url: '#',
          dateAdded: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Lecture Slides',
          type: 'application/pptx',
          size: 1024 * 1024 * 5.8, // 5.8MB
          url: '#',
          dateAdded: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Demo Video',
          type: 'video/mp4',
          size: 1024 * 1024 * 15.3, // 15.3MB
          url: '#',
          dateAdded: new Date().toISOString()
        }
      ];
      
      setResources(mockResources);
      setLoading(false);
    };
    
    loadMockResources();
  }, [courseId]);

  const handleDeleteResource = (resourceId: string) => {
    // Filter out the deleted resource
    setResources(resources.filter(resource => resource.id !== resourceId));
    
    toast({
      title: "Resource deleted",
      description: "The resource has been removed",
    });
  };

  const handleAddResource = (newResource: Resource) => {
    setResources([...resources, newResource]);
  };

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return <FileImage className="w-5 h-5" />;
    if (type.includes('video')) return <FileVideo className="w-5 h-5" />;
    if (type.includes('pdf')) return <FileText className="w-5 h-5" />;
    if (type.includes('zip') || type.includes('rar')) return <FileArchive className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Course Resources</h2>
        <ResourceUploader courseId={courseId} onResourceAdded={handleAddResource} />
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading resources...</p>
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-muted-foreground">No resources added yet.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Add downloadable materials for your students.
          </p>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Attached Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {resources.map((resource) => (
                <div 
                  key={resource.id}
                  className="flex items-center justify-between p-3 rounded-md border bg-card hover:bg-accent/10 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-md">
                      {getFileIcon(resource.type)}
                    </div>
                    <div>
                      <p className="font-medium">{resource.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(resource.size)} • {new Date(resource.dateAdded).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" asChild>
                      <a href={resource.url} target="_blank" rel="noopener noreferrer" download>
                        <Download className="w-4 h-4" />
                      </a>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteResource(resource.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResourceManager;
