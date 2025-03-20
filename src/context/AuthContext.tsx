
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define user types and roles
export type UserRole = "admin" | "instructor" | "learner";

export interface User {
  id: number;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define permissions for each role
const rolePermissions: Record<UserRole, string[]> = {
  admin: [
    "view_dashboard", 
    "manage_users", 
    "manage_courses", 
    "manage_content", 
    "view_analytics", 
    "manage_settings",
    "send_communications", 
    "manage_payments", 
    "manage_roles",
    "edit_course_modules",
    "edit_course_resources",
    "add_course_modules",
    "delete_course_modules",
    "manage_certificates"
  ],
  instructor: [
    "view_dashboard", 
    "view_users", 
    "manage_own_courses", 
    "manage_own_content", 
    "view_course_analytics", 
    "send_communications",
    "edit_course_modules",
    "edit_course_resources",
    "add_course_modules"
  ],
  learner: [
    "view_dashboard", 
    "view_courses", 
    "view_own_progress", 
    "submit_assignments", 
    "view_catalog",
    "view_course_modules",
    "view_course_resources"
  ],
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing user session in localStorage on mount
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    const userPermissions = rolePermissions[user.role];
    return userPermissions.includes(permission);
  };
  
  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    
    return user.role === role;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, hasPermission, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
