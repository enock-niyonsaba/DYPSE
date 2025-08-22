# Schema Changes Summary

## Overview
This document summarizes all the changes made to the database schema for the DYSEM platform, including both Prisma (PostgreSQL) and MongoDB models.

## Prisma Schema Changes

### New Enums Added
- `YouthStatus`: JOB_SEEKER, EMPLOYED, FREELANCER
- `JobType`: FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, FREELANCE, TEMPORARY
- `ExperienceLevel`: ENTRY, JUNIOR, MID_LEVEL, SENIOR, EXECUTIVE

### YouthProfile Enhancements
- **Added `status` field**: New YouthStatus enum to track employment status
- **Added `cvFileId` field**: Reference to MongoDB CV file
- **Added `profilePicId` field**: Reference to MongoDB profile picture
- **Added `district` field**: Geographic location enhancement

### EmployerProfile Enhancements
- **Added `taxId` field**: Business tax identification
- **Added `businessRegistrationId` field**: Official business registration
- **Added `isCurrentlyHiring` field**: Boolean for hiring status
- **Added `avgHirePerMonth` field**: Average hiring rate
- **Added `preferredSkills` field**: Array of preferred skills
- **Added `additionalNotes` field**: Optional additional information
- **Added `district` field**: Geographic location enhancement

### Job Model Enhancements
- **Added `department` field**: Job department/category
- **Added `jobType` field**: JobType enum for employment type
- **Added `experienceLevel` field**: ExperienceLevel enum
- **Added `jobRequirements` field**: Detailed job requirements
- **Added `numberOfPositions` field**: Number of available positions
- **Added `views` field**: View counter for job posts
- **Added `benefits` field**: Array of job benefits
- **Added `perks` field**: Array of job perks
- **Added `district` field**: Geographic location enhancement

### New Models Added

#### Training Model
- `id`: Unique identifier
- `logo`: Training company logo
- `trainingTitle`: Title of the training
- `trainingCompany`: Company providing training
- `ratings`: Training ratings
- `startDate`: Training start date
- `duration`: Training duration
- `skills`: Related skills (via TrainingSkill)
- `description`: Training description
- `price`: Training cost
- `isActive`: Active status
- `maxParticipants`: Maximum participants
- `currentParticipants`: Current participant count

#### TrainingSkill Model
- Junction table linking Training and Skill models
- Enables many-to-many relationship between trainings and skills

#### Group Model
- `id`: Unique identifier
- `groupName`: Name of the group
- `department`: Department field
- `description`: Group description
- `members`: Group members (via GroupMember)
- `isActive`: Active status

#### GroupMember Model
- `id`: Unique identifier
- `groupId`: Reference to Group
- `userId`: Reference to User
- `role`: Member role (admin, member, moderator)
- `joinedAt`: Join timestamp

#### UserSettings Model
- `id`: Unique identifier
- `userId`: Reference to User
- `emailNotifications`: Email notification preference
- `pushNotifications`: Push notification preference
- `smsNotifications`: SMS notification preference
- `privacyLevel`: Privacy settings
- `language`: Language preference
- `timezone`: Timezone setting
- `theme`: UI theme preference
- `jobAlerts`: Job alert preferences
- `trainingAlerts`: Training alert preferences
- `groupAlerts`: Group alert preferences

#### AIPrediction Model
- `id`: Unique identifier
- `userId`: Reference to User
- `predictionType`: Type of AI prediction
- `data`: JSON data for predictions
- `confidence`: Prediction confidence score
- `isActive`: Active status
- `expiresAt`: Expiration timestamp

#### UserFile Model
- `id`: Unique identifier
- `userId`: Reference to User
- `fileType`: Type of file (cv, profile_pic, document)
- `originalName`: Original filename
- `storedName`: Stored filename
- `mimeType`: File MIME type
- `size`: File size
- `url`: File URL
- `isActive`: Active status

#### Notification Model
- `id`: Unique identifier
- `title`: Notification title
- `message`: Notification message
- `target`: Target audience
- `status`: Notification status
- `scheduledAt`: Scheduled send time
- `sentAt`: Actual send time
- `recipients`: Notification recipients

#### UserNotification Model
- `id`: Unique identifier
- `userId`: Reference to User
- `notificationId`: Reference to Notification
- `isRead`: Read status
- `readAt`: Read timestamp

## MongoDB Models Added

### UserFile Model
- Comprehensive file management for user uploads
- Supports CVs, profile pictures, documents, certificates, and ID cards
- Includes metadata for images (dimensions), videos (duration), and documents (pages)
- Thumbnail support for images
- Tagging and categorization system

### Training Model (MongoDB)
- Extended training data with rich features
- Training materials (videos, documents, links, quizzes)
- User reviews and ratings
- Detailed schedules with virtual meeting support
- Certificate definitions with criteria
- Learning outcomes and prerequisites
- Multi-language support

### AIPrediction Model (MongoDB)
- Detailed AI prediction data storage
- Job matching with skill analysis
- Skill gap analysis with learning paths
- Career path recommendations
- Salary predictions with factors
- Model performance tracking
- User feedback collection

### GroupActivity Model (MongoDB)
- Social features for groups
- Multiple activity types (posts, discussions, events, polls, resources, announcements)
- Rich media attachments
- Event management with virtual support
- Polling system
- Engagement metrics (likes, views, shares)
- Comment system with replies
- Moderation features

### Analytics Model (MongoDB)
- Comprehensive analytics tracking
- User behavior analytics
- Job performance metrics
- Skill demand/supply analysis
- Training effectiveness tracking
- Group engagement metrics
- System performance monitoring
- AI model performance tracking
- Geographic analytics

## Key Features

### Hybrid Database Architecture
- **PostgreSQL (Prisma)**: Structured data, relationships, transactions
- **MongoDB**: Unstructured data, file storage, analytics, social features

### Enhanced User Experience
- Rich profile management with file uploads
- Comprehensive job posting with detailed requirements
- Training platform with materials and schedules
- Social networking through groups
- AI-powered recommendations
- Comprehensive analytics

### Scalability Features
- Efficient indexing on both databases
- Separation of concerns between structured and unstructured data
- Support for large file uploads
- Real-time analytics capabilities

## Migration Notes

1. **Database Migration**: Run `npx prisma migrate dev` to apply schema changes
2. **MongoDB Setup**: Ensure MongoDB connection is configured
3. **File Storage**: Configure file upload storage (local/cloud)
4. **Indexes**: MongoDB indexes are automatically created for performance
5. **Data Validation**: Both Prisma and Mongoose provide data validation

## Next Steps

1. Create database migrations
2. Update API endpoints to use new models
3. Implement file upload functionality
4. Create AI prediction services
5. Build analytics dashboard
6. Implement notification system
7. Add group social features
8. Create training management system
