
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  courseId?: string;
  createdAt?: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  type?: 'single-choice' | 'multiple-choice';
  options: QuizOption[];
}

export interface QuizOption {
  id?: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizResult {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  completedAt: string;
  selectedOptions: Record<string, string[]>;
}

interface SubmitQuizResultParams {
  quizId: string;
  score: number;
  totalQuestions: number;
  selectedOptions: Record<string, string[]>;
}

export const useQuiz = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Create a new quiz
  const createQuiz = async (courseId: string, quizData: Omit<Quiz, 'id'>): Promise<Quiz | null> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create quizzes",
        variant: "destructive"
      });
      return null;
    }

    setLoading(true);
    
    try {
      // 1. Create the quiz
      const { data: newQuizData, error: quizError } = await supabase
        .from('quizzes')
        .insert({
          course_id: courseId,
          title: quizData.title,
          description: quizData.description || null,
          created_by: user.id
        })
        .select()
        .single();
      
      if (quizError) throw quizError;
      
      const quizId = newQuizData.id;
      
      // 2. Create all questions and options
      for (const question of quizData.questions) {
        const { data: questionData, error: questionError } = await supabase
          .from('quiz_questions')
          .insert({
            quiz_id: quizId,
            question: question.question,
            sort_order: 0
          })
          .select()
          .single();
        
        if (questionError) throw questionError;
        
        // Add options for this question
        for (const option of question.options) {
          const { error: optionError } = await supabase
            .from('quiz_options')
            .insert({
              question_id: questionData.id,
              text: option.text,
              is_correct: option.isCorrect,
              sort_order: 0
            });
          
          if (optionError) throw optionError;
        }
      }
      
      // Return the full quiz with questions and options
      return await getQuizById(quizId);
      
    } catch (error) {
      console.error("Error creating quiz:", error);
      toast({
        title: "Failed to create quiz",
        description: "An error occurred while creating the quiz",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get a quiz by ID, including all questions and options
  const getQuizById = async (quizId: string): Promise<Quiz | null> => {
    setLoading(true);
    
    try {
      // 1. Get the quiz
      const { data: quiz, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', quizId)
        .single();
      
      if (quizError) throw quizError;
      
      // 2. Get questions for this quiz
      const { data: questionsData, error: questionsError } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', quizId)
        .order('sort_order', { ascending: true });
      
      if (questionsError) throw questionsError;
      
      const questions: QuizQuestion[] = [];
      
      // 3. Get options for each question
      for (const question of questionsData) {
        const { data: optionsData, error: optionsError } = await supabase
          .from('quiz_options')
          .select('*')
          .eq('question_id', question.id)
          .order('sort_order', { ascending: true });
        
        if (optionsError) throw optionsError;
        
        // Determine if single or multiple choice
        const correctOptions = optionsData.filter(o => o.is_correct);
        const questionType = correctOptions.length > 1 ? 'multiple-choice' : 'single-choice';
        
        questions.push({
          id: question.id,
          question: question.question,
          type: questionType,
          options: optionsData.map(option => ({
            id: option.id,
            text: option.text,
            isCorrect: option.is_correct
          }))
        });
      }
      
      return {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        courseId: quiz.course_id,
        createdAt: quiz.created_at,
        questions
      };
      
    } catch (error) {
      console.error("Error fetching quiz:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get all quizzes for a course
  const getQuizzesByCourseId = async (courseId: string): Promise<Quiz[]> => {
    setLoading(true);
    
    try {
      const { data: quizzes, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('course_id', courseId);
      
      if (error) throw error;
      
      const fullQuizzes: Quiz[] = [];
      
      for (const quiz of quizzes) {
        const fullQuiz = await getQuizById(quiz.id);
        if (fullQuiz) fullQuizzes.push(fullQuiz);
      }
      
      return fullQuizzes;
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Alias for getQuizzesByCourseId
  const getQuizzesByCourse = getQuizzesByCourseId;

  // Submit quiz results
  const submitQuizResult = async ({ quizId, score, totalQuestions, selectedOptions }: SubmitQuizResultParams): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to submit quiz results",
        variant: "destructive"
      });
      return false;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('user_quiz_results')
        .insert({
          user_id: user.id,
          quiz_id: quizId,
          score: score,
          selected_options: selectedOptions
        });
      
      if (error) throw error;
      
      toast({
        title: "Quiz submitted",
        description: `You scored ${score} out of ${totalQuestions}!`,
      });
      
      return true;
    } catch (error) {
      console.error("Error submitting quiz result:", error);
      toast({
        title: "Failed to submit quiz",
        description: "An error occurred while submitting your results",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get quiz results for user
  const getUserQuizResults = async (userId: string): Promise<QuizResult[]> => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('user_quiz_results')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      
      return data.map(result => ({
        id: result.id,
        userId: result.user_id,
        quizId: result.quiz_id,
        score: result.score,
        completedAt: result.completed_at,
        // Cast selected options to the correct type
        selectedOptions: result.selected_options as Record<string, string[]> || {}
      }));
    } catch (error) {
      console.error("Error fetching user quiz results:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Update an existing quiz
  const updateQuiz = async (quizId: string, updates: Partial<Omit<Quiz, 'id'>>): Promise<Quiz | null> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to update quizzes",
        variant: "destructive"
      });
      return null;
    }
    
    setLoading(true);
    
    try {
      // 1. Update basic quiz information
      if (updates.title || updates.description !== undefined) {
        const { error } = await supabase
          .from('quizzes')
          .update({
            title: updates.title,
            description: updates.description
          })
          .eq('id', quizId);
        
        if (error) throw error;
      }
      
      // 2. If there are updated questions, handle them
      if (updates.questions) {
        // This is complex and would require transaction-like behavior
        // For now, we'll implement a simple version that deletes and recreates
        
        // Get existing questions to delete
        const { data: existingQuestions, error: fetchError } = await supabase
          .from('quiz_questions')
          .select('id')
          .eq('quiz_id', quizId);
        
        if (fetchError) throw fetchError;
        
        // Delete existing questions (will cascade to options)
        if (existingQuestions.length > 0) {
          const { error: deleteError } = await supabase
            .from('quiz_questions')
            .delete()
            .in('id', existingQuestions.map(q => q.id));
          
          if (deleteError) throw deleteError;
        }
        
        // Create new questions and options
        for (const question of updates.questions) {
          const { data: questionData, error: questionError } = await supabase
            .from('quiz_questions')
            .insert({
              quiz_id: quizId,
              question: question.question
            })
            .select()
            .single();
          
          if (questionError) throw questionError;
          
          // Add options for this question
          for (const option of question.options) {
            const { error: optionError } = await supabase
              .from('quiz_options')
              .insert({
                question_id: questionData.id,
                text: option.text,
                is_correct: option.isCorrect
              });
            
            if (optionError) throw optionError;
          }
        }
      }
      
      // Return the updated quiz
      return await getQuizById(quizId);
      
    } catch (error) {
      console.error("Error updating quiz:", error);
      toast({
        title: "Failed to update quiz",
        description: "An error occurred while updating the quiz",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete a quiz
  const deleteQuiz = async (quizId: string): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to delete quizzes",
        variant: "destructive"
      });
      return false;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', quizId);
      
      if (error) throw error;
      
      toast({
        title: "Quiz deleted",
        description: "The quiz has been deleted successfully",
      });
      
      return true;
    } catch (error) {
      console.error("Error deleting quiz:", error);
      toast({
        title: "Failed to delete quiz",
        description: "An error occurred while deleting the quiz",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createQuiz,
    getQuizById,
    getQuizzesByCourseId,
    getQuizzesByCourse,
    submitQuizResult,
    getUserQuizResults,
    updateQuiz,
    deleteQuiz,
    loading
  };
};
