import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { requireAuth, requireRole } from '../middlewares/auth';
import { prisma } from '../config/db';
import { CvDocument } from '../models/cvDocument.model';
import { UPLOADS_DIR, buildStoredFilename, ensureUploadsDir } from '../utils/storage';

ensureUploadsDir();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => cb(null, buildStoredFilename('file', file.originalname)),
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

const router = Router();

// Upload profile picture (youth)
router.post('/profile-picture', requireAuth, requireRole(['youth']), upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const url = `/uploads/${req.file.filename}`;
  const updated = await prisma.youthProfile.update({ where: { userId: req.auth!.userId }, data: { profilePictureUrl: url } });
  res.status(201).json({ url, profile: updated });
});

// Upload CV file (youth)
router.post('/cv', requireAuth, requireRole(['youth']), upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const profile = await prisma.youthProfile.findUnique({ where: { userId: req.auth!.userId } });
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  const fileUrl = `/uploads/${req.file.filename}`;
  const doc = await CvDocument.create({
    userId: req.auth!.userId,
    profileId: profile.id,
    originalFileName: req.file.originalname,
    storedFileName: req.file.filename,
    fileUrl,
    mimeType: req.file.mimetype,
  });
  res.status(201).json({ id: doc._id, fileUrl });
});

export default router;


