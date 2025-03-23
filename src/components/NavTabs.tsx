
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BookOpen, LayoutDashboard, LogOut, GraduationCap, Settings, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "./ui/avatar";

const NavTabs = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(" ").map(part => part[0]).join("").toUpperCase();
  };
  
  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard, path: "/dashboard" },
    { id: "courses", label: "Courses", icon: BookOpen, path: "/courses" },
    { id: "learning", label: "Learning", icon: GraduationCap, path: "/learning" },
    { id: "profile", label: "Profile", icon: User, path: "/profile" },
    { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
  ];
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };
  
  return (
    <div className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 flex flex-col z-10">
      <div className="p-4 border-b">
        <div className="flex items-center">
          <img src="/lovable-uploads/6ece8a35-f37d-4764-b43e-51c7a78fa8ab.png" alt="Kyureeus Logo" className="h-8" />
        </div>
      </div>
      
      <nav className="flex-1 py-6">
        <ul className="space-y-1">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <li key={tab.id}>
                <button
                  onClick={() => handleNavigate(tab.path)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-gray-100 text-black"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-3" />
                  {tab.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="border-t p-4">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-9 w-9 bg-gray-100 text-gray-600">
            <AvatarFallback>{user?.name ? getInitials(user.name) : "JD"}</AvatarFallback>
          </Avatar>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.name || "John Doe"}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email || "john.doe@example.com"}</p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log out
        </button>
      </div>
    </div>
  );
};

export default NavTabs;
