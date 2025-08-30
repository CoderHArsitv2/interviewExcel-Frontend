"use client"
import { Home, User, Calendar, HelpCircle, LogOut } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuthContext } from "@/providers/authProvider" // for logout function

const items = [
  { title: "Home", url: "/student/home", icon: Home },
  { title: "Profile", url: "/student/profile", icon: User },
  { title: "Sessions", url: "/student/sessions", icon: Calendar },
  { title: "Help", url: "/student/help", icon: HelpCircle },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar() // "expanded" or "collapsed"
  const { logout } = useAuthContext() // assume this exists

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarHeader className="flex items-center gap-2 text-2xl font-bold">
            {state === "expanded" ? "Interview Excel" : "IE"}
          </SidebarHeader>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 mt-11">
              {items.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors
                          ${isActive 
                            ? "bg-theme text-white" 
                            : "text-gray-700 hover:bg-gray-100"
                          }`}
                      >
                        <item.icon className="w-5 h-5" />
                        {state === "expanded" && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}

              {/* Logout Button */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-red-600 hover:bg-red-100 transition w-full"
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
  )
}
