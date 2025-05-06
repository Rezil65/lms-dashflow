
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  File,
  FileText,
  FileImage,
  FileArchive,
  Link as LinkIcon,
  Trash,
  Upload,
  Plus,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface ResourceManagerProps {
  courseId: string;
}

type Resource = {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  created_at: string;
};

const ResourceManager = ({ courseId }: ResourceManagerProps) => {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
  const [linkData, setLinkData] = useState({ name: "", url: "" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, [courseId]);

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("course_id", courseId);

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error("Error fetching resources:", error);
      toast.error("Failed to load resources");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // For a real implementation, you'd upload this to storage first
        // For now, let's just simulate recording the file info
        
        const newResource = {
          name: file.name,
          type: file.type,
          size: file.size,
          url: URL.createObjectURL(file), // In a real app, this would be the storage URL
          course_id: courseId,
          created_by: user?.id
        };
        
        const { error } = await supabase
          .from("resources")
          .insert({
            course_id: courseId,
            name: file.name,
            type: file.type,
            size: file.size,
            url: `mock-url-for-${file.name}`, // In a real app, this would be the storage URL
            created_by: user?.id
          });
        
        if (error) throw error;
      }
      
      toast.success("Resources uploaded successfully");
      fetchResources();
    } catch (error) {
      console.error("Error uploading resources:", error);
      toast.error("Failed to upload resources");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddLink = async () => {
    if (!linkData.name || !linkData.url) return;
    
    try {
      const { error } = await supabase
        .from("resources")
        .insert({
          course_id: courseId,
          name: linkData.name,
          type: "link",
          size: 0,
          url: linkData.url,
          created_by: user?.id
        });
      
      if (error) throw error;
      
      toast.success("Link added successfully");
      setLinkData({ name: "", url: "" });
      setIsAddLinkOpen(false);
      fetchResources();
    } catch (error) {
      console.error("Error adding link:", error);
      toast.error("Failed to add link");
    }
  };

  const handleDeleteResource = async (resourceId: string) => {
    try {
      const { error } = await supabase
        .from("resources")
        .delete()
        .eq("id", resourceId);
      
      if (error) throw error;
      
      setResources(resources.filter(resource => resource.id !== resourceId));
      toast.success("Resource deleted successfully");
    } catch (error) {
      console.error("Error deleting resource:", error);
      toast.error("Failed to delete resource");
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <FileImage className="h-5 w-5" />;
    if (type.includes("pdf")) return <FileText className="h-5 w-5" />;
    if (type.includes("zip") || type.includes("archive")) return <FileArchive className="h-5 w-5" />;
    if (type === "link") return <LinkIcon className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Course Resources</CardTitle>
          <div className="flex gap-2">
            <Dialog open={isAddLinkOpen} onOpenChange={setIsAddLinkOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <LinkIcon className="mr-2 h-4 w-4" /> Add Link
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add External Link</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="link-name">Link Name</Label>
                    <Input
                      id="link-name"
                      value={linkData.name}
                      onChange={(e) => setLinkData({ ...linkData, name: e.target.value })}
                      placeholder="e.g. Documentation Reference"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="link-url">URL</Label>
                    <Input
                      id="link-url"
                      value={linkData.url}
                      onChange={(e) => setLinkData({ ...linkData, url: e.target.value })}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddLinkOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddLink}>Add Link</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <div className="relative">
              <Input
                type="file"
                multiple
                className="absolute inset-0 opacity-0 w-full cursor-pointer"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
              <Button>
                <Upload className="mr-2 h-4 w-4" /> Upload Files
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">Loading resources...</p>
            </div>
          ) : resources.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resources.map((resource) => (
                  <TableRow key={resource.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getFileIcon(resource.type)}
                        <span>{resource.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{resource.type === "link" ? "External Link" : resource.type.split("/")[1]?.toUpperCase() || resource.type}</TableCell>
                    <TableCell>{resource.type === "link" ? "-" : formatSize(resource.size)}</TableCell>
                    <TableCell>{new Date(resource.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteResource(resource.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-12 text-center">
              <div className="rounded-full bg-muted p-3 mx-auto w-fit">
                <File className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-medium">No resources yet</h3>
              <p className="mt-2 text-muted-foreground max-w-xs mx-auto">
                Upload files or add links to provide additional materials for your course.
              </p>
              <div className="flex gap-2 justify-center mt-6">
                <Button variant="outline" onClick={() => setIsAddLinkOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Link
                </Button>
                <div className="relative">
                  <Input
                    type="file"
                    multiple
                    className="absolute inset-0 opacity-0 w-full cursor-pointer"
                    onChange={handleFileUpload}
                  />
                  <Button>
                    <Upload className="mr-2 h-4 w-4" /> Upload Files
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResourceManager;
