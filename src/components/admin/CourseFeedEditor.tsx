
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FeedPost } from "@/components/CourseFeeds";
import { BookOpen, Save, Image, Link2, FileUp, X, Tag } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface CourseFeedEditorProps {
  initialFeed?: FeedPost;
  onSave: (feed: FeedPost) => void;
  onCancel: () => void;
}

const CourseFeedEditor = ({ initialFeed, onSave, onCancel }: CourseFeedEditorProps) => {
  const [title, setTitle] = useState(initialFeed?.title || "");
  const [content, setContent] = useState(initialFeed?.content || "");
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>(initialFeed?.tags || []);
  const { toast } = useToast();

  const handleAddTag = () => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()]);
      setTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a post title",
        variant: "destructive"
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter post content",
        variant: "destructive"
      });
      return;
    }

    const newFeed: FeedPost = {
      id: initialFeed?.id || `feed_${Date.now()}`,
      title,
      content,
      author: initialFeed?.author || {
        name: "Admin User",
        avatar: "",
      },
      timestamp: initialFeed?.timestamp || "Just now",
      tags,
      likes: initialFeed?.likes || 0,
      comments: initialFeed?.comments || 0,
      courseId: initialFeed?.courseId
    };

    onSave(newFeed);
    toast({
      title: "Success",
      description: `Feed post ${initialFeed ? "updated" : "created"} successfully!`
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialFeed ? "Edit Feed Post" : "Create Feed Post"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Post Title</Label>
          <Input 
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea 
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post content here..."
            className="min-h-[200px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Add a tag"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="pl-9"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
            </div>
            <Button type="button" onClick={handleAddTag}>Add Tag</Button>
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((t, i) => (
                <div key={i} className="flex items-center bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm">
                  #{t}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveTag(t)} 
                    className="ml-2 text-secondary-foreground/70 hover:text-secondary-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
          <Button className="flex-1" onClick={handleSubmit}>
            <Save className="mr-2 h-4 w-4" />
            {initialFeed ? "Update Post" : "Create Post"}
          </Button>
        </div>
        
        <div className="mt-6 border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Add Media</h3>
          
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" className="flex-1">
              <Image className="mr-2 h-4 w-4" />
              Add Image
            </Button>
            <Button variant="outline" className="flex-1">
              <Link2 className="mr-2 h-4 w-4" />
              Add Link
            </Button>
            <Button variant="outline" className="flex-1">
              <FileUp className="mr-2 h-4 w-4" />
              Upload File
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseFeedEditor;
