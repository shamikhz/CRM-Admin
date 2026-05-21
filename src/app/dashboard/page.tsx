'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  DollarSign, Users, ShoppingCart, UserCheck, TrendingUp, TrendingDown,
  ArrowUpRight, ArrowDownRight, Clock, MapPin, Package, AlertTriangle,
  CheckCircle2, XCircle, Activity, Eye
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { mockKPI, revenueChartData, salesPerformanceData, orderStatusData, weeklyAttendanceData, mockActivityFeed, mockLiveLocations } from '@/lib/mock-data';
import { format } from 'date-fns';
import { subscribeToCollection } from '@/firebase/firestore';
import { User } from '@/types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const CHART_COLORS = ['#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

function formatCurrency(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
}

export default function DashboardPage() {
  const kpi = mockKPI;
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToCollection<User>('users', (data) => {
      setUsers(data);
    });
    return () => unsubscribe();
  }, []);

  const totalEmployees = users.length > 0 ? users.length : kpi.totalEmployees;
  const activeEmployees = users.length > 0 ? users.filter(u => u.isActive).length : kpi.activeEmployees;

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(kpi.totalRevenue),
      change: kpi.revenueGrowth,
      icon: DollarSign,
      color: 'from-violet-500 to-purple-600',
      bgLight: 'bg-violet-50',
      textColor: 'text-violet-600',
    },
    {
      title: 'Active Employees',
      value: `${activeEmployees}/${totalEmployees}`,
      change: 0,
      subtitle: 'Online today',
      icon: Users,
      color: 'from-emerald-500 to-teal-600',
      bgLight: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      title: "Today's Orders",
      value: kpi.todaysOrders.toString(),
      change: kpi.ordersGrowth,
      icon: ShoppingCart,
      color: 'from-amber-500 to-orange-600',
      bgLight: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
    {
      title: 'Attendance Rate',
      value: `${kpi.attendanceRate}%`,
      change: kpi.attendanceChange,
      icon: UserCheck,
      color: 'from-blue-500 to-indigo-600',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
  ];

  const activityIcons: Record<string, React.ElementType> = {
    order: Package,
    visit: MapPin,
    attendance: Clock,
    task: CheckCircle2,
    customer: Users,
  };
  const activityColors: Record<string, string> = {
    order: 'bg-violet-100 text-violet-600',
    visit: 'bg-emerald-100 text-emerald-600',
    attendance: 'bg-amber-100 text-amber-600',
    task: 'bg-blue-100 text-blue-600',
    customer: 'bg-pink-100 text-pink-600',
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs gap-1.5 py-1 px-3 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live
          </Badge>
          <span className="text-sm text-muted-foreground">{format(new Date(), 'EEE, MMM dd yyyy')}</span>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, i) => (
          <motion.div key={card.title} variants={itemVariants}>
            <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow rounded-2xl">
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.color} opacity-10 rounded-bl-[100%]`} />
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground font-medium">{card.title}</p>
                    <p className="text-3xl font-bold tracking-tight">{card.value}</p>
                    {card.change !== 0 && (
                      <div className="flex items-center gap-1">
                        {card.change > 0 ? (
                          <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-xs font-semibold ${card.change > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                          {Math.abs(card.change)}%
                        </span>
                        <span className="text-xs text-muted-foreground">vs last month</span>
                      </div>
                    )}
                    {card.subtitle && (
                      <span className="text-xs text-muted-foreground">{card.subtitle}</span>
                    )}
                  </div>
                  <div className={`w-12 h-12 rounded-2xl ${card.bgLight} flex items-center justify-center`}>
                    <card.icon className={`w-6 h-6 ${card.textColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Trend */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="border-0 shadow-md rounded-2xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">Revenue Trend</CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">Monthly revenue comparison</p>
                </div>
                <Badge variant="secondary" className="rounded-full text-xs">This Year</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueChartData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                    <XAxis dataKey="name" className="text-xs" tick={{ fill: 'currentColor', fontSize: 12 }} />
                    <YAxis className="text-xs" tick={{ fill: 'currentColor', fontSize: 12 }} tickFormatter={(v) => `${v/1000}K`} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        fontSize: '12px',
                      }}
                      formatter={(value: any) => [`₹${(value/1000).toFixed(0)}K`, '']}
                    />
                    <Area type="monotone" dataKey="value" stroke="#7c3aed" strokeWidth={2.5} fill="url(#colorRevenue)" name="Revenue" />
                    <Area type="monotone" dataKey="secondaryValue" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" fill="url(#colorTarget)" name="Target" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Order Status Pie */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-md rounded-2xl h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Order Status</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">Today&apos;s distribution</p>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {orderStatusData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {orderStatusData.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[i] }} />
                    <span className="text-xs text-muted-foreground">{item.name}</span>
                    <span className="text-xs font-semibold ml-auto">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Second charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sales Performance */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-md rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Sales Performance</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">Revenue by executive</p>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesPerformanceData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" horizontal={false} />
                    <XAxis type="number" tick={{ fill: 'currentColor', fontSize: 12 }} tickFormatter={(v) => `${v/1000}K`} />
                    <YAxis type="category" dataKey="name" tick={{ fill: 'currentColor', fontSize: 12 }} width={60} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '12px' }}
                      formatter={(value: any) => [`₹${(value/1000).toFixed(0)}K`, 'Revenue']}
                    />
                    <Bar dataKey="value" fill="#7c3aed" radius={[0, 8, 8, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Attendance */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-md rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Weekly Attendance</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">Team attendance rate this week</p>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyAttendanceData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                    <XAxis dataKey="name" tick={{ fill: 'currentColor', fontSize: 12 }} />
                    <YAxis tick={{ fill: 'currentColor', fontSize: 12 }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '12px' }}
                      formatter={(value: any) => [`${value}%`, 'Attendance']}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={36}>
                      {weeklyAttendanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.value >= 80 ? '#10b981' : entry.value >= 50 ? '#f59e0b' : '#ef4444'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom: Activity Feed + Live Team */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Activity Feed */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <Card className="border-0 shadow-md rounded-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
                <Button variant="ghost" size="sm" className="text-primary text-xs">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-1 pt-0">
              {mockActivityFeed.slice(0, 6).map((item, i) => {
                const Icon = activityIcons[item.type] || Activity;
                const color = activityColors[item.type] || 'bg-gray-100 text-gray-600';
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.description}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap mt-0.5">
                      {format(item.timestamp, 'h:mm a')}
                    </span>
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Live Team Status */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="border-0 shadow-md rounded-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Live Team Status</CardTitle>
                <Badge variant="outline" className="text-xs gap-1 rounded-full">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {mockLiveLocations.map((loc) => (
                <div key={loc.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {loc.userName?.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${loc.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{loc.userName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        loc.networkStatus === 'online' ? 'bg-green-100 text-green-700' :
                        loc.networkStatus === 'weak' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {loc.networkStatus}
                      </span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                        🔋 {loc.batteryLevel}%
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg shrink-0">
                    <Eye className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
