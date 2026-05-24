'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createDocument, updateDocument, subscribeToCollection } from '@/firebase/firestore';
import { Task } from '@/types';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';

const schema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().min(5, 'Description is required'),
  priority: z.enum(['low', 'medium', 'high', 'critical'] as const),
  dueDate: z.string().min(1, 'Due date is required'),
  assignedTo: z.string().min(1, 'Assignee is required'),
});

type FormData = z.infer<typeof schema>;

interface TaskFormProps {
  initialData?: Task;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function TaskForm({ initialData, onSuccess, onCancel }: TaskFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  
  useEffect(() => {
    const unsub = subscribeToCollection<any>('users', (data) => {
      const executives = data.filter(u => u.role === 'sales-executive');
      setEmployees(executives);
    });
    return () => unsub();
  }, []);

  // Format Date to YYYY-MM-DD for the input
  const defaultDueDate = initialData?.dueDate 
    ? new Date(initialData.dueDate).toISOString().split('T')[0]
    : '';

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData ? {
      title: initialData.title,
      description: initialData.description,
      priority: initialData.priority as any,
      dueDate: defaultDueDate,
      assignedTo: initialData.assignedTo || 'unassigned',
    } : {
      priority: 'medium',
      assignedTo: 'unassigned',
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const selectedEmp = employees.find(emp => emp.id === data.assignedTo);
      const assignedToName = selectedEmp ? (selectedEmp.name || 'Unknown Executive') : 'Unassigned';

      const taskPayload = {
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate: new Date(data.dueDate),
        assignedTo: data.assignedTo,
        assignedToName,
        status: initialData?.status || 'pending',
        createdBy: 'admin',
      };

      if (initialData?.id) {
        await updateDocument('tasks', initialData.id, taskPayload);
        toast.success('Task updated successfully');
      } else {
        await createDocument('tasks', taskPayload);
        toast.success('Task created successfully');
      }
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Task Title</Label>
        <Input id="title" {...register('title')} className="rounded-xl" />
        {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register('description')} className="rounded-xl resize-none" rows={3} />
        {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Priority</Label>
          <Select onValueChange={(v: any) => setValue('priority', v)} defaultValue={initialData?.priority || "medium"}>
            <SelectTrigger className="w-full rounded-xl">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
          {errors.priority && <p className="text-xs text-red-500">{errors.priority.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input id="dueDate" type="date" {...register('dueDate')} className="rounded-xl" />
          {errors.dueDate && <p className="text-xs text-red-500">{errors.dueDate.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Assign Employee</Label>
        <Select onValueChange={(v: any) => setValue('assignedTo', v)} defaultValue={initialData?.assignedTo || "unassigned"}>
          <SelectTrigger className="w-full rounded-xl">
            <SelectValue placeholder="Select employee" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="unassigned">Unassigned</SelectItem>
            {employees.map(emp => (
              <SelectItem key={emp.id} value={emp.id}>{emp.name || emp.email}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.assignedTo && <p className="text-xs text-red-500">{errors.assignedTo.message}</p>}
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" className="rounded-xl" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting} className="rounded-xl animated-gradient border-0 text-white">
          {isSubmitting ? 'Saving...' : 'Save Task'}
        </Button>
      </div>
    </form>
  );
}
