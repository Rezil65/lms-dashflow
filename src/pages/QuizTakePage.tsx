
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { useQuiz } from "@/hooks/use-quiz";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { QuizQuestion as QuizQuestionType } from "@/hooks/use-quiz";
import { SuperQuizPlayer } from "@/components/quiz/SuperQuizPlayer";

const QuizTakePage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { getQuizById, submitQuizResult } = useQuiz();
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (quizId) {
        try {
          const quizData = await getQuizById(quizId);
          if (quizData) {
            setQuiz(quizData);
          } else {
            // Handle quiz not found
            console.error("Quiz not found");
          }
        } catch (error) {
          console.error("Error fetching quiz:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchQuiz();
  }, [quizId, getQuizById]);

  const handleQuizComplete = async (score: number, answers: Record<string, string[]>) => {
    if (quizId) {
      try {
        await submitQuizResult({
          quizId,
          score,
          totalQuestions: quiz?.questions?.length || 0,
          selectedOptions: answers,
        });
        
        // Wait a bit before navigating to ensure the submission is processed
        setTimeout(() => {
          navigate('/quiz?tab=completed');
        }, 1500);
      } catch (error) {
        console.error("Error submitting quiz result:", error);
      }
    }
  };

  // For demo purposes, let's provide a sample quiz if the real one is not loaded
  const demoQuiz = {
    id: "demoQuiz",
    title: "Demo Quiz on Baking Techniques",
    description: "Test your knowledge about various baking techniques",
    questions: [
      {
        id: "q1",
        question: "What is the process of mixing ingredients by gently turning them over with a spoon or spatula?",
        type: "single-choice" as "single-choice",
        options: [
          { id: "a1", text: "Beating", isCorrect: false },
          { id: "a2", text: "Folding", isCorrect: true },
          { id: "a3", text: "Whipping", isCorrect: false },
          { id: "a4", text: "Stirring", isCorrect: false }
        ]
      },
      {
        id: "q2",
        question: "Which of the following are common leavening agents used in baking? (Select all that apply)",
        type: "multiple-choice" as "multiple-choice",
        options: [
          { id: "b1", text: "Baking powder", isCorrect: true },
          { id: "b2", text: "Baking soda", isCorrect: true },
          { id: "b3", text: "Cornstarch", isCorrect: false },
          { id: "b4", text: "Yeast", isCorrect: true }
        ]
      },
      {
        id: "q3",
        question: "Room temperature for butter in baking recipes typically means around:",
        type: "single-choice" as "single-choice", 
        options: [
          { id: "c1", text: "35-40°F (1-4°C)", isCorrect: false },
          { id: "c2", text: "45-50°F (7-10°C)", isCorrect: false },
          { id: "c3", text: "65-70°F (18-21°C)", isCorrect: true },
          { id: "c4", text: "80-85°F (26-29°C)", isCorrect: false }
        ]
      },
      {
        id: "q4",
        question: "Blind baking refers to:",
        type: "single-choice" as "single-choice",
        options: [
          { id: "d1", text: "Baking without looking at the recipe", isCorrect: false },
          { id: "d2", text: "Baking a pie crust without the filling", isCorrect: true },
          { id: "d3", text: "Baking in a dark kitchen", isCorrect: false },
          { id: "d4", text: "Testing a recipe without knowing the outcome", isCorrect: false }
        ]
      },
      {
        id: "q5",
        question: "True or False: When making bread, it's best to knead the dough until it's completely smooth and elastic.",
        type: "true-false" as "true-false",
        options: [
          { id: "e1", text: "True", isCorrect: true },
          { id: "e2", text: "False", isCorrect: false }
        ]
      }
    ]
  };

  const quizToShow = quiz || demoQuiz;

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/quiz')} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Quizzes
          </Button>
          <h1 className="text-2xl font-semibold">{loading ? "Loading Quiz..." : quizToShow.title}</h1>
        </div>

        {loading ? (
          <Card className="p-8 flex justify-center items-center">
            <div className="animate-pulse text-center">
              <div className="h-6 w-32 bg-muted rounded mb-4 mx-auto"></div>
              <div className="h-4 w-64 bg-muted rounded mb-2 mx-auto"></div>
              <div className="h-4 w-48 bg-muted rounded mx-auto"></div>
            </div>
          </Card>
        ) : (
          <SuperQuizPlayer 
            title={quizToShow.title}
            description={quizToShow.description}
            questions={quizToShow.questions as QuizQuestionType[]}
            timeLimit={quizToShow.questions.length * 30} // 30 seconds per question
            onComplete={handleQuizComplete}
            preventCheating={true}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default QuizTakePage;
