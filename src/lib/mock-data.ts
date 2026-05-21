import type {
  User, AttendanceRecord, Customer, Order, Visit,
  Task, Notification, LiveLocation, DashboardKPI, ActivityItem, ChartDataPoint
} from '@/types';

// ─── Users ──────────────────────────────────────────────────────────────
export const mockUsers: User[] = [
  { uid: 'u1', name: 'Rahul Sharma', email: 'rahul@fieldforce.io', role: 'sales-executive', phone: '+91 98765 43210', assignedRegion: 'North Delhi', profileImage: '', managerId: 'm1', createdAt: new Date('2024-06-15'), isActive: true },
  { uid: 'u2', name: 'Priya Patel', email: 'priya@fieldforce.io', role: 'sales-executive', phone: '+91 98765 43211', assignedRegion: 'South Mumbai', profileImage: '', managerId: 'm1', createdAt: new Date('2024-07-20'), isActive: true },
  { uid: 'u3', name: 'Amit Kumar', email: 'amit@fieldforce.io', role: 'sales-executive', phone: '+91 98765 43212', assignedRegion: 'East Bangalore', profileImage: '', managerId: 'm2', createdAt: new Date('2024-08-10'), isActive: true },
  { uid: 'u4', name: 'Sneha Reddy', email: 'sneha@fieldforce.io', role: 'sales-executive', phone: '+91 98765 43213', assignedRegion: 'West Hyderabad', profileImage: '', managerId: 'm2', createdAt: new Date('2024-09-05'), isActive: false },
  { uid: 'u5', name: 'Vikram Singh', email: 'vikram@fieldforce.io', role: 'sales-executive', phone: '+91 98765 43214', assignedRegion: 'North Delhi', profileImage: '', managerId: 'm1', createdAt: new Date('2024-10-12'), isActive: true },
  { uid: 'u6', name: 'Ananya Das', email: 'ananya@fieldforce.io', role: 'sales-executive', phone: '+91 98765 43215', assignedRegion: 'Central Pune', profileImage: '', managerId: 'm2', createdAt: new Date('2024-11-01'), isActive: true },
  { uid: 'm1', name: 'Rajesh Verma', email: 'rajesh@fieldforce.io', role: 'manager', phone: '+91 98765 43220', assignedRegion: 'North Zone', profileImage: '', managerId: null, createdAt: new Date('2024-01-10'), isActive: true },
  { uid: 'm2', name: 'Kavita Nair', email: 'kavita@fieldforce.io', role: 'manager', phone: '+91 98765 43221', assignedRegion: 'South Zone', profileImage: '', managerId: null, createdAt: new Date('2024-02-15'), isActive: true },
];

// ─── Attendance ─────────────────────────────────────────────────────────
export const mockAttendance: AttendanceRecord[] = [
  { id: 'a1', userId: 'u1', userName: 'Rahul Sharma', checkIn: new Date('2025-05-21T09:05:00'), checkOut: new Date('2025-05-21T18:10:00'), gpsLocation: { latitude: 28.6139, longitude: 77.209 }, workDuration: 545, attendanceStatus: 'present', date: '2025-05-21' },
  { id: 'a2', userId: 'u2', userName: 'Priya Patel', checkIn: new Date('2025-05-21T09:30:00'), checkOut: null, gpsLocation: { latitude: 19.076, longitude: 72.8777 }, workDuration: 420, attendanceStatus: 'present', date: '2025-05-21' },
  { id: 'a3', userId: 'u3', userName: 'Amit Kumar', checkIn: new Date('2025-05-21T10:15:00'), checkOut: null, gpsLocation: { latitude: 12.9716, longitude: 77.5946 }, workDuration: 330, attendanceStatus: 'late', date: '2025-05-21' },
  { id: 'a4', userId: 'u4', userName: 'Sneha Reddy', checkIn: new Date('2025-05-21T00:00:00'), checkOut: null, gpsLocation: { latitude: 17.385, longitude: 78.4867 }, workDuration: 0, attendanceStatus: 'absent', date: '2025-05-21' },
  { id: 'a5', userId: 'u5', userName: 'Vikram Singh', checkIn: new Date('2025-05-21T08:55:00'), checkOut: null, gpsLocation: { latitude: 28.7041, longitude: 77.1025 }, workDuration: 480, attendanceStatus: 'present', date: '2025-05-21' },
  { id: 'a6', userId: 'u6', userName: 'Ananya Das', checkIn: new Date('2025-05-21T09:00:00'), checkOut: null, gpsLocation: { latitude: 18.5204, longitude: 73.8567 }, workDuration: 460, attendanceStatus: 'present', date: '2025-05-21' },
];

