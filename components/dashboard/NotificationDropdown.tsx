'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useNotifications } from '@/hooks/use-notifications'
import { Bell, Check, Trash2, Trophy, BookOpen, Brain, Star, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

export function NotificationDropdown() {
  const router = useRouter()
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications()
  const [open, setOpen] = useState(false)

  const handleNotificationClick = (notification: any) => {
    if (!notification.is_read) {
      markAsRead(notification.id)
    }
    if (notification.action_url) {
      router.push(notification.action_url)
      setOpen(false)
    }
  }

  const getNotificationIcon = (iconType: string) => {
    const iconMap: { [key: string]: any } = {
      trophy: Trophy,
      book: BookOpen,
      brain: Brain,
      star: Star,
      bell: Bell,
      info: Info
    }
    const Icon = iconMap[iconType] || Bell
    return Icon
  }

  const getNotificationColor = (type: string) => {
    const colorMap: { [key: string]: string } = {
      achievement: 'text-yellow-600 bg-yellow-100',
      success: 'text-green-600 bg-green-100',
      info: 'text-blue-600 bg-blue-100',
      warning: 'text-orange-600 bg-orange-100'
    }
    return colorMap[type] || 'text-gray-600 bg-gray-100'
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      return `${diffInDays}d ago`
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-gray-100">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500"
              variant="destructive"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-2 py-2">
          <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
          {notifications.length > 0 && unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs h-7"
            >
              <Check className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        
        {notifications.length === 0 ? (
          <div className="py-8 text-center">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No notifications</p>
            <p className="text-xs text-gray-400 mt-1">You're all caught up!</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-1">
              {notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.icon_type)
                const colorClass = getNotificationColor(notification.type)
                
                return (
                  <div
                    key={notification.id}
                    className={`relative px-2 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.is_read ? 'bg-blue-50/50' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-medium text-gray-900 pr-2">
                            {notification.title}
                          </p>
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-400">
                            {getTimeAgo(notification.created_at)}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-red-100"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteNotification(notification.id)
                            }}
                          >
                            <Trash2 className="h-3 w-3 text-gray-400 hover:text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
