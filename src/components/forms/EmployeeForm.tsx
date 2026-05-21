'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createDocument, updateDocument } from '@/firebase/firestore';
import { User, UserRole } from '@/types';
import { toast } from 'sonner';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is too short'),
  role: z.enum(['admin', 'manager', 'sales-executive'] as const),
  assignedRegion: z.string().min(2, 'Region is required'),
});

type FormData = z.infer<typeof schema>;

interface EmployeeFormProps {
  initialData?: User;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EmployeeForm({ initialData, onSuccess, onCancel }: EmployeeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData ? {
      name: initialData.name,
      email: initialData.email,
      phone: initialData.phone,
      role: initialData.role as 'admin' | 'manager' | 'sales-executive',
      assignedRegion: initialData.assignedRegion,
    } : {
      role: 'sales-executive',
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      if (initialData?.uid || initialData?.id) {
        // Edit mode
        await updateDocument('users', initialData.uid || initialData.id, data);
        toast.success('Employee updated successfully');
      } else {
        // Create mode
        await createDocument('users', {
          ...data,
          profileImage: '',
          managerId: null,
          isActive: true,
        });
        toast.success('Employee created successfully');
      }
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" {...register('name')} className="rounded-xl" />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email')} className="rounded-xl" />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" {...register('phone')} className="rounded-xl" />
          {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="assignedRegion">Region</Label>
          <Input id="assignedRegion" {...register('assignedRegion')} className="rounded-xl" />
          {errors.assignedRegion && <p className="text-xs text-red-500">{errors.assignedRegion.message}</p>}
        </div>
        <div className="space-y-2 col-span-2">
          <Label>Role</Label>
          <Select onValueChange={(v: any) => setValue('role', v)} defaultValue={initialData?.role || "sales-executive"}>
            <SelectTrigger className="w-full rounded-xl">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="sales-executive">Sales Executive</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && <p className="text-xs text-red-500">{errors.role.message}</p>}
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" className="rounded-xl" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting} className="rounded-xl animated-gradient border-0 text-white">
          {isSubmitting ? 'Saving...' : 'Save Employee'}
        </Button>
      </div>
    </form>
  );
}
