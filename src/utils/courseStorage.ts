
import { EmbedData } from "@/components/ContentEmbedder";
import { supabase } from "@/integrations/supabase/client";

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  type: string;
  duration: string;
  embedData?: EmbedData;
  quiz?: any; // Adding the quiz property that's used in CourseModules.tsx
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string; // Changed from thumbnail_url for consistent naming
  category?: string;
  duration?: string;
  lessonCount?: number;
  createdAt: string;  // Changed from created_at for consistent naming
  updatedAt?: string; // Changed from updated_at for consistent naming
  modules?: Module[];
  embedContent?: EmbedData[];
  level?: 'beginner' | 'intermediate' | 'advanced' | string;
  price?: number;
  isFeatured?: boolean; // Changed from is_featured for consistent naming
  tags?: string[];
}

// Get courses from Supabase
export const getCourses = async (): Promise<Course[]> => {
  const { data, error } = await supabase.from('courses').select('*');
  
  if (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
  
  // Transform the data to match the Course interface
  return data.map(course => ({
    id: course.id,
    title: course.title,
    description: course.description,
    thumbnail: course.thumbnail_url, // Map from DB column to interface property
    category: course.category,
    duration: course.duration,
    createdAt: course.created_at, // Map from DB column to interface property
    updatedAt: course.updated_at, // Map from DB column to interface property
    level: course.level,
    price: course.price,
    isFeatured: course.is_featured, // Map from DB column to interface property
    tags: course.tags
  }));
};

// Get a specific course by ID with its modules and lessons
export const getCourse = async (id: string): Promise<Course | null> => {
  // Fetch the course
  const { data: courseData, error: courseError } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single();
  
  if (courseError || !courseData) {
    console.error('Error fetching course:', courseError);
    return null;
  }
  
  // Fetch the modules for this course
  const { data: modulesData, error: modulesError } = await supabase
    .from('modules')
    .select('*')
    .eq('course_id', id)
    .order('sort_order', { ascending: true });
  
  if (modulesError) {
    console.error('Error fetching modules:', modulesError);
    return null;
  }
  
  // Prepare course with empty modules array
  const course: Course = {
    id: courseData.id,
    title: courseData.title,
    description: courseData.description,
    thumbnail: courseData.thumbnail_url,
    category: courseData.category,
    duration: courseData.duration,
    createdAt: courseData.created_at,
    updatedAt: courseData.updated_at,
    level: courseData.level,
    price: courseData.price,
    isFeatured: courseData.is_featured,
    tags: courseData.tags,
    modules: []
  };
  
  // If there are modules, fetch lessons for each
  if (modulesData && modulesData.length > 0) {
    // Create modules array with empty lessons
    course.modules = modulesData.map(module => ({
      id: module.id,
      title: module.title,
      description: module.description || '',
      lessons: []
    }));
    
    // Fetch all lessons for all modules in one query
    const moduleIds = modulesData.map(module => module.id);
    const { data: lessonsData, error: lessonsError } = await supabase
      .from('lessons')
      .select('*')
      .in('module_id', moduleIds)
      .order('sort_order', { ascending: true });
    
    if (lessonsError) {
      console.error('Error fetching lessons:', lessonsError);
    } else if (lessonsData) {
      // Populate lessons into their respective modules
      lessonsData.forEach(lesson => {
        const moduleIndex = course.modules!.findIndex(m => m.id === lesson.module_id);
        if (moduleIndex !== -1) {
          course.modules![moduleIndex].lessons.push({
            id: lesson.id,
            title: lesson.title,
            content: lesson.content || '',
            type: lesson.type || 'text',
            duration: lesson.duration || '0 min',
            embedData: lesson.embed_url ? {
              type: 'video',
              url: lesson.embed_url,
              title: lesson.title
            } : undefined
          });
        }
      });
    }
  }
  
  return course;
};

// Alias for getCourse for compatibility
export const getCourseById = getCourse;

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

// Add a new course
export const addCourse = async (course: Omit<Course, 'id' | 'createdAt'>): Promise<Course | null> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    console.error('User must be logged in to add a course', userError);
    return null;
  }
  
  const { data, error } = await supabase
    .from('courses')
    .insert({
      title: course.title,
      description: course.description,
      thumbnail_url: course.thumbnail, // Map from interface property to DB column
      category: course.category,
      duration: course.duration,
      level: course.level,
      price: course.price,
      is_featured: course.isFeatured, // Map from interface property to DB column
      tags: course.tags,
      created_by: userData.user.id
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error adding course:', error);
    return null;
  }
  
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    thumbnail: data.thumbnail_url,
    category: data.category,
    duration: data.duration,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    level: data.level,
    price: data.price,
    isFeatured: data.is_featured,
    tags: data.tags,
    modules: []
  };
};