// ─── Customers ──────────────────────────────────────────────────────────
export const mockCustomers: Customer[] = [
  { id: 'c1', shopName: 'Metro Supermart', ownerName: 'Arjun Kapoor', phone: '+91 99887 76654', address: '45, MG Road, Connaught Place, New Delhi', assignedExecutive: 'u1', locationCoordinates: { latitude: 28.6315, longitude: 77.2167 }, outstandingAmount: 45000, createdAt: new Date('2024-08-15'), region: 'North Delhi', status: 'active' },
  { id: 'c2', shopName: 'FreshMart Groceries', ownerName: 'Deepa Joshi', phone: '+91 99887 76655', address: '12, Linking Road, Bandra West, Mumbai', assignedExecutive: 'u2', locationCoordinates: { latitude: 19.0596, longitude: 72.8295 }, outstandingAmount: 12000, createdAt: new Date('2024-09-20'), region: 'South Mumbai', status: 'active' },
  { id: 'c3', shopName: 'QuickStop Retail', ownerName: 'Suresh Menon', phone: '+91 99887 76656', address: '78, Brigade Road, Bangalore', assignedExecutive: 'u3', locationCoordinates: { latitude: 12.9716, longitude: 77.6071 }, outstandingAmount: 0, createdAt: new Date('2024-10-05'), region: 'East Bangalore', status: 'active' },
  { id: 'c4', shopName: 'CityMart Plaza', ownerName: 'Lakshmi Iyer', phone: '+91 99887 76657', address: '34, Jubilee Hills, Hyderabad', assignedExecutive: 'u4', locationCoordinates: { latitude: 17.4319, longitude: 78.4093 }, outstandingAmount: 78500, createdAt: new Date('2024-11-12'), region: 'West Hyderabad', status: 'active' },
  { id: 'c5', shopName: 'Golden Traders', ownerName: 'Manoj Tiwari', phone: '+91 99887 76658', address: '56, Chandni Chowk, Old Delhi', assignedExecutive: 'u1', locationCoordinates: { latitude: 28.6506, longitude: 77.2302 }, outstandingAmount: 23000, createdAt: new Date('2024-12-01'), region: 'North Delhi', status: 'active' },
  { id: 'c6', shopName: 'Nova Electronics', ownerName: 'Ravi Shankar', phone: '+91 99887 76659', address: '90, FC Road, Pune', assignedExecutive: 'u6', locationCoordinates: { latitude: 18.5314, longitude: 73.8446 }, outstandingAmount: 5200, createdAt: new Date('2025-01-15'), region: 'Central Pune', status: 'active' },
  { id: 'c7', shopName: 'Zenith Supplies', ownerName: 'Pooja Mehta', phone: '+91 99887 76660', address: '22, Koramangala, Bangalore', assignedExecutive: 'u3', locationCoordinates: { latitude: 12.9352, longitude: 77.6245 }, outstandingAmount: 15800, createdAt: new Date('2025-02-20'), region: 'East Bangalore', status: 'inactive' },
  { id: 'c8', shopName: 'Apex Distribution', ownerName: 'Kiran Rao', phone: '+91 99887 76661', address: '67, Ameerpet, Hyderabad', assignedExecutive: 'u4', locationCoordinates: { latitude: 17.4375, longitude: 78.4483 }, outstandingAmount: 92000, createdAt: new Date('2025-03-10'), region: 'West Hyderabad', status: 'active' },
];

