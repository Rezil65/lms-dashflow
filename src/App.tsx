
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
import Login from "./pages/Login";
import MfaSetup from "./pages/MfaSetup";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import PermissionGuard from "./components/PermissionGuard";
import Dashboard from "./pages/Dashboard";
import LearningHub from "./pages/LearningHub";
import QuizPage from "./pages/QuizPage";
import QuizTakePage from "./pages/QuizTakePage";
import LearningPathsPage from "./pages/LearningPathsPage";
import CoursesPage from "./pages/CoursesPage";
import MiscellaneousPage from "./pages/MiscellaneousPage";
import SettingsPage from "./pages/SettingsPage";
import HelpPage from "./pages/HelpPage";
import LearnerDashboard from "./pages/LearnerDashboard";

const App = () => (
  <ThemeProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* Learner Dashboard */}
        <Route 
          path="/learner" 
          element={
            <ProtectedRoute>
              <LearnerDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Courses Page */}
        <Route 
          path="/courses" 
          element={
            <ProtectedRoute>
              <CoursesPage />
            </ProtectedRoute>
          } 
        />

        {/* Miscellaneous Page */}
        <Route 
          path="/miscellaneous" 
          element={
            <ProtectedRoute>
              <MiscellaneousPage />
            </ProtectedRoute>
          } 
        />

        {/* Settings Page */}
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } 
        />

        {/* Help Page */}
        <Route 
          path="/help" 
          element={
            <ProtectedRoute>
              <HelpPage />
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
        
        {/* Admin Dashboard and Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* New Admin Course Routes */}
        <Route 
          path="/admin/courses" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard defaultTab="courses" />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/courses/new" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <CourseCreation />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/courses/edit/:id" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <CourseCreation />
            </ProtectedRoute>
          } 
        />
        
        {/* Instructor Dashboard */}
        <Route 
          path="/instructor" 
          element={
            <ProtectedRoute allowedRoles={["instructor"]}>
              <InstructorDashboard />
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
        
        {/* Legacy route - redirect to new admin route */}
        <Route 
          path="/create-course" 
          element={
            <Navigate to="/admin/courses/new" replace />
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
