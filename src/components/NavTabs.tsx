
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useRef } from "react";

interface Tab {
  id: string;
  label: string;
}

interface NavTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  tabs?: Tab[];
}

const defaultTabs: Tab[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "courses", label: "Courses" },
  { id: "my-learnings", label: "My Learnings" },
  { id: "learning-paths", label: "Learning Paths" },
  { id: "analytics", label: "Analytics" }
];

const NavTabs = ({ activeTab, onTabChange, tabs = defaultTabs }: NavTabsProps) => {
  const tabsListRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Scroll active tab into view when it changes
    if (tabsListRef.current) {
      const activeTabElement = tabsListRef.current.querySelector(`[data-state="active"]`);
      if (activeTabElement) {
        activeTabElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [activeTab]);
  
  return (
    <div className="bg-background border-b sticky top-0 z-30">
      <div className="container mx-auto px-4">
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <div className="overflow-x-auto" ref={tabsListRef}>
            <TabsList className="py-1 w-auto inline-flex mb-0">
              {tabs.map(tab => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="py-3 px-4 data-[state=active]:bg-background whitespace-nowrap"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default NavTabs;
