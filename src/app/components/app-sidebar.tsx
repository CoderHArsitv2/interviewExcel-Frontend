"use client";
import {User, Calendar, HelpCircle, LogOut, LayoutDashboard, } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
import { useAuthContext } from "@/providers/authProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const { logout, user } = useAuthContext();

  const basePath = user?.role === "expert" ? "/expert" : "/student";

  const items = [
    { title: "Home", url: `${basePath}/home`, icon: LayoutDashboard },
    { title: "Profile", url: `${basePath}/profile`, icon: User },
    { title: "Sessions", url: `${basePath}/sessions`, icon: Calendar },
    { title: "Help", url: `${basePath}/help`, icon: HelpCircle },
  ];

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-white/10 bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white shadow-2xl [&>[data-slot=sidebar-inner]]:bg-transparent [&>[data-slot=sidebar-inner]]:bg-none"
    >
      <SidebarContent className="bg-transparent px-2">
        <SidebarGroup>
          <SidebarHeader className="flex items-center justify-center py-8">
            {state === "expanded" ? (
              <div className="flex items-center gap-3 animate-fadeIn">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-lg shadow-primary/30 ring-2 ring-white/10 bg-white/10">
                  <Image
                    src="/mascot.png"
                    alt="Interview Excel Mascot"
                    fill
                    className="object-cover p-1"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xl tracking-tight text-white leading-none">
                    Interview
                  </span>
                  <span className="font-bold text-xl tracking-tight text-primary leading-none">
                    Excel
                  </span>
                </div>
              </div>
            ) : (
              <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-primary/30 ring-2 ring-white/10 bg-white/10">
                <Image
                  src="/mascot.png"
                  alt="Interview Excel Mascot"
                  fill
                  className="object-cover p-1"
                />
              </div>
            )}
          </SidebarHeader>

          <SidebarGroupContent className="mt-6 space-y-2">
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title} className="h-12">
                      <Link
                        href={item.url}
                        className={`flex items-center gap-4 rounded-xl px-4 transition-all duration-300 group relative overflow-hidden
                          ${isActive
                            ? "bg-gradient-to-r from-primary/20 to-primary/5 text-primary font-semibold shadow-[0_0_20px_rgba(var(--primary),0.3)] border border-primary/20"
                            : "text-slate-300 hover:bg-white/5 hover:text-white hover:shadow-inner"
                          }`}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full shadow-[0_0_10px_var(--primary)]" />
                        )}
                        <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? "text-primary scale-110" : "group-hover:scale-110"}`} />
                        {state === "expanded" && <span className="tracking-wide">{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-transparent p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className={`flex items-center gap-3 p-2 rounded-2xl bg-white/5 border border-white/5 ${state === "collapsed" ? "justify-center" : ""}`}>
              <Avatar className="h-10 w-10 rounded-lg border-2 border-white/10 shadow-sm">
                <AvatarImage src={"/mascot.png"} alt={user?.name} />
                <AvatarFallback className="rounded-lg bg-primary/20 text-primary font-bold">
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>

              {state === "expanded" && (
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-white truncate">{user?.name || "User"}</p>
                  <p className="text-xs text-slate-400 truncate">{user?.email || "user@example.com"}</p>
                </div>
              )}

              {state === "expanded" && (
                <button
                  onClick={logout}
                  className="p-2 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
