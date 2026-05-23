'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  MapPin, Search, Filter, Battery, Wifi, WifiOff, Signal,
  Eye, Navigation, Clock, ShoppingCart, Users as UsersIcon, Activity
} from 'lucide-react';
import { subscribeToCollection, collections } from '@/firebase/firestore';
import { format } from 'date-fns';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function TeamTrackingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  useEffect(() => {
    const unsub = subscribeToCollection(collections.users, (data: any[]) => {
      // Filter for sales-executives
      const executives = data.filter(u => u.role === 'sales-executive');
      setTeamMembers(executives.map(u => ({
        id: u.id,
        userId: u.id,
        userName: u.name || 'Unknown Executive',
        isActive: !!u.isActive,
        batteryLevel: 90, // Static for now until full battery tracking is implemented
        networkStatus: u.isActive ? 'online' : 'offline',
        updatedAt: u.updatedAt || u.createdAt || new Date(),
        assignedRegion: u.assignedRegion || 'Unassigned Region'
      })));
    });
    return () => unsub();
  }, []);

  const filteredLocations = teamMembers.filter((loc) => {
    const matchSearch = (loc.userName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' ||
      (statusFilter === 'online' && loc.isActive) ||
      (statusFilter === 'offline' && !loc.isActive);
    return matchSearch && matchStatus;
  });

  const onlineCount = teamMembers.filter(l => l.isActive).length;
  const offlineCount = teamMembers.filter(l => !l.isActive).length;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Team Tracking</h1>
          <p className="text-muted-foreground mt-1">Monitor your field team in real-time</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="rounded-full gap-1.5 py-1 px-3">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            {onlineCount} Online
          </Badge>
          <Badge variant="outline" className="rounded-full gap-1.5 py-1 px-3 text-muted-foreground">
            <span className="w-2 h-2 bg-gray-400 rounded-full" />
            {offlineCount} Offline
          </Badge>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Team', value: teamMembers.length, icon: UsersIcon, color: 'text-violet-600 bg-violet-50' },
          { label: 'Active Now', value: onlineCount, icon: Activity, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'On Visit', value: 3, icon: MapPin, color: 'text-amber-600 bg-amber-50' },
          { label: 'Avg Battery', value: `${teamMembers.length ? Math.round(teamMembers.reduce((a, l) => a + l.batteryLevel, 0) / teamMembers.length) : 0}%`, icon: Battery, color: 'text-blue-600 bg-blue-50' },
        ].map((stat) => (
          <Card key={stat.label} className="border-0 shadow-sm rounded-2xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Main content: Split view */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Employee List */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="border-0 shadow-md rounded-2xl">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search team..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9 rounded-xl bg-muted/50 border-0"
                  />
                </div>
                <Select value={statusFilter} onValueChange={(v) => v && setStatusFilter(v)}>
                  <SelectTrigger className="w-28 h-9 rounded-xl border-0 bg-muted/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pt-0 max-h-[600px] overflow-y-auto">
              {filteredLocations.map((loc, i) => {
                const isSelected = selectedEmployee === loc.userId;
                return (
                  <motion.div
                    key={loc.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedEmployee(isSelected ? null : loc.userId)}
                    className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${isSelected
                      ? 'bg-primary/10 border border-primary/20 shadow-sm'
                      : 'hover:bg-muted/50 border border-transparent'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="h-11 w-11">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                            {loc.userName?.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${loc.isActive ? 'bg-green-500' : 'bg-gray-400'
                          }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold truncate">{loc.userName}</p>
                          <Badge
                            variant="outline"
                            className={`text-[10px] rounded-full px-2 ${loc.isActive
                              ? 'border-green-200 bg-green-50 text-green-700'
                              : 'border-gray-200 bg-gray-50 text-gray-500'
                              }`}
                          >
                            {loc.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {loc.assignedRegion || 'Unknown Region'}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Battery className="w-3 h-3" /> {loc.batteryLevel}%
                          </span>
                          <span className={`text-[10px] flex items-center gap-1 ${loc.networkStatus === 'online' ? 'text-green-600' :
                            loc.networkStatus === 'weak' ? 'text-amber-600' : 'text-red-600'
                            }`}>
                            {loc.networkStatus === 'online' ? <Wifi className="w-3 h-3" /> :
                              loc.networkStatus === 'weak' ? <Signal className="w-3 h-3" /> :
                                <WifiOff className="w-3 h-3" />}
                            {loc.networkStatus}
                          </span>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {format(loc.updatedAt, 'h:mm a')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Expanded details */}
                    {isSelected && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="mt-3 pt-3 border-t border-border/50 space-y-2"
                      >
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2 rounded-lg bg-muted/50">
                            <p className="text-[10px] text-muted-foreground">Orders Today</p>
                            <p className="text-sm font-semibold">3</p>
                          </div>
                          <div className="p-2 rounded-lg bg-muted/50">
                            <p className="text-[10px] text-muted-foreground">Visits Done</p>
                            <p className="text-sm font-semibold">5</p>
                          </div>
                          <div className="p-2 rounded-lg bg-muted/50">
                            <p className="text-[10px] text-muted-foreground">Check-in</p>
                            <p className="text-sm font-semibold">9:05 AM</p>
                          </div>
                          <div className="p-2 rounded-lg bg-muted/50">
                            <p className="text-[10px] text-muted-foreground">Distance</p>
                            <p className="text-sm font-semibold">12.5 km</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1 h-8 rounded-lg text-xs">
                            <Navigation className="w-3 h-3 mr-1" /> Track
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 h-8 rounded-lg text-xs">
                            <Eye className="w-3 h-3 mr-1" /> Profile
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Map Area */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="relative h-[700px] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                {/* Map placeholder with employee dots */}
                <div className="absolute inset-0 opacity-10">
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>

                {/* Simulated employee pins on map */}
                {filteredLocations.map((loc, i) => {
                  // Map coordinates to relative positions for display
                  const positions = [
                    { top: '25%', left: '35%' },
                    { top: '55%', left: '20%' },
                    { top: '70%', left: '55%' },
                    { top: '45%', left: '60%' },
                    { top: '20%', left: '40%' },
                    { top: '60%', left: '30%' },
                  ];
                  const pos = positions[i % positions.length];
                  const isSelected2 = selectedEmployee === loc.userId;

                  return (
                    <motion.div
                      key={loc.id}
                      className="absolute cursor-pointer z-10"
                      style={{ top: pos.top, left: pos.left }}
                      animate={isSelected2 ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ repeat: isSelected2 ? Infinity : 0, duration: 2 }}
                      onClick={() => setSelectedEmployee(isSelected2 ? null : loc.userId)}
                    >
                      {/* Pulse ring */}
                      {loc.isActive && (
                        <span className="absolute inset-0 w-10 h-10 -m-1 rounded-full bg-primary/20 animate-ping" />
                      )}
                      <div className={`relative w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg ${loc.isActive ? 'bg-primary' : 'bg-gray-400'
                        } ${isSelected2 ? 'ring-4 ring-primary/30' : ''}`}>
                        {loc.userName?.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      {isSelected2 && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute top-10 left-1/2 -translate-x-1/2 bg-white dark:bg-card rounded-xl shadow-xl p-3 min-w-[160px] z-20"
                        >
                          <p className="text-xs font-semibold text-center">{loc.userName}</p>
                          <p className="text-[10px] text-muted-foreground text-center mt-0.5">
                            Last updated: {format(loc.updatedAt, 'h:mm a')}
                          </p>
                          <div className="flex justify-center gap-2 mt-2">
                            <Badge variant="outline" className="text-[9px]">🔋 {loc.batteryLevel}%</Badge>
                            <Badge variant="outline" className="text-[9px]">{loc.networkStatus}</Badge>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}

                {/* Map placeholder text */}
                <div className="text-center z-0">
                  <MapPin className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground/50 font-medium">Live Map View</p>
                  <p className="text-xs text-muted-foreground/30 mt-1">Add Google Maps API key for full map</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
