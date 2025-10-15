import { Bell, Search, Globe, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth, useTranslation } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  const { user, logout, language, setLanguage } = useAuth();
  const { t } = useTranslation();

  // Mock notifications
  const notifications = [
    {
      id: 1,
      title: "New Asset Available",
      message: "MacBook Pro 16\" is now available in the catalog",
      time: "2 minutes ago",
      unread: true,
      type: "asset"
    },
    {
      id: 2,
      title: "Auction Starting Soon",
      message: "Office Chair auction starts in 15 minutes",
      time: "15 minutes ago",
      unread: true,
      type: "auction"
    },
    {
      id: 3,
      title: "Purchase Confirmed",
      message: "Your purchase of Dell Monitor has been confirmed",
      time: "1 hour ago",
      unread: false,
      type: "purchase"
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' }
  ];

  return (
    <header className="h-16 bg-surface border-b border-border-subtle flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="hover:bg-surface-elevated" />
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-muted" />
          <Input
            placeholder={`${t('search')}...`}
            className="pl-10 w-80 bg-surface-elevated border-border-subtle focus:border-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Language Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2" aria-label={t('changeLanguage') || 'Change Language'}>
              <Globe className="w-4 h-4" />
              {languages.find(l => l.code === language)?.flag}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-surface border-border-subtle">
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => setLanguage(lang.code as 'en' | 'es' | 'pt')}
                className={`cursor-pointer ${language === lang.code ? 'bg-surface-elevated' : ''}`}
                aria-label={lang.name}
              >
                <span className="mr-2">{lang.flag}</span>
                {lang.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-destructive text-destructive-foreground">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 bg-surface border-border-subtle" align="end">
            <div className="p-4 border-b border-border-subtle">
              <h3 className="font-semibold text-foreground">Notifications</h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-border-subtle hover:bg-surface-elevated cursor-pointer ${
                    notification.unread ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-foreground">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-foreground-muted mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-foreground-subtle mt-2">
                        {notification.time}
                      </p>
                    </div>
                    {notification.unread && (
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* User Profile */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.profilePicture} alt={user.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-surface border-border-subtle" align="end">
              <div className="p-2">
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="text-xs text-foreground-muted">{user.email}</p>
              </div>
              <DropdownMenuSeparator className="bg-border-subtle" />
              <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" />
                {t('logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}