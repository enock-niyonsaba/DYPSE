# DYPSE Backend - Supabase + MongoDB Integration

This backend provides a custom authentication system using Supabase for structured user data and MongoDB for unstructured document storage (CVs, certificates, business evidence).

## 🚀 Features

- **Custom Authentication**: JWT-based authentication without Supabase Auth
- **Dual Database**: Supabase PostgreSQL for user data, MongoDB for documents
- **File Upload**: Support for CVs, certificates, business evidence, and startup proof
- **Role-Based Access**: Youth, Employer, Policymaker, and Entrepreneur roles
- **Rwanda ID Validation**: Ensures unique user accounts per national ID
- **Secure Password Hashing**: Bcrypt with 12 salt rounds

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Databases**: 
  - Supabase (PostgreSQL) for user authentication and profiles
  - MongoDB for document storage
- **Authentication**: JWT tokens with HTTP-only cookies
- **File Handling**: Multer for file uploads
- **Password Security**: Bcrypt for hashing

## 📋 Prerequisites

1. **Node.js** (v16 or higher)
2. **Supabase Account** with a project created
3. **MongoDB** (local or Atlas)
4. **Environment Variables** configured

## 🔧 Environment Setup

Create a `.env` file in the server root directory:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Supabase Configuration
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/dypse
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dypse

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

## 🗄️ Database Setup

### 1. Supabase Setup

1. Go to [Supabase](https://supabase.com) and create a new project
2. Get your project URL and service role key from Settings > API
3. Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor

### 2. MongoDB Setup

#### Local MongoDB:
```bash
# Install MongoDB locally
# Create database
mongosh
use dypse
```

#### MongoDB Atlas:
1. Create a cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. Get your connection string
3. Update `MONGODB_URI` in your `.env` file

## 📦 Installation

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Start development server
npm run dev

# Start production server
npm start
```

## 🔐 API Endpoints

### Authentication Routes (`/api/auth`)

#### POST `/api/auth/register`
Register a new user with optional file uploads.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "rwandaId": "1234567890123456",
  "phone": "+250780000000",
  "role": "youth"
}
```

**File Uploads (multipart/form-data):**
- `cv`: CV document (PDF, DOC, DOCX)
- `certificate`: Educational/professional certificates
- `business_evidence`: Business-related documents
- `startup_proof`: Startup validation documents

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "uuid",
    "email": "john@example.com",
    "role": "youth",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "jwt-token-here"
}
```

#### POST `/api/auth/login`
Authenticate existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "userId": "uuid",
    "email": "john@example.com",
    "role": "youth",
    "firstName": "John",
    "lastName": "Doe",
    "isVerified": false
  },
  "token": "jwt-token-here"
}
```

#### POST `/api/auth/logout`
Logout user (clears HTTP-only cookie).

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

#### GET `/api/auth/profile`
Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "john@example.com",
      "role": "youth",
      "rwandaId": "1234567890123456",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+250780000000",
      "isVerified": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "documents": [
      {
        "documentType": "cv",
        "fileName": "cv-1234567890.pdf",
        "originalName": "John_Doe_CV.pdf",
        "uploadDate": "2024-01-01T00:00:00.000Z",
        "isVerified": false
      }
    ]
  }
}
```

## 🔒 Authentication & Authorization

### JWT Token Structure
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "role": "youth",
  "rwandaId": "1234567890123456",
  "iat": 1640995200,
  "exp": 1641600000
}
```

### Protected Routes
Use the `authenticateToken` middleware to protect routes:

```typescript
import { authenticateToken, requireYouth, requireEmployer } from '../middlewares/auth';

// Require authentication
router.get('/protected', authenticateToken, (req, res) => {
  // req.user contains the decoded JWT payload
});

// Require specific role
router.get('/youth-only', requireYouth, (req, res) => {
  // Only youth users can access
});
```

### Role-Based Access
- `youth`: Job seekers, students, unemployed youth
- `employer`: Companies, organizations hiring
- `policymaker`: Government officials, policy makers
- `entrepreneur`: Business owners, startup founders

## 📁 File Upload System

### Supported File Types
- **Documents**: PDF, DOC, DOCX
- **Images**: JPEG, JPG, PNG
- **Spreadsheets**: XLS, XLSX

### File Storage Structure
```
uploads/
├── {userId}/
│   ├── cv/
│   ├── certificate/
│   ├── business_evidence/
│   └── startup_proof/
```

### File Size Limits
- Maximum file size: 10MB (configurable)
- Maximum files per request: 5

## 🗃️ Database Schema

### Supabase Tables

#### `users`
- Core user authentication data
- Email and Rwanda ID uniqueness constraints
- Role-based access control

#### `user_profiles`
- General profile information
- Address, bio, social links

#### Role-specific tables:
- `youth_specific_profiles`: Job status, skills, education
- `employer_specific_profiles`: Company info, hiring status
- `entrepreneur_specific_profiles`: Business details, funding needs
- `policymaker_specific_profiles`: Organization, policy focus

### MongoDB Collections

#### `userdocuments`
- File metadata and storage paths
- Verification status tracking
- Document categorization

## 🚨 Security Features

1. **Password Security**: Bcrypt hashing with 12 salt rounds
2. **JWT Security**: HTTP-only cookies, secure flag in production
3. **Input Validation**: Comprehensive request validation
4. **File Upload Security**: File type and size restrictions
5. **Rate Limiting**: Built-in protection against abuse
6. **CORS Configuration**: Configurable cross-origin requests

## 🧪 Testing

```bash
# Run TypeScript compilation check
npx tsc --noEmit

# Test specific endpoints
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","password":"password123","rwandaId":"1234567890123456","phone":"+250780000000","role":"youth"}'
```

## 🚀 Deployment

### Environment Variables
Ensure all environment variables are set in production:
- `NODE_ENV=production`
- `JWT_SECRET`: Strong, unique secret
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- `MONGODB_URI`: Production MongoDB connection

### File Uploads
- Ensure `UPLOAD_PATH` is writable
- Consider using cloud storage (AWS S3, Google Cloud Storage) for production
- Implement file cleanup and maintenance scripts

### Security
- Use HTTPS in production
- Set secure cookie flags
- Implement rate limiting
- Monitor for suspicious activity

## 🔧 Maintenance

### File Cleanup
```typescript
import { cleanupOrphanedFiles } from './services/fileUploadService';

// Run cleanup periodically
setInterval(async () => {
  const deletedCount = await cleanupOrphanedFiles();
  console.log(`Cleaned up ${deletedCount} orphaned files`);
}, 24 * 60 * 60 * 1000); // Daily
```

### Database Maintenance
- Monitor Supabase connection limits
- Check MongoDB connection pool health
- Regular backup procedures

## 📞 Support

For issues or questions:
1. Check the logs for error details
2. Verify environment variables
3. Test database connections
4. Review API request/response format

## 🔄 Updates

To update the system:
1. Pull latest changes
2. Update dependencies: `npm install`
3. Run database migrations if needed
4. Restart the server
5. Test critical endpoints

---

**Note**: This is a custom authentication system. For production use, consider additional security measures like rate limiting, request validation, and monitoring.
