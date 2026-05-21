'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createDocument, updateDocument } from '@/firebase/firestore';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Customer } from '@/types';

const schema = z.object({
  shopName: z.string().min(2, 'Shop name is required'),
  ownerName: z.string().min(2, 'Owner name is required'),
  phone: z.string().min(10, 'Phone number is too short'),
  region: z.string().min(2, 'Region is required'),
  address: z.string().min(5, 'Address is required'),
});

type FormData = z.infer<typeof schema>;

interface CustomerFormProps {
  initialData?: Customer;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CustomerForm({ initialData, onSuccess, onCancel }: CustomerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData ? {
      shopName: initialData.shopName,
      ownerName: initialData.ownerName,
      phone: initialData.phone,
      region: initialData.region,
      address: initialData.address,
    } : undefined
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      if (initialData?.id) {
        await updateDocument('customers', initialData.id, data);
        toast.success('Customer updated successfully');
      } else {
        await createDocument('customers', {
          ...data,
          assignedExecutive: '',
          locationCoordinates: { latitude: 0, longitude: 0 },
          outstandingAmount: 0,
          status: 'active',
        });
        toast.success('Customer added successfully');
      }
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save customer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="shopName">Shop Name</Label>
          <Input id="shopName" {...register('shopName')} className="rounded-xl" />
          {errors.shopName && <p className="text-xs text-red-500">{errors.shopName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="ownerName">Owner Name</Label>
          <Input id="ownerName" {...register('ownerName')} className="rounded-xl" />
          {errors.ownerName && <p className="text-xs text-red-500">{errors.ownerName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" {...register('phone')} className="rounded-xl" />
          {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="region">Region</Label>
          <Input id="region" {...register('region')} className="rounded-xl" />
          {errors.region && <p className="text-xs text-red-500">{errors.region.message}</p>}
        </div>
        <div className="space-y-2 col-span-2">
          <Label htmlFor="address">Full Address</Label>
          <Textarea id="address" {...register('address')} className="rounded-xl resize-none" rows={3} />
          {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" className="rounded-xl" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting} className="rounded-xl animated-gradient border-0 text-white">
          {isSubmitting ? 'Saving...' : 'Save Customer'}
        </Button>
      </div>
    </form>
  );
}
