
import { useState } from "react";
import { UploadCloud, X, FileText, Image, Video, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface FileUploaderProps {
  onFileUploaded?: (file: File) => void;
  buttonText?: string;
  maxSize?: number; // in MB
  acceptedFileTypes?: string[];
}

const FileUploader = ({ 
  onFileUploaded, 
  buttonText = "Browse Files",
  maxSize = 10, // Default 10MB
  acceptedFileTypes = ["image/*", "video/*", ".pdf", ".doc", ".docx", ".html", ".csv", ".xls", ".xlsx"]
}: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `File size should not exceed ${maxSize}MB.`,
        variant: "destructive"
      });
      return false;
    }
    
    // Check file type if acceptedFileTypes is provided
    if (acceptedFileTypes.length > 0) {
      const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;
      const isAcceptedType = acceptedFileTypes.some(type => {
        if (type.startsWith('.')) {
          // Handle extension match
          return fileExt === type.toLowerCase();
        } else if (type.includes('*')) {
          // Handle wildcard MIME type match
          const [category] = type.split('/');
          return file.type.startsWith(category);
        } else {
          // Handle exact MIME type match
          return file.type === type;
        }
      });
      
      if (!isAcceptedType) {
        toast({
          title: "Invalid file type",
          description: "Please upload a file with an allowed format.",
          variant: "destructive"
        });
        return false;
      }
    }
    
    return true;
  };
  
  const processFile = (file: File) => {
    if (!validateFile(file)) {
      return;
    }
    
    setSelectedFile(file);
    
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    
    if (file.type.startsWith('image/')) {
      setFileType('image');
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('video/')) {
      setFileType('video');
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else if (fileExt === 'pdf') {
      setFileType('pdf');
      setPreview(null);
    } else {
      setFileType('document');
      setPreview(null);
    }
    
    if (onFileUploaded) {
      onFileUploaded(file);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
      
      if (validateFile(file)) {
        toast({
          title: "File Added",
          description: `${file.name} has been added.`,
        });
      }
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
      
      if (validateFile(file)) {
        toast({
          title: "File Added",
          description: `${file.name} has been added.`,
        });
      }
    }
  };
  
  const handleRemoveFile = () => {
    if (preview && (fileType === 'image' || fileType === 'video')) {
      URL.revokeObjectURL(preview);
    }
    setSelectedFile(null);
    setPreview(null);
    setFileType(null);
  };
  
  const getFileIcon = () => {
    switch (fileType) {
      case 'image':
        return <Image className="h-12 w-12 text-muted-foreground" />;
      case 'video':
        return <Video className="h-12 w-12 text-muted-foreground" />;
      case 'pdf':
        return <FileText className="h-12 w-12 text-muted-foreground" />;
      default:
        return <File className="h-12 w-12 text-muted-foreground" />;
    }
  };
  
  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? 'border-primary bg-primary/5' : 'border-border'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <UploadCloud className="h-12 w-12 text-muted-foreground" />
            <div>
              <p className="text-lg font-medium">Drag and drop to upload</p>
              <p className="text-sm text-muted-foreground mt-1">
                or click to browse files
              </p>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Supports images, videos, documents (max {maxSize}MB)
            </div>
            <Button variant="outline" size="sm" className="mt-2" asChild>
              <label className="cursor-pointer">
                {buttonText}
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept={acceptedFileTypes.join(',')}
                />
              </label>
            </Button>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {fileType === 'image' && preview ? (
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="w-16 h-16 object-cover rounded"
                />
              ) : fileType === 'video' && preview ? (
                <video 
                  src={preview}
                  className="w-16 h-16 object-cover rounded"
                  controls
                />
              ) : (
                getFileIcon()
              )}
              <div>
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleRemoveFile}
              className="text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