// ─── Orders ─────────────────────────────────────────────────────────────
export const mockOrders: Order[] = [
  { id: 'o1', orderId: 'ORD-2025-001', customerId: 'c1', customerName: 'Metro Supermart', salesExecutiveId: 'u1', salesExecutiveName: 'Rahul Sharma', products: [{ name: 'Product A', quantity: 50, unitPrice: 200, total: 10000 }, { name: 'Product B', quantity: 30, unitPrice: 350, total: 10500 }], totalAmount: 20500, paymentStatus: 'paid', deliveryStatus: 'delivered', createdAt: new Date('2025-05-20') },
  { id: 'o2', orderId: 'ORD-2025-002', customerId: 'c2', customerName: 'FreshMart Groceries', salesExecutiveId: 'u2', salesExecutiveName: 'Priya Patel', products: [{ name: 'Product C', quantity: 100, unitPrice: 150, total: 15000 }], totalAmount: 15000, paymentStatus: 'pending', deliveryStatus: 'dispatched', createdAt: new Date('2025-05-21') },
  { id: 'o3', orderId: 'ORD-2025-003', customerId: 'c3', customerName: 'QuickStop Retail', salesExecutiveId: 'u3', salesExecutiveName: 'Amit Kumar', products: [{ name: 'Product A', quantity: 25, unitPrice: 200, total: 5000 }, { name: 'Product D', quantity: 40, unitPrice: 500, total: 20000 }], totalAmount: 25000, paymentStatus: 'partial', deliveryStatus: 'pending', createdAt: new Date('2025-05-21') },
  { id: 'o4', orderId: 'ORD-2025-004', customerId: 'c4', customerName: 'CityMart Plaza', salesExecutiveId: 'u4', salesExecutiveName: 'Sneha Reddy', products: [{ name: 'Product B', quantity: 60, unitPrice: 350, total: 21000 }], totalAmount: 21000, paymentStatus: 'overdue', deliveryStatus: 'delivered', createdAt: new Date('2025-05-19') },
  { id: 'o5', orderId: 'ORD-2025-005', customerId: 'c5', customerName: 'Golden Traders', salesExecutiveId: 'u1', salesExecutiveName: 'Rahul Sharma', products: [{ name: 'Product E', quantity: 80, unitPrice: 120, total: 9600 }], totalAmount: 9600, paymentStatus: 'paid', deliveryStatus: 'delivered', createdAt: new Date('2025-05-18') },
  { id: 'o6', orderId: 'ORD-2025-006', customerId: 'c6', customerName: 'Nova Electronics', salesExecutiveId: 'u6', salesExecutiveName: 'Ananya Das', products: [{ name: 'Product F', quantity: 20, unitPrice: 800, total: 16000 }], totalAmount: 16000, paymentStatus: 'pending', deliveryStatus: 'pending', createdAt: new Date('2025-05-21') },
  { id: 'o7', orderId: 'ORD-2025-007', customerId: 'c1', customerName: 'Metro Supermart', salesExecutiveId: 'u1', salesExecutiveName: 'Rahul Sharma', products: [{ name: 'Product A', quantity: 70, unitPrice: 200, total: 14000 }], totalAmount: 14000, paymentStatus: 'paid', deliveryStatus: 'dispatched', createdAt: new Date('2025-05-20') },
  { id: 'o8', orderId: 'ORD-2025-008', customerId: 'c8', customerName: 'Apex Distribution', salesExecutiveId: 'u5', salesExecutiveName: 'Vikram Singh', products: [{ name: 'Product C', quantity: 45, unitPrice: 150, total: 6750 }, { name: 'Product D', quantity: 10, unitPrice: 500, total: 5000 }], totalAmount: 11750, paymentStatus: 'pending', deliveryStatus: 'pending', createdAt: new Date('2025-05-21') },
];

