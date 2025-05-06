
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Course } from '@/utils/courseUtils';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define a schema for course validation
const courseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.string().optional(),
  level: z.string().optional(),
  price: z.number().min(0, "Price must be a positive number"),
  duration: z.string().optional(),
  thumbnail_url: z.string().optional(),
  is_featured: z.boolean().optional(),
});

interface CourseFormProps {
  initialCourse?: Course;
  onSave: (courseData: Course) => void;
  isLoading?: boolean;
  isEditing?: boolean;
}

const CourseForm = ({ initialCourse, onSave, isLoading = false, isEditing = false }: CourseFormProps) => {
  // Convert the initialCourse to match the form structure
  const defaultValues = initialCourse || {
    id: "",
    title: "",
    description: "",
    category: "",
    level: "",
    price: 0,
    duration: "",
    thumbnail_url: "",
    is_featured: false
  } as Course;

  const form = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues
  });

  const handleSubmit = form.handleSubmit((data) => {
    // Preserve the id if we're editing
    const courseData = {
      ...data,
      id: initialCourse?.id || "",
    } as Course;
    
    onSave(courseData);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Course' : 'Create New Course'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter course title"
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your course"
                      rows={5}
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="programming">Programming</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="personal-development">Personal Development</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Level</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={0}
                        step={0.01}
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                        value={field.value}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. 2 hours 30 minutes"
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="thumbnail_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter image URL for course thumbnail"
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full hover:scale-105 transition-transform button-3d" disabled={isLoading}>
              {isLoading ? 'Saving...' : (isEditing ? 'Update Course' : 'Create Course')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CourseForm;
