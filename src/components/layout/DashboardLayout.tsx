
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { 
  LayoutDashboard, 
  BookOpen, 
  BrainCircuit, 
  GraduationCap,
  Settings,
  HelpCircle,
  LogOut,
  UserCircle,
  Sun,
  Moon
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/use-theme";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Logout failed",
        description: "There was an issue logging you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <Sidebar className="border-r shadow-sm">
        {/* Logo area */}
        <SidebarHeader className="flex justify-center py-4">
          <div onClick={() => navigate("/dashboard")} className="flex items-center cursor-pointer">
            <div className="text-primary h-10 w-10 flex items-center justify-center rounded-md">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.89 10.55C20.89 10.55 20.96 10 20.96 9.77V8.31C20.96 5.61 18.84 2 13.4 2C7.96 2 5.84 5.61 5.84 8.31V9.77C5.84 10 5.91 10.55 5.91 10.55C3.17 11.18 2 12.61 2 15.32V17.75C2 21.3 3.28 22 7.96 22H18.84C23.52 22 24.8 21.3 24.8 17.75V15.32C24.8 12.61 23.63 11.18 20.89 10.55ZM13.4 18.86C12.01 18.86 10.89 17.74 10.89 16.36C10.89 14.97 12.01 13.85 13.4 13.85C14.79 13.85 15.91 14.97 15.91 16.36C15.91 17.74 14.79 18.86 13.4 18.86ZM18.54 10.4H8.26V8.31C8.26 6.72 9.77 4.42 13.4 4.42C17.03 4.42 18.54 6.72 18.54 8.31V10.4Z" 
                  className="fill-primary" />
              </svg>
            </div>
            <div className="text-xl font-semibold ml-2 text-foreground">Acorn</div>
          </div>
        </SidebarHeader>

        {/* User Profile */}
        <SidebarContent className="pt-4">
          <div className="flex flex-col items-center justify-center mb-6">
            <Avatar className="h-16 w-16 border-2 border-primary transition-all duration-300">
              <img src="/public/lovable-uploads/79b57a48-41b3-47a6-aba3-8cf20a45a438.png" alt="User" />
            </Avatar>
            <h3 className="mt-2 font-medium text-sm">
              {user?.name || 'Lisa Jackson'}
            </h3>
          </div>

          {/* Main Navigation */}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive("/dashboard")} 
                onClick={() => handleNavigation("/dashboard")}
                className="hover:bg-secondary/50"
              >
                <LayoutDashboard className="h-5 w-5 mr-3" />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive("/courses")} 
                onClick={() => handleNavigation("/courses")}
                className="hover:bg-secondary/50"
              >
                <BookOpen className="h-5 w-5 mr-3" />
                <span>Courses</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive("/quiz")} 
                onClick={() => handleNavigation("/quiz")}
                className="hover:bg-secondary/50"
              >
                <BrainCircuit className="h-5 w-5 mr-3" />
                <span>Quizzes</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive("/paths")} 
                onClick={() => handleNavigation("/paths")}
                className="hover:bg-secondary/50"
              >
                <GraduationCap className="h-5 w-5 mr-3" />
                <span>Learning Paths</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive("/settings")} 
                onClick={() => handleNavigation("/settings")}
                className="hover:bg-secondary/50"
              >
                <Settings className="h-5 w-5 mr-3" />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive("/help")} 
                onClick={() => handleNavigation("/help")}
                className="hover:bg-secondary/50"
              >
                <HelpCircle className="h-5 w-5 mr-3" />
                <span>Help</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>

        {/* Footer with theme toggle and logout */}
        <SidebarFooter className="mt-auto border-t border-border pt-4 pb-6">
          <div className="px-4 flex justify-between">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  aria-label="User menu"
                >
                  <UserCircle className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem 
                  className="cursor-pointer" 
                  onClick={() => navigate("/profile")}
                >
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer text-destructive" 
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SidebarFooter>
      </Sidebar>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