// ─── Tasks ──────────────────────────────────────────────────────────────
export const mockTasks: Task[] = [
  { id: 't1', assignedTo: 'u1', assignedToName: 'Rahul Sharma', title: 'Visit Metro Supermart for quarterly review', description: 'Conduct quarterly performance review and discuss new product line', priority: 'high', dueDate: new Date('2025-05-22'), status: 'in-progress', createdBy: 'm1', createdAt: new Date('2025-05-20') },
  { id: 't2', assignedTo: 'u2', assignedToName: 'Priya Patel', title: 'Collect pending payment from FreshMart', description: 'Follow up on ₹12,000 outstanding payment', priority: 'critical', dueDate: new Date('2025-05-21'), status: 'pending', createdBy: 'm1', createdAt: new Date('2025-05-19') },
  { id: 't3', assignedTo: 'u3', assignedToName: 'Amit Kumar', title: 'Onboard new customer in Koramangala', description: 'Complete KYC and first order for new retail partner', priority: 'medium', dueDate: new Date('2025-05-23'), status: 'pending', createdBy: 'm2', createdAt: new Date('2025-05-20') },
  { id: 't4', assignedTo: 'u5', assignedToName: 'Vikram Singh', title: 'Deliver product samples to Golden Traders', description: 'Take new product samples for demo and feedback', priority: 'low', dueDate: new Date('2025-05-24'), status: 'completed', createdBy: 'm1', createdAt: new Date('2025-05-18') },
  { id: 't5', assignedTo: 'u6', assignedToName: 'Ananya Das', title: 'Update customer database for Pune region', description: 'Verify and update all customer contact information', priority: 'medium', dueDate: new Date('2025-05-25'), status: 'in-progress', createdBy: 'm2', createdAt: new Date('2025-05-19') },
  { id: 't6', assignedTo: 'u1', assignedToName: 'Rahul Sharma', title: 'Prepare monthly sales report', description: 'Compile May sales data for North Delhi region', priority: 'high', dueDate: new Date('2025-05-31'), status: 'pending', createdBy: 'm1', createdAt: new Date('2025-05-21') },
];

// ─── Notifications ──────────────────────────────────────────────────────
export const mockNotifications: Notification[] = [
  { id: 'n1', userId: 'admin', title: 'New Order Received', message: 'Rahul Sharma placed order ORD-2025-007 worth ₹14,000', type: 'success', isRead: false, createdAt: new Date('2025-05-21T14:30:00') },
  { id: 'n2', userId: 'admin', title: 'Missed Attendance', message: 'Sneha Reddy has not checked in today', type: 'warning', isRead: false, createdAt: new Date('2025-05-21T10:00:00') },
  { id: 'n3', userId: 'admin', title: 'Payment Overdue', message: 'CityMart Plaza has ₹78,500 overdue payment', type: 'error', isRead: false, createdAt: new Date('2025-05-21T09:00:00') },
  { id: 'n4', userId: 'admin', title: 'Target Achieved', message: 'Vikram Singh achieved 110% of monthly target', type: 'success', isRead: true, createdAt: new Date('2025-05-20T18:00:00') },
  { id: 'n5', userId: 'admin', title: 'Late Check-in', message: 'Amit Kumar checked in at 10:15 AM (15 min late)', type: 'alert', isRead: true, createdAt: new Date('2025-05-21T10:20:00') },
  { id: 'n6', userId: 'admin', title: 'New Customer Added', message: 'Ananya Das onboarded Nova Electronics in Pune', type: 'info', isRead: true, createdAt: new Date('2025-05-20T16:00:00') },
];

