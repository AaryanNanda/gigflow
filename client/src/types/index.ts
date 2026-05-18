// 1. User Account Interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager';
  createdAt: string;
}

// 2. Authentication Context Response Structure
export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

// 3. Lead Structure
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: string;
  updatedAt: string;
}

// 4. Pagination Payload Metadata
export interface PaginationMetadata {
  totalRecords: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
}

// 5. Unified Leads API Response Pattern
export interface LeadsAPIResponse {
  success: boolean;
  data: Lead[];
  pagination: PaginationMetadata;
}