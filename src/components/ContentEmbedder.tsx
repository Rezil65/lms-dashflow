
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, FileText, Video, Code, Link as LinkIcon, Upload, FileCode } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import FileUploader from "@/components/FileUploader";
import { toast } from "@/hooks/use-toast";

export interface EmbedData {
  url: string;
  width?: string;
  height?: string;
  title?: string;
  type?: string;
  htmlContent?: string;
  scormVersion?: string;
}

export interface ContentEmbedderProps {
  initialEmbedData?: EmbedData;
  onEmbedDataChange?: (embedData: EmbedData) => void;
  onEmbed?: (embedData: EmbedData) => void; 
}

const ContentEmbedder = ({ initialEmbedData, onEmbedDataChange, onEmbed }: ContentEmbedderProps) => {
  const [embedUrl, setEmbedUrl] = useState<string>(initialEmbedData?.url || "");
  const [embedTitle, setEmbedTitle] = useState<string>(initialEmbedData?.title || "");
  const [embedWidth, setEmbedWidth] = useState<string>(initialEmbedData?.width || "100%");
  const [embedHeight, setEmbedHeight] = useState<string>(initialEmbedData?.height || "315");
  const [htmlContent, setHtmlContent] = useState<string>(initialEmbedData?.htmlContent || "");
  const [scormVersion, setScormVersion] = useState<string>(initialEmbedData?.scormVersion || "1.2");
  const [isValid, setIsValid] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("url");

  const handleEmbed = () => {
    if (activeTab === "url" && !embedUrl) {
      setIsValid(false);
      setErrorMessage("Please enter a valid URL");
      return;
    }

    if (activeTab === "html" && !htmlContent) {
      setIsValid(false);
      setErrorMessage("Please enter HTML content");
      return;
    }

    try {
      setIsValid(true);
      setErrorMessage("");
      
      let embedData: EmbedData;
      
      if (activeTab === "url") {
        // Basic URL validation
        new URL(embedUrl);
        embedData = {
          url: embedUrl,
          title: embedTitle,
          width: embedWidth,
          height: embedHeight,
          type: determineContentType(embedUrl)
        };
      } else if (activeTab === "html") {
        embedData = {
          url: `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`,
          title: embedTitle || "HTML Content",
          width: embedWidth,
          height: embedHeight,
          type: 'html',
          htmlContent
        };
      } else if (activeTab === "scorm") {
        embedData = {
          url: embedUrl,
          title: embedTitle || "SCORM Package",
          width: embedWidth,
          height: embedHeight,
          type: 'scorm',
          scormVersion
        };
      } else {
        return;
      }
      
      // Call either of the callback props that exists
      if (onEmbedDataChange) {
        onEmbedDataChange(embedData);
      }
      
      if (onEmbed) {
        onEmbed(embedData);
      }

      toast({
        title: "Content embedded",
        description: `${embedData.type.toUpperCase()} content has been added successfully.`
      });
    } catch (e) {
      setIsValid(false);
      setErrorMessage("Please enter valid input");
    }
  };

  // Helper function to determine content type based on URL
  const determineContentType = (url: string): string => {
    if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com')) {
      return 'video';
    } else if (url.match(/\.(pdf)$/i)) {
      return 'pdf';
    } else if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) || url.startsWith('data:image/')) {
      return 'image';
    } else if (url.match(/\.(mp4|webm|mov|avi|wmv)$/i)) {
      return 'video';
    } else if (url.startsWith('data:')) {
      return 'file';
    } else {
      return 'iframe';
    }
  };

  const handleFileUpload = (file: File) => {
    if (!file) return;
    
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    const isPDF = fileExt === 'pdf';
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExt);
    const isVideo = ['mp4', 'webm', 'mov', 'avi', 'wmv'].includes(fileExt);
    const isScorm = ['zip'].includes(fileExt);
    
    if (isPDF || isImage || isVideo) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const url = event.target.result.toString();
          setEmbedUrl(url);
          setEmbedTitle(file.name);
          setActiveTab("url");
          
          let type = 'file';
          if (isPDF) type = 'pdf';
          if (isImage) type = 'image';
          if (isVideo) type = 'video';
          
          const embedData = {
            url,
            title: file.name,
            width: embedWidth,
            height: embedHeight,
            type
          };
          
          if (onEmbedDataChange) {
            onEmbedDataChange(embedData);
          }
          
          if (onEmbed) {
            onEmbed(embedData);
          }

          toast({
            title: "File uploaded",
            description: `${file.name} has been uploaded successfully.`
          });
        }
      };
      reader.readAsDataURL(file);
    } else if (isScorm) {
      // Handle SCORM package (would require server-side processing in a real app)
      // For demo, we'll just use a mock URL
      const mockScormUrl = `/scorm/${file.name}`;
      setEmbedUrl(mockScormUrl);
      setEmbedTitle(file.name);
      setActiveTab("scorm");
      
      toast({
        title: "SCORM package uploaded",
        description: `${file.name} has been processed. Configure settings in the SCORM tab.`
      });
    } else {
      toast({
        title: "Unsupported file type",
        description: "Please upload a supported file type (PDF, image, video, SCORM package).",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="url">URL / File</TabsTrigger>
          <TabsTrigger value="html">HTML Content</TabsTrigger>
          <TabsTrigger value="scorm">SCORM Package</TabsTrigger>
        </TabsList>
        
        <TabsContent value="url" className="space-y-4">
          <div>
            <Label htmlFor="embed-url">Content URL</Label>
            <div className="flex gap-2 mt-1.5">
              <Input
                id="embed-url"
                value={embedUrl}
                onChange={(e) => setEmbedUrl(e.target.value)}
                placeholder="Enter URL for content"
                className={!isValid && activeTab === "url" ? "border-red-500" : ""}
              />
              <Button type="button" onClick={handleEmbed}>
                <LinkIcon className="h-4 w-4 mr-2" />
                Embed
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="html" className="space-y-4">
          <div>
            <Label htmlFor="html-content">HTML Content</Label>
            <Textarea
              id="html-content"
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
              placeholder="<!DOCTYPE html><html><head><title>HTML Content</title></head><body><h1>Hello World</h1></body></html>"
              className={`h-32 font-mono text-sm ${!isValid && activeTab === "html" ? "border-red-500" : ""}`}
            />
            <Button type="button" onClick={handleEmbed} className="mt-2">
              <Code className="h-4 w-4 mr-2" />
              Embed HTML
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="scorm" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="scorm-url">SCORM Package URL</Label>
            <Input
              id="scorm-url"
              value={embedUrl}
              onChange={(e) => setEmbedUrl(e.target.value)}
              placeholder="Enter URL for SCORM package"
              className={!isValid && activeTab === "scorm" ? "border-red-500" : ""}
            />
          </div>
          
          <div>
            <Label htmlFor="scorm-version">SCORM Version</Label>
            <select
              id="scorm-version"
              value={scormVersion}
              onChange={(e) => setScormVersion(e.target.value)}
              className="w-full mt-1.5 rounded-md border border-input px-3 py-2 text-sm ring-offset-background"
            >
              <option value="1.2">SCORM 1.2</option>
              <option value="2004">SCORM 2004</option>
            </select>
          </div>
          
          <Button type="button" onClick={handleEmbed}>
            <FileCode className="h-4 w-4 mr-2" />
            Embed SCORM
          </Button>
        </TabsContent>
      </Tabs>

      <div>
        <Label htmlFor="embed-title">Title (optional)</Label>
        <Input
          id="embed-title"
          value={embedTitle}
          onChange={(e) => setEmbedTitle(e.target.value)}
          placeholder="Title for this content"
          className="mt-1.5"
        />
      </div>
      
      <div>
        <Label>Upload File</Label>
        <div className="mt-1.5">
          <FileUploader 
            onFileUploaded={handleFileUpload}
            buttonText="Upload Content"
            acceptedFileTypes={["image/*", "video/*", ".pdf", ".zip", ".html"]}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="embed-width">Width</Label>
          <Input
            id="embed-width"
            value={embedWidth}
            onChange={(e) => setEmbedWidth(e.target.value)}
            placeholder="Width (e.g. 100% or 640px)"
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="embed-height">Height</Label>
          <Input
            id="embed-height"
            value={embedHeight}
            onChange={(e) => setEmbedHeight(e.target.value)}
            placeholder="Height (e.g. 315px)"
            className="mt-1.5"
          />
        </div>
      </div>

      {!isValid && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {((activeTab === "url" && embedUrl) || (activeTab === "html" && htmlContent) || (activeTab === "scorm" && embedUrl)) && isValid && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <div className="text-sm font-medium mb-1">Preview</div>
            {activeTab === "url" && (
              <div className="text-sm text-muted-foreground mb-2">
                {embedUrl.substring(0, 60)}{embedUrl.length > 60 ? '...' : ''}
              </div>
            )}
            {activeTab === "html" && (
              <div className="text-sm text-muted-foreground mb-2">
                <FileText className="inline-block mr-1 h-4 w-4" /> HTML Content ({htmlContent.length} characters)
              </div>
            )}
            {activeTab === "scorm" && (
              <div className="text-sm text-muted-foreground mb-2">
                <FileCode className="inline-block mr-1 h-4 w-4" /> SCORM {scormVersion} Package
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContentEmbedder;
