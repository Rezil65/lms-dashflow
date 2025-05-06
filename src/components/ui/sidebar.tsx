
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* === Sidebar === */
export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof sidebarVariants> {
  collapsed?: boolean;
}

const sidebarVariants = cva(
  "flex flex-col h-full border-r transition-all duration-300 bg-card",
  {
    variants: {
      variant: {
        default: "w-64",
        floating: "rounded-r-xl shadow-lg w-60",
        mini: "w-[4.5rem]",
      },
      collapsed: {
        true: "w-[4.5rem]",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      collapsed: false,
    },
  }
);

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, variant, collapsed, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(sidebarVariants({ variant, collapsed }), className)}
        {...props}
      />
    );
  }
);
Sidebar.displayName = "Sidebar";

/* === SidebarHeader === */
export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("px-4 py-3", className)} {...props} />;
});
SidebarHeader.displayName = "SidebarHeader";

/* === SidebarContent === */
export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("flex-1 overflow-auto py-2", className)} {...props} />;
});
SidebarContent.displayName = "SidebarContent";

/* === SidebarFooter === */
export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("px-4 py-3", className)} {...props} />;
});
SidebarFooter.displayName = "SidebarFooter";

/* === SidebarGroup === */
export interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  icon?: React.ReactNode;
}

export const SidebarGroup = React.forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ className, label, icon, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("py-2", className)} {...props}>
        {(label || icon) && <SidebarGroupLabel icon={icon}>{label}</SidebarGroupLabel>}
        {children}
      </div>
    );
  }
);
SidebarGroup.displayName = "SidebarGroup";

/* === SidebarGroupLabel === */
export interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
}

export const SidebarGroupLabel = React.forwardRef<HTMLDivElement, SidebarGroupLabelProps>(
  ({ className, icon, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-2 px-4 py-1 text-xs font-medium text-muted-foreground", className)}
        {...props}
      >
        {icon}
        {children}
      </div>
    );
  }
);
SidebarGroupLabel.displayName = "SidebarGroupLabel";

/* === SidebarGroupContent === */
export const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("", className)} {...props} />;
});
SidebarGroupContent.displayName = "SidebarGroupContent";

/* === SidebarMenu === */
export const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("space-y-1 px-2", className)} {...props} />;
});
SidebarMenu.displayName = "SidebarMenu";

/* === SidebarMenuItem === */
export const SidebarMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("", className)} {...props} />;
});
SidebarMenuItem.displayName = "SidebarMenuItem";

/* === SidebarMenuButton === */
export interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  tooltip?: string;
  asChild?: boolean;
}

export const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, isActive = false, tooltip, asChild = false, ...props }, ref) => {
    const Comp = asChild ? React.Fragment : "button";
    const buttonProps = asChild ? {} : { ref, ...props };
    const button = (
      <Comp
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
          isActive
            ? "bg-accent text-accent-foreground hover:bg-accent/80"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
          className
        )}
        {...buttonProps}
      >
        {/* For child components like anchors (<a>) */}
        {asChild ? React.cloneElement(props.children as React.ReactElement, { ref }) : props.children}
      </Comp>
    );

    if (tooltip) {
      return (
        <div className="group relative">
          {button}
          <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            <div className="bg-popover text-popover-foreground px-2 py-1 text-xs rounded-md shadow whitespace-nowrap">
              {tooltip}
            </div>
          </div>
        </div>
      );
    }

    return button;
  }
);
SidebarMenuButton.displayName = "SidebarMenuButton";

/* === SidebarTrigger === */
export interface SidebarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const SidebarTrigger = React.forwardRef<HTMLButtonElement, SidebarTriggerProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn("inline-flex items-center justify-center rounded-md text-sm font-medium", className)}
        {...props}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
          <line x1="9" x2="9" y1="3" y2="21"></line>
        </svg>
        <span className="sr-only">Toggle Sidebar</span>
      </button>
    );
  }
);
SidebarTrigger.displayName = "SidebarTrigger";

/* === SidebarProvider === */
interface SidebarContextValue {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  toggleCollapsed: () => void;
}

const SidebarContext = React.createContext<SidebarContextValue | undefined>(undefined);

export function SidebarProvider({
  children,
  defaultCollapsed = false,
}: {
  children: React.ReactNode;
  defaultCollapsed?: boolean;
}) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);

  const toggleCollapsed = React.useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        setCollapsed,
        toggleCollapsed,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
