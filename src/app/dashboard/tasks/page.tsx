'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  Search, Plus, CheckCircle2, Clock, AlertCircle, AlertTriangle,
  Calendar, User, MoreHorizontal, Flag, ArrowRight
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { deleteDocument, subscribeToCollection, updateDocument } from '@/firebase/firestore';
import { toast } from 'sonner';
import { Task } from '@/types';
import { format, isPast, isToday } from 'date-fns';
import { TaskForm } from '@/components/forms/TaskForm';
import { useEffect } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const priorityConfig: Record<string, { color: string; icon: React.ElementType; bg: string }> = {
  critical: { color: 'text-red-600', icon: AlertCircle, bg: 'bg-red-50 border-red-200' },
  high: { color: 'text-orange-600', icon: AlertTriangle, bg: 'bg-orange-50 border-orange-200' },
  medium: { color: 'text-amber-600', icon: Flag, bg: 'bg-amber-50 border-amber-200' },
  low: { color: 'text-blue-600', icon: Flag, bg: 'bg-blue-50 border-blue-200' },
};

const statusConfig: Record<string, { color: string; label: string }> = {
  pending: { color: 'border-amber-200 bg-amber-50 text-amber-700', label: 'Pending' },
  'in-progress': { color: 'border-blue-200 bg-blue-50 text-blue-700', label: 'In Progress' },
  completed: { color: 'border-green-200 bg-green-50 text-green-700', label: 'Completed' },
  overdue: { color: 'border-red-200 bg-red-50 text-red-700', label: 'Overdue' },
};

export default function TasksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToCollection<Task>('tasks', (data) => {
      setTasks(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filtered = tasks.filter((t) => {
    const matchSearch = (t.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.assignedToName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchSearch && matchPriority && matchStatus;
  });

  const completed = tasks.filter(t => t.status === 'completed').length;
  const completionRate = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

  const handleDelete = async (taskId: string) => {
    try {
      await deleteDocument('tasks', taskId);
      toast.success('Task deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete task');
    }
  };

  const handleMarkComplete = async (taskId: string) => {
    try {
      await updateDocument('tasks', taskId, { status: 'completed' });
      toast.success('Task marked as completed');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update task');
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Task Management</h1>
          <p className="text-muted-foreground mt-1">Assign and monitor team tasks</p>
        </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger render={<Button className="rounded-xl animated-gradient border-0 text-white gap-2" onClick={() => setEditingTask(null)} />}>
              <Plus className="w-4 h-4" /> Create Task
            </DialogTrigger>
            <DialogContent className="rounded-2xl sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
              </DialogHeader>
              <TaskForm 
                key={editingTask?.id || 'new'}
                initialData={editingTask || undefined}
                onSuccess={() => setIsDialogOpen(false)} 
                onCancel={() => setIsDialogOpen(false)} 
              />
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{tasks.length}</p>
            <p className="text-xs text-muted-foreground">Total Tasks</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-amber-600">{tasks.filter(t => t.status === 'pending').length}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-blue-600">{tasks.filter(t => t.status === 'in-progress').length}</p>
            <p className="text-xs text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-emerald-600">{completionRate}%</p>
                <p className="text-xs text-muted-foreground">Completion</p>
              </div>
            </div>
            <Progress value={completionRate} className="mt-2 h-1.5" />
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 rounded-xl bg-muted/50 border-0"
          />
        </div>
        <Select value={priorityFilter} onValueChange={(v) => v && setPriorityFilter(v)}>
          <SelectTrigger className="w-36 h-10 rounded-xl border-0 bg-muted/50">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => v && setStatusFilter(v)}>
          <SelectTrigger className="w-36 h-10 rounded-xl border-0 bg-muted/50">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Task Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((task, i) => {
          const priority = priorityConfig[task.priority?.toLowerCase()] || priorityConfig['low'];
          const status = statusConfig[task.status?.toLowerCase()] || statusConfig['pending'];
          const isOverdue = task.dueDate ? isPast(task.dueDate) && task.status !== 'completed' : false;
          const isDueToday = task.dueDate ? isToday(task.dueDate) : false;

          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className={`border-0 shadow-md rounded-2xl hover:shadow-lg transition-all duration-300 overflow-hidden ${
                isOverdue ? 'ring-1 ring-red-200' : ''
              }`}>
                <div className={`h-1 ${
                  task.priority === 'critical' ? 'bg-red-500' :
                  task.priority === 'high' ? 'bg-orange-500' :
                  task.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                }`} />
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`text-[10px] rounded-full ${priority.bg}`}>
                        <priority.icon className={`w-3 h-3 mr-1 ${priority.color}`} />
                        {task.priority}
                      </Badge>
                      <Badge variant="outline" className={`text-[10px] rounded-full ${status.color}`}>
                        {status.label}
                      </Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" />}>
                        <MoreHorizontal className="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem className="cursor-pointer" onClick={() => handleMarkComplete(task.id)} disabled={task.status === 'completed'}>
                          Mark Complete
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => { setEditingTask(task); setIsDialogOpen(true); }}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-destructive" onClick={(e) => { e.preventDefault(); handleDelete(task.id); }}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <h3 className="font-semibold text-sm leading-snug mb-2">{task.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{task.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="w-3.5 h-3.5" />
                      <span>{task.assignedToName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className={`${
                        isOverdue ? 'text-red-600 font-medium' :
                        isDueToday ? 'text-amber-600 font-medium' : 'text-muted-foreground'
                      }`}>
                        {task.dueDate ? (
                          <>
                            {isOverdue ? 'Overdue: ' : isDueToday ? 'Due today: ' : ''}
                            {format(task.dueDate, 'MMM dd, yyyy')}
                          </>
                        ) : 'No due date'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
