'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  Search, Plus, Download, Building2, Phone, MapPin, IndianRupee,
  MoreHorizontal, ArrowUpDown, Eye, Edit, Trash2
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Customer } from '@/types';
import { deleteDocument, subscribeToCollection } from '@/firebase/firestore';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { CustomerForm } from '@/components/forms/CustomerForm';
import { useEffect } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState<'shopName' | 'outstandingAmount' | 'createdAt'>('shopName');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToCollection<Customer>('customers', (data) => {
      setCustomers(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const regions = useMemo(() => [...new Set(customers.map(c => c.region).filter(Boolean))], [customers]);

  const filtered = useMemo(() => {
    let result = [...customers];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c =>
        (c.shopName || '').toLowerCase().includes(q) ||
        (c.ownerName || '').toLowerCase().includes(q) ||
        c.phone.includes(q)
      );
    }
    if (regionFilter !== 'all') {
      result = result.filter(c => c.region === regionFilter);
    }
    if (statusFilter !== 'all') {
      result = result.filter(c => c.status === statusFilter);
    }
    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'shopName') cmp = a.shopName.localeCompare(b.shopName);
      else if (sortField === 'outstandingAmount') cmp = a.outstandingAmount - b.outstandingAmount;
      else cmp = a.createdAt.getTime() - b.createdAt.getTime();
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [customers, searchQuery, regionFilter, statusFilter, sortField, sortDir]);

  const totalOutstanding = customers.reduce((sum, c) => sum + c.outstandingAmount, 0);

  const handleDelete = async (customerId: string) => {
    try {
      await deleteDocument('customers', customerId);
      toast.success('Customer deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete customer');
    }
  };

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Customer Management</h1>
          <p className="text-muted-foreground mt-1">Manage your customer base and track payments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger render={<Button className="rounded-xl animated-gradient border-0 text-white gap-2" onClick={() => setEditingCustomer(null)} />}>
              <Plus className="w-4 h-4" /> Add Customer
            </DialogTrigger>
            <DialogContent className="rounded-2xl sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
              </DialogHeader>
              <CustomerForm 
                key={editingCustomer?.id || 'new'}
                initialData={editingCustomer || undefined}
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
          { label: 'Total Customers', value: customers.length, color: 'text-violet-600 bg-violet-50' },
          { label: 'Active', value: customers.filter(c => c.status === 'active').length, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Outstanding', value: `₹${(totalOutstanding / 1000).toFixed(0)}K`, color: 'text-amber-600 bg-amber-50' },
          { label: 'Regions', value: regions.length, color: 'text-blue-600 bg-blue-50' },
        ].map((s) => (
          <Card key={s.label} className="border-0 shadow-sm rounded-2xl">
            <CardContent className="p-4">
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 rounded-xl bg-muted/50 border-0"
          />
        </div>
        <Select value={regionFilter} onValueChange={(v) => v && setRegionFilter(v)}>
          <SelectTrigger className="w-44 h-10 rounded-xl border-0 bg-muted/50">
            <SelectValue placeholder="All Regions" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">All Regions</SelectItem>
            {regions.map(r => <SelectItem key={r} value={r!}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => v && setStatusFilter(v)}>
          <SelectTrigger className="w-36 h-10 rounded-xl border-0 bg-muted/50">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Table */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="cursor-pointer" onClick={() => handleSort('shopName')}>
                    <div className="flex items-center gap-1">Shop Name <ArrowUpDown className="w-3 h-3" /></div>
                  </TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('outstandingAmount')}>
                    <div className="flex items-center gap-1">Outstanding <ArrowUpDown className="w-3 h-3" /></div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('createdAt')}>
                    <div className="flex items-center gap-1">Added <ArrowUpDown className="w-3 h-3" /></div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((customer, i) => (
                  <motion.tr
                    key={customer.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="group hover:bg-muted/30 transition-colors border-b border-border/50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <Building2 className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium text-sm">{customer.shopName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{customer.ownerName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{customer.phone}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] rounded-full">{customer.region}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm font-semibold ${customer.outstandingAmount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        ₹{customer.outstandingAmount.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[10px] rounded-full ${
                        customer.status === 'active'
                          ? 'border-green-200 bg-green-50 text-green-700'
                          : 'border-gray-200 bg-gray-50 text-gray-500'
                      }`}>
                        {customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(customer.createdAt, 'MMM dd, yyyy')}
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
                          <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => { setEditingCustomer(customer); setIsDialogOpen(true); }}>
                            <Edit className="w-3.5 h-3.5" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer gap-2 text-destructive" onClick={() => handleDelete(customer.id)}>
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border/50">
            <p className="text-sm text-muted-foreground">Showing {filtered.length} of {customers.length} customers</p>
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
