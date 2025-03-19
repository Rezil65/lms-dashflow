
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { KeyRound, Mail, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

// Validation schema for login form
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Mock user data for demonstration
const mockUsers = [
  { id: 1, email: "admin@example.com", password: "admin123", role: "admin", mfaEnabled: true },
  { id: 2, email: "instructor@example.com", password: "instructor123", role: "instructor", mfaEnabled: false },
  { id: 3, email: "learner@example.com", password: "learner123", role: "learner", mfaEnabled: false },
];

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showMfa, setShowMfa] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { login } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    // Find user in mock data
    const user = mockUsers.find(u => u.email === data.email && u.password === data.password);

    if (!user) {
      toast({
        title: "Authentication Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setCurrentUser(user);

    // Check if MFA is enabled for the user
    if (user.mfaEnabled) {
      setShowMfa(true);
      toast({
        title: "MFA Required",
        description: "Please enter the code sent to your email.",
      });
    } else {
      // If MFA is not enabled, login directly
      completeLogin(user);
    }
  };

  const handleMfaSubmit = () => {
    // Mock MFA verification - in a real app, validate the code against a backend
    if (mfaCode === "123456") {
      completeLogin(currentUser);
    } else {
      toast({
        title: "Invalid MFA Code",
        description: "The code you entered is incorrect. Please try again.",
        variant: "destructive",
      });
    }
  };

  const completeLogin = (user: any) => {
    // Store user info in localStorage for session management
    login({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Show success toast
    toast({
      title: "Login Successful",
      description: `Welcome back, ${user.email}!`,
    });

    // Redirect to the profile page
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Introduction side */}
      <div className="hidden md:flex md:w-1/2 bg-white flex-col justify-center items-center p-10">
        <div className="max-w-md">
          <img 
            src="/lovable-uploads/b4b49a49-4415-4608-919d-8c583dd41903.png" 
            alt="Kyureeus Logo" 
            className="w-full max-w-md mb-8" 
          />
          <h1 className="text-3xl font-bold mb-4">Welcome to Kyureeus LMS</h1>
          <p className="text-gray-600 mb-6">
            Transform your learning experience with our comprehensive learning management system. 
            Designed for students, instructors, and administrators to collaborate seamlessly.
          </p>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Key Features</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="mr-2 mt-1 bg-primary/10 rounded-full p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <span>Personalized learning paths</span>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 bg-primary/10 rounded-full p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <span>Interactive course content</span>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 bg-primary/10 rounded-full p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <span>Progress tracking and analytics</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Login side */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <User className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showMfa ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="example@email.com" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input type="password" placeholder="••••••••" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">Sign In</Button>
                </form>
              </Form>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center mb-4">
                  <ShieldCheck className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-center text-lg font-medium">Two-Factor Authentication</h3>
                <p className="text-center text-sm text-muted-foreground">
                  Enter the 6-digit code sent to your email
                </p>
                <div className="flex justify-center my-4">
                  <Input
                    type="text"
                    className="text-center text-lg w-40"
                    placeholder="123456"
                    maxLength={6}
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value)}
                  />
                </div>
                <Button onClick={handleMfaSubmit} className="w-full">Verify</Button>
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Didn't receive a code? <a href="#" className="text-primary hover:underline">Resend</a>
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              <a href="#" className="text-primary hover:underline">Forgot password?</a>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              <p>For demo purposes, you can use:</p>
              <p><strong>Admin:</strong> admin@example.com / admin123</p>
              <p><strong>Instructor:</strong> instructor@example.com / instructor123</p>
              <p><strong>Learner:</strong> learner@example.com / learner123</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
