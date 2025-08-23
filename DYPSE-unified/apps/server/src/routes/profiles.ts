import { Router } from 'express';
import { prisma } from '../config/db';
import { authenticateToken, requireYouth } from '../middlewares/auth';
import { z } from 'zod';
import { CvDocument } from '../models/cvDocument.model';
import { ProfilePicture } from '../models/profilePicture.model';

const router = Router();

router.get('/me', authenticateToken, requireYouth, async (req, res) => {
  const me = await prisma.youthProfile.findUnique({
    where: { userId: req.user!.userId },
    include: { educations: true, experiences: true, skills: { include: { skill: true } }, businesses: true },
  });
  if (!me) return res.json(null);
  
  // Attach latest profile picture URL if exists
  let profilePictureUrl: string | null = null;
  try {
    if (me.profilePicId) {
      const profilePic = await ProfilePicture.findById(me.profilePicId).lean();
      profilePictureUrl = profilePic?.fileUrl ?? null;
    }
  } catch {}
  
  // Attach latest CV url if exists
  let cvUrl: string | null = null;
  try {
    const latest = await CvDocument.findOne({ userId: req.user!.userId }).sort({ createdAt: -1 }).lean();
    cvUrl = latest?.fileUrl ?? null;
  } catch {}
  
  res.json({ ...me, profilePictureUrl, cvUrl });
});

const updateSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  dob: z.string().datetime().optional(),
  gender: z.string().optional(),
  // location fields
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  district: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  bio: z.string().optional(),
  jobStatus: z.enum(['unemployed', 'employed', 'self_employed']).optional(),
  phone: z.string().optional(),
});

router.put('/me', authenticateToken, requireYouth, async (req, res) => {
  const parse = updateSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const data = parse.data as any;
  const { phone, ...profileFields } = data;
  if (profileFields.dob) profileFields.dob = new Date(profileFields.dob);

  // If client passed a UI status (JOB_SEEKER/EMPLOYED/FREELANCER) via jobStatus mapping, set both enums
  if (data.jobStatus) {
    // data.jobStatus here came from UI: JOB_SEEKER | EMPLOYED | FREELANCER (we remap below for Prisma JobStatus too)
    const youthStatus = data.jobStatus === 'JOB_SEEKER' ? 'JOB_SEEKER' : data.jobStatus === 'EMPLOYED' ? 'EMPLOYED' : 'FREELANCER';
    profileFields.status = youthStatus as any;
  }

  const tx = await prisma.$transaction(async (tx) => {
    // Update youth profile
    const updatedProfile = await tx.youthProfile.update({ where: { userId: req.user!.userId }, data: profileFields });
    // Optionally update phone on User
    if (phone) {
      await tx.user.update({ where: { id: req.user!.userId }, data: { phone } });
    }
    return updatedProfile;
  });

  res.json(tx);
});

export default router;

const cvSchema = z.object({
  text: z.string().min(50),
  originalFileName: z.string().optional(),
  mimeType: z.string().optional(),
  keywords: z.array(z.string()).optional(),
});

router.post('/me/cv', authenticateToken, requireYouth, async (req, res) => {
  const profile = await prisma.youthProfile.findUnique({ where: { userId: req.user!.userId } });
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  const parse = cvSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const doc = await CvDocument.create({
    userId: req.user!.userId,
    profileId: profile.id,
    originalFileName: parse.data.originalFileName,
    mimeType: parse.data.mimeType,
    text: parse.data.text,
    keywords: parse.data.keywords ?? [],
  });
  res.status(201).json({ id: doc._id });
});

const upsertSkillSchema = z.object({ skillId: z.string(), level: z.enum(['beginner', 'intermediate', 'expert']), yearsExperience: z.number().int().min(0).max(60).optional() });

router.get('/me/skills', authenticateToken, requireYouth, async (req, res) => {
  const profile = await prisma.youthProfile.findUnique({ where: { userId: req.user!.userId }, include: { skills: { include: { skill: true } } } });
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  res.json(profile.skills);
});

router.post('/me/skills', authenticateToken, requireYouth, async (req, res) => {
  const parse = upsertSkillSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const profile = await prisma.youthProfile.findUnique({ where: { userId: req.user!.userId } });
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  const ps = await prisma.profileSkill.upsert({
    where: { profileId_skillId: { profileId: profile.id, skillId: parse.data.skillId } },
    create: { profileId: profile.id, skillId: parse.data.skillId, level: parse.data.level as any, yearsExperience: parse.data.yearsExperience ?? 0 },
    update: { level: parse.data.level as any, yearsExperience: parse.data.yearsExperience ?? 0 },
  });
  res.status(201).json(ps);
});

router.delete('/me/skills/:skillId', authenticateToken, requireYouth, async (req, res) => {
  const profile = await prisma.youthProfile.findUnique({ where: { userId: req.user!.userId } });
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  await prisma.profileSkill.delete({ where: { profileId_skillId: { profileId: profile.id, skillId: req.params.skillId } } });
  res.status(204).send();
});


