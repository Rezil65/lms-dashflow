import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, UploadCloud, Plus, Trash2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { saveCourse } from "@/utils/courseStorage";

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  category: z.string({ required_error: "Please select a category" }),
  level: z.enum(["beginner", "intermediate", "advanced"], { 
    required_error: "Please select a difficulty level" 
  }),
  price: z.coerce.number().min(0, { message: "Price must be a positive number" }),
  duration: z.coerce.number().min(1, { message: "Duration must be at least 1 hour" }),
  isFeatured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  thumbnail: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CourseCreation = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      duration: 1,
      isFeatured: false,
      tags: [],
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setThumbnailPreview(event.target.result.toString());
          form.setValue("thumbnail", event.target.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      form.setValue("tags", newTags);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    form.setValue("tags", newTags);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      console.log("Form submitted:", data);
      
      // Save the course data to localStorage
      const newCourse = saveCourse({
        title: data.title,
        description: data.description,
        category: data.category,
        level: data.level,
        price: data.price,
        duration: data.duration,
        isFeatured: data.isFeatured,
        tags: data.tags,
        thumbnail: thumbnailPreview || undefined,
      });
      
      // Dispatch a custom event to notify other components
      window.dispatchEvent(new Event('courseAdded'));
      
      toast({
        title: "Course Created",
        description: "Your course has been created successfully.",
      });
      
      // Wait briefly to show the toast before navigating
      setTimeout(() => {
        navigate(`/course/${newCourse.id}/content`);
      }, 1000);
    } catch (error) {
      console.error("Error creating course:", error);
      toast({
        title: "Error",
        description: "There was a problem creating your course. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="mb-8">
          <Button 
            variant="outline" 
            size="sm" 
            className="mb-4" 
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Create New Course</h1>
          <p className="text-muted-foreground mt-2">
            Fill in the details below to create a new course for your students.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Course Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter course title" {...field} />
                            </FormControl>
                            <FormDescription>
                              Make it clear and catchy
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Enter course description" 
                                className="min-h-32"
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Describe what students will learn
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="programming">Programming</SelectItem>
                                  <SelectItem value="design">Design</SelectItem>
                                  <SelectItem value="business">Business</SelectItem>
                                  <SelectItem value="marketing">Marketing</SelectItem>
                                  <SelectItem value="photography">Photography</SelectItem>
                                  <SelectItem value="music">Music</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="level"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Difficulty Level</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex flex-col space-y-1"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="beginner" id="beginner" />
                                    <label htmlFor="beginner" className="text-sm">Beginner</label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="intermediate" id="intermediate" />
                                    <label htmlFor="intermediate" className="text-sm">Intermediate</label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="advanced" id="advanced" />
                                    <label htmlFor="advanced" className="text-sm">Advanced</label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price ($)</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" step="0.01" {...field} />
                              </FormControl>
                              <FormDescription>
                                Set to 0 for a free course
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="duration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Duration (hours)</FormLabel>
                              <FormControl>
                                <Input type="number" min="1" {...field} />
                              </FormControl>
                              <FormDescription>
                                Estimated completion time
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="isFeatured"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Featured Course</FormLabel>
                              <FormDescription>
                                This course will be displayed prominently on the home page
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <div>
                        <FormLabel>Tags</FormLabel>
                        <div className="flex items-center mt-2">
                          <Input
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            placeholder="Add a tag"
                            className="mr-2"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addTag();
                              }
                            }}
                          />
                          <Button type="button" onClick={addTag} size="sm">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {tags.map((tag) => (
                            <div
                              key={tag}
                              className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="text-secondary-foreground/70 hover:text-secondary-foreground"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating..." : "Create Course"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
          
          <div>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Course Thumbnail</h3>
                <div 
                  className={`border-2 border-dashed rounded-lg p-4 text-center ${
                    thumbnailPreview ? 'border-primary' : 'border-border'
                  }`}
                >
                  {thumbnailPreview ? (
                    <div className="relative">
                      <img 
                        src={thumbnailPreview} 
                        alt="Thumbnail preview" 
                        className="w-full h-40 object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setThumbnailPreview(null);
                          form.setValue("thumbnail", undefined);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <div className="flex flex-col items-center justify-center py-4">
                        <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">Click to upload</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          SVG, PNG, JPG or GIF (max. 2MB)
                        </p>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  )}
                </div>
                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-semibold">Course Preview</h3>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium">
                      {form.watch("title") || "Course Title"}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {form.watch("description") || "Course description preview will appear here..."}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm font-medium">
                        ${form.watch("price") || "0"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {form.watch("duration") || "0"} hours
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCreation;
