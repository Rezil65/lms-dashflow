
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Link as LinkIcon, Upload } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export interface EmbedData {
  url: string;
  width?: string;
  height?: string;
  title?: string;
  type?: string;
}

export interface ContentEmbedderProps {
  initialEmbedData?: EmbedData;
  onEmbedDataChange: (embedData: EmbedData) => void;
}

const ContentEmbedder = ({ initialEmbedData, onEmbedDataChange }: ContentEmbedderProps) => {
  const [embedUrl, setEmbedUrl] = useState<string>(initialEmbedData?.url || "");
  const [embedTitle, setEmbedTitle] = useState<string>(initialEmbedData?.title || "");
  const [embedWidth, setEmbedWidth] = useState<string>(initialEmbedData?.width || "100%");
  const [embedHeight, setEmbedHeight] = useState<string>(initialEmbedData?.height || "315");
  const [isValid, setIsValid] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleEmbed = () => {
    if (!embedUrl) {
      setIsValid(false);
      setErrorMessage("Please enter a valid URL");
      return;
    }

    try {
      // Basic URL validation
      new URL(embedUrl);
      setIsValid(true);
      setErrorMessage("");
      
      onEmbedDataChange({
        url: embedUrl,
        title: embedTitle,
        width: embedWidth,
        height: embedHeight
      });
    } catch (e) {
      setIsValid(false);
      setErrorMessage("Please enter a valid URL");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const url = event.target.result.toString();
          setEmbedUrl(url);
          setEmbedTitle(file.name);
          onEmbedDataChange({
            url,
            title: file.name,
            width: embedWidth,
            height: embedHeight,
            type: file.type
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="embed-url">Content URL</Label>
          <div className="flex gap-2 mt-1.5">
            <Input
              id="embed-url"
              value={embedUrl}
              onChange={(e) => setEmbedUrl(e.target.value)}
              placeholder="Enter URL for content"
              className={!isValid ? "border-red-500" : ""}
            />
            <Button type="button" onClick={handleEmbed}>
              <LinkIcon className="h-4 w-4 mr-2" />
              Embed
            </Button>
          </div>
        </div>
        
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
          <Label>Or Upload File</Label>
          <div className="mt-1.5">
            <Label 
              htmlFor="file-upload" 
              className="cursor-pointer flex items-center justify-center p-4 border-2 border-dashed rounded-md hover:border-primary"
            >
              <div className="text-center">
                <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                <p className="mt-1 text-sm">Click to upload or drag and drop</p>
                <p className="mt-1 text-xs text-muted-foreground">Images, videos, or documents</p>
              </div>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileUpload}
              />
            </Label>
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
      </div>

      {!isValid && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {embedUrl && isValid && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <div className="text-sm font-medium mb-1">Preview</div>
            <div className="text-sm text-muted-foreground mb-2">
              {embedUrl.substring(0, 60)}{embedUrl.length > 60 ? '...' : ''}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContentEmbedder;
