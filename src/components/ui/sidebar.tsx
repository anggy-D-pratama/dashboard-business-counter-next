"use client";

import * as React from "react";

type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}

export function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className = "",
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [_open, _setOpen] = React.useState(defaultOpen);
  const [openMobile, setOpenMobile] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  const open = openProp !== undefined ? openProp : _open;
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }
    },
    [setOpenProp, open]
  );

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((prev) => !prev) : setOpen((prev) => !prev);
  }, [isMobile, setOpen]);

  const state = open ? "expanded" : "collapsed";

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, toggleSidebar]
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        data-state={state}
        className={`group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar ${className}`}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    collapsible?: "offcanvas" | "icon" | "none";
  }
>(({ collapsible = "icon", className = "", children, ...props }, ref) => {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (collapsible === "none") {
    return (
      <div
        ref={ref}
        className={`flex h-full w-[260px] flex-col bg-card border-r border-border ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && openMobile && (
        <div
          onClick={() => setOpenMobile(false)}
          className="fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden"
        />
      )}

      <aside
        ref={ref}
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        className={`
          fixed top-0 bottom-0 left-0 z-40 flex flex-col border-r border-border bg-white transition-[width,transform] duration-200 ease-in-out
          ${
            isMobile
              ? openMobile
                ? "translate-x-0 w-[260px]"
                : "-translate-x-full w-[260px]"
              : state === "collapsed"
              ? "w-[68px]"
              : "w-[260px]"
          }
          ${className}
        `}
        {...props}
      >
        {children}
      </aside>
    </>
  );
});
Sidebar.displayName = "Sidebar";

export const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className = "", onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      ref={ref}
      type="button"
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      aria-label="Toggle Sidebar"
      className={`inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
      {...props}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth="2"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <path d="M9 3v18" />
        <path d="m14 9 3 3-3 3" />
      </svg>
    </button>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

export const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className = "", children, ...props }, ref) => {
  const { isMobile, state } = useSidebar();

  const marginLeftClass = isMobile
    ? "ml-0"
    : state === "collapsed"
    ? "md:ml-[68px]"
    : "md:ml-[260px]";

  return (
    <div
      ref={ref}
      className={`relative flex min-h-screen flex-1 flex-col transition-[margin] duration-200 ease-in-out min-w-0 ${marginLeftClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});
SidebarInset.displayName = "SidebarInset";
