'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  User, Bell, Shield, Palette, Globe, Database, Key,
  Save, Upload, Moon, Sun, Monitor
} from 'lucide-react';
import { useUIStore, useAuthStore } from '@/store';
import { mockUsers, mockCustomers, mockOrders, mockTasks } from '@/lib/mock-data';
import { createDocument } from '@/firebase/firestore';
import { toast } from 'sonner';
import { useState } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function SettingsPage() {
  const { theme, setTheme } = useUIStore();
  const { user } = useAuthStore();
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeedData = async () => {
    if (!confirm('Are you sure you want to seed mock data? This will write a lot of data to your live Firestore database.')) return;
    
    setIsSeeding(true);
    const loadingToast = toast.loading('Seeding mock data to Firestore...');
    try {
      for (const u of mockUsers) {
        await createDocument('users', u, u.uid);
      }
      for (const c of mockCustomers) {
        await createDocument('customers', c, c.id);
      }
      for (const o of mockOrders) {
        await createDocument('orders', o, o.id);
      }
      for (const t of mockTasks) {
        await createDocument('tasks', t, t.id);
      }
      toast.success('Successfully seeded all mock data!', { id: loadingToast });
    } catch (error: any) {
      toast.error(error.message || 'Failed to seed data', { id: loadingToast });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and application preferences</p>
      </motion.div>

      <Tabs defaultValue="profile" className="space-y-6">
        <motion.div variants={itemVariants}>
          <TabsList className="bg-muted/50 rounded-xl p-1 h-auto flex-wrap">
            <TabsTrigger value="profile" className="rounded-lg text-xs gap-1.5">
              <User className="w-3.5 h-3.5" /> Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-lg text-xs gap-1.5">
              <Bell className="w-3.5 h-3.5" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="appearance" className="rounded-lg text-xs gap-1.5">
              <Palette className="w-3.5 h-3.5" /> Appearance
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-lg text-xs gap-1.5">
              <Shield className="w-3.5 h-3.5" /> Security
            </TabsTrigger>
            <TabsTrigger value="advanced" className="rounded-lg text-xs gap-1.5">
              <Database className="w-3.5 h-3.5" /> Advanced
            </TabsTrigger>
          </TabsList>
        </motion.div>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-md rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg">Profile Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                      {user?.name?.split(' ').map(n => n[0]).join('') || 'AD'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm" className="rounded-lg gap-2">
                      <Upload className="w-3.5 h-3.5" /> Upload Photo
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG. Max 5MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Full Name</Label>
                    <Input defaultValue={user?.name || 'Admin User'} className="h-10 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Email Address</Label>
                    <Input defaultValue={user?.email || 'admin@fieldforce.io'} className="h-10 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Phone Number</Label>
                    <Input defaultValue={user?.phone || '+91 99999 00000'} className="h-10 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Role</Label>
                    <Input defaultValue={user?.role || 'admin'} disabled className="h-10 rounded-xl bg-muted/50" />
                  </div>
                </div>

                <Button className="rounded-xl gap-2">
                  <Save className="w-4 h-4" /> Save Changes
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-md rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg">Notification Preferences</CardTitle>
                <CardDescription>Choose what notifications you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { title: 'New Orders', desc: 'When a new order is placed by any executive', default: true },
                  { title: 'Missed Attendance', desc: 'When an employee misses check-in', default: true },
                  { title: 'Payment Alerts', desc: 'Overdue payment reminders', default: true },
                  { title: 'Task Updates', desc: 'When task status changes', default: false },
                  { title: 'Employee Inactivity', desc: 'When an employee is inactive for too long', default: true },
                  { title: 'Target Achievements', desc: 'Sales target milestone notifications', default: true },
                  { title: 'Weekly Reports', desc: 'Auto-generated weekly summaries', default: false },
                ].map((item) => (
                  <div key={item.title} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch defaultChecked={item.default} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-4">
          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-md rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg">Appearance</CardTitle>
                <CardDescription>Customize the look and feel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-medium mb-3 block">Theme</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'light' as const, icon: Sun, label: 'Light' },
                      { value: 'dark' as const, icon: Moon, label: 'Dark' },
                    ].map((t) => (
                      <button
                        key={t.value}
                        onClick={() => setTheme(t.value)}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                          theme === t.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/30'
                        }`}
                      >
                        <t.icon className="w-5 h-5" />
                        <span className="text-xs font-medium">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger className="w-full h-10 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                        <SelectItem value="ta">Tamil</SelectItem>
                        <SelectItem value="te">Telugu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Date Format</Label>
                    <Select defaultValue="dmy">
                      <SelectTrigger className="w-full h-10 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-md rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg">Security Settings</CardTitle>
                <CardDescription>Manage your security preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Current Password</Label>
                    <Input type="password" placeholder="••••••••" className="h-10 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">New Password</Label>
                    <Input type="password" placeholder="••••••••" className="h-10 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Confirm New Password</Label>
                    <Input type="password" placeholder="••••••••" className="h-10 rounded-xl" />
                  </div>
                </div>

                <Button className="rounded-xl gap-2">
                  <Key className="w-4 h-4" /> Update Password
                </Button>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">Active Sessions</h3>
                  <div className="space-y-3">
                    {[
                      { device: 'Chrome on Windows', location: 'New Delhi, India', current: true },
                      { device: 'Safari on iPhone', location: 'Mumbai, India', current: false },
                    ].map((session) => (
                      <div key={session.device} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                        <div>
                          <p className="text-sm font-medium flex items-center gap-2">
                            {session.device}
                            {session.current && <Badge className="text-[10px]">Current</Badge>}
                          </p>
                          <p className="text-xs text-muted-foreground">{session.location}</p>
                        </div>
                        {!session.current && (
                          <Button variant="ghost" size="sm" className="text-destructive text-xs rounded-lg">
                            Revoke
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-4">
          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-md rounded-2xl border-destructive/20 bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-lg text-destructive">Advanced Actions</CardTitle>
                <CardDescription className="text-destructive/80">Careful, these actions can modify bulk data in your live database.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold mb-2">Data Migration</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Push all local mock data (Users, Customers, Orders, Tasks) into your live Firebase Firestore database.
                    Use this to populate your dashboard before fully switching to real-time data.
                  </p>
                  <Button 
                    onClick={handleSeedData} 
                    disabled={isSeeding} 
                    className="bg-destructive hover:bg-destructive/90 text-white rounded-xl gap-2"
                  >
                    <Database className="w-4 h-4" />
                    {isSeeding ? 'Seeding Data...' : 'Seed Mock Data to Firestore'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
