// Shared configuration for DYPSE platform

export interface AppConfig {
  // App settings
  appName: string;
  appVersion: string;
  environment: 'development' | 'staging' | 'production';
  
  // Server settings
  serverPort: number;
  serverHost: string;
  
  // Client settings
  clientPort: number;
  clientUrl: string;
  
  // Database settings
  databaseUrl: string;
  mongoUri: string;
  
  // JWT settings
  jwtSecret: string;
  jwtExpiresIn: string;
  
  // Supabase settings
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceRoleKey: string;
  
  // Email settings
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
    from: string;
  };
  
  // File upload settings
  maxFileSize: number;
  uploadPath: string;
  
  // CORS settings
  corsOrigins: string[];
  
  // Feature flags
  features: {
    fileUpload: boolean;
    emailNotifications: boolean;
    aiMatching: boolean;
    analytics: boolean;
  };
}

// Default configuration
export const defaultConfig: AppConfig = {
  appName: 'DYPSE',
  appVersion: '1.0.0',
  environment: 'development',
  
  serverPort: 5000,
  serverHost: 'localhost',
  
  clientPort: 3000,
  clientUrl: 'http://localhost:3000',
  
  databaseUrl: '',
  mongoUri: '',
  
  jwtSecret: 'change_me',
  jwtExpiresIn: '7d',
  
  supabaseUrl: '',
  supabaseAnonKey: '',
  supabaseServiceRoleKey: '',
  
  smtp: {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    user: '',
    pass: '',
    from: 'noreply@dypse.com'
  },
  
  maxFileSize: 10485760, // 10MB
  uploadPath: './uploads',
  
  corsOrigins: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  
  features: {
    fileUpload: true,
    emailNotifications: false,
    aiMatching: false,
    analytics: true
  }
};

// Load configuration from environment variables
export const loadConfig = (): AppConfig => {
  const config = { ...defaultConfig };
  
  // App settings
  config.environment = (process.env.NODE_ENV as any) || 'development';
  config.appVersion = process.env.APP_VERSION || '1.0.0';
  
  // Server settings
  config.serverPort = parseInt(process.env.PORT || '5000', 10);
  config.serverHost = process.env.HOST || 'localhost';
  
  // Client settings
  config.clientPort = parseInt(process.env.CLIENT_PORT || '3000', 10);
  config.clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  
  // Database settings
  config.databaseUrl = process.env.DATABASE_URL || '';
  config.mongoUri = process.env.MONGODB_URI || '';
  
  // JWT settings
  config.jwtSecret = process.env.JWT_SECRET || 'change_me';
  config.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
  
  // Supabase settings
  config.supabaseUrl = process.env.SUPABASE_URL || '';
  config.supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
  config.supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  
  // Email settings
  config.smtp.host = process.env.SMTP_HOST || 'smtp.gmail.com';
  config.smtp.port = parseInt(process.env.SMTP_PORT || '587', 10);
  config.smtp.secure = process.env.SMTP_SECURE === 'true';
  config.smtp.user = process.env.SMTP_USER || '';
  config.smtp.pass = process.env.SMTP_PASS || '';
  config.smtp.from = process.env.SMTP_FROM || 'noreply@dypse.com';
  
  // File upload settings
  config.maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '10485760', 10);
  config.uploadPath = process.env.UPLOAD_PATH || './uploads';
  
  // CORS settings
  if (process.env.CORS_ORIGINS) {
    config.corsOrigins = process.env.CORS_ORIGINS.split(',').map(origin => origin.trim());
  }
  
  // Feature flags
  config.features.fileUpload = process.env.FEATURE_FILE_UPLOAD !== 'false';
  config.features.emailNotifications = process.env.FEATURE_EMAIL_NOTIFICATIONS === 'true';
  config.features.aiMatching = process.env.FEATURE_AI_MATCHING === 'true';
  config.features.analytics = process.env.FEATURE_ANALYTICS !== 'false';
  
  return config;
};

// Get current configuration
export const config = loadConfig();

// Validation functions
export const validateConfig = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!config.databaseUrl && !config.mongoUri) {
    errors.push('Either DATABASE_URL or MONGODB_URI must be set');
  }
  
  if (!config.jwtSecret || config.jwtSecret === 'change_me') {
    errors.push('JWT_SECRET must be set to a secure value');
  }
  
  if (!config.supabaseUrl) {
    errors.push('SUPABASE_URL must be set');
  }
  
  if (!config.supabaseServiceRoleKey) {
    errors.push('SUPABASE_SERVICE_ROLE_KEY must be set');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Environment-specific configurations
export const getEnvironmentConfig = () => {
  switch (config.environment) {
    case 'production':
      return {
        ...config,
        corsOrigins: [config.clientUrl],
        features: {
          ...config.features,
          emailNotifications: true,
          analytics: true
        }
      };
    
    case 'staging':
      return {
        ...config,
        corsOrigins: [...config.corsOrigins, 'https://staging.dypse.com'],
        features: {
          ...config.features,
          emailNotifications: true
        }
      };
    
    default:
      return config;
  }
};

// Export configuration
export default config;
