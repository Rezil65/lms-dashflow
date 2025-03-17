
interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail?: string;
  category?: string;
  level?: string;
  price?: number;
  duration?: number;
  isFeatured?: boolean;
  tags?: string[];
  createdAt: string;
}

const COURSES_STORAGE_KEY = 'lms-courses';

export const saveCourse = (course: Omit<Course, 'id' | 'createdAt'>): Course => {
  const existingCourses = getCourses();
  
  const newCourse = {
    ...course,
    id: Math.floor(Math.random() * 10000),
    createdAt: new Date().toISOString()
  };
  
  const updatedCourses = [...existingCourses, newCourse];
  localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(updatedCourses));
  
  return newCourse;
};

export const getCourses = (): Course[] => {
  const coursesJSON = localStorage.getItem(COURSES_STORAGE_KEY);
  return coursesJSON ? JSON.parse(coursesJSON) : [];
};

export const getCourseById = (id: number): Course | undefined => {
  const courses = getCourses();
  return courses.find(course => course.id === id);
};

export const getTotalCourseCount = (): number => {
  return getCourses().length;
};
