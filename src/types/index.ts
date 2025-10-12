export type UserRole = 'warehouse' | 'sales' | 'customer_service' | 'mechanic' | 'csuite';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  location?: string;
}

export interface Part {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  category: string;
  price: number;
  location?: string;
}

export interface ScanRecord {
  id: string;
  partId: string;
  partName: string;
  sku: string;
  type: 'incoming' | 'outgoing';
  quantity: number;
  destination?: string;
  timestamp: Date;
  scannedBy: string;
}

export interface Order {
  id: string;
  parts: {
    partId: string;
    partName: string;
    quantity: number;
  }[];
  requestedBy: string;
  status: 'pending' | 'approved' | 'shipped' | 'delivered';
  createdAt: Date;
  estimatedDelivery?: Date;
}

export interface Sale {
  id: string;
  dealership: string;
  model: string;
  price: number;
  salesPerson: string;
  date: Date;
  customerName: string;
}

export interface ServiceTicket {
  id: string;
  vehicleModel: string;
  customerName: string;
  issue: string;
  status: 'open' | 'in_progress' | 'completed';
  assignedMechanic?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface DealershipMetrics {
  name: string;
  location: string;
  salesYTD: number;
  salesProjected: number;
  partsCostYTD: number;
  partsCostProjected: number;
}

export interface AnalyticsData {
  totalSalesYTD: number;
  totalSalesProjected: number;
  totalPartsCostYTD: number;
  totalPartsCostProjected: number;
  dealerships: DealershipMetrics[];
  monthlySales: {
    month: string;
    amount: number;
  }[];
}
