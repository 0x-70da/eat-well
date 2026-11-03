export interface DashboardStats {
  totalRevenue: number;
  todayRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  preparingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  averageOrderValue: number;
  totalCustomers: number;
  bestSellingProducts: {
    productId: string;
    productName: string;
    productNameAr: string;
    image: string;
    orderCount: number;
    totalRevenue: number;
  }[];
  recentOrders: {
    id: string;
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    totalAmount: number;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    createdAt: string;
  }[];
  salesTrend: {
    date: string;
    revenue: number;
    ordersCount: number;
  }[];
}

export interface StaffMember {
  id: string;
  userId: string;
  name: string;
  email?: string;
  phone?: string | null;
  role: "super_admin" | "admin" | "manager" | "order_manager" | "staff";
  isActive: boolean;
  createdAt: Date | string;
}

export interface CustomerSummary {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate?: string | null;
  createdAt: Date | string;
}
