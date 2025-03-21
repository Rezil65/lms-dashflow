
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RichTextEditor from "@/components/RichTextEditor";
import ContentEmbedder, { EmbedData } from "@/components/ContentEmbedder";
import FileUploader from "@/components/FileUploader";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { ArrowLeftRight, FileImage, Save } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface CourseDetails {
  id: number;
  title: string;
  description: string;
  thumbnail?: string;
  category?: string;
  duration?: string;
  lessonCount?: number;
  updatedAt?: string;
  embedContent?: EmbedData[];
}

interface CourseDetailsEditorProps {
  courseDetails: CourseDetails;
  onSave: (updatedDetails: CourseDetails) => void;
  onCancel: () => void;
}

const CourseDetailsEditor = ({ courseDetails, onSave, onCancel }: CourseDetailsEditorProps) => {
  const [title, setTitle] = useState(courseDetails.title || "");
  const [description, setDescription] = useState(courseDetails.description || "");
  const [category, setCategory] = useState(courseDetails.category || "");
  const [duration, setDuration] = useState(courseDetails.duration || "");
  const [lessonCount, setLessonCount] = useState(courseDetails.lessonCount || 0);
  const [thumbnail, setThumbnail] = useState<string | undefined>(courseDetails.thumbnail);
  const [embedContent, setEmbedContent] = useState<EmbedData[]>(courseDetails.embedContent || []);
  const [embedDialogOpen, setEmbedDialogOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const handleThumbnailUpload = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setThumbnail(imageUrl);
    toast({
      title: "Thumbnail uploaded",
      description: "Your course thumbnail has been updated."
    });
  };

  const handleAddEmbed = (embedData: EmbedData) => {
    setEmbedContent([...embedContent, embedData]);
    setEmbedDialogOpen(false);
    toast({
      title: "Content embedded",
      description: `${embedData.type.toUpperCase()} content has been added to the course.`
    });
  };

  const handleRemoveEmbed = (index: number) => {
    const newEmbedContent = [...embedContent];
    newEmbedContent.splice(index, 1);
    setEmbedContent(newEmbedContent);
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Course title is required",
        variant: "destructive"
      });
      return;
    }

    const updatedDetails: CourseDetails = {
      ...courseDetails,
      title,
      description,
      category,
      duration,
      lessonCount,
      thumbnail,
      embedContent,
      updatedAt: new Date().toISOString()
    };

    onSave(updatedDetails);
  };

  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Edit Course Details</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={togglePreview}>
            <ArrowLeftRight className="h-4 w-4 mr-2" />
            {previewMode ? "Edit Mode" : "Preview Mode"}
          </Button>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {previewMode ? (
        <div className="border rounded-lg p-6 bg-white">
          {thumbnail && (
            <div className="mb-6">
              <img src={thumbnail} alt={title} className="rounded-lg w-full h-48 object-cover" />
            </div>
          )}
          <h1 className="text-3xl font-bold mb-4">{title}</h1>
          <div className="flex flex-wrap gap-4 mb-6">
            {category && (
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {category}
              </div>
            )}
            {duration && (
              <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                {duration}
              </div>
            )}
            {lessonCount > 0 && (
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                {lessonCount} lessons
              </div>
            )}
          </div>
          <div className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: description }} />
          
          {embedContent.length > 0 && (
            <div className="space-y-6 mt-8">
              <h2 className="text-xl font-semibold">Additional Content</h2>
              {embedContent.map((embed, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">{embed.title}</h3>
                  {embed.type === 'video' && (
                    <div className="aspect-video">
                      <iframe
                        src={embed.url}
                        title={embed.title}
                        width={embed.width || "100%"}
                        height={embed.height || "315"}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      ></iframe>
                    </div>
                  )}
                  {embed.type === 'iframe' && (
                    <iframe
                      src={embed.url}
                      title={embed.title}
                      width={embed.width || "100%"}
                      height={embed.height || "400"}
                      frameBorder="0"
                      className="w-full"
                    ></iframe>
                  )}
                  {(embed.type === 'html' || embed.type === 'file') && (
                    <iframe
                      src={embed.url}
                      title={embed.title}
                      width={embed.width || "100%"}
                      height={embed.height || "400"}
                      frameBorder="0"
                      className="w-full"
                    ></iframe>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          <Tabs defaultValue="basic">
            <TabsList>
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="embeds">Embedded Content</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title</Label>
                  <Input 
                    id="title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Enter course title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input 
                    id="category" 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)} 
                    placeholder="e.g., Web Development"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input 
                    id="duration" 
                    value={duration} 
                    onChange={(e) => setDuration(e.target.value)} 
                    placeholder="e.g., 3 hours"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lessonCount">Lesson Count</Label>
                  <Input 
                    id="lessonCount" 
                    type="number"
                    value={lessonCount} 
                    onChange={(e) => setLessonCount(parseInt(e.target.value) || 0)} 
                    placeholder="Enter number of lessons"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label>Course Thumbnail</Label>
                  <div className="border rounded-md p-4">
                    {thumbnail ? (
                      <div className="relative">
                        <img 
                          src={thumbnail} 
                          alt="Course thumbnail" 
                          className="w-full h-40 object-cover rounded-md mb-2" 
                        />
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setThumbnail(undefined)}
                          className="mt-2"
                        >
                          Remove Thumbnail
                        </Button>
                      </div>
                    ) : (
                      <div className="bg-muted/30 rounded-md flex flex-col items-center justify-center h-40">
                        <FileImage className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">No thumbnail selected</p>
                        <FileUploader 
                          onFileUploaded={handleThumbnailUpload} 
                          allowedFileTypes={["image/jpeg", "image/png", "image/gif"]}
                          buttonText="Upload Thumbnail"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="content" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Course Description</Label>
                <RichTextEditor 
                  initialValue={description} 
                  onChange={setDescription} 
                  placeholder="Enter course description with rich formatting..."
                />
              </div>
            </TabsContent>
            
            <TabsContent value="embeds" className="space-y-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Embedded Content</h3>
                <Dialog open={embedDialogOpen} onOpenChange={setEmbedDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>Add Embedded Content</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                      <DialogTitle>Add Embedded Content</DialogTitle>
                    </DialogHeader>
                    <ContentEmbedder onEmbed={handleAddEmbed} />
                  </DialogContent>
                </Dialog>
              </div>
              
              {embedContent.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {embedContent.map((embed, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{embed.title}</h4>
                            <span className="text-xs bg-muted px-2 py-0.5 rounded uppercase">{embed.type}</span>
                          </div>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleRemoveEmbed(index)}
                          >
                            Remove
                          </Button>
                        </div>
                        <div className="mt-2 max-h-40 overflow-hidden border rounded">
                          {embed.type === 'video' && (
                            <iframe
                              src={embed.url}
                              title={embed.title}
                              width="100%"
                              height="150"
                              frameBorder="0"
                              className="w-full"
                            ></iframe>
                          )}
                          {embed.type === 'iframe' && (
                            <iframe
                              src={embed.url}
                              title={embed.title}
                              width="100%"
                              height="150"
                              frameBorder="0"
                              className="w-full"
                            ></iframe>
                          )}
                          {(embed.type === 'html' || embed.type === 'file') && (
                            <div className="p-2 bg-muted/20 text-sm">
                              Embedded {embed.type.toUpperCase()} file: {embed.url.substring(0, 30)}...
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border rounded-md bg-muted/10">
                  <p className="text-muted-foreground">No embedded content added yet.</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Click the "Add Embedded Content" button to add videos, iframes, or other content.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default CourseDetailsEditor;
