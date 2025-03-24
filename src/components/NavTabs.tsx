
import { useState } from "react";
import { ChartBar, Compass, GraduationCap, LayoutDashboard } from "lucide-react";

interface NavTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const NavTabs = ({ activeTab, onTabChange }: NavTabsProps) => {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "courses", label: "Courses", icon: Compass },
    { id: "my-learnings", label: "My Learnings", icon: GraduationCap },
    { id: "learning-paths", label: "Learning Paths", icon: ChartBar },
    { id: "analytics", label: "Analytics", icon: ChartBar },
  ];
  
  return (
    <div className="border-b sticky top-0 z-10 bg-background">
      <div className="container mx-auto px-4 overflow-x-auto">
        <nav className="flex space-x-1 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-3 text-sm font-medium flex items-center transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default NavTabs;
