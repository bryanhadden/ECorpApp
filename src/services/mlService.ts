/**
 * ML Service Integration
 * Connects to the Python TensorFlow ML service for predictions
 */

import {
  AnalyticsData,
  Order,
  Part,
  Sale,
  ServiceTicket,
} from '../types';

// ML Service configuration
const ML_SERVICE_URL = __DEV__ 
  ? 'http://192.168.1.226:5001'  // Development - Mac's local IP
  : 'https://your-ml-service.com';  // Production - update with your deployed URL

// API Response Types
interface DealershipResponse {
  name: string;
  location: string;
  salesYTD: number;
  salesProjected: number;
  partsCostYTD: number;
  partsCostProjected: number;
}

interface SaleResponse {
  id: string;
  dealership: string;
  model: string;
  price: number;
  salesPerson: string;
  date: string;
  customerName: string;
}

interface PartResponse {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  category: string;
  price: number;
  location: string;
  predictedDemand?: number;
  recommendedStock?: number;
  needsReorder?: boolean;
}

interface ServiceTicketResponse {
  id: string;
  vehicleModel: string;
  customerName: string;
  issue: string;
  status: string;
  assignedMechanic: string;
  createdAt: string;
  completedAt?: string;
}

interface OrderResponse {
  id: string;
  parts: string[];
  requestedBy: string;
  status: string;
  createdAt: string;
  estimatedDelivery?: string;
}

/**
 * Check if ML service is available
 */
export const checkMLServiceHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${ML_SERVICE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      return false;
    }
    
    const data = await response.json();
    return data.status === 'healthy' && data.models_loaded;
  } catch (error) {
    console.warn('ML Service not available:', error);
    return false;
  }
};

/**
 * Fetch analytics data with ML predictions
 */
export const fetchAnalytics = async (): Promise<AnalyticsData> => {
  try {
    const response = await fetch(`${ML_SERVICE_URL}/api/analytics`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform API response to match app types
    return {
      totalSalesYTD: data.totalSalesYTD,
      totalSalesProjected: data.totalSalesProjected,
      totalPartsCostYTD: data.totalPartsCostYTD,
      totalPartsCostProjected: data.totalPartsCostProjected,
      dealerships: data.dealerships.map((d: DealershipResponse) => ({
        name: d.name,
        location: d.location,
        salesYTD: d.salesYTD,
        salesProjected: d.salesProjected,
        partsCostYTD: d.partsCostYTD,
        partsCostProjected: d.partsCostProjected,
      })),
      monthlySales: data.monthlySales,
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};

/**
 * Fetch recent sales data
 */
export const fetchSales = async (limit: number = 50): Promise<Sale[]> => {
  try {
    const response = await fetch(
      `${ML_SERVICE_URL}/api/sales?limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return data.map((sale: SaleResponse) => ({
      id: sale.id,
      dealership: sale.dealership,
      model: sale.model,
      price: sale.price,
      salesPerson: sale.salesPerson,
      date: new Date(sale.date),
      customerName: sale.customerName,
    }));
  } catch (error) {
    console.error('Error fetching sales:', error);
    throw error;
  }
};

/**
 * Fetch parts inventory with ML demand predictions
 */
export const fetchParts = async (): Promise<Part[]> => {
  try {
    const response = await fetch(`${ML_SERVICE_URL}/api/parts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return data.map((part: PartResponse) => ({
      id: part.id,
      name: part.name,
      sku: part.sku,
      quantity: part.quantity,
      category: part.category,
      price: part.price,
      location: part.location,
      // Additional ML-specific fields
      predictedDemand: part.predictedDemand,
      recommendedStock: part.recommendedStock,
      needsReorder: part.needsReorder,
    }));
  } catch (error) {
    console.error('Error fetching parts:', error);
    throw error;
  }
};

/**
 * Fetch service tickets
 */
export const fetchServiceTickets = async (limit: number = 50): Promise<ServiceTicket[]> => {
  try {
    const response = await fetch(
      `${ML_SERVICE_URL}/api/service-tickets?limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return data.map((ticket: ServiceTicketResponse) => ({
      id: ticket.id,
      vehicleModel: ticket.vehicleModel,
      customerName: ticket.customerName,
      issue: ticket.issue,
      status: ticket.status,
      assignedMechanic: ticket.assignedMechanic,
      createdAt: new Date(ticket.createdAt),
      completedAt: ticket.completedAt ? new Date(ticket.completedAt) : undefined,
    }));
  } catch (error) {
    console.error('Error fetching service tickets:', error);
    throw error;
  }
};

/**
 * Fetch parts orders
 */
export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const response = await fetch(`${ML_SERVICE_URL}/api/orders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return data.map((order: OrderResponse) => ({
      id: order.id,
      parts: order.parts,
      requestedBy: order.requestedBy,
      status: order.status,
      createdAt: new Date(order.createdAt),
      estimatedDelivery: order.estimatedDelivery ? new Date(order.estimatedDelivery) : undefined,
    }));
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

/**
 * Get service metadata
 */
export const fetchMetadata = async () => {
  try {
    const response = await fetch(`${ML_SERVICE_URL}/api/metadata`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching metadata:', error);
    throw error;
  }
};

