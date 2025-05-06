
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import { Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import CourseDetail from "./pages/CourseDetail";
import CourseCreation from "./pages/CourseCreation";
import CourseContent from "./pages/CourseContent";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import LearnerDashboard from "./pages/LearnerDashboard";
import Login from "./pages/Login";
import MfaSetup from "./pages/MfaSetup";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import PermissionGuard from "./components/PermissionGuard";
import UserDashboard from "@/components/layout/UserDashboard";
import LearningHub from "@/pages/LearningHub";
import QuizPage from "./pages/QuizPage";
import QuizTakePage from "./pages/QuizTakePage";
import LearningPathsPage from "./pages/LearningPathsPage";

const App = () => (
  <ThemeProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          } 
        />
        
        {/* New Modern Dashboard */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Learning Hub - Course Content Viewer */}
        <Route 
          path="/course/:courseId/learn/:contentId?" 
          element={
            <ProtectedRoute>
              <LearningHub />
            </ProtectedRoute>
          } 
        />

        {/* Quiz Routes */}
        <Route 
          path="/quiz" 
          element={
            <ProtectedRoute>
              <QuizPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/quiz/:quizId" 
          element={
            <ProtectedRoute>
              <QuizTakePage />
            </ProtectedRoute>
          } 
        />

        {/* Learning Paths */}
        <Route 
          path="/paths" 
          element={
            <ProtectedRoute>
              <LearningPathsPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Profile page */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        
        {/* Legacy Dashboard Pages */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/instructor" 
          element={
            <ProtectedRoute allowedRoles={["instructor"]}>
              <InstructorDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/learner" 
          element={
            <ProtectedRoute allowedRoles={["learner"]}>
              <LearnerDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Course routes */}
        <Route 
          path="/course/:id" 
          element={
            <ProtectedRoute>
              <CourseDetail />
            </ProtectedRoute>
          } 
        />
        
        {/* Course content routes with permission guards */}
        <Route 
          path="/course/:id/content" 
          element={
            <PermissionGuard 
              requiredPermissions={["manage_courses", "edit_course_modules", "manage_own_courses", "view_course_modules"]}
            >
              <CourseContent />
            </PermissionGuard>
          } 
        />
        
        <Route 
          path="/create-course" 
          element={
            <PermissionGuard 
              requiredPermissions={["manage_courses", "manage_own_courses"]} 
              redirectTo="/admin"
            >
              <CourseCreation />
            </PermissionGuard>
          } 
        />
        
        {/* MFA setup */}
        <Route 
          path="/mfa-setup" 
          element={
            <ProtectedRoute>
              <MfaSetup />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </ThemeProvider>
);

export default App;
