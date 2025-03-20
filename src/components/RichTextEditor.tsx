
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link,
  Image,
  FileText,
  Code,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface RichTextEditorProps {
  initialValue?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({
  initialValue = "",
  onChange,
  placeholder = "Enter content here...",
}: RichTextEditorProps) => {
  const [content, setContent] = useState(initialValue);
  const [editorView, setEditorView] = useState<"write" | "preview">("write");

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setContent(newValue);
    onChange(newValue);
  };

  // This is a simple implementation. In a real app, you would use a proper rich text editor library
  // like TinyMCE, CKEditor, or Quill.js
  return (
    <div className="border rounded-md">
      <div className="border-b p-2 flex flex-wrap gap-1 bg-muted/20">
        <Button variant="ghost" size="icon">
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Underline className="h-4 w-4" />
        </Button>
        <div className="h-6 border-l mx-1"></div>
        <Button variant="ghost" size="icon">
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <AlignRight className="h-4 w-4" />
        </Button>
        <div className="h-6 border-l mx-1"></div>
        <Button variant="ghost" size="icon">
          <List className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="h-6 border-l mx-1"></div>
        <Button variant="ghost" size="icon">
          <Link className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Image className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <FileText className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Code className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="write" className="w-full">
        <TabsList className="grid grid-cols-2 mx-2 my-1">
          <TabsTrigger value="write" onClick={() => setEditorView("write")}>
            Write
          </TabsTrigger>
          <TabsTrigger value="preview" onClick={() => setEditorView("preview")}>
            Preview
          </TabsTrigger>
        </TabsList>
        <TabsContent value="write" className="p-0">
          <Textarea
            value={content}
            onChange={handleContentChange}
            placeholder={placeholder}
            className="border-0 rounded-none min-h-[200px] resize-y focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </TabsContent>
        <TabsContent value="preview" className="p-4 min-h-[200px] prose prose-sm max-w-none">
          {content ? (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            <p className="text-muted-foreground">No content to preview</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RichTextEditor;
