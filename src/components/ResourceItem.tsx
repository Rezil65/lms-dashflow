
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

interface ResourceItemProps {
  title: string;
  size: string;
  onDownload: () => void;
}

const ResourceItem = ({ title, size, onDownload }: ResourceItemProps) => {
  return (
    <Card>
      <CardContent className="p-4 flex items-center">
        <div className="p-2 rounded-md bg-primary/10">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm">{title}</span>
            <span className="text-xs text-muted-foreground">{size}</span>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onDownload} 
          className="transition-transform hover:scale-110 hover:text-primary"
        >
          <Download className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default ResourceItem;
