
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, CheckCircle2 } from "lucide-react";
import { Quiz } from "./QuizManager";
import { useNavigate } from "react-router-dom";

interface QuizzesProps {
  isPreview?: boolean;
  courseId?: string;
}

const Quizzes = ({ isPreview = false, courseId }: QuizzesProps) => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulating API call to fetch quizzes
    const fetchQuizzes = async () => {
      setLoading(true);
      
      // Mock data
      const mockQuizzes: Quiz[] = [
        {
          id: "quiz1",
          title: "HTML Basics Quiz",
          description: "Test your knowledge of HTML fundamentals",
          type: "multiple-choice",
          options: [
            { id: "opt1", text: "Option 1", isCorrect: false },
            { id: "opt2", text: "Option 2", isCorrect: true },
          ],
          courseId: "course1"
        },
        {
          id: "quiz2",
          title: "CSS Properties Quiz",
          description: "Test your understanding of CSS properties and values",
          type: "single-choice",
          options: [
            { id: "opt1", text: "Option 1", isCorrect: true },
            { id: "opt2", text: "Option 2", isCorrect: false },
          ],
          courseId: "course1"
        },
        {
          id: "quiz3",
          title: "JavaScript Functions",
          description: "Test your knowledge of JavaScript functions and scope",
          type: "multiple-choice",
          options: [
            { id: "opt1", text: "Option 1", isCorrect: false },
            { id: "opt2", text: "Option 2", isCorrect: true },
          ],
          courseId: "course2"
        }
      ];
      
      setTimeout(() => {
        setQuizzes(isPreview ? mockQuizzes.slice(0, 2) : mockQuizzes);
        setLoading(false);
      }, 500);
    };
    
    fetchQuizzes();
  }, [isPreview]);

  const handleTakeQuiz = (quizId: string) => {
    // Navigate to quiz taking page (to be implemented)
    navigate(`/course/${courseId || 'default'}/quiz/${quizId}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Available Quizzes</h3>
        {isPreview && (
          <Button variant="ghost" size="sm" className="text-sm">
            View All <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
      
      {loading ? (
        <div className="space-y-4">
          <div className="h-24 rounded-md bg-gray-100 animate-pulse"></div>
          <div className="h-24 rounded-md bg-gray-100 animate-pulse"></div>
        </div>
      ) : quizzes.length > 0 ? (
        <div className="space-y-3">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-md">{quiz.title}</h4>
                      <Badge variant="outline" className="ml-auto capitalize">
                        {quiz.type === 'multiple-choice' ? 'Multiple Choice' : 'Single Choice'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {quiz.description}
                    </p>
                    <div className="flex items-center justify-end mt-3">
                      <Button 
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => handleTakeQuiz(quiz.id)}
                      >
                        Take Quiz
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border rounded-md bg-gray-50">
          <p className="text-muted-foreground">No quizzes available</p>
        </div>
      )}
    </div>
  );
};

export default Quizzes;
