'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Download, FileText, TrendingUp, TrendingDown, DollarSign,
  Users, ShoppingCart, MapPin, BarChart3, PieChart as PieChartIcon, Target
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  RadialBarChart, RadialBar
} from 'recharts';
import {
  revenueChartData, salesPerformanceData, regionPerformanceData,
  orderStatusData, weeklyAttendanceData, mockKPI
} from '@/lib/mock-data';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const COLORS = ['#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899'];

const monthlyGrowthData = [
  { name: 'Jan', revenue: 185, customers: 12, orders: 45 },
  { name: 'Feb', revenue: 210, customers: 15, orders: 52 },
  { name: 'Mar', revenue: 245, customers: 18, orders: 61 },
  { name: 'Apr', revenue: 280, customers: 22, orders: 73 },
  { name: 'May', revenue: 320, customers: 28, orders: 85 },
  { name: 'Jun', revenue: 295, customers: 25, orders: 78 },
  { name: 'Jul', revenue: 340, customers: 31, orders: 92 },
  { name: 'Aug', revenue: 370, customers: 35, orders: 98 },
  { name: 'Sep', revenue: 355, customers: 33, orders: 95 },
  { name: 'Oct', revenue: 390, customers: 38, orders: 105 },
  { name: 'Nov', revenue: 415, customers: 42, orders: 112 },
  { name: 'Dec', revenue: 442, customers: 45, orders: 120 },
];

const conversionData = [
  { name: 'Leads', value: 100, fill: '#7c3aed' },
  { name: 'Visits', value: 75, fill: '#a78bfa' },
  { name: 'Proposals', value: 50, fill: '#c4b5fd' },
  { name: 'Closed', value: 35, fill: '#10b981' },
];

const productivityData = [
  { name: 'Rahul', visits: 28, orders: 15, score: 92 },
  { name: 'Priya', visits: 25, orders: 12, score: 85 },
  { name: 'Amit', visits: 22, orders: 10, score: 78 },
  { name: 'Vikram', visits: 30, orders: 18, score: 95 },
  { name: 'Ananya', visits: 20, orders: 9, score: 72 },
  { name: 'Sneha', visits: 18, orders: 8, score: 65 },
];

export default function ReportsPage() {
  const [period, setPeriod] = useState('this-year');

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">Company-wide business intelligence</p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={(v) => v && setPeriod(v)}>
            <SelectTrigger className="w-40 h-10 rounded-xl border-0 bg-muted/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="this-quarter">This Quarter</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="rounded-xl gap-2">
            <Download className="w-4 h-4" /> Export PDF
          </Button>
          <Button variant="outline" className="rounded-xl gap-2">
            <FileText className="w-4 h-4" /> CSV
          </Button>
        </div>
      </motion.div>

      {/* Top KPI Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {[
          { label: 'Revenue', value: '₹28.5L', change: '+12.5%', up: true },
          { label: 'Orders', value: '856', change: '+8.3%', up: true },
          { label: 'Customers', value: '45', change: '+15%', up: true },
          { label: 'Conversion', value: '68.5%', change: '+3.2%', up: true },
          { label: 'Attendance', value: '83.3%', change: '-2.1%', up: false },
          { label: 'Pending', value: '₹2.7L', change: '-5.4%', up: false },
        ].map((kpi) => (
          <Card key={kpi.label} className="border-0 shadow-sm rounded-2xl">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
              <p className="text-xl font-bold mt-1">{kpi.value}</p>
              <span className={`text-[10px] font-semibold ${kpi.up ? 'text-emerald-600' : 'text-red-500'}`}>
                {kpi.change}
              </span>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Revenue & Growth Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-md rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Revenue & Orders Trend</CardTitle>
              <p className="text-sm text-muted-foreground">Monthly comparison</p>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                    <XAxis dataKey="name" tick={{ fill: 'currentColor', fontSize: 12 }} />
                    <YAxis yAxisId="left" tick={{ fill: 'currentColor', fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fill: 'currentColor', fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 4 }} name="Revenue (K)" />
                    <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} name="Orders" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-md rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Region Performance</CardTitle>
              <p className="text-sm text-muted-foreground">Revenue by region</p>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                    <XAxis dataKey="name" tick={{ fill: 'currentColor', fontSize: 10 }} angle={-15} textAnchor="end" height={50} />
                    <YAxis tick={{ fill: 'currentColor', fontSize: 12 }} tickFormatter={(v) => `${v/1000}K`} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '12px' }} formatter={(value: any) => [`₹${(value/1000).toFixed(0)}K`, 'Revenue']} />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40}>
                      {regionPerformanceData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Conversion Funnel & Employee Productivity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-md rounded-2xl h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Conversion Funnel</CardTitle>
              <p className="text-sm text-muted-foreground">Lead to close pipeline</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mt-2">
                {conversionData.map((stage, i) => (
                  <div key={stage.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{stage.name}</span>
                      <span className="text-sm font-bold">{stage.value}%</span>
                    </div>
                    <div className="relative h-8 rounded-lg overflow-hidden bg-muted/30">
                      <motion.div
                        className="absolute inset-y-0 left-0 rounded-lg"
                        style={{ backgroundColor: stage.fill }}
                        initial={{ width: 0 }}
                        animate={{ width: `${stage.value}%` }}
                        transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="border-0 shadow-md rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Employee Productivity</CardTitle>
              <p className="text-sm text-muted-foreground">Visits, orders, and performance score</p>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productivityData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" horizontal={false} />
                    <XAxis type="number" tick={{ fill: 'currentColor', fontSize: 12 }} />
                    <YAxis type="category" dataKey="name" tick={{ fill: 'currentColor', fontSize: 12 }} width={55} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                    <Legend />
                    <Bar dataKey="visits" fill="#7c3aed" radius={[0, 4, 4, 0]} barSize={12} name="Visits" />
                    <Bar dataKey="orders" fill="#10b981" radius={[0, 4, 4, 0]} barSize={12} name="Orders" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Attendance Analytics */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-md rounded-2xl">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">Attendance Analytics</CardTitle>
                <p className="text-sm text-muted-foreground">Daily team attendance this week</p>
              </div>
              <Badge variant="secondary" className="rounded-full">This Week</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyAttendanceData}>
                  <defs>
                    <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                  <XAxis dataKey="name" tick={{ fill: 'currentColor', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'currentColor', fontSize: 12 }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '12px' }} formatter={(value: any) => [`${value}%`, 'Attendance']} />
                  <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2.5} fill="url(#colorAttendance)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
