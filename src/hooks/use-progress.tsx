
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

interface CourseProgress {
  courseId: string;
  progress: number;
  lastAccessed: string;
  completed: boolean;
  courseDetails?: any;
}

export function useProgress() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Get user progress for all courses
  const getUserProgress = async (userId: string): Promise<CourseProgress[]> => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select(`
          course_id,
          progress_percent,
          last_accessed,
          completed,
          courses (
            title,
            description,
            thumbnail_url
          )
        `)
        .eq('user_id', userId);
        
      if (error) throw error;
      
      return data.map(item => ({
        courseId: item.course_id,
        progress: item.progress_percent,
        lastAccessed: item.last_accessed,
        completed: item.completed,
        courseDetails: item.courses
      }));
    } catch (error: any) {
      console.error('Error fetching user progress:', error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  // Get progress for a specific course
  const getCourseProgress = async (userId: string, courseId: string): Promise<CourseProgress | null> => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .maybeSingle();
        
      if (error) throw error;
      
      if (!data) return null;
      
      return {
        courseId: data.course_id,
        progress: data.progress_percent,
        lastAccessed: data.last_accessed,
        completed: data.completed
      };
    } catch (error: any) {
      console.error('Error fetching course progress:', error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Update progress for a course
  const updateProgress = async (userId: string, courseId: string, progress: number, completed = false): Promise<boolean> => {
    setLoading(true);
    
    try {
      const now = new Date().toISOString();
      
      // Check if a record exists
      const { data: existingData } = await supabase
        .from('user_progress')
        .select('id')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .maybeSingle();
      
      if (existingData) {
        // Update existing record
        const { error } = await supabase
          .from('user_progress')
          .update({
            progress_percent: progress,
            last_accessed: now,
            completed: completed,
            updated_at: now
          })
          .eq('id', existingData.id);
          
        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('user_progress')
          .insert({
            user_id: userId,
            course_id: courseId,
            progress_percent: progress,
            last_accessed: now,
            completed: completed
          });
          
        if (error) throw error;
      }
      
      return true;
    } catch (error: any) {
      console.error('Error updating progress:', error.message);
      toast({
        title: "Error updating progress",
        description: error.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Mark a lesson as completed
  const markLessonCompleted = async (userId: string, courseId: string, lessonId: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      const now = new Date().toISOString();
      
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          course_id: courseId,
          lesson_id: lessonId,
          last_accessed: now,
          updated_at: now
        });
        
      if (error) throw error;
      
      // Recalculate overall course progress
      // We would need to get total lessons count and completed lessons count
      // This is simplified for now
      
      return true;
    } catch (error: any) {
      console.error('Error marking lesson completed:', error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    loading,
    getUserProgress,
    getCourseProgress,
    updateProgress,
    markLessonCompleted
  };
}
