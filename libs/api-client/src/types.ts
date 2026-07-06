// API Response Types
export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: any;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  userType: 'customer' | 'provider';
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  userType: 'customer' | 'provider';
  isVerified: boolean;
}

// Provider Types
export interface Provider {
  id: string;
  firstName: string;
  lastName: string;
  businessName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  trade: string;
  isVerified: boolean;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  serviceRadius: number;
  profileImageUrl?: string;
  ratingAvg?: number;
  createdAt: string;
}

// Booking Types
export interface Booking {
  id: string;
  customerId: string;
  providerId: string;
  serviceType: string;
  description: string;
  status: 'requested' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
  scheduledAt: string;
  customerAddress: string;
  latitude?: number;
  longitude?: number;
  estimatedPrice?: number;
  finalPrice?: number;
  createdAt: string;
  updatedAt: string;
  provider?: Provider;
  customer?: User;
}

// Payment Types
export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer' | 'cash';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  invoiceUrl?: string;
  createdAt: string;
}

// Invoice Types
export interface Invoice {
  id: string;
  bookingId: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  taxAmount?: number;
  totalAmount: number;
  description?: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  pdfUrl?: string;
  xmlUrl?: string;
  paymentTerms?: string;
  createdAt: string;
}