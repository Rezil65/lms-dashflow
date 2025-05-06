
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "@/hooks/use-quiz";
import { useEffect, useState } from "react";
import { Clock, FileText, Play, CheckCircle, Award } from "lucide-react";

const QuizPage = () => {
  const navigate = useNavigate();
  const { getQuizzesByCourse } = useQuiz();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('available');

  useEffect(() => {
    // In a real app, we would fetch quizzes from multiple courses
    // For now we're just getting quizzes from a sample course
    const fetchQuizzes = async () => {
      try {
        // You can replace this with your own course ID
        const sampleCourseId = "course1";
        const coursesQuizzes = await getQuizzesByCourse(sampleCourseId);
        setQuizzes(coursesQuizzes || []);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
  }, [getQuizzesByCourse]);

  // Mock quiz results for the completed tab
  const mockResults = [
    {
      id: "result1",
      quizId: "quiz1",
      title: "Introduction to Bread Making",
      score: 85,
      totalQuestions: 20,
      completedAt: "2023-05-15T10:30:00Z",
      timeTaken: "8m 20s"
    },
    {
      id: "result2",
      quizId: "quiz2",
      title: "Advanced Baking Techniques",
      score: 92,
      totalQuestions: 15,
      completedAt: "2023-05-10T14:45:00Z",
      timeTaken: "6m 10s"
    }
  ];

  const handleStartQuiz = (quizId: string) => {
    navigate(`/quiz/${quizId}`);
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold">Quiz Center</h1>
          <p className="text-muted-foreground">Test your knowledge and track your progress</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="available">Available Quizzes</TabsTrigger>
            <TabsTrigger value="completed">Completed Quizzes</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quizzes.length > 0 ? (
                quizzes.map((quiz) => (
                  <Card key={quiz.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{quiz.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {quiz.description || "Test your knowledge with this quiz"}
                      </p>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {quiz.questions?.length || 0} questions
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {Math.ceil((quiz.questions?.length || 0) * 0.5)}m
                        </Badge>
                        <Badge variant="secondary">
                          {quiz.questions?.length < 10 ? 'Beginner' : quiz.questions?.length < 20 ? 'Intermediate' : 'Advanced'}
                        </Badge>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={() => handleStartQuiz(quiz.id)} 
                        className="w-full"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Quiz
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium">No quizzes available</h3>
                  <p className="text-muted-foreground mt-1">
                    Check back later for new quizzes or enroll in more courses.
                  </p>
                </div>
              )}

              {/* Example Quiz Cards for UI demo */}
              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Basic Introduction to Bread Making Techniques</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Test your knowledge of fundamental bread making techniques.
                  </p>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      25 questions
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      15m
                    </Badge>
                    <Badge variant="secondary">Beginner</Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleStartQuiz('demo1')} className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Start Quiz
                  </Button>
                </CardFooter>
              </Card>

              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Advanced Ingredients Quiz</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Test your knowledge on exotic and specialized baking ingredients.
                  </p>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      18 questions
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      10m
                    </Badge>
                    <Badge variant="secondary">Advanced</Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleStartQuiz('demo2')} className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Start Quiz
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockResults.map((result) => (
                <Card key={result.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg">{result.title}</CardTitle>
                      <Badge 
                        className={result.score >= 80 ? 'bg-green-500' : result.score >= 60 ? 'bg-amber-500' : 'bg-red-500'}
                      >
                        {result.score}%
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Completed on {new Date(result.completedAt).toLocaleDateString()}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>
                            {Math.round((result.score / 100) * result.totalQuestions)} of {result.totalQuestions} correct
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{result.timeTaken}</span>
                        </div>
                      </div>
                      
                      {result.score >= 80 && (
                        <div className="flex items-center gap-2 text-amber-500">
                          <Award className="h-4 w-4" />
                          <span className="text-sm font-medium">Achievement Unlocked: Quiz Master</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => handleStartQuiz(result.quizId)}>
                      Take Again
                    </Button>
                    <Button variant="secondary" onClick={() => navigate(`/quiz/results/${result.id}`)}>
                      View Results
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default QuizPage;
