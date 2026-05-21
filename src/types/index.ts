// TypeScript type definitions for FieldForce CRM

export type UserRole = 'admin' | 'manager' | 'sales-executive';

export interface User {
  id: string;
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  assignedRegion: string;
  profileImage: string;
  managerId: string | null;
  createdAt: Date;
  isActive?: boolean;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName?: string;
  checkIn: Date;
  checkOut: Date | null;
  gpsLocation: GeoPoint;
  workDuration: number; // in minutes
  attendanceStatus: 'present' | 'absent' | 'late' | 'half-day' | 'on-leave';
  date: string; // YYYY-MM-DD
}

export interface Customer {
  id: string;
  shopName: string;
  ownerName: string;
  phone: string;
  address: string;
  assignedExecutive: string;
  locationCoordinates: GeoPoint;
  outstandingAmount: number;
  createdAt: Date;
  region?: string;
  email?: string;
  status?: 'active' | 'inactive';
}

export interface OrderProduct {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Order {
  id: string;
  orderId: string;
  customerId: string;
  customerName?: string;
  salesExecutiveId: string;
  salesExecutiveName?: string;
  products: OrderProduct[];
  totalAmount: number;
  paymentStatus: 'paid' | 'pending' | 'partial' | 'overdue';
  deliveryStatus: 'pending' | 'dispatched' | 'delivered' | 'cancelled';
  createdAt: Date;
}

export interface Visit {
  id: string;
  customerId: string;
  customerName?: string;
  salesExecutiveId: string;
  salesExecutiveName?: string;
  visitPurpose: string;
  notes: string;
  gpsLocation: GeoPoint;
  images: string[];
  visitStatus: 'planned' | 'completed' | 'cancelled' | 'in-progress';
  createdAt: Date;
}

export interface Task {
  id: string;
  assignedTo: string;
  assignedToName?: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  createdBy: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'alert';
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface Report {
  id: string;
  totalRevenue: number;
  totalOrders: number;
  attendanceRate: number;
  conversionRate: number;
  generatedAt: Date;
  period: string;
}

export interface LiveLocation {
  id: string;
  userId: string;
  userName?: string;
  latitude: number;
  longitude: number;
  batteryLevel: number;
  networkStatus: 'online' | 'offline' | 'weak';
  updatedAt: Date;
  isActive?: boolean;
}

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface Region {
  id: string;
  name: string;
  description: string;
  managerId: string;
  coordinates?: GeoPoint;
}

// Dashboard KPI types
export interface DashboardKPI {
  totalRevenue: number;
  revenueGrowth: number;
  activeEmployees: number;
  totalEmployees: number;
  todaysOrders: number;
  ordersGrowth: number;
  attendanceRate: number;
  attendanceChange: number;
  totalCustomers: number;
  customerGrowth: number;
  pendingTasks: number;
  conversionRate: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  secondaryValue?: number;
}

export interface ActivityItem {
  id: string;
  type: 'order' | 'visit' | 'attendance' | 'task' | 'customer';
  title: string;
  description: string;
  timestamp: Date;
  user: string;
  icon?: string;
}
