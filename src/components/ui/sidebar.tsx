
import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Define sidebar component variants
const sidebarVariants = cva(
  "h-screen bg-sidebar-background text-sidebar-foreground border-r shrink-0",
  {
    variants: {
      variant: {
        default: "w-[250px] lg:w-[280px]",
        minimal: "w-[80px]",
        collapsed: "w-[80px] lg:w-[280px] data-[collapsed=true]:w-[80px] transition-all duration-300",
        floating: "w-[80px] lg:w-[250px] lg:absolute lg:top-4 lg:bottom-4 lg:left-4 lg:z-50 lg:rounded-xl",
        hidden: "w-0 lg:w-[280px] data-[collapsed=true]:w-0 overflow-hidden transition-all duration-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {
  collapsed?: boolean;
}

const SidebarContext = React.createContext({
  collapsed: false,
  setCollapsed: (collapsed: boolean) => {},
  variant: "default" as "default" | "minimal" | "collapsed" | "floating" | "hidden" | null,
});

const useSidebar = () => {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const [variant, setVariant] = React.useState<"default" | "minimal" | "collapsed" | "floating" | "hidden">("default");

  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        setCollapsed,
        variant,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, variant, collapsed: propCollapsed, ...props }, ref) => {
    const { collapsed: contextCollapsed } = useSidebar();
    const collapsed = propCollapsed !== undefined ? propCollapsed : contextCollapsed;

    return (
      <div
        ref={ref}
        className={cn(sidebarVariants({ variant }), className)}
        data-collapsed={collapsed}
        {...props}
      />
    );
  }
);

Sidebar.displayName = "Sidebar";

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center h-16 px-4", className)}
    {...props}
  />
));

SidebarHeader.displayName = "SidebarHeader";

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col flex-1 overflow-auto", className)}
    {...props}
  />
));

SidebarContent.displayName = "SidebarContent";

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center h-16 px-4", className)}
    {...props}
  />
));

SidebarFooter.displayName = "SidebarFooter";

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("py-2", className)}
    {...props}
  />
));

SidebarGroup.displayName = "SidebarGroup";

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { collapsed } = useSidebar();
  
  if (collapsed) {
    return null;
  }
  
  return (
    <div
      ref={ref}
      className={cn(
        "px-4 py-1 text-xs font-medium text-sidebar-foreground/50 uppercase",
        className
      )}
      {...props}
    />
  );
});

SidebarGroupLabel.displayName = "SidebarGroupLabel";

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("", className)}
    {...props}
  />
));

SidebarGroupContent.displayName = "SidebarGroupContent";

interface SidebarMenuProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarMenu = React.forwardRef<HTMLDivElement, SidebarMenuProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-1 px-3", className)}
        {...props}
      />
    );
  }
);

SidebarMenu.displayName = "SidebarMenu";

interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLLIElement> {}

const SidebarMenuItem = React.forwardRef<HTMLLIElement, SidebarMenuItemProps>(
  ({ className, ...props }, ref) => {
    return (
      <li
        ref={ref}
        className={cn("list-none", className)}
        {...props}
      />
    );
  }
);

SidebarMenuItem.displayName = "SidebarMenuItem";

interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  tooltip?: string;
}

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(({ className, isActive = false, tooltip, ...props }, ref) => {
  const { collapsed } = useSidebar();

  const button = (
    <button
      ref={ref}
      className={cn(
        "flex items-center gap-2 w-full py-2 px-3 rounded-md text-sidebar-foreground/80 hover:text-sidebar-foreground transition-colors",
        isActive
          ? "bg-sidebar-accent text-sidebar-primary font-medium"
          : "hover:bg-sidebar-accent/50",
        className
      )}
      {...props}
    />
  );

  if (collapsed && tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right">{tooltip}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
});

SidebarMenuButton.displayName = "SidebarMenuButton";

// Sidebar Trigger to toggle collapse state
interface SidebarTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const SidebarTrigger = React.forwardRef<HTMLButtonElement, SidebarTriggerProps>(
  ({ className, ...props }, ref) => {
    const { collapsed, setCollapsed } = useSidebar();

    return (
      <button
        ref={ref}
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          "h-9 w-9 flex items-center justify-center rounded-md border",
          className
        )}
        {...props}
      >
        {collapsed ? (
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
          >
            <path
              d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        ) : (
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
          >
            <path
              d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        )}
      </button>
    );
  }
);

SidebarTrigger.displayName = "SidebarTrigger";

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
};