// ─── Live Locations ─────────────────────────────────────────────────────
export const mockLiveLocations: LiveLocation[] = [
  { id: 'l1', userId: 'u1', userName: 'Rahul Sharma', latitude: 28.6315, longitude: 77.2167, batteryLevel: 78, networkStatus: 'online', updatedAt: new Date('2025-05-21T15:30:00'), isActive: true },
  { id: 'l2', userId: 'u2', userName: 'Priya Patel', latitude: 19.0596, longitude: 72.8295, batteryLevel: 45, networkStatus: 'online', updatedAt: new Date('2025-05-21T15:28:00'), isActive: true },
  { id: 'l3', userId: 'u3', userName: 'Amit Kumar', latitude: 12.9716, longitude: 77.6071, batteryLevel: 62, networkStatus: 'weak', updatedAt: new Date('2025-05-21T15:25:00'), isActive: true },
  { id: 'l4', userId: 'u4', userName: 'Sneha Reddy', latitude: 17.4319, longitude: 78.4093, batteryLevel: 15, networkStatus: 'offline', updatedAt: new Date('2025-05-21T08:00:00'), isActive: false },
  { id: 'l5', userId: 'u5', userName: 'Vikram Singh', latitude: 28.7041, longitude: 77.1025, batteryLevel: 90, networkStatus: 'online', updatedAt: new Date('2025-05-21T15:32:00'), isActive: true },
  { id: 'l6', userId: 'u6', userName: 'Ananya Das', latitude: 18.5314, longitude: 73.8446, batteryLevel: 55, networkStatus: 'online', updatedAt: new Date('2025-05-21T15:29:00'), isActive: true },
];

// ─── Dashboard KPIs ─────────────────────────────────────────────────────
export const mockKPI: DashboardKPI = {
  totalRevenue: 2847500,
  revenueGrowth: 12.5,
  activeEmployees: 5,
  totalEmployees: 6,
  todaysOrders: 4,
  ordersGrowth: 8.3,
  attendanceRate: 83.3,
  attendanceChange: -2.1,
  totalCustomers: 8,
  customerGrowth: 15.0,
  pendingTasks: 3,
  conversionRate: 68.5,
};

// ─── Chart Data ─────────────────────────────────────────────────────────
export const revenueChartData: ChartDataPoint[] = [
  { name: 'Jan', value: 185000, secondaryValue: 165000 },
  { name: 'Feb', value: 210000, secondaryValue: 180000 },
  { name: 'Mar', value: 245000, secondaryValue: 220000 },
  { name: 'Apr', value: 280000, secondaryValue: 255000 },
  { name: 'May', value: 320000, secondaryValue: 290000 },
  { name: 'Jun', value: 295000, secondaryValue: 270000 },
  { name: 'Jul', value: 340000, secondaryValue: 310000 },
  { name: 'Aug', value: 370000, secondaryValue: 345000 },
  { name: 'Sep', value: 355000, secondaryValue: 330000 },
  { name: 'Oct', value: 390000, secondaryValue: 360000 },
  { name: 'Nov', value: 415000, secondaryValue: 385000 },
  { name: 'Dec', value: 442500, secondaryValue: 410000 },
];

export const salesPerformanceData: ChartDataPoint[] = [
  { name: 'Rahul', value: 520000 },
  { name: 'Priya', value: 480000 },
  { name: 'Amit', value: 410000 },
  { name: 'Sneha', value: 350000 },
  { name: 'Vikram', value: 560000 },
  { name: 'Ananya', value: 390000 },
];

export const regionPerformanceData: ChartDataPoint[] = [
  { name: 'North Delhi', value: 890000 },
  { name: 'South Mumbai', value: 720000 },
  { name: 'East Bangalore', value: 650000 },
  { name: 'West Hyderabad', value: 480000 },
  { name: 'Central Pune', value: 390000 },
];

export const orderStatusData: ChartDataPoint[] = [
  { name: 'Delivered', value: 45 },
  { name: 'Dispatched', value: 18 },
  { name: 'Pending', value: 25 },
  { name: 'Cancelled', value: 12 },
];

export const weeklyAttendanceData: ChartDataPoint[] = [
  { name: 'Mon', value: 100 },
  { name: 'Tue', value: 83 },
  { name: 'Wed', value: 100 },
  { name: 'Thu', value: 67 },
  { name: 'Fri', value: 83 },
  { name: 'Sat', value: 50 },
  { name: 'Sun', value: 0 },
];

