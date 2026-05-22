'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bell, BellOff, CheckCheck, Trash2, AlertCircle, AlertTriangle,
  CheckCircle2, Info, ShoppingCart, Clock, Users, Filter
} from 'lucide-react';
import { useNotificationStore } from '@/store';
import { mockNotifications } from '@/lib/mock-data';
import { format, formatDistanceToNow } from 'date-fns';
import { updateDocument } from '@/firebase/firestore';
import { toast } from 'sonner';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const typeConfig: Record<string, { icon: React.ElementType; bg: string; color: string }> = {
  success: { icon: CheckCircle2, bg: 'bg-green-50', color: 'text-green-600' },
  warning: { icon: AlertTriangle, bg: 'bg-amber-50', color: 'text-amber-600' },
  error: { icon: AlertCircle, bg: 'bg-red-50', color: 'text-red-600' },
  info: { icon: Info, bg: 'bg-blue-50', color: 'text-blue-600' },
  alert: { icon: Bell, bg: 'bg-violet-50', color: 'text-violet-600' },
};

export default function NotificationsPage() {
  const { notifications, markAllAsRead, markAsRead } = useNotificationStore();
  const [filter, setFilter] = useState('all');

  const handleMarkAsRead = async (id: string) => {
    markAsRead(id);
    try {
      await updateDocument('notifications', id, { isRead: true });
    } catch (error) {
      console.error('Failed to mark as read', error);
      toast.error('Failed to update notification');
    }
  };

  const handleMarkAllAsRead = async () => {
    markAllAsRead();
    try {
      const unreadNotifications = (notifications || []).filter(n => !n.isRead);
      if (unreadNotifications.length === 0) return;
      await Promise.all(
        unreadNotifications.map(n => updateDocument('notifications', n.id, { isRead: true }))
      );
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all as read', error);
      toast.error('Failed to update notifications');
    }
  };

  const filtered = filter === 'all'
    ? (notifications || [])
    : filter === 'unread'
    ? (notifications || []).filter(n => !n.isRead)
    : (notifications || []).filter(n => n.type === filter);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-1">Stay updated with alerts and notifications</p>
        </div>
        <Button variant="outline" className="rounded-xl gap-2" onClick={handleMarkAllAsRead}>
          <CheckCheck className="w-4 h-4" /> Mark all as read
        </Button>
      </motion.div>

      {/* Filter tabs */}
      <motion.div variants={itemVariants}>
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="bg-muted/50 rounded-xl p-1 h-auto flex-wrap">
            <TabsTrigger value="all" className="rounded-lg text-xs">All</TabsTrigger>
            <TabsTrigger value="unread" className="rounded-lg text-xs">Unread</TabsTrigger>
            <TabsTrigger value="success" className="rounded-lg text-xs">Success</TabsTrigger>
            <TabsTrigger value="warning" className="rounded-lg text-xs">Warning</TabsTrigger>
            <TabsTrigger value="error" className="rounded-lg text-xs">Error</TabsTrigger>
            <TabsTrigger value="info" className="rounded-lg text-xs">Info</TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Notification List */}
      <motion.div variants={itemVariants} className="space-y-3">
        {filtered.map((n, i) => {
          const config = typeConfig[n.type] || typeConfig.info;
          const Icon = config.icon;

          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card 
                onClick={() => !n.isRead && handleMarkAsRead(n.id)}
                className={`border-0 shadow-sm rounded-2xl overflow-hidden transition-all hover:shadow-md ${
                !n.isRead ? 'ring-1 ring-primary/10 bg-primary/[0.02] cursor-pointer' : ''
              }`}>
                <CardContent className="p-4 flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-5 h-5 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-semibold flex items-center gap-2">
                          {n.title}
                          {!n.isRead && (
                            <span className="w-2 h-2 bg-primary rounded-full" />
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(n.createdAt, { addSuffix: true })}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="outline" className={`text-[10px] rounded-full ${config.bg} ${config.color} border-0`}>
                        {n.type}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {format(n.createdAt, 'MMM dd, h:mm a')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}

        {(filtered?.length || 0) === 0 && (
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardContent className="p-12 text-center">
              <BellOff className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">No notifications found</p>
              <p className="text-sm text-muted-foreground/70 mt-1">You&apos;re all caught up!</p>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </motion.div>
  );
}
