'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore, useUIStore, useNotificationStore } from '@/store';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { subscribeToCollection, orderBy } from '@/firebase/firestore';
import type { Notification } from '@/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import {
  LayoutDashboard, Users, MapPin, ShoppingCart, ClipboardList,
  BarChart3, Bell, Settings, Zap, ChevronLeft, ChevronRight,
  Menu, Search, LogOut, Moon, Sun, UserCircle, Building2,
  Package, FileText, ChevronDown, Wifi, WifiOff
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { href: '/dashboard/team', label: 'Team Tracking', icon: MapPin, badge: null },
  { href: '/dashboard/employees', label: 'Employees', icon: Users, badge: null },
  { href: '/dashboard/customers', label: 'Customers', icon: Building2, badge: null },
  { href: '/dashboard/orders', label: 'Orders', icon: ShoppingCart, badge: '4' },
  { href: '/dashboard/tasks', label: 'Tasks', icon: ClipboardList, badge: '3' },
  { href: '/dashboard/reports', label: 'Reports', icon: BarChart3, badge: null },
  { href: '/dashboard/notifications', label: 'Notifications', icon: Bell, badge: null },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings, badge: null },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout: authLogout } = useAuthStore();
  const { sidebarCollapsed, setSidebarCollapsed, theme, setTheme } = useUIStore();
  const { notifications, unreadCount, setNotifications } = useNotificationStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToCollection<Notification>(
      'notifications',
      (data) => {
        setNotifications(data);
      },
      [orderBy('createdAt', 'desc')]
    );
    return () => unsubscribe();
  }, [setNotifications]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      authLogout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const SidebarContent = ({ collapsed = false }: { collapsed?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-3 px-4 py-5 shrink-0",
        collapsed && "justify-center px-2"
      )}>
        <div className="w-10 h-10 rounded-xl animated-gradient flex items-center justify-center shrink-0">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden"
            >
              <h1 className="text-lg font-bold text-sidebar-foreground whitespace-nowrap">FieldForce</h1>
              <p className="text-[10px] text-sidebar-foreground/50 tracking-widest uppercase whitespace-nowrap">CRM Platform</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <button
                key={item.href}
                onClick={() => {
                  router.push(item.href);
                  setMobileOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  collapsed && "justify-center px-2",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/25"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <item.icon className={cn("w-5 h-5 shrink-0", isActive && "animate-pulse")} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="whitespace-nowrap flex-1 text-left"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {!collapsed && (
                  item.href === '/dashboard/notifications' ? (
                    unreadCount > 0 && (
                      <Badge className="h-5 min-w-5 flex items-center justify-center text-[10px] bg-destructive text-white border-0">
                        {unreadCount}
                      </Badge>
                    )
                  ) : item.badge && (
                    <Badge className="h-5 min-w-5 flex items-center justify-center text-[10px] bg-destructive text-white border-0">
                      {item.badge}
                    </Badge>
                  )
                )}
              </button>
            );
          })}
        </nav>
      </ScrollArea>

      {/* User card */}
      <div className="shrink-0 p-3 border-t border-sidebar-border">
        <div className={cn(
          "flex items-center gap-3 p-2 rounded-xl",
          collapsed && "justify-center"
        )}>
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-xs font-semibold">
              {user?.name?.split(' ').map(n => n[0]).join('') || 'AD'}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-sidebar-foreground/50 truncate">{user?.role || 'admin'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <motion.aside
        className="hidden lg:flex flex-col bg-sidebar border-r border-sidebar-border shrink-0 relative"
        animate={{ width: sidebarCollapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <SidebarContent collapsed={sidebarCollapsed} />
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-sidebar-primary text-sidebar-primary-foreground rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform z-10"
        >
          {sidebarCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            {/* Left: mobile menu + search */}
            <div className="flex items-center gap-3">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger render={<Button variant="ghost" size="icon" className="shrink-0 lg:hidden" />}>
                  <Menu className="w-5 h-5" />
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0 bg-sidebar border-sidebar-border">
                  <SidebarContent />
                </SheetContent>
              </Sheet>

              <div className="hidden sm:flex relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search anything..."
                  className="pl-9 h-10 w-64 lg:w-80 rounded-xl bg-muted/50 border-0 focus:bg-background focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-2">
              {/* Online status */}
              <div className={cn(
                "hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full",
                isOnline ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
              )}>
                {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                {isOnline ? 'Online' : 'Offline'}
              </div>

              {/* Theme toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="rounded-xl relative" />}>
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                      {unreadCount}
                    </span>
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 rounded-xl">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="flex items-center justify-between">
                      <span>Notifications</span>
                      <Badge variant="secondary" className="text-[10px]">{unreadCount} new</Badge>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {notifications.slice(0, 5).map((n) => (
                      <DropdownMenuItem key={n.id} className="flex-col items-start gap-1 p-3 cursor-pointer">
                        <span className="text-sm font-medium">{n.title}</span>
                        <span className="text-xs text-muted-foreground line-clamp-1">{n.message}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="justify-center text-primary font-medium cursor-pointer"
                    onClick={() => router.push('/dashboard/notifications')}
                  >
                    View all notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="ghost" className="rounded-xl gap-2 px-2" />}>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {user?.name?.split(' ').map(n => n[0]).join('') || 'AD'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline text-sm font-medium">{user?.name || 'Admin'}</span>
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>
                      <p className="text-sm">{user?.name || 'Admin User'}</p>
                      <p className="text-xs text-muted-foreground font-normal">{user?.email || 'admin@fieldforce.io'}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/dashboard/settings')}>
                      <Settings className="w-4 h-4 mr-2" /> Settings
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-destructive" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Offline Banner */}
        <AnimatePresence>
          {!isOnline && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-destructive/10 border-b border-destructive/20 px-4 py-2 text-center text-sm text-destructive font-medium overflow-hidden"
            >
              <WifiOff className="w-4 h-4 inline mr-2" />
              You are currently offline. Some features may be limited.
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
