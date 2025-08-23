import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/auth';
import { AnalyticsService } from '../services/analytics.service';

const router = Router();

// Get comprehensive KPIs
router.get('/kpis', requireAuth, requireRole(['admin', 'employer']), async (_req, res) => {
  try {
    const kpis = await AnalyticsService.getKPIs();
    res.json(kpis);
  } catch (error) {
    console.error('Error fetching KPIs:', error);
    res.status(500).json({ error: 'Failed to fetch KPIs' });
  }
});

// Get skill gap analysis
router.get('/skill-gap', requireAuth, requireRole(['admin', 'employer']), async (_req, res) => {
  try {
    const skillGaps = await AnalyticsService.getSkillGapAnalysis();
    res.json(skillGaps);
  } catch (error) {
    console.error('Error fetching skill gap analysis:', error);
    res.status(500).json({ error: 'Failed to fetch skill gap analysis' });
  }
});

// Get employment trends
router.get('/employment-trends', requireAuth, requireRole(['admin', 'employer']), async (req, res) => {
  try {
    const months = parseInt(req.query.months as string) || 6;
    const trends = await AnalyticsService.getEmploymentTrends(months);
    res.json(trends);
  } catch (error) {
    console.error('Error fetching employment trends:', error);
    res.status(500).json({ error: 'Failed to fetch employment trends' });
  }
});

// Get location-based employment data
router.get('/location-employment', requireAuth, requireRole(['admin', 'employer']), async (_req, res) => {
  try {
    const locationData = await AnalyticsService.getLocationEmploymentData();
    res.json(locationData);
  } catch (error) {
    console.error('Error fetching location employment data:', error);
    res.status(500).json({ error: 'Failed to fetch location employment data' });
  }
});

// Get job readiness predictions
router.get('/job-readiness-predictions', requireAuth, requireRole(['admin', 'employer']), async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const predictions = await AnalyticsService.getJobReadinessPredictions();
    res.json(predictions.slice(0, limit));
  } catch (error) {
    console.error('Error fetching job readiness predictions:', error);
    res.status(500).json({ error: 'Failed to fetch job readiness predictions' });
  }
});

// Get skill demand forecast
router.get('/skill-demand-forecast', requireAuth, requireRole(['admin', 'employer']), async (_req, res) => {
  try {
    const forecast = await AnalyticsService.getSkillDemandForecast();
    res.json(forecast);
  } catch (error) {
    console.error('Error fetching skill demand forecast:', error);
    res.status(500).json({ error: 'Failed to fetch skill demand forecast' });
  }
});

// Calculate job readiness index for a specific profile
router.get('/job-readiness/:profileId', requireAuth, requireRole(['admin', 'employer', 'youth']), async (req, res) => {
  try {
    const { profileId } = req.params;
    const readinessScore = await AnalyticsService.calculateJobReadinessIndex(profileId);
    res.json({ profileId, readinessScore });
  } catch (error) {
    console.error('Error calculating job readiness index:', error);
    res.status(500).json({ error: 'Failed to calculate job readiness index' });
  }
});

// Get comprehensive analytics dashboard data
router.get('/dashboard', requireAuth, requireRole(['admin', 'employer']), async (_req, res) => {
  try {
    const [
      kpis,
      skillGaps,
      employmentTrends,
      locationData,
      jobReadinessPredictions,
      skillDemandForecast
    ] = await Promise.all([
      AnalyticsService.getKPIs(),
      AnalyticsService.getSkillGapAnalysis(),
      AnalyticsService.getEmploymentTrends(6),
      AnalyticsService.getLocationEmploymentData(),
      AnalyticsService.getJobReadinessPredictions(),
      AnalyticsService.getSkillDemandForecast()
    ]);

    res.json({
      kpis,
      skillGaps,
      employmentTrends,
      locationData,
      jobReadinessPredictions: jobReadinessPredictions.slice(0, 10),
      skillDemandForecast
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

export default router; 