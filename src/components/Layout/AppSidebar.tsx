import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Calendar,
  Users,
  Settings,
  Trophy,
  ShoppingBag,
  Building,
  ToggleLeft,
  Bell
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth, useTranslation } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { user, currentRole, switchRole } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  const adminMenuItems = [
    { title: t('dashboard'), url: "/dashboard", icon: LayoutDashboard },
    { title: t('assetsManagement'), url: "/assets-management", icon: Package },
    // { title: t('reservations'), url: "/reservations", icon: Calendar },
    { title: t('employees'), url: "/employees", icon: Users },
    { title: t('customization'), url: "/customization", icon: Settings },
    { title: t('events'), url: "/events", icon: Trophy },
    { title: t('securityPolicies'), url: "/security-policies", icon: Settings },
  ];

  const userMenuItems = [
    { title: t('assets'), url: "/assets", icon: Package },
    // { title: t('reservations'), url: "/reservations", icon: Calendar },
    { title: t('events'), url: "/events", icon: Trophy },
    { title: t('purchaseHistory'), url: "/purchase-history", icon: ShoppingBag },
    { title: t('securityPolicies'), url: "/security-policies", icon: Settings },
  ];

  const menuItems = currentRole === 'admin' ? adminMenuItems : userMenuItems;

  const getNavClass = (isActiveItem: boolean) =>
    isActiveItem 
      ? "bg-sidebar-accent text-white font-medium border-l-4 border-primary" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground hover:text-primary transition-colors";

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-64"} transition-all duration-300 bg-sidebar border-sidebar-border`}
      collapsible="icon"
    >
      <SidebarContent className="bg-sidebar">
        {/* Logo and Company Info */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <Building className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="text-lg font-bold text-sidebar-foreground">AssetHub</h2>
                <p className="text-xs text-sidebar-foreground/70">Enterprise Platform</p>
              </div>
            )}
          </div>
        </div>

        {/* User Profile Section */}
        {user && (
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.profilePicture} alt={user.name} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex-1">
                  <p className="text-sm font-medium text-sidebar-foreground">{user.name}</p>
                  <p className="text-xs text-sidebar-foreground/70">{user.department}</p>
                  <Badge 
                    className="mt-1 text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    {currentRole === 'admin' ? t('administrator') : t('regularUser')}
                  </Badge>
                </div>
              )}
            </div>
            
            {/* Role Switcher for Admins */}
            {!collapsed && user.role === 'admin' && (
              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => switchRole(currentRole === 'admin' ? 'user' : 'admin')}
                  className="w-full justify-start gap-2 text-xs border-primary/30 text-primary hover:bg-primary/10 hover:text-primary hover:border-primary transition-colors"
                >
                  <ToggleLeft className="w-3 h-3" />
                  {currentRole === 'admin' ? t('switchToUser') : t('switchToAdmin')}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Main Navigation */}
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium px-4 py-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavClass(isActive(item.url))}
                    >
                      <item.icon 
                        className={`w-4 h-4 ${isActive(item.url) ? 'text-primary' : ''}`} 
                      />
                      {!collapsed && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Notifications Section */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="w-5 h-5 text-sidebar-foreground hover:text-primary transition-colors" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
            </div>
            {!collapsed && (
              <span className="text-sm text-sidebar-foreground">Notifications</span>
            )}
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}