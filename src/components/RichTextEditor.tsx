
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
  AlignJustify,
  List,
  ListOrdered,
  Link,
  Image,
  FileText,
  Code,
  Type,
  Palette,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RichTextEditorProps {
  initialValue?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const fontFamilies = [
  { value: "sans", label: "Sans-serif" },
  { value: "serif", label: "Serif" },
  { value: "mono", label: "Monospace" },
  { value: "playfair", label: "Playfair Display" },
  { value: "system", label: "System UI" },
];

const fontSizes = [
  { value: "xs", label: "Extra Small" },
  { value: "sm", label: "Small" },
  { value: "base", label: "Normal" },
  { value: "lg", label: "Large" },
  { value: "xl", label: "Extra Large" },
  { value: "2xl", label: "2XL" },
  { value: "4xl", label: "4XL" },
];

const colors = [
  { value: "black", label: "Black", color: "#000000" },
  { value: "white", label: "White", color: "#ffffff" },
  { value: "gray", label: "Gray", color: "#6b7280" },
  { value: "red", label: "Red", color: "#ef4444" },
  { value: "orange", label: "Orange", color: "#f97316" },
  { value: "amber", label: "Amber", color: "#f59e0b" },
  { value: "yellow", label: "Yellow", color: "#eab308" },
  { value: "lime", label: "Lime", color: "#84cc16" },
  { value: "green", label: "Green", color: "#22c55e" },
  { value: "emerald", label: "Emerald", color: "#10b981" },
  { value: "teal", label: "Teal", color: "#14b8a6" },
  { value: "cyan", label: "Cyan", color: "#06b6d4" },
  { value: "sky", label: "Sky", color: "#0ea5e9" },
  { value: "blue", label: "Blue", color: "#3b82f6" },
  { value: "indigo", label: "Indigo", color: "#6366f1" },
  { value: "violet", label: "Violet", color: "#8b5cf6" },
  { value: "purple", label: "Purple", color: "#a855f7" },
  { value: "fuchsia", label: "Fuchsia", color: "#d946ef" },
  { value: "pink", label: "Pink", color: "#ec4899" },
  { value: "rose", label: "Rose", color: "#f43f5e" },
];

const RichTextEditor = ({
  initialValue = "",
  onChange,
  placeholder = "Enter content here...",
}: RichTextEditorProps) => {
  const [content, setContent] = useState(initialValue);
  const [editorView, setEditorView] = useState<"write" | "preview">("write");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setContent(newValue);
    onChange(newValue);
  };

  const applyFormat = (format: string, value?: string) => {
    // This is a simple implementation that adds HTML tags to the content.
    // In a real app, you would use a proper rich text editor library.
    let formattedText = "";

    switch (format) {
      case "bold":
        formattedText = `<strong>${value || "bold text"}</strong>`;
        break;
      case "italic":
        formattedText = `<em>${value || "italic text"}</em>`;
        break;
      case "underline":
        formattedText = `<u>${value || "underlined text"}</u>`;
        break;
      case "align-left":
        formattedText = `<div style="text-align: left;">${value || "aligned text"}</div>`;
        break;
      case "align-center":
        formattedText = `<div style="text-align: center;">${value || "centered text"}</div>`;
        break;
      case "align-right":
        formattedText = `<div style="text-align: right;">${value || "aligned text"}</div>`;
        break;
      case "align-justify":
        formattedText = `<div style="text-align: justify;">${value || "justified text"}</div>`;
        break;
      case "unordered-list":
        formattedText = `<ul>\n  <li>List item 1</li>\n  <li>List item 2</li>\n</ul>`;
        break;
      case "ordered-list":
        formattedText = `<ol>\n  <li>List item 1</li>\n  <li>List item 2</li>\n</ol>`;
        break;
      case "link":
        if (linkUrl && linkText) {
          formattedText = `<a href="${linkUrl}" target="_blank">${linkText}</a>`;
          setLinkDialogOpen(false);
          setLinkUrl("");
          setLinkText("");
        }
        break;
      case "image":
        if (imageUrl) {
          formattedText = `<img src="${imageUrl}" alt="${imageAlt}" />`;
          setImageDialogOpen(false);
          setImageUrl("");
          setImageAlt("");
        }
        break;
      case "code":
        formattedText = `<pre><code>${value || "code block"}</code></pre>`;
        break;
      case "h1":
        formattedText = `<h1>${value || "Heading 1"}</h1>`;
        break;
      case "h2":
        formattedText = `<h2>${value || "Heading 2"}</h2>`;
        break;
      case "h3":
        formattedText = `<h3>${value || "Heading 3"}</h3>`;
        break;
      case "font-family":
        if (value) {
          formattedText = `<span class="font-${value}">Text with font ${value}</span>`;
        }
        break;
      case "font-size":
        if (value) {
          formattedText = `<span class="text-${value}">Text with size ${value}</span>`;
        }
        break;
      case "color":
        if (value) {
          formattedText = `<span class="text-${value}-600">Colored text</span>`;
        }
        break;
      default:
        formattedText = value || "";
        break;
    }

    // Insert at cursor position or append to the end in a real editor
    setContent(content + formattedText);
    onChange(content + formattedText);
  };

  return (
    <div className="border rounded-md">
      <div className="border-b p-2 bg-muted/20">
        <div className="flex flex-wrap gap-1 mb-1">
          <Select onValueChange={(value) => applyFormat("font-family", value)}>
            <SelectTrigger className="w-[140px] h-8">
              <SelectValue placeholder="Font Family" />
            </SelectTrigger>
            <SelectContent>
              {fontFamilies.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  <span className={`font-${font.value}`}>{font.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select onValueChange={(value) => applyFormat("font-size", value)}>
            <SelectTrigger className="w-[120px] h-8">
              <SelectValue placeholder="Font Size" />
            </SelectTrigger>
            <SelectContent>
              {fontSizes.map((size) => (
                <SelectItem key={size.value} value={size.value}>
                  <span className={`text-${size.value}`}>{size.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Palette className="h-4 w-4" />
                <span>Color</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="grid grid-cols-5 gap-1">
                {colors.map((color) => (
                  <Button
                    key={color.value}
                    variant="ghost"
                    className="h-6 w-6 p-0 rounded-sm"
                    style={{ backgroundColor: color.color }}
                    onClick={() => applyFormat("color", color.value)}
                    title={color.label}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-1">
          <Button variant="ghost" size="icon" onClick={() => applyFormat("bold")}>
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => applyFormat("italic")}>
            <Italic className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => applyFormat("underline")}>
            <Underline className="h-4 w-4" />
          </Button>
          <div className="h-6 border-l mx-1"></div>
          <Button variant="ghost" size="icon" onClick={() => applyFormat("h1")}>
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => applyFormat("h2")}>
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => applyFormat("h3")}>
            <Heading3 className="h-4 w-4" />
          </Button>
          <div className="h-6 border-l mx-1"></div>
          <Button variant="ghost" size="icon" onClick={() => applyFormat("align-left")}>
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => applyFormat("align-center")}>
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => applyFormat("align-right")}>
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => applyFormat("align-justify")}>
            <AlignJustify className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-1">
          <Button variant="ghost" size="icon" onClick={() => applyFormat("unordered-list")}>
            <List className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => applyFormat("ordered-list")}>
            <ListOrdered className="h-4 w-4" />
          </Button>
          <div className="h-6 border-l mx-1"></div>
          <Popover open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <Link className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="link-text">Text</Label>
                  <Input
                    id="link-text"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder="Link text"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="link-url">URL</Label>
                  <Input
                    id="link-url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={() => applyFormat("link")}
                  disabled={!linkUrl || !linkText}
                >
                  Insert Link
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          <Popover open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <Image className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="image-url">Image URL</Label>
                  <Input
                    id="image-url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="image-alt">Alt Text</Label>
                  <Input
                    id="image-alt"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    placeholder="Image description"
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={() => applyFormat("image")}
                  disabled={!imageUrl}
                >
                  Insert Image
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button variant="ghost" size="icon" onClick={() => applyFormat("code")}>
            <Code className="h-4 w-4" />
          </Button>
        </div>
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
            className="border-0 rounded-none min-h-[300px] resize-y focus-visible:ring-0 focus-visible:ring-offset-0 font-mono text-sm"
          />
        </TabsContent>
        <TabsContent value="preview" className="p-4 min-h-[300px] prose prose-sm max-w-none">
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
