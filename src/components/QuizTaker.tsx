
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Quiz } from "./QuizManager";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface QuizTakerProps {
  quiz: Quiz;
  onComplete: (score: number, total: number) => void;
}

const QuizTaker = ({ quiz, onComplete }: QuizTakerProps) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSingleOptionSelect = (optionId: string) => {
    setSelectedOptions([optionId]);
  };

  const handleMultipleOptionSelect = (optionId: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedOptions([...selectedOptions, optionId]);
    } else {
      setSelectedOptions(selectedOptions.filter(id => id !== optionId));
    }
  };

  const handleSubmit = () => {
    if (selectedOptions.length === 0) return;

    let correctCount = 0;
    
    // Calculate score
    if (quiz.type === 'multiple-choice') {
      // For multiple choice, check each selected option
      quiz.options.forEach(option => {
        const isSelected = selectedOptions.includes(option.id);
        if ((isSelected && option.isCorrect) || (!isSelected && !option.isCorrect)) {
          correctCount++;
        }
      });
      
      // Score based on percentage of correct decisions
      setScore(Math.round((correctCount / quiz.options.length) * 100));
    } else {
      // For single choice, check if the selected option is correct
      const selectedOption = quiz.options.find(opt => opt.id === selectedOptions[0]);
      if (selectedOption?.isCorrect) {
        correctCount = 1;
        setScore(100);
      } else {
        setScore(0);
      }
    }

    setSubmitted(true);
    onComplete(correctCount, quiz.type === 'multiple-choice' ? quiz.options.length : 1);
  };

  const isOptionCorrect = (option: { id: string; isCorrect: boolean }) => {
    return option.isCorrect;
  };

  const isOptionSelected = (optionId: string) => {
    return selectedOptions.includes(optionId);
  };

  const getOptionStatusClass = (option: { id: string; isCorrect: boolean }) => {
    if (!submitted) return "";

    if (option.isCorrect) {
      return "border-green-500 bg-green-50";
    }
    
    if (isOptionSelected(option.id) && !option.isCorrect) {
      return "border-red-500 bg-red-50";
    }
    
    return "";
  };

  const renderFeedback = () => {
    if (!submitted) return null;
    
    return (
      <Alert variant={score > 70 ? "default" : "destructive"} className="mt-4">
        <div className="flex items-center">
          {score > 70 ? (
            <CheckCircle className="h-5 w-5 mr-2" />
          ) : (
            <AlertCircle className="h-5 w-5 mr-2" />
          )}
          <div>
            <AlertTitle>Quiz Results</AlertTitle>
            <AlertDescription>
              Your score: {score}%
            </AlertDescription>
          </div>
        </div>
      </Alert>
    );
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold">{quiz.title}</h3>
            <Badge variant={quiz.type === 'multiple-choice' ? 'default' : 'outline'}>
              {quiz.type === 'multiple-choice' ? 'Multiple Choice' : 
               quiz.type === 'single-choice' ? 'Single Choice' : 
               quiz.type === 'image' ? 'Image Quiz' : '3D Model Quiz'}
            </Badge>
          </div>
          <p className="text-muted-foreground">{quiz.description}</p>
        </div>

        {quiz.type === 'image' && quiz.imageUrl && (
          <div className="mt-4">
            <img 
              src={quiz.imageUrl} 
              alt="Quiz image" 
              className="max-h-60 object-contain rounded-md mx-auto border"
            />
          </div>
        )}

        {quiz.type === '3d-model' && quiz.modelUrl && (
          <div className="mt-4 border rounded-md p-4 text-center">
            <div className="text-muted-foreground">
              3D model viewer would be displayed here
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="font-medium">
            {quiz.type === 'multiple-choice' 
              ? 'Select all correct answers:' 
              : 'Select the correct answer:'}
          </div>

          {quiz.type === 'single-choice' ? (
            <RadioGroup
              value={selectedOptions[0]}
              onValueChange={handleSingleOptionSelect}
              disabled={submitted}
            >
              <div className="space-y-2">
                {quiz.options.map((option) => (
                  <div
                    key={option.id}
                    className={`flex items-center space-x-2 p-3 border rounded-md ${
                      getOptionStatusClass(option)
                    }`}
                  >
                    <RadioGroupItem value={option.id} id={option.id} disabled={submitted} />
                    <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                      {option.text}
                    </Label>
                    {submitted && option.isCorrect && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {submitted && isOptionSelected(option.id) && !option.isCorrect && (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                ))}
              </div>
            </RadioGroup>
          ) : (
            <div className="space-y-2">
              {quiz.options.map((option) => (
                <div
                  key={option.id}
                  className={`flex items-center space-x-2 p-3 border rounded-md ${
                    getOptionStatusClass(option)
                  }`}
                >
                  <Checkbox
                    id={option.id}
                    checked={isOptionSelected(option.id)}
                    onCheckedChange={(checked) => 
                      handleMultipleOptionSelect(option.id, checked === true)}
                    disabled={submitted}
                  />
                  <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                    {option.text}
                  </Label>
                  {submitted && option.isCorrect && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {submitted && isOptionSelected(option.id) && !option.isCorrect && (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {renderFeedback()}

        <div className="flex justify-end">
          {!submitted ? (
            <Button 
              onClick={handleSubmit} 
              disabled={selectedOptions.length === 0}
            >
              Submit Answer
            </Button>
          ) : (
            <Button variant="outline">
              Next Quiz
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default QuizTaker;
