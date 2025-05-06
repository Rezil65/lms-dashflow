
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
  Moon,
  Menu,
  ChevronLeft
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
  const [collapsed, setCollapsed] = useState(false);
  
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

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <Sidebar 
        className={`border-r shadow-sm transition-all duration-300 ${
          collapsed ? "w-[80px]" : "w-[250px]"
        }`}
      >
        {/* Logo area */}
        <SidebarHeader className="flex justify-center py-4 relative">
          <div onClick={() => navigate("/dashboard")} className="flex items-center cursor-pointer px-2">
            {!collapsed && (
              <>
                <div className="flex items-center">
                  <img 
                    src="/lovable-uploads/b4b49a49-4415-4608-919d-8c583dd41903.png" 
                    alt="Kyureeus Logo" 
                    className="h-10"
                  />
                </div>
                <div className="ml-2 text-xl font-semibold text-foreground">Kyureeus</div>
              </>
            )}
            {collapsed && (
              <img 
                src="/lovable-uploads/b4b49a49-4415-4608-919d-8c583dd41903.png" 
                alt="Kyureeus Logo" 
                className="h-10"
              />
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-4"
            onClick={toggleSidebar}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </SidebarHeader>

        {/* User Profile */}
        <SidebarContent className="pt-4">
          <div className={`flex ${collapsed ? "justify-center" : "flex-col items-center"} mb-6`}>
            <Avatar className={`${collapsed ? "h-10 w-10" : "h-16 w-16"} border-2 border-primary transition-all duration-300`}>
              <img src="/public/lovable-uploads/79b57a48-41b3-47a6-aba3-8cf20a45a438.png" alt="User" />
            </Avatar>
            {!collapsed && (
              <h3 className="mt-2 font-medium text-sm">
                {user?.name || 'Lisa Jackson'}
              </h3>
            )}
          </div>

          {/* Main Navigation */}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive("/dashboard")} 
                onClick={() => handleNavigation("/dashboard")}
                className="hover:bg-sidebar-accent/70 transition-colors duration-200"
                tooltip={collapsed ? "Dashboard" : undefined}
              >
                <LayoutDashboard className="h-5 w-5 mr-3" />
                {!collapsed && <span>Dashboard</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive("/courses")} 
                onClick={() => handleNavigation("/courses")}
                className="hover:bg-sidebar-accent/70 transition-colors duration-200"
                tooltip={collapsed ? "Courses" : undefined}
              >
                <BookOpen className="h-5 w-5 mr-3" />
                {!collapsed && <span>Courses</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive("/quiz")} 
                onClick={() => handleNavigation("/quiz")}
                className="hover:bg-sidebar-accent/70 transition-colors duration-200"
                tooltip={collapsed ? "Quizzes" : undefined}
              >
                <BrainCircuit className="h-5 w-5 mr-3" />
                {!collapsed && <span>Quizzes</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive("/paths")} 
                onClick={() => handleNavigation("/paths")}
                className="hover:bg-sidebar-accent/70 transition-colors duration-200"
                tooltip={collapsed ? "Learning Paths" : undefined}
              >
                <GraduationCap className="h-5 w-5 mr-3" />
                {!collapsed && <span>Learning Paths</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive("/settings")} 
                onClick={() => handleNavigation("/settings")}
                className="hover:bg-sidebar-accent/70 transition-colors duration-200"
                tooltip={collapsed ? "Settings" : undefined}
              >
                <Settings className="h-5 w-5 mr-3" />
                {!collapsed && <span>Settings</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive("/help")} 
                onClick={() => handleNavigation("/help")}
                className="hover:bg-sidebar-accent/70 transition-colors duration-200"
                tooltip={collapsed ? "Help" : undefined}
              >
                <HelpCircle className="h-5 w-5 mr-3" />
                {!collapsed && <span>Help</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>

        {/* Footer with theme toggle and logout */}
        <SidebarFooter className="mt-auto border-t border-border pt-4 pb-6">
          <div className={`${collapsed ? "flex justify-center" : "px-4 flex justify-between"}`}>
            {!collapsed && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            )}
            
            {collapsed ? (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleLogout}
                aria-label="Logout"
                className="text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            ) : (
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
            )}
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
