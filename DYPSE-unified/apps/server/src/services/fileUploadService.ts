import multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { Request } from 'express';

// File upload configuration
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const fileName = `${file.fieldname}-${uniqueSuffix}${extension}`;
    cb(null, fileName);
  }
});

// File filter for allowed file types
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed. Only PDF, images, and Office documents are accepted.`));
  }
};

// Configure multer
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB default
    files: 5 // Maximum 5 files per request
  }
});

// Specific upload configurations for different document types
export const uploadCV = upload.single('cv');
export const uploadCertificate = upload.single('certificate');
export const uploadBusinessEvidence = upload.single('business_evidence');
export const uploadStartupProof = upload.single('startup_proof');

// Multiple file upload for registration
export const uploadRegistrationFiles = upload.fields([
  { name: 'cv', maxCount: 1 },
  { name: 'certificate', maxCount: 3 },
  { name: 'business_evidence', maxCount: 5 },
  { name: 'startup_proof', maxCount: 3 }
]);

// File upload service interface
interface UploadedFile {
  fileName: string;
  filePath: string;
  originalName: string;
  mimeType: string;
  size: number;
}

// Upload file function
export const uploadFile = async (
  file: Express.Multer.File,
  documentType: string,
  userId: string,
  rwandaId: string
): Promise<UploadedFile> => {
  try {
    // Validate file
    if (!file) {
      throw new Error('No file provided');
    }

    // Create user-specific directory structure
    const userDir = path.join(process.env.UPLOAD_PATH || './uploads', userId, documentType);
    
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const fileName = `${documentType}-${uniqueSuffix}${extension}`;
    const filePath = path.join(userDir, fileName);

    // Move file to user directory
    fs.renameSync(file.path, filePath);

    return {
      fileName,
      filePath: filePath.replace(/\\/g, '/'), // Normalize path separators
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size
    };

  } catch (error) {
    console.error('File upload error:', error);
    throw new Error(`Failed to upload ${documentType}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Delete file function
export const deleteFile = async (filePath: string): Promise<boolean> => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('File deletion error:', error);
    return false;
  }
};

// Get file info function
export const getFileInfo = (filePath: string): { exists: boolean; size?: number; modified?: Date } => {
  try {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      return {
        exists: true,
        size: stats.size,
        modified: stats.mtime
      };
    }
    return { exists: false };
  } catch (error) {
    console.error('File info error:', error);
    return { exists: false };
  }
};

// Clean up orphaned files (for maintenance)
export const cleanupOrphanedFiles = async (): Promise<number> => {
  try {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    let deletedCount = 0;

    if (fs.existsSync(uploadPath)) {
      const files = fs.readdirSync(uploadPath);
      
      for (const file of files) {
        const filePath = path.join(uploadPath, file);
        const stats = fs.statSync(filePath);
        
        // Delete files older than 24 hours that are not in user directories
        if (stats.isFile() && Date.now() - stats.mtime.getTime() > 24 * 60 * 60 * 1000) {
          fs.unlinkSync(filePath);
          deletedCount++;
        }
      }
    }

    return deletedCount;
  } catch (error) {
    console.error('Cleanup error:', error);
    return 0;
  }
};
