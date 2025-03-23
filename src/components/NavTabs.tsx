
import { useState } from "react";
import { ChartBar, Compass, LayoutDashboard } from "lucide-react";

const NavTabs = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "my-learnings", label: "My Learnings", icon: Compass },
    { id: "learning-paths", label: "Learning Paths", icon: ChartBar },
    { id: "analytics", label: "Analytics", icon: ChartBar },
  ];
  
  return (
    <div className="border-b">
      <div className="container mx-auto px-4">
        <nav className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium flex items-center transition-all ${
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
