
import { Search, User, LogOut, ChevronDown } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };
  
  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"}`}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/b4b49a49-4415-4608-919d-8c583dd41903.png" 
              alt="Kyureeus Logo" 
              className="h-8"
            />
          </div>
          <div>
            <h1 className="text-xl font-display font-semibold text-lms-blue">Learning Portal</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">Your path to tech mastery</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative hidden md:flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search courses..." 
              className="bg-muted/50 pl-9 pr-4 py-2 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary/20 w-[180px] lg:w-[220px] transition-all" 
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-2 focus:outline-none">
                <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                  <span className="font-medium text-sm">{user?.name ? user.name.charAt(0) + (user.name.split(' ')[1]?.charAt(0) || '') : 'U'}</span>
                </div>
                <span className="hidden sm:inline-flex items-center text-sm font-medium">
                  {user?.name || user?.email || 'User'}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5 text-sm font-medium">My Account</div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileClick}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
