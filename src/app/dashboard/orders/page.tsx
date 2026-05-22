'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  Search, Plus, Download, ShoppingCart, Package, Truck, CheckCircle2,
  XCircle, Clock, MoreHorizontal, ArrowUpDown, Eye, FileText, IndianRupee,
  Edit, Trash2
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { deleteDocument, subscribeToCollection } from '@/firebase/firestore';
import { toast } from 'sonner';
import { Order } from '@/types';
import { format } from 'date-fns';
import { OrderForm } from '@/components/forms/OrderForm';
import { useEffect } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const paymentColors: Record<string, string> = {
  paid: 'border-green-200 bg-green-50 text-green-700',
  pending: 'border-amber-200 bg-amber-50 text-amber-700',
  partial: 'border-blue-200 bg-blue-50 text-blue-700',
  overdue: 'border-red-200 bg-red-50 text-red-700',
};

const deliveryColors: Record<string, string> = {
  delivered: 'border-green-200 bg-green-50 text-green-700',
  dispatched: 'border-blue-200 bg-blue-50 text-blue-700',
  pending: 'border-amber-200 bg-amber-50 text-amber-700',
  cancelled: 'border-red-200 bg-red-50 text-red-700',
};

const deliveryIcons: Record<string, React.ElementType> = {
  delivered: CheckCircle2,
  dispatched: Truck,
  pending: Clock,
  cancelled: XCircle,
};

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [deliveryFilter, setDeliveryFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToCollection<Order>('orders', (data) => {
      setOrders(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filtered = useMemo(() => {
    return orders.filter(o => {
      const matchSearch = (o.orderId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (o.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (o.salesExecutiveName || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchPayment = paymentFilter === 'all' || o.paymentStatus === paymentFilter;
      const matchDelivery = deliveryFilter === 'all' || o.deliveryStatus === deliveryFilter;
      return matchSearch && matchPayment && matchDelivery;
    });
  }, [orders, searchQuery, paymentFilter, deliveryFilter]);

  const totalRevenue = filtered.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const paidOrders = filtered.filter(o => o.paymentStatus?.toLowerCase() === 'paid').length;
  const pendingOrders = filtered.filter(o => o.paymentStatus?.toLowerCase() === 'pending' || o.paymentStatus?.toLowerCase() === 'partial').length;

  const handleDelete = async (orderId: string) => {
    try {
      await deleteDocument('orders', orderId);
      toast.success('Order deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete order');
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Orders Management</h1>
          <p className="text-muted-foreground mt-1">Track orders, payments, and deliveries</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger render={<Button className="rounded-xl animated-gradient border-0 text-white gap-2" onClick={() => setEditingOrder(null)} />}>
              <Plus className="w-4 h-4" /> New Order
            </DialogTrigger>
            <DialogContent className="rounded-2xl sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingOrder ? 'Edit Order' : 'Create New Order'}</DialogTitle>
              </DialogHeader>
              <OrderForm 
                key={editingOrder?.id || 'new'}
                initialData={editingOrder || undefined}
                onSuccess={() => setIsDialogOpen(false)} 
                onCancel={() => setIsDialogOpen(false)} 
              />
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Orders', value: filtered.length, icon: ShoppingCart, color: 'text-violet-600 bg-violet-50' },
          { label: 'Total Revenue', value: `₹${(totalRevenue / 1000).toFixed(0)}K`, icon: IndianRupee, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Paid Orders', value: paidOrders, icon: CheckCircle2, color: 'text-blue-600 bg-blue-50' },
          { label: 'Pending', value: pendingOrders, icon: Clock, color: 'text-amber-600 bg-amber-50' },
        ].map((s) => (
          <Card key={s.label} className="border-0 shadow-sm rounded-2xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 rounded-xl bg-muted/50 border-0"
          />
        </div>
        <Select value={paymentFilter} onValueChange={(v) => v && setPaymentFilter(v)}>
          <SelectTrigger className="w-40 h-10 rounded-xl border-0 bg-muted/50">
            <SelectValue placeholder="Payment" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">All Payment</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
        <Select value={deliveryFilter} onValueChange={(v) => v && setDeliveryFilter(v)}>
          <SelectTrigger className="w-40 h-10 rounded-xl border-0 bg-muted/50">
            <SelectValue placeholder="Delivery" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">All Delivery</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="dispatched">Dispatched</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Orders Table */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Executive</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Delivery</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((order, i) => {
                  const DeliveryIcon = deliveryIcons[order.deliveryStatus] || Clock;
                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="group hover:bg-muted/30 transition-colors border-b border-border/50"
                    >
                      <TableCell className="font-mono text-sm font-semibold text-primary">
                        {order.orderId}
                      </TableCell>
                      <TableCell className="text-sm font-medium">{order.customerName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{order.salesExecutiveName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{(order.products?.length || 0)} items</TableCell>
                      <TableCell className="text-sm font-semibold">₹{order.totalAmount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[10px] rounded-full ${paymentColors[order.paymentStatus?.toLowerCase()] || paymentColors['pending']}`}>
                          {order.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <DeliveryIcon className="w-3.5 h-3.5" />
                          <Badge variant="outline" className={`text-[10px] rounded-full ${deliveryColors[order.deliveryStatus?.toLowerCase()] || deliveryColors['pending']}`}>
                            {order.deliveryStatus}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(order.createdAt, 'MMM dd')}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />}>
                            <MoreHorizontal className="w-4 h-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl">
                            <DropdownMenuItem className="cursor-pointer gap-2">
                              <Eye className="w-3.5 h-3.5" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer gap-2">
                              <FileText className="w-3.5 h-3.5" /> Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => { setEditingOrder(order); setIsDialogOpen(true); }}>
                              <Edit className="w-3.5 h-3.5" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer gap-2 text-destructive" onClick={(e) => { e.preventDefault(); handleDelete(order.id); }}>
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-t border-border/50">
            <p className="text-sm text-muted-foreground">Showing {filtered.length} orders</p>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" className="h-8 rounded-lg" disabled>Previous</Button>
              <Button variant="outline" size="sm" className="h-8 w-8 rounded-lg bg-primary text-primary-foreground">1</Button>
              <Button variant="outline" size="sm" className="h-8 rounded-lg" disabled>Next</Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
