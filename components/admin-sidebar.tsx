"use client"

import { SidebarMenuSubItem } from "@/src/components/ui/sidebar"
import { Link } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  Star,
  Car,
  ListChecks,
  CalendarCheck,
  Archive,
  Gauge,
  Megaphone,
  User,
  Settings,
  ChevronDown,
  X,
} from "lucide-react"

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  useSidebar,
} from "@/src/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/src/components/ui/collapsible"

function AdminSidebar() {
  const { toggleSidebar } = useSidebar()

  return (
    <>
      <div className="sidebar-title flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold group-data-[collapsible=icon]:hidden">Admin Panel</h2>
        <span className="icon close_icon md:hidden" onClick={toggleSidebar}>
          <X className="h-6 w-6" />
        </span>
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Dashboard">
                  <Link to="/adminapp">
                    <LayoutDashboard className="icon" /> <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Drivers">
                  <Link to="/driver">
                    <Users className="icon" /> <span>Drivers</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Customers">
                  <Link to="/customerRide">
                    <Star className="icon" /> <span>Customers</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Vehicle Type">
                  <Link to="/vehicle">
                    <Car className="icon" /> <span>Vehicle Type</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Rides Dropdown using Collapsible */}
              <Collapsible className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Rides">
                      <ListChecks className="icon" />
                      <span className="text-dark"> Rides</span>
                      <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180 group-data-[collapsible=icon]:hidden" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild tooltip="All Rides">
                          <Link to="/trip">
                            <CalendarCheck className="icon" /> <span>All Rides</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild tooltip="Scheduled Rides">
                          <Link to="/schedule">
                            <CalendarCheck className="icon" /> <span>Scheduled Rides</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild tooltip="Completed Rides">
                          <Link to="/completedRides">
                            <Archive className="icon" /> <span>Completed Rides</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild tooltip="Cancelled Rides">
                          <Link to="/cancelled">
                            <Archive className="icon" /> <span>Cancelled Rides</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Rider Ratings">
                  <Link to="/riderRatings">
                    <Star className="icon" /> <span>Rider Ratings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Driver Ratings">
                  <Link to="/driverRatings">
                    <Star className="icon" /> <span>Driver Ratings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Driver Earnings">
                  <Link to="/earnings">
                    <Gauge className="icon" /> <span>Driver Earnings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Push Notification">
                  <Link to="/push">
                    <Megaphone className="icon" /> <span>Push Notification</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Subscribers">
                  <Link to="/subscribers">
                    <User className="icon" /> <span>Subscribers</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Team">
                  <Link to="/adminList">
                    <Users className="icon" /> <span>Team</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings">
                  <Link to="/setting">
                    <Settings className="icon" /> <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </>
  )
}

export default AdminSidebar