// Save a course (alias for addCourse for compatibility)
export const saveCourse = addCourse;

// Update an existing course
export const updateCourse = async (id: string, updatedCourse: Partial<Course>): Promise<Course | null> => {
  const { error } = await supabase
    .from('courses')
    .update({
      title: updatedCourse.title,
      description: updatedCourse.description,
      thumbnail_url: updatedCourse.thumbnail, // Map from interface property to DB column
      category: updatedCourse.category,
      duration: updatedCourse.duration,
      level: updatedCourse.level,
      price: updatedCourse.price,
      is_featured: updatedCourse.isFeatured, // Map from interface property to DB column
      tags: updatedCourse.tags,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);
  
  if (error) {
    console.error('Error updating course:', error);
    return null;
  }
  
  // Fetch the updated course
  return getCourseById(id);
};

// Delete a course
export const deleteCourse = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting course:', error);
    return false;
  }
  
  return true;
};

// Add a module to a course
export const addModuleToCourse = async (courseId: string, module: { title: string; description: string }): Promise<Module | null> => {
  const { data, error } = await supabase
    .from('modules')
    .insert({
      course_id: courseId,
      title: module.title,
      description: module.description,
      sort_order: (await getNextModuleSortOrder(courseId))
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error adding module:', error);
    return null;
  }
  
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    lessons: []
  };
};

// Helper to get the next sort order for modules
const getNextModuleSortOrder = async (courseId: string): Promise<number> => {
  const { data } = await supabase
    .from('modules')
    .select('sort_order')
    .eq('course_id', courseId)
    .order('sort_order', { ascending: false })
    .limit(1);
  
  return data && data.length > 0 ? (data[0].sort_order + 1) : 0;
};

// Update a module in a course
export const updateCourseModule = async (courseId: string, updatedModule: Module): Promise<Module | null> => {
  const { error } = await supabase
    .from('modules')
    .update({
      title: updatedModule.title,
      description: updatedModule.description
    })
    .eq('id', updatedModule.id);
  
  if (error) {
    console.error('Error updating module:', error);
    return null;
  }
  
  return updatedModule;
};

// Delete a module from a course
export const deleteCourseModule = async (courseId: string, moduleId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('modules')
    .delete()
    .eq('id', moduleId);
  
  if (error) {
    console.error('Error deleting module:', error);
    return false;
  }
  
  return true;
};

// Add a lesson to a module
export const addLessonToModule = async (moduleId: string, lesson: Omit<Lesson, 'id'>): Promise<Lesson | null> => {
  const { data, error } = await supabase
    .from('lessons')
    .insert({
      module_id: moduleId,
      title: lesson.title,
      content: lesson.content,
      type: lesson.type,
      duration: lesson.duration,
      embed_url: lesson.embedData?.url,
      sort_order: (await getNextLessonSortOrder(moduleId))
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error adding lesson:', error);
    return null;
  }
  
  return {
    id: data.id,
    title: data.title,
    content: data.content,
    type: data.type,
    duration: data.duration,
    embedData: data.embed_url ? {
      type: 'video',
      url: data.embed_url,
      title: data.title
    } : undefined
  };
};

// Helper to get the next sort order for lessons
const getNextLessonSortOrder = async (moduleId: string): Promise<number> => {
  const { data } = await supabase
    .from('lessons')
    .select('sort_order')
    .eq('module_id', moduleId)
    .order('sort_order', { ascending: false })
    .limit(1);
  
  return data && data.length > 0 ? (data[0].sort_order + 1) : 0;
};

// Update a lesson
export const updateLesson = async (lessonId: string, updatedLesson: Lesson): Promise<Lesson | null> => {
  const { error } = await supabase
    .from('lessons')
    .update({
      title: updatedLesson.title,
      content: updatedLesson.content,
      type: updatedLesson.type,
      duration: updatedLesson.duration,
      embed_url: updatedLesson.embedData?.url
    })
    .eq('id', lessonId);
  
  if (error) {
    console.error('Error updating lesson:', error);
    return null;
  }
  
  return updatedLesson;
};

// Delete a lesson
export const deleteLesson = async (lessonId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('lessons')
    .delete()
    .eq('id', lessonId);
  
  if (error) {
    console.error('Error deleting lesson:', error);
    return false;
  }
  
  return true;
};
