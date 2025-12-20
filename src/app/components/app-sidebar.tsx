"use client";
import { Home, User, Calendar, HelpCircle, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthContext } from "@/providers/authProvider"; // for logout function

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar(); // "expanded" or "collapsed"
  const { logout, user } = useAuthContext(); // assume this exists

  // build base path depending on role
  const basePath = user?.role === "expert" ? "/expert" : "/student";

  const items = [
    { title: "Home", url: `${basePath}/home`, icon: Home },
    { title: "Profile", url: `${basePath}/profile`, icon: User },
    { title: "Sessions", url: `${basePath}/sessions`, icon: Calendar },
    { title: "Help", url: `${basePath}/help`, icon: HelpCircle },
  ];

  return (
    <Sidebar
      collapsible="icon"
      className={`${user?.role === "expert" ? "bg-teal-800" : "bg-theme"
        } text-white`}
    >
      <SidebarContent
        className={`${user?.role === "expert" ? "bg-teal-800" : "bg-theme"
          }`}
      >
        <SidebarGroup>
          <SidebarHeader className="flex items-center gap-2 text-2xl font-bold text-white">
            {state === "expanded" ? "Interview Excel" : "IE"}
          </SidebarHeader>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 mt-11">
              {items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors
                          ${isActive
                            ? "bg-white text-blue-950 font-bold"
                            : "text-gray-200 hover:bg-white/20"
                          }`}
                      >
                        <item.icon className="w-5 h-5" />
                        {state === "expanded" && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              {/* Logout Button */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-red-400 hover:bg-white/20 transition w-full"
                  >
                    <LogOut className="w-5 h-5" />
                    {state === "expanded" && <span>Logout</span>}
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
