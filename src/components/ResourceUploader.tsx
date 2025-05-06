
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import FileUploader from "@/components/FileUploader";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

interface ResourceUploaderProps {
  courseId: string;
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
  
  const handleUploadComplete = async () => {
    if (!currentFile || !resourceName.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a file and name for your resource",
        variant: "destructive"
      });
      return;
    }
    
    setUploading(true);
    
    try {
      // Get the current authenticated user
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error("You must be logged in to upload resources");
      }

      // Upload file to Supabase Storage
      const fileExt = currentFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `${courseId}/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('course_resources')
        .upload(filePath, currentFile);
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('course_resources')
        .getPublicUrl(filePath);
      
      // Save resource metadata to the resources table
      const { data: resourceData, error: resourceError } = await supabase
        .from('resources')
        .insert({
          course_id: courseId,
          name: resourceName,
          type: currentFile.type || getFileTypeFromExtension(currentFile.name),
          size: currentFile.size,
          url: urlData.publicUrl,
          created_by: userData.user.id
        })
        .select()
        .single();
        
      if (resourceError) {
        throw resourceError;
      }
      
      // Format the resource for the callback
      const newResource: Resource = {
        id: resourceData.id,
        name: resourceData.name,
        type: resourceData.type,
        size: resourceData.size,
        url: resourceData.url,
        dateAdded: resourceData.created_at
      };
      
      onResourceAdded(newResource);
      
      setUploading(false);
      setCurrentFile(null);
      setResourceName("");
      setOpen(false);
      
      toast({
        title: "Resource uploaded",
        description: "Your resource has been uploaded successfully"
      });
    } catch (error: any) {
      console.error('Error uploading resource:', error);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive"
      });
      setUploading(false);
    }
  };
  
  const getFileTypeFromExtension = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'];
    const documentExts = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];
    const videoExts = ['mp4', 'webm', 'mov', 'avi'];
    const audioExts = ['mp3', 'wav', 'ogg', 'flac'];
    
    if (imageExts.includes(ext)) return 'image';
    if (documentExts.includes(ext)) return 'document';
    if (videoExts.includes(ext)) return 'video';
    if (audioExts.includes(ext)) return 'audio';
    
    return 'other';
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" /> Add Resource
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Resource</DialogTitle>
          <DialogDescription>
            Upload a file to add as a course resource
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
          
          <div className="space-y-2">
            <Label>Resource File</Label>
            <FileUploader onFileUploaded={handleFileUploaded} />
          </div>
          
          {currentFile && (
            <div className="text-sm">
              <p>Selected file: {currentFile.name}</p>
              <p>Size: {Math.round(currentFile.size / 1024)} KB</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleUploadComplete} 
            disabled={!currentFile || uploading} 
            className="gap-2"
          >
            {uploading ? 'Uploading...' : (
              <>
                <Upload className="h-4 w-4" /> Upload Resource
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceUploader;
