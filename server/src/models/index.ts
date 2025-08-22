// MongoDB Models
export { CvDocument } from './cvDocument.model';
export { UserFile } from './userFile.model';
export { Training } from './training.model';
export { AIPrediction } from './aiPrediction.model';
export { GroupActivity } from './groupActivity.model';
export { Analytics } from './analytics.model';

// Model types for TypeScript
export interface ICvDocument {
  userId: string;
  profileId: string;
  originalFileName?: string;
  storedFileName?: string;
  fileUrl?: string;
  mimeType?: string;
  text?: string;
  keywords?: string[];
  embedding?: number[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserFile {
  userId: string;
  fileType: 'cv' | 'profile_pic' | 'document' | 'certificate' | 'id_card';
  originalName: string;
  storedName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
    pages?: number;
  };
  isActive?: boolean;
  tags?: string[];
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITraining {
  trainingId: string;
  logo?: string;
  trainingTitle: string;
  trainingCompany: string;
  ratings?: number;
  startDate: Date;
  duration: string;
  skills?: string[];
  description?: string;
  price?: number;
  isActive?: boolean;
  maxParticipants?: number;
  currentParticipants?: number;
  materials?: Array<{
    title: string;
    type: 'video' | 'document' | 'link' | 'quiz';
    url: string;
    duration?: number;
    isRequired?: boolean;
  }>;
  reviews?: Array<{
    userId: string;
    rating: number;
    comment?: string;
    createdAt?: Date;
  }>;
  schedule?: Array<{
    date: Date;
    time: string;
    topic: string;
    instructor: string;
    isVirtual?: boolean;
    meetingLink?: string;
  }>;
  certificates?: Array<{
    name: string;
    description?: string;
    criteria?: string;
  }>;
  tags?: string[];
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  language?: string;
  prerequisites?: string[];
  learningOutcomes?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAIPrediction {
  predictionId: string;
  userId: string;
  predictionType: 'job_match' | 'skill_gap' | 'career_path' | 'salary_prediction' | 'job_recommendation' | 'skill_recommendation';
  confidence?: number;
  isActive?: boolean;
  expiresAt?: Date;
  data: {
    jobMatches?: Array<{
      jobId: string;
      jobTitle: string;
      companyName: string;
      matchScore: number;
      reasons: string[];
      skillsMatched: string[];
      skillsMissing: string[];
    }>;
    skillGaps?: Array<{
      skillName: string;
      currentLevel: string;
      recommendedLevel: string;
      importance: number;
      learningPath: string[];
      estimatedTime: string;
    }>;
    careerPaths?: Array<{
      title: string;
      description: string;
      steps: Array<{
        step: number;
        action: string;
        timeline: string;
        resources: string[];
      }>;
      probability: number;
    }>;
    salaryPrediction?: {
      currentSalary: number;
      predictedSalary: number;
      factors: string[];
      confidence: number;
    };
    recommendations?: Array<{
      type: string;
      title: string;
      description: string;
      priority: number;
      actionItems: string[];
    }>;
  };
  modelVersion?: string;
  modelName?: string;
  inputFeatures?: string[];
  processingTime?: number;
  feedback?: {
    isHelpful?: boolean;
    rating?: number;
    comment?: string;
    createdAt?: Date;
  };
  views?: number;
  actions?: Array<{
    action: string;
    timestamp?: Date;
    details?: any;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IGroupActivity {
  groupId: string;
  authorId: string;
  type: 'post' | 'discussion' | 'event' | 'poll' | 'resource' | 'announcement';
  title: string;
  content?: string;
  tags?: string[];
  attachments?: Array<{
    type: 'file' | 'image' | 'video' | 'link';
    url: string;
    name: string;
    size?: number;
  }>;
  event?: {
    startDate: Date;
    endDate: Date;
    location: string;
    isVirtual?: boolean;
    meetingLink?: string;
    attendees?: string[];
    maxAttendees?: number;
  };
  poll?: {
    question: string;
    options: Array<{
      text: string;
      votes: string[];
    }>;
    endDate: Date;
    isMultipleChoice?: boolean;
  };
  resource?: {
    category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime?: string;
    prerequisites?: string[];
  };
  likes?: string[];
  dislikes?: string[];
  views?: number;
  shares?: number;
  comments?: Array<{
    id: string;
    authorId: string;
    content: string;
    likes?: string[];
    createdAt?: Date;
    replies?: Array<{
      id: string;
      authorId: string;
      content: string;
      likes?: string[];
      createdAt?: Date;
    }>;
  }>;
  isPinned?: boolean;
  isLocked?: boolean;
  isDeleted?: boolean;
  moderationStatus?: 'pending' | 'approved' | 'rejected' | 'flagged';
  moderationNotes?: string;
  engagementScore?: number;
  trendingScore?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
