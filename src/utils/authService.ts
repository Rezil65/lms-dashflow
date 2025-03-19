
// This is a mock authentication service for demonstration purposes
// In a real application, this would connect to your backend API

interface AuthResult {
  success: boolean;
  message?: string;
  role?: "admin" | "instructor" | "learner";
  requiresMfa?: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "instructor" | "learner";
  mfaEnabled: boolean;
}

// Mock user database
const users: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    mfaEnabled: true
  },
  {
    id: "2",
    name: "Instructor User",
    email: "instructor@example.com",
    role: "instructor",
    mfaEnabled: true
  },
  {
    id: "3",
    name: "Learner User",
    email: "learner@example.com",
    role: "learner",
    mfaEnabled: false
  }
];

// Store the current user in localStorage (in a real app, use a better state management solution)
export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem("currentUser");
  return userJson ? JSON.parse(userJson) : null;
};

export const authenticateUser = async (email: string, password: string): Promise<AuthResult> => {
  // For demo purposes, any password will work with the predefined emails
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    return {
      success: false,
      message: "User not found"
    };
  }
  
  // Store user info for the session
  localStorage.setItem("currentUser", JSON.stringify(user));
  localStorage.setItem("userRole", user.role);
  
  // If MFA is enabled, require verification
  if (user.mfaEnabled) {
    return {
      success: true,
      role: user.role,
      requiresMfa: true
    };
  }
  
  // If no MFA, login is complete
  return {
    success: true,
    role: user.role
  };
};

export const verifyMfaCode = async (email: string, code: string): Promise<AuthResult> => {
  // For demo purposes, any 6-digit code will work
  if (code.length !== 6) {
    return {
      success: false,
      message: "Invalid code format"
    };
  }
  
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return {
      success: false,
      message: "User not found"
    };
  }
  
  // In a real app, you would validate the code against what was sent or generated
  // For demo, we accept any 6-digit code
  return {
    success: true,
    role: user.role
  };
};

export const setupMfa = async (method: string, verificationCode: string): Promise<AuthResult> => {
  // For demo purposes, any 6-digit code will work
  if (verificationCode.length !== 6) {
    return {
      success: false,
      message: "Invalid code format"
    };
  }
  
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return {
      success: false,
      message: "No user logged in"
    };
  }
  
  // Update the user's MFA status
  currentUser.mfaEnabled = true;
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  
  return {
    success: true
  };
};

export const logout = (): void => {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("userRole");
};

export const checkAuth = (): boolean => {
  return !!getCurrentUser();
};

export const checkRole = (requiredRole: "admin" | "instructor" | "learner"): boolean => {
  const currentUser = getCurrentUser();
  if (!currentUser) return false;
  return currentUser.role === requiredRole;
};
