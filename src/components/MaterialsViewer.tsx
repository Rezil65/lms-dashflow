
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FileText, FileImage, Video, File, FileCode, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import StylizedVideoPlayer from "./StylizedVideoPlayer";

interface Material {
  id: string;
  title: string;
  type: string;
  content: string;
  thumbnail?: string;
}

interface MaterialsViewerProps {
  materials: Material[];
  className?: string;
}

const MaterialsViewer = ({ materials, className }: MaterialsViewerProps) => {
  const [activeTab, setActiveTab] = useState<string>(materials[0]?.id || "");
  
  const getIconForType = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'pdf':
        return <FileText className="w-4 h-4" />;
      case 'image':
        return <FileImage className="w-4 h-4" />;
      case 'code':
        return <FileCode className="w-4 h-4" />;
      default:
        return <File className="w-4 h-4" />;
    }
  };
  
  const renderContent = (material: Material) => {
    switch (material.type) {
      case 'video':
        return (
          <div className="w-full">
            <StylizedVideoPlayer 
              src={material.content} 
              title={material.title} 
            />
            <div className="mt-4">
              <h3 className="text-lg font-medium">{material.title}</h3>
              <p className="text-muted-foreground text-sm mt-1">
                This video explains the core concepts of this module. 
                Watch it carefully to understand the fundamentals.
              </p>
            </div>
          </div>
        );
      case 'pdf':
        return (
          <div className="w-full flex flex-col h-full">
            <div className="bg-muted/30 rounded-lg p-4 flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-primary mr-3" />
                <div>
                  <h3 className="font-medium">{material.title}</h3>
                  <p className="text-muted-foreground text-sm">PDF Document</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-4 w-4" /> Download
              </Button>
            </div>
            <div className="flex-1 border rounded-lg overflow-hidden bg-white">
              <iframe 
                src={material.content} 
                title={material.title}
                className="w-full h-[500px]"
              />
            </div>
          </div>
        );
      case 'image':
        return (
          <div className="w-full">
            <div className="rounded-lg overflow-hidden bg-white shadow-sm">
              <img 
                src={material.content} 
                alt={material.title}
                className="w-full h-auto" 
              />
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium">{material.title}</h3>
              <p className="text-muted-foreground text-sm mt-1">
                This diagram illustrates the key concepts covered in this module.
              </p>
            </div>
          </div>
        );
      case 'html':
        return (
          <div className="w-full flex flex-col h-full">
            <div className="bg-muted/30 rounded-lg p-4 flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FileCode className="h-8 w-8 text-primary mr-3" />
                <div>
                  <h3 className="font-medium">{material.title}</h3>
                  <p className="text-muted-foreground text-sm">Interactive Content</p>
                </div>
              </div>
            </div>
            <div className="flex-1 border rounded-lg overflow-hidden bg-white">
              <iframe 
                src={material.content} 
                title={material.title}
                className="w-full h-[500px]"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>
        );
      default:
        return (
          <div className="w-full h-[400px] flex items-center justify-center bg-muted/20 rounded-lg">
            <div className="text-center">
              <File className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p>Preview not available</p>
              <Button variant="outline" size="sm" className="mt-4 gap-1">
                <Download className="h-4 w-4" /> Download File
              </Button>
            </div>
          </div>
        );
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Course Materials</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 w-full flex overflow-x-auto hide-scrollbar">
            {materials.map(material => (
              <TabsTrigger key={material.id} value={material.id} className="flex items-center gap-1">
                {getIconForType(material.type)}
                <span className="truncate max-w-[120px]">{material.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {materials.map(material => (
            <TabsContent key={material.id} value={material.id} className="focus:outline-none">
              {renderContent(material)}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MaterialsViewer;
