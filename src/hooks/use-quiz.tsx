
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

// Define types for quiz-related data
export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  courseId?: string;
  type?: 'single-choice' | 'multiple-choice';
  questions: QuizQuestion[];
}

export interface QuizResult {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  completedAt: string;
  selectedOptions: Record<string, string[]>;
}

export function useQuiz() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch quizzes for a course
  const getQuizzesByCourse = async (courseId: string): Promise<Quiz[]> => {
    setLoading(true);
    setError(null);
    
    try {
      // Get quizzes
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('course_id', courseId);
        
      if (quizError) throw quizError;
      
      const quizzes: Quiz[] = [];
      
      // For each quiz, get its questions and options
      for (const quiz of quizData || []) {
        const { data: questionsData, error: questionsError } = await supabase
          .from('quiz_questions')
          .select('*')
          .eq('quiz_id', quiz.id)
          .order('sort_order', { ascending: true });
          
        if (questionsError) throw questionsError;
        
        const questions: QuizQuestion[] = [];
        
        for (const question of questionsData || []) {
          const { data: optionsData, error: optionsError } = await supabase
            .from('quiz_options')
            .select('*')
            .eq('question_id', question.id)
            .order('sort_order', { ascending: true });
            
          if (optionsError) throw optionsError;
          
          questions.push({
            id: question.id,
            question: question.question,
            options: (optionsData || []).map(option => ({
              id: option.id,
              text: option.text,
              isCorrect: option.is_correct
            }))
          });
        }
        
        quizzes.push({
          id: quiz.id,
          title: quiz.title,
          description: quiz.description,
          courseId: quiz.course_id,
          type: questions.length > 0 && questions[0].options.filter(o => o.isCorrect).length > 1 ? 
            'multiple-choice' : 'single-choice',
          questions
        });
      }
      
      return quizzes;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error loading quizzes",
        description: err.message,
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  // Get a single quiz by ID with all questions and options
  const getQuiz = async (quizId: string): Promise<Quiz | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // Get quiz
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', quizId)
        .single();
        
      if (quizError) throw quizError;
      
      // Get questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', quizId)
        .order('sort_order', { ascending: true });
        
      if (questionsError) throw questionsError;
      
      const questions: QuizQuestion[] = [];
      
      for (const question of questionsData || []) {
        const { data: optionsData, error: optionsError } = await supabase
          .from('quiz_options')
          .select('*')
          .eq('question_id', question.id)
          .order('sort_order', { ascending: true });
          
        if (optionsError) throw optionsError;
        
        questions.push({
          id: question.id,
          question: question.question,
          options: (optionsData || []).map(option => ({
            id: option.id,
            text: option.text,
            isCorrect: option.is_correct
          }))
        });
      }
      
      return {
        id: quizData.id,
        title: quizData.title,
        description: quizData.description,
        courseId: quizData.course_id,
        type: questions.length > 0 && questions[0].options.filter(o => o.isCorrect).length > 1 ? 
          'multiple-choice' : 'single-choice',
        questions
      };
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error loading quiz",
        description: err.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Create a new quiz
  const createQuiz = async (quiz: Omit<Quiz, 'id'>): Promise<string | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // Insert the quiz first
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .insert({
          title: quiz.title,
          description: quiz.description,
          course_id: quiz.courseId
        })
        .select()
        .single();
        
      if (quizError) throw quizError;
      
      const quizId = quizData.id;
      
      // Insert questions and their options
      for (let i = 0; i < quiz.questions.length; i++) {
        const question = quiz.questions[i];
        
        const { data: questionData, error: questionError } = await supabase
          .from('quiz_questions')
          .insert({
            quiz_id: quizId,
            question: question.question,
            sort_order: i
          })
          .select()
          .single();
          
        if (questionError) throw questionError;
        
        const questionId = questionData.id;
        
        // Insert options for this question
        for (let j = 0; j < question.options.length; j++) {
          const option = question.options[j];
          
          const { error: optionError } = await supabase
            .from('quiz_options')
            .insert({
              question_id: questionId,
              text: option.text,
              is_correct: option.isCorrect,
              sort_order: j
            });
            
          if (optionError) throw optionError;
        }
      }
      
      toast({
        title: "Quiz Created",
        description: `"${quiz.title}" has been created successfully.`
      });
      
      return quizId;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error creating quiz",
        description: err.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Save quiz result
  const saveQuizResult = async (
    quizId: string,
    score: number,
    selectedOptions: Record<string, string[]>
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!userData.user) throw new Error("User is not authenticated");
      
      const { error } = await supabase
        .from('user_quiz_results')
        .insert({
          user_id: userData.user.id,
          quiz_id: quizId,
          score,
          selected_options: selectedOptions
        });
        
      if (error) throw error;
      
      toast({
        title: "Quiz Result Saved",
        description: `Your score: ${score}%`
      });
      
      return true;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error saving quiz result",
        description: err.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Get quiz results for a user
  const getUserQuizResults = async (userId: string): Promise<QuizResult[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('user_quiz_results')
        .select(`
          *,
          quizzes (
            id,
            title,
            description,
            course_id
          )
        `)
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });
        
      if (error) throw error;
      
      return (data || []).map(result => ({
        id: result.id,
        userId: result.user_id,
        quizId: result.quiz_id,
        score: result.score,
        completedAt: result.completed_at,
        selectedOptions: result.selected_options || {}
      }));
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error fetching quiz results",
        description: err.message,
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  return {
    loading,
    error,
    getQuizzesByCourse,
    getQuiz,
    createQuiz,
    saveQuizResult,
    getUserQuizResults
  };
}
