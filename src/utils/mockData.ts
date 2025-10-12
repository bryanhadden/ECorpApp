import {AnalyticsData, Order, Part, Sale, ScanRecord, ServiceTicket} from '../types';

export const mockParts: Part[] = [
  {
    id: 'P001',
    name: 'Battery Pack',
    sku: 'BAT-5000',
    quantity: 45,
    category: 'Power',
    price: 8500,
    location: 'A-12',
  },
  {
    id: 'P002',
    name: 'Electric Motor',
    sku: 'MOT-3000',
    quantity: 23,
    category: 'Drivetrain',
    price: 12000,
    location: 'B-8',
  },
  {
    id: 'P003',
    name: 'Charging Port',
    sku: 'CHG-200',
    quantity: 156,
    category: 'Electrical',
    price: 450,
    location: 'C-4',
  },
  {
    id: 'P004',
    name: 'Display Console',
    sku: 'DSP-100',
    quantity: 78,
    category: 'Interior',
    price: 1200,
    location: 'D-15',
  },
];

export const mockScanRecords: ScanRecord[] = [
  {
    id: 'S001',
    partId: 'P001',
    partName: 'Battery Pack',
    sku: 'BAT-5000',
    type: 'outgoing',
    quantity: 2,
    destination: 'New York Dealership',
    timestamp: new Date('2025-10-09T10:30:00'),
    scannedBy: 'John Warehouse',
  },
  {
    id: 'S002',
    partId: 'P003',
    partName: 'Charging Port',
    sku: 'CHG-200',
    type: 'incoming',
    quantity: 50,
    timestamp: new Date('2025-10-09T14:15:00'),
    scannedBy: 'John Warehouse',
  },
];

export const mockOrders: Order[] = [
  {
    id: 'O001',
    parts: [
      {partId: 'P001', partName: 'Battery Pack', quantity: 1},
      {partId: 'P004', partName: 'Display Console', quantity: 2},
    ],
    requestedBy: 'Tom Mechanic',
    status: 'approved',
    createdAt: new Date('2025-10-08'),
    estimatedDelivery: new Date('2025-10-12'),
  },
  {
    id: 'O002',
    parts: [{partId: 'P002', partName: 'Electric Motor', quantity: 1}],
    requestedBy: 'Sarah Sales',
    status: 'pending',
    createdAt: new Date('2025-10-10'),
  },
];

export const mockSales: Sale[] = [
  {
    id: 'SL001',
    dealership: 'New York Dealership',
    model: 'E-Sedan Pro',
    price: 45000,
    salesPerson: 'Sarah Sales',
    date: new Date('2025-10-05'),
    customerName: 'Robert Johnson',
  },
  {
    id: 'SL002',
    dealership: 'New York Dealership',
    model: 'E-SUV Elite',
    price: 62000,
    salesPerson: 'Sarah Sales',
    date: new Date('2025-10-08'),
    customerName: 'Jennifer Smith',
  },
];

export const mockServiceTickets: ServiceTicket[] = [
  {
    id: 'T001',
    vehicleModel: 'E-Sedan Pro',
    customerName: 'David Wilson',
    issue: 'Charging port not working',
    status: 'in_progress',
    assignedMechanic: 'Tom Mechanic',
    createdAt: new Date('2025-10-09'),
  },
  {
    id: 'T002',
    vehicleModel: 'E-SUV Elite',
    customerName: 'Lisa Brown',
    issue: 'Battery range reduced',
    status: 'open',
    createdAt: new Date('2025-10-10'),
  },
];

export const mockAnalytics: AnalyticsData = {
  totalSalesYTD: 12500000,
  totalSalesProjected: 18000000,
  totalPartsCostYTD: 2800000,
  totalPartsCostProjected: 4200000,
  dealerships: [
    {
      name: 'New York Dealership',
      location: 'New York, NY',
      salesYTD: 4200000,
      salesProjected: 6000000,
      partsCostYTD: 950000,
      partsCostProjected: 1400000,
    },
    {
      name: 'Texas Dealership',
      location: 'Austin, TX',
      salesYTD: 3800000,
      salesProjected: 5500000,
      partsCostYTD: 820000,
      partsCostProjected: 1200000,
    },
    {
      name: 'Florida Dealership',
      location: 'Miami, FL',
      salesYTD: 4500000,
      salesProjected: 6500000,
      partsCostYTD: 1030000,
      partsCostProjected: 1600000,
    },
  ],
  monthlySales: [
    {month: 'Jan', amount: 1200000},
    {month: 'Feb', amount: 1100000},
    {month: 'Mar', amount: 1350000},
    {month: 'Apr', amount: 1280000},
    {month: 'May', amount: 1450000},
    {month: 'Jun', amount: 1320000},
    {month: 'Jul', amount: 1400000},
    {month: 'Aug', amount: 1500000},
    {month: 'Sep', amount: 1600000},
    {month: 'Oct', amount: 500000},
  ],
};
