# DYPSE - Digital Youth Professional Skills & Employment Platform

A unified monorepo containing both the frontend React application and backend Node.js server for the DYPSE platform.

## 🏗️ Project Structure

```
DYPSE/
├── apps/
│   ├── client/          # React frontend application
│   └── server/          # Node.js backend API
├── packages/
│   ├── types/           # Shared TypeScript types
│   ├── utils/           # Shared utility functions
│   └── config/          # Shared configuration
├── docs/                # Documentation
├── package.json         # Root package.json with workspace scripts
├── tsconfig.json        # Root TypeScript configuration
├── Dockerfile           # Multi-stage Docker build
├── docker-compose.yml   # Development and production setup
└── README.md            # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 8+
- Docker & Docker Compose (for containerized deployment)
- MongoDB (local or Atlas)
- Supabase account (or PostgreSQL)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd DYPSE
   ```

2. **Install dependencies**
   ```bash
   npm install
   npm run setup
   ```

3. **Environment Configuration**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your configuration
   nano .env
   ```

4. **Start development servers**
   ```bash
   # Start both client and server
   npm run dev
   
   # Or start individually
   npm run dev:client    # Frontend on http://localhost:3000
   npm run dev:server    # Backend on http://localhost:5000
   ```

### Production Setup

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

3. **Docker deployment**
   ```bash
   # Build and run with Docker Compose
   docker-compose up -d
   
   # Or build and run manually
   npm run docker:build
   npm run docker:run
   ```

## 📦 Available Scripts

### Root Level Scripts
- `npm run dev` - Start both client and server in development mode
- `npm run build` - Build both client and server for production
- `npm run start` - Start production server
- `npm run test` - Run tests for both client and server
- `npm run lint` - Lint both client and server code
- `npm run clean` - Clean all node_modules and build artifacts
- `npm run setup` - Install dependencies for all packages

### Individual App Scripts
- `npm run dev:client` - Start only the React frontend
- `npm run dev:server` - Start only the Node.js backend
- `npm run build:client` - Build only the React frontend
- `npm run build:server` - Build only the Node.js backend

### Docker Scripts
- `npm run docker:build` - Build Docker image
- `npm run docker:run` - Run Docker container

## 🔧 Configuration

### Environment Variables

The application uses a unified `.env` file at the root level. Key variables include:

- **Database**: `DATABASE_URL`, `MONGODB_URI`
- **Authentication**: `JWT_SECRET`, `JWT_EXPIRES_IN`
- **Supabase**: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- **Email**: `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`
- **File Upload**: `MAX_FILE_SIZE`, `UPLOAD_PATH`

### Feature Flags

Control application features through environment variables:

- `FEATURE_FILE_UPLOAD` - Enable/disable file uploads
- `FEATURE_EMAIL_NOTIFICATIONS` - Enable/disable email notifications
- `FEATURE_AI_MATCHING` - Enable/disable AI-powered job matching
- `FEATURE_ANALYTICS` - Enable/disable analytics dashboard

## 🗄️ Database Setup

### MongoDB (Document Storage)
- CVs, certificates, and business evidence
- User documents and file metadata
- Analytics and reporting data

### Supabase/PostgreSQL (Structured Data)
- User accounts and profiles
- Job postings and applications
- Skills and education data
- Business and experience records

## 🐳 Docker Deployment

### Development
```bash
docker-compose up -d postgres mongodb redis
npm run dev
```

### Production
```bash
docker-compose --profile production up -d
```

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Profiles
- `GET /api/profiles/me` - Get current user profile
- `PUT /api/profiles/me` - Update user profile
- `POST /api/profiles/me/cv` - Upload CV
- `GET /api/profiles/me/skills` - Get user skills

### Jobs
- `GET /api/jobs` - List job postings
- `POST /api/jobs` - Create job posting
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs/:id/apply` - Apply for job

### Admin
- `GET /api/admin/dashboard` - Admin dashboard
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/:id/verify` - Verify user

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run client tests only
npm run test:client

# Run server tests only
npm run test:server
```

## 📊 Monitoring & Health Checks

- **Health Endpoint**: `GET /health`
- **API Status**: `GET /api/status`
- **Database Status**: `GET /api/health/db`

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- Input validation with Zod
- File upload security
- CORS configuration
- Rate limiting (production)

## 🚀 Deployment

### Traditional Deployment
1. Build the application: `npm run build`
2. Set environment variables
3. Start the server: `npm start`
4. Configure reverse proxy (Nginx)

### Docker Deployment
1. Build image: `npm run docker:build`
2. Run container: `npm run docker:run`
3. Or use Docker Compose: `docker-compose up -d`

### Cloud Deployment
- **Vercel**: Frontend deployment
- **Railway/Render**: Backend deployment
- **Supabase**: Database hosting
- **MongoDB Atlas**: Document storage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in the `docs/` folder

## 🔄 Changelog

### v1.0.0
- Initial unified monorepo structure
- React frontend with TypeScript
- Node.js backend with Express
- Shared packages for types, utils, and config
- Docker support for development and production
- Comprehensive documentation

---

**Built with ❤️ by the DYPSE Team**