// ─── Activity Feed ──────────────────────────────────────────────────────
export const mockActivityFeed: ActivityItem[] = [
  { id: 'act1', type: 'order', title: 'New Order Placed', description: 'Rahul Sharma placed ORD-2025-007 for Metro Supermart — ₹14,000', timestamp: new Date('2025-05-21T14:30:00'), user: 'Rahul Sharma' },
  { id: 'act2', type: 'visit', title: 'Store Visit Completed', description: 'Priya Patel visited FreshMart Groceries in Bandra', timestamp: new Date('2025-05-21T13:45:00'), user: 'Priya Patel' },
  { id: 'act3', type: 'attendance', title: 'Late Check-in', description: 'Amit Kumar checked in at 10:15 AM', timestamp: new Date('2025-05-21T10:15:00'), user: 'Amit Kumar' },
  { id: 'act4', type: 'task', title: 'Task Completed', description: 'Vikram Singh completed sample delivery to Golden Traders', timestamp: new Date('2025-05-21T12:00:00'), user: 'Vikram Singh' },
  { id: 'act5', type: 'customer', title: 'New Customer Onboarded', description: 'Ananya Das added Nova Electronics in Pune region', timestamp: new Date('2025-05-20T16:00:00'), user: 'Ananya Das' },
  { id: 'act6', type: 'order', title: 'Payment Received', description: 'Payment of ₹20,500 received from Metro Supermart', timestamp: new Date('2025-05-20T15:20:00'), user: 'System' },
  { id: 'act7', type: 'attendance', title: 'Missed Attendance', description: 'Sneha Reddy did not check in today', timestamp: new Date('2025-05-21T10:00:00'), user: 'System' },
  { id: 'act8', type: 'visit', title: 'Visit Scheduled', description: 'Rahul Sharma scheduled visit to Golden Traders for tomorrow', timestamp: new Date('2025-05-21T11:00:00'), user: 'Rahul Sharma' },
];

// ─── Visits ─────────────────────────────────────────────────────────────
export const mockVisits: Visit[] = [
  { id: 'v1', customerId: 'c1', customerName: 'Metro Supermart', salesExecutiveId: 'u1', salesExecutiveName: 'Rahul Sharma', visitPurpose: 'Quarterly Review', notes: 'Discussed new product line and pricing', gpsLocation: { latitude: 28.6315, longitude: 77.2167 }, images: [], visitStatus: 'completed', createdAt: new Date('2025-05-21T11:00:00') },
  { id: 'v2', customerId: 'c2', customerName: 'FreshMart Groceries', salesExecutiveId: 'u2', salesExecutiveName: 'Priya Patel', visitPurpose: 'Payment Collection', notes: 'Collected partial payment of ₹8,000', gpsLocation: { latitude: 19.0596, longitude: 72.8295 }, images: [], visitStatus: 'completed', createdAt: new Date('2025-05-21T13:45:00') },
  { id: 'v3', customerId: 'c3', customerName: 'QuickStop Retail', salesExecutiveId: 'u3', salesExecutiveName: 'Amit Kumar', visitPurpose: 'New Order', notes: 'Placed new order for Product A and D', gpsLocation: { latitude: 12.9716, longitude: 77.6071 }, images: [], visitStatus: 'in-progress', createdAt: new Date('2025-05-21T14:00:00') },
  { id: 'v4', customerId: 'c5', customerName: 'Golden Traders', salesExecutiveId: 'u5', salesExecutiveName: 'Vikram Singh', visitPurpose: 'Sample Delivery', notes: 'Delivered new product samples', gpsLocation: { latitude: 28.6506, longitude: 77.2302 }, images: [], visitStatus: 'completed', createdAt: new Date('2025-05-21T12:00:00') },
  { id: 'v5', customerId: 'c6', customerName: 'Nova Electronics', salesExecutiveId: 'u6', salesExecutiveName: 'Ananya Das', visitPurpose: 'Follow-up', notes: 'Follow up on previous order and discuss expansion', gpsLocation: { latitude: 18.5314, longitude: 73.8446 }, images: [], visitStatus: 'planned', createdAt: new Date('2025-05-22T10:00:00') },
];
