import { prisma } from '../config/db';

export interface KPIData {
  totalYouth: number;
  employedPercent: number;
  unemployedPercent: number;
  selfEmployedPercent: number;
  topDemandedSkills: Array<{ skill: string; demand: number }>;
  businessesStartedThisMonth: number;
  totalEmployers: number;
  totalJobsPosted: number;
  totalApplications: number;
}

export interface SkillGapData {
  skill: string;
  demand: number;
  supply: number;
  gap: number;
  gapPercentage: number;
}

export interface EmploymentTrendData {
  month: string;
  employed: number;
  unemployed: number;
  selfEmployed: number;
  total: number;
}

export interface LocationEmploymentData {
  location: string;
  totalYouth: number;
  employed: number;
  unemployed: number;
  selfEmployed: number;
  employmentRate: number;
  latitude?: number;
  longitude?: number;
}

export interface JobReadinessPrediction {
  profileId: string;
  firstName: string;
  lastName: string;
  readinessScore: number;
  confidence: number;
  recommendedSkills: string[];
  predictedEmploymentProbability: number;
}

export interface SkillDemandForecast {
  skill: string;
  currentDemand: number;
  predictedDemand: number;
  growthRate: number;
  confidence: number;
}

export class AnalyticsService {
  // Get comprehensive KPIs
  static async getKPIs(): Promise<KPIData> {
    const [
      totalYouth,
      employedCount,
      selfEmployedCount,
      businessesThisMonth,
      topSkills,
      totalEmployers,
      totalJobs,
      totalApplications
    ] = await Promise.all([
      prisma.youthProfile.count(),
      prisma.youthProfile.count({ where: { jobStatus: 'employed' } }),
      prisma.youthProfile.count({ where: { jobStatus: 'self_employed' } }),
      prisma.business.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      prisma.profileSkill.groupBy({
        by: ['skillId'],
        _count: { skillId: true },
        orderBy: { _count: { skillId: 'desc' } },
        take: 5
      }),
      prisma.employerProfile.count(),
      prisma.job.count(),
      prisma.application.count()
    ]);

    const unemployedCount = totalYouth - employedCount - selfEmployedCount;

    // Get skill names for top skills
    const skillIds = topSkills.map(s => s.skillId);
    const skills = await prisma.skill.findMany({
      where: { id: { in: skillIds } }
    });

    const topDemandedSkills = topSkills.map(ts => {
      const skill = skills.find(s => s.id === ts.skillId);
      return {
        skill: skill?.name || 'Unknown',
        demand: ts._count.skillId
      };
    });

    return {
      totalYouth,
      employedPercent: totalYouth > 0 ? Math.round((employedCount / totalYouth) * 1000) / 10 : 0,
      unemployedPercent: totalYouth > 0 ? Math.round((unemployedCount / totalYouth) * 1000) / 10 : 0,
      selfEmployedPercent: totalYouth > 0 ? Math.round((selfEmployedCount / totalYouth) * 1000) / 10 : 0,
      topDemandedSkills,
      businessesStartedThisMonth: businessesThisMonth,
      totalEmployers,
      totalJobsPosted: totalJobs,
      totalApplications
    };
  }

