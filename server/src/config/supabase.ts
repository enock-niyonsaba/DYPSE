import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client with service role key for server-side operations
export const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Database table names
export const TABLES = {
  USERS: 'users',
  USER_PROFILES: 'user_profiles',
  ROLES: 'roles',
  SESSIONS: 'sessions'
} as const;

// User roles
export const USER_ROLES = {
  YOUTH: 'youth',
  EMPLOYER: 'employer',
  POLICYMAKER: 'policymaker',
  ENTREPRENEUR: 'entrepreneur'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
