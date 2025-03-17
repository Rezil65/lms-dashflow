
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import FileUploader from "@/components/FileUploader";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ResourceUploaderProps {
  courseId: number;
  onResourceAdded: (resource: Resource) => void;
}

export interface Resource {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  dateAdded: string;
}

const ResourceUploader = ({ courseId, onResourceAdded }: ResourceUploaderProps) => {
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [resourceName, setResourceName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);
  
  const handleFileUploaded = (file: File) => {
    setCurrentFile(file);
    if (!resourceName) {
      setResourceName(file.name);
    }
  };
  
  const handleUploadComplete = () => {
    if (!currentFile || !resourceName.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a file and name for your resource",
        variant: "destructive"
      });
      return;
    }
    
    setUploading(true);
    
    // In a real app, this would upload to a server
    // For now, we'll simulate it with a timeout
    setTimeout(() => {
      const newResource: Resource = {
        id: Math.random().toString(36).substring(2, 9),
        name: resourceName,
        type: currentFile.type || getFileTypeFromExtension(currentFile.name),
        size: currentFile.size,
        url: URL.createObjectURL(currentFile),
        dateAdded: new Date().toISOString()
      };
      
      // Save to localStorage
      const storageKey = `course-${courseId}-resources`;
      const existingResources = JSON.parse(localStorage.getItem(storageKey) || "[]");
      const updatedResources = [...existingResources, newResource];
      localStorage.setItem(storageKey, JSON.stringify(updatedResources));
      
      onResourceAdded(newResource);
      
      setUploading(false);
      setCurrentFile(null);
      setResourceName("");
      setOpen(false);
      
      toast({
        title: "Resource Added",
        description: `${resourceName} has been added to course resources.`,
      });
    }, 1500);
  };
  
  const getFileTypeFromExtension = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    
    if (['pdf'].includes(ext)) return 'application/pdf';
    if (['doc', 'docx'].includes(ext)) return 'application/msword';
    if (['xls', 'xlsx'].includes(ext)) return 'application/vnd.ms-excel';
    if (['ppt', 'pptx'].includes(ext)) return 'application/vnd.ms-powerpoint';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return `image/${ext}`;
    if (['mp4', 'webm', 'ogg'].includes(ext)) return `video/${ext}`;
    if (['html', 'htm'].includes(ext)) return 'text/html';
    if (['csv'].includes(ext)) return 'text/csv';
    
    return 'application/octet-stream';
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Plus className="h-3 w-3" />
          <span>Add Resource</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Course Resource</DialogTitle>
          <DialogDescription>
            Upload documents, videos, or other resources for your course.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="resource-name">Resource Name</Label>
            <Input
              id="resource-name"
              value={resourceName}
              onChange={(e) => setResourceName(e.target.value)}
              placeholder="Enter a name for this resource"
            />
          </div>
          
          <FileUploader onFileUploaded={handleFileUploaded} />
        </div>
        
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleUploadComplete}
            disabled={!currentFile || !resourceName.trim() || uploading}
          >
            {uploading ? "Uploading..." : "Add to Resources"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceUploader;
