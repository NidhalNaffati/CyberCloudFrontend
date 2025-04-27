/**
 * Stats for the admin dashboard
 * Matches the API response format of GET /api/admin/dashboard/stats
 * Note: According to API docs, this is a flexible format that will include
 * various statistics as needed by the dashboard
 */

export interface DashboardStats {
  userStats: UserStats;
  contentStats: ContentStats;
  engagementStats: EngagementStats;
  growthData: GrowthData;
  additionalProp1?: any;
  additionalProp2?: any;
  additionalProp3?: any;
}

export interface UserStats {
  totalUsers: number;
  bannedUsers: number;
  adminUsers: number;
  regularUsers: number;
  activeUsers?: number;
  newUsersToday?: number;
  usersTrend?: number;
}

export interface ContentStats {
  totalBuzzs: number;
  totalComments: number;
  totalReports: number;
  pendingReports: number;
  newBuzzsToday?: number;
  newCommentsToday?: number;
  contentTrend?: number;
}

export interface EngagementStats {
  totalLikes: number;
  averageCommentsPerBuzz: number;
  totalShares?: number;
  engagementRate?: number;
  engagementTrend?: number;
}

export interface GrowthData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
  usersOverTime: { [key: string]: number };
  buzzsOverTime: { [key: string]: number };
  commentsOverTime: { [key: string]: number };
  likesOverTime: { [key: string]: number };
  reportsOverTime: { [key: string]: number };
}

export interface PlatformActivity {
  timestamps: string[];
  activities: {
    type: string;
    count: number;
  }[];
}