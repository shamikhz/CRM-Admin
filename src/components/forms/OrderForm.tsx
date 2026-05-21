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
import { Order } from '@/types';
import { toast } from 'sonner';

const schema = z.object({
  customerName: z.string().min(2, 'Customer name is required'),
  totalAmount: z.coerce.number().min(1, 'Amount must be greater than 0'),
  paymentStatus: z.enum(['paid', 'pending', 'partial', 'overdue'] as const),
  deliveryStatus: z.enum(['pending', 'dispatched', 'delivered', 'cancelled'] as const),
});

type FormData = z.infer<typeof schema>;

interface OrderFormProps {
  initialData?: Order;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function OrderForm({ initialData, onSuccess, onCancel }: OrderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData ? {
      customerName: initialData.customerName,
      totalAmount: initialData.totalAmount,
      paymentStatus: initialData.paymentStatus as any,
      deliveryStatus: initialData.deliveryStatus as any,
    } : {
      paymentStatus: 'pending',
      deliveryStatus: 'pending',
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      if (initialData?.id) {
        await updateDocument('orders', initialData.id, data);
        toast.success('Order updated successfully');
      } else {
        const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
        
        await createDocument('orders', {
          ...data,
          orderId,
          customerId: 'unlinked', // Simplified for demo
          salesExecutiveId: 'unassigned',
          products: [], // Simplified for demo
        });
        toast.success('Order created successfully');
      }
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="customerName">Customer Name</Label>
        <Input id="customerName" {...register('customerName')} className="rounded-xl" />
        {errors.customerName && <p className="text-xs text-red-500">{errors.customerName.message}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="totalAmount">Total Amount (₹)</Label>
        <Input id="totalAmount" type="number" {...register('totalAmount')} className="rounded-xl" />
        {errors.totalAmount && <p className="text-xs text-red-500">{errors.totalAmount.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Payment Status</Label>
          <Select onValueChange={(v: any) => setValue('paymentStatus', v)} defaultValue={initialData?.paymentStatus || "pending"}>
            <SelectTrigger className="w-full rounded-xl">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
          {errors.paymentStatus && <p className="text-xs text-red-500">{errors.paymentStatus.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label>Delivery Status</Label>
          <Select onValueChange={(v: any) => setValue('deliveryStatus', v)} defaultValue={initialData?.deliveryStatus || "pending"}>
            <SelectTrigger className="w-full rounded-xl">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="dispatched">Dispatched</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          {errors.deliveryStatus && <p className="text-xs text-red-500">{errors.deliveryStatus.message}</p>}
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" className="rounded-xl" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting} className="rounded-xl animated-gradient border-0 text-white">
          {isSubmitting ? 'Saving...' : 'Save Order'}
        </Button>
      </div>
    </form>
  );
}
