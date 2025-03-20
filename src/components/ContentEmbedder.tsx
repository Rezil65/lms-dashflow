
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, ExternalLink, Video, FileText } from "lucide-react";
import FileUploader from "@/components/FileUploader";

interface ContentEmbedderProps {
  onEmbed: (embedData: EmbedData) => void;
}

export type EmbedType = "iframe" | "video" | "html" | "file";

export interface EmbedData {
  type: EmbedType;
  url: string;
  title: string;
  width?: string;
  height?: string;
  file?: File;
}

const ContentEmbedder = ({ onEmbed }: ContentEmbedderProps) => {
  const [embedType, setEmbedType] = useState<EmbedType>("iframe");
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [width, setWidth] = useState("100%");
  const [height, setHeight] = useState("400px");
  const [file, setFile] = useState<File | null>(null);

  const handleFileUploaded = (uploadedFile: File) => {
    setFile(uploadedFile);
    setTitle(uploadedFile.name);
  };

  const handleEmbed = () => {
    if (!title) {
      alert("Please enter a title for the embedded content");
      return;
    }

    if (embedType === "file" || embedType === "html") {
      if (!file) {
        alert("Please upload a file");
        return;
      }

      onEmbed({
        type: embedType,
        url: URL.createObjectURL(file),
        title,
        width,
        height,
        file,
      });
    } else {
      if (!url) {
        alert("Please enter a URL");
        return;
      }

      onEmbed({
        type: embedType,
        url,
        title,
        width,
        height,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="embed-type">Content Type</Label>
        <Select
          value={embedType}
          onValueChange={(value) => setEmbedType(value as EmbedType)}
        >
          <SelectTrigger id="embed-type">
            <SelectValue placeholder="Select content type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="iframe">
              <div className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                <span>Embed Website (iFrame)</span>
              </div>
            </SelectItem>
            <SelectItem value="video">
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                <span>Video (YouTube, Vimeo, etc.)</span>
              </div>
            </SelectItem>
            <SelectItem value="html">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>HTML File</span>
              </div>
            </SelectItem>
            <SelectItem value="file">
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                <span>Upload File (PDF, SCORM, etc.)</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="embed-title">Title</Label>
        <Input
          id="embed-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title for this content"
        />
      </div>

      {(embedType === "iframe" || embedType === "video") && (
        <div className="space-y-2">
          <Label htmlFor="embed-url">URL</Label>
          <Input
            id="embed-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={
              embedType === "iframe"
                ? "https://example.com"
                : "https://www.youtube.com/embed/..."
            }
          />
        </div>
      )}

      {(embedType === "html" || embedType === "file") && (
        <div className="space-y-2">
          <Label>Upload File</Label>
          <FileUploader onFileUploaded={handleFileUploaded} />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="embed-width">Width</Label>
          <Input
            id="embed-width"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            placeholder="e.g., 100% or 600px"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="embed-height">Height</Label>
          <Input
            id="embed-height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="e.g., 400px"
          />
        </div>
      </div>

      <Button onClick={handleEmbed} className="w-full">
        Embed Content
      </Button>
    </div>
  );
};

export default ContentEmbedder;
