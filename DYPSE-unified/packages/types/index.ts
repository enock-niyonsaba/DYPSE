// Shared types for DYPSE platform
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  rwandaId: string;
  phone: string;
  isVerified: boolean;
  createdAt: Date;
}

export type UserRole = 'youth' | 'employer' | 'policymaker' | 'entrepreneur';

export interface YouthProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  dob?: Date;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  district?: string;
  country?: string;
  postalCode?: string;
  bio?: string;
  status: 'JOB_SEEKER' | 'EMPLOYED' | 'FREELANCER';
  phone?: string;
  profilePicId?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  employerId: string;
  isActive: boolean;
  createdAt: Date;
  deadline?: Date;
}

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  appliedAt: Date;
  reviewedAt?: Date;
  notes?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  description?: string;
}

export interface ProfileSkill {
  profileId: string;
  skillId: string;
  level: 'beginner' | 'intermediate' | 'expert';
  yearsExperience: number;
}

export interface Document {
  id: string;
  userId: string;
  documentType: 'cv' | 'certificate' | 'business_evidence' | 'startup_proof';
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  filePath: string;
  uploadDate: Date;
  isVerified: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
}

export interface Business {
  id: string;
  userId: string;
  name: string;
  description: string;
  industry: string;
  foundedDate?: Date;
  website?: string;
  isVerified: boolean;
  verificationDate?: Date;
  verifiedBy?: string;
}

export interface Education {
  id: string;
  profileId: string;
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  gpa?: number;
  description?: string;
}

export interface Experience {
  id: string;
  profileId: string;
  company: string;
  position: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  location?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  rwandaId: string;
  phone: string;
  role: UserRole;
}

export interface ProfileUpdateForm {
  firstName?: string;
  lastName?: string;
  dob?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  district?: string;
  country?: string;
  postalCode?: string;
  bio?: string;
  jobStatus?: 'unemployed' | 'employed' | 'self_employed';
  phone?: string;
}

// Search and filter types
export interface JobSearchFilters {
  location?: string;
  type?: string;
  industry?: string;
  experienceLevel?: string;
  salaryMin?: number;
  salaryMax?: number;
  skills?: string[];
}

export interface UserSearchFilters {
  role?: UserRole;
  location?: string;
  skills?: string[];
  experienceLevel?: string;
  availability?: string;
}
