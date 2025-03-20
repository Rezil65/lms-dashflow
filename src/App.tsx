
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PermissionGuard from "./components/PermissionGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Navigate to="/profile" replace />
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
            
            {/* Admin routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Instructor routes */}
            <Route 
              path="/instructor" 
              element={
                <ProtectedRoute allowedRoles={["instructor"]}>
                  <InstructorDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Learner routes */}
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
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
