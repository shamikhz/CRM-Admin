'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search, Filter, Plus, Mail, Phone, MapPin, Calendar, Star,
  MoreVertical, UserPlus, TrendingUp, Shield, Clock,
  MoreHorizontal, Edit, Trash2, Users
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { deleteDocument, subscribeToCollection } from '@/firebase/firestore';
import { toast } from 'sonner';
import { User } from '@/types';
import { format } from 'date-fns';
import { EmployeeForm } from '@/components/forms/EmployeeForm';
import { useEffect } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const roleBadgeColors: Record<string, string> = {
  admin: 'bg-violet-100 text-violet-700 border-violet-200',
  manager: 'bg-blue-100 text-blue-700 border-blue-200',
  'sales-executive': 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

export default function EmployeesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToCollection<User>('users', (data) => {
      setUsers(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filtered = users.filter((u) => {
    const matchSearch = (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleDelete = async (userId: string) => {
    try {
      await deleteDocument('users', userId);
      toast.success('Employee deleted successfully');
      // In a real app with realtime listeners, the UI would update automatically.
      // Since we are using mock data mixed with real creates/deletes, 
      // you would normally fetch again here.
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete employee');
    }
  };

  const executives = users.filter(u => u.role === 'sales-executive');
  const managers = users.filter(u => u.role === 'manager');

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Employee Management</h1>
          <p className="text-muted-foreground mt-1">Manage your field sales team</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={<Button className="rounded-xl animated-gradient border-0 text-white gap-2" onClick={() => setEditingUser(null)} />}>
            <Plus className="w-4 h-4" /> Add Employee
          </DialogTrigger>
          <DialogContent className="rounded-2xl sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingUser ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
            </DialogHeader>
            <EmployeeForm 
              key={editingUser?.id || 'new'}
              initialData={editingUser || undefined}
              onSuccess={() => setIsDialogOpen(false)} 
              onCancel={() => setIsDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Employees', value: users.length, icon: '👥' },
          { label: 'Managers', value: managers.length, icon: '🎯' },
          { label: 'Executives', value: executives.length, icon: '💼' },
          { label: 'Active Today', value: users.filter(u => u.isActive).length, icon: '✅' },
        ].map((s) => (
          <Card key={s.label} className="border-0 shadow-sm rounded-2xl">
            <CardContent className="p-4 flex items-center gap-3">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 rounded-xl bg-muted/50 border-0"
          />
        </div>
        <Select value={roleFilter} onValueChange={(v) => v && setRoleFilter(v)}>
          <SelectTrigger className="w-40 h-10 rounded-xl border-0 bg-muted/50">
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="sales-executive">Sales Executive</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Employee Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-muted-foreground">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
          <p>Loading employees...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-muted-foreground bg-muted/20 rounded-2xl border border-dashed border-border">
          <Users className="w-12 h-12 mb-4 text-muted-foreground/50" />
          <p className="text-lg font-medium text-foreground">No employees found</p>
          <p className="text-sm mt-1">Try adjusting your filters or add a new employee.</p>
        </div>
      ) : (
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((user, i) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
            <Card className="border-0 shadow-md rounded-2xl hover:shadow-lg transition-all duration-300 group overflow-hidden">
              {/* Top accent */}
              <div className="h-1 animated-gradient" />
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="relative">
                    <Avatar className="h-14 w-14">
                      <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${
                      user.isActive ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className={`text-[10px] rounded-full ${roleBadgeColors[user.role?.toLowerCase()] || roleBadgeColors['sales-executive']}`}>
                      {user.role === 'sales-executive' ? 'Executive' : (user.role || 'employee').charAt(0).toUpperCase() + (user.role || 'employee').slice(1)}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />}>
                        <MoreHorizontal className="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => { setEditingUser(user); setIsDialogOpen(true); }}>
                          <Edit className="w-3.5 h-3.5" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer gap-2 text-destructive" onClick={() => handleDelete(user.id)}>
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <h3 className="font-semibold text-base">{user.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{user.assignedRegion}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{user.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Joined {format(user.createdAt, 'MMM yyyy')}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border/50 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 h-8 rounded-lg text-xs">
                    <Mail className="w-3 h-3 mr-1" /> Email
                  </Button>
                  <Button size="sm" className="flex-1 h-8 rounded-lg text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" /> Stats
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