  // Get skill gap analysis
  static async getSkillGapAnalysis(): Promise<SkillGapData[]> {
    // Get skills with highest demand (from job postings)
    const jobSkills = await prisma.job.findMany({
      select: { requiredSkills: true }
    });

    const skillDemand: { [key: string]: number } = {};
    jobSkills.forEach(job => {
      if (job.requiredSkills) {
        const skills = job.requiredSkills as string[];
        skills.forEach(skill => {
          skillDemand[skill] = (skillDemand[skill] || 0) + 1;
        });
      }
    });

    // Get skills supply (from youth profiles)
    const profileSkills = await prisma.profileSkill.findMany({
      include: { skill: true }
    });

    const skillSupply: { [key: string]: number } = {};
    profileSkills.forEach(ps => {
      const skillName = ps.skill.name;
      skillSupply[skillName] = (skillSupply[skillName] || 0) + 1;
    });

    // Calculate gaps
    const allSkills = new Set([...Object.keys(skillDemand), ...Object.keys(skillSupply)]);
    const skillGaps: SkillGapData[] = [];

    allSkills.forEach(skill => {
      const demand = skillDemand[skill] || 0;
      const supply = skillSupply[skill] || 0;
      const gap = demand - supply;
      const gapPercentage = demand > 0 ? Math.round((gap / demand) * 100) : 0;

      skillGaps.push({
        skill,
        demand,
        supply,
        gap,
        gapPercentage
      });
    });

    return skillGaps
      .filter(sg => sg.demand > 0) // Only include skills with demand
      .sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap))
      .slice(0, 10); // Top 10 skills with biggest gaps
  }

  // Get employment trends over time
  static async getEmploymentTrends(months: number = 6): Promise<EmploymentTrendData[]> {
    const trends: EmploymentTrendData[] = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const [employed, unemployed, selfEmployed] = await Promise.all([
        prisma.youthProfile.count({
          where: {
            jobStatus: 'employed',
            updatedAt: { gte: startDate, lte: endDate }
          }
        }),
        prisma.youthProfile.count({
          where: {
            jobStatus: 'unemployed',
            updatedAt: { gte: startDate, lte: endDate }
          }
        }),
        prisma.youthProfile.count({
          where: {
            jobStatus: 'self_employed',
            updatedAt: { gte: startDate, lte: endDate }
          }
        })
      ]);

      trends.push({
        month: startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        employed,
        unemployed,
        selfEmployed,
        total: employed + unemployed + selfEmployed
      });
    }

    return trends;
  }

  // Get location-based employment data
  static async getLocationEmploymentData(): Promise<LocationEmploymentData[]> {
    const locations = await prisma.youthProfile.groupBy({
      by: ['city'],
      _count: { id: true },
      where: { city: { not: null } }
    });

    const locationData: LocationEmploymentData[] = [];

    for (const location of locations) {
      if (!location.city) continue;

      const [employed, unemployed, selfEmployed] = await Promise.all([
        prisma.youthProfile.count({
          where: { city: location.city, jobStatus: 'employed' }
        }),
        prisma.youthProfile.count({
          where: { city: location.city, jobStatus: 'unemployed' }
        }),
        prisma.youthProfile.count({
          where: { city: location.city, jobStatus: 'self_employed' }
        })
      ]);

      const total = location._count.id;
      const employmentRate = total > 0 ? Math.round((employed / total) * 100) : 0;

      locationData.push({
        location: location.city,
        totalYouth: total,
        employed,
        unemployed,
        selfEmployed,
        employmentRate
      });
    }

    return locationData.sort((a, b) => b.totalYouth - a.totalYouth);
  }

  // Calculate job readiness index for a youth profile
  static async calculateJobReadinessIndex(profileId: string): Promise<number> {
    const profile = await prisma.youthProfile.findUnique({
      where: { id: profileId },
      include: {
        skills: {
          include: { skill: true }
        },
        educations: true,
        experiences: true,
        businesses: true
      }
    });

    if (!profile) return 0;

    let score = 0;
    let maxScore = 0;

    // Skills assessment (40% weight)
    const skillsScore = profile.skills.reduce((acc, ps) => {
      const levelScore = ps.level === 'expert' ? 3 : ps.level === 'intermediate' ? 2 : 1;
      return acc + (levelScore * (ps.yearsExperience || 0));
    }, 0);
    score += Math.min(skillsScore * 2, 40);
    maxScore += 40;

    // Education assessment (25% weight)
    const educationScore = profile.educations.length * 5;
    score += Math.min(educationScore, 25);
    maxScore += 25;

    // Experience assessment (25% weight)
    const experienceScore = profile.experiences.length * 5;
    score += Math.min(experienceScore, 25);
    maxScore += 25;

    // Entrepreneurship assessment (10% weight)
    const businessScore = profile.businesses.length * 10;
    score += Math.min(businessScore, 10);
    maxScore += 10;

    return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  }

  // Get job readiness predictions for all youth
  static async getJobReadinessPredictions(): Promise<JobReadinessPrediction[]> {
    const profiles = await prisma.youthProfile.findMany({
      include: {
        skills: {
          include: { skill: true }
        }
      }
    });

    const predictions: JobReadinessPrediction[] = [];

    for (const profile of profiles) {
      const readinessScore = await this.calculateJobReadinessIndex(profile.id);
      
      // Get recommended skills based on current skills
      const currentSkills = profile.skills.map(ps => ps.skill.name);
      const recommendedSkills = this.getRecommendedSkills(currentSkills);

      // Calculate employment probability based on readiness score
      const employmentProbability = Math.min(readinessScore / 100, 0.95);

      predictions.push({
        profileId: profile.id,
        firstName: profile.firstName,
        lastName: profile.lastName,
        readinessScore,
        confidence: Math.min(readinessScore / 100, 0.9),
        recommendedSkills,
        predictedEmploymentProbability: employmentProbability
      });
    }

    return predictions.sort((a, b) => b.readinessScore - a.readinessScore);
  }

  // Get skill demand forecast
  static async getSkillDemandForecast(): Promise<SkillDemandForecast[]> {
    // Get historical skill demand data
    const skillDemands = await prisma.skillDemand.findMany({
      include: { skill: true },
      orderBy: { periodStart: 'desc' },
      take: 100
    });

    const skillForecasts: SkillDemandForecast[] = [];
    const skillGroups: { [key: string]: number[] } = {};

    // Group demand data by skill
    skillDemands.forEach(sd => {
      const skillName = sd.skill.name;
      if (!skillGroups[skillName]) {
        skillGroups[skillName] = [];
      }
      skillGroups[skillName].push(sd.demandCount);
    });

    // Calculate forecasts for each skill
    Object.entries(skillGroups).forEach(([skill, demands]) => {
      if (demands.length < 2) return;

      const currentDemand = demands[0];
      const previousDemand = demands[1];
      const growthRate = previousDemand > 0 ? ((currentDemand - previousDemand) / previousDemand) * 100 : 0;
      
      // Simple linear prediction
      const predictedDemand = Math.max(0, Math.round(currentDemand * (1 + growthRate / 100)));
      
      // Confidence based on data consistency
      const variance = this.calculateVariance(demands);
      const confidence = Math.max(0.1, Math.min(0.9, 1 - (variance / Math.max(...demands))));

      skillForecasts.push({
        skill,
        currentDemand,
        predictedDemand,
        growthRate: Math.round(growthRate * 100) / 100,
        confidence: Math.round(confidence * 100) / 100
      });
    });

    return skillForecasts
      .sort((a, b) => b.predictedDemand - a.predictedDemand)
      .slice(0, 10); // Top 10 predicted skills
  }

  // Helper method to get recommended skills
  private static getRecommendedSkills(currentSkills: string[]): string[] {
    const skillRecommendations: { [key: string]: string[] } = {
      'JavaScript': ['React', 'Node.js', 'TypeScript', 'MongoDB'],
      'Python': ['Django', 'Flask', 'Data Analysis', 'Machine Learning'],
      'React': ['TypeScript', 'Redux', 'Next.js', 'GraphQL'],
      'Java': ['Spring Boot', 'Microservices', 'Docker', 'Kubernetes'],
      'SQL': ['PostgreSQL', 'MongoDB', 'Redis', 'Data Modeling']
    };

    const recommendations: string[] = [];
    currentSkills.forEach(skill => {
      const relatedSkills = skillRecommendations[skill] || [];
      recommendations.push(...relatedSkills.filter(rs => !currentSkills.includes(rs)));
    });

    return [...new Set(recommendations)].slice(0, 5); // Remove duplicates and limit to 5
  }

  // Helper method to calculate variance
  private static calculateVariance(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  }
} 