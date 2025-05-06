
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Course } from '@/utils/courseUtils';

interface CourseFormProps {
  initialCourse?: Course;
  onSave: (courseData: Course) => void;
  isLoading?: boolean;
  isEditing?: boolean;
}

const CourseForm = ({ initialCourse, onSave, isLoading = false, isEditing = false }: CourseFormProps) => {
  const [course, setCourse] = useState<Course>(initialCourse || {
    id: "",
    title: "",
    description: "",
    category: "",
    level: "",
    price: 0,
    duration: "",
    thumbnail_url: "",
    is_featured: false
  } as Course);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourse({
      ...course,
      [name]: value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setCourse({
      ...course,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(course);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Course' : 'Create New Course'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Course Title</Label>
            <Input 
              id="title" 
              name="title" 
              value={course.title} 
              onChange={handleInputChange} 
              placeholder="Enter course title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Course Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              value={course.description} 
              onChange={handleInputChange} 
              placeholder="Describe your course"
              rows={5}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={course.category || ''} 
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="programming">Programming</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="personal-development">Personal Development</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Select 
                value={course.level || ''} 
                onValueChange={(value) => handleSelectChange('level', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input 
                id="price" 
                name="price" 
                type="number" 
                value={course.price || 0} 
                onChange={handleInputChange}
                min={0}
                step={0.01}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input 
                id="duration" 
                name="duration" 
                value={course.duration || ''} 
                onChange={handleInputChange} 
                placeholder="e.g. 2 hours 30 minutes"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
            <Input 
              id="thumbnail_url" 
              name="thumbnail_url" 
              value={course.thumbnail_url || ''} 
              onChange={handleInputChange} 
              placeholder="Enter image URL for course thumbnail"
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Saving...' : (isEditing ? 'Update Course' : 'Create Course')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CourseForm;
