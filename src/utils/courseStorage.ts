
import { EmbedData } from "@/components/ContentEmbedder";

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
}

export interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail?: string;
  category?: string;
  duration?: string;
  lessonCount?: number;
  createdAt: string;
  updatedAt?: string;
  modules?: Module[];
  embedContent?: EmbedData[];
  level?: 'beginner' | 'intermediate' | 'advanced';
  price?: number;
  isFeatured?: boolean;
  tags?: string[];
}

// Get courses from local storage
export const getCourses = (): Course[] => {
  const storedCourses = localStorage.getItem('courses');
  if (storedCourses) {
    return JSON.parse(storedCourses);
  }
  return [];
};

// Get a specific course by ID
export const getCourse = (id: number): Course | null => {
  const courses = getCourses();
  return courses.find(course => course.id === id) || null;
};

// Alias for getCourse for compatibility
export const getCourseById = getCourse;

// Get total course count
export const getTotalCourseCount = (): number => {
  return getCourses().length;
};

// Add a new course
export const addCourse = (course: Omit<Course, 'id' | 'createdAt'>): Course => {
  const courses = getCourses();
  
  // Generate a unique ID
  const id = Date.now();
  
  const newCourse: Course = {
    ...course,
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  courses.push(newCourse);
  localStorage.setItem('courses', JSON.stringify(courses));
  
  return newCourse;
};

// Save a course (alias for addCourse for compatibility)
export const saveCourse = (courseData: Omit<Course, 'id' | 'createdAt'>): Course => {
  return addCourse(courseData);
};

// Update an existing course
export const updateCourse = (updatedCourse: Course): Course => {
  const courses = getCourses();
  const index = courses.findIndex(course => course.id === updatedCourse.id);
  
  if (index === -1) {
    throw new Error(`Course with ID ${updatedCourse.id} not found`);
  }
  
  courses[index] = {
    ...updatedCourse,
    updatedAt: new Date().toISOString()
  };
  
  localStorage.setItem('courses', JSON.stringify(courses));
  return courses[index];
};

// Delete a course
export const deleteCourse = (id: number): void => {
  const courses = getCourses();
  const updatedCourses = courses.filter(course => course.id !== id);
  localStorage.setItem('courses', JSON.stringify(updatedCourses));
};

// Add a module to a course
export const addModuleToCourse = (courseId: number, module: Omit<Module, 'id'>): Module => {
  const courses = getCourses();
  const courseIndex = courses.findIndex(course => course.id === courseId);
  
  if (courseIndex === -1) {
    throw new Error(`Course with ID ${courseId} not found`);
  }
  
  const newModule: Module = {
    ...module,
    id: Date.now().toString(),
    lessons: module.lessons || []
  };
  
  if (!courses[courseIndex].modules) {
    courses[courseIndex].modules = [];
  }
  
  courses[courseIndex].modules?.push(newModule);
  courses[courseIndex].updatedAt = new Date().toISOString();
  localStorage.setItem('courses', JSON.stringify(courses));
  
  return newModule;
};

// Update a module in a course
export const updateCourseModule = (courseId: number, updatedModule: Module): Module => {
  const courses = getCourses();
  const courseIndex = courses.findIndex(course => course.id === courseId);
  
  if (courseIndex === -1) {
    throw new Error(`Course with ID ${courseId} not found`);
  }
  
  if (!courses[courseIndex].modules) {
    throw new Error(`No modules found for course with ID ${courseId}`);
  }
  
  const moduleIndex = courses[courseIndex].modules?.findIndex(module => module.id === updatedModule.id);
  
  if (moduleIndex === undefined || moduleIndex === -1) {
    throw new Error(`Module with ID ${updatedModule.id} not found in course ${courseId}`);
  }
  
  courses[courseIndex].modules![moduleIndex] = updatedModule;
  courses[courseIndex].updatedAt = new Date().toISOString();
  localStorage.setItem('courses', JSON.stringify(courses));
  
  return updatedModule;
};

// Delete a module from a course
export const deleteCourseModule = (courseId: number, moduleId: string): void => {
  const courses = getCourses();
  const courseIndex = courses.findIndex(course => course.id === courseId);
  
  if (courseIndex === -1) {
    throw new Error(`Course with ID ${courseId} not found`);
  }
  
  if (!courses[courseIndex].modules) {
    throw new Error(`No modules found for course with ID ${courseId}`);
  }
  
  courses[courseIndex].modules = courses[courseIndex].modules?.filter(module => module.id !== moduleId);
  courses[courseIndex].updatedAt = new Date().toISOString();
  localStorage.setItem('courses', JSON.stringify(courses));
};
