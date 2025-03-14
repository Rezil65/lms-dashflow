
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"}`}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <h1 className="text-xl font-display font-semibold text-lms-blue">Kyureeus Learning Portal</h1>
          <p className="text-xs text-muted-foreground hidden sm:block">Your path to tech mastery</p>
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
          <button className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
            <span className="font-medium text-sm">JD</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
