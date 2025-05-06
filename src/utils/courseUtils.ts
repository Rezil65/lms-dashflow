
import { supabase } from "@/integrations/supabase/client";

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url?: string;
  duration?: string;
  price?: number;
  is_featured?: boolean;
  level?: string;
  category?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  modules?: Module[];
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  course_id?: string;
  sort_order?: number;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  content?: string;
  module_id?: string;
  type?: string;
  duration?: string;
  embed_url?: string;
  sort_order?: number;
  embedData?: {
    url?: string;
    type?: string;
    title?: string;
  };
  quiz?: any; // Add quiz property to match usage in CourseModules.tsx
}

// Fetch all courses
export const getCourses = async (): Promise<Course[]> => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
  
  return data || [];
};

// Fetch a specific course by ID with its modules and lessons
export const getCourseById = async (courseId: string): Promise<Course | null> => {
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      modules (
        *,
        lessons (*)
      )
    `)
    .eq('id', courseId)
    .single();
    
  if (error) {
    console.error('Error fetching course:', error);
    return null;
  }
  
  return data;
};

// Create a new course
export const createCourse = async (course: Partial<Course>): Promise<Course | null> => {
  if (!course.title) {
    console.error("Course title is required");
    return null;
  }
  
  const { data, error } = await supabase
    .from('courses')
    .insert({
      title: course.title,
      description: course.description || "",
      thumbnail_url: course.thumbnail_url,
      duration: course.duration,
      price: course.price,
      is_featured: course.is_featured,
      level: course.level,
      category: course.category
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error creating course:', error);
    return null;
  }
  
  return data;
};

// Alias for createCourse for compatibility
export const saveCourse = createCourse;

// Update an existing course
export const updateCourse = async (courseId: string, updates: Partial<Course>): Promise<Course | null> => {
  const { data, error } = await supabase
    .from('courses')
    .update(updates)
    .eq('id', courseId)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating course:', error);
    return null;
  }
  
  return data;
};

// Delete a course
export const deleteCourse = async (courseId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', courseId);
    
  if (error) {
    console.error('Error deleting course:', error);
    return false;
  }
  
  return true;
};

// Get featured courses
export const getFeaturedCourses = async (limit: number = 4): Promise<Course[]> => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit);
    
  if (error) {
    console.error('Error fetching featured courses:', error);
    return [];
  }
  
  return data || [];
};

// Get courses by category
export const getCoursesByCategory = async (category: string): Promise<Course[]> => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching courses by category:', error);
    return [];
  }
  
  return data || [];
};

// Count total courses
export const getCoursesCount = async (): Promise<number> => {
  const { count, error } = await supabase
    .from('courses')
    .select('*', { count: 'exact', head: true });
    
  if (error) {
    console.error('Error counting courses:', error);
    return 0;
  }
  
  return count || 0;
};

// Add a module to a course
export const addModuleToCourse = async (courseId: string, moduleData: Partial<Module> & { title: string }): Promise<Module | null> => {
  const { data, error } = await supabase
    .from('modules')
    .insert({
      course_id: courseId,
      title: moduleData.title,
      description: moduleData.description || "",
      sort_order: moduleData.sort_order || 0
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error adding module to course:', error);
    return null;
  }
  
  return data;
};

// Add a lesson to a module
export const addLessonToModule = async (moduleId: string, lessonData: Partial<Lesson> & { title: string }): Promise<Lesson | null> => {
  const { data, error } = await supabase
    .from('lessons')
    .insert({
      module_id: moduleId,
      title: lessonData.title,
      content: lessonData.content || "",
      type: lessonData.type || "text",
      duration: lessonData.duration || "",
      embed_url: lessonData.embedData?.url || null,
      sort_order: lessonData.sort_order || 0
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error adding lesson to module:', error);
    return null;
  }
  
  return data;
};

// Get total course count
export const getTotalCourseCount = async (): Promise<number> => {
  const { count, error } = await supabase
    .from('courses')
    .select('*', { count: 'exact', head: true });
    
  if (error) {
    console.error('Error counting courses:', error);
    return 0;
  }
  
  return count || 0;
};
