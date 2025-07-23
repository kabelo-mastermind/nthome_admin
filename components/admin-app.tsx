"use client"

import type React from "react"
import { SidebarProvider, Sidebar, SidebarInset } from "@/src/components/ui/sidebar"
import AdminHeader from "@/components/admin-header"
import AdminSidebar from "@/components/admin-sidebar"

function AdminApp({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      {/* The Sidebar component handles its own responsiveness (offcanvas on mobile, icon-collapsed on desktop) */}
      <Sidebar collapsible="icon">
        <AdminSidebar />
      </Sidebar>
      <SidebarInset>
        <AdminHeader />
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default AdminApp
