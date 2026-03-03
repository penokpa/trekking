"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Mountain,
  FileText,
  Image,
  Users,
  HelpCircle,
  Star,
  File,
  Flag,
  MessageSquare,
  BarChart3,
  Settings,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { dashboardNavItems } from "@/lib/constants";
import type { NavItem } from "@/types";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Mountain,
  FileText,
  Image,
  Users,
  HelpCircle,
  Star,
  File,
  Flag,
  MessageSquare,
  BarChart3,
  Settings,
};

interface DashboardSidebarProps {
  agencyName?: string;
}

function NavLink({
  item,
  isActive,
  isCollapsed,
}: {
  item: NavItem;
  isActive: boolean;
  isCollapsed: boolean;
}) {
  const Icon = item.icon ? iconMap[item.icon] : null;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        isActive
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground",
        isCollapsed && "justify-center px-2"
      )}
      title={isCollapsed ? item.title : undefined}
    >
      {Icon && <Icon className="size-4 shrink-0" />}
      {!isCollapsed && <span>{item.title}</span>}
      {!isCollapsed && item.badge && (
        <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

function SidebarContent({
  agencyName,
  isCollapsed,
  onToggleCollapse,
}: {
  agencyName: string;
  isCollapsed: boolean;
  onToggleCollapse?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          "flex h-14 items-center border-b px-4",
          isCollapsed ? "justify-center" : "justify-between"
        )}
      >
        {!isCollapsed && (
          <span className="truncate text-sm font-semibold">{agencyName}</span>
        )}
        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft
              className={cn(
                "size-4 transition-transform",
                isCollapsed && "rotate-180"
              )}
            />
          </Button>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {dashboardNavItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            isActive={pathname === item.href}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>
    </div>
  );
}

export function DashboardSidebar({ agencyName = "My Agency" }: DashboardSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Mobile sidebar using Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed left-4 top-3 z-40"
            aria-label="Open navigation menu"
          >
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent agencyName={agencyName} isCollapsed={false} />
        </SheetContent>
      </Sheet>

      {/* Desktop fixed sidebar */}
      <aside
        className={cn(
          "hidden md:flex h-screen flex-col border-r bg-background transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <SidebarContent
          agencyName={agencyName}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
        />
      </aside>
    </>
  );
}
